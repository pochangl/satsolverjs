<template lang="pug">
  v-container
    v-row.sat-solver
      v-col(:cols="6")
        v-textarea(v-model="text" label="命題邏輯" outlined counter)
        p.error--text {{ error }}
        v-container(v-if="choices")
          v-row(v-for="choice in choice_" :key="choice.name" justify="start")
            v-col.flex-grow-0 {{ choice.name }}:
            v-col.flex-grow-0(v-for="variable in choice.variables" :key="variable") {{ variable }}
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
import { contextmanager } from '@/utils/contextlib'

// logic
import { Logic, toCNF } from '@/utils/logic'
import { solve, toFact } from '@/utils/solver'
import { ast } from '@/utils/ast'

const ShowError = contextmanager<Home>((exec, vm: Home) => {
  try {
    exec()
  } catch (err) {
    vm.answers = []
    vm.error = err.toString()
    vm.variables = []
  }
})

const Flush = contextmanager<Home>((exec, vm: Home) => {
  exec()

  // flush variables
  vm.facts = new Set(Array.from(vm.facts))
  vm.fakes = new Set(Array.from(vm.fakes))

  // update vm
  vm.flush()
})

@Component({})
export default class Home extends Vue {
  @Prop({ type: String, required: true })
  initial: string
  @Prop({ required: false })
  choices: {
    [key: string]: string[]
  }

  text: string = ''
  subject = new Subject<void>()
  answers: string[] = []
  variables: string[] = []
  error: string = ''
  facts: Set<string> = new Set([])
  fakes: Set<string> = new Set([])

  @Flush
  created() {
    this.subject
      .pipe(debounce(() => interval(1000)))
      .subscribe(this.flush.bind(this))
    this.text = this.initial
  }

  @Watch('text')
  update() {
    this.subject.next()
  }

  @ShowError
  flush() {
    window.localStorage.text = this.text
    this.error = ''

    const cnf = toCNF(ast(this.text))

    // add facts
    Array.from(this.facts).map(cnf.addFact.bind(cnf))

    // add fakes
    Array.from(this.fakes).map(cnf.addFake.bind(cnf))

    // run sat solver
    const solutions = Array.from(solve(cnf))

    // update answers
    this.answers = solutions
      .map(solution => solution.getTrueVars())
      .map(vars => vars.join(', '))
      .sort()
    if (solutions.length) {
      this.variables = Object.keys(solutions[0].getMap()).sort()
    }
  }

  @Flush
  toggle(variable: string) {
    // state
    const fact = this.facts.has(variable)
    const fake = this.fakes.has(variable)

    // apply
    if (fact) this.addFake(variable)
    else if (!fake) this.addFact(variable)
    else this.flushPremises(variable)
  }

  addFake(variable: string) {
    this.flushPremises(variable)
    this.fakes.add(variable)
  }

  addFact(variable: string) {
    this.flushPremises(variable)
    this.facts.add(variable)
  }

  flushPremises (variable: string) {
    // cleanup
    this.facts.delete(variable)
    this.fakes.delete(variable)
  }

  getAttrs(variable: string) {
    const fact = this.facts.has(variable)
    const fake = this.fakes.has(variable)
    let color
    if (fact) color = 'blue lighten-2'
    else if (fake) color = 'red lighten-2'

    return {
      color,
      text: !fact && !fake, // text mode for unbiased variable
      dark: fact || fake // dark theme for fact and and fake
    }
  }

  get choice_(): Array<{ name: string; variables: string[] }> {
    return Object.keys(this.choices).map(name => ({
      name,
      variables: this.choices[name]
    }))
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
