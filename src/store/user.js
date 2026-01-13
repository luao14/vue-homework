// src/stores/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: null,
    userStuId: null,
    isLoggedIn: false,
    realName: null,
    department: null,
    position: null,
    contact: null,
  }),

  actions: {
    login(userName, userStuId) {
      this.userName = userName;
      this.userStuId = userStuId;
      this.isLoggedIn = true;
      this.realName = '郭天正';
      this.department = '校医院';
      this.position = '医师';
      this.contact = '13800138000';
    },

    logout() {
      this.userName = null;
      this.userStuId = null;
      this.isLoggedIn = false;
      this.realName = null;
      this.department = null;
      this.position = null;
      this.contact = null;
    },
  },
  persist: {
    key: 'user-info',
    storage: localStorage,
  },
});
