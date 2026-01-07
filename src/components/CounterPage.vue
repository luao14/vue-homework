<template>
  <div>
    <TheNavbar />

    <div class="counter-container">
      <h1 class="page-title">计数器</h1>

      <div class="counter-content">
        <!-- 数字展示区域 -->
        <div class="counter-display">
          {{ count }}
        </div>

        <!-- +1按钮 -->
        <button class="increment-button" @click="increment">+1</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TheNavbar from './TheNavbar.vue';

// 计数器状态
const count = ref(0);

// 增加计数器数值
const increment = () => {
  count.value++;
};
</script>

<style scoped>
.counter-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  margin-top: 80px; /* 为固定导航栏留出空间 */
}

.page-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.counter-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.counter-display {
  font-size: 4rem;
  font-weight: bold;
  color: #2c3e50;
  background-color: #f8f9fa;
  padding: 2rem 4rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.increment-button {
  background-color: #4a6491;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.increment-button:hover {
  background-color: #2c3e50;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
</style>
