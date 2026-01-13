<template>
  <div>
    <TheNavbar />

    <div class="campus-scenery-container">
      <h1 class="page-title">校园风貌</h1>
      <p class="page-subtitle">欣赏义乌工商校医院及校园的美丽景色</p>

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
  }, 2000);
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
.campus-scenery-container {
  margin-top: 100px;
  padding: 2rem;
  text-align: center;
}

.page-title {
  color: #0066cc;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

/* 轮播图样式 */
.carousel-container {
  position: relative;
  width: 80%;
  margin: 0 auto;
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
  object-position: center;
}

.carousel-slide.active {
  opacity: 1;
}

.carousel {
  position: relative;
  width: 100%;
  padding-bottom: 40%; /* 5:2 比例，比原来更矮 */
  height: 0;
  overflow: hidden;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

/* 响应式设计 */
@media (max-width: 1200px) {
  .carousel-container {
    max-width: 90%;
  }

  .carousel {
    height: 280px;
  }
}

@media (max-width: 992px) {
  .campus-scenery-container {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .carousel-container {
    max-width: 95%;
    border-radius: 15px;
  }

  .carousel {
    height: 300px;
  }

  .carousel-indicators span {
    width: 10px;
    height: 10px;
  }
}

@media (max-width: 768px) {
  .campus-scenery-container {
    margin-top: 80px;
    padding: 1rem;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .page-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .carousel-container {
    max-width: 100%;
    margin: 0 auto;
    border-radius: 12px;
  }

  .carousel {
    height: 350px;
  }

  .carousel-indicators {
    bottom: 15px;
    gap: 8px;
  }

  .carousel-indicators span {
    width: 8px;
    height: 8px;
  }
}

@media (max-width: 480px) {
  .campus-scenery-container {
    padding: 0.8rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .carousel-container {
    border-radius: 10px;
  }

  .carousel {
    height: 200px;
  }

  .carousel-indicators {
    bottom: 10px;
    gap: 6px;
  }

  .carousel-indicators span {
    width: 6px;
    height: 6px;
  }
}
</style>
