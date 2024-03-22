<script setup>

import ImgUploader from "@/components/ImgUploader.vue";
import {ref} from "vue";

defineProps(["quiz_data", "bg"])
const imgToUpload = ref()
</script>

<template>
  <section class="d-flex flex-column gap-2 card card-body">
    <div class="hstack">
      <span class="fs-5 text-uppercase">Параметры</span>
      <div class="form-check form-switch ms-auto">
        <label class="form-check-label" for="to_publish">Опубликован</label>
        <input class="form-check-input" id="to_publish" v-model="quiz_data.to_publish" type="checkbox">
      </div>
    </div>
    <div class="form-floating">
      <input type="text" placeholder="" class="form-control text-truncate" v-model="quiz_data.title" maxlength="48">
      <label for="title">Название (Макс. 48 символов)</label>
    </div>
    <div class="form-floating">
      <textarea type="" style="height: 100px" placeholder="" class="form-control" v-model="quiz_data.description"></textarea>
      <label for="description">Краткое описание</label>
    </div>
    <div class="img-upload-container row">
      <div class="col">
        <span class="fs-6 text-uppercase">Превью квиза</span>
        <img hidden ref="imgToUpload"/>
        <img-uploader :options="{aspectRatio: 1}" :img_finish="imgToUpload"/>
      </div>
      <div class="col d-flex flex-column gap-2">
        <div class="row">
          <span class="fs-6 text-uppercase">Фон квиза</span>
          <img-uploader :options="{aspectRatio: 16/9}" :img_finish="bg"/>
        </div>
        <div class="row">
          <span class="fs-6 text-uppercase">Отображение квиза</span>
          <div class="btn-group">
            <input type="radio" class="btn-check" id="viewBoth" name="options-base" autocomplete="off" checked>
            <label class="btn btn-sm btn-outline-dark" for="viewBoth">Оба</label>
            <input type="radio" class="btn-check" id="viewMagnezius" name="options-base" autocomplete="off">
            <label class="btn btn-sm btn-outline-dark" for="viewMagnezius">Магнезиус</label>
            <input type="radio" class="btn-check" id="viewMuseum" name="options-base" autocomplete="off">
            <label class="btn btn-sm btn-outline-dark" for="viewMuseum">Музей Магнезит</label>
          </div>
        </div>
        <div class="row">
          <span class="fs-6 text-uppercase">Тип квиза</span>
          <div class="btn-group">
            <input type="radio" class="btn-check" id="typeChildren" name="options-type" autocomplete="off" checked>
            <label class="btn btn-outline-dark btn-sm" for="typeChildren">Детский</label>
            <input type="radio" class="btn-check" id="typeAdult" name="options-type" autocomplete="off">
            <label class="btn btn-outline-dark btn-sm" for="typeAdult">Взрослый</label>
          </div>
        </div>
        <div class="row">
          <span class="fs-6 text-uppercase" title="Запрашивать имя в начале прохождения квиза">Запрашивать имя</span>
          <div class="btn-group">
            <input type="radio" class="btn-check" id="reqNameOn" name="options-reqName" autocomplete="off" checked>
            <label class="btn btn-outline-dark btn-sm" for="reqNameOn">Да</label>
            <input type="radio" class="btn-check" id="reqNameOff" name="options-reqName" autocomplete="off">
            <label class="btn btn-outline-dark btn-sm" for="reqNameOff">Нет</label>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>