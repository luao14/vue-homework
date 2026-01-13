<template>
  <div>
    <!-- 导航栏 -->
    <TheNavbar />

    <!-- 购物车内容 -->
    <div class="shopping-cart-container">
      <div class="cart-header">
        <h1 class="cart-title">医疗服务管理</h1>
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
            @selection-change="handleSelectionChange"
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
              label="服务名称"
              min-width="180"
              align="center"
            />

            <el-table-column
              prop="price"
              label="费用/元"
              width="120"
              align="center"
            >
              <template #default="{ row }">
                {{ row.price.toFixed(2) }}元
              </template>
            </el-table-column>

            <el-table-column
              prop="quantity"
              label="预约数量"
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
                  v-for="tag in row.tags || ['常规', '推荐']"
                  :key="tag"
                  size="small"
                  :type="tag === '热门' ? 'danger' : 'success'"
                  style="margin-right: 5px"
                >
                  {{ tag }}
                </el-tag>
              </template>
            </el-table-column>

            <!-- 新增服务图片列 -->
            <el-table-column label="服务图片" width="100" align="center">
              <template #default="{ row }">
                <el-image
                  :src="
                    row.image ||
                    'https://picsum.photos/seed/service' + row.id + '/100/100'
                  "
                  :preview-src-list="[
                    row.image ||
                      'https://picsum.photos/seed/service' +
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
            <span>已选择 {{ cartStore.selectedCount }} 项校医服务</span>
          </div>
          <div class="summary-right">
            <div class="summary-item">
              <span>所有服务总数：</span>
              <span class="summary-value">{{ cartStore.totalQuantity }}项</span>
            </div>
            <div class="summary-item">
              <span>选中服务总价：</span>
              <span class="summary-value selected-total"
                >{{ cartStore.selectedTotal.toFixed(2) }}元</span
              >
            </div>
            <div class="summary-item">
              <span>所有服务总价：</span>
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

const cartStore = useCartStore();

const handleSelectionChange = selection => {
  cartStore.cartItems.forEach(item => {
    item.selected = selection.includes(item);
  });
  cartStore.updateSelectAll();
};

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
  ElMessage({
    message: `查看校医服务${row.name}的详情`,
    type: 'info',
    duration: 2000,
  });
  console.log('查看详情:', row);
};

const editItem = row => {
  ElMessage({
    message: `编辑校医服务${row.name}`,
    type: 'warning',
    duration: 2000,
  });
  console.log('编辑校医服务:', row);
};

const deleteItem = (row, index) => {
  ElMessage({
    message: `删除校医服务${row.name}`,
    type: 'success',
    duration: 2000,
  });
  cartStore.removeItem(index);
  console.log('删除校医服务:', row);
};
</script>

<style scoped>
.shopping-cart-container {
  margin-top: 120px;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.cart-title {
  color: #0066cc;
  font-size: 2rem;
  margin: 0;
}

.cart-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

.cart-table-wrapper {
  margin-bottom: 1rem;
  max-height: 500px;
  overflow-y: auto;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background-color: #f5f7fa;
  color: #909399;
}

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

@media (max-width: 1200px) {
  .cart-content {
    padding: 0 1.5rem 1.5rem;
  }

  .cart-title {
    font-size: 1.8rem;
  }

  .summary-right {
    gap: 2rem;
  }
}

@media (max-width: 992px) {
  .shopping-cart-container {
    margin-top: 100px;
  }

  .cart-header {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .cart-title {
    font-size: 1.6rem;
  }

  .cart-content {
    padding: 0 1rem 1rem;
  }

  .cart-table-wrapper {
    max-height: 400px;
  }

  .cart-summary {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .summary-right {
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .summary-item {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .shopping-cart-container {
    margin-top: 80px;
  }

  .cart-header {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .cart-title {
    font-size: 1.4rem;
  }

  .cart-content {
    padding: 0 0.8rem 0.8rem;
  }

  .cart-table-wrapper {
    max-height: 350px;
    overflow-x: auto;
  }

  .cart-summary {
    padding: 1rem;
  }

  .summary-left {
    font-size: 1rem;
  }

  .summary-right {
    gap: 1rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-item {
    font-size: 0.95rem;
  }

  .selected-total {
    font-size: 1.1rem;
  }

  .total-price {
    font-size: 1.15rem;
  }
}

@media (max-width: 480px) {
  .cart-title {
    font-size: 1.2rem;
  }

  .cart-content {
    padding: 0 0.5rem 0.5rem;
  }

  .cart-table-wrapper {
    max-height: 300px;
  }

  .cart-summary {
    padding: 0.8rem;
  }

  .summary-left {
    font-size: 0.9rem;
  }

  .summary-item {
    font-size: 0.9rem;
  }

  .selected-total {
    font-size: 1rem;
  }

  .total-price {
    font-size: 1.05rem;
  }
}
</style>
