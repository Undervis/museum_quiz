<script setup>
import {useRouter} from "vue-router";

const props = defineProps(['questions'])
let router = useRouter()

function isActive(index) {
  return router.currentRoute.value.query.question === index.toString()
}
</script>

<template>
  <div class="d-flex flex-column gap-2">
    <button @click="$router.replace({query: {general: 0}})" class="btn btn-outline-dark"
            :class="{'active': $router.currentRoute.value.query.general}">Параметры
      <img alt="settings" class="ms-2" src="/src/assets/icons/gear-fill.svg"/>
    </button>
    <span>Вопросы:</span>
    <transition-group name="fade-left">
      <div v-for="(q, index) in props.questions" :key="index" class="d-flex position-relative">
        <button @click="$router.replace({query: {question: index}})"
                class="btn btn-outline-dark flex-grow-1"
                :class="{'active': isActive(index)}">{{ q.title }}
        </button>
      </div>
    </transition-group>
    <button class="btn btn-outline-dark" @click="$emit('newQuestion')">
      <img alt="settings" src="/src/assets/icons/plus-lg.svg" height="22"/>
    </button>
  </div>
</template>

<style scoped>

</style>