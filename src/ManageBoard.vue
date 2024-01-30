<script setup>

</script>

<template>
  <section class="container">
    <div class="hstack gap-4 my-4">
      <span class="fs-3">КВИЗЫ</span>
      <input type="search" class="form-control" placeholder="Поиск...">
      <div class="btn-group">
        <button type="button" class="btn btn-outline-dark text-nowrap">Добавить квиз</button>
        <button type="button" class="btn btn-outline-dark text-nowrap">Сохранить</button>
      </div>
      <router-link :to="{name:'EditQuiz'}"><button class="btn btn-dark ms-auto text-nowrap">Создать новый</button></router-link>
    </div>

    <section class="vstack gap-2 mb-4">
      <div v-for="quiz in 10" class="card">
        <div class="card-header hstack gap-2">
          <span class="fs-4">№{{ quiz }}</span>
          <span class="fs-4">Название квиза</span>
          <div class="btn-group ms-auto">
            <button type="button" class="btn btn-outline-dark border-0 text-nowrap">Изменить</button>
            <button type="button" class="btn btn-outline-danger border-0 text-nowrap">Удалить</button>
          </div>
        </div>
        <div class="card-body">
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's
            content.</p>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>

</style>