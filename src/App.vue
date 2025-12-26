<template>
  <div class="app-container">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script setup></script>

<style>
* {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Arial, sans-serif;
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

body {
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow: -moz-scrollbars-none;
}

body::-webkit-scrollbar {
  display: none;
}

.app-container {
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
