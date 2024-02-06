<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import LeftPanel from "@/components/EditQuiz/LeftPanel.vue";
import GeneralOptions from "@/components/EditQuiz/GeneralOptions.vue";
import Question from "@/components/EditQuiz/Question.vue";

let router = useRouter()

let quiz_data = ref({
  title: "Новый квиз",
  description: "",
  to_publish: false,
  questions: [],
  img_preview: null,
  img_bg: null,
  quiz_view: 0, // 0 - Both, 1 - Magnezius, 2 - Museum
  quiz_type: 0, // 0 - Children, 1 - Adult
  requiredName: true
})

function newQuestion() {
  let index = quiz_data.value.questions.length
  let question = {
    index: index,
    title: "Вопрос №" + index,
    description: "",
    img: null,
    options: [],
    mode: 0 // 0 - One option, 1 - Many options, 2 - Img select, 3 - Puzzle
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

onMounted(() => {
  if (!router.currentRoute.value.query.general && !router.currentRoute.value.query.question) {
    router.replace({query: {general: 0}})
  }
})

const bgImg = ref()
</script>

<template>
  <img class="bg-img" ref="bgImg">
  <section class="container">
    <div class="hstack mt-2 card card-body">
      <span class="fs-2 font-bold">{{ quiz_data.title }}</span>
      <button class="btn btn-dark ms-auto">Вернуться назад</button>
    </div>

    <div class="row my-4">
      <!-- Left Panel -->
      <div class="col-3">
        <left-panel :questions="quiz_data.questions" @newQuestion="newQuestion"/>
      </div>
      <!-- Main Panel -->
      <div class="col">
        <general-options v-if="$router.currentRoute.value.query.general" :quiz_data="quiz_data" :bg="bgImg"/>
        <div v-if="$router.currentRoute.value.query.question && quiz_data.questions.length > 0">
          <question :question="quiz_data.questions[$router.currentRoute.value.query.question]" @deleteQuestion="deleteQuestion"/>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-img {
  top: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  position: fixed;
}
</style>