// src/stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        userName: null,
        userStuId: null, // 新增用户学号状态
        isLoggedIn: false
    }),

    actions: {

        login(userName, userStuId) {
            this.userName = userName
            this.userStuId = userStuId
            this.isLoggedIn = true
        },

        logout() {
            this.userName = null
            this.userStuId = null
            this.isLoggedIn = false
        }
    },
    persist: {
        key: 'user-info', // 存储的键名
        storage: localStorage, // 存储方式
    }
})