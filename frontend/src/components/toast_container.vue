<script setup>
defineProps(['msg', 'data'])
</script>

<template>
<div class="p-2">
  <p class="m-0">{{ msg }}</p>
  <b v-if="data">{{ data.message }}</b><br>
  <i>Попробую ещё раз...</i>
</div>
</template>

<style scoped>

</style>