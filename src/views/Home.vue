<template lang="pug">
  sat-solver(:initial="text" :key="$route.path")
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SatSolver from '@/components/SatSolver.vue'

@Component({
  components: {
    SatSolver
  }
} as any)
export default class Home extends Vue {
  text: string = 'a implies b'
}
</script>
