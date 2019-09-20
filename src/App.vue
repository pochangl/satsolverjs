<template lang="pug">
  div(id="app")
    v-app
      v-toolbar
        v-toolbar-title Sat Solver
        v-spacer
        v-toolbar-items
          v-btn(
            v-for="(example, index) in examples"
            :key="index"
            router
            :to="{name: 'example', params: {id: index + 1}}"
            text
          ) {{ example.name }}

      v-container
        router-link(to="/") Home
        router-view
</template>
<script lang="ts">
import examples from '@/data/examples'

export default {
  data () {
    return {
      examples
    }
  }
}
console.log(examples)
</script>
