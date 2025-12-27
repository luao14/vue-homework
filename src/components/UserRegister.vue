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
        <div class="nav-menu-item" @click="goToMyInfo">
          <span>个人信息</span>
        </div>
        <div class="nav-menu-item">
          <span>每日新闻</span>
        </div>
        <div
          class="nav-menu-item"
          :class="{ active: $route.path === '/register' }"
        >
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
          <label class="form-label"
            >喜爱的运动：
            <span
              class="hobby-info"
              :class="{ 'error-text': hs.length === 0 }"
              >{{ hs }}</span
            >
          </label>
          <div class="checkbox-group">
            <span v-for="(h, i) in hobby" :key="i" class="checkbox-option">
              <input
                :id="i + 'cb'"
                v-model="checkedHobby"
                :value="h"
                type="checkbox"
              />
              <label :for="i + 'cb'" class="checkbox-text">{{ h }}</label>
            </span>
          </div>
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

        <div class="form-group">
          <label class="form-checkbox">
            <input id="agr" v-model="agree" type="checkbox" />
            <span class="checkbox-text">是否同意本站协议</span>
          </label>
        </div>

        <button :disabled="isDisabled" class="submit-btn" @click="mysubmit">
          提交
        </button>
      </div>

      <div class="users-card">
        <h2 class="users-title">已注册用户</h2>

        <div v-if="usersStore.registeredUsers.length > 0" class="users-list">
          <div
            v-for="user in usersStore.registeredUsers"
            :key="user.id"
            class="user-item"
          >
            <div class="user-info">
              <p><strong>账号:</strong> {{ user.user }}</p>
              <p><strong>性别:</strong> {{ user.gender }}</p>
              <p>
                <strong>爱好:</strong>
                {{ user.checkedHobby ? user.checkedHobby.join(', ') : '' }}
              </p>
              <p><strong>城市:</strong> {{ user.cityName }}</p>
              <p><strong>注册时间:</strong> {{ user.registerTime }}</p>
            </div>
            <div>
              <button class="delete-btn" @click="removeUser(user.id)">
                删除
              </button>
            </div>
          </div>
        </div>

        <div v-else class="no-users">
          <p>暂无注册用户</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUsersStore } from '../store/register';
import { useUserStore } from '../store/user';

const userStore = useUserStore();
const usersStore = useUsersStore();
const router = useRouter();

let msg = ref('用户注册');
let hobby = [
  '篮球',
  '足球',
  '羽毛球',
  '乒乓球',
  '排球',
  '棒球',
  '橄榄球',
  '保龄球',
];
let user = ref('');
let pwd = ref('');
let pwd2 = ref('');
let tips = ref('');
let gender = ref('');
let checkedHobby = ref([]);
let cityName = ref('');
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
  } else if (tips.value !== '正确') {
    alert('请输入正确的密码');
  } else if (checkedHobby.value.length <= 0) {
    alert('没有选择兴趣');
  } else {
    alert('注册成功！');

    // 创建用户数据对象
    const userData = {
      user: user.value,
      pwd: pwd.value,
      gender: gender.value,
      checkedHobby: [...checkedHobby.value],
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
  pwd.value = '';
  pwd2.value = '';
  gender.value = '';
  checkedHobby.value = [];
  cityName.value = '';
  agree.value = false;
  isDisabled.value = true;
  tips.value = '';
}

// 计算属性
const hs = computed(() => {
  var c = checkedHobby.value.length;
  console.log(checkedHobby.value);
  if (c == 0) {
    return '';
  }
  return c + '项爱好';
});

// 导航栏相关方法
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

// 删除用户方法
const removeUser = userId => {
  if (confirm('确定要删除这个用户吗？')) {
    usersStore.removeUser(userId);
  }
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

/* 表单容器样式 - 修改为左右布局 */
.form-container {
  display: flex;
  justify-content: center;
  padding: 100px 20px 20px;
  gap: 50px;
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
}

.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
}

.users-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
  flex: 1;
  min-width: 400px;
  display: flex;
  flex-direction: column;
}

.users-title {
  text-align: center;
  color: #2b3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
}

.users-title::after {
  content: '';
  display: block;
  width: 100px;
  height: 4px;
  background: linear-gradient(to right, #4a6fa5, #2e5a88);
  margin: 10px auto 0;
  border-radius: 2px;
}

.users-list {
  overflow-y: auto;
  max-height: 840px;
  flex: 1;
}

.user-item {
  background: #f8fafc;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.user-item .user-info p {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #334155;
}

.user-item .user-info strong {
  color: #1e293b;
}

.delete-btn {
  margin-top: 7.5rem;
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.delete-btn:hover {
  background-color: #c53030;
}

.no-users {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #64748b;
  font-size: 1.2rem;
}

.form-title {
  text-align: center;
  color: #2b3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
}

.form-title::after {
  content: '';
  display: block;
  width: 100px;
  height: 4px;
  background: linear-gradient(to right, #4a6fa5, #2e5a88);
  margin: 10px auto 0;
  border-radius: 2px;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-label {
  display: block;
  margin-bottom: 0.6rem;
  color: #333;
  font-weight: 600;
  font-size: 1.3rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.9rem 1.2rem;
  border: 2px solid #e0e6ed;
  border-radius: 10px;
  font-size: 1rem;
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
  gap: 3rem;
}

.radio-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-option input {
  margin-right: 0.6rem;
  width: 18px;
  height: 18px;
  accent-color: #4a6fa5;
}

.checkbox-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.checkbox-option {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.checkbox-option:hover {
  background-color: #e2e8f0;
  transform: translateY(-1px);
}

.checkbox-option input {
  margin-right: 0.6rem;
  width: 16px;
  height: 16px;
  accent-color: #4a6fa5;
}

.form-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.8rem;
  border-radius: 8px;
  background-color: #f0f4f8;
  transition: all 0.2s ease;
}

.form-checkbox:hover {
  background-color: #e2e8f0;
}

.form-checkbox input {
  margin-right: 0.8rem;
  width: 18px;
  height: 18px;
  accent-color: #4a6fa5;
}

.submit-btn {
  width: 100%;
  padding: 1.1rem;
  background: linear-gradient(135deg, #4a6fa5, #2e5a88);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 4px 15px rgba(46, 90, 136, 0.3);
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a7fb5, #3e6a98);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(46, 90, 136, 0.4);
}

.submit-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
