export default class BigFloat {
  // 割り算で小数点以下何位まで計算するか
  private _divPrec: number
  private _significand: bigint
  private _base: number // <= 0

  constructor(num?: number | string | [bigint, number] | bigint | BigFloat) {
    this._divPrec = 10

    if (num == undefined) {
      this._significand = BigInt(0)
      this._base = 0
    } else {
      this.x = num
    }
  }

  // setters
  set x(num: number | string | bigint | [bigint, number] | BigFloat) {
    switch (typeof num) {
      case 'bigint':
        this._significand = num
        this._base = 0
        break

      case 'object':
        if (Array.isArray(num)) {
          this._significand = num[0]
          this._base = num[1]
        } else {
          this._significand = num.significand
          this._base = num.base
        }
        break

      default:
        let bigFloat: BigFloat = BigFloat.parse(num)
        this._significand = bigFloat.significand
        this._base = bigFloat.base
    }

    this.normalize()
  }

  set significand(num: number | bigint) {
    switch (typeof num) {
      case 'number':
        this._significand = BigInt(num)
        break

      case 'bigint':
        this._significand = num
        break
    }
  }

  set base(num: number) {
    this._base = num
  }

  // getters
  get str(): string {
    let str: string = this._significand.toString()

    if (this._base == 0) {
      return str
    } else {
      let pos: number = str.length + this._base

      if (pos <= 0) {
        return '0.' + str.slice(pos).padStart(-this._base, '0')
      } else {
        return str.slice(0, pos) + '.' + str.slice(pos)
      }
    }
  }

  get divPrec(): number {
    return this._divPrec
  }

  get significand(): bigint {
    return this._significand
  }

  get base(): number {
    return this._base
  }

  // arithmetic functions
  public add(num: number | string | bigint | [bigint, number] | BigFloat): void {
    this.x = BigFloat.add(this, num)
  }

  public sub(num: number | string | bigint | [bigint, number] | BigFloat): void {
    this.x = BigFloat.sub(this, num)
  }

  public mul(num: number | string | bigint | [bigint, number] | BigFloat): void {
    this.x = BigFloat.mul(this, num)
  }

  public div(num: number | string | bigint | [bigint, number] | BigFloat): void {
    this.x = BigFloat.div(this, num)
  }

  public square(): void {
    this.mul(this)
  }

  public sqrt(): void {
    this.x = BigFloat.sqrt(this)
  }

  public sin(): void {
    this.x = BigFloat.sin(this)
  }

  public cos(): void {
    this.x = BigFloat.cos(this)
  }

  public tan(): void {
    this.x = BigFloat.tan(this)
  }

  public log(): void {
    this.x = BigFloat.log(this)
  }

  public log10(): void {
    this.x = BigFloat.log10(this)
  }

  // other functions
  // 数字を追加
  public append(digit: number): void {
    this._significand = this._significand * 10n + BigInt(digit)

    if (this.base < 0) {
      this.base--
    }
  }

  // 数字を小数点以下に追加
  public appendDecimal(digit: number): void {
    if (this._base == 0) {
      this._significand = this._significand * 10n + BigInt(digit)
      this._base--
    } else {
      this.append(digit)
    }
  }

  // 数字を一桁削除
  public delete(): void {
    let str: string = this._significand.toString()
    let last: bigint = BigInt(str.slice(str.length - 1))

    this._significand = (this._significand - last) / 10n

    if (this._base < 0) {
      this._base++
    }
  }

  // ゼロを削除してbaseを増やす
  public normalize(): void {
    while (this._significand != 0n && this._base < 0 && this._significand % 10n == 0n) {
      this._significand = this._significand / 10n
      this._base++
    }
  }

  // static functions
  static add(
    num1: number | string | bigint | [bigint, number] | BigFloat,
    num2: number | string | bigint | [bigint, number] | BigFloat,
  ): BigFloat {
    let bigFloat1: BigFloat = BigFloat.parse(num1)
    let bigFloat2: BigFloat = BigFloat.parse(num2)
    let result: [bigint, number]

    if (bigFloat1.base == bigFloat2.base) {
      // 指数部が同じなら普通に計算
      result = [
        bigFloat1.significand + bigFloat2.significand,
        bigFloat1.base
      ]
    } else if (bigFloat1.base > bigFloat2.base) {
      // bigFloat1のほうが小数点以下の桁が多いようにする
      let tmp: BigFloat = bigFloat1
      bigFloat1 = bigFloat2
      bigFloat2 = tmp
    }

    // 指数部を合わせる
    let tmpSig: bigint = bigFloat2.significand * (10n ** BigInt(bigFloat2.base - bigFloat1.base))

    result = [
      bigFloat1.significand + tmpSig, bigFloat1.base
    ]

    return new BigFloat(result)
  }

  static sub(
    num1: number | string | bigint | [bigint, number] | BigFloat,
    num2: number | string | bigint | [bigint, number] | BigFloat,
  ): BigFloat {
    let bigFloat1: BigFloat = BigFloat.parse(num1)
    let bigFloat2: BigFloat = BigFloat.parse(num2)

    return BigFloat.add(bigFloat1, BigFloat.mul(bigFloat2, -1))
  }

  static mul(
    num1: number | string | bigint | [bigint, number] | BigFloat,
    num2: number | string | bigint | [bigint, number] | BigFloat,
  ): BigFloat {
    let bigFloat1: BigFloat = BigFloat.parse(num1)
    let bigFloat2: BigFloat = BigFloat.parse(num2)

    return new BigFloat([
      bigFloat1.significand * bigFloat2.significand,
      bigFloat1.base + bigFloat2.base
    ])
  }

  static div(
    num1: number | string | bigint | [bigint, number] | BigFloat,
    num2: number | string | bigint | [bigint, number] | BigFloat,
  ): BigFloat {
    let bigFloat1: BigFloat = BigFloat.parse(num1)
    let bigFloat2: BigFloat = BigFloat.parse(num2)

    // 小数点以下を計算するために桁を増やしておく
    let tmpSig = bigFloat1.significand * (10n ** BigInt(bigFloat1.divPrec))
    let tmpBase = bigFloat1.base - bigFloat1.divPrec

    return new BigFloat([
      tmpSig / bigFloat2.significand,
      tmpBase - bigFloat2.base
    ])
  }

  static sqrt(num: number | string | bigint | [bigint, number] | BigFloat): BigFloat {
    let tmpNum: number = BigFloat.parseFloat(num)

    return BigFloat.parse(Math.sqrt(tmpNum))
  }

  static sin(num: number | string | bigint | [bigint, number] | BigFloat): BigFloat {
    let tmpNum: number = BigFloat.parseFloat(num)

    return BigFloat.parse(Math.sin(tmpNum))
  }

  static cos(num: number | string | bigint | [bigint, number] | BigFloat): BigFloat {
    let tmpNum: number = BigFloat.parseFloat(num)

    return BigFloat.parse(Math.cos(tmpNum))
  }

  static tan(num: number | string | bigint | [bigint, number] | BigFloat): BigFloat {
    let tmpNum: number = BigFloat.parseFloat(num)

    return BigFloat.parse(Math.tan(tmpNum))
  }

  static log(num: number | string | bigint | [bigint, number] | BigFloat): BigFloat {
    let tmpNum: number = BigFloat.parseFloat(num)

    return BigFloat.parse(Math.log(tmpNum))
  }

  static log10(num: number | string | bigint | [bigint, number] | BigFloat): BigFloat {
    let tmpNum: number = BigFloat.parseFloat(num)

    return BigFloat.parse(Math.log10(tmpNum))
  }

  static parse(num: number | string | bigint | [bigint, number] | BigFloat): BigFloat {
    let count: number
    let result: [bigint, number]

    switch (typeof num) {
      case 'number':
        count = BigFloat.countDecimal(num)
        result = [
          BigInt(num) * (10n ** BigInt(count)),
          -count
        ]
        break

      case 'string':
        let strArr: string[] = num.split('.')

        count = strArr.length == 1 ? 0 : strArr[1].length
        result = [
          BigInt(strArr[0] + strArr[1]),
          -count
        ]
        break

      case 'bigint':
        result = [num, 0]
        break

      case 'object':
        if (Array.isArray(num)) {
          result = num
        } else {
          return num
        }
        break
    }

    return new BigFloat(result)
  }

  static parseFloat(num: number | string | bigint | [bigint, number] | BigFloat): number {
    switch (typeof num) {
      case 'number':
        return num

      default:
        let tmpNum: BigFloat = BigFloat.parse(num)

        return parseFloat(tmpNum.str)
    }
  }

  static countDecimal(num: number | string): number {
    let arr: string[]

    switch (typeof num) {
      case 'number':
        arr = String(num).split('.')
        break

      case 'string':
        arr = num.split('.')
        break
    }

    return arr.length == 1 ? 0 : arr[1].length
  }
}
