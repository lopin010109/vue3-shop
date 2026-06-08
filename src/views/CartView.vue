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

          <div class="item-right">
            <el-input-number
              :model-value="item.quantity"
              :min="1"
              :max="99"
              @change="
                (val: number | undefined) =>
                  cartStore.updateQuantity(item.product.id, val ?? 1)
              "
            />
            <p class="item-subtotal">
              ${{ (item.product.price * item.quantity).toFixed(2) }}
            </p>
            <el-button
              text
              type="danger"
              @click="cartStore.removeItem(item.product.id)"
            >
              {{ t('cart.remove') }}
            </el-button>
          </div>
        </div>
      </div>

      <div class="cart-summary">
        <h2>{{ t('cart.total') }}</h2>
        <p class="total-price">${{ cartStore.totalPrice.toFixed(2) }}</p>
        <div class="summary-actions">
          <el-button type="primary" size="large">
            {{ t('cart.checkout') }}
          </el-button>
          <el-button size="large" @click="cartStore.clearCart()">
            清空購物車
          </el-button>
        </div>
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
  grid-template-columns: 100px 1fr auto;
  column-gap: 24px;
  row-gap: 20px;
  align-items: start;
  padding: 20px 0;
  border-bottom: 1px solid #eee;

  @media (max-width: 600px) {
    grid-template-columns: 88px 1fr;
    row-gap: 12px;

    .item-right {
      grid-column: 1 / -1;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;

      :deep(.el-button.is-text) {
        width: 100%;
        justify-content: flex-end;
        padding-right: 0;
        margin-top: 4px;
      }
    }
  }
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  background: #fafafa;
  border-radius: 6px;
  padding: 8px;

  @media (max-width: 600px) {
    width: 88px;
    height: 88px;
  }
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;

  .item-title {
    font-size: 15px;
    color: #333;
    line-height: 1.5;

    &:hover {
      color: #409eff;
    }
  }

  .item-price {
    font-size: 14px;
    color: #999;
  }
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;

  :deep(.el-button.is-text) {
    padding-right: 0;
  }
}

.item-subtotal {
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
  white-space: nowrap;
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

.summary-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;

  :deep(.el-button) {
    width: 100%;
    margin: 0;
  }
}
</style>
