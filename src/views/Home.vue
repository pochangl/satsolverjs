<template lang="pug">
  v-container
    v-layout.sat-solver(row)
      v-flex.px-3(xs6)
        v-textarea(v-model="text" outlined label="命題邏輯")
      v-flex.px-3(xs6)
        v-textarea(v-model="answers" outlined label="滿足解")
        p count: {{ count }}
        p keys: {{ keys }}
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
  protected subject = new Subject<void>()

  protected text: string = window.localStorage.text || ''
  protected answers: string = ''
  protected count: number = 0
  protected keys: string[] = []

  public created() {
    this.subject.pipe(debounce(() => interval(1000))).subscribe(() => {
      this.flush()
    })
    this.update()
  }

  @Watch('text')
  protected update() {
    this.subject.next()
  }
  protected flush() {
    window.localStorage.text = this.text
    try {
      const tree = ast(this.text)
      const cnf = toCNF(tree)
      const solutions = Array.from(solve(cnf))
      const result = solutions
        .map(solution => solution.getTrueVars())
        .map(toFact)
        .map(clause => clause.toString())
      this.answers = result.join('\n\n')
      this.count = result.length
      if (solutions.length) {
        this.keys = Object.keys(solutions[0].getMap())
      }
    } catch (err) {
      console.log(err)
      // nothing here
    }
  }
}
</script>
<style lang="stylus">
.sat-solver
  textarea
    height: 80vh
    font-size: 24px
    line-height: 36px!important
</style>
