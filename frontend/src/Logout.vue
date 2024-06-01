<script setup>
import {inject, onMounted} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
const router = useRouter()
const api_url = inject('api_url')

onMounted(() => {
  axios.get(`${api_url}/logout`, {headers: {'Authorization': `Token ${localStorage.getItem('token')}`}})
      .then(() => {
         localStorage.removeItem('token')
         router.replace('/login')
      })
})
</script>

<template>

</template>

<style scoped>

</style>