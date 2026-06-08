<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import { useLocale } from '@/composables/useLocale';

const cartStore = useCartStore();
const { t } = useLocale();
</script>

<template>
  <div class="cart-page">
    <h1 class="page-title">{{ t('cart.title') }}</h1>

    <div v-if="cartStore.items.length === 0" class="empty">
      <el-empty :description="t('cart.empty')">
        <el-button type="primary" @click="$router.push({ name: 'products' })">
          去逛逛
        </el-button>
      </el-empty>
    </div>

    <div v-else class="cart-layout">
      <div class="cart-items">
        <div
          v-for="item in cartStore.items"
          :key="item.product.id"
          class="cart-item"
        >
          <img
            :src="item.product.image"
            :alt="item.product.title"
            class="item-image"
          />

          <div class="item-info">
            <router-link
              :to="{ name: 'product-detail', params: { id: item.product.id } }"
            >
              <p class="item-title">{{ item.product.title }}</p>
            </router-link>
            <p class="item-price">${{ item.product.price.toFixed(2) }}</p>
          </div>

          <div class="item-actions">
            <el-input-number
              :model-value="item.quantity"
              :min="1"
              :max="99"
              size="small"
              @change="
                (val: number | undefined) =>
                  cartStore.updateQuantity(item.product.id, val ?? 1)
              "
            />
            <el-button
              text
              type="danger"
              size="small"
              @click="cartStore.removeItem(item.product.id)"
            >
              {{ t('cart.remove') }}
            </el-button>
          </div>

          <p class="item-subtotal">
            ${{ (item.product.price * item.quantity).toFixed(2) }}
          </p>
        </div>
      </div>

      <div class="cart-summary">
        <h2>{{ t('cart.total') }}</h2>
        <p class="total-price">${{ cartStore.totalPrice.toFixed(2) }}</p>
        <el-button type="primary" size="large" style="width: 100%">
          {{ t('cart.checkout') }}
        </el-button>
        <el-button
          size="large"
          style="width: 100%"
          @click="cartStore.clearCart()"
        >
          清空購物車
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 32px;
}

.empty {
  padding: 64px 0;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 16px;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #eee;

  @media (max-width: 600px) {
    grid-template-columns: 64px 1fr;
    grid-template-rows: auto auto;
  }
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  background: #fafafa;
  border-radius: 4px;
  padding: 4px;
}

.item-info {
  .item-title {
    font-size: 14px;
    color: #333;
    line-height: 1.4;
    margin-bottom: 8px;

    &:hover {
      color: #409eff;
    }
  }

  .item-price {
    font-size: 13px;
    color: #999;
  }
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.item-subtotal {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
  text-align: right;
}

.cart-summary {
  background: #fafafa;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  h2 {
    font-size: 18px;
    font-weight: 600;
  }

  .total-price {
    font-size: 32px;
    font-weight: bold;
    color: #409eff;
  }
}
</style>
