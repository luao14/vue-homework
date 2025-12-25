<!-- d:\vue-homework\src\components\Info.vue -->
<template>
  <div>
    <nav class="navbar">
      <div class="nav-brand">
        <img src="@/image/logo.png" alt="logo" class="logo" />
        <h2>义乌工商银行</h2>
      </div>

      <div class="nav-menu">
        <div v-if="userStore.isLoggedIn" class="nav-menu-items">
          <div class="nav-menu-item" @click="goToMain">
            <span>主页</span>
          </div>
          <div class="nav-menu-item" @click="goToInfo">
            <span>个人信息</span>
          </div>
          <div class="nav-menu-item">
            <span>注册用户</span>
          </div>
          <div class="nav-menu-item">
            <span>菜单项 4</span>
          </div>
        </div>

        <div v-if="userStore.isLoggedIn" class="nav-user">
          <span>{{ userStore.userName }}</span>
          <button class="nav-button logout" @click="handleLogout">登出</button>
        </div>
      </div>
    </nav>

    <!-- 个人信息内容 -->
    <div class="info-page">
      <h1>个人信息</h1>

      <div v-if="userStore.isLoggedIn" class="info-content">
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
  studentId: userStore.userStuId,
};

const handleLogout = () => {
  userStore.logout();
  router.push('/'); // 登出后跳转到登录页
};

const goToMain = () => {
  router.push('/mainhome');
};

const goToInfo = () => {
  router.push('/myinfo');
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  /* border-bottom: 1px solid #dee2e6; */
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

.nav-menu {
  display: flex;
  align-items: center;
  gap: 12rem;
}

.nav-menu-items {
  display: flex;
  gap: 1.5rem;
}

.nav-menu-item {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nav-menu-item:hover {
  background: linear-gradient(45deg, #ff4444, #bace08, #4476ff, #50f055);
  background-size: 200% 200%;
  color: white;
  animation: gradientShift 1.5s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
}

.logout {
  background-color: #ff0000;
  color: white;
}

.logout:hover {
  background-color: #d10909;
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
