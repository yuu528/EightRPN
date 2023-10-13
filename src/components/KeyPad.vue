<template>
  <v-container>
    <v-row justify="center" v-for="keyrow in keys">
      <v-col class="pa-1" v-for="key in keyrow" :cols="key[1]">
        <div v-if="key[0] == ''"></div>
        <v-btn v-else class="text-none" @click.native="callback(key[0])" block>{{ key[0] }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: [
    'keys',
    'callback'
  ]
}
</script>
