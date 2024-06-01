<script setup>
import {inject, ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import {useToast} from "vue-toastification";

const router = useRouter()
const toast = useToast()
const api_url = inject('api_url')

const login_data = ref({
  username: "",
  password: ""
})

function login() {
  axios.post(`${api_url}/login/`, login_data.value)
      .then((response) => {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('username', response.data.username)
        console.log(response.data)
        router.push('/manage')
      })
      .catch((error) => {
        toast.error("Неверный логин или пароль")
        console.log(error)
      })
}
</script>

<template>
  <main class="position-fixed d-flex" style="height: 100vh; width: 100vw">
    <section class="m-auto">
      <div class="card">
        <div class="card-header fs-4 text-center">Авторизация</div>
        <div class="card-body">
          <form @submit.prevent>
            <div class="mb-3 form-floating">
              <input type="text" placeholder="" class="form-control" id="login" v-model="login_data.username">
              <label for="login" class="form-label">Логин</label>
            </div>
            <div class="mb-3 form-floating">
              <input type="password" placeholder="" class="form-control" id="password" v-model="login_data.password">
              <label for="password" class="form-label">Пароль</label>
            </div>
            <button @click="login" type="submit" class="btn btn-dark w-100">Войти</button>
          </form>
        </div>
        <div class="card-footer">
          <button class="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2 w-100"
                  @click="$router.push('/')">
            На главную <img src="/src/assets/icons/house.svg"/></button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>

</style>