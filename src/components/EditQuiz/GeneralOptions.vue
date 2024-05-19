<script setup>

import ImgUploader from "@/components/ImgUploader.vue";
import {ref} from "vue";

defineProps(["quiz_data", "bg", "state"])
const imgToUpload = ref()
</script>

<template>
  <section class="d-flex flex-column gap-2 card card-body rounded-4"
           :class="{'border-dark border-1' : $router.currentRoute.value.hash === '#general-settings'}">
    <div class="hstack">
      <span class="fs-5 text-uppercase">Параметры</span>
      <div class="form-check form-switch ms-auto">
        <label class="form-check-label" for="to_publish">Опубликовать</label>
        <input class="form-check-input" id="to_publish" v-model="quiz_data.to_publish" type="checkbox">
      </div>
    </div>
    <div class="form-floating">
      <input type="text" required placeholder="" class="form-control text-truncate" v-model="quiz_data.title"
             maxlength="48">
      <label for="title">Название (Макс. 48 символов)</label>
    </div>
    <div class="card">
      <quill-editor v-model:content="quiz_data.description" toolbar="essential" content-type="html"
                    placeholder="Описание викторины" theme="snow"></quill-editor>
    </div>
    <div class="img-upload-container row">
      <div class="col">
        <span class="fs-6 text-uppercase">Предпросмотр</span>
        <img hidden ref="imgToUpload"/>
        <img-uploader v-if="quiz_data.quiz_id === 0 || state.firstSaved"
                      @uploaded="(data) => quiz_data.img_preview = data"
                      :options="{aspectRatio: 1}" :img_finish="imgToUpload" :img_url="quiz_data.img_preview"
                      :context="{title: 'preview', quiz_id: quiz_data.quiz_id}"/>
      </div>
      <div class="col d-flex flex-column gap-2">
        <div class="row d-inline-flex d-none">
          <span class="fs-6 text-uppercase">Отображение викторины</span>
          <div class="btn-group">
            <input type="radio" @click="quiz_data.quiz_view = 0"
                   :checked="'checked' ? quiz_data.quiz_type === 0 : null"
                   class="btn-check" id="viewBoth" name="options-base" autocomplete="off" checked>
            <label class="btn btn-sm btn-outline-dark" for="viewBoth">Оба</label>
            <input type="radio" @click="quiz_data.quiz_view = 1"
                   :checked="'checked' ? quiz_data.quiz_type === 1 : null"
                   class="btn-check" id="viewMagnezius" name="options-base" autocomplete="off">
            <label class="btn btn-sm btn-outline-dark" for="viewMagnezius">Магнезиус</label>
            <input type="radio" @click="quiz_data.quiz_view = 2"
                   :checked="'checked' ? quiz_data.quiz_type === 2 : null"
                   class="btn-check" id="viewMuseum" name="options-base" autocomplete="off">
            <label class="btn btn-sm btn-outline-dark" for="viewMuseum">Музей Магнезит</label>
          </div>
        </div>
        <div class="row d-inline-flex">
          <span class="fs-6 text-uppercase">Тип викторины</span>
          <div class="btn-group">
            <input type="radio" @click="quiz_data.quiz_type = 0"
                   :checked="'checked' ? quiz_data.quiz_type === 0 : null"
                   class="btn-check" id="typeChildren" name="settings-type" autocomplete="off">
            <label class="btn btn-outline-dark btn-sm" for="typeChildren">Детский</label>
            <input type="radio" @click="quiz_data.quiz_type = 1"
                   :checked="'checked' ? quiz_data.quiz_type === 1 : null"
                   class="btn-check" id="typeAdult" name="settings-type" autocomplete="off">
            <label class="btn btn-outline-dark btn-sm" for="typeAdult">Взрослый</label>
          </div>
        </div>
        <div class="row d-inline-flex">
          <span class="fs-6 text-uppercase"
                title="Запрашивать имя в начале прохождения викторины">Запрашивать имя</span>
          <div class="btn-group">
            <input type="radio" @click="quiz_data.requiredName = true"
                   :checked="'checked' ? quiz_data.requiredName : null"
                   class="btn-check" id="reqNameOn" name="settings-reqName" autocomplete="off" checked>
            <label class="btn btn-outline-dark btn-sm" for="reqNameOn">Да</label>
            <input type="radio" @click="quiz_data.requiredName = false"
                   :checked="'checked' ? !quiz_data.requiredName : null"
                   class="btn-check" id="reqNameOff" name="settings-reqName" autocomplete="off">
            <label class="btn btn-outline-dark btn-sm" for="reqNameOff">Нет</label>
          </div>
        </div>
        <div class="row">
          <div class="hstack">
            <span class="fs-6 text-uppercase">Фон</span>
            <div class="form-check form-switch ms-auto">
              <label class="form-check-label" for="to_publish">Размыт</label>
              <input class="form-check-input" id="to_publish" v-model="quiz_data.blur_bg" type="checkbox">
            </div>
          </div>
          <img-uploader v-if="quiz_data.quiz_id === 0 || state.firstSaved"
                        @uploaded="(data) => quiz_data.img_bg = data"
                        :options="{aspectRatio: 16/9}" :img_finish="bg" :img_url="quiz_data.img_bg"
                        :context="{title: 'bg', quiz_id: quiz_data.quiz_id}"/>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>