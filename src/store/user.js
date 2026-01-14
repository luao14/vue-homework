import { defineStore } from 'pinia';
import { useCartStore } from './cart';

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: null,
    userStuId: null,
    isLoggedIn: false,
    realName: null,
    department: null,
    position: null,
    contact: null,
    memberType: 'student',
    cartId: null,
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
      this.memberType = 'student';
      this.loadUserCart();
    },

    logout() {
      this.saveUserCartBeforeLogout();
      this.userName = null;
      this.userStuId = null;
      this.isLoggedIn = false;
      this.realName = null;
      this.department = null;
      this.position = null;
      this.contact = null;
      this.memberType = 'student';
      this.cartId = null;
      this.clearUserCart();
    },

    setMemberType(memberType) {
      this.memberType = memberType;
    },

    loadUserCart() {
      const cartStore = useCartStore();
      if (this.userStuId) {
        cartStore.loadUserCart(this.userStuId);
        this.cartId = this.userStuId;
      }
    },

    saveUserCartBeforeLogout() {
      const cartStore = useCartStore();
      if (this.cartId) {
        cartStore.saveUserCart();
      }
    },

    clearUserCart() {
      const cartStore = useCartStore();
      cartStore.clearCart();
    },

    syncCartToServer() {
      const cartStore = useCartStore();
      if (this.cartId) {
        cartStore.saveUserCart();
      }
    },

    getUserInfo() {
      return {
        userName: this.userName,
        userStuId: this.userStuId,
        realName: this.realName,
        department: this.department,
        position: this.position,
        contact: this.contact,
        memberType: this.memberType,
      };
    },

    updateUserInfo(userInfo) {
      if (userInfo.realName) this.realName = userInfo.realName;
      if (userInfo.department) this.department = userInfo.department;
      if (userInfo.position) this.position = userInfo.position;
      if (userInfo.contact) this.contact = userInfo.contact;
      if (userInfo.memberType) this.memberType = userInfo.memberType;
    },
  },
  persist: {
    key: 'user-info',
    storage: localStorage,
  },
});
