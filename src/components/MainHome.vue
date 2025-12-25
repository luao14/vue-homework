<template>
  <div>
    <nav class="navbar">
      <div class="nav-brand">
        <img src="@/image/logo.png" alt="logo" class="logo" />
        <h2>义乌工商银行</h2>
      </div>

      <div class="nav-menu">
        <div class="nav-menu-items">
          <div class="nav-menu-item" @click="goToMainHome">
            <span>主页</span>
          </div>
          <div class="nav-menu-item" @click="goToMyInfo">
            <span>个人信息</span>
          </div>
          <div class="nav-menu-item">
            <span>每日新闻</span>
          </div>
          <div class="nav-menu-item">
            <span>注册用户</span>
          </div>
        </div>

        <div class="nav-user">
          <span>{{ userStore.userName }}</span>
          <button class="nav-button logout" @click="handleLogout">登出</button>
        </div>
      </div>
    </nav>

    <div class="main-content">
      <h1>欢迎来到义乌工商学院</h1>
      <p>以下是学校图片</p>
    </div>

    <!-- 添加轮播图部分 -->
    <div class="carousel-container">
      <div class="carousel">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="carousel-slide"
          :class="{ active: currentSlide === index }"
        >
          <img :src="slide.image" :alt="slide.title" />
        </div>
      </div>
      <div class="carousel-indicators">
        <span
          v-for="(slide, index) in slides"
          :key="index"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import image1 from '@/image/1.png';
import image2 from '@/image/2.png';
import image3 from '@/image/3.png';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
const userStore = useUserStore();
const router = useRouter();

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};

const goToMyInfo = () => {
  router.push('/myinfo');
};

const goToMainHome = () => {
  router.push('/mainhome');
};

// 轮播图数据
const slides = ref([
  {
    image: image1,
  },
  {
    image: image2,
  },
  {
    image: image3,
  },
]);

const currentSlide = ref(0);
let slideInterval = null;

// 轮播图方法
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const goToSlide = index => {
  currentSlide.value = index;
};

// 自动播放
const startAutoPlay = () => {
  slideInterval = setInterval(() => {
    nextSlide();
  }, 3000); // 每5秒切换一次
};

const stopAutoPlay = () => {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
};

// 组件挂载后开始自动播放
onMounted(() => {
  startAutoPlay();
});

// 组件卸载前停止自动播放
onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
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

.main-content {
  padding: 2rem;
  text-align: center;
  margin-top: 80px;
}

.logo {
  width: 45px;
  height: 45px;
  margin-right: 10px;
}

.carousel-container {
  position: relative;
  width: 100%;
  max-width: 80%;
  margin: 1px auto 2px auto;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
}

.carousel-slide.active {
  opacity: 1;
}

.carousel {
  position: relative;
  width: 100%;
  height: 400px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.carousel-indicators span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.3s;
}

.carousel-indicators span.active {
  background: white;
}
</style>
