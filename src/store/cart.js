import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [
      {
        id: 1,
        name: '无线蓝牙耳机',
        price: 99.99,
        quantity: 1,
        selected: false,
        tags: ['热门', '推荐', '电子产品'],
        image: 'https://picsum.photos/seed/product1/100/100',
      },
      {
        id: 2,
        name: '纯棉短袖T恤',
        price: 199.99,
        quantity: 1,
        selected: false,
        tags: ['新品', '服装', '夏季'],
        image: 'https://picsum.photos/seed/product2/100/100',
      },
      {
        id: 3,
        name: '智能手表',
        price: 299.99,
        quantity: 1,
        selected: false,
        tags: ['热门', '新品', '智能穿戴'],
        image: 'https://picsum.photos/seed/product3/100/100',
      },
      {
        id: 4,
        name: '运动鞋',
        price: 399.99,
        quantity: 1,
        selected: false,
        tags: ['推荐', '运动', '户外'],
        image: 'https://picsum.photos/seed/product4/100/100',
      },
      {
        id: 5,
        name: '笔记本电脑',
        price: 499.99,
        quantity: 1,
        selected: false,
        tags: ['热门', '新品', '推荐', '数码'],
        image: 'https://picsum.photos/seed/product5/100/100',
      },
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

    removeItem(index) {
      this.cartItems.splice(index, 1);
      // 删除后更新全选状态
      this.updateSelectAll();
    },
  },

  persist: {
    key: 'cart-info',
    storage: localStorage,
  },
});
