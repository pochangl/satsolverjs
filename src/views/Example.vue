<template lang="pug">
  sat-solver(:initial="text" :key="$router.path")
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SatSolver from '@/components/SatSolver.vue'
import examples from '@/data/examples'

@Component({
  components: {
    SatSolver
  }
} as any)
export default class Home extends Vue {
  get example() {
    const index: number = Number(this.$route.params.id) - 1
    return examples[index]
  }
  get text() {
    return this.example.text
  }
}
</script>
