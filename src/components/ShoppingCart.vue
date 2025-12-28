<template>
  <div>
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-left">
        <div class="nav-brand">
          <img src="@/image/logo.png" alt="logo" class="logo" />
          <h2>义乌工商学院</h2>
        </div>
      </div>

      <div class="nav-center">
        <div class="nav-menu-item" @click="goToHome">
          <span>首页</span>
        </div>
        <div class="nav-menu-item" @click="goToMyInfo">
          <span>个人信息</span>
        </div>
        <div class="nav-menu-item">
          <span>每日新闻</span>
        </div>
        <div class="nav-menu-item" @click="goToRegister">
          <span>注册用户</span>
        </div>
        <div
          class="nav-menu-item"
          :class="{ active: $route.path === '/shoppingcart' }"
        >
          <span>动态功能</span>
        </div>
      </div>

      <div class="nav-right">
        <div class="nav-user">
          <span>{{ userName }}</span>
          <button class="nav-button" @click="handleLogout">登出</button>
        </div>
      </div>
    </nav>

    <!-- 购物车内容 -->
    <div class="shopping-cart-container">
      <h1 class="cart-title">购物车</h1>

      <div class="cart-content">
        <!-- 购物车表格 -->
        <div class="cart-table-wrapper">
          <table class="cart-table">
            <!-- 表头 -->
            <thead class="cart-table-header">
              <tr>
                <th class="col-select">
                  <input
                    v-model="selectAll"
                    type="checkbox"
                    class="select-all-checkbox"
                    @change="handleSelectAll"
                  />
                  <span>全选</span>
                </th>
                <th class="col-index">序号</th>
                <th class="col-name">商品名称</th>
                <th class="col-price">单价/元</th>
                <th class="col-quantity">数量/件</th>
                <th class="col-subtotal">小计/元</th>
              </tr>
            </thead>

            <!-- 表格内容 -->
            <tbody>
              <tr
                v-for="(item, index) in cartItems"
                :key="index"
                class="cart-table-row"
              >
                <td class="col-select">
                  <input
                    v-model="item.selected"
                    type="checkbox"
                    class="item-checkbox"
                    @change="handleItemSelect"
                  />
                </td>
                <td class="col-index">
                  {{ index + 1 }}
                </td>
                <td class="col-name">
                  {{ item.name }}
                </td>
                <td class="col-price">{{ item.price.toFixed(2) }}元</td>
                <td class="col-quantity">
                  <div class="quantity-control">
                    <button
                      class="quantity-btn decrease"
                      :disabled="item.quantity <= 1"
                      @click="decreaseQuantity(index)"
                    >
                      -
                    </button>
                    <input
                      v-model.number="item.quantity"
                      type="number"
                      class="quantity-input"
                      min="1"
                      @input="handleQuantityInput(index)"
                    />
                    <button
                      class="quantity-btn increase"
                      @click="increaseQuantity(index)"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td class="col-subtotal">
                  {{ (item.price * item.quantity).toFixed(2) }}元
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 购物车汇总 -->
        <div class="cart-summary">
          <div class="summary-left">
            <span>已选择 {{ selectedCount }} 种商品</span>
          </div>
          <div class="summary-right">
            <div class="summary-item">
              <span>所有商品总数：</span>
              <span class="summary-value">{{ totalQuantity }}件</span>
            </div>
            <div class="summary-item">
              <span>选中商品总价：</span>
              <span class="summary-value selected-total"
                >{{ selectedTotal.toFixed(2) }}元</span
              >
            </div>
            <div class="summary-item">
              <span>所有商品总价：</span>
              <span class="summary-value total-price"
                >{{ totalPrice.toFixed(2) }}元</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user';
import mitt from 'mitt';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

// 创建事件总线
const emitter = mitt();

// 路由和状态管理
const router = useRouter();
const userStore = useUserStore();
const userName = userStore.userName;

// 购物车数据，添加selected属性用于记录选择状态
const cartItems = ref([
  { name: '商品1', price: 99.99, quantity: 1, selected: false },
  { name: '商品2', price: 199.99, quantity: 1, selected: false },
  { name: '商品3', price: 299.99, quantity: 1, selected: false },
  { name: '商品4', price: 399.99, quantity: 1, selected: false },
  { name: '商品5', price: 499.99, quantity: 1, selected: false },
]);

// 全选状态
const selectAll = ref(false);

// 计算属性：商品总数
const totalQuantity = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

// 计算属性：商品总价
const totalPrice = computed(() => {
  return cartItems.value.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

// 计算属性：选中商品数量
const selectedCount = computed(() => {
  return cartItems.value.filter(item => item.selected).length;
});

// 计算属性：选中商品总价
const selectedTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return item.selected ? total + item.price * item.quantity : total;
  }, 0);
});

// 监听商品选择状态变化，更新全选状态
watch(
  () => cartItems.value.map(item => item.selected),
  newValues => {
    const allSelected = newValues.every(selected => selected);
    const someSelected = newValues.some(selected => selected);

    if (allSelected) {
      selectAll.value = true;
    } else if (!someSelected) {
      selectAll.value = false;
    } else {
      // 部分选中时，不应改变全选按钮的状态，保持为false
      selectAll.value = false;
    }
  },
  { deep: true }
);

// 数量控制：增加
const increaseQuantity = index => {
  cartItems.value[index].quantity++;
  // 发送事件通知其他组件
  emitter.emit('quantityChanged', cartItems.value);
};

// 数量控制：减少
const decreaseQuantity = index => {
  if (cartItems.value[index].quantity > 1) {
    cartItems.value[index].quantity--;
    // 发送事件通知其他组件
    emitter.emit('quantityChanged', cartItems.value);
  }
};

// 处理数量输入
const handleQuantityInput = index => {
  let quantity = cartItems.value[index].quantity;
  if (isNaN(quantity) || quantity < 1) {
    cartItems.value[index].quantity = 1;
  }
  // 发送事件通知其他组件
  emitter.emit('quantityChanged', cartItems.value);
};

// 处理全选
const handleSelectAll = () => {
  // 直接设置所有商品的selected状态
  cartItems.value.forEach(item => {
    item.selected = selectAll.value;
  });
  // 发送事件通知其他组件
  emitter.emit('selectionChanged', cartItems.value);
};

// 处理单个商品选择
const handleItemSelect = () => {
  // 发送事件通知其他组件
  emitter.emit('selectionChanged', cartItems.value);
};

// 导航方法
const goToHome = () => {
  router.push('/mainhome');
};

const goToMyInfo = () => {
  router.push('/myinfo');
};

const goToRegister = () => {
  router.push('/register');
};

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};
</script>

<style scoped>
/* 复用导航栏样式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(to right, #2c3e50, #4a6491, #2c3e50);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 1000;
  box-sizing: border-box;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-left,
.nav-center,
.nav-right {
  display: flex;
  align-items: center;
}

.nav-left {
  flex: 1;
}

.nav-center {
  flex: 2;
  justify-content: center;
  gap: 1.5rem;
}

.nav-right {
  flex: 1;
  justify-content: flex-end;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.logo {
  width: 45px;
  height: 45px;
  margin-right: 10px;
}

.nav-brand h2 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}

.nav-menu-item {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.8s ease;
}

.nav-menu-item:hover,
.nav-menu-item.active {
  background: linear-gradient(90deg, #4c6897, #a2a2a2, #4c6897);
  background-size: 200% 200%;
  color: white;
  animation: gradientShift 1.5s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-button {
  background-color: #fff;
  color: #2c3e50;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid #ddd;
}

.nav-button:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
}

/* 购物车样式 */
.shopping-cart-container {
  margin-top: 120px;
}

.cart-title {
  text-align: center;
  color: #2c3e50;
  font-size: 2rem;
}

.cart-content {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 10px;
  padding: 2rem;
}

/* 表格样式 */
.cart-table-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
}

/* 表头样式 */
.cart-table-header {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 100;
}

.cart-table-header th {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e0e0e0;
  /* white-space: nowrap; */
}

/* 表格列宽分配 */
.col-select {
  width: 80px;
  text-align: center;
}

.col-index {
  width: 60px;
  text-align: center;
}

.col-name {
  flex: 2;
  text-align: center;
}

.col-price {
  width: 120px;
  text-align: center;
}

.col-quantity {
  width: 160px;
  text-align: center;
}

.col-subtotal {
  width: 120px;
  text-align: center;
}

/* 表格内容样式 */
.cart-table-row {
  border-bottom: 1px solid #e0e0e0;
}

.cart-table-row:hover {
  background-color: #f8f9fa;
}

.cart-table-row td {
  padding: 1.5rem 1rem;
}

/* 复选框样式 */
.select-all-checkbox,
.item-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-right: 0.5rem;
}

/* 数量控制样式 */
.quantity-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
}

.quantity-btn:hover:not(:disabled) {
  background-color: #2c3e50;
  color: white;
  border-color: #2c3e50;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 70px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 1rem;
  padding: 0 0.5rem;
  box-sizing: border-box;
}

.quantity-input:focus {
  outline: none;
  border-color: #2c3e50;
}

/* 购物车汇总样式 */
.cart-summary {
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-left {
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c3e50;
}

.summary-right {
  display: flex;
  gap: 3rem;
  align-items: center;
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.summary-value {
  font-weight: bold;
  color: #2c3e50;
}

.selected-total {
  color: #e74c3c;
  font-size: 1.2rem;
}

.total-price {
  color: #e74c3c;
  font-size: 1.3rem;
}
</style>
