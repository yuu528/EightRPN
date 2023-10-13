<template>
  <v-container>
    <v-row class="text-caption">
      <v-col>{{ drgTable[drg] }}</v-col>
      <v-col>STACK: {{ lines.length }}</v-col>
    </v-row>
    <v-row class="text-h5" v-for="i in rows" no-gutters>
      <v-col cols="1">
        {{ rows - i + 1 }}:
      </v-col>
      <v-col class="text-end" cols="10">
        <p v-if="rows - i < lines.length">{{ lines[rows - i] }}</p>
        <p v-else>&nbsp;</p>
      </v-col>
      <!-- TODO: exponent
      <v-col class="pl-1" cols="1">
        <div class="text-caption text-end"></div>
        <div class="text-caption" style="line-height: 1em"></div>
      </v-col>
      -->
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: [
    'drg',
    'lines',
    'rows'
  ],
  data: () => ({
    drgTable: ['DEG', 'RAD', 'GRAD']
  })
}
</script>
