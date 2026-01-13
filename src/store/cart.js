import { defineStore } from 'pinia';

// 导入图片资源
import hospitalImage1 from '@/image/医院1.jpg';
import hospitalImage2 from '@/image/医院2.jpg';
import hospitalImage3 from '@/image/医院3.jpg';
import hospitalImage4 from '@/image/医院4.jpg';
import hospitalImage5 from '@/image/医院5.jpg';
import hospitalImage6 from '@/image/医院6.jpg';
import hospitalImage7 from '@/image/医院7.jpg';
import hospitalImage8 from '@/image/医院8.jpg';
import hospitalImage9 from '@/image/医院9.jpg';
import hospitalImage10 from '@/image/医院10.jpg';
import hospitalImage11 from '@/image/医院11.jpg';
import hospitalImage12 from '@/image/医院12.jpg';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [
      {
        id: 1,
        name: '校医门诊挂号',
        price: 5.0,
        quantity: 1,
        selected: false,
        tags: ['校医服务', '基础服务'],
        image: hospitalImage1,
      },
      {
        id: 2,
        name: '校医药品发放',
        price: 0.0,
        quantity: 1,
        selected: false,
        tags: ['校医服务', '常用服务'],
        image: hospitalImage2,
      },
      {
        id: 3,
        name: '学生常规健康体检',
        price: 120.0,
        quantity: 1,
        selected: false,
        tags: ['校医服务', '体检服务', '热门'],
        image: hospitalImage3,
      },
      {
        id: 4,
        name: '学生疫苗接种',
        price: 50.0,
        quantity: 1,
        selected: false,
        tags: ['校医服务', '预防保健'],
        image: hospitalImage4,
      },
      {
        id: 5,
        name: '校医血常规检查',
        price: 25.0,
        quantity: 1,
        selected: false,
        tags: ['校医服务', '基础检查'],
        image: hospitalImage5,
      },
      {
        id: 6,
        name: '校医心电图检查',
        price: 50.0,
        quantity: 1,
        selected: false,
        tags: ['校医服务', '心脏检查'],
        image: hospitalImage6,
      },
      {
        id: 7,
        name: '校医健康咨询',
        price: 0.0,
        quantity: 1,
        selected: false,
        tags: ['校医服务', '健康指导', '推荐'],
        image: hospitalImage7,
      },
      {
        id: 8,
        name: '校医急诊处理',
        price: 30.0,
        quantity: 1,
        selected: false,
        tags: ['校医服务', '急诊服务', '热门'],
        image: hospitalImage8,
      },
      {
        id: 9,
        name: '校医常见病诊疗',
        price: 10.0,
        quantity: 1,
        selected: false,
        tags: ['校医服务', '诊疗服务'],
        image: hospitalImage9,
      },
      {
        id: 10,
        name: '校医心理健康咨询',
        price: 0.0,
        quantity: 1,
        selected: false,
        tags: ['校医服务', '心理咨询', '推荐'],
        image: hospitalImage10,
      },
      {
        id: 11,
        name: '校医传染病防控',
        price: 0.0,
        quantity: 1,
        selected: false,
        tags: ['校医服务', '预防保健'],
        image: hospitalImage11,
      },
      {
        id: 12,
        name: '校医健康教育讲座',
        price: 0.0,
        quantity: 1,
        selected: false,
        tags: ['校医服务', '健康指导'],
        image: hospitalImage12,
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
