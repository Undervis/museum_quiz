<script setup>
import {inject, onMounted, ref} from "vue";
import axios from "axios";
import Toast_container from "@/components/toast_container.vue";
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
import LoaderBars from "@/components/loaderBars.vue";
import $ from 'jquery'
import Start_button from "@/components/start_button.vue";

const toast = useToast()
const router = useRouter()

const searchQuery = ref("")
const api_url = inject('api_url')
const data = ref([])
const state = ref({
  loading: false
})

function toggleDescription(quiz_id) {
  $('#description-' + quiz_id).slideToggle(500)
  $('#toggle-icon-' + quiz_id).toggleClass('rotate-180')
}

document.title = "Викторины"

onMounted(() => {
  state.value.loading = true
  axios.get(`${api_url}/get_quizes/`)
      .then((response) => {
        data.value = response.data
        data.value = data.value.filter(e => e.to_publish)
        state.value.loading = false
      })
      .catch((error) => {
        console.error(error)
        let toast_content = {
          component: Toast_container,
          props: {
            msg: "Ошибка при загрузке данных",
            data: error
          }
        }
        toast.error(toast_content, {timeout: 10000, closeButton: false})
        setTimeout(() => {
          router.go()
        }, 10000)
      })
})
</script>

<template>
  <loader-bars v-if="state.loading"/>
  <main class="container">
    <div class="hstack gap-3 my-4">
      <img height="46" src="/src/assets/logo.svg"/>
      <input type="search" class="form-control rounded-pill" v-model="searchQuery" placeholder="Поиск...">
      <div class="btn-group">
        <button type="button" class="btn rounded-start-pill btn-outline-dark text-nowrap">
          <span>Фильтры</span>
          <img class="ms-2" src="/src/assets/icons/funnel.svg">
        </button>
        <button type="button" class="btn rounded-end-pill btn-outline-dark text-nowrap">
          <span>Сортировка</span>
          <img class="ms-2" src="/src/assets/icons/sort-alpha-down.svg">
        </button>
      </div>
    </div>

    <section v-if="data.length > 0">
      <span class="fs-3">ВИКТОРИНЫ</span>
      <div class="d-flex flex-wrap gap-4 mb-4">
        <div v-for="item in data" :key="item.quiz_id" class="col"
             style="flex-basis: 20rem; max-width: 40rem; aspect-ratio: 1">
          <div class="card rounded-4 overflow-hidden h-100">
            <div class="position-relative d-flex">
              <section class="position-absolute top-0 end-0">
                <div class="hstack d-flex m-3 bg-light rounded-pill">
                  <div class="d-flex justify-content-center card-body py-1 px-2">
                    <img v-if="item.quiz_type === 0" title="Категория: Детская" height="16"
                         src="/src/assets/icons/joystick.svg"/>
                    <img v-else title="Категория: Взрослая" height="16" src="/src/assets/icons/person-fill.svg"/>
                  </div>
                  <div class="vr my-auto h-75"/>
                  <div title="Кол-во вопросов"
                       class="card-body align-items-center d-flex justify-content-center py-1 px-2">
                    <span class="me-2">{{ item.questions.length }}</span>
                    <img height="16" src="/src/assets/icons/patch-question-fill.svg"/>
                  </div>
                  <div class="vr my-auto h-75"/>
                  <div title="Кол-во ответов"
                       class="card-body align-items-center d-flex justify-content-center py-1 px-2">
                    <span class="me-2">{{ item.answers_count }}</span>
                    <img height="16" src="/src/assets/icons/person-raised-hand.svg"/>
                  </div>
                </div>
              </section>
              <div @click="$router.push({name: 'Quiz', params: {id: item.quiz_id}})"
                   class="position-absolute border-2 top-50 start-50 button-go translate-middle">
                <start_button/>
              </div>
              <section class="position-absolute bottom-0 start-0 w-100">
                <div class="text-center p-4"
                     style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.8), transparent);">
                  <h4 class="card-title text-light mb-0">{{ item.title }}</h4>
                  <div v-if="item.description" style="cursor: pointer" @click="toggleDescription(item.quiz_id)">
                    <span class="text-light text-decoration-underline me-2">Описание</span>
                    <img :id="`toggle-icon-${item.quiz_id}`" class="toggle-icon" style="filter: invert(1)"
                         src="/src/assets/icons/caret-up-fill.svg"/>
                  </div>
                  <div v-else style="cursor: default">
                    <span class="text-light text-decoration-underline me-2">Описания нет</span>
                  </div>
                </div>

                <div class="p-4 pt-0" style="backdrop-filter: brightness(20%); display: none;"
                     :id="`description-${item.quiz_id}`">
                  <div class="card-text overflow-y-scroll description text-light" style="height: 18rem"
                       v-html="item.description"></div>
                </div>
              </section>
              <img v-if="item.img_preview" :src="`${api_url}/get_img/${item.img_preview}`" class="card-img-top">
              <img v-else class="card-img-top" src="/src/assets/icons/no-image.svg"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.button-go {
  opacity: 0;
  transition: 0.2s ease;
}

.col > .card {
  .card-img-top {
    transform: scale(1);
    z-index: 0;
    transition: 0.2s ease;
  }

  * {
    z-index: 1;
  }
}

.col > .card:hover {
  .card-img-top {
    filter: blur(3px);
    transform: scale(1.1);
    z-index: 0;
  }

  * {
    z-index: 1;
  }

  .button-go {
    opacity: 100;
  }
}

.toggle-icon {
  transform: rotate(0);
  transition: 0.5s ease;
}

.rotate-180.toggle-icon {
  transform: rotate(180deg);
}

</style>