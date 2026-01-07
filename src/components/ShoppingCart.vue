<template>
  <div>
    <!-- 导航栏 -->
    <TheNavbar />

    <!-- 购物车内容 -->
    <div class="shopping-cart-container">
      <div class="cart-header">
        <h1 class="cart-title">商品管理</h1>
      </div>

      <div class="cart-content">
        <!-- 购物车表格 -->
        <div class="cart-table-wrapper">
          <el-table
            :data="cartStore.cartItems"
            stripe
            border
            style="width: 100%"
            @row-hover="handleRowHover"
          >
            <!-- 表头 -->
            <el-table-column type="selection" width="55" align="center">
              <template #header>
                <el-checkbox
                  v-model="cartStore.selectAll"
                  @change="handleSelectAll"
                >
                  <span>全选</span>
                </el-checkbox>
              </template>
            </el-table-column>

            <el-table-column prop="id" label="序号" width="80" align="center">
              <template #default="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>

            <el-table-column
              prop="name"
              label="商品名称"
              min-width="180"
              align="center"
            />

            <el-table-column
              prop="price"
              label="单价/元"
              width="120"
              align="center"
            >
              <template #default="{ row }">
                {{ row.price.toFixed(2) }}元
              </template>
            </el-table-column>

            <el-table-column
              prop="quantity"
              label="数量/件"
              width="160"
              align="center"
            >
              <template #default="{ row, $index }">
                <el-input-number
                  v-model="row.quantity"
                  :min="1"
                  size="small"
                  @change="handleQuantityInput($index)"
                />
              </template>
            </el-table-column>

            <el-table-column
              prop="subtotal"
              label="小计/元"
              width="120"
              align="center"
            >
              <template #default="{ row }">
                {{ (row.price * row.quantity).toFixed(2) }}元
              </template>
            </el-table-column>

            <!-- 新增标签列 -->
            <el-table-column label="标签" min-width="150" align="center">
              <template #default="{ row }">
                <el-tag
                  v-for="tag in row.tags || ['热门', '推荐']"
                  :key="tag"
                  size="small"
                  :type="tag === '热门' ? 'danger' : 'success'"
                  style="margin-right: 5px"
                >
                  {{ tag }}
                </el-tag>
              </template>
            </el-table-column>

            <!-- 新增商品图片列 -->
            <el-table-column label="商品图片" width="100" align="center">
              <template #default="{ row }">
                <el-image
                  :src="
                    row.image ||
                    'https://picsum.photos/seed/product' + row.id + '/100/100'
                  "
                  :preview-src-list="[
                    row.image ||
                      'https://picsum.photos/seed/product' +
                        row.id +
                        '/400/400',
                  ]"
                  fit="cover"
                  style="width: 60px; height: 60px; border-radius: 4px"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </template>
            </el-table-column>

            <!-- 新增操作列 -->
            <el-table-column label="操作" width="180" align="center">
              <template #default="{ row, $index }">
                <el-button
                  type="primary"
                  size="small"
                  style="margin-right: 5px"
                  @click="viewDetail(row)"
                >
                  <el-icon><View /></el-icon> 查看详情
                </el-button>
                <el-button
                  type="warning"
                  size="small"
                  style="margin-right: 5px"
                  @click="editItem(row)"
                >
                  <el-icon><Edit /></el-icon> 编辑
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteItem(row, $index)"
                >
                  <el-icon><Delete /></el-icon> 删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
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
import { ElMessage } from 'element-plus';
import { Edit, View, Picture, Delete } from '@element-plus/icons-vue';

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

// 处理数量输入
const handleQuantityInput = index => {
  cartStore.updateQuantity(index, cartStore.cartItems[index].quantity);
};

// 处理全选
const handleSelectAll = () => {
  cartStore.handleSelectAll();
};

// 处理行悬停
const handleRowHover = () => {
  // 可以在这里添加行悬停时的逻辑
};

// 查看详情
const viewDetail = row => {
  // 查看详情的逻辑
  ElMessage({
    message: `查看商品${row.name}的详情`,
    type: 'info',
    duration: 2000,
  });
  console.log('查看详情:', row);
  // 可以跳转到详情页面或弹出详情对话框
};

// 编辑商品
const editItem = row => {
  // 编辑商品的逻辑
  ElMessage({
    message: `编辑商品${row.name}`,
    type: 'warning',
    duration: 2000,
  });
  console.log('编辑商品:', row);
  // 可以跳转到编辑页面或弹出编辑对话框
};

// 删除商品
const deleteItem = (row, index) => {
  // 删除商品的逻辑
  ElMessage({
    message: `删除商品${row.name}`,
    type: 'success',
    duration: 2000,
  });
  cartStore.removeItem(index);
  console.log('删除商品:', row);
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

.cart-title {
  color: #2c3e50;
  font-size: 2rem;
  margin: 0;
}

.cart-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

/* 表格样式 */
.cart-table-wrapper {
  margin-bottom: 1rem;
  max-height: 500px;
  overflow-y: auto;
}

/* 图片错误占位符样式 */
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background-color: #f5f7fa;
  color: #909399;
}

/* 购物车汇总样式 */
.cart-summary {
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
