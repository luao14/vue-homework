<template>
  <div>
    <TheNavbar />

    <div class="registered-users-container">
      <div class="users-card">
        <h2 class="users-title">已注册用户</h2>

        <div
          v-if="usersStore.registeredUsers.length > 0"
          class="users-table-container"
        >
          <table class="users-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>用户名</th>
                <th>姓名</th>
                <th>性别</th>
                <th>住址</th>
                <th>城市</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in usersStore.registeredUsers" :key="user.id">
                <td>{{ formatDate(user.registerTime) }}</td>
                <td>{{ user.user }}</td>
                <td>{{ user.name || '未填写' }}</td>
                <td>{{ user.gender || '未填写' }}</td>
                <td>{{ user.address || '未填写' }}</td>
                <td>{{ user.cityName }}</td>
                <td>
                  <button class="delete-btn" @click="removeUser(user.id)">
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="no-users">
          <p>暂无注册用户</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUsersStore } from '../store/register';
import TheNavbar from './TheNavbar.vue';

const usersStore = useUsersStore();

// 删除用户方法
const removeUser = userId => {
  if (confirm('确定要删除这个用户吗？')) {
    usersStore.removeUser(userId);
  }
};

// 格式化日期
const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
</script>

<style scoped>
.registered-users-container {
  display: flex;
  justify-content: center;
  padding: 100px 20px 20px;
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
  min-height: calc(100vh - 120px);
  overflow: hidden;
}

.users-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 1200px;
  max-height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
}

.users-title {
  text-align: center;
  color: #2b3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
  flex-shrink: 0;
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

.users-table-container {
  overflow-x: auto;
  flex: 1;
  max-height: calc(100% - 120px);
  overflow-y: auto;
}

/* 自定义滚动条样式 */
.users-table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.users-table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.users-table-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.users-table-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
}

.users-table th,
.users-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.users-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #334155;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.users-table tr:nth-child(even) {
  background-color: #f8fafc;
}

.users-table tr:hover {
  background-color: #f1f5f9;
  transition: background-color 0.2s ease;
}

.delete-btn {
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
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
  flex: 1;
}
</style>
