<template>
  <div>
    <!-- 导航栏 -->
    <TheNavbar />

    <!-- 后退功能页面内容 -->
    <div class="back-button-page-container">
      <h1 class="page-title">后退功能</h1>

      <div class="page-content">
        <!-- 功能说明 -->
        <div class="feature-description">
          <h2>功能介绍</h2>
          <p>
            后退按钮功能允许用户返回到之前访问过的页面，提高了应用的导航便利性和用户体验。
          </p>
          <p>
            本页面专门用于展示和管理后退按钮功能，提供了详细的使用说明和演示。
          </p>
        </div>

        <!-- 后退按钮演示 -->
        <div class="button-demo">
          <h2>后退按钮演示</h2>
          <p>点击下方按钮可以体验后退功能：</p>
          <el-button type="primary" plain @click="goBack">
            <span>← 后退</span>
          </el-button>
        </div>

        <!-- 技术实现 -->
        <div class="technical-implementation">
          <h2>技术实现</h2>
          <div class="tech-item">
            <h3>实现方式</h3>
            <p>
              使用浏览器的 History API
              实现页面后退功能，支持不同场景下的后退逻辑：
            </p>
            <ul>
              <li>当历史记录足够时，后退2步</li>
              <li>当历史记录不足2步时，退回到最早页面</li>
            </ul>
          </div>

          <div class="tech-item">
            <h3>核心代码</h3>
            <pre class="code-block">
              <code>
const goBack = () => {
  // 检查历史记录长度，history.length包含当前页面
  if (history.length > 3) {
    // 当历史记录足够时，后退2步
    window.history.go(-2);
  } else if (history.length > 1) {
    // 当历史记录不足2步时，退回到最早页面
    window.history.go(-(history.length - 1));
  }
};
              </code>
            </pre>
          </div>
        </div>

        <!-- 使用场景 -->
        <div class="use-cases">
          <h2>使用场景</h2>
          <div class="case-item">
            <h3>购物车页面</h3>
            <p>
              在购物车页面中，用户可以点击后退按钮返回到之前浏览的商品页面。
            </p>
          </div>

          <div class="case-item">
            <h3>新闻详情页面</h3>
            <p>在新闻详情页面中，用户可以点击后退按钮返回到新闻列表页面。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import TheNavbar from './TheNavbar.vue';

// 后退功能，后退2步或尽可能后退到最早页面
const goBack = () => {
  // 检查历史记录长度，history.length包含当前页面
  if (history.length > 3) {
    // 当历史记录足够时，后退2步
    window.history.go(-2);
    ElMessage({
      message: '已后退2步',
      type: 'success',
      duration: 2000,
    });
  } else if (history.length > 1) {
    // 当历史记录不足2步时，退回到最早页面
    window.history.go(-(history.length - 1));
    ElMessage({
      message: '已退回到最早页面',
      type: 'success',
      duration: 2000,
    });
  } else {
    ElMessage({
      message: '没有更多历史记录',
      type: 'warning',
      duration: 2000,
    });
  }
};
</script>

<style scoped>
/* 页面容器样式 */
.back-button-page-container {
  margin-top: 120px;
  padding: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* 页面标题样式 */
.page-title {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid #3498db;
}

/* 页面内容样式 */
.page-content {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 功能说明样式 */
.feature-description {
  margin-bottom: 2rem;
}

.feature-description h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.feature-description p {
  color: #5a6c7d;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* 按钮演示样式 */
.button-demo {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.button-demo h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.button-demo p {
  color: #5a6c7d;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

/* 技术实现样式 */
.technical-implementation {
  margin-bottom: 2rem;
}

.technical-implementation h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.tech-item {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tech-item h3 {
  color: #3498db;
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.tech-item p {
  color: #5a6c7d;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.tech-item ul {
  color: #5a6c7d;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-left: 2rem;
}

.tech-item li {
  margin-bottom: 0.5rem;
}

/* 代码块样式 */
.code-block {
  background-color: #f0f0f0;
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
  margin-top: 1rem;
}

.code-block code {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
  color: #333;
}

/* 使用场景样式 */
.use-cases {
  margin-bottom: 1rem;
}

.use-cases h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.case-item {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.case-item h3 {
  color: #3498db;
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.case-item p {
  color: #5a6c7d;
  font-size: 1.1rem;
  line-height: 1.6;
}
</style>
