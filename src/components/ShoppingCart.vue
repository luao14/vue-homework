<template>
  <div>
    <TheNavbar />

    <div class="shopping-cart-container">
      <div class="cart-header">
        <h1 class="cart-title">医疗服务管理</h1>
        <el-button type="primary" @click="showServiceSelector = true">
          <el-icon><Plus /></el-icon> 添加服务
        </el-button>
      </div>

      <div class="cart-content">
        <div class="cart-table-wrapper">
          <el-table
            :data="cartStore.cartItems"
            stripe
            border
            style="width: 100%"
            @row-hover="handleRowHover"
            @selection-change="handleSelectionChange"
          >
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
                <div class="price-display">
                  <span v-if="row.discount > 0" class="original-price">
                    ¥{{ row.originalPrice.toFixed(2) }}
                  </span>
                  <span class="current-price">¥{{ row.price.toFixed(2) }}</span>
                </div>
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
                  :max="row.stock"
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
                ¥{{ (row.price * row.quantity).toFixed(2) }}
              </template>
            </el-table-column>

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

            <el-table-column label="操作" width="250" align="center">
              <template #default="{ row, $index }">
                <el-button
                  type="primary"
                  size="small"
                  style="margin-right: 5px"
                  @click="viewDetail(row)"
                >
                  <el-icon><View /></el-icon> 详情
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

        <div class="cart-summary">
          <div class="summary-left">
            <span>已选择 {{ cartStore.selectedCount }} 项校医服务</span>
            <el-button
              v-if="cartStore.selectedCount > 0"
              type="danger"
              size="small"
              @click="removeSelectedItems"
            >
              删除选中项
            </el-button>
          </div>
          <div class="summary-right">
            <div class="summary-item">
              <span>所有服务总数：</span>
              <span class="summary-value">{{ cartStore.totalQuantity }}项</span>
            </div>
            <div class="summary-item">
              <span>原价总额：</span>
              <span class="summary-value original-total"
                >¥{{ cartStore.originalTotalPrice.toFixed(2) }}</span
              >
            </div>
            <div class="summary-item">
              <span>商品优惠：</span>
              <span class="summary-value discount-amount"
                >-¥{{ cartStore.totalDiscount.toFixed(2) }}</span
              >
            </div>
            <div
              v-if="discountResult && discountResult.totalDiscount > 0"
              class="summary-item"
            >
              <span>额外优惠：</span>
              <span class="summary-value extra-discount"
                >-¥{{
                  (
                    discountResult.totalDiscount - cartStore.totalDiscount
                  ).toFixed(2)
                }}</span
              >
            </div>
            <div class="summary-item">
              <span>选中服务总价：</span>
              <span class="summary-value selected-total"
                >¥{{
                  discountResult
                    ? discountResult.finalPrice.toFixed(2)
                    : cartStore.selectedTotal.toFixed(2)
                }}</span
              >
            </div>
            <div class="summary-item">
              <span>所有服务总价：</span>
              <span class="summary-value total-price"
                >¥{{ cartStore.totalPrice.toFixed(2) }}</span
              >
            </div>
            <el-button
              type="primary"
              size="large"
              :disabled="cartStore.selectedCount === 0"
              @click="handleCheckout"
            >
              结算 ({{ cartStore.selectedCount }})
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <ServiceSelector
      v-model="showServiceSelector"
      @added="handleServiceAdded"
    />

    <ServiceDetailDialog v-model="showDetailDialog" :service="currentService" />

    <ServiceEditDialog
      v-model="showEditDialog"
      :service="currentService"
      @saved="handleEditSaved"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/store/cart';
import { useUserStore } from '@/store/user';
import { useOrdersStore } from '@/store/orders';
import { useDiscount } from '@/utils/discount';
import { useInventory } from '@/utils/inventory';
import TheNavbar from './TheNavbar.vue';
import ServiceSelector from './ServiceSelector.vue';
import ServiceDetailDialog from './ServiceDetailDialog.vue';
import ServiceEditDialog from './ServiceEditDialog.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Edit, View, Picture, Delete, Plus } from '@element-plus/icons-vue';

const cartStore = useCartStore();
const userStore = useUserStore();
const ordersStore = useOrdersStore();
const { calculateCartDiscount } = useDiscount();
const { checkCartStock, deductCartStock } = useInventory();

const showServiceSelector = ref(false);
const showDetailDialog = ref(false);
const showEditDialog = ref(false);
const currentService = ref(null);
const discountResult = ref(null);

const handleSelectionChange = selection => {
  cartStore.cartItems.forEach(item => {
    item.selected = selection.includes(item);
  });
  cartStore.updateSelectAll();
  calculateDiscount();
};

const handleQuantityInput = index => {
  cartStore.updateQuantity(index, cartStore.cartItems[index].quantity);
  calculateDiscount();
};

const handleSelectAll = () => {
  cartStore.handleSelectAll();
  calculateDiscount();
};

const handleRowHover = () => {};

const calculateDiscount = () => {
  const selectedItems = cartStore.cartItems.filter(item => item.selected);
  if (selectedItems.length > 0) {
    discountResult.value = calculateCartDiscount(
      selectedItems,
      userStore.memberType
    );
  } else {
    discountResult.value = null;
  }
};

const viewDetail = row => {
  currentService.value = row;
  showDetailDialog.value = true;
};

const editItem = row => {
  currentService.value = row;
  showEditDialog.value = true;
};

const deleteItem = (row, index) => {
  ElMessageBox.confirm(`确定要删除 ${row.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      cartStore.removeItem(index);
      calculateDiscount();
      ElMessage.success('删除成功');
    })
    .catch(() => {});
};

const removeSelectedItems = () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${cartStore.selectedCount} 项服务吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      cartStore.removeSelectedItems();
      calculateDiscount();
      ElMessage.success('删除成功');
    })
    .catch(() => {});
};

const handleServiceAdded = () => {
  ElMessage.success('已添加服务到购物车');
};

const handleEditSaved = () => {
  calculateDiscount();
  ElMessage.success('修改成功');
};

const handleCheckout = () => {
  const selectedItems = cartStore.cartItems.filter(item => item.selected);

  if (selectedItems.length === 0) {
    ElMessage.warning('请先选择要结算的服务');
    return;
  }

  const stockCheck = checkCartStock(selectedItems);
  if (!stockCheck.sufficient) {
    const outOfStockItems = stockCheck.outOfStockItems
      .map(item => `${item.name} (需要${item.required}，库存${item.available})`)
      .join('、');
    ElMessage.warning(`以下服务库存不足：${outOfStockItems}`);
    return;
  }

  const discountInfo = calculateCartDiscount(
    selectedItems,
    userStore.memberType
  );
  const finalAmount = discountInfo.finalPrice;

  ElMessageBox.confirm(
    `确定要结算选中的 ${cartStore.selectedCount} 项服务吗？\n\n原价：¥${discountInfo.originalTotal.toFixed(2)}\n优惠：-¥${discountInfo.totalDiscount.toFixed(2)}\n实付：¥${finalAmount.toFixed(2)}`,
    '确认结算',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
      dangerouslyUseHTMLString: true,
    }
  )
    .then(() => {
      try {
        deductCartStock(selectedItems);

        const orderData = {
          userId: userStore.userStuId,
          userName: userStore.realName,
          userStuId: userStore.userStuId,
          items: selectedItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            originalPrice: item.originalPrice,
            quantity: item.quantity,
            discount: item.discount,
            remarks: item.remarks,
          })),
          originalTotal: discountInfo.originalTotal,
          discountAmount: discountInfo.totalDiscount,
          finalTotal: finalAmount,
          paymentMethod: 'cash',
          appliedDiscounts: discountInfo.appliedRules,
        };

        const order = ordersStore.createOrder(orderData);
        cartStore.removeSelectedItems();
        calculateDiscount();

        ElMessage.success(
          `结算成功！订单号：${order.id}，实付金额：¥${finalAmount.toFixed(2)}`
        );
      } catch (error) {
        ElMessage.error(`结算失败：${error.message}`);
      }
    })
    .catch(() => {});
};
</script>

<style scoped>
.shopping-cart-container {
  margin-top: 120px;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 0 2rem;
}

.cart-title {
  color: #0066cc;
  font-size: 2rem;
  margin: 0;
}

.cart-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

.cart-table-wrapper {
  margin-bottom: 1rem;
  max-height: 500px;
  overflow-y: auto;
}

.price-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.original-price {
  font-size: 11px;
  color: #999;
  text-decoration: line-through;
}

.current-price {
  font-size: 14px;
  font-weight: bold;
  color: #f56c6c;
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
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c3e50;
}

.summary-right {
  display: flex;
  gap: 2rem;
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

.original-total {
  color: #909399;
  font-size: 1rem;
}

.discount-amount {
  color: #67c23a;
  font-size: 1.1rem;
}

.extra-discount {
  color: #e6a23c;
  font-size: 1.1rem;
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

  .cart-header {
    padding: 0 1.5rem;
  }

  .cart-title {
    font-size: 1.8rem;
  }

  .summary-right {
    gap: 1.5rem;
  }
}

@media (max-width: 992px) {
  .shopping-cart-container {
    margin-top: 100px;
  }

  .cart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 0 1rem;
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
    gap: 1rem;
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
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0 0.8rem;
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
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-right {
    gap: 0.8rem;
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
