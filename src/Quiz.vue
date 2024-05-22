<script setup>
import {useRouter} from "vue-router";
import {useToast} from "vue-toastification";
import {inject, onMounted, ref} from "vue";
import axios from "axios";
import LoaderBars from "@/components/loaderBars.vue";
import Puzzle from "@/components/puzzle.vue";
import Toast_container from "@/components/toast_container.vue";
import ConfirmModal from "@/components/confirmModal.vue";

const router = useRouter()
const toast = useToast()
const api_url = inject('api_url')

const is_loading = ref(true)
const current_question = ref(-1)
const showConfirmModal = ref(false)

const data = ref({})
const results = ref({})
const answers = ref({
  options: [],
  timer: 0,
  user_name: ''
})

function startTimer() {
  setInterval(() => {
    answers.value.timer++
  }, 1000)
}

function setAnswers(questions) {
  for (let i = 0; i < questions.length; i++) {
    answers.value.options.push({
      question_id: questions[i].settings.index,
      answers_checked: [],
      answer: null
    })
    data.value.questions[i].answers.imgOptions = data.value.questions[i].answers.imgOptions.filter(e => e.used)
  }
}

function toggleOption(option) {
  if (checkOptionIn(option)) {
    answers.value.options[current_question.value].answers_checked.splice(answers.value.options[current_question.value].answers_checked.indexOf(option), 1)
  } else {
    answers.value.options[current_question.value].answers_checked.push(option)
  }
}

function convertTimer(time_in_seconds) {
  let minutes = Math.floor((time_in_seconds % 3600) / 60)
  let seconds = time_in_seconds % 60
  return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}

function checkOptionIn(option) {
  return answers.value.options[current_question.value].answers_checked.includes(option)
}

function nextQuestion() {
  if (current_question.value < data.value.questions.length - 1) {
    current_question.value++
    router.replace({query: {question: current_question.value}})
  }
}

function finish(next_step = true) {
  if (next_step) {
    current_question.value++
    router.replace({query: {question: current_question.value}})
  }
  is_loading.value = true

  axios.post(`${api_url}/send_answer/${data.value.quiz_id}`, answers.value)
      .then(response => {
        is_loading.value = false
        results.value = response.data.results
      })
      .catch(error => {
        console.log(error)
        let toast_content = {
          component: Toast_container,
          props: {
            msg: "Ошибка при отправке данных",
            data: error
          }
        }
        toast.error(toast_content, {timeout: 10000, closeButton: false})
        setTimeout(() => {
          finish(false)
        }, 10000)
      })
}

function checkAnswer(index) {
  return answers.value.options[index].answer !== null || answers.value.options[index].answers_checked.length !== 0
}

onMounted(() => {
  const id = router.currentRoute.value.params.id
  axios.get(`${api_url}/get_quiz/${id}`)
      .then((res) => {
        data.value = res.data
        setAnswers(data.value.questions)
        if (router.currentRoute.value.query.question) {
          current_question.value = parseInt(router.currentRoute.value.query.question)
        }
        document.title = data.value.title
        is_loading.value = false
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.message)
      })
})
</script>

<template>
  <loader-bars v-if="is_loading"/>
  <button hidden="hidden" @click="finish(false)"
          class="btn btn-lg m-4 btn-light rounded-circle position-fixed end-0 bottom-0"
          style="aspect-ratio: 1; z-index: 1500">
    <img src="/src/assets/icons/rocket-takeoff.svg">
  </button>
  <div v-show="data.blur_bg" class="bg-blur"></div>
  <img v-if="data.img_bg" class="bg-img" :src="`${api_url}/get_img/${data.img_bg}`">
  <main v-if="data.quiz_id" class="overflow-hidden d-flex" style="height: 100vh">
    <transition name="fade">
      <confirm-modal v-if="showConfirmModal" title="Действительно вернуться на главную?"
                     msg="Ваше решение не будет засчитано!" :theme="data.theme"
                     @confirm="$router.push('/')" @dismiss="showConfirmModal = false"/>
    </transition>

    <section class="container m-auto col">
      <div class="hstack mb-2">
        <button v-if="current_question !== data.questions.length" @click="showConfirmModal = true"
                class="btn btn-light d-flex border-0 justify-content-center gap-2 align-items-center ms-auto rounded-4">
          <span>Вернуться на главную</span>
          <img style="filter: invert(0)" src="/src/assets/icons/house.svg"/>
        </button>
      </div>

      <div v-if="current_question === -1" :class="{'blur': data.theme === 'modern'}"
           class="card overflow-hidden rounded-4">
        <div class="row g-0">
          <div class="col-4">
            <img v-if="data.img_preview" class="img-fluid" :src="`${api_url}/get_img/${data.img_preview}`"/>
            <img v-else class="img-fluid" src="/src/assets/icons/no-image.svg"/>
          </div>
          <div class="col">
            <div class="card-body p-4 pb-0">
              <h2 class="card-title text-center">{{ data.title }}</h2>
              <div class="description overflow-y-scroll" style="max-height: 21rem" v-html="data.description"></div>
            </div>
          </div>
        </div>

        <div v-if="data.requiredName" class="card-footer">
          <div class="input-group">
            <input v-model="answers.user_name" type="text" class="form-control"
                   placeholder="Введите ваше имя">
          </div>
        </div>
        <div class="card-footer">
          <div class="hstack py-2 gap-2">
            <span>{{ current_question + 1 }}/{{ data.questions.length }}</span>
            <button @click="nextQuestion(); startTimer()"
                    :disabled="'disabled' ? data.requiredName && !answers.user_name : null"
                    :class="'btn-outline-light'? data.theme === 'modern' : 'btn-outline-dark'"
                    class="btn btn-lg ms-auto">Начать
            </button>
          </div>
        </div>
      </div>
      <section v-for="(q, index) in data.questions" :key="index">
        <transition name="fade-left">
          <div v-if="current_question === index" :class="{'blur': data.theme === 'modern'}" class="card rounded-4">
            <div class="card-body p-5">
              <h2 class="card-title text-center">{{ q.settings.title }}</h2>
              <div class="description" v-html="q.settings.text"></div>
              <hr>
              <div v-if="q.settings.mode === 0" class="d-flex flex-column gap-2">
                <div v-for="(a, i) in q.answers.options" :key="i">
                  <div :class="{'active' : answers.options[index].answer === i}" class="card card-body option fs-5"
                       @click="answers.options[index].answer = i">
                    {{ a.text }}
                  </div>
                </div>
              </div>

              <div v-if="q.settings.mode === 1" class="d-flex flex-column gap-2">
                <div v-for="(a, i) in q.answers.options" :key="i">
                  <div :class="{'active' : checkOptionIn(a)}"
                       class="card d-flex flex-row gap-3 card-body option fs-5"
                       @click="toggleOption(a)">
                    <input :checked="'checked' ? checkOptionIn(a) : null" type="checkbox" class="form-check-input">
                    {{ a.text }}
                  </div>
                </div>
              </div>

              <div v-if="q.settings.mode === 2" class="d-flex justify-content-center flex-wrap gap-4">
                <div v-for="(a, i) in q.answers.imgOptions" style="flex-basis: 17rem; max-width: 40rem"
                     class="card col d-flex option"
                     :class="{'active' : answers.options[index].answer === i}"
                     @click="answers.options[index].answer = i"
                     :key="i">
                  <img class="img-fluid rounded" :src="`${api_url}/get_img/${a.file}`">
                </div>
              </div>

              <div v-if="q.settings.mode === 3" class="d-flex">
                <div class="d-flex card flex-grow-1 overflow-hidden">
                  <puzzle
                      :img_url="`${api_url}/get_img/${q.answers.puzzle.img}`"
                      :cols="q.answers.puzzle.cols" :rows="q.answers.puzzle.rows"
                      :shuffle="true"
                      :stroke-softness="q.answers.puzzle.strokeSoftness"
                      :stroke-color="q.answers.puzzle.strokeColor"
                      :stroke-width="q.answers.puzzle.strokeWidth"
                      @solved="answers.options[index].answer = true"
                  />
                </div>
              </div>

            </div>
            <div class="card-footer">
              <div class="hstack py-2 gap-2">
                <span>{{ current_question + 1 }}/{{ data.questions.length }}</span>
                <button
                    v-if="checkAnswer(index) && current_question === data.questions.length - 1"
                    @click="finish" :class="'btn-light'? data.theme === 'modern' : 'btn-dark'"
                    class="btn btn-lg ms-auto">Завершить
                </button>
                <button v-else-if="!checkAnswer(index) && current_question === data.questions.length - 1"
                        @click="finish" :class="'btn-outline-light'? data.theme === 'modern' : 'btn-outline-dark'"
                        class="btn btn-lg ms-auto">Пропустить
                </button>
                <button v-else-if="checkAnswer(index)"
                        @click="nextQuestion" :class="'btn-outline-light'? data.theme === 'modern' : 'btn-outline-dark'"
                        class="btn btn-lg ms-auto">Следующий вопрос
                </button>
                <button v-else-if="!checkAnswer(index)" @click="nextQuestion"
                        :class="'btn-outline-light' ? data.theme === 'modern' : 'btn-outline-dark'"
                        class="btn btn-lg ms-auto">Пропустить
                </button>
              </div>
            </div>
          </div>
        </transition>

      </section>
      <div v-if="current_question === data.questions.length" :class="{'blur': data.theme === 'modern'}"
           class="card rounded-4">
        <div class="card-body p-5">
          <h2 v-if="data.requiredName" class="card-title text-center">Спасибо за прохождение викторины,
            {{ answers.user_name }}!</h2>
          <h2 v-else class="card-title text-center">Спасибо за прохождение викторины!</h2>
          <br>
          <h4 class="text-center">
            Вы набрали <b>{{ results.score }}</b> баллов из <b>{{ results.max_score }}</b>
          </h4>
          <h4 class="text-center">
            Вы правильно ответили на <b>{{ results.corrects_count }}</b> вопросов из <b>{{
              results.questions_count
            }}</b>
          </h4>
          <h5 class="text-center">Время прохождения: <b>{{ convertTimer(results.timer) }}</b></h5>
        </div>
        <div class="card-footer">
          <div class="hstack py-2 gap-2" @click="router.push({name: 'Home'})">
            <button :class="'btn-light' ? data.theme === 'modern' : 'btn-dark'"
                    class="btn btn-lg mx-auto">Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.option {
  cursor: pointer;
  outline: 2px solid transparent;
  border: 1px solid var(--bs-light) !important;
  outline-offset: 1px;
  transition: 0.2s ease;
}

.option:hover {
  outline: 2px solid var(--bs-light);
}

.option.active {
  border: 1px solid transparent;
  background-color: var(--bs-light) !important;
  color: var(--bs-dark) !important;
}
</style>