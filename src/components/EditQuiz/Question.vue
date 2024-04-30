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
  <section class="d-flex gap-4 flex-column border-2">
    <!-- Общие параметры вопроса -->
    <section class="card card-body d-flex gap-2 rounded-4"
             :class="{'border-dark border-1' : $router.currentRoute.value.hash === '#question-' + question.settings.index}">
      <div class="hstack gap-2">
        <div class="form-check form-switch">
          <label class="form-check-label" :for="'q'+question.settings.index + 'to_publish'">Отображается</label>
          <input class="form-check-input" :id="'q'+question.settings.index + 'to_publish'" v-model="question.settings.visible" type="checkbox">
        </div>
        <button class="btn btn-sm btn-danger ms-auto d-flex justify-content-center border-0 py-2 gap-2"
                @click="$emit('deleteQuestion')">
          <img src="/src/assets/icons/x-circle-fill.svg" height="20"/>
          <span>Удалить вопрос</span>
        </button>
      </div>

      <div class="form-floating w-100">
        <input required class="form-control" placeholder="" id="questionTitle" v-model="question.settings.title">
        <label for="questionTitle">Название вопроса</label>
      </div>
      <div class="form-floating">
      <textarea class="form-control" placeholder="" id="questionDescription" style="height: 100px"
                v-model="question.settings.text"></textarea>
        <label for="questionDescription">Текст вопроса</label>
      </div>
      <hr>
      <!-- Режим вопроса -->
      <div class="btn-group">
        <input type="radio" class="btn-check" @click="question.settings.mode=0" :id="'q' + question.settings.index + 'typeOneOption'"
               :name="'options-q' + question.settings.index + '-type'"
               autocomplete="off" checked>
        <label class="btn btn-sm btn-outline-dark" :for="'q' + question.settings.index + 'typeOneOption'">Один вариант ответа</label>
        <input type="radio" class="btn-check" @click="question.settings.mode=1" :id="'q' + question.settings.index + 'typeManyOptions'"
               :name="'options-q' + question.settings.index + '-type'"
               autocomplete="off">
        <label class="btn btn-sm btn-outline-dark" :for="'q' + question.settings.index + 'typeManyOptions'">Несколько вариантов ответа</label>
        <input type="radio" class="btn-check" @click="question.settings.mode=2" :id="'q' + question.settings.index + 'typeSelectImg'"
               :name="'options-q' + question.settings.index + '-type'"
               autocomplete="off">
        <label class="btn btn-sm btn-outline-dark" :for="'q' + question.settings.index + 'typeSelectImg'">Выбор изображения</label>
        <input type="radio" class="btn-check" @click="question.settings.mode=3" :id="'q' + question.settings.index + 'typePuzzle'"
               :name="'options-q' + question.settings.index + '-type'"
               autocomplete="off">
        <label class="btn btn-sm btn-outline-dark" :for="'q' + question.settings.index + 'typePuzzle'">Пазл</label>
      </div>
      <!-- Баллы -->
      <div class="d-flex flex-column gap-2">
        <div>
          <div class="form-floating">
            <input type="number" class="form-control" placeholder="" :id="'q' + question.settings.index + 'addScores'"
                   v-model="question.settings.addScoresPerAnswer" min="1" value="1">
            <label :for="'q' + question.settings.index + 'addScores'">Кол-во баллов за правильный ответ</label>
          </div>
        </div>
        <div v-if="question.settings.mode === 1">
          <span class="fs-6 text-uppercase">Режим начисления баллов</span>
          <div class="btn-group w-100">
            <input type="radio" class="btn-check" @click="question.scoreMode=0" :id="'q' + question.settings.index + 'typeForAllScore'"
                   :name="'q' + question.settings.index + '-typeScore'"
                   autocomplete="off" checked>
            <label class="btn btn-sm btn-outline-dark" :for="'q' + question.settings.index + 'typeForAllScore'">За все правильные ответы</label>
            <input type="radio" class="btn-check" @click="question.scoreMode=1" :id="'q' + question.settings.index + 'typeForEveryScore'"
                   :name="'q' + question.settings.index + '-typeScore'"
                   autocomplete="off">
            <label class="btn btn-sm btn-outline-dark" :for="'q' + question.settings.index + 'typeForEveryScore'">За каждый ответ по отдельности</label>
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
          <input v-if="question.settings.mode === 0" :name="'quiz' + question.settings.index + '-option'"
                 type="radio" class="mx-2" :checked="'checked' ? question.answers.correctOption.index === index : null"
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
        <button class="btn btn-outline-dark" @click="addOption">
          <img height="20" src="/src/assets/icons/plus-lg.svg">
        </button>
      </div>
      <!-- Выбор изображения -->
      <div v-if="question.settings.mode === 2" class="d-flex flex-column">
        <div class="alert alert-danger">
          <span>Изображения не сохраняются автоматически, сохраняйте их вручную с помощью соответствующей кнопки под изображением</span>
        </div>
        <div class="d-flex gap-4 flex-wrap justify-content-evenly">
          <div class="d-flex flex-column gap-1" style="flex: 0 1 13rem"
               v-for="(im, index) in question.answers.imgOptions" :key="index">
            <img hidden :ref="im.img"/>
            <img-uploader :options="{aspectRatio: 1, showTitle: false}" :img_finish="im.img"/>
            <div class="input-group">
              <div class="input-group-text">
                <input type="radio" class="form-check-input my-auto" :disabled="!im.img"
                       :name="'quiz' + question.settings.index + '-option'" @click="setCorrectAnswer(index, 1)">
              </div>
              <input type="text" placeholder="Подпись" v-model="im.text" class="form-control" :disabled="!im.img">
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