<template lang="pug">
  sat-solver(:text="text")
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SatSolver from '@/components/SatSolver.vue'

@Component({
  components: {
    SatSolver
  }
} as any)
export default class Home extends Vue {
  text: string = window.localStorage.text || ''
}
</script>
