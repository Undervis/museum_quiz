<script setup>
function allowFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}
</script>

<template>
  <button @click="allowFullscreen"
          class="btn btn-lg m-4 btn-light rounded-circle position-fixed bottom-0" style="aspect-ratio: 1">
    <img src="/src/assets/icons/fullscreen.svg">
  </button>
  <router-view/>
</template>

<style scoped>

</style>
