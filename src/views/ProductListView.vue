<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useProductStore } from '@/stores/product';
import ProductCard from '@/components/product/ProductCard.vue';
import { useLocale } from '@/composables/useLocale';
import { toCategoryKey } from '@/utils/category';

const { t } = useLocale();
const productStore = useProductStore();
const selectedCategory = ref('');
const currentPage = ref(1);
const pageSize = 8;

onMounted(async () => {
  await productStore.fetchCategories();
  await productStore.fetchProducts();
});

watch(selectedCategory, async (category) => {
  currentPage.value = 1;
  await productStore.fetchProducts(category || undefined);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return productStore.products.slice(start, start + pageSize);
});
</script>

<template>
  <div class="product-list">
    <div class="filters">
      <el-radio-group v-model="selectedCategory" size="large">
        <el-radio-button value="">{{ t('category.all') }}</el-radio-button>
        <el-radio-button
          v-for="cat in productStore.categories"
          :key="cat"
          :value="cat"
        >
          {{ t(`category.${toCategoryKey(cat)}`) }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <el-alert
      v-if="productStore.error"
      :title="productStore.error"
      type="error"
      show-icon
      style="margin-bottom: 24px"
    />

    <template v-if="productStore.loading">
      <div class="grid">
        <el-skeleton v-for="n in 8" :key="n" animated>
          <template #template>
            <el-skeleton-item
              variant="image"
              style="height: 200px; border-radius: 4px"
            />
            <div style="padding: 16px">
              <el-skeleton-item
                variant="p"
                style="width: 100%; margin-bottom: 8px"
              />
              <el-skeleton-item variant="p" style="width: 60%" />
            </div>
          </template>
        </el-skeleton>
      </div>
    </template>

    <div v-else class="grid">
      <ProductCard
        v-for="product in paginatedProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="productStore.products.length"
      layout="prev, pager, next"
      class="pagination"
    />
  </div>
</template>

<style scoped lang="scss">
.product-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

.filters {
  margin-bottom: 24px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;

  :deep(.el-radio-group) {
    flex-wrap: nowrap;
    white-space: nowrap;
  }

  :deep(.el-radio-button__inner) {
    text-transform: capitalize;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  min-height: 400px;
}

.pagination {
  margin-top: 32px;
  justify-content: center;
}
</style>
