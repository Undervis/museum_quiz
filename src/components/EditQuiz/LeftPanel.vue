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
    <div class="card rounded-4">
      <div class="d-flex flex-column gap-2 card-body pe-2 me-2 overflow-y-scroll" style="max-height: 87vh">
        <router-link :to="{hash: '#general-settings'}">
          <button class="btn btn-outline-dark w-100"
                  :class="{'active': $router.currentRoute.value.hash === '#general-settings'}">Параметры
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

    </div>
  </section>
</template>

<style scoped>
.card {
  transition: all 0.2s ease;
}

.pinned .card {
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}
</style>