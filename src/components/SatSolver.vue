<template lang="pug">
  v-container
    v-row.sat-solver
      v-col(:cols="6")
        v-textarea(v-model="text" label="命題邏輯" outlined counter)
        p.error--text {{ error }}
      v-col(:cols="6")
        p 共 {{ answers.length }} 解, {{ variables.length }} 個變數
        v-layout.py-2(row justify-start align-center)
          v-flex.flex-grow-0(wrap) 變數:
          v-btn.mx-2.elevation-1(
            v-for="variable in variables"
            :key="variable"
            v-bind="getAttrs(variable)"
            @click="toggle(variable)"
          ) {{ variable }}
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
import { debounce } from 'rxjs/operators'
import { Observable, Subject, interval } from 'rxjs'

// logic
import { Logic, toCNF } from '@/utils/logic'
import { solve, toFact } from '@/utils/solver'
import { ast } from '@/utils/ast'

@Component({})
export default class Home extends Vue {
  @Prop({ type: String, required: true })
  initial: string

  text: string = ''
  subject = new Subject<void>()
  answers: string[] = []
  variables: string[] = []
  error: string = ''
  facts: Set<string> = new Set([])
  fakes: Set<string> = new Set([])

  created() {
    this.subject
      .pipe(debounce(() => interval(1000)))
      .subscribe(this.flush.bind(this))
    this.update()
  }

  @Watch('text')
  update() {
    this.subject.next()
  }

  @Watch('initial', { immediate: true })
  onInitial(to: string) {
    this.text = to
    this.flush()
  }

  flush() {
    window.localStorage.text = this.text
    this.error = ''

    try {
      const text = this.text + '\n' + Array.from(this.facts).join('\n')
      const cnf = toCNF(ast(text))
      const solutions = Array.from(solve(cnf))
      const result = solutions
        .map(solution => solution.getTrueVars())
        .map(vars => vars.join(', '))
      this.answers = result.sort()
      if (solutions.length) {
        this.variables = Object.keys(solutions[0].getMap())
      }
    } catch (err) {
      this.answers = []
      this.error = err.toString()
    }
  }

  toggle(variable: string) {
    // state
    const fact = this.facts.has(variable)
    const fake = this.fakes.has(variable)

    // cleanup
    this.facts.delete(variable)
    this.fakes.delete(variable)

    // flush
    this.facts = new Set(Array.from(this.facts))
    this.fakes = new Set(Array.from(this.fakes))

    // apply
    if (fact) this.fakes.add(variable)
    else if (!fake) this.facts.add(variable)
    this.flush()
  }

  getAttrs(variable: string) {
    if (this.facts.has(variable)) {
      return {
        color: 'blue lighten-2',
        text: false,
        dark: true
      }
    } else if (this.fakes.has(variable)) {
      return {
        color: 'red lighten-2',
        text: false,
        dark: true
      }
    } else {
      return {
        text: true
      }
    }
  }
}
</script>
<style lang="stylus">
.sat-solver
  textarea
    height: 700px
    font-size: 24px
    line-height: 36px!important
  .flex
    padding: 10px
</style>
