<template>
  <div>
    <TheNavbar />

    <div class="form-container">
      <div class="form-card">
        <h2 class="form-title">
          {{ msg }}
        </h2>

        <div class="form-group">
          <label class="form-label">用户账号：</label>
          <input
            v-model="user"
            type="text"
            class="form-input"
            placeholder="请输入用户账号"
          />
        </div>

        <div class="form-group">
          <label class="form-label">姓名：</label>
          <input
            v-model="name"
            type="text"
            class="form-input"
            placeholder="请输入姓名"
          />
        </div>

        <div class="form-group">
          <label class="form-label">输入密码：</label>
          <input
            v-model="pwd"
            type="password"
            class="form-input"
            placeholder="请输入密码"
          />
        </div>

        <div class="form-group">
          <label class="form-label">确认密码：</label>
          <input
            v-model="pwd2"
            type="password"
            class="form-input"
            placeholder="请再次输入密码"
          />
          <div
            :class="{
              'error-text': pwd !== pwd2 || pwd === pwd2,
              'success-text': pwd === pwd2 && pwd2.length >= 6,
            }"
          >
            {{ tips }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">性别：</label>
          <div class="radio-group">
            <label class="radio-option">
              <input id="male" v-model="gender" type="radio" value="男" />
              <span class="radio-text">男</span>
            </label>
            <label class="radio-option">
              <input id="female" v-model="gender" type="radio" value="女" />
              <span class="radio-text">女</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">住址：</label>
          <textarea
            v-model="address"
            class="form-input"
            placeholder="请输入住址"
            rows="4"
          />
        </div>

        <div class="form-group">
          <label class="form-label">地址：</label>
          <select v-model="cityName" name="city" class="form-select">
            <option value="">请选择城市</option>
            <option value="北京">北京</option>
            <option value="上海">上海</option>
            <option value="广州">广州</option>
            <option value="深圳">深圳</option>
            <option value="杭州">杭州</option>
            <option value="南昌">南昌</option>
          </select>
        </div>

        <div class="form-group full-width">
          <label class="form-checkbox">
            <input id="agr" v-model="agree" type="checkbox" />
            <span class="checkbox-text">是否同意本站协议</span>
          </label>
        </div>

        <div class="button-group">
          <button :disabled="isDisabled" class="submit-btn" @click="mysubmit">
            提交
          </button>
          <button class="reset-btn" @click="resetForm">重置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUsersStore } from '../store/register';
import TheNavbar from './TheNavbar.vue';

const usersStore = useUsersStore();

let msg = ref('用户注册');

let user = ref('');
let name = ref('');
let pwd = ref('');
let pwd2 = ref('');
let tips = ref('');
let gender = ref('');

let cityName = ref('');
let address = ref('');
let agree = ref(false);
let isDisabled = ref(true);

watch([pwd, pwd2], () => {
  if (pwd2.value.length < 6 && pwd2.value.length > 0) {
    tips.value = '密码长度小于 6';
  } else if (
    pwd.value !== pwd2.value &&
    pwd2.value.length > 0 &&
    pwd.value.length > 0
  ) {
    tips.value = '两次密码不同';
  } else if (pwd.value === pwd2.value && pwd.value.length >= 6) {
    tips.value = '正确';
  } else if (pwd2.value === '' || pwd.value === '') {
    tips.value = '';
  } else {
    tips.value = '';
  }
});

// 监听用户是否同意本站协议
watch(agree, newVal => {
  isDisabled.value = !newVal;
});

// 提交按钮调用方法
function mysubmit() {
  if (user.value.length < 4) {
    alert('用户名长度不能小于 4');
  } else if (!name.value) {
    alert('请输入姓名');
  } else if (!address.value) {
    alert('请输入住址');
  } else if (tips.value !== '正确') {
    alert('请输入正确的密码');
  } else {
    alert('注册成功！');

    // 创建用户数据对象
    const userData = {
      user: user.value,
      name: name.value,
      pwd: pwd.value,
      gender: gender.value,
      address: address.value,
      cityName: cityName.value,
      registerTime: new Date().toLocaleString(),
    };

    // 添加用户到全局状态
    usersStore.addUser(userData);

    // 清空表单
    resetForm();
  }
}

// 重置表单
function resetForm() {
  user.value = '';
  name.value = '';
  pwd.value = '';
  pwd2.value = '';
  gender.value = '';
  address.value = '';
  cityName.value = '';
  agree.value = false;
  isDisabled.value = true;
  tips.value = '';
}
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

/* 表单容器样式 - 修改为自适应网格布局 */
.form-container {
  display: flex;
  justify-content: center;
  padding: 100px 20px 20px;
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
  /* min-height: calc(100vh - 120px); */
}

.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  /* width: 100%; */
  max-width: 900px;
  /* max-height: calc(100vh - 140px); */
  display: flex;
  flex-direction: column;
}

/* 使用Grid布局优化表单 */
.form-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  align-items: start;
  overflow-y: auto;
  /* 自定义滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: #4a6fa5 #f0f4f8;
}

/* WebKit浏览器滚动条样式 */
.form-card::-webkit-scrollbar {
  width: 8px;
}

.form-card::-webkit-scrollbar-track {
  background: #f0f4f8;
  border-radius: 4px;
}

.form-card::-webkit-scrollbar-thumb {
  background: #4a6fa5;
  border-radius: 4px;
}

.form-card::-webkit-scrollbar-thumb:hover {
  background: #3e6a98;
}

.form-title {
  grid-column: 1 / -1;
  text-align: center;
  margin-bottom: 0;
}

.button-group {
  grid-column: 1 / -1;
  margin-top: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 针对特定表单组的跨列布局 */
.form-group.full-width {
  grid-column: 1 / -1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .form-card {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }

  .checkbox-group {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}

.form-title {
  text-align: center;
  color: #2b3e50;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.form-title::after {
  content: '';
  display: block;
  width: 100px;
  height: 4px;
  background: linear-gradient(to right, #4a6fa5, #2e5a88);
  margin: 8px auto 0;
  border-radius: 2px;
}

.form-group {
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
  font-size: 1.1rem;
}

.form-input,
.form-select,
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e6ed;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #4a6fa5;
  box-shadow: 0 0 0 3px rgba(93, 139, 208, 0.2);
  background-color: rgb(238, 238, 238);
}

.radio-group {
  display: flex;
  gap: 2rem;
}

.radio-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-option input {
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
  accent-color: #4a6fa5;
}

.form-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 8px;
  background-color: #f0f4f8;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
}

.form-checkbox:hover {
  background-color: #e2e8f0;
}

.form-checkbox input {
  margin-right: 0.6rem;
  width: 16px;
  height: 16px;
  accent-color: #4a6fa5;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;
  flex-shrink: 0;
}

.submit-btn {
  flex: 1;
  padding: 0.9rem;
  background: linear-gradient(135deg, #4a6fa5, #2e5a88);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 4px 15px rgba(46, 90, 136, 0.3);
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a7fb5, #3e6a98);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(46, 90, 136, 0.4);
}

.submit-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.reset-btn {
  flex: 1;
  padding: 0.9rem;
  background: linear-gradient(135deg, #64748b, #475569);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 4px 15px rgba(71, 85, 105, 0.3);
}

.reset-btn:hover {
  background: linear-gradient(135deg, #748ca5, #576b89);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(71, 85, 105, 0.4);
}

.error-text {
  color: #e53e3e;
  font-size: 1rem;
  margin-top: 0.3rem;
  display: block;
  font-weight: 500;
  padding-left: 0.3rem;
}

.success-text {
  color: #38a169;
  font-size: 1rem;
  margin-top: 0.3rem;
  display: block;
  font-weight: 500;
  padding-left: 0.3rem;
}

.hobby-info {
  font-size: 1rem;
  border-radius: 8px;
  color: #b11616;
  text-align: center;
}

.error-text {
  color: #e53e3e;
  font-size: 1.2rem;
  margin-top: 0.5rem;
  display: block;
  font-weight: 500;
  padding-left: 0.3rem;
}

.success-text {
  color: #38a169;
  font-size: 1.2rem;
  margin-top: 0.5rem;
  display: block;
  font-weight: 500;
  padding-left: 0.3rem;
}

.hobby-info {
  font-size: 1.2rem;
  border-radius: 8px;
  color: #b11616;
  text-align: center;
}
</style>
