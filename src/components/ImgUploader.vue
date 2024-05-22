<script setup>
import {Cropper} from "vue-advanced-cropper";
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.bubble.css';
import {inject, defineEmits, onMounted, ref} from "vue";
import axios from "axios";

let props = defineProps(["options", "type", "img_finish", "context", "img_url"])
const api_url = inject('api_url')
const emit = defineEmits(['uploaded'])

const img_state = ref({
  file: "", showModal: false,
  complete: false, uploaded: false,
  loadedFromServer: false, uploadedToServer: false
})

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

onMounted(() => {
  if (props.img_url && !img_state.value.loadedFromServer) {
    img_result.value.src = api_url + '/get_img/' + props.img_url
    img_state.value.complete = true
    if (props.img_finish) {
      props.img_finish.src = api_url + '/get_img/' + props.img_url
    }
    img_state.value.loadedFromServer = true
  }
})


function uploadImg() {
  img_selector.value.click();
  img_selector.value.onchange = function () {
    let reader = new FileReader();
    reader.readAsDataURL(img_selector.value.files[0]);
    reader.onload = function (e) {
      img_state.value.showModal = true
      img_selector.value.file = e.target.result
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
    img_result.value.file = blob
    img_result.value.onload = function () {
      img_state.value.showModal = false
      img_state.value.complete = true
      img_state.value.uploaded = true
    }
  })
}

// Загрузка изображения на сервер
function uploadToServer() {
  let formData = new FormData()
  let img_file = new File([img_result.value.file], "image.jpg", {type: "image/jpeg"})
  formData.append('image', img_file)
  formData.append('context', props.context.title)
  if (props.context.title === "option-img") {
    formData.append('question_index', props.context.questionIndex)
    formData.append('option_index', props.context.optionIndex)
  }
  axios.post(api_url + '/upload_img/' + props.context.quiz_id, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((res) => {
    console.log(res)
    img_state.value.loadedFromServer = false
    img_state.value.uploadedToServer = true
    emit('uploaded', res.data.file_name)
    img_result.value.src = api_url + '/get_img/' + res.data.file_name
  }).catch((error) => {
    console.log(error)
  })
}

</script>

<template>
  <section>
    <div class="d-flex flex-wrap w-100 h-100"
         :class="{'a-1-1': crop_options.aspectRatio === 1,
         'a-5-2': crop_options.aspectRatio === 5/2,
         'a-16-9': crop_options.aspectRatio === 16/9}">
      <!-- Плейсхолдер изображения -->
      <div class="d-inline-flex flex-column gap-2 img-placeholder overflow-hidden flex-grow-1 h-100"
           :class="{'d-none': img_state.complete}" style="cursor:pointer"
           title="Нажмите, чтобы выбрать изображение"
           @click="!img_state.showModal ? uploadImg() : null">
        <div class="m-auto d-inline-flex flex-column gap-2">
          <img alt="..." class="card-img"
               src="/src/assets/icons/file-earmark-image.svg"
               height="48"/>
        </div>
      </div>
      <!-- Обрезанное изображения -->
      <div class="d-inline-flex img-result border rounded-4 overflow-hidden"
           :class="{'d-none': !img_state.complete}" style="cursor:pointer"
           title="Нажмите, чтобы выбрать изображение"
           @click="!img_state.showModal ? uploadImg() : null">
        <img alt="..." class="card-img m-auto" src="" ref="img_result"/>
      </div>
      <input hidden ref="img_selector" accept="image/jpeg, image/png" type="file" class="form-control">
      <!-- Кнопка загрузки готового изображения на сервер -->
      <div v-if="img_state.uploaded" class="d-flex gap-2 flex-column mt-2 w-100">
        <div v-if="!img_state.uploadedToServer" class="bg-warning rounded text-center p-1">
          <span class="text-dark">Изображение не сохранено на сервер!</span>
        </div>
        <div v-if="img_state.uploadedToServer" class="bg-success rounded text-center p-1">
          <span class="text-white">Сохранено</span>
        </div>
        <button title="Сохранить на сервер" @click.prevent="uploadToServer"
                v-if="!img_state.uploadedToServer"
                class="btn btn-outline-dark w-100">Сохранить
        </button>
      </div>
    </div>

    <!-- Модальное окно обрезки изображения -->
    <section class="modal-background" v-if="img_state.showModal">
      <div class="modal-window">
        <div class="modal-content">
          <progress class="w-50 position-absolute" style="filter: saturate(0); z-index: 1"/>
          <cropper class="q-img-crop overflow-x-scroll cropper rounded" ref="img_cropper" style="z-index: 10"
                   :src="img_selector.file" checkOrientation
                   :stencil-props="{aspectRatio: crop_options.aspectRatio}"/>
        </div>
        <div class="hstack px-2 pb-2">
          <button class="btn btn-outline-dark" @click.prevent="img_state.showModal = !img_state.showModal">Закрыть
          </button>
          <button class="btn btn-dark ms-auto" @click.prevent="cropImg">Обрезать</button>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.img-placeholder {
  position: relative;
  height: min-content;
  min-height: 12rem;
  border: 1px dashed black;
  border-radius: 1rem;
}

.img-result {
  position: relative;
  height: min-content;
  min-height: 12rem;
  flex: 1 1 auto;
  transition: 0.2s ease;

  > img {
    object-fit: contain;
    display: inline-flex;
    flex: 1 1 auto;
  }

  .badge {
    position: absolute;
    margin: 0.5rem;
  }
}

.img-result:hover {
  cursor: pointer;
  filter: brightness(80%);
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
  border-radius: 1rem;
  height: auto;
  max-height: 45rem;
  width: auto;
  max-width: 65rem;
  min-width: min-content;
}


</style>