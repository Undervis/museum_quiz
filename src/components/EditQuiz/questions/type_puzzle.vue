<script setup>

import Puzzle from "@/components/puzzle.vue";
import {inject, ref} from "vue";
import {useToast} from 'vue-toastification'
import axios from "axios";
import Toast_container from "@/components/toast_container.vue";

const props = defineProps(['question', 'quiz_id'])
const api_url = inject('api_url')
const toast = useToast()

const saveStatus = ref(false)

const img_field = ref()
const temp_img = ref()
const puzzle_shuffle = ref(false)

function uploadImgPuzzle() {
  let reader = new FileReader()
  reader.readAsDataURL(img_field.value.files[0])
  reader.onloadend = function () {
    temp_img.value = reader.result
  }
}

function uploadImgToServer() {
  saveStatus.value = true
  let fd = new FormData()
  let file = new File([img_field.value.files[0]], "image.jpg", {type: "image/jpeg"})
  fd.append('image', file)
  fd.append('question_index', props.question.settings.index)
  fd.append('context', 'puzzle-img')
  axios.post(api_url + '/upload_img/' + props.quiz_id, fd, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((res) => {
    props.question.answers.puzzle.img = res.data.file_name
    temp_img.value = null
    saveStatus.value = false
  }).catch((error) => {
    console.log(error)
    let toast_content = {
      component: Toast_container,
      props: {
        msg: "Ошибка при сохранении изображения",
        data: error
      },
      timeout: 10000,
      closeButton: false
    }
    toast.error(toast_content, {timeout: 10000, closeButton: false})
    setTimeout(() => {
      uploadImgToServer()
    }, 10000)
  })
}
</script>

<template>
  <div class="hstack gap-2">
    <input type="file" accept="image/*" ref="img_field" class="form-control rounded-pill" @change="uploadImgPuzzle">
    <button :class="{'disabled': !temp_img || saveStatus }"
            class="btn rounded-pill btn-outline-dark text-nowrap" @click="uploadImgToServer">
      <span v-if="!saveStatus">Сохранить на сервер</span>
      <span v-else class="spinner-border spinner-border-sm"></span>
    </button>
  </div>

  <span v-if="!temp_img && !question.answers.puzzle.img" class="alert mb-2 rounded-4 alert-info p-2 text-center">
    Изображение отсутствует
  </span>
  <span v-else-if="temp_img" class="alert mb-2 rounded-4 alert-warning p-2 text-center">
    Сохраните загруженное изображение!
  </span>
  <span v-else-if="question.answers.puzzle.img" class="alert mb-2 rounded-4 alert-success p-2 text-center">
    Изображение сохранено
  </span>

  <section class="d-flex flex-column gap-2" v-if="question.answers.puzzle.img || temp_img">
    <hr class="mt-0 mb-2 w-75 mx-auto">
    <div class="hstack gap-2">
      <div class="input-group w-75" title="Кол-во разделений по вертикали">
        <span class="input-group-text rounded-start-pill">Столбцы</span>
        <input class="form-control rounded-end-pill" min="1" max="10" type="number" v-model="question.answers.puzzle.cols">
      </div>
      <div class="input-group w-75" title="Кол-во разделений по горизонтали">
        <span class="input-group-text rounded-start-pill">Строки</span>
        <input class="form-control rounded-end-pill" min="1" max="10" type="number" v-model="question.answers.puzzle.rows">
      </div>
      <button class="btn rounded-pill btn-outline-dark" :class="{'active' : puzzle_shuffle}"
              title="Так будет выглядеть пазл при решении викторины"
              @click="puzzle_shuffle = !puzzle_shuffle">Предпросмотр
      </button>
    </div>
    <div class="hstack gap-2">
      <div class="input-group w-75" title="Толщина линий вокруг элементов пазла">
        <span class="input-group-text rounded-start-pill">Толщина линий</span>
        <input class="form-control rounded-end-pill" min="0" max="20" type="number"
               v-model="question.answers.puzzle.strokeWidth">
      </div>
      <div class="input-group" title="Сглаживание линий вокруг элементов пазла">
        <span class="input-group-text rounded-start-pill">Сглаживание линий</span>
        <input class="form-control rounded-end-pill" step="0.05" min="0" max="0.5" type="number"
               v-model="question.answers.puzzle.strokeSoftness">
      </div>
      <div class="input-group w-75" title="Цвет линий вокруг элементов пазла">
        <span class="input-group-text rounded-start-pill d-flex">Цвет линий</span>
        <input class="form-control rounded-end-pill h-auto" type="color"
               v-model="question.answers.puzzle.strokeColor">
      </div>
    </div>
    <div class="d-flex card rounded-4 flex-grow-1 overflow-hidden">
      <puzzle
          :img_url="temp_img ? temp_img : `${api_url}/get_img/${question.answers.puzzle.img}`"
          :cols="question.answers.puzzle.cols" :rows="question.answers.puzzle.rows"
          :shuffle="puzzle_shuffle"
          :stroke-softness="question.answers.puzzle.strokeSoftness"
          :stroke-color="question.answers.puzzle.strokeColor"
          :stroke-width="question.answers.puzzle.strokeWidth"
          @solved="console.log('solved')"
      />
    </div>
  </section>
</template>

<style scoped>

</style>