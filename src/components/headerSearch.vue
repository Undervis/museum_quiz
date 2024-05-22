<script setup>
import {ref, watch} from "vue";

const props = defineProps(['data', 'context'])
const emit = defineEmits(['filtered'])

const searchQuery = ref('')
const sortOptions = ref({
  name: 'title',
  reversed: false,
})

const showDropdown = ref({
  filter: false,
  sort: false
})

const filteredData = ref(props.data)

watch(searchQuery, async () => {
  if (searchQuery !== '') {
    filteredData.value = props.data.filter(item => {
      return item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    })
  } else {
    filteredData.value = props.data
  }
  emit('filtered', filteredData.value)
})
</script>

<template>
  <input type="search" :class="{'form-control-lg': context === 'main'}"
         class="form-control rounded-pill" v-model="searchQuery" placeholder="Поиск...">
  <div class="btn-group">
    <button type="button" :class="{'btn-lg': context === 'main'}"
            class="btn rounded-start-pill btn-outline-dark text-nowrap">
      <span>Фильтры</span>
      <img class="ms-2" src="/src/assets/icons/funnel.svg">
    </button>
    <div class="dropdown">
      <button :class="{'btn-lg': context === 'main'}" @click="showDropdown.sort = !showDropdown.sort"
              class="btn rounded-end-pill btn-outline-dark text-nowrap">
        <span>Сортировка</span>
        <img class="ms-2" src="/src/assets/icons/sort-alpha-down.svg">
      </button>
      <div class="dropdown-menu rounded-4 mt-2" style="border-top-left-radius: 0 !important;" :class="{'show': showDropdown.sort}">
        <a class="dropdown-item" href="#" @click="sortOptions.value.name = 'title'">По названию</a>
        <a class="dropdown-item" href="#" @click="sortOptions.value.name = 'price'">По цене</a>
        <a class="dropdown-item" href="#" @click="sortOptions.value.name = 'rating'">По рейтингу</a>
        <a class="dropdown-item" href="#" @click="sortOptions.value.reversed =!sortOptions.value.reversed">
          По убыванию
        </a>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>