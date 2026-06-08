import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CartItem, Product } from '@/types';

const CART_KEY = 'vue3shop_cart';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadCart());

  const totalCount = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0),
  );
  const totalPrice = computed(() =>
    items.value.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  );

  function persist() {
    localStorage.setItem(CART_KEY, JSON.stringify(items.value));
  }

  function addItem(product: Product) {
    const existing = items.value.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      items.value.push({ product, quantity: 1 });
    }
    persist();
  }

  function removeItem(productId: number) {
    items.value = items.value.filter((i) => i.product.id !== productId);
    persist();
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find((i) => i.product.id === productId);
    if (!item) return;
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      item.quantity = quantity;
      persist();
    }
  }

  function clearCart() {
    items.value = [];
    localStorage.removeItem(CART_KEY);
  }

  return {
    items,
    totalCount,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
});
