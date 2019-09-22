<template lang="pug">
  v-container
    p.display-1 文法表
    sat-solver(name="變數" initial="a")
    sat-solver(name="蘊涵 / a => b" initial="a implies b")
    sat-solver(name="若且唯若 / a <=> b " initial="a iff b")
    sat-solver(name="邏輯(與)" initial="a and b")
    sat-solver(name="邏輯(或)" initial="a or b")
    sat-solver(name="邏輯(非)" initial="not b")
    sat-solver(name="字函數" initial="a and (b or c)")
    sat-solver(name="至少一個" initial="at least 1 of { a, b, c }")
    sat-solver(name="最多一個" initial="at most 1 of { a, b, c }")
    sat-solver(name="只有一個" initial="only 1 of { a, b, c }")

</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import SatSolver from '@/components/SatSolverCompact.vue'

@Component({
  components: {
    SatSolver
  }
})
export default class Grammar extends Vue {}
</script>
