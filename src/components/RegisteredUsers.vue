<template>
  <div>
    <TheNavbar />

    <div class="registered-users-container">
      <div class="users-card">
        <h2 class="users-title">体检用户管理</h2>

        <div class="tabs">
          <div
            class="tab-item"
            :class="{ active: activeTab === 'list' }"
            @click="activeTab = 'list'"
          >
            <span>体检用户列表</span>
          </div>
          <div
            class="tab-item"
            :class="{ active: activeTab === 'register' }"
            @click="activeTab = 'register'"
          >
            <span>体检用户登记</span>
          </div>
        </div>

        <div v-if="activeTab === 'list'" class="tab-content">
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
                  <th>体检项目</th>
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
                    {{
                      user.checkupItems && user.checkupItems.length > 0
                        ? user.checkupItems.join(', ')
                        : '未选择'
                    }}
                  </td>
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
            <p>暂无注册体检用户</p>
          </div>
        </div>

        <div v-if="activeTab === 'register'" class="tab-content">
          <div class="register-form">
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
              <label class="form-label">参与的体检项目：</label>
              <div class="checkbox-group">
                <label class="checkbox-option">
                  <input
                    v-model="checkupItems"
                    type="checkbox"
                    value="血常规"
                  />
                  <span class="checkbox-text">血常规</span>
                </label>
                <label class="checkbox-option">
                  <input
                    v-model="checkupItems"
                    type="checkbox"
                    value="尿常规"
                  />
                  <span class="checkbox-text">尿常规</span>
                </label>
                <label class="checkbox-option">
                  <input
                    v-model="checkupItems"
                    type="checkbox"
                    value="心电图"
                  />
                  <span class="checkbox-text">心电图</span>
                </label>
                <label class="checkbox-option">
                  <input
                    v-model="checkupItems"
                    type="checkbox"
                    value="胸部X光"
                  />
                  <span class="checkbox-text">胸部X光</span>
                </label>
                <label class="checkbox-option">
                  <input
                    v-model="checkupItems"
                    type="checkbox"
                    value="肝功能检查"
                  />
                  <span class="checkbox-text">肝功能检查</span>
                </label>
                <label class="checkbox-option">
                  <input
                    v-model="checkupItems"
                    type="checkbox"
                    value="B超检查"
                  />
                  <span class="checkbox-text">B超检查</span>
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
              <button
                :disabled="isDisabled"
                class="submit-btn"
                @click="mysubmit"
              >
                提交
              </button>
              <button class="reset-btn" @click="resetForm">重置</button>
            </div>
          </div>
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

const activeTab = ref('list');

let user = ref('');
let name = ref('');
let pwd = ref('');
let pwd2 = ref('');
let tips = ref('');
let gender = ref('');
let checkupItems = ref([]);
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

watch(agree, newVal => {
  isDisabled.value = !newVal;
});

function mysubmit() {
  if (user.value.length < 4) {
    alert('用户名长度不能小于 4');
  } else if (!name.value) {
    alert('请输入姓名');
  } else if (!address.value) {
    alert('请输入住址');
  } else if (tips.value !== '正确') {
    alert('请输入正确的密码');
  } else if (checkupItems.value.length === 0) {
    alert('请至少选择一项体检项目');
  } else {
    alert('注册成功！');

    const userData = {
      user: user.value,
      name: name.value,
      pwd: pwd.value,
      gender: gender.value,
      address: address.value,
      cityName: cityName.value,
      checkupItems: checkupItems.value,
      registerTime: new Date().toLocaleString(),
    };

    usersStore.addUser(userData);
    resetForm();
    activeTab.value = 'list';
  }
}

function resetForm() {
  user.value = '';
  name.value = '';
  pwd.value = '';
  pwd2.value = '';
  gender.value = '';
  checkupItems.value = [];
  cityName.value = '';
  address.value = '';
  agree.value = false;
  isDisabled.value = true;
  tips.value = '';
}

const removeUser = userId => {
  if (confirm('确定要删除这个体检用户吗？')) {
    usersStore.removeUser(userId);
  }
};

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

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 1rem;
  flex-shrink: 0;
}

.tab-item {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #64748b;
  background: transparent;
}

.tab-item:hover {
  background: #f1f5f9;
  color: #0066cc;
}

.tab-item.active {
  background: linear-gradient(135deg, #0066cc, #0088cc);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.users-table-container {
  overflow-x: auto;
  max-height: calc(100% - 20px);
  overflow-y: auto;
}

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
}

.register-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  align-items: start;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #4a6fa5 #f0f4f8;
}

.register-form::-webkit-scrollbar {
  width: 8px;
}

.register-form::-webkit-scrollbar-track {
  background: #f0f4f8;
  border-radius: 4px;
}

.register-form::-webkit-scrollbar-thumb {
  background: #4a6fa5;
  border-radius: 4px;
}

.register-form::-webkit-scrollbar-thumb:hover {
  background: #3e6a98;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
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

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
}

.checkbox-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  background-color: #f0f4f8;
  transition: all 0.2s ease;
}

.checkbox-option:hover {
  background-color: #e2e8f0;
}

.checkbox-option input {
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
  grid-column: 1 / -1;
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

@media (max-width: 1200px) {
  .users-card {
    padding: 2rem;
  }

  .users-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 768px) {
  .registered-users-container {
    padding: 80px 1rem 1rem;
  }

  .users-card {
    padding: 1.5rem;
    max-height: calc(100vh - 120px);
  }

  .users-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .tabs {
    flex-direction: column;
    gap: 0.5rem;
  }

  .tab-item {
    text-align: center;
  }

  .register-form {
    grid-template-columns: 1fr;
    padding: 0;
  }

  .checkbox-group {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }

  .users-table {
    font-size: 0.9rem;
  }

  .users-table th,
  .users-table td {
    padding: 8px 10px;
  }

  .radio-group {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .users-title {
    font-size: 1.3rem;
  }

  .tab-item {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  .button-group {
    flex-direction: column;
  }

  .submit-btn,
  .reset-btn {
    width: 100%;
  }
}
</style>
