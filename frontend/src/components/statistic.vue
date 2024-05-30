<script setup>
import {CircleProgressBar} from 'circle-progress.vue';
import axios from "axios";
import {inject, onMounted, ref} from "vue";
import Toast_container from "@/components/toast_container.vue";
import {useRouter} from "vue-router";
import {useToast} from "vue-toastification";
import LoaderBars from "@/components/loaderBars.vue";

const router = useRouter()
const toast = useToast()
const isLoading = ref(false)

const props = defineProps(['quiz_id'])
const api_url = inject('api_url')

const statistic = ref()
const quiz_data = ref()
const questions = ref()

function checkCorrect(option, question) {
  return option.isCorrect || question.answers.options.indexOf(option) === question.answers.correctOption.index
}

function calculateAnswers() {
  questions.value.forEach((question) => {
    question.answers.options.forEach((option) => {
      option.answers_count = 0
    })
  })
  statistic.value.forEach((stat_answer) => {
    for (let i = 0; i < stat_answer.answers.length; i++) {
      let question = questions.value.find(e => stat_answer.answers[i].question_id === e.settings.index)
      // TODO: Сопоставить ебливые ответы
    }
  })
}

function getStatistic() {
  isLoading.value = true
  axios.get(`${api_url}/get_statistics/${props.quiz_id}`)
      .then((response) => {
        statistic.value = response.data
        axios.get(`${api_url}/get_quiz/${props.quiz_id}`)
            .then((response) => {
              quiz_data.value = response.data
              questions.value = quiz_data.value.questions
              isLoading.value = false
              calculateAnswers()
            })
            .catch((error) => {
              let toast_content = {
                component: Toast_container,
                props: {
                  msg: "Ошибка при загрузке данных",
                  data: error
                }
              }
              toast.error(toast_content, {timeout: 10000, closeButton: false})
            })
      })
      .catch((error) => {
        console.log(error);
        let toast_content = {
          component: Toast_container,
          props: {
            msg: "Ошибка при загрузке данных",
            data: error
          }
        }
        toast.error(toast_content, {timeout: 10000, closeButton: false})
      })
}

onMounted(() => {
  getStatistic()
})
</script>

<template>
  <main class="position-fixed d-flex" style="z-index: 1000; height: 100vh; width: 100vw">
    <loader-bars v-if="isLoading"/>
    <div class="bg-blur">
      <div class="m-auto">
        <div class="card rounded-4 m-5">
          <div class="card-header py-3">
            <div class="hstack">
              <span class="fs-4 position-relative start-50" style="transform: translateX(-50%)">
                Статистика по викторине
              </span>
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
                <span class="fw-bold">34<span class="text-muted fw-normal">/83</span></span>
              </div>
              <span class="vr my-auto"/>
              <div class="d-flex flex-row gap-2">
                <span>Среднее время прохождения: </span>
                <span class="fw-bold">1:23</span>
              </div>
            </div>
          </div>
          <div class="card-header d-flex">
            <div class="nav nav-pills w-100 d-flex gap-2">
              <a class="nav-link d-inline-flex flex-grow-1 active" href="#">
                <span class="m-auto">Вопросы</span>
              </a>
              <a class="nav-link border d-inline-flex flex-grow-1" href="#">
                <span class="m-auto">Ответы</span>
              </a>
            </div>
          </div>
          <div class="card-body pe-1">
            <div class="d-flex pe-1 flex-column gap-2 overflow-y-scroll scroll-dark" style="max-height: 70vh">
              <div v-for="item in questions" class="card">
                <div class="card-header p-2">
                  <span class="fs-6">{{ item.settings.title }}</span>
                </div>
                <div class="card-body d-flex flex-column gap-2 p-2">
                  <div v-for="option in item.answers.options" class="w-100">
                    <div class="d-flex flex-column">
                      <span>
                        {{ option.text }} {{ option.answers_count }}
                        <span v-if="false" class="badge bg-success fw-normal p-1">✓</span>
                      </span>
                      <progress :class="{'correct': checkCorrect(option, item)}"
                                class="w-100" value="3" :max="quiz_data.answers_count"/>
                    </div>
                  </div>
                </div>
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

progress {
  accent-color: var(--bs-dark);
}

progress.correct {
  accent-color: var(--bs-success);
}
</style>