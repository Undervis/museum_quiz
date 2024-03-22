<script setup>
import ImgUploader from "@/components/ImgUploader.vue";
import {ref, watch} from "vue";

const props = defineProps(['question'])

function addOption() {
  let newOption = {
    text: '',
    isCorrect: false
  }
  props.question.answers.options.push(newOption)
}

function delOption(option) {
  props.question.answers.options.splice(props.question.answers.options.indexOf(option), 1)
}

function delImgOption(index) {
  props.question.answers.imgOptions.splice(index, 1)
}

function setCorrectAnswer(index, type) {
  props.question.answers.correctOption.index = index
  props.question.answers.correctOption.type = type
}

function addImgOption() {
  let newOption = {
    text: '',
    img: ref()
  }
  props.question.answers.imgOptions.push(newOption)
}
</script>

<template>
  <section class="d-flex gap-4 flex-column">
    <!-- Общие параметры вопроса -->
    <section class="card card-body d-flex gap-2">
      <div class="form-floating">
        <input class="form-control" placeholder="" id="questionTitle" v-model="question.settings.title">
        <label for="questionTitle">Название вопроса</label>
      </div>
      <div class="form-floating">
      <textarea class="form-control" placeholder="" id="questionDescription" style="height: 100px"
                v-model="question.settings.shortDescription"></textarea>
        <label for="questionDescription">Описание вопроса</label>
      </div>
    </section>

    <section class="card card-body d-flex gap-2">
      <!-- Режим вопроса -->
      <div class="btn-group">
        <input type="radio" class="btn-check" @click="question.settings.mode=0" id="typeOneOption" name="options-q-type"
               autocomplete="off" checked>
        <label class="btn btn-sm btn-outline-dark" for="typeOneOption">Один вариант ответа</label>
        <input type="radio" class="btn-check" @click="question.settings.mode=1" id="typeManyOptions"
               name="options-q-type"
               autocomplete="off">
        <label class="btn btn-sm btn-outline-dark" for="typeManyOptions">Несколько вариантов ответа</label>
        <input type="radio" class="btn-check" @click="question.settings.mode=2" id="typeSelectImg" name="options-q-type"
               autocomplete="off">
        <label class="btn btn-sm btn-outline-dark" for="typeSelectImg">Выбор изображения</label>
        <input type="radio" class="btn-check" @click="question.settings.mode=3" id="typePuzzle" name="options-q-type"
               autocomplete="off">
        <label class="btn btn-sm btn-outline-dark" for="typePuzzle">Пазл</label>
      </div>
      <!-- Баллы -->
      <div class="row">
        <div class="col">
          <div class="form-floating">
            <input type="number" class="form-control" placeholder="" id="addScores"
                   v-model="question.settings.addScoresPerAnswer" min="1" value="1">
            <label for="addScores">Кол-во баллов за правильный ответ</label>
          </div>
        </div>
        <div v-if="question.settings.mode === 1" class="col">
          <span class="fs-6 text-uppercase">Режим начисления баллов</span>
          <div class="btn-group w-100">
            <input type="radio" class="btn-check" @click="question.scoreMode=0" id="typeForAllScore" name="typeScore"
                   autocomplete="off" checked>
            <label class="btn btn-sm btn-outline-dark" for="typeForAllScore">За все правильные ответы</label>
            <input type="radio" class="btn-check" @click="question.scoreMode=1" id="typeForEveryScore" name="typeScore"
                   autocomplete="off">
            <label class="btn btn-sm btn-outline-dark" for="typeForEveryScore">За каждый ответ по отдельности</label>
          </div>
        </div>
        <div v-if="question.settings.mode === 2" class="col d-flex flex-grow-1 flex-wrap">
          <button class="btn btn-dark w-100" :disabled="question.answers.imgOptions.length >= 8"
                  @click="addImgOption">Добавить изображение
          </button>
        </div>
      </div>
      <!-- Варианты ответа -->
      <div v-if="question.settings.mode === 0 || question.settings.mode === 1" class="d-flex gap-2 flex-column">
        <div class="d-flex flex-row justify-content-center" v-for="(op, index) in question.answers.options">
          <input v-if="question.settings.mode === 0" :key="op" name="quiz-option" type="radio" class="mx-2"
                 @click="setCorrectAnswer(index, 0)">
          <input v-else-if="question.settings.mode === 1" type="checkbox" class="mx-2" v-model="op.isCorrect">
          <div class="w-100">
            <input class="form-control" placeholder="" maxlength="64" v-model="op.text">
          </div>
          <button class="btn btn-sm btn-danger border-0 ms-2" @click="delOption(op)">
            <img src="/src/assets/icons/x-circle-fill.svg" height="20"/>
          </button>
        </div>
        <!-- Добавление варианта ответа -->
        <button class="btn btn-primary" @click="addOption">
          <img height="20" src="/src/assets/icons/plus-lg.svg">
        </button>
      </div>
      <!-- Выбор изображения -->
      <div v-if="question.settings.mode === 2" class="d-flex flex-column">
        <div class="alert alert-danger">
          <span>Не переключайтесь на другие типы вопроса или на другие вопросы пока не сохраните изображение на сервер,
            в противном случае все изображения будут потеряны</span>
        </div>
        <div class="d-flex gap-4 flex-wrap justify-content-evenly">
          <div class="d-flex flex-column gap-1" v-for="(im, index) in question.answers.imgOptions" :key="index">
            <img hidden :ref="im.img"/>
            <img-uploader class="d-flex" :options="{aspectRatio: 1, showTitle: false}" :img_finish="im.img"/>
            <div class="hstack gap-2">
              <input type="radio" class="form-check-input my-auto" name="quiz-option" @click="setCorrectAnswer(index, 1)">
              <input type="text" placeholder="Подпись" v-model="im.text" class="form-control">
              <button class="btn btn-sm btn-danger border-0 h-100" @click="delImgOption(index)">
                <img src="/src/assets/icons/x-circle-fill.svg" height="20"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>

</style>