<script setup>
import {onMounted, ref, watch} from "vue";

const props = defineProps(['data', 'context'])
const emit = defineEmits(['filtered'])

const searchQuery = ref('')
const sortOptions = ref({
  name: 'date',
  reversed: false,
})

const filterOptions = ref({
  dateStart: null, dateEnd: null,
  category: "-1", published: "-1",

  filtered: false
})

const showDropdown = ref({
  filter: false,
  sort: false
})

const filteredData = ref(props.data)

function resetFilter() {
  filterOptions.value.dateStart = null
  filterOptions.value.dateEnd = null
  filterOptions.value.category = "-1"
  filterOptions.value.published = "-1"
  filterOptions.value.filtered = false
  window.localStorage.setItem('filter_filtered', 'false')
  searchQuery.value = ''
  showDropdown.value.filter = false
  showDropdown.value.sort = false
  filteredData.value = props.data
  filterData()
}

function filterData() {
  localStorage.setItem('filter_dateStart', filterOptions.value.dateStart ? filterOptions.value.dateStart.toString() : 'null')
  localStorage.setItem('filter_dateEnd', filterOptions.value.dateEnd ? filterOptions.value.dateEnd.toString() : 'null')
  localStorage.setItem('filter_category', filterOptions.value.category)
  localStorage.setItem('filter_published', filterOptions.value.published)

  filteredData.value = props.data
  filteredData.value = filteredData.value.filter(item => {
    let save_date = item.first_save.$date
    let dateStart = filterOptions.value.dateStart ? new Date(filterOptions.value.dateStart).getTime() : null
    let dateEnd = filterOptions.value.dateEnd ? new Date(filterOptions.value.dateEnd).getTime() : null
    if (dateStart !== null && dateEnd !== null) {
      localStorage.setItem('filter_filtered', 'true')
      filterOptions.value.filtered = true
      return save_date >= dateStart && save_date <= dateEnd
    } else if (dateStart !== null) {
      localStorage.setItem('filter_filtered', 'true')
      filterOptions.value.filtered = true
      return save_date >= dateStart
    } else if (dateEnd !== null) {
      localStorage.setItem('filter_filtered', 'true')
      filterOptions.value.filtered = true
      return save_date <= dateEnd
    } else {
      return true
    }
  })
  filteredData.value = filteredData.value.filter(item => {
    if (parseInt(filterOptions.value.category.toString()) !== -1) {
      window.localStorage.setItem('filter_filtered', 'true')
      filterOptions.value.filtered = true
      return item.quiz_type === parseInt(filterOptions.value.category.toString())
    } else {
      return true
    }
  })
  filteredData.value = filteredData.value.filter(item => {
    if (parseInt(filterOptions.value.published.toString())!== -1) {
      window.localStorage.setItem('filter_filtered', 'true')
      filterOptions.value.filtered = true
      return item.to_publish === (filterOptions.value.published.toString() === 'true')
    } else {
      return true
    }
  })
  filteredData.value = filteredData.value.filter(item => {
    if (searchQuery.value !== '') {
      return item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    } else {
      return true
    }
  })
  emit('filtered', filteredData.value)
  sortData()
}

function sortData() {
  localStorage.setItem('sort_name', sortOptions.value.name)
  localStorage.setItem('sort_reversed', sortOptions.value.reversed.toString())

  if (sortOptions.value.name === 'date'){
    filteredData.value.sort((a, b) => a.first_save.$date - b.first_save.$date)
  } else if (sortOptions.value.name === 'dateLast') {
    filteredData.value.sort((a, b) => b.last_save.$date - a.last_save.$date)
  } else if (sortOptions.value.name === 'title') {
    filteredData.value.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortOptions.value.name === 'category') {
    filteredData.value.sort((a, b) => a.quiz_type - b.quiz_type)
  } else if (sortOptions.value.name === 'popularity') {
    filteredData.value.sort((a, b) => b.answers_count - a.answers_count)
  } else if (sortOptions.value.name === 'published') {
    filteredData.value.sort((a, b) => a.to_publish - b.to_publish)
  }
  if (sortOptions.value.reversed) {
    filteredData.value.reverse()
  }
  emit('filtered', filteredData.value)
}

watch(filterOptions, () => {
  filterData()
}, {deep: true})

watch(searchQuery, async () => {
  filterData()
})

watch(sortOptions, () => {
  sortData()
}, {deep: true})

onMounted(() => {
  filteredData.value = props.data
  sortData()

  filterOptions.value.dateStart = localStorage.getItem('filter_dateStart') !== 'null' ? localStorage.getItem('filter_dateStart') : null
  filterOptions.value.dateEnd = localStorage.getItem('filter_dateEnd') !== 'null' ? localStorage.getItem('filter_dateEnd') : null
  filterOptions.value.category = localStorage.getItem('filter_category') ? localStorage.getItem('filter_category') : -1
  filterOptions.value.published = localStorage.getItem('filter_published') ? localStorage.getItem('filter_published') : -1
  filterOptions.value.filtered = localStorage.getItem('filter_filtered') === 'true'

  sortOptions.value.name = localStorage.getItem('sort_name') ? localStorage.getItem('sortName') : 'date'
  sortOptions.value.reversed = localStorage.getItem('sort_reversed') === 'true'
})
</script>

<template>
  <input type="search" :class="{'form-control-lg': context === 'main'}"
         class="form-control rounded-pill" v-model="searchQuery" placeholder="Поиск...">
  <div class="btn-group">
    <div class="dropdown">
      <button type="button" :class="{'btn-lg': context === 'main', 'active': filterOptions.filtered}"
              @click="showDropdown.filter = !showDropdown.filter; showDropdown.sort = false"
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
          <li class="dropdown-item-text" v-if="context !== 'main'">
            <div class="row g-1 flex-nowrap">
              <div class="col form-floating">
                <select class="form-select" id="publish" v-model="filterOptions.published">
                  <option value="-1">Все публикации</option>
                  <option value="false">Не опубликовано</option>
                  <option value="true">Опубликовано</option>
                </select>
                <label class="form-label" for="publish">Пуликация</label>
              </div>
            </div>
          </li>
          <li class="dropdown-item-text hstack">
            <button @click="resetFilter" class="btn w-100 btn-outline-dark">Сбросить</button>
          </li>
        </ul>
      </form>
    </div>

    <!-- Сортировка -->
    <div class="dropdown">
      <button :class="{'btn-lg': context === 'main'}"
              @click="showDropdown.sort = !showDropdown.sort; showDropdown.filter = false"
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
            <input type="radio" name="sortType" id="sortDateLast" class="form-check-input" v-model="sortOptions.name"
                   value="dateLast">
            <label class="ms-2" for="sortDateLast">По дате последнего изменения</label>
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
          <li class="dropdown-item" v-if="context !== 'main'">
            <input type="radio" name="sortType" id="sortPublish" class="form-check-input" v-model="sortOptions.name"
                   value="published">
            <label class="ms-2" for="sortPublish">По публикации</label>
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