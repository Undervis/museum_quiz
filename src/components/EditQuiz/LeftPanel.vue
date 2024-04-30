<script setup>
import {useRouter} from "vue-router";

const props = defineProps(['questions'])
let router = useRouter()

function isActive(index) {
  return router.currentRoute.value.hash === '#question-' + index
}
</script>

<template>
  <section class="sticky-top" style="z-index: 1">
    <div class="d-flex flex-column gap-2 card card-body rounded-4">
      <router-link :to="{hash: '#general'}">
        <button class="btn btn-outline-dark w-100"
                :class="{'active': $router.currentRoute.value.hash === '#general'}">Параметры
          <img alt="settings" class="ms-2" src="/src/assets/icons/gear-fill.svg"/>
        </button>
      </router-link>
      <span>Вопросы:</span>
      <div v-for="q in questions" :key="q.settings.index" class="d-flex flex-column">
        <router-link :to="{hash: '#question-' + q.settings.index}">
          <button class="btn btn-outline-dark w-100"
                  :class="{'active': isActive(q.settings.index)}">{{ q.settings.title }}
          </button>
        </router-link>
      </div>
      <button class="btn btn-outline-dark" @click="$emit('newQuestion')">
        <img alt="settings" src="/src/assets/icons/plus-lg.svg" height="22"/>
      </button>
    </div>
  </section>
</template>

<style scoped>

</style>