// src/stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        userName: null,
        isLoggedIn: false
    }),

    actions: {

        login(userName) {
            this.userName = userName
            this.isLoggedIn = true
        },

        logout() {
            this.userName = null
            this.isLoggedIn = false
        }
    }
})