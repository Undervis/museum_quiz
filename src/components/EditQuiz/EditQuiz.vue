<script setup>
import {inject, onMounted, ref, watch} from "vue";
import debounce from "lodash.debounce"
import {useRouter} from "vue-router";
import LeftPanel from "@/components/EditQuiz/LeftPanel.vue";
import GeneralOptions from "@/components/EditQuiz/GeneralOptions.vue";
import Question from "@/components/EditQuiz/Question.vue";
import Toast_container from "@/components/toast_container.vue";
import axios from "axios";
import LoaderDots from "@/components/loaderDots.vue";
import {TYPE, useToast} from "vue-toastification";
import LoaderFigures from "@/components/loaderFigures.vue";
import LoaderBars from "@/components/loaderBars.vue";

const api_url = inject('api_url')
const toast = useToast()
let router = useRouter()

// Состояния событий
let state = ref({
  saveStatus: false,
  firstSaved: false,
  debounced: false,
  lastSaved: ""
})

// Структура квиза
let quiz_data = ref({
  quiz_id: undefined,
  answers_count: 0,
  title: "Новая викторина",
  description: "",
  to_publish: false,
  questions: [],
  last_question_index: 0,
  img_preview: null,
  theme: 'classic',
  img_bg: null,
  blur_bg: true,
  quiz_view: 0, // 0 - Both, 1 - Magnezius, 2 - Museum
  quiz_type: 0, // 0 - Children, 1 - Adult
  requiredName: true
})

// Структура вопроса
function newQuestion() {
  let question = {
    settings: {
      index: quiz_data.value.last_question_index,
      title: "Вопрос №" + quiz_data.value.last_question_index,
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
      puzzle: {
        img: null,
        rows: 2,
        cols: 2,
        strokeWidth: 2,
        strokeSoftness: 0,
        strokeColor: '#000000'
      },
      correctOption: {
        index: 0,
        type: 0 // 0 - One option, 1 - Img
      }
    }
  }
  quiz_data.value.questions.push(question)
  router.replace({hash: '#question-' + quiz_data.value.last_question_index})
  quiz_data.value.last_question_index += 1
}

// Удаление вопроса
function deleteQuestion(question) {
  if (quiz_data.value.questions.length === 0) {
    router.replace({hash: '#general-settings'})
  } else if (router.currentRoute.value.hash === '#question-' + question.index) {
    const new_index = quiz_data.value.questions[quiz_data.value.questions.indexOf((e) => e.settings.index === question.index) - 1].settings.index
    router.replace({hash: '#question-' + new_index})
  }
  quiz_data.value.questions.splice(quiz_data.value.questions.indexOf(question), 1)
}

// Первое сохранение записи
function firstSave() {
  state.value.saveStatus = true
  axios.post(api_url + '/add_quiz', quiz_data.value)
      .then((response) => {
        state.value.saveStatus = false
        quiz_data.value.quiz_id = response.data.id
        router.replace({params: {id: response.data.id}})
        state.value.firstSaved = true
      })
      .catch((error) => {
        state.value.saveStatus = false
        console.log(error)
        toast.error("Ошибка при сохранении")
      })
}

// Первоначальная загрузка данных после загрузки страницы
onMounted(() => {
  if (!router.currentRoute.value.hash) {
    router.replace({hash: '#general-settings'})
  }
  if (router.currentRoute.value.params.id !== '0') {
    state.value.saveStatus = true
    axios.get(api_url + '/get_quiz/' + router.currentRoute.value.params.id)
        .then((response) => {
          quiz_data.value = response.data
          delete quiz_data.value._id
          router.replace({hash: '#general-settings'})
          state.value.firstSaved = true
          state.value.saveStatus = false
        })
        .catch((error) => {
          console.log(error)
          let toast_content = {
            component: Toast_container,
            props: {
              msg: "Ошибка при загрузке данных",
              data: error
            }
          }
          toast.error(toast_content, {timeout: 10000, closeButton: false})
          setTimeout(() => {
            router.go()
          }, 10000)
        })
  } else {
    quiz_data.value.quiz_id = 0
  }
})

// Обновление данных на сервере с ожиданием изменений 5 секунд
const update = debounce(() => {
  state.value.debounced = false
  state.value.saveStatus = true
  axios.put(api_url + '/update_quiz/' + quiz_data.value.quiz_id, quiz_data.value)
      .then((response) => {
        state.value.lastSaved = response.data.last_save
        state.value.saveStatus = false
      })
      .catch((error) => {
        console.log(error)
        let toast_content = {
          component: Toast_container,
          props: {
            msg: "Ошибка при сохранении",
            data: error
          },
          timeout: 10000,
          closeButton: false
        }
        toast.error(toast_content, {timeout: 20000, closeButton: false})
      })

}, 5 * 1000)

// Отслеживание изменений данных
watch(quiz_data, (newValue, oldValue) => {
  // Обновление заголовка окна
  document.title = quiz_data.value.title

  // Проверка, что ID не равен нулю и это не первая загрузка страницы
  if (quiz_data.value.quiz_id !== 0 && oldValue.quiz_id !== undefined) {
    state.value.debounced = true
    // Вызов функции обновления
    if (form.value.checkValidity()) {
      update()
    } else {
      form.value.reportValidity()
      state.value.debounced = false
    }

  }
}, {deep: true})

// Отслеживание скрола для прилипания компонентов
function isScrolledIntoView(el) {
  let rect = el.getBoundingClientRect()
  let elemTop = rect.top
  let elemBottom = rect.bottom
  return elemTop < window.innerHeight && elemBottom >= 0
}

window.onscroll = () => {
  let scrolledTo = document.querySelector('#header')
  scrolled.value = !!(scrolledTo && isScrolledIntoView(scrolledTo));
}

// Переменная для переключения классов прилипания компонентов
const scrolled = ref(true)

// Ссылка на компонент, для того чтобы взаимодействовать с ним на прямую
const bgImg = ref()
const form = ref()

function convertDate(date) {
  let d = new Date(date)
  return d.toLocaleString('ru-Ru')
}
</script>

<template>
  <loader-bars v-if="state.saveStatus && !state.firstSaved"/>
  <div v-show="quiz_data.blur_bg" class="bg-blur"></div>
  <img class="bg-img" ref="bgImg">
  <section class="container">
    <div class="hstack bg-transparent border-0 rounded-4" id="header"></div>

    <div class="row my-4 mt-2 gap-2">
      <!-- Left Panel -->
      <div class="col-12 col-lg-3 col-sm-12">
        <left-panel :questions="quiz_data.questions" :class="{'pinned': !scrolled}" @newQuestion="newQuestion"/>
      </div>

      <!-- Main Panel -->
      <div class="col">
        <form ref="form" id="general-settings" @submit.prevent>
          <section class="w-100 mb-2 sticky-top d-flex flex-row gap-2" :class="{'pinned': !scrolled}"
                   style="z-index: 5">
            <button class="btn btn-dark w-100 rounded-4" v-if="!state.firstSaved"
                    @click.prevent="firstSave">
              <span>Сохранить как новую</span>
              <span v-if="state.saveStatus"
                    class="spinner-border spinner-border-sm ms-2" role="status"></span>
              <span class="updownbadge position-relative"
                    aria-label="Первое сохранение, дальнейшие изменения будут сохраняться автоматически(кроме изображений)">
              </span>
            </button>
            <div class="w-100 d-flex card card-body rounded-4" v-else>
              <span class="text-muted mx-auto" v-if="!state.saveStatus && !state.debounced && state.lastSaved">
                <img class="me-2" src="/src/assets/icons/check-lg.svg"/>
                <span><b>Сохранено</b>, последнее сохранение: {{ convertDate(state.lastSaved) }}</span>
              </span>
              <span class="text-muted mx-auto" v-else-if="!state.saveStatus && !state.debounced">
                <img class="me-2" src="/src/assets/icons/check-lg.svg"/>
                <span><b>Сохранено</b>, изменений нет</span>
              </span>
              <span class="text-muted mx-auto" v-else-if="state.debounced">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                <span>Сохраним как только закончите</span>
              </span>
              <span class="text-muted mx-auto" v-else>
                <loader-dots class="d-inline-flex"/>
              </span>
            </div>
            <router-link :class="{'disabled': state.debounced || state.saveStatus}"
                         class="btn d-flex btn-sm btn-dark rounded-4 border-0 gap-2 px-3 text-nowrap ms-auto"
                         :to="{name: 'Manage'}">
              <span class="m-auto">Вернуться назад</span>
              <img style="filter: invert(1)" src="/src/assets/icons/arrow-return-left.svg"/>
            </router-link>
          </section>
          <section class="d-flex flex-column gap-4">
            <general-options :quiz_data="quiz_data" :bg="bgImg" :state="state"/>
            <hr v-if="quiz_data.questions.length > 0">
            <div v-for="q in quiz_data.questions">
              <question :id="'question-' + q.settings.index" :question="q" :state="state" :quiz_data="quiz_data"
                        @deleteQuestion="deleteQuestion(q)"/>
            </div>
          </section>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>

.card, .btn {
  transition: all 0.2s ease;
}

.pinned .card,
.pinned .btn {
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  padding: 0.35rem;
}
</style>