<script setup>
import {useRouter} from "vue-router";
import {useToast} from "vue-toastification";
import {inject, onMounted, ref} from "vue";
import axios from "axios";
import LoaderBars from "@/components/loaderBars.vue";
import Puzzle from "@/components/puzzle.vue";

const router = useRouter()
const toast = useToast
const api_url = inject('api_url')

const is_loading = ref(true)
const current_question = ref(-1)

const data = ref({})
const results = ref({})
const answers = ref({
  options: [],
  user_name: ''
})

function returnHome() {
  if (confirm("Действительно вернуться на главную? Ваше решение не будет сохранено!")) {
    router.push('/')
  }
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

function checkOptionIn(option) {
  return answers.value.options[current_question.value].answers_checked.includes(option)
}

function nextQuestion() {
  if (current_question.value < data.value.questions.length - 1) {
    current_question.value++
    router.replace({query: {question: current_question.value}})
  }
}

function finish() {
  is_loading.value = true
  current_question.value++
  router.replace({query: {question: current_question.value}})

  axios.post(`${api_url}/send_answer/${data.value.quiz_id}`, answers.value)
      .then(response => {
        is_loading.value = false
        results.value = response.data.results
      })
      .catch(error => {
        console.log(error)
        toast.error(error.message)
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
  <div v-show="data.blur_bg" class="bg-blur"></div>
  <img v-if="data.img_bg" class="bg-img" :src="`${api_url}/get_img/${data.img_bg}`">
  <main v-if="data.quiz_id" class="container d-flex" style="height: 100vh">
    <section class="m-auto col">
      <div class="hstack mb-2">
        <button v-if="current_question !== data.questions.length" @click="returnHome"
                class="btn btn-light d-flex border-0 justify-content-center gap-2 align-items-center ms-auto rounded-4">
          <span>Вернуться на главную</span>
          <img style="filter: invert(0)" src="/src/assets/icons/house.svg"/>
        </button>
      </div>

      <div v-if="current_question === -1" class="card overflow-hidden rounded-4">
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
            <button @click="nextQuestion"
                    :disabled="'disabled' ? data.requiredName && !answers.user_name : null"
                    class="btn btn-lg btn-outline-light ms-auto">Начать
            </button>
          </div>
        </div>
      </div>
      <section v-for="(q, index) in data.questions" :key="index">
        <transition name="fade-left">
          <div v-if="current_question === index" class="card rounded-4">
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
                    @click="finish"
                    class="btn btn-lg btn-light ms-auto">Завершить
                </button>
                <button v-else-if="!checkAnswer(index) && current_question === data.questions.length - 1"
                        @click="finish"
                        class="btn btn-lg btn-outline-light ms-auto">Пропустить
                </button>
                <button v-else-if="checkAnswer(index)"
                        @click="nextQuestion"
                        class="btn btn-lg btn-outline-light ms-auto">Следующий вопрос
                </button>
                <button v-else-if="!checkAnswer(index)" @click="nextQuestion"
                        class="btn btn-lg btn-outline-light ms-auto">Пропустить
                </button>
              </div>
            </div>
          </div>
        </transition>

      </section>
      <div v-if="current_question === data.questions.length" class="card rounded-4">
        <div class="card-body p-5">
          <h2 class="card-title text-center">Спасибо за прохождение викторины, {{ answers.user_name }}!</h2>
          <br>
          <h4 class="text-center">
            Вы набрали <b>{{ results.score }}</b> баллов из <b>{{ results.max_score }}</b>
          </h4>
          <h4 class="text-center">
            Вы правильно ответили на <b>{{ results.corrects_count }}</b> вопросов из <b>{{ data.questions.length }}</b>
          </h4>
        </div>
        <div class="card-footer">
          <div class="hstack py-2 gap-2" @click="router.push({name: 'Home'})">
            <button class="btn btn-lg btn-light mx-auto">Вернуться на главную</button>
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

.card {
  background: transparent;
  border: 0;
  backdrop-filter: blur(10px) brightness(60%);
  color: var(--bs-light);

  .form-control {
    background-color: transparent;
    border-radius: 20px;
    border: 1px solid var(--bs-light);
    color: var(--bs-light);
  }

  .form-control::placeholder {
    color: var(--bs-light);
  }

  span {
    color: var(--bs-light);
  }
}

.option:hover {
  outline: 2px solid var(--bs-light);
}

.option.active {
  border: 1px solid transparent;
  background-color: var(--bs-light);
  color: var(--bs-dark);
}
</style>