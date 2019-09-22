<template lang="pug">
  div(id="app")
    v-app
      v-toolbar.flex-grow-0
        v-toolbar-items
          v-btn(
            exact
            text
            router
            :to="{name: 'home'}"
          ) Sat Solver
        v-spacer
        v-toolbar-items
          v-btn(
            router
            :to="{name: 'grammar'}"
            text
          ) 文法表
          v-btn(
            v-for="(example, index) in examples"
            :key="index"
            router
            :to="{name: 'example', params: {id: index + 1}}"
            text
          ) {{ example.name }}
          v-btn(
            router
            href="https://medium.com/leep3/%E5%BE%9E-sat-solver-%E7%8E%A9-leetcode-37809cb61df"
            target="_blank"
            text
          )
            i.fab.fa-medium.fa-2x
          v-btn(
            router
            href="https://github.com/pochangl/satsolverjs"
            target="_blank"
            text
          )
            i.fab.fa-github.fa-2x
      v-container
        router-view
</template>
<script lang="ts">
import examples from '@/data/examples'

export default {
  data() {
    return {
      examples
    }
  }
}
</script>
