<script setup>

import ImgUploader from "@/components/ImgUploader.vue";

defineProps(["quiz_data"])
</script>

<template>
  <section class="d-flex flex-column gap-2">
    <div class="hstack">
      <span class="fs-4">Параметры</span>
      <div class="form-check form-switch ms-auto">
        <label class="form-check-label" for="to_publish">Опубликовать</label>
        <input class="form-check-input" id="to_publish" v-model="quiz_data.to_publish" type="checkbox">
      </div>
    </div>
    <div class="img-upload-container row">
      <div class="col">
        <span class="fs-5">Превью квиза</span>
        <img-uploader :options="{aspectRatio: 1}"/>
      </div>
      <div class="col">
        <span class="fs-5">Фон квиза</span>
        <img-uploader :options="{aspectRatio: 16/9}"/>
        <span class="fs-5">Или выберите из ранее использованных</span>
      </div>



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
</template>

<style scoped>

</style>