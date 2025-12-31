<template>
  <div>
    <!-- 导航栏 -->
    <TheNavbar />

    <!-- 购物车内容 -->
    <div class="shopping-cart-container">
      <div class="cart-header">
        <button class="back-button" @click="goBack">
          <span>← 后退</span>
        </button>
        <h1 class="cart-title">购物车</h1>
      </div>

      <div class="cart-content">
        <!-- 购物车表格 -->
        <div class="cart-table-wrapper">
          <table class="cart-table">
            <!-- 表头 -->
            <thead class="cart-table-header">
              <tr>
                <th class="col-select">
                  <input
                    v-model="cartStore.selectAll"
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
                v-for="(item, index) in cartStore.cartItems"
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
            <span>已选择 {{ cartStore.selectedCount }} 种商品</span>
          </div>
          <div class="summary-right">
            <div class="summary-item">
              <span>所有商品总数：</span>
              <span class="summary-value">{{ cartStore.totalQuantity }}件</span>
            </div>
            <div class="summary-item">
              <span>选中商品总价：</span>
              <span class="summary-value selected-total"
                >{{ cartStore.selectedTotal.toFixed(2) }}元</span
              >
            </div>
            <div class="summary-item">
              <span>所有商品总价：</span>
              <span class="summary-value total-price"
                >{{ cartStore.totalPrice.toFixed(2) }}元</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/store/cart';
import { watch } from 'vue';
import TheNavbar from './TheNavbar.vue';

// 状态管理
const cartStore = useCartStore();

// 监听商品选择状态变化，更新全选状态
watch(
  () => cartStore.cartItems.map(item => item.selected),
  () => {
    cartStore.updateSelectAll();
  },
  { deep: true }
);

// 数量控制：增加
const increaseQuantity = index => {
  cartStore.increaseQuantity(index);
};

// 数量控制：减少
const decreaseQuantity = index => {
  cartStore.decreaseQuantity(index);
};

// 处理数量输入
const handleQuantityInput = index => {
  cartStore.updateQuantity(index, cartStore.cartItems[index].quantity);
};

// 处理全选
const handleSelectAll = () => {
  cartStore.handleSelectAll();
};

// 处理单个商品选择
const handleItemSelect = () => {
  // 自动触发watch更新
};

// 后退功能，后退2步或尽可能后退到最早页面
const goBack = () => {
  // 检查历史记录长度，history.length包含当前页面
  if (history.length > 3) {
    // 当历史记录足够时，后退2步
    window.history.go(-2);
  } else if (history.length > 1) {
    // 当历史记录不足2步时，退回到最早页面
    window.history.go(-(history.length - 1));
  }
};
</script>

<style scoped>
/* 购物车样式 */
.shopping-cart-container {
  margin-top: 120px;
}

/* 购物车头部样式 */
.cart-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

/* 后退按钮样式 */
.back-button {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-button:hover {
  background-color: #34495e;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cart-title {
  color: #2c3e50;
  font-size: 2rem;
  margin: 0;
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
