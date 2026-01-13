<template>
  <nav class="navbar">
    <div class="nav-left">
      <div class="nav-brand">
        <img src="@/image/校徽.jpg" alt="logo" class="logo" />
        <h2>义乌工商校医院</h2>
      </div>
      <button class="hamburger-menu" @click="toggleMobileMenu">
        <span :class="{ active: isMobileMenuOpen }" />
        <span :class="{ active: isMobileMenuOpen }" />
        <span :class="{ active: isMobileMenuOpen }" />
      </button>
    </div>

    <div class="nav-center" :class="{ 'mobile-open': isMobileMenuOpen }">
      <div
        class="nav-menu-item"
        :class="{ active: $route.path === '/mainhome' }"
        @click="goToMainHome"
      >
        <span>首页</span>
      </div>
      <div
        class="nav-menu-item"
        :class="{ active: $route.path === '/newspage' }"
        @click="goToNewsPage"
      >
        <span>医疗资讯</span>
      </div>
      <div
        class="nav-menu-item"
        :class="{
          active:
            $route.path === '/register' || $route.path === '/registered-users',
        }"
        @click="goToPatientManagement"
      >
        <span>体检用户管理</span>
      </div>
      <div
        class="nav-menu-item"
        :class="{ active: $route.path === '/shoppingcart' }"
        @click="goToShoppingCart"
      >
        <span>医疗服务</span>
      </div>
      <div
        class="nav-menu-item"
        :class="{ active: $route.path === '/medical-statistics' }"
        @click="goToMedicalStatistics"
      >
        <span>就诊统计</span>
      </div>
      <div
        class="nav-menu-item"
        :class="{ active: $route.path === '/campus-scenery' }"
        @click="goToCampusScenery"
      >
        <span>校园风貌</span>
      </div>
    </div>

    <div class="nav-right">
      <div class="nav-user">
        <div class="user-info-card">
          <div class="user-info-item">
            <span class="user-info-label">姓名:</span>
            <span class="user-info-value">{{
              userStore.realName || '未登录'
            }}</span>
          </div>
          <div class="user-info-item">
            <span class="user-info-label">学号:</span>
            <span class="user-info-value">{{
              userStore.userStuId || '-'
            }}</span>
          </div>
        </div>
        <button class="nav-button" @click="handleLogout">登出</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';

const userStore = useUserStore();
const router = useRouter();
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};

const goToMainHome = () => {
  router.push('/mainhome');
  isMobileMenuOpen.value = false;
};

const goToPatientManagement = () => {
  router.push('/registered-users');
  isMobileMenuOpen.value = false;
};

const goToShoppingCart = () => {
  router.push('/shoppingcart');
  isMobileMenuOpen.value = false;
};

const goToNewsPage = () => {
  router.push('/newspage');
  isMobileMenuOpen.value = false;
};

const goToMedicalStatistics = () => {
  router.push('/medical-statistics');
  isMobileMenuOpen.value = false;
};

const goToCampusScenery = () => {
  router.push('/campus-scenery');
  isMobileMenuOpen.value = false;
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem;
  background: linear-gradient(to right, #0066cc, #0088cc, #0066cc);
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
  gap: 0.1rem;
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
  background: linear-gradient(90deg, #0088cc, #4caf50, #0088cc);
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

.user-info-card {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 10px 15px;
  display: flex;
  gap: 15px;
  backdrop-filter: blur(10px);
}

.user-info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-info-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
}

.user-info-value {
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
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

.hamburger-menu {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 25px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 1rem;
}

.hamburger-menu span {
  width: 100%;
  height: 3px;
  background: white;
  border-radius: 3px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger-menu span:nth-child(1) {
  transform-origin: left center;
}

.hamburger-menu span:nth-child(3) {
  transform-origin: left center;
}

.hamburger-menu span.active:nth-child(1) {
  transform: rotate(45deg);
}

.hamburger-menu span.active:nth-child(2) {
  opacity: 0;
}

.hamburger-menu span.active:nth-child(3) {
  transform: rotate(-45deg);
}

@media (max-width: 1400px) {
  .user-info-card {
    gap: 12px;
    padding: 8px 12px;
  }

  .user-info-label {
    font-size: 0.7rem;
  }

  .user-info-value {
    font-size: 0.85rem;
  }

  .nav-menu-item {
    padding: 0.5rem 0.9rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 1200px) {
  .user-info-card {
    gap: 10px;
    padding: 6px 10px;
  }

  .user-info-label {
    font-size: 0.65rem;
  }

  .user-info-value {
    font-size: 0.8rem;
  }

  .nav-menu-item {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 992px) {
  .nav-menu-item {
    padding: 0.4rem 0.6rem;
    font-size: 0.85rem;
  }

  .nav-brand h2 {
    font-size: 1.3rem;
  }

  .logo {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0.8rem 1rem;
  }

  .nav-brand h2 {
    font-size: 1.2rem;
  }

  .logo {
    width: 35px;
    height: 35px;
  }

  .hamburger-menu {
    display: flex;
  }

  .nav-center {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: linear-gradient(to bottom, #0066cc, #0088cc);
    padding: 1rem;
    gap: 0.5rem;
    transform: translateY(-150%);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 999;
  }

  .nav-center.mobile-open {
    transform: translateY(0);
  }

  .nav-menu-item {
    width: 100%;
    text-align: center;
    padding: 0.8rem;
    border-radius: 10px;
  }

  .nav-right {
    display: none;
  }

  .nav-left {
    flex: 1;
  }

  .nav-center {
    flex: none;
  }
}

@media (max-width: 480px) {
  .nav-brand h2 {
    font-size: 1rem;
  }

  .logo {
    width: 30px;
    height: 30px;
  }

  .hamburger-menu {
    width: 25px;
    height: 20px;
  }
}
</style>
