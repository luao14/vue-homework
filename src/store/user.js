// src/stores/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: null,
    userStuId: null,
    isLoggedIn: false,
  }),

  actions: {
    login(userName, userStuId) {
      this.userName = userName;
      this.userStuId = userStuId;
      this.isLoggedIn = true;
    },

    logout() {
      this.userName = null;
      this.userStuId = null;
      this.isLoggedIn = false;
    },
  },
  persist: {
    key: 'user-info',
    storage: localStorage,
  },
});
