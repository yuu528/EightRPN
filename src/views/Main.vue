<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="12" lg="12" xl="3" xxl="2">
        <NumMon :drg="drg" :lines="lines" :rows="4" />
      </v-col>
      <v-col v-for="section in keys" cols="12" sm="8" md="6" lg="5" xl="3" xxl="2">
        <KeyPad class="pa-0" :keys="section" :callback="onKey" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import NumMon from '../components/NumMon.vue'
import KeyPad from '../components/KeyPad.vue'
</script>

<script>
import NumberStack from '../js/NumberStack'

export default {
  data: () => {
    let stack = new NumberStack()
    let lines = stack.lines

    let keys = [
      [
        [[''],    ['DRG'],  [''],    [''],    [''],     ['']],
        [['hyp'], ['sin'],  ['cos'], ['tan'], ['ln'],   ['log']],
        [['y^x'], ['SQRT'], ['x^2'], ['%'],   ['DROP'], ['X<>Y']],
      ],
      [
        [['7'], ['8'], ['9'],   ['E'], ['DEL']],
        [['4'], ['5'], ['6'],   ['*'], ['/']],
        [['1'], ['2'], ['3'],   ['+'], ['-']],
        [['.'], ['0'], ['+/-'], ['ENTER', 4]],
      ]
    ].map(
      section => section.map(
        keyRow => keyRow.map(
          key => key.length < 2 ? [key[0], 2] : key
        )
      )
    )

    return {
      stack: stack,
      lines: lines,
      drg: stack.drg,
      keys: keys
    }
  },
  methods: {
    onKey: function(key) {
      this.stack.onKey(key)
      this.lines = this.stack.lines
      this.drg = this.stack.drg
    },
    onPhysicalKey: function(e) {
      // キーボードのキーと対応させる
      let table = {
        Escape: 'DROP',
        Delete: 'DEL',
        Backspace: 'DEL',
        Enter: 'ENTER',
      }

      // 数字キー
      for(let i = 0; i < 10; i++) {
        table[i] = String(i)
      }

      // そのままのキー
      [
        '%', '+', '-', '*', '/', '.'
      ].forEach(key => {
        table[key] = key
      })

      if(e.key in table) {
        this.onKey(table[e.key])
      }
    }
  },
  created() {
    window.addEventListener('keydown', this.onPhysicalKey)
  }
}
</script>
