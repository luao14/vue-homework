<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加医疗服务"
    width="80%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="service-selector">
      <div class="search-section">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索服务名称或描述"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <div class="filter-section">
        <el-select
          v-model="selectedCategory"
          placeholder="选择分类"
          clearable
          @change="handleFilter"
        >
          <el-option label="全部分类" value="" />
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>

        <el-select
          v-model="priceRange"
          placeholder="价格范围"
          clearable
          @change="handleFilter"
        >
          <el-option label="全部价格" value="" />
          <el-option label="免费" value="free" />
          <el-option label="0-50元" value="0-50" />
          <el-option label="50-100元" value="50-100" />
          <el-option label="100元以上" value="100+" />
        </el-select>

        <el-select v-model="sortBy" placeholder="排序方式" @change="handleSort">
          <el-option label="默认排序" value="default" />
          <el-option label="价格从低到高" value="price-asc" />
          <el-option label="价格从高到低" value="price-desc" />
          <el-option label="库存从多到少" value="stock-desc" />
        </el-select>
      </div>

      <div class="services-grid">
        <div
          v-for="service in filteredServices"
          :key="service.id"
          class="service-card"
          :class="{ 'in-cart': isInCart(service.id) }"
        >
          <div class="service-image">
            <el-image
              :src="service.image"
              :preview-src-list="[service.image]"
              fit="cover"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div v-if="service.hot" class="badge hot">热门</div>
            <div v-if="service.recommended" class="badge recommended">推荐</div>
          </div>

          <div class="service-info">
            <h3 class="service-name">
              {{ service.name }}
            </h3>
            <p class="service-description">
              {{ service.description }}
            </p>

            <div class="service-meta">
              <span class="service-department">{{ service.department }}</span>
              <span class="service-duration">{{ service.duration }}</span>
            </div>

            <div class="service-tags">
              <el-tag
                v-for="tag in service.tags"
                :key="tag"
                size="small"
                :type="tag === '热门' ? 'danger' : 'success'"
              >
                {{ tag }}
              </el-tag>
            </div>

            <div class="service-price">
              <span v-if="service.discount > 0" class="original-price">
                ¥{{ service.originalPrice.toFixed(2) }}
              </span>
              <span class="current-price">¥{{ service.price.toFixed(2) }}</span>
              <span v-if="service.discount > 0" class="discount">
                省¥{{ service.discount.toFixed(2) }}
              </span>
            </div>

            <div class="service-stock">
              <span :class="{ 'low-stock': service.stock < 10 }">
                库存: {{ service.stock }}
              </span>
            </div>

            <div class="service-actions">
              <el-input-number
                v-model="serviceQuantities[service.id]"
                :min="1"
                :max="service.stock"
                size="small"
                :disabled="isInCart(service.id)"
              />
              <el-button
                type="primary"
                :disabled="isInCart(service.id) || service.stock === 0"
                @click="addToCart(service)"
              >
                {{ isInCart(service.id) ? '已在购物车' : '添加到购物车' }}
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <el-empty
        v-if="filteredServices.length === 0"
        description="没有找到匹配的服务"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose"> 取消 </el-button>
        <el-button type="primary" @click="handleClose"> 完成 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useCartStore } from '@/store/cart';
import {
  availableServices,
  serviceCategories,
  searchServices,
  sortServicesByPrice,
  sortServicesByStock,
} from '@/store/services';
import { ElMessage } from 'element-plus';
import { Search, Picture } from '@element-plus/icons-vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'added']);

const cartStore = useCartStore();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
});

const searchKeyword = ref('');
const selectedCategory = ref('');
const priceRange = ref('');
const sortBy = ref('default');
const serviceQuantities = ref({});

const categories = serviceCategories;

const filteredServices = ref([...availableServices]);

const isInCart = serviceId => {
  return cartStore.cartItems.some(item => item.id === serviceId);
};

const handleSearch = () => {
  applyFilters();
};

const handleFilter = () => {
  applyFilters();
};

const handleSort = () => {
  applyFilters();
};

const applyFilters = () => {
  let result = [...availableServices];

  if (searchKeyword.value) {
    result = searchServices(searchKeyword.value);
  }

  if (selectedCategory.value) {
    result = result.filter(
      service => service.categoryId === selectedCategory.value
    );
  }

  if (priceRange.value) {
    if (priceRange.value === 'free') {
      result = result.filter(service => service.price === 0);
    } else if (priceRange.value === '0-50') {
      result = result.filter(
        service => service.price >= 0 && service.price <= 50
      );
    } else if (priceRange.value === '50-100') {
      result = result.filter(
        service => service.price > 50 && service.price <= 100
      );
    } else if (priceRange.value === '100+') {
      result = result.filter(service => service.price > 100);
    }
  }

  if (sortBy.value === 'price-asc') {
    result = sortServicesByPrice(result, true);
  } else if (sortBy.value === 'price-desc') {
    result = sortServicesByPrice(result, false);
  } else if (sortBy.value === 'stock-desc') {
    result = sortServicesByStock(result, false);
  }

  filteredServices.value = result;
};

const addToCart = service => {
  const quantity = serviceQuantities.value[service.id] || 1;
  if (quantity > service.stock) {
    ElMessage.warning('库存不足');
    return;
  }

  cartStore.addItem({
    ...service,
    quantity,
  });

  ElMessage.success(`已添加 ${service.name} 到购物车`);
  emit('added', service);
};

const handleClose = () => {
  dialogVisible.value = false;
  searchKeyword.value = '';
  selectedCategory.value = '';
  priceRange.value = '';
  sortBy.value = 'default';
  serviceQuantities.value = {};
  applyFilters();
};

watch(
  () => props.modelValue,
  newVal => {
    if (newVal) {
      applyFilters();
    }
  }
);
</script>

<style scoped>
.service-selector {
  padding: 20px;
}

.search-section {
  margin-bottom: 20px;
}

.filter-section {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-section .el-select {
  width: 180px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-height: 600px;
  overflow-y: auto;
}

.service-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
}

.service-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.service-card.in-cart {
  opacity: 0.6;
  pointer-events: none;
}

.service-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.service-image .el-image {
  width: 100%;
  height: 100%;
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 40px;
}

.badge {
  position: absolute;
  top: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
  font-weight: bold;
}

.badge.hot {
  right: 10px;
  background-color: #f56c6c;
}

.badge.recommended {
  left: 10px;
  background-color: #67c23a;
}

.service-info {
  padding: 15px;
}

.service-name {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px;
}

.service-description {
  font-size: 13px;
  color: #666;
  margin: 0 0 10px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.service-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 12px;
  color: #909399;
}

.service-department,
.service-duration {
  background-color: #f0f2f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.service-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.service-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.current-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.discount {
  font-size: 12px;
  color: #67c23a;
  background-color: #f0f9ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.service-stock {
  font-size: 12px;
  color: #606266;
  margin-bottom: 10px;
}

.service-stock .low-stock {
  color: #f56c6c;
  font-weight: bold;
}

.service-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.service-actions .el-input-number {
  flex: 1;
}

.service-actions .el-button {
  flex: 2;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
  }

  .filter-section {
    flex-direction: column;
  }

  .filter-section .el-select {
    width: 100%;
  }
}
</style>
