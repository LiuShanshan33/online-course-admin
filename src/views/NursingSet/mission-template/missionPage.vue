<template>
  <div class="app-container">
    <div class="top-content">
      <span>{{ this.$route.query.content }}</span>
    </div>
  </div>
</template>

<script>
import { missionPage } from '@/api/columnBtn'

export default {
  data() {
    return {
    }
  }
}
</script>

