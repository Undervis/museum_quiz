<script setup>
const props = defineProps(['question'])

function addOption() {
  let newOption = {
    text: '',
    isCorrect: false
  }
  props.question.options.push(newOption)
}

function delOption(option) {
  props.question.options.splice(props.question.options.indexOf(option), 1)
}
</script>

<template>
  <section class="d-flex gap-4 flex-column">
    <section class="card card-body d-flex gap-2">
      <div class="form-floating">
        <input class="form-control" placeholder="" id="questionTitle" v-model="question.title">
        <label for="questionTitle">Название вопроса</label>
      </div>
      <div class="form-floating">
      <textarea class="form-control" placeholder="" id="questionDescription" style="height: 100px"
                v-model="question.description"></textarea>
        <label for="questionDescription">Описание вопроса</label>
      </div>
    </section>

    <section class="card card-body d-flex gap-2">
      <div class="btn-group">
        <input type="radio" class="btn-check" id="typeOneOption" name="options-q-type" autocomplete="off" checked>
        <label class="btn btn-sm btn-outline-dark" for="typeOneOption">Один вариант ответа</label>
        <input type="radio" class="btn-check" id="typeManyOptions" name="options-q-type" autocomplete="off">
        <label class="btn btn-sm btn-outline-dark" for="typeManyOptions">Несколько вариантов ответа</label>
        <input type="radio" class="btn-check" id="typeSelectImg" name="options-q-type" autocomplete="off">
        <label class="btn btn-sm btn-outline-dark" for="typeSelectImg">Выбор изображения</label>
        <input type="radio" class="btn-check" id="typePuzzle" name="options-q-type" autocomplete="off">
        <label class="btn btn-sm btn-outline-dark" for="typePuzzle">Пазл</label>
      </div>
      <div class="d-flex gap-2 flex-column">
        <div class="d-flex flex-row justify-content-center" v-for="op in question.options">
          <input v-if="question.mode === 0" name="quiz-option" type="radio" class="mx-2" v-model="op.isCorrect">
          <input v-else-if="question.mode === 1" type="checkbox" class="mx-2" v-model="op.isCorrect">
          <div class="w-100">
            <input class="form-control" placeholder="" maxlength="64" v-model="op.text">
          </div>
          <button class="btn btn-sm btn-danger border-0 ms-2" @click="delOption(op)">
            <img src="/src/assets/icons/x-circle-fill.svg" height="20"/>
          </button>
        </div>
        <button class="btn btn-outline-dark" @click="addOption">
          <img height="20" src="/src/assets/icons/plus-lg.svg">
        </button>
      </div>
    </section>
  </section>
</template>

<style scoped>

</style>