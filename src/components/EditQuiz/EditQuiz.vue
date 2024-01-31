<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import LeftPanel from "@/components/EditQuiz/LeftPanel.vue";
import GeneralOptions from "@/components/EditQuiz/GeneralOptions.vue";

let router = useRouter()

let quiz_data = ref({
  title: "Новый квиз",
  description: "",
  to_publish: false,
  questions: [],
  img: null
})

function newQuestion() {
  let index = quiz_data.value.questions.length
  let question = {
    index: index,
    title: "Вопрос №" + index,
    description: "",
    options: [],
    mode: 0
  }
  quiz_data.value.questions.push(question)
  router.replace({query: {question: index}})
}

function deleteQuestion(index) {
  quiz_data.value.questions.splice(index, 1)
  if (quiz_data.value.questions.length === 0) {
    router.replace({query: {general: 0}})
  } else if (router.currentRoute.value.query.question === index.toString()) {
    router.replace({query: {question: index - 1}})
  }
}
</script>

<template>
  <section class="container">
    <div class="hstack mt-2">
      <span class="fs-2 font-bold">{{ quiz_data.title }}</span>
      <button class="btn btn-dark ms-auto">Вернуться назад</button>
    </div>

    <div class="row my-4">
      <!-- Left Panel -->
      <div class="col-2">
        <left-panel :questions="quiz_data.questions" @newQuestion="newQuestion"/>
      </div>
      <!-- Main Panel -->
      <div class="col">
        <general-options :quiz_data="quiz_data" />
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>