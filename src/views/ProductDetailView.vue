<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/services/api';
import { useCartStore } from '@/stores/cart';
import { useLocale } from '@/composables/useLocale';
import { toCategoryKey } from '@/utils/category';
import type { Product } from '@/types';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const { t } = useLocale();

const product = ref<Product | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  loading.value = true;
  try {
    const id = Number(route.params.id);
    product.value = await api.products.getById(id);
  } catch {
    error.value = '商品載入失敗';
  } finally {
    loading.value = false;
  }
});

function addToCart() {
  if (!product.value) return;
  cartStore.addItem(product.value);
  ElMessage.success(t('product.addedToCart'));
}
</script>

<template>
  <div class="detail-page" v-loading="loading">
    <el-button text @click="router.back()" class="back-btn"> ← 返回 </el-button>

    <el-alert v-if="error" :title="error" type="error" show-icon />

    <div v-if="product" class="detail">
      <div class="image-wrap">
        <img :src="product.image" :alt="product.title" />
      </div>

      <div class="info">
        <el-tag>{{ t(`category.${toCategoryKey(product.category)}`) }}</el-tag>
        <h1 class="title">{{ product.title }}</h1>

        <div class="rating">
          <el-rate :model-value="product.rating.rate" disabled show-score />
          <span class="count">（{{ product.rating.count }} 則評價）</span>
        </div>

        <p class="price">${{ product.price.toFixed(2) }}</p>
        <p class="description">{{ product.description }}</p>

        <el-button type="primary" size="large" @click="addToCart">
          {{ t('product.addToCart') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.back-btn {
  margin-bottom: 24px;
  font-size: 15px;
}

.detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.image-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border-radius: 8px;
  padding: 32px;
  min-height: 400px;

  img {
    max-height: 380px;
    max-width: 100%;
    object-fit: contain;
  }
}

.info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.4;
  color: #222;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;

  .count {
    font-size: 13px;
    color: #999;
  }
}

.price {
  font-size: 32px;
  font-weight: bold;
  color: #409eff;
}

.description {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}
</style>
