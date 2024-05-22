<script setup>
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

function setCorrectAnswer(index, type) {
  props.question.answers.correctOption.index = index
  props.question.answers.correctOption.type = type
}
</script>

<template>
  <div class="d-flex flex-row justify-content-center" v-for="(op, index) in question.answers.options">
    <input v-if="question.settings.mode === 0" :name="'quiz' + question.settings.index + '-option'"
           type="radio" class="mx-2 rounded-pill" :checked="'checked' ? question.answers.correctOption.index === index : null"
           @click="setCorrectAnswer(index, 0)">
    <input v-else-if="question.settings.mode === 1" type="checkbox" class="mx-2" v-model="op.isCorrect">
    <div class="w-100">
      <input class="form-control rounded-pill" required placeholder="Вариант ответа" maxlength="64" v-model="op.text">
    </div>
    <button style="aspect-ratio: 1" class="btn btn-sm btn-danger rounded-circle border-0 ms-2" @click="delOption(op)">
      <img src="/src/assets/icons/x-circle-fill.svg" height="20"/>
    </button>
  </div>
  <!-- Добавление варианта ответа -->
  <button class="btn rounded-pill btn-outline-dark" @click="addOption">
    <img height="20" src="/src/assets/icons/plus-lg.svg">
  </button>
</template>

<style scoped>

</style>