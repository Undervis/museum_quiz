<script setup>
import {reactive} from "vue";
import {useRouter} from "vue-router";
let router = useRouter()
let questions = reactive([])

function newQuestion() {
  let question = {
    index: questions.length + 1,
    title: "Вопрос №" + self.index,
    description: "",
    options: [],
    mode: 0
  }
  questions.push(question)
  router.replace({query: {question: question.index}})
}
</script>

<template>
  <section class="container">
    <div class="row">
      <div class="col-2">
        <div class="d-flex flex-column gap-2 my-4">
          <router-link :to="{query: {question: 0}}"
                       class="btn btn-outline-dark">Общие параметры
          </router-link>
          <router-link v-for="(q, index) in questions" :to="{query: {question: index + 1}}"
                       class="btn btn-outline-dark">{{ q.title }}
          </router-link>
          <button class="btn btn-outline-dark" @click="newQuestion">+</button>
        </div>
      </div>
      <div class="col"></div>
    </div>
  </section>
</template>

<style scoped>

</style>