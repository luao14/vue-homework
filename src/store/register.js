import { defineStore } from 'pinia';

export const useUsersStore = defineStore('users', {
  state: () => ({
    registeredUsers: [],
  }),

  actions: {
    // 添加用户
    addUser(userData) {
      // 确保registeredUsers是数组，如果不是则初始化为空数组
      if (!Array.isArray(this.registeredUsers)) {
        this.registeredUsers = [];
      }

      // 检查是否已存在相同用户名的用户
      const existingUser = this.registeredUsers.find(
        user => user.user === userData.user
      );
      if (!existingUser) {
        // 为用户添加唯一ID
        const newUser = {
          ...userData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        };
        // 使用替换整个数组的方式确保响应式更新
        this.registeredUsers = [...this.registeredUsers, newUser];
      }
    },

    // 删除用户
    removeUser(userId) {
      // 确保registeredUsers是数组
      if (!Array.isArray(this.registeredUsers)) {
        this.registeredUsers = [];
        return;
      }
      this.registeredUsers = this.registeredUsers.filter(
        user => user.id !== userId
      );
    },

    // 更新用户
    updateUser(userId, updatedData) {
      // 确保registeredUsers是数组
      if (!Array.isArray(this.registeredUsers)) {
        this.registeredUsers = [];
        return;
      }

      const index = this.registeredUsers.findIndex(user => user.id === userId);
      if (index !== -1) {
        const updatedUsers = [...this.registeredUsers];
        updatedUsers[index] = { ...updatedUsers[index], ...updatedData };
        this.registeredUsers = updatedUsers;
      }
    },
  },

  // 使用持久化插件保存数据到localStorage
  persist: {
    key: 'registered-users',
    storage: localStorage,
    // 确保整个状态都被持久化
    paths: ['registeredUsers'],
    // 确保数据正确序列化
    serializer: {
      serialize: JSON.stringify,
      deserialize: data => {
        try {
          const parsed = JSON.parse(data);
          // 确保解析后的数据是正确的格式
          if (
            !parsed ||
            !parsed.registeredUsers ||
            !Array.isArray(parsed.registeredUsers)
          ) {
            return { registeredUsers: [] };
          }
          return parsed;
        } catch (e) {
          console.error('Error parsing stored data:', e);
          return { registeredUsers: [] };
        }
      },
    },
  },
});
