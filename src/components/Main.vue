<template>
  <div>
    <h1>欢迎来到Main</h1>
    <div v-if="userStore.isLoggedIn">
      <p>当前登录用户: {{ userStore.userName }}</p>
      <p>登录状态: 已登录</p>
      <button @click="handleLogout" class="button1">登出</button>
    </div>
    <div v-else>
      <p>登录状态: 未登录</p>
      <button @click="handleLogin" class="button2">去登录</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
const userStore = useUserStore();
const router = useRouter()

const handleLogin = () => {
  router.push('/')
}
const handleLogout = () => {
  userStore.logout();
}
</script>

<style scoped>
.button1 {
  padding: 8px 15px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.button1:hover {
  background-color: #cc0000;
}

.button2 {
  padding: 8px 15px;
  background-color: #4476ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.button2:hover {
  background-color: #0044cc;
}
</style>