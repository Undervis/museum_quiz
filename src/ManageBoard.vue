<script setup>
import {inject, onMounted, ref} from "vue";
import axios from "axios";
import LoaderFigures from "@/components/loaderFigures.vue";
import Toast_container from "@/components/toast_container.vue";
import {useToast} from "vue-toastification";
import LoaderBars from "@/components/loaderBars.vue";
import {useRouter} from "vue-router";

const toast = useToast()
const router = useRouter()

const searchQuery = ref("")
const api_url = inject('api_url')
const data = ref({})
const showDescription = ref({
  show: false,
  id: -1
})

const state = ref({
  loading: false
})

function deleteQuiz(quiz_id) {
  if (confirm("Действительно удалить запись?")) {
    state.value.loading = true
    axios.delete(`${api_url}/delete_quiz/${quiz_id}`)
        .then(() => {
          axios.get(`${api_url}/get_quizes/`)
              .then((response) => {
                data.value = response.data
                data.value.showDescription = false
                state.value.loading = false
              })
              .catch((error) => {
                console.error(error)
                state.value.loading = false
              })
        })
        .catch((error) => {
          console.error(error)
          state.value.loading = false
        })
  }

}

function convertDate(date) {
  let d = new Date(date.$date)
  return d.toLocaleString('ru-Ru')
}

onMounted(() => {
  state.value.loading = true
  axios.get(`${api_url}/get_quizes/`)
      .then((response) => {
        data.value = response.data
        data.value.showDescription = false
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
  <section class="container">
    <div class="hstack gap-3 my-4">
      <button @click="$router.push('/')"
            class="btn btn-outline-dark d-flex text-nowrap justify-content-center gap-2 align-items-center ms-auto rounded-pill">
          <span>На главную</span>
          <img src="/src/assets/icons/house.svg"/>
        </button>
      <span class="fs-3">ВИКТОРИНЫ</span>
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
      <router-link :to="{name:'EditQuiz', params: {id: 0}}">
        <button class="btn btn-dark rounded-pill ms-auto text-nowrap">
          <span>Создать новую</span>
          <img class="ms-2" style="filter: invert(1)" src="/src/assets/icons/file-earmark-plus.svg">
        </button>
      </router-link>
    </div>

    <section class="vstack gap-2 mb-4">
      <div v-if="data.length === 0" class="alert rounded-4 alert-info">Викторин нет, самое время создать новую!</div>
      <div v-for="quiz in data" class="card rounded-4 overflow-hidden">
        <div class="row g-0">
          <div class="col-2 border-end">
            <img v-if="quiz.img_preview" class="img-fluid" :src="`${api_url}/get_img/${quiz.img_preview}`"/>
            <img v-else class="img-fluid" src="/src/assets/icons/no-image.svg"/>
          </div>
          <div class="col d-flex flex-column">
            <div class="card-header hstack gap-2">
              <div class="d-flex flex-column w-100">
                <span class="fs-4">{{ quiz.title }}</span>
                <div class="hstack gap-2">
                  <span v-if="quiz.to_publish" class="badge rounded-pill fw-normal bg-success">Опубликована</span>
                  <span v-else class="badge rounded-pill fw-normal bg-secondary">Не опубликована</span>
                  <div class="vr h-75 my-auto"/>
                  <span class="text-muted" title="Дата создания"><b>ДС:</b> {{ convertDate(quiz.first_save) }}</span>
                  <span class="text-muted" title="Дата последнего изменения"><b>ДПИ:</b> {{ convertDate(quiz.last_save) }}</span>
                  <div class="vr h-75 my-auto"/>
                  <div class="btn-group">
                    <button v-if="quiz.description"
                            @click="showDescription.show = true; showDescription.id = quiz.quiz_id"
                            class="btn rounded-start-pill btn-sm btn-outline-dark">Описание
                    </button>
                    <button disabled v-else class="btn rounded-start-pill btn-dark btn-sm mb-0">Описания нет</button>
                    <button class="btn rounded-end-pill btn-sm btn-outline-dark">Статистика</button>
                  </div>
                  <div class="vr h-75 my-auto"/>
                  <button class="btn rounded-pill btn-sm btn-outline-dark">Предпросмотр</button>
                  <div class="btn-group ms-auto">
                    <router-link class="btn rounded-start-pill btn-sm btn-dark  text-nowrap"
                                 :to="{name:'EditQuiz', params: {id: quiz.quiz_id}}">Изменить
                    </router-link>
                    <button type="button" @click="deleteQuiz(quiz.quiz_id)"
                            class="btn rounded-end-pill btn-sm btn-danger  text-nowrap">Удалить
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="row h-100">
                <div class="col d-flex flex-column gap-3">
                  <section class="h-100 d-flex gap-1 flex-column justify-content-between">
                    <div class="row">
                      <div class="col"><b>Кол-во вопросов:</b></div>
                      <div class="col">{{ quiz.questions.length }}</div>
                    </div>
                    <div class="row">
                      <div class="col"><b>Категория:</b></div>
                      <div v-if="quiz.quiz_type === 0" class="col">Детская</div>
                      <div v-else class="col">Взрослая</div>
                    </div>
                    <div class="row">
                      <div class="col"><b>Запрашивать имя:</b></div>
                      <div v-if="quiz.requiredName" class="col">Да</div>
                      <div v-else class="col">Нет</div>
                    </div>
                  </section>
                </div>
                <div class="col d-flex flex-column gap-3">
                  <section class="h-100 d-flex gap-1 flex-column justify-content-between">
                    <div class="row">
                      <div class="col"><b>Кол-во ответов:</b></div>
                      <div class="col">{{ quiz.answers_count }}</div>
                    </div>
                    <div class="row" title="Средний процент правильных ответов">
                      <div class="col"><b>СППО:</b></div>
                      <div class="col">73%</div>
                    </div>
                    <div class="row">
                      <div class="col"><b>Средний балл:</b></div>
                      <div class="col">70/140</div>
                    </div>
                  </section>
                </div>
              </div>

              <section class="modal-background"
                       v-if="showDescription.show === true && showDescription.id === quiz.quiz_id">
                <div class="modal-window">
                  <div class="modal-content">
                    <div v-html="quiz.description" class="card-text description"></div>
                  </div>
                  <div class="hstack px-2 pb-2">
                    <button type="button" @click="showDescription.show = false"
                            class="btn btn-outline-dark">Закрыть
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>

</style>