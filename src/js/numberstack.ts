import BigFloat from './bigfloat'

export default class NumberStack {
  private _stack: BigFloat[]
  private _drg: number
  private _dotPressed: boolean
  private _clearNext: boolean
  private _enterNext: boolean

  constructor() {
    this._stack = [new BigFloat()]
    this._drg = 0
    this._dotPressed = false
    this._clearNext = false
    this._enterNext = false
  }

  get lines(): string[] {
    return this._stack.map(num => num.str)
  }

  get drg(): number {
    return this._drg
  }

  public onKey(key: string): void {
    let keyInt = parseInt(key)

    if (isNaN(keyInt)) {
      switch (key) {
        // 2数の計算の場合
        case '%':
        case 'X<>Y':
        case '+':
        case '-':
        case '*':
        case '/':
          if (this._stack.length > 1) {
            switch (key) {
              case '%':
                this._stack[0].div(100)
                this._stack[0].mul(this._stack[1])
                break

              case 'X<>Y':
                let tmp: BigFloat = this._stack[0]
                this._stack[0] = this._stack[1]
                this._stack[1] = tmp
                break

              case '+':
                this._stack[1].add(this._stack[0])
                this._stack.shift()
                break

              case '-':
                this._stack[1].sub(this._stack[0])
                this._stack.shift()
                break

              case '*':
                this._stack[1].mul(this._stack[0])
                this._stack.shift()
                break

              case '/':
                this._stack[1].div(this._stack[0])
                this._stack.shift()
                break
            }

            this._enterNext = true
          }
          break

        default:
          switch (key) {
            case 'DRG':
              if (this._drg > 1) {
                this._drg = 0
              } else {
                this._drg++
              }
              break

            case 'x^2':
              this._stack[0].square()
              break

            case 'DROP':
              this._stack.shift()
              if (this._stack.length == 0) {
                this._stack.push(new BigFloat())
                this.clearNextFlags()
              } else {
                this._enterNext = true
              }
              break

            case 'DEL':
              if (this._enterNext) {
                this.clearNextFlags()
                this._stack[0].x = 0
              } else {
                this._stack[0].delete()
              }
              break

            case '.':
              if (this._clearNext) {
                this.clearNextFlags()
                this._stack[0].x = 0
              } else if (this._enterNext) {
                this.clearNextFlags()
                this._stack.unshift(new BigFloat())
              }
              this._dotPressed = true
              break

            case '+/-':
              this._stack[0].mul(-1)
              break

            case 'ENTER':
              this._stack.unshift(new BigFloat())
              this._stack[0].x = this._stack[1]
              this._clearNext = true
              break

            default:
              console.log('Not implemented: ' + key)
          }
      }
    } else {
      if (this._dotPressed) {
        this._dotPressed = false
        this._stack[0].appendDecimal(keyInt)
      } else {
        if (this._clearNext) {
          this.clearNextFlags()
          this._stack[0].x = keyInt
        } else if (this._enterNext) {
          this.clearNextFlags()
          this._stack.unshift(new BigFloat())
          this._stack[0].x = keyInt
        } else {
          this._stack[0].append(keyInt)
        }
      }
    }
  }

  private clearNextFlags(): void {
    this._clearNext = false
    this._enterNext = false
  }
}
