<template>
    <div class="login-container">

        <div class="header">
            <img src="@/image/logo.png" alt="logo" class="logo" />
            <h1>用户登录</h1>
        </div>

        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <p>账号：</p>
                <input type="text" v-model="username" placeholder="请输入用户名" required />
            </div>
            <div class="form-group">
                <p>密码：</p>
                <input type="password" v-model="password" placeholder="请输入密码" required />
            </div>

            <button type="submit">登录</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const username = ref('')
const password = ref('')

const handleLogin = () => {
    if (username.value === 'admin' && password.value === 'admin') {
        router.push('/main')
    } else {
        alert('账号或密码错误')
    }
}
</script>

<style scoped>
.login-container {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.form-group {
    margin-bottom: 20px;
    display: flex;
}

input {
    width: 80%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    box-sizing: border-box;
}

button {
    width: 100%;
    padding: 12px 15px;
    background-color: #0080f8;
    color: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.4s;
    margin-top: 20px;
    margin-bottom: 20px;
    box-sizing: border-box;
}

button:hover {
    background-color: #0004ff;
}

.header {
    display: flex;
    align-items: center;
    margin: 2rem;
}

.logo {
    width: 45px;
    height: 45px;
    margin-right: 10px;
}

p {
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>