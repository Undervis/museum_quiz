<script setup>
import {CircleProgressBar} from 'circle-progress.vue';

</script>

<template>
  <main class="position-fixed d-flex" style="z-index: 1000; height: 100vh; width: 100vw">
    <div class="bg-blur">
      <div class="card rounded-4 m-5">
        <div class="card-header py-3">
          <div class="hstack">
            <span class="fs-4">Статистика по викторине - </span>
            <button class="btn ms-auto btn-close"/>
          </div>
        </div>
        <div class="card-header d-flex flex-column gap-2">
          <div class="d-flex gap-2 flex-row justify-content-evenly">
            <div class="d-flex flex-row gap-2">
              <span>Количество ответов: </span>
              <span class="fw-bold">12</span>
            </div>
            <span class="vr my-auto"/>
            <div class="d-flex flex-row gap-2">
              <span>Средний процент правильных ответов: </span>
              <span class="fw-bold">40%</span>
            </div>
            <span class="vr my-auto"/>
            <div class="d-flex flex-row gap-2">
              <span>Средний балл: </span>
              <span class="fw-bold">34/83</span>
            </div>
            <span class="vr my-auto"/>
            <div class="d-flex flex-row gap-2">
              <span>Среднее время прохождения: </span>
              <span class="fw-bold">1:23</span>
            </div>
          </div>
        </div>
        <!--
        <div class="card-header d-flex">
          <div class="nav nav-pills mx-auto">
            <a class="nav-link rounded-pill active" href="#">Ответы</a>
            <a class="nav-link rounded-pill" href="#">Вопросы</a>
            <a class="nav-link rounded-pill" href="#">Неправильные ответы</a>
            <a class="nav-link rounded-pill" href="#">Пользователи</a>
          </div>
        </div>
        -->
        <div class="card-body">
          <div class="d-flex flex-column gap-2">
            <div v-for="item in 8" class="card">
              <div class="card-header p-2">
                <span class="fs-6">Вопрос №{{item}}</span>
              </div>
              <div class="card-body p-2">
                <span class="fs-6">Вопрос №{{item}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.nav-link.active {
  color: var(--bs-light);
  background-color: var(--bs-dark);
}

.nav-link {
  color: var(--bs-dark);
}
</style>