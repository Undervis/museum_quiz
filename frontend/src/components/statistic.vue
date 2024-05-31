<script setup>
import {CircleProgressBar} from 'circle-progress.vue';
import axios from "axios";
import {inject, onMounted, ref, watch} from "vue";
import Toast_container from "@/components/toast_container.vue";
import {useRouter} from "vue-router";
import {useToast} from "vue-toastification";
import LoaderBars from "@/components/loaderBars.vue";

const router = useRouter()
const toast = useToast()
const isLoading = ref(false)

const dateFilter = ref({
  startDate: null, endDate: null
})

const props = defineProps(['quiz_id'])
const api_url = inject('api_url')

const tab = ref(0)
const statistic = ref()
const statistic_filtered = ref()
const quiz_data = ref()
const questions = ref()

function checkCorrect(option, question) {
  if (question.settings.mode === 0) {
    return question.answers.options.indexOf(option) === question.answers.correctOption.index
  } else if (question.settings.mode === 1) {
    return option.isCorrect
  } else if (question.settings.mode === 2) {
    return question.answers.imgOptions.indexOf(option) === question.answers.correctOption.index
  }
}

function calcPercentage(value, max) {
  return Math.round(value / max * 100)
}

function convertTimer(time_in_seconds) {
  /*
  Перевод секунд в минуты и секунды
  @time_in_seconds: Время в секундах
  */
  let minutes = Math.floor((time_in_seconds % 3600) / 60)
  let seconds = time_in_seconds % 60
  return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}

function calculateAnswers() {
  questions.value.forEach((question) => {
    question.answers.options.forEach((option) => {
      option.answers_count = 0
    })
    question.answers.imgOptions.forEach((option) => {
      option.answers_count = 0
    })
    question.answers.answers_count = 0
  })
  statistic_filtered.value.forEach((stat_answer) => {
    for (let i = 0; i < stat_answer.answers.length; i++) {
      let question = questions.value.find(e => stat_answer.answers[i].question_id === e.settings.index)
      try {
        question.answers.options[stat_answer.answers[i].answer].answers_count++
      } catch (e) {
      }
      try {
        for (let j = 0; j < stat_answer.answers[i].answers_checked.length; j++) {
          question.answers.options.find(e => e.text === stat_answer.answers[i].answers_checked[j].text).answers_count++
        }
      } catch (e) {
      }
      try {
        question.answers.imgOptions[stat_answer.answers[i].answer].answers_count++
      } catch (e) {
      }
      if (stat_answer.answers[i].answer !== null || stat_answer.answers[i].answers_checked.length > 0) {
        question.answers.answers_count++
      }
    }
  })
}

function calculateStats() {
  let rate_data = []
  let score_data = []
  let maxScore_data = []

  let time_min = 3600
  let time_max = 0
  let time_data = []

  statistic_filtered.value.forEach(item => {
    rate_data.push(calcPercentage(item.corrects_count, item.questions_count))
    score_data.push(item.score)
    maxScore_data.push(item.max_score)
    if (item.timer < time_min) {
      time_min = item.timer
    }
    if (item.timer > time_max) {
      time_max = item.timer
    }
    time_data.push(item.timer)
  })
  quiz_data.value.average_rate = Math.round(rate_data.reduce((a, b) => a + b, 0) / rate_data.length)
  quiz_data.value.average_score = Math.round(score_data.reduce((a, b) => a + b, 0) / score_data.length)
  quiz_data.value.max_score = Math.round(maxScore_data.reduce((a, b) => a + b, 0) / maxScore_data.length)
  quiz_data.value.time_min = convertTimer(time_min)
  quiz_data.value.time_max = convertTimer(time_max)
  quiz_data.value.time_average = convertTimer(Math.round(time_data.reduce((a, b) => a + b, 0) / time_data.length))
}

function getStatistic() {
  isLoading.value = true
  axios.get(`${api_url}/get_statistics/${props.quiz_id}`)
      .then((response) => {
        statistic.value = response.data
        statistic_filtered.value = statistic.value
        axios.get(`${api_url}/get_quiz/${props.quiz_id}`)
            .then((response) => {
              quiz_data.value = response.data
              questions.value = quiz_data.value.questions
              isLoading.value = false
              calculateAnswers()
              calculateStats()
            })
            .catch((error) => {
              console.error(error)
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

function filterData() {
  if (!dateFilter.value.startDate && !dateFilter.value.endDate) {
    statistic_filtered.value = statistic.value
    return
  }
  statistic_filtered.value = statistic.value
  statistic_filtered.value = statistic_filtered.value.filter(item => {
    let dateStart = dateFilter.value.startDate ? new Date(dateFilter.value.startDate).getTime() : null
    let dateEnd = dateFilter.value.endDate ? new Date(dateFilter.value.endDate).getTime() : null
    let datestamp = new Date(item.datestamp).getTime()
    if (dateStart && dateEnd) {
      return datestamp >= dateStart && datestamp <= dateEnd
    } else if (dateStart) {
      return datestamp >= dateStart
    } else if (dateEnd) {
      return datestamp <= dateEnd
    } else {
      return true
    }
  })
}

watch(dateFilter, () => {
  filterData()
  calculateAnswers()
  calculateStats()
}, {deep: true})

onMounted(() => {
  getStatistic()
})
</script>

<template>
  <main class="position-fixed d-flex" style="z-index: 1000; height: 100vh; width: 100vw">
    <loader-bars v-if="isLoading"/>
    <div class="bg-blur">
      <div v-if="quiz_data" class="m-auto container">
        <div class="card rounded-4 my-5">
          <div class="card-header py-3">
            <div class="hstack">
              <form class="d-flex flex-row gap-2" @submit.prevent>
                <span class="fs-4 text-nowrap">
                Статистика по викторине
              </span>
                <div class="input-group" title="Начало периода фильтра">
                  <label class="input-group-text">НП</label>
                  <input class="form-control" type="date" v-model="dateFilter.startDate">
                </div>
                <div class="input-group" title="Конец периода фильтра">
                  <label class="input-group-text">КП</label>
                  <input class="form-control" type="date" v-model="dateFilter.endDate">
                </div>
                <button @click="dateFilter.startDate = null; dateFilter.endDate = null" class="btn btn-outline-dark">
                  Сбросить
                </button>
              </form>

              <button @click="$emit('dismiss')" class="btn ms-auto btn-close"/>
            </div>
          </div>
          <div class="card-header">
            <div class="d-flex gap-2 flex-row justify-content-between">
              <div class="d-flex flex-row gap-2">
                <span>Количество ответов: </span>
                <span class="fw-bold">{{ statistic_filtered.length }}</span>
              </div>
              <span class="vr my-auto"/>
              <div class="d-flex flex-row gap-2">
                <span>Средний процент правильных ответов: </span>
                <span class="fw-bold">{{ quiz_data.average_rate }}%</span>
              </div>
              <span class="vr my-auto"/>
              <div class="d-flex flex-row gap-2">
                <span>Средний балл: </span>
                <span class="fw-bold">{{ quiz_data.average_score }}<span
                    class="text-muted fw-normal">/{{ quiz_data.max_score }}</span></span>
              </div>
              <span class="vr my-auto"/>
              <div class="d-flex flex-row gap-2">
                <span>Время прохождения: </span>
                <span>Мин: <b>{{ quiz_data.time_min }}</b> / Ср: <b>{{ quiz_data.time_average }}</b> / Макс: <b>{{
                    quiz_data.time_max
                  }}</b></span>
              </div>
            </div>
          </div>
          <div class="card-header d-flex">
            <div class="nav nav-pills w-100 d-flex gap-2">
              <a class="nav-link p-1 border border-dark d-inline-flex flex-grow-1"
                 @click="tab = 0"
                 :class="{'active': tab === 0}" href="#">
                <span class="m-auto">Вопросы</span>
              </a>
              <a class="nav-link p-1 border border-dark d-inline-flex flex-grow-1"
                 @click="tab = 1"
                 :class="{'active': tab === 1}" href="#">
                <span class="m-auto">Ответы</span>
              </a>
            </div>
          </div>
          <div class="card-body py-0 pe-1">
            <div class="d-flex py-3 pe-1 flex-column gap-4 overflow-y-scroll scroll-dark" style="max-height: 70vh">
              <div v-if="tab === 0" v-for="item in questions" class="card rounded-3 border-secondary">
                <div class="card-header hstack p-2">
                  <span class="fs-6">{{ item.settings.title }}</span>
                  <span class="ms-auto d-flex gap-2 flex-row">
                    <span>Кол-во ответов: <b>{{ item.answers.answers_count }}</b></span>
                    <span class="vr h-75 m-auto"/>
                    <span>Пропусков: <b>{{ statistic_filtered.length - item.answers.answers_count }}</b></span>
                  </span>
                </div>
                <div v-if="item.settings.text" class="card-header p-2 description" v-html="item.settings.text"></div>
                <div class="card-body d-flex flex-column gap-2 p-2">
                  <div v-for="option in item.answers.options" class="w-100">
                    <div v-if="item.settings.mode === 0 || item.settings.mode === 1" class="d-flex flex-column">
                      <span class="hstack">
                        <span :class="checkCorrect(option, item) ? 'correct': 'not-correct'">{{ option.text }}</span>
                        <span
                            class="text-muted position-absolute w-25 start-50 end-50 fw-normal">
                            {{ calcPercentage(option.answers_count, item.answers.answers_count) }}%
                        </span>
                        <span class="fw-bold ms-auto">{{ option.answers_count }}<span
                            class="fw-normal">/{{ item.answers.answers_count }}</span></span>
                      </span>
                      <progress class="w-100" :value="option.answers_count" :max="item.answers.answers_count"/>
                    </div>
                  </div>
                  <div v-if="item.settings.mode === 2" class="d-flex flex-wrap gap-4">
                    <div v-for="(a, i) in item.answers.imgOptions.filter(e => e.used)"
                         style="flex-basis: 17rem; max-width: 20rem"
                         class="card border-0 col d-flex option" :key="i">
                      <img class="img-fluid rounded" :src="`${api_url}/get_img/${a.file}`">
                      <div class="mt-2">
                        <span class="hstack">
                          <span v-if="checkCorrect(a, item)" class="correct">Верный ответ</span>
                          <span
                              class="text-muted position-absolute w-25 start-50 end-50 fw-normal">
                            {{ calcPercentage(a.answers_count, item.answers.answers_count) }}%
                        </span>
                        <span class="fw-bold ms-auto">{{ a.answers_count }}<span
                            class="fw-normal">/{{ item.answers.answers_count }}</span></span>
                        </span>
                        <progress class="w-100" :value="a.answers_count" :max="item.answers.answers_count"/>
                      </div>
                    </div>
                  </div>
                  <div v-if="item.settings.mode === 3" class="d-flex flex-column">
                    <span>Пазл собрали: <b>{{ item.answers.answers_count }}</b>/{{ statistic_filtered.length }}</span>
                    <progress class="w-100" :value="item.answers.answers_count" :max="statistic_filtered.length"/>
                  </div>
                </div>
              </div>

              <div v-if="tab === 1" v-for="item in statistic_filtered" class="card border-secondary rounded-3">
                <div class="card-body p-2">
                  <div class="d-flex card card-body mb-2 justify-content-between p-2 flex-row">
                    <div v-if="quiz_data.requiredName">
                      <span>Имя: </span>
                      <span class="fw-bold">{{ item.user_name }}</span>
                    </div>
                    <span v-if="quiz_data.requiredName" class="vr h-75 my-auto"/>
                    <div>
                      <span>Балл: </span>
                      <span class="fw-bold">{{ item.score }}<span class="fw-normal">/{{ item.max_score }}</span></span>
                    </div>
                    <span v-if="quiz_data.requiredName" class="vr h-75 my-auto"/>
                    <div>
                      <span>Правильно отвечено: </span>
                      <span class="fw-bold">{{ item.corrects_count }}<span
                          class="fw-normal">/{{ item.questions_count }}</span></span>
                    </div>
                    <span class="vr h-75 my-auto"/>
                    <div>
                      <span>Время прохождения: </span>
                      <span class="fw-bold">{{ convertTimer(item.timer) }}</span>
                    </div>
                    <span class="vr h-75 my-auto"/>
                    <div>
                      <span>Дата: </span>
                      <span class="fw-bold">{{ new Date(item.datestamp).toLocaleString() }}</span>
                    </div>
                  </div>
                  <section class="d-flex flex-column gap-2">
                    <div v-for="(q, index) in questions">
                      <div v-if="q.settings.mode === 0" class="d-flex card flex-column">
                        <div class="card-header p-2">
                          {{ q.settings.title }}
                          <div class="description" v-html="q.settings.text"></div>
                        </div>
                        <span class="hstack card-body p-2 gap-2"><b>Ответ: </b>
                          <span v-if="q.answers.options[item.answers[index].answer]"
                                :class="checkCorrect(q.answers.options[item.answers[index].answer], q)? 'correct': 'not-correct'">
                            {{ q.answers.options[item.answers[index].answer].text }}
                          </span>
                          <span v-else class="fst-italic">Пропущено</span>
                        </span>
                      </div>
                      <div v-if="q.settings.mode === 1" class="d-flex card flex-column">
                        <div class="card-header p-2">
                          {{ q.settings.title }}
                          <div class="description" v-html="q.settings.text"></div>
                        </div>
                        <span class="hstack card-body p-2 gap-2"><b>Ответ: </b>
                          <span v-if="item.answers[index].answers_checked.length > 0"
                                v-for="answ in item.answers[index].answers_checked"
                                :class="answ.isCorrect ? 'correct': 'not-correct'">
                            {{ answ.text }}
                          </span>
                          <span v-else class="fst-italic">Пропущено</span>
                        </span>
                      </div>
                      <div v-if="q.settings.mode === 2" class="d-flex card flex-column">
                        <div class="card-header p-2">
                          {{ q.settings.title }}
                          <div class="description" v-html="q.settings.text"></div>
                        </div>
                        <span class="hstack card-body p-2 gap-2"><b>Ответ: </b>
                          <span v-if="q.answers.imgOptions[item.answers[index].answer]">
                            <img class="my-1 rounded" height="200"
                                 :class="checkCorrect(q.answers.imgOptions[item.answers[index].answer], q)? 'correct': 'not-correct'"
                                 :src="`${api_url}/get_img/${q.answers.imgOptions[item.answers[index].answer].file}`"/>
                          </span>
                          <span v-else class="fst-italic">Пропущено</span>
                        </span>
                      </div>
                      <div v-if="q.settings.mode === 3" class="d-flex card flex-column">
                        <div class="card-header p-2">
                          {{ q.settings.title }}
                          <div class="description" v-html="q.settings.text"></div>
                        </div>
                        <span class="hstack card-body p-2 gap-2"><b>Пазл: </b>
                          <span v-if="item.answers[index].answer">Собран</span>
                          <span v-else class="fst-italic">Пропущено</span>
                        </span>
                      </div>
                    </div>
                  </section>
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
  height: 0.7rem;
  accent-color: var(--bs-dark);
}

.correct {
  background: var(--bs-success);
  filter: saturate(70%);
  color: var(--bs-light);
  padding: .1rem .3rem;
  border-radius: .25rem;
  font-size: smaller;
}

.not-correct {
  background: var(--bs-danger);
  filter: saturate(70%);
  color: var(--bs-light);
  padding: .1rem .3rem;
  border-radius: .25rem;
  font-size: smaller;
}

img.correct {
  outline: 4px solid var(--bs-success);
  outline-offset: 2px;
  padding: 0;
  background: transparent;
}

img.not-correct {
  outline: 4px solid var(--bs-danger);
  outline-offset: 2px;
  padding: 0;
  background: transparent;
}
</style>