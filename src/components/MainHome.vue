<template>
  <div>
    <TheNavbar />

    <div class="main-content">
      <h1>欢迎来到义乌工商学院</h1>
      <p>以下是学校图片</p>
    </div>

    <!-- 轮播图部分 -->
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
import TheNavbar from './TheNavbar.vue';

// 轮播图部分
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
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const goToSlide = index => {
  currentSlide.value = index;
};

const startAutoPlay = () => {
  slideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
};

const stopAutoPlay = () => {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
.main-content {
  padding: 2rem;
  text-align: center;
  margin-top: 60px;
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
  transition: opacity 1.5s ease-in-out;
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
  height: 500px;
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
  transition: background 1s;
}

.carousel-indicators span.active {
  background: white;
}
</style>
