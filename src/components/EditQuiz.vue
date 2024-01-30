<script setup>
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

let router = useRouter()
let quiz_img = ref()
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

function isActive(index) {
  return router.currentRoute.value.query.question === index.toString()
}
</script>

<template>
  <section class="container">
    <div class="hstack mt-2">
      <span class="fs-2 font-bold">{{ quiz_data.title }}</span>
      <button class="btn btn-dark ms-auto">Вернуться назад</button>
    </div>
    <div class="row my-4">
      <div class="col-2">
        <div class="d-flex flex-column gap-2">
          <button @click="$router.replace({query: {general: 0}})" class="btn btn-outline-dark"
                  :class="{'active': $router.currentRoute.value.query.general}">Параметры
            <img class="ms-2" src="../assets/icons/gear-fill.svg"/>
          </button>
          <span>Вопросы:</span>
          <transition-group name="fade-left">
            <div v-for="(q, index) in quiz_data.questions" :key="index" class="d-flex position-relative">
              <button @click="$router.replace({query: {question: index}})"
                      class="btn btn-outline-dark flex-grow-1"
                      :class="{'active': isActive(index)}">{{ q.title }}
              </button>
            </div>
          </transition-group>
          <button class="btn btn-outline-dark" @click="newQuestion">
            <img src="../assets/icons/plus-lg.svg" height="22"/>
          </button>
        </div>
      </div>
      <div class="col">
        <section class="d-flex flex-column gap-2">
          <div class="hstack">
            <span class="fs-4">Параметры</span>
            <div class="form-check form-switch ms-auto">
              <label class="form-check-label" for="to_publish">Опубликовать</label>
              <input class="form-check-input" id="to_publish" v-model="quiz_data.to_publish" type="checkbox">
            </div>
          </div>
          <div class="card d-flex">
            <div class="card-header d-flex" style="height: 20rem">
              <img class="card-img-top m-auto" src="../assets/icons/file-earmark-image.svg" height="48"/>
            </div>
            <div class="card-body">
              <span>{{ quiz_data.img }}</span>
              <input ref="quiz_img" type="file" @change="console.log($refs.quiz_img.value)" class="form-control">
            </div >
          </div>

          <cropper hidden class="cropper" src="/src/assets/lb.jpg"/>
          <div class="form-floating">
            <input type="text" placeholder="" class="form-control" v-model="quiz_data.title">
            <label for="title">Название</label>
          </div>
          <div class="form-floating">
            <textarea type="" placeholder="" class="form-control" v-model="quiz_data.description"></textarea>
            <label for="description">Описание</label>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.q-x-btn {
  position: absolute;
  cursor: pointer;
  top: 25%;
  left: -2rem;
}
</style>