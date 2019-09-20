<template lang="pug">
  v-container
    v-row.sat-solver
      v-col(:cols="6")
        v-textarea(v-model="text" outlined label="命題邏輯")
        p.error--text {{ error }}
      v-col(:cols="6")
        p 共 {{ count }} 解, {{ variables.length }} 個變數
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
              span {{ answer}}
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
  variables: string[] = []
  error: string = ''
  facts: Set<string> = new Set([])
  fakes: Set<string> = new Set([])

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

  created() {
    this.subject.pipe(debounce(() => interval(1000))).subscribe(() => {
      this.flush()
    })
    this.update()
  }
  toggle(variable: string) {
    const clear = () => {
      this.facts.delete(variable)
      this.fakes.delete(variable)
      this.facts = new Set(Array.from(this.facts))
      this.fakes = new Set(Array.from(this.fakes))
    }

    if (this.facts.has(variable)) {
      // was fact
      clear()
      this.fakes.add(variable)
    } else if (this.fakes.has(variable)) {
      // was fake
      clear()
    } else {
      // no bias
      clear()
      this.facts.add(variable)
    }
    this.flush()
  }

  @Watch('text')
  update() {
    this.subject.next()
  }
  flush() {
    window.localStorage.text = this.text
    try {
      const text = this.text + '\n' + Array.from(this.facts).join('\n')
      const cnf = toCNF(ast(text))
      const solutions = Array.from(solve(cnf))
      const result = solutions
        .map(solution => solution.getTrueVars())
        .map(vars => vars.join(', '))
      this.answers = result
      this.count = result.length
      if (solutions.length) {
        this.variables = Object.keys(solutions[0].getMap())
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
