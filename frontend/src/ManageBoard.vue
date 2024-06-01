<script setup>
import {inject, onMounted, ref} from "vue";
import axios from "axios";
import Toast_container from "@/components/toast_container.vue";
import {useToast} from "vue-toastification";
import LoaderBars from "@/components/loaderBars.vue";
import {useRouter} from "vue-router";
import ConfirmModal from "@/components/confirmModal.vue";
import HeaderSearch from "@/components/headerSearch.vue";
import Statistic from "@/components/statistic.vue";

const toast = useToast()
const router = useRouter()

const api_url = inject('api_url')
const data = ref(false)
const filteredData = ref({})
const showDescription = ref({
  show: false,
  id: -1
})

const showStatistic = ref({
  show: false,
  quiz_id: -1
})

const confirmModal = ref({
  show: false,
  id: -1
})

const state = ref({
  loading: false
})

function openPreview(quiz_id) {
  let url = router.resolve({name: 'Quiz', params: {id: quiz_id}})
  window.open(url.href, '_blank')
}

function deleteQuiz(quiz_id) {
  state.value.loading = true
  axios.delete(`${api_url}/delete_quiz/${quiz_id}`, {headers: {'Authorization': `Token ${localStorage.getItem('token')}`}})
      .then(() => {
        axios.get(`${api_url}/get_quizes/`)
            .then((response) => {
              data.value = response.data
              filteredData.value = data.value
              data.value.showDescription = false
              confirmModal.value.show = false
              confirmModal.value.id = -1
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

function convertDate(date) {
  let d = new Date(date.$date)
  return d.toLocaleString('ru-Ru')
}

onMounted(() => {
  if (!localStorage.getItem('token')) {
    router.replace('/login')
  } else {
    state.value.loading = true
    axios.get(`${api_url}/get_quizes/`, {headers: {'Authorization': `Token ${localStorage.getItem('token')}`}})
        .then((response) => {
          data.value = response.data
          filteredData.value = data.value
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
  }
})
</script>

<template>
  <loader-bars v-if="state.loading"/>
  <confirm-modal v-if="confirmModal.show" title="Действительно удалить запись?"
                 msg="Это действие невозможно отменить!"
                 @confirm="deleteQuiz(confirmModal.id)" @dismiss="confirmModal.show = false"
  />
  <statistic @dismiss="showStatistic.show = false" v-if="showStatistic.show" :quiz_id="showStatistic.quiz_id"/>
  <section class="container">
    <div class="hstack gap-3 py-4">
      <button title="Выход из аккаунта"
          @click="$router.replace('/logout')" class="btn btn-danger rounded-pill">Выйти</button>
      <button @click="$router.push('/')"
              class="btn btn-outline-dark d-flex text-nowrap justify-content-center gap-2 align-items-center ms-auto rounded-pill">
        <span>На главную</span>
        <img src="/src/assets/icons/house.svg"/>
      </button>
      <header-search v-if="data" :data="data" context="manage" @filtered="filtered => filteredData = filtered"/>
      <router-link :to="{name:'EditQuiz', params: {id: 0}}">
        <button class="btn btn-dark rounded-pill ms-auto text-nowrap">
          <span>Создать новую</span>
          <img class="ms-2" style="filter: invert(1)" src="/src/assets/icons/file-earmark-plus.svg">
        </button>
      </router-link>
    </div>

    <section class="vstack gap-2 mb-4">
      <div v-if="data.length === 0" class="alert rounded-4 alert-info">Викторин нет, самое время создать новую!</div>
      <div v-for="quiz in filteredData" class="card rounded-4 overflow-hidden">
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
                  <span class="text-muted" title="Дата последнего изменения"><b>ДПИ:</b>
                    {{ convertDate(quiz.last_save) }}</span>
                  <div class="vr h-75 my-auto"/>
                  <div class="btn-group">
                    <button v-if="quiz.description"
                            @click="showDescription.show = true; showDescription.id = quiz.quiz_id"
                            class="btn rounded-start-pill btn-sm btn-outline-dark">Описание
                    </button>
                    <button disabled v-else class="btn rounded-start-pill btn-dark btn-sm mb-0">Описания нет</button>
                    <button @click="showStatistic.show = true; showStatistic.quiz_id = quiz.quiz_id"
                        class="btn rounded-end-pill btn-sm btn-outline-dark">Статистика</button>
                  </div>
                  <div class="vr h-75 my-auto"/>
                  <button @click="openPreview(quiz.quiz_id)"
                          title="Решение викторины даже если она не опубликована"
                          class="btn rounded-pill btn-sm btn-outline-dark">Предпросмотр
                  </button>
                  <div class="btn-group ms-auto">
                    <router-link class="btn rounded-start-pill btn-sm btn-dark  text-nowrap"
                                 :to="{name:'EditQuiz', params: {id: quiz.quiz_id}}">Изменить
                    </router-link>
                    <button type="button" @click="confirmModal.show = true; confirmModal.id = quiz.quiz_id;"
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
                      <div class="col"><b>Тема: </b></div>
                      <div class="col">{{ quiz.theme === "classic" ? 'Классическая' : 'Современная' }}</div>
                    </div>
                    <div class="row">
                      <div class="col"><b>Отображать результаты:</b></div>
                      <div class="col">{{ quiz.showResults ? 'Да' : 'Нет' }}</div>
                    </div>
                  </section>
                </div>
              </div>

              <section id="dialogModal" class="modal-background"
                       v-if="showDescription.show === true && showDescription.id === quiz.quiz_id">
                <div class="modal-window rounded-4">
                  <div class="hstack p-4 border-bottom">
                    <h5 class="modal-title">{{ quiz.title }}</h5>
                    <button @click="showDescription.show = false"
                            class="btn ms-auto btn-close">
                    </button>
                  </div>
                  <div class="modal-content p-4">
                    <div v-html="quiz.description" class="card-text description"></div>
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