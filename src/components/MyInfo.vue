<template>
  <div>
    <nav class="navbar">
      <div class="nav-left">
        <div class="nav-brand">
          <img src="@/image/logo.png" alt="logo" class="logo" />
          <h2>义乌工商学院</h2>
        </div>
      </div>

      <div class="nav-center">
        <div class="nav-menu-item" @click="goToMainHome">
          <span>首页</span>
        </div>
        <div
          class="nav-menu-item"
          :class="{ active: $route.path === '/myinfo' }"
        >
          <span>个人信息</span>
        </div>
        <div class="nav-menu-item">
          <span>每日新闻</span>
        </div>
        <div class="nav-menu-item" @click="goToRegister">
          <span>注册用户</span>
        </div>
        <div class="nav-menu-item">
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

    <div class="profile-container">
      <div class="form-card">
        <h2 class="form-title">个人信息管理</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">姓名：</label>
              <input
                v-model="user"
                type="text"
                class="form-input"
                placeholder="请输入姓名"
              />
            </div>
            <div class="form-group">
              <label class="form-label">身高：</label>
              <input
                v-model="height"
                type="text"
                class="form-input"
                placeholder="请输入身高（cm）"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">体重：</label>
              <input
                v-model="weight"
                type="text"
                class="form-input"
                placeholder="请输入体重（kg）"
              />
            </div>
            <div class="form-group">
              <label class="form-label">性别：</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input v-model="gender" type="radio" value="男" />
                  <span class="radio-text">男</span>
                </label>
                <label class="radio-option">
                  <input v-model="gender" type="radio" value="女" />
                  <span class="radio-text">女</span>
                </label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">喜爱的运动：</label>
            <div class="checkbox-group">
              <template v-for="(h, i) in hobby" :key="i">
                <label class="checkbox-option">
                  <input
                    :id="'r' + i"
                    v-model="checkedNames"
                    type="checkbox"
                    :value="h"
                  />
                  <span class="checkbox-text">{{ h }}</span>
                </label>
              </template>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">地址：</label>
            <select v-model="address" class="form-select">
              <option value="">请选择城市</option>
              <option value="北京">北京</option>
              <option value="上海">上海</option>
              <option value="广州">广州</option>
              <option value="深圳">深圳</option>
              <option value="杭州">杭州</option>
              <option value="南昌">南昌</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit">提交</button>
            <button type="reset" class="btn-reset" @click="handleReset">
              重置
            </button>
          </div>
        </form>
      </div>

      <div class="info-preview-card">
        <h3 class="info-preview-title">个人信息预览</h3>
        <div class="info-preview-grid">
          <div class="info-preview-item">
            <span class="info-preview-label">姓名</span>
            <span class="info-preview-value">{{ user || '未填写' }}</span>
          </div>
          <div class="info-preview-item">
            <span class="info-preview-label">身高</span>
            <span class="info-preview-value">{{ height || '未填写' }} cm</span>
          </div>
          <div class="info-preview-item">
            <span class="info-preview-label">体重</span>
            <span class="info-preview-value">{{ weight || '未填写' }} kg</span>
          </div>
          <div class="info-preview-item">
            <span class="info-preview-label">性别</span>
            <span class="info-preview-value">{{ gender || '未选择' }}</span>
          </div>
          <div class="info-preview-item">
            <span class="info-preview-label">喜爱的运动</span>
            <span class="info-preview-value">{{
              checkedNames.length > 0 ? checkedNames.join(', ') : '未选择'
            }}</span>
          </div>
          <div class="info-preview-item">
            <span class="info-preview-label">地址</span>
            <span class="info-preview-value">{{ address || '未选择' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
const userStore = useUserStore();
const router = useRouter();

// 个人信息数据定义
const hobby = reactive(['篮球', '足球', '羽毛球', '乒乓球', '排球', '跑步']);
const user = ref('');
const height = ref('');
const weight = ref('');
const gender = ref('');
const checkedNames = ref([]);
const address = ref('');

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};

const goToMainHome = () => {
  router.push('/mainhome');
};

const goToRegister = () => {
  router.push('/register');
};

const handleSubmit = () => {
  if (
    !user.value ||
    !height.value ||
    !weight.value ||
    !gender.value ||
    checkedNames.value.length === 0 ||
    !address.value
  ) {
    alert('请填写完整信息');
    return;
  }
  alert('信息已提交！');
};

const handleReset = () => {
  user.value = '';
  height.value = '';
  weight.value = '';
  gender.value = '';
  checkedNames.value = [];
  address.value = '';
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

.logo {
  width: 45px;
  height: 45px;
  margin-right: 10px;
}

/* -------------------------------- */
.profile-container {
  margin-top: 140px;
  margin-left: 10%;
  margin-right: 10%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-card {
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.form-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  font-weight: 600;
  font-size: 1.3rem;
}

.form-input,
.form-select {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  width: 80%;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  background-color: #f9f9f9;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(0, 153, 255, 0.312);
  background-color: white;
}

.radio-group,
.checkbox-group {
  margin-top: 0.1rem;
  display: flex;
  gap: 1rem;
}

.radio-option,
.checkbox-option {
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.radio-option:hover,
.checkbox-option:hover {
  background-color: #96c4ec2e;
}

.radio-text,
.checkbox-text {
  margin-left: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn-submit,
.btn-reset {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
}

.btn-submit {
  background: linear-gradient(to right, #3498db, #2980b9);
  color: white;
}

.btn-submit:hover {
  box-shadow: 0 5px 15px rgba(52, 152, 183, 0.4);
}

.btn-reset {
  background: linear-gradient(to right, #95a5a6, #7f8c8d);
  color: white;
}

.btn-reset:hover {
  box-shadow: 0 5px 15px rgba(149, 165, 166, 0.4);
}

/* 信息预览卡片 */
.info-preview-card {
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.info-preview-title {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.info-preview-grid {
  display: grid;
  gap: 1rem;
}

.info-preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-preview-item:hover {
  background: linear-gradient(to right, #2c3e50, #4a6491, #2c3e50);
  transform: translateX(3px);
}

.info-preview-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.3rem;
}

.info-preview-value {
  font-weight: 500;
  color: #34495e;
  font-size: 1.3rem;
  text-align: right;
}

.info-preview-item:hover .info-preview-label,
.info-preview-item:hover .info-preview-value {
  color: white;
}
</style>
