<template lang="pug">
  v-container
    v-row.sat-solver
      v-col(:cols="6")
        v-textarea(v-model="text" outlined label="命題邏輯")
      v-col(:cols="6")
        p 共 {{ count }} 解, {{ keys.length }} 個變數
        p 變數: {{ keys.join(', ') }}
        v-list
          v-subheader 滿足解
          v-list-itemgroup
            v-list-item(:key="answer" v-for="(answer, index) in answers") 解{{index + 1}}: {{ answer}}
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { debounce } from 'rxjs/operators'
import { Observable, Subject, interval } from 'rxjs'

// logic
import { Logic, toCNF } from '@/utils/logic'
import { solve, toFact } from '@/utils/solver'
import { ast } from '@/utils/ast'

@Component({})
export default class Home extends Vue {
  subject = new Subject<void>()

  text: string = window.localStorage.text || ''
  answers: string[] = []
  count: number = 0
  keys: string[] = []
  error: string = ''
  facts: Set<string> = new Set([])

  created() {
    this.subject.pipe(debounce(() => interval(1000))).subscribe(() => {
      this.flush()
    })
    this.update()
  }
  toggle(variable: string) {
    if (this.facts.has(variable)) {
      this.facts.delete(variable)
    } else {
      this.facts.add(variable)
    }
    this.facts = new Set(Array.from(this.facts))
  }

  @Watch('text')
  update() {
    this.subject.next()
  }
  flush() {
    window.localStorage.text = this.text
    try {
      const cnf = toCNF(ast(this.text))
      const solutions = Array.from(solve(cnf))
      const result = solutions
        .map(solution => solution.getTrueVars())
        .map(toFact)
        .map(clause => clause.toString())
      this.answers = result
      this.count = result.length
      if (solutions.length) {
        this.keys = Object.keys(solutions[0].getMap())
      }
      this.error = ''
    } catch (err) {
      this.error = err.toString()
    }
  }
}
</script>
<style lang="stylus">
.sat-solver
  textarea
    height: 50vh
    font-size: 24px
    line-height: 36px!important
  .flex
    padding: 10px
</style>
