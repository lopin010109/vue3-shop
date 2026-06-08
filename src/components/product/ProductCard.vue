<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import type { Product } from '@/types';
import { useLocale } from '@/composables/useLocale';
import { toCategoryKey } from '@/utils/category';

const { t } = useLocale();

const props = defineProps<{ product: Product }>();
const cartStore = useCartStore();

function addToCart() {
  cartStore.addItem(props.product);
  ElMessage.success(t('product.addedToCart'));
}
</script>

<template>
  <el-card class="product-card" :body-style="{ padding: '0' }" shadow="hover">
    <router-link :to="{ name: 'product-detail', params: { id: product.id } }">
      <div class="image-wrap">
        <img :src="product.image" :alt="product.title" />
      </div>
    </router-link>

    <div class="info">
      <router-link :to="{ name: 'product-detail', params: { id: product.id } }">
        <p class="title">{{ product.title }}</p>
      </router-link>
      <p class="category">
        {{ t(`category.${toCategoryKey(product.category)}`) }}
      </p>

      <div class="footer">
        <span class="price">${{ product.price.toFixed(2) }}</span>
        <el-button type="primary" size="small" @click="addToCart">
          {{ t('product.addToCart') }}
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
}

.image-wrap {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: #fafafa;

  img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }
}

.info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.title {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category {
  font-size: 12px;
  color: #999;
  text-transform: capitalize;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}
</style>
