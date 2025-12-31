<template>
  <nav class="navbar">
    <div class="nav-left">
      <div class="nav-brand">
        <img src="@/image/logo.png" alt="logo" class="logo" />
        <h2>义乌工商学院</h2>
      </div>
    </div>

    <div class="nav-center">
      <div
        class="nav-menu-item"
        :class="{ active: $route.path === '/mainhome' }"
        @click="goToMainHome"
      >
        <span>首页</span>
      </div>
      <div
        class="nav-menu-item"
        :class="{ active: $route.path === '/myinfo' }"
        @click="goToMyInfo"
      >
        <span>个人信息</span>
      </div>
      <div
        class="nav-menu-item"
        :class="{ active: $route.path === '/newspage' }"
        @click="goToNewsPage"
      >
        <span>每日新闻</span>
      </div>
      <div
        class="nav-menu-item"
        :class="{ active: $route.path === '/register' }"
        @click="goToRegister"
      >
        <span>注册用户</span>
      </div>
      <div
        class="nav-menu-item"
        :class="{ active: $route.path === '/shoppingcart' }"
        @click="goToShoppingCart"
      >
        <span>动态功能</span>
      </div>
    </div>

    <div class="nav-right">
      <div class="nav-user">
        <span>{{ userStore.userName }}</span>
        <button class="nav-button" @click="handleLogout">登出</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';

const userStore = useUserStore();
const router = useRouter();

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};

const goToMainHome = () => {
  router.push('/mainhome');
};

const goToMyInfo = () => {
  router.push('/myinfo');
};

const goToRegister = () => {
  router.push('/register');
};

const goToShoppingCart = () => {
  router.push('/shoppingcart');
};

const goToNewsPage = () => {
  router.push('/newspage');
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(to right, #2c3e50, #4a6491, #2c3e50);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 1000;
  box-sizing: border-box;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-left,
.nav-center,
.nav-right {
  display: flex;
  align-items: center;
}

.nav-left {
  flex: 1;
}

.nav-center {
  flex: 2;
  justify-content: center;
  gap: 1.5rem;
}

.nav-right {
  flex: 1;
  justify-content: flex-end;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.logo {
  width: 45px;
  height: 45px;
  margin-right: 10px;
}

.nav-brand h2 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}

.nav-menu-item {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.8s ease;
}

.nav-menu-item:hover,
.nav-menu-item.active {
  background: linear-gradient(90deg, #4c6897, #a2a2a2, #4c6897);
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
  background-color: #fff;
  color: #2c3e50;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid #ddd;
}

.nav-button:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
}
</style>
