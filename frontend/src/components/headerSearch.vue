<script setup>
import {ref, watch} from "vue";

const props = defineProps(['data', 'context'])
const emit = defineEmits(['filtered'])

const searchQuery = ref('')
const sortOptions = ref({
  name: 'date',
  reversed: false,
})

const filterOptions = ref({
  dateStart: null, dateEnd: null,
  category: -1
})

const showDropdown = ref({
  filter: false,
  sort: false
})

const filteredData = ref(props.data)

watch(filterOptions, () => {
  filteredData.value = props.data.filter(item => {
    let save_date = new Date(item.first_save.$date).getUTCSeconds()
    let dateStart = (new Date(filterOptions.value.dateStart).toLocaleDateString() ? filterOptions.value.dateStart : null)
    let dateEnd = (new Date(filterOptions.value.dateEnd).toLocaleDateString() ? filterOptions.value.dateEnd : null)
    console.log(save_date, dateStart, dateEnd)
    if (dateStart!== null && dateEnd!== null) {
      return item.first_save >= dateStart && item.first_save <= dateEnd
    } else if (dateStart!== null) {
      return item.first_save >= dateStart
    } else if (dateEnd!== null) {
      return item.first_save <= dateEnd
    } else {
      return true
    }
  })
  emit('filtered', filteredData.value)
}, {deep: true})

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
    <div class="dropdown">
      <button type="button" :class="{'btn-lg': context === 'main'}" @click="showDropdown.filter = !showDropdown.filter"
              class="btn rounded-start-pill btn-outline-dark text-nowrap">
        <span>Фильтры</span>
        <img class="ms-2" src="/src/assets/icons/funnel.svg">
      </button>
      <form @submit.prevent>
        <ul class="dropdown-menu dropdown-menu-end mt-2" :class="{'show': showDropdown.filter}">
          <li class="dropdown-item-text">
            <div class="row g-1 flex-nowrap" title="Период дат по которым отфильтровать викторины">
              <div class="col form-floating">
                <input class="form-control" id="dateStart" type="date" v-model="filterOptions.dateStart">
                <label class="form-label" for="dateStart">Начало периода</label>
              </div>
              <div class="col form-floating">
                <input class="form-control" id="dateEnd" type="date" v-model="filterOptions.dateEnd">
                <label class="form-label" for="dateEnd">Конец периода</label>
              </div>
            </div>
          </li>
          <li class="dropdown-item-text">
            <div class="row g-1 flex-nowrap">
              <div class="col form-floating">
                <select class="form-select" id="category" v-model="filterOptions.category">
                  <option value="-1">Все категории</option>
                  <option value="0">Детская</option>
                  <option value="1">Взрослая</option>
                </select>
                <label class="form-label" for="category">Категория</label>
              </div>
            </div>
          </li>
          <li class="dropdown-item-text hstack">
            <button type="submit" class="btn btn-dark">Применить</button>
            <button class="btn ms-auto btn-outline-dark">Сбросить</button>
          </li>
        </ul>
      </form>
    </div>

    <!-- Сортировка -->
    <div class="dropdown">
      <button :class="{'btn-lg': context === 'main'}" @click="showDropdown.sort = !showDropdown.sort"
              class="btn rounded-end-pill btn-outline-dark text-nowrap">
        <span>Сортировка</span>
        <img class="ms-2" src="/src/assets/icons/sort-alpha-down.svg">
      </button>
      <form @submit.prevent>
        <ul class="dropdown-menu mt-2" :class="{'show': showDropdown.sort}">
          <li class="dropdown-item">
            <input type="radio" name="sortType" id="sortDate" class="form-check-input" v-model="sortOptions.name"
                   value="date">
            <label class="ms-2" for="sortDate">По дате создания</label>
          </li>
          <li class="dropdown-item">
            <input type="radio" name="sortType" id="sortTitle" class="form-check-input" v-model="sortOptions.name"
                   value="title">
            <label class="ms-2" for="sortTitle">По названию</label>
          </li>
          <li class="dropdown-item">
            <input type="radio" name="sortType" id="sortCategory" class="form-check-input" v-model="sortOptions.name"
                   value="category">
            <label class="ms-2" for="sortCategory">По категории</label>
          </li>
          <li class="dropdown-item">
            <input type="radio" name="sortType" id="sortPopularity" class="form-check-input" v-model="sortOptions.name"
                   value="popularity">
            <label class="ms-2" for="sortPopularity">По популярности</label>
          </li>
          <li class="dropdown-divider"/>
          <li class="dropdown-item">
            <input type="checkbox" id="reverseToggle" class="form-check-input" v-model="sortOptions.reversed">
            <label class="form-check-label ms-2" for="reverseToggle">В обратном порядке</label>
          </li>
        </ul>
      </form>

    </div>

  </div>
</template>

<style scoped>
.dropdown-item:active {
  background-color: var(--bs-dark) !important;
  color: var(--bs-light) !important;
}
</style>