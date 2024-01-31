<script setup>
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {Cropper} from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

let router = useRouter()
let quiz_img = ref()
let quiz_img_crop = ref({file: "", show: false})
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

function uploadImg() {
  quiz_img.value.click();
  quiz_img.value.onchange = function () {
    let reader = new FileReader();
    reader.readAsDataURL(quiz_img.value.files[0]);
    reader.onload = function (e) {
      quiz_img_crop.value.show = true
      quiz_img_crop.value.file = e.target.result
    }
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
    <!-- Панель вопросов -->
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
      <!-- Параметры -->
      <div class="col">
        <section class="d-flex flex-column gap-2">
          <div class="hstack">
            <span class="fs-4">Параметры</span>
            <div class="form-check form-switch ms-auto">
              <label class="form-check-label" for="to_publish">Опубликовать</label>
              <input class="form-check-input" id="to_publish" v-model="quiz_data.to_publish" type="checkbox">
            </div>
          </div>
          <div class="d-flex p-2">
            <img v-if="!quiz_img_crop.show" @click="uploadImg" class="card-img m-auto q-img" src="../assets/icons/file-earmark-image.svg"
                 height="48"/>
            <input hidden ref="quiz_img" accept="image/jpeg, image/png" type="file" class="form-control">
            <cropper v-if="quiz_img_crop.show" class="m-auto q-img-crop" :src="quiz_img_crop.file"
            autoZoom minWidth="1000" minHeight="300" checkOrientation/>
          </div>
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
.q-img {
  height: 300px;
  padding: 7rem;
  border: 1px dashed black;
  border-radius: 0.5rem;
}

.q-img-crop {
  height: 300px;
  width: auto;
  border-radius: 0.5rem;
}

.q-img:hover {
  cursor: pointer;
  background-color: #ebebeb;
}
</style>