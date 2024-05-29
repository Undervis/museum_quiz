<script setup>
defineProps(['title', 'msg', 'theme'])
</script>

<template>
  <div class="position-fixed d-flex"
       style="z-index: 1000 !important; height: 100vh; width: 100vw">
    <div class="bg-blur" style="filter: brightness(80%)"></div>
    <section id="confirmModal" class="card rounded-4 m-auto overflow-hidden" :class="{'blur': theme === 'modern'}">
      <div class="card-body p-4">
        <h5>{{ title }}</h5>
        <span>{{ msg }}</span>
      </div>
      <div class="card-footer">
        <div class="btn-group w-100 py-2">
          <button @click="$emit('confirm')" style="filter: saturate(80%)"
                  class="btn flex-grow-1 btn-lg btn-danger">Да</button>
          <button @click="$emit('dismiss')" style="filter: saturate(80%)"
                  class="btn flex-grow-1 btn-lg btn-success ms-auto">Нет</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>