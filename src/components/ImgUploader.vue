<script setup>
import {Cropper} from "vue-advanced-cropper";
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.bubble.css';
import {ref} from "vue";

let props = defineProps(["options", "type", "img_finish"])

const img_state = ref({file: "", show: false, complete: false})
let img_selector = ref()
let img_cropper = ref()
let img_result = ref()
let defaultOptions = {
  checkOrientation: true,
  aspectRatio: 16 / 9
}
let crop_options = ref({})
if (!props.options) {
  crop_options.value = defaultOptions
} else {
  crop_options.value = props.options
}

function uploadImg() {
  img_selector.value.click();
  img_selector.value.onchange = function () {
    let reader = new FileReader();
    reader.readAsDataURL(img_selector.value.files[0]);
    reader.onload = function (e) {
      img_state.value.show = true
      img_state.value.file = e.target.result
    }
  }
}

function cropImg() {
  const {canvas} = img_cropper.value.getResult()
  canvas.toBlob((blob) => {
    if (props.img_finish) {
      props.img_finish.src = URL.createObjectURL(blob)
    }
    img_result.value.src = URL.createObjectURL(blob)
    img_result.value.onload = function () {
      img_state.value.show = false
      img_state.value.complete = true
    }
  })
}

// Загрузка изображения на сервер
function uploadToServer() {
  let formData = new FormData()
  formData.append('file', img_result.value.file)
  axios.post('/upload', formData, {
    headers: {
      'Content-Type':'multipart/form-data'
    }
  }).then(res => {
    if (res.data.success) {
      img_state.value.show = false
      img_state.value.complete = true
      img_result.value.src = res.data.url
    }
  })
}
</script>

<template>
  <section class="d-flex flex-wrap">
    <!-- Плейсхолдер изображения -->
    <div class="d-flex flex-column w-100 gap-2 img-placeholder overflow-hidden"
         :class="{'d-none': img_state.complete,
         'a-1-1': crop_options.aspectRatio === 1,
         'a-5-2': crop_options.aspectRatio === 5/2,
         'a-16-9': crop_options.aspectRatio === 16/9}"
         @click="!img_state.show ? uploadImg() : null">
      <div class="m-auto d-flex flex-column gap-2">
        <img alt="..." class="card-img"
             src="/src/assets/icons/file-earmark-image.svg"
             height="48"/>
        <span v-show="options.showTitle" class="text-muted mx-auto text-center">Нажмите чтобы выбрать изображение</span>
      </div>
    </div>
    <!-- Обрезанное изображения -->
    <div class="d-flex img-result border rounded overflow-hidden flex-grow-1"
         :class="{'d-none': !img_state.complete,
         'a-1-1': crop_options.aspectRatio === 1,
         'a-5-2': crop_options.aspectRatio === 5/2,
         'a-16-9': crop_options.aspectRatio === 16/9}"
         @click="!img_state.show ? uploadImg() : null">
      <img alt="..." class="card-img m-auto" src="" ref="img_result"/>
      <span v-show="options.showTitle" class="badge bg-dark fs-6 fw-normal">Нажмите чтобы выбрать новое изображение</span>
    </div>
    <input hidden ref="img_selector" accept="image/jpeg, image/png" type="file" class="form-control">

    <!-- Модальное окно обрезки изображения -->
    <section class="modal-background" v-if="img_state.show">
      <div class="modal-window">
        <div class="modal-content">
          <progress class="w-50 position-absolute" style="filter: saturate(0); z-index: 1"/>
          <cropper class="q-img-crop overflow-x-scroll cropper rounded" ref="img_cropper" style="z-index: 10"
                   :src="img_state.file" checkOrientation
                   :stencil-props="{aspectRatio: crop_options.aspectRatio}"/>
        </div>
        <div class="hstack px-2 pb-2">
          <button class="btn btn-outline-dark" @click="img_state.show = !img_state.show">Закрыть</button>
          <button class="btn btn-dark ms-auto" @click="cropImg">Обрезать</button>
        </div>
      </div>
    </section>
    <!-- Кнопка загрузки готового изображения на сервер -->
    <div v-show="img_state.complete" class="hstack mt-2">
      <button title="Сохранить на сервер" class="btn btn-outline-dark">Сохранить</button>
    </div>
  </section>
</template>

<style scoped>
.img-placeholder {
  position: relative;
  height: min-content;
  min-height: 12rem;
  border: 1px dashed black;
  border-radius: 0.5rem;
}

.img-result {
  position: relative;
  height: min-content;
  min-height: 12rem;

  flex: 1 1 auto;
  .badge {
    position: absolute;
    margin: 0.5rem;
  }
}

.a-1-1 {
  aspect-ratio: 1 / 1;
}

.a-5-2 {
  aspect-ratio: 5 / 2;
}

.a-16-9 {
  aspect-ratio: 16 / 9;
}

.img-placeholder:hover {
  cursor: pointer;
  background-color: #f2f2f2;
}

.q-img-crop {
  border-radius: 0.5rem;
  height: auto;
  max-height: 45rem;
  width: auto;
  max-width: 65rem;
  min-width: min-content;
}

.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  z-index: 100;
  align-items: center;
}

.modal-window {
  background-color: white;
  max-width: 70rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.modal-content {
  display: flex;
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  padding: 0.5rem;
  justify-content: center;
  align-items: center;
  max-height: 50rem;
}
</style>