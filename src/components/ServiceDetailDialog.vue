<template>
  <el-dialog
    v-model="dialogVisible"
    title="服务详情"
    width="600px"
    @close="handleClose"
  >
    <div v-if="service" class="service-detail">
      <div class="detail-image">
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

      <div class="detail-info">
        <h2 class="detail-name">
          {{ service.name }}
        </h2>

        <div class="detail-price">
          <span v-if="service.discount > 0" class="original-price">
            原价：¥{{ service.originalPrice.toFixed(2) }}
          </span>
          <span class="current-price">
            价格：¥{{ service.price.toFixed(2) }}
          </span>
          <span v-if="service.discount > 0" class="discount">
            优惠：省¥{{ service.discount.toFixed(2) }}
          </span>
        </div>

        <div class="detail-meta">
          <div class="meta-item">
            <span class="meta-label">所属科室：</span>
            <span class="meta-value">{{ service.department }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">服务时长：</span>
            <span class="meta-value">{{ service.duration }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">库存数量：</span>
            <span
              class="meta-value"
              :class="{ 'low-stock': service.stock < 10 }"
            >
              {{ service.stock }}
            </span>
          </div>
        </div>

        <div class="detail-description">
          <h3>服务描述</h3>
          <p>{{ service.description }}</p>
        </div>

        <div class="detail-tags">
          <h3>服务标签</h3>
          <div class="tags-container">
            <el-tag
              v-for="tag in service.tags"
              :key="tag"
              :type="tag === '热门' ? 'danger' : 'success'"
              size="large"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>

        <div v-if="service.remarks" class="detail-remarks">
          <h3>备注信息</h3>
          <p>{{ service.remarks }}</p>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose"> 关闭 </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue';
import { Picture } from '@element-plus/icons-vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  service: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
});

const handleClose = () => {
  dialogVisible.value = false;
};
</script>

<style scoped>
.service-detail {
  padding: 20px;
}

.detail-image {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.detail-image .el-image {
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
  font-size: 60px;
}

.badge {
  position: absolute;
  top: 15px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  color: white;
  font-weight: bold;
}

.badge.hot {
  right: 15px;
  background-color: #f56c6c;
}

.badge.recommended {
  left: 15px;
  background-color: #67c23a;
}

.detail-info {
  padding: 0 10px;
}

.detail-name {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 15px;
}

.detail-price {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.current-price {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
}

.discount {
  font-size: 14px;
  color: #67c23a;
  background-color: #f0f9ff;
  padding: 4px 8px;
  border-radius: 4px;
}

.detail-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.meta-value {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
}

.meta-value.low-stock {
  color: #f56c6c;
}

.detail-description,
.detail-tags,
.detail-remarks {
  margin-bottom: 20px;
}

.detail-description h3,
.detail-tags h3,
.detail-remarks h3 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 10px;
}

.detail-description p,
.detail-remarks p {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.tags-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .detail-image {
    height: 200px;
  }

  .detail-name {
    font-size: 20px;
  }

  .detail-price {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-meta {
    grid-template-columns: 1fr;
  }
}
</style>
