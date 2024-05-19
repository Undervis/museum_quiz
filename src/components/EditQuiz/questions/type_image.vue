<script setup>

import ImgUploader from "@/components/ImgUploader.vue";
import {onMounted} from "vue";

const props = defineProps(['question', 'quiz_data', 'state'])

function setCorrectAnswer(index, type) {
  props.question.answers.correctOption.index = index
  props.question.answers.correctOption.type = type
}

function getQuestionIndex(question) {
  return props.quiz_data.questions.findIndex(q => q.settings.index === question.settings.index)
}

onMounted(() => {
  if (props.question.answers.imgOptions.length === 0) {
    for (let i = 0; i < 8; i++) {
      props.question.answers.imgOptions.push(
          {
            used: false,
            file: null
          }
      )
    }
  }
})
</script>

<template>
  <div class="alert alert-danger p-2">
    <span>Изображения не сохраняются автоматически, сохраняйте их вручную</span>
  </div>
  <div class="d-flex gap-4 flex-wrap justify-content-evenly">
    <div class="d-flex flex-column gap-1" style="flex: 0 1 13rem"
         v-for="(img, index) in question.answers.imgOptions" :key="img">
      <img-uploader :id="'quiz' + question.settings.index + '-option'"
                    v-if="quiz_data.quiz_id === 0 || state.firstSaved" :img_url="img.file"
                    :context="{title: 'option-img', quiz_id: quiz_data.quiz_id, questionIndex: getQuestionIndex(question), optionIndex: (index)}"
                    :options="{aspectRatio: 1, showTitle: false}" @uploaded="e => img.file = e"
      />
      <div class="input-group">
        <div class="input-group-text gap-2" title="Используется в вопросе">
          <input type="checkbox" v-model="img.used"
                 class="form-check-input my-auto"
                 :id="'q' + question.settings.index + '-img' + index + '-use-'">
          <label :for="'q' + question.settings.index + '-img' + index + '-use-'"
                 class="form-check-label">Использовать</label>
        </div>
        <div class="input-group-text flex-grow-1 justify-content-center">
          <input :disabled="'disabled' ? !img.used : null"
                 type="radio" class="form-check-input my-auto"
                 :checked="'checked' ? question.answers.correctOption.index === (index) : null"
                 :name="'quiz' + question.settings.index + '-option'"
                 title="Правильный ответ"
                 @click="setCorrectAnswer(index, 1)">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>