<template>
  <div class="login-container">
    <div class="login-form">
      <div class="header">
        <img src="@/image/logo.png" alt="logo" class="logo" />
        <h1>用户登录</h1>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <p>登录名称：</p>
          <input
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            required
          />
        </div>

        <div class="form-group">
          <p>登录密码：</p>
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            required
          />
        </div>

        <button type="submit" class="login-btn">
          <span>登录</span>
        </button>
      </form>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';

const router = useRouter();
const userStore = useUserStore();
const username = ref('guotianzheng');
const password = ref('2411050224');
const errorMessage = ref('');

const handleLogin = () => {
  if (username.value === 'guotianzheng' && password.value === '2411050224') {
    userStore.login(username.value, password.value);
    router.push('/mainhome');
  } else {
    errorMessage.value = '账号或密码错误';
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    -45deg,
    #1f2a31,
    #2e3d4d,
    #5678b3,
    #6b9cf1,
    #5678b3,
    #2e3d4d,
    #1f2a31
  );
  background-size: 400% 400%;
  animation: gradientBG 10s ease infinite;
  padding: 20px;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

@keyframes gradientBG {
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

.login-form {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  position: relative;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 15px;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.header h1 {
  color: white;
}

.form-group {
  margin-bottom: 35px;
  display: flex;
  align-items: center;
  gap: 1px;
}

.form-group p {
  color: white;
  font-weight: 500;
  font-size: 20px;
}

input {
  flex: 1;
  padding: 15px 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  font-size: 16px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0);
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

input::placeholder {
  color: rgba(255, 255, 255, 0.402);
}

input:focus {
  outline: none;
  border-color: rgb(255, 255, 255);
  box-shadow: 0 0 15px rgb(255, 255, 255);
  background: rgba(255, 255, 255, 0.15);
}

input:focus::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.login-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #4becfd, #12b0f4, #1a72ff, #0813ec);
  background-size: 400% 400%;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: gradientShift 3s ease infinite;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.login-btn span {
  position: relative;
  z-index: 1;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(255, 255, 255),
    transparent
  );
  transition: 1s;
}

.login-btn:hover::before {
  left: 100%;
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

.error-message {
  color: #eb2b2b;
  text-align: center;
  margin-top: 15px;
  font-weight: 500;
  animation: shake 1s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }

  20%,
  60% {
    transform: translateX(-5px);
  }

  40%,
  80% {
    transform: translateX(5px);
  }
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(50px, 50px);
  }
}
</style>
