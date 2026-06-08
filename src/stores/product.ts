import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';
import type { Product } from '@/types';

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([]);
  const categories = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchProducts(category?: string) {
    loading.value = true;
    error.value = null;
    try {
      products.value = category
        ? await api.products.getByCategory(category)
        : await api.products.getAll();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '載入失敗';
    } finally {
      loading.value = false;
    }
  }

  async function fetchCategories() {
    if (categories.value.length) return;
    categories.value = await api.products.getCategories();
  }

  return {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    fetchCategories,
  };
});
