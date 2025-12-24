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
          <div class="nav-menu-item" @click="goToInfo">
            <span>个人信息</span>
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

    <!-- 登录后显示的页面内容 -->
    <div v-if="userStore.isLoggedIn" class="main-content">
      <h1>欢迎来到Main</h1>
      <p>这里是页面的主要内容</p>
    </div>

    <!-- 未登录时显示提示信息 -->
    <div v-else class="login-prompt">
      <h2>请先登录</h2>
      <p>您需要登录后才能查看页面内容</p>
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
  router.push('/')
}
const goToInfo = () => {
  router.push('/info')
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

/* 主要内容区域 */
.main-content {
  padding: 2rem;
  margin-top: 80px;
  /* 留出导航栏的空间 */
}

.login-prompt {
  padding: 2rem;
  margin-top: 80px;
  /* 留出导航栏的空间 */
  text-align: center;
}

.login-prompt h2 {
  color: #333;
  margin-bottom: 1rem;
}

.login-prompt p {
  color: #666;
  margin-bottom: 1.5rem;
}

.logo {
  width: 45px;
  height: 45px;
  margin-right: 10px;
}
</style>