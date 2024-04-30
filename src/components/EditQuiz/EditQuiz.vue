<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import LeftPanel from "@/components/EditQuiz/LeftPanel.vue";
import GeneralOptions from "@/components/EditQuiz/GeneralOptions.vue";
import Question from "@/components/EditQuiz/Question.vue";

let router = useRouter()

let quiz_data = ref({
  title: "Новая викторина",
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
    settings: {
      index: index,
      title: "Вопрос №" + index,
      visible: true,
      text: "",
      addScoresPerAnswer: 1,
      mode: 0, // 0 - One option, 1 - Many options, 2 - Img select, 3 - Puzzle
      previewImg: null,
      scoreMode: 0 // 0 - Only all correct, 1 - For every correct
    },
    answers: {
      options: [],
      imgOptions: [],
      correctOption: {
        index: 0,
        type: 0 // 0 - One option, 1 - Img
      }
    }
  }
  quiz_data.value.questions.push(question)
  router.replace({hash: '#question-' + index})
}

function deleteQuestion(index) {
  quiz_data.value.questions.splice(index, 1)
  if (quiz_data.value.questions.length === 0) {
    router.replace({hash: '#general'})
  } else if (router.currentRoute.value.hash === '#question-' + index) {
    router.replace({hash: '#question-' + (index - 1)})
  }
}

onMounted(() => {
  if (!router.currentRoute.value.hash) {
    router.replace({hash: '#general'})
  }
})

const bgImg = ref()
</script>

<template>
  <img class="bg-img" ref="bgImg">
  <section class="container">
    <div class="hstack mt-2 card card-body rounded-4">
      <span class="fs-2 font-bold">{{ quiz_data.title }}</span>
      <button class="btn btn-dark ms-auto">Вернуться назад</button>
    </div>

    <div class="row my-4 gap-2">
      <!-- Left Panel -->
      <div class="col-12 col-lg-3 col-sm-12">
        <left-panel :questions="quiz_data.questions" @newQuestion="newQuestion"/>
      </div>
      <!-- Main Panel -->
      <div class="col">
        <section class="d-flex flex-column gap-4">
          <general-options id="general" :quiz_data="quiz_data" :bg="bgImg"/>
          <hr v-if="quiz_data.questions.length > 0">
          <div v-for="q in quiz_data.questions">
            <question :id="'question-' + q.settings.index" :question="q"
                      @deleteQuestion="deleteQuestion(q.settings.index)"/>
          </div>
        </section>
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