import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [
      { name: '商品1', price: 99.99, quantity: 1, selected: false },
      { name: '商品2', price: 199.99, quantity: 1, selected: false },
      { name: '商品3', price: 299.99, quantity: 1, selected: false },
      { name: '商品4', price: 399.99, quantity: 1, selected: false },
      { name: '商品5', price: 499.99, quantity: 1, selected: false },
    ],
    selectAll: false,
  }),

  getters: {
    totalQuantity: state => {
      return state.cartItems.reduce((total, item) => total + item.quantity, 0);
    },

    totalPrice: state => {
      return state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    selectedCount: state => {
      return state.cartItems.filter(item => item.selected).length;
    },

    selectedTotal: state => {
      return state.cartItems.reduce((total, item) => {
        return item.selected ? total + item.price * item.quantity : total;
      }, 0);
    },
  },

  actions: {
    increaseQuantity(index) {
      this.cartItems[index].quantity++;
    },

    decreaseQuantity(index) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity--;
      }
    },

    updateQuantity(index, quantity) {
      if (isNaN(quantity) || quantity < 1) {
        this.cartItems[index].quantity = 1;
      } else {
        this.cartItems[index].quantity = quantity;
      }
    },

    handleSelectAll() {
      this.cartItems.forEach(item => {
        item.selected = this.selectAll;
      });
    },

    updateSelectAll() {
      const allSelected = this.cartItems.every(item => item.selected);
      const someSelected = this.cartItems.some(item => item.selected);

      if (allSelected) {
        this.selectAll = true;
      } else if (!someSelected) {
        this.selectAll = false;
      } else {
        this.selectAll = false;
      }
    },
  },

  persist: {
    key: 'cart-info',
    storage: localStorage,
  },
});
