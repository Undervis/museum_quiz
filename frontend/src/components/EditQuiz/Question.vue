<script setup>
import Type_puzzle from "@/components/EditQuiz/questions/type_puzzle.vue";
import Type_image from "@/components/EditQuiz/questions/type_image.vue";
import Type_choose from "@/components/EditQuiz/questions/type_choose.vue";

defineProps(['question', 'quiz_data', 'state'])

</script>

<template>
  <section class="d-flex gap-4 flex-column border-2">
    <!-- Общие параметры вопроса -->
    <section class="card card-body d-flex gap-2 rounded-4"
             :class="{'border-dark border-1' : $router.currentRoute.value.hash === '#question-' + question.settings.index}">
      <div class="hstack gap-2">
        <div class="form-check form-switch">
          <label class="form-check-label" :for="'q'+question.settings.index + 'to_publish'">Отображается</label>
          <input class="form-check-input" :id="'q'+question.settings.index + 'to_publish'"
                 v-model="question.settings.visible" type="checkbox">
        </div>
        <button class="btn rounded-pill btn-sm btn-danger ms-auto d-flex justify-content-center border-0 py-2 gap-2"
                @click="$emit('deleteQuestion')">
          <img src="/src/assets/icons/x-circle-fill.svg" height="20"/>
          <span>Удалить</span>
        </button>
      </div>

      <div class="form-floating w-100">
        <input required class="form-control"
               placeholder="" id="questionTitle" v-model="question.settings.title">
        <label for="questionTitle">Название вопроса</label>
      </div>
      <div class="card">
        <quill-editor v-model:content="question.settings.text" toolbar="essential" content-type="html"
                      placeholder="Текст вопроса" theme="snow"></quill-editor>
      </div>
      <hr class="w-75 my-2 mx-auto">
      <!-- Режим вопроса -->
      <div class="btn-group">
        <input type="radio" class="btn-check" @click="question.settings.mode=0"
               :id="'q' + question.settings.index + 'typeOneOption'"
               :name="'options-q' + question.settings.index + '-type'"
               autocomplete="off" checked>
        <label class="btn rounded-start-pill btn-sm btn-outline-dark" :for="'q' + question.settings.index + 'typeOneOption'">Один вариант
          ответа</label>
        <input type="radio" class="btn-check" @click="question.settings.mode=1"
               :id="'q' + question.settings.index + 'typeManyOptions'"
               :name="'options-q' + question.settings.index + '-type'"
               autocomplete="off" :checked="'checked' ? question.settings.mode === 1 : null">
        <label class="btn btn-sm btn-outline-dark" :for="'q' + question.settings.index + 'typeManyOptions'">Несколько
          вариантов ответа</label>
        <input type="radio" class="btn-check" @click="question.settings.mode=2"
               :id="'q' + question.settings.index + 'typeSelectImg'"
               :name="'options-q' + question.settings.index + '-type'"
               autocomplete="off" :checked="'checked' ? question.settings.mode === 2 : null">
        <label class="btn btn-sm btn-outline-dark" :for="'q' + question.settings.index + 'typeSelectImg'">Выбор
          изображения</label>
        <input type="radio" class="btn-check" @click="question.settings.mode=3"
               :id="'q' + question.settings.index + 'typePuzzle'"
               :name="'options-q' + question.settings.index + '-type'"
               autocomplete="off" :checked="'checked' ? question.settings.mode === 3 : null">
        <label class="btn rounded-end-pill btn-sm btn-outline-dark" :for="'q' + question.settings.index + 'typePuzzle'">Пазл</label>
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
            <input type="radio" class="btn-check" @click="question.settings.scoreMode=0"
                   :id="'q' + question.settings.index + 'typeForAllScore'"
                   :name="'q' + question.settings.index + '-typeScore'"
                   :checked="'checked' ? question.settings.scoreMode === 0 : null"
                   autocomplete="off">
            <label class="btn rounded-start-pill btn-sm btn-outline-dark" :for="'q' + question.settings.index + 'typeForAllScore'">
              Только за все правильные ответы</label>
            <input type="radio" class="btn-check" @click="question.settings.scoreMode=1"
                   :id="'q' + question.settings.index + 'typeForEveryScore'"
                   :name="'q' + question.settings.index + '-typeScore'"
                   :checked="'checked' ? question.settings.scoreMode === 1 : null"
                   autocomplete="off">
            <label class="btn rounded-end-pill btn-sm btn-outline-dark" :for="'q' + question.settings.index + 'typeForEveryScore'">За
              каждый ответ по отдельности</label>
          </div>
        </div>
      </div>
      <!-- Варианты ответа -->
      <div v-if="question.settings.mode === 0 || question.settings.mode === 1" class="d-flex gap-2 flex-column">
        <type_choose :question="question"/>
      </div>
      <!-- Выбор изображения -->
      <div v-if="question.settings.mode === 2" class="d-flex flex-column">
        <type_image :question="question" :quiz_data="quiz_data" :state="state"/>
      </div>

      <!-- Пазл -->
      <section v-if="question.settings.mode === 3" class="d-flex flex-column gap-2">
        <type_puzzle :question="question" :quiz_id="quiz_data.quiz_id"/>
      </section>
    </section>
  </section>
</template>

<style scoped>

</style>