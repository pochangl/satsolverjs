<!--
  one line sat solver
  takes one line statement and output result
-->
<template lang="pug">
  v-container
    v-col.sat-solver-compact
      p.title {{ name }}
      v-text-field(v-model="text" outlined)
      p.error--text(v-if="error") {{ error }}
      v-list
        v-subheader 滿足解
        v-list-item-group
          v-list-item(:key="answer" v-for="(answer, index) in answers")
            span.mr-3 可能性{{index + 1}}:
            span(v-if="answer") {{ answer }}
            span(v-else) 全偽
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import SatSolver from './SatSolver.vue'

function validator(value: string) {
  return value.search('\n') < 0
}

@Component
export default class SatSolverCompact extends SatSolver {
  @Prop({ type: String, required: true, validator })
  initial: string

  @Prop({ type: String, required: true })
  name
}
</script>
