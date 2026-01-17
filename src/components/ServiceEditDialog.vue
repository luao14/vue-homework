<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑服务"
    width="600px"
    @close="handleClose"
  >
    <el-form
      v-if="service"
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="服务名称" prop="name">
        <el-input v-model="formData.name" disabled />
      </el-form-item>

      <el-form-item label="预约数量" prop="quantity">
        <el-input-number
          v-model="formData.quantity"
          :min="1"
          :max="service.stock"
          :disabled="service.stock === 0"
        />
        <span class="stock-hint">库存：{{ service.stock }}</span>
      </el-form-item>

      <el-form-item label="备注信息" prop="remarks">
        <el-input
          v-model="formData.remarks"
          type="textarea"
          :rows="4"
          placeholder="请输入备注信息（可选）"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="价格信息">
        <div class="price-info">
          <div v-if="formData.discount > 0" class="price-item">
            <span class="price-label">原价：</span>
            <span class="price-value original">
              ¥{{ formData.originalPrice.toFixed(2) }}
            </span>
          </div>
          <div class="price-item">
            <span class="price-label">优惠：</span>
            <span class="price-value discount">
              -¥{{ formData.discount.toFixed(2) }}
            </span>
          </div>
          <div class="price-item">
            <span class="price-label">单价：</span>
            <span class="price-value current">
              ¥{{ formData.price.toFixed(2) }}
            </span>
          </div>
          <div class="price-item">
            <span class="price-label">小计：</span>
            <span class="price-value total">
              ¥{{ (formData.price * formData.quantity).toFixed(2) }}
            </span>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose"> 取消 </el-button>
      <el-button type="primary" @click="handleSave"> 保存 </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useCartStore } from '@/store/cart';

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

const emit = defineEmits(['update:modelValue', 'saved']);

const cartStore = useCartStore();
const formRef = ref(null);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
});

const formData = ref({
  id: null,
  name: '',
  quantity: 1,
  price: 0,
  originalPrice: 0,
  discount: 0,
  remarks: '',
});

const rules = {
  quantity: [
    { required: true, message: '请输入预约数量', trigger: 'blur' },
    {
      type: 'number',
      min: 1,
      message: '数量不能小于1',
      trigger: 'blur',
    },
  ],
};

watch(
  () => props.service,
  newService => {
    if (newService) {
      formData.value = {
        id: newService.id,
        name: newService.name,
        quantity: newService.quantity,
        price: newService.price,
        originalPrice: newService.originalPrice,
        discount: newService.discount,
        remarks: newService.remarks || '',
      };
    }
  },
  { immediate: true }
);

const handleSave = () => {
  formRef.value.validate(valid => {
    if (valid) {
      const index = cartStore.cartItems.findIndex(
        item => item.id === formData.value.id
      );
      if (index !== -1) {
        cartStore.cartItems[index].quantity = formData.value.quantity;
        cartStore.cartItems[index].remarks = formData.value.remarks;
        emit('saved', formData.value);
        dialogVisible.value = false;
      }
    }
  });
};

const handleClose = () => {
  dialogVisible.value = false;
  if (formRef.value) {
    formRef.value.resetFields();
  }
};
</script>

<style scoped>
.stock-hint {
  margin-left: 10px;
  font-size: 12px;
  color: #909399;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-label {
  font-size: 14px;
  color: #606266;
}

.price-value {
  font-size: 16px;
  font-weight: 600;
}

.price-value.original {
  color: #909399;
  text-decoration: line-through;
}

.price-value.discount {
  color: #67c23a;
}

.price-value.current {
  color: #f56c6c;
}

.price-value.total {
  color: #e74c3c;
  font-size: 18px;
}

@media (max-width: 768px) {
  .price-info {
    padding: 10px;
  }

  .price-value {
    font-size: 14px;
  }

  .price-value.total {
    font-size: 16px;
  }
}
</style>
