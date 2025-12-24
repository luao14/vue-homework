<!-- d:\vue-homework\src\components\Info.vue -->
<template>
  <div>
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-brand">
        <img src="@/image/logo.png" alt="logo" class="logo" />
        <h2>义乌工商银行</h2>
      </div>
      <div class="nav-menu">
        <!-- 只有登录后才显示菜单项 -->
        <div class="nav-menu-items" v-if="userStore.isLoggedIn">
          <!-- 个人信息路由链接 -->
          <div class="nav-menu-item" @click="goToMain">
            <span>主页</span>
          </div>
          <div class="nav-menu-item">
            <span>菜单项 2</span>
          </div>
          <div class="nav-menu-item">
            <span>菜单项 3</span>
          </div>
          <div class="nav-menu-item">
            <span>菜单项 4</span>
          </div>
        </div>
        <!-- 用户信息 -->
        <div class="nav-user" v-if="userStore.isLoggedIn">
          <span>{{ userStore.userName }}</span>
          <button @click="handleLogout" class="nav-button logout">登出</button>
        </div>
        <div class="nav-user" v-else>
          <button @click="handleLogin" class="nav-button login">登录</button>
        </div>
      </div>
    </nav>

    <!-- 个人信息内容 -->
    <div class="info-page">
      <h1>个人信息</h1>

      <div class="info-content" v-if="userStore.isLoggedIn">
        <div class="info-item">
          <label>姓名:</label>
          <span>{{ userInfo.name }}</span>
        </div>
        <div class="info-item">
          <label>学号:</label>
          <span>{{ userInfo.studentId }}</span>
        </div>
      </div>
      <div v-else class="not-logged-in">
        <p>请先登录以查看个人信息</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';



const userStore = useUserStore();
const router = useRouter();

// 示例用户信息，您可以从用户存储中获取真实数据
const userInfo = {
  name: userStore.userName,
  studentId: userStore.userStuId
}

const handleLogin = () => {
  router.push('/')
}

const handleLogout = () => {
  userStore.logout();
  router.push('/') // 登出后跳转到登录页
}

const goToMain = () => {
  router.push('/main')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 1000;
  box-sizing: border-box;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.nav-brand h2 {
  margin: 0;
  color: #333;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-menu-items {
  display: flex;
  gap: 1.5rem;
}

.nav-menu-item {
  padding: 0.5rem 1rem;
  background-color: #e9ecef;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nav-menu-item:hover {
  background-color: #dee2e6;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.login {
  background-color: #4476ff;
  color: white;
}

.login:hover {
  background-color: #0044cc;
}

.logout {
  background-color: #ff4444;
  color: white;
}

.logout:hover {
  background-color: #cc0000;
}

/* 个人信息页面样式 */
.info-page {
  padding: 2rem;
  margin-top: 80px;
  /* 留出导航栏的空间 */
}

.info-content {
  max-width: 600px;
  margin: 2rem auto;
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.info-item {
  display: flex;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.info-item label {
  width: 80px;
  font-weight: bold;
  color: #333;
}

.info-item span {
  flex: 1;
  color: #666;
}

.not-logged-in {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
  color: #666;
  font-size: 1.2rem;
}

.logo {
  width: 45px;
  height: 45px;
  margin-right: 10px;
}
</style>