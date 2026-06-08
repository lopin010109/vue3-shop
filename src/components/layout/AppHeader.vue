<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useLocale } from '@/composables/useLocale';
import { ShoppingCart } from '@element-plus/icons-vue';

const { t, locale, toggleLocale } = useLocale();
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
  authStore.logout();
  router.push({ name: 'products' });
}
</script>

<template>
  <el-header style="background: #fff; border-bottom: 1px solid #eee">
    <div class="header-inner">
      <router-link :to="{ name: 'products' }" class="logo">
        🛍️ Vue3 Shop
      </router-link>

      <nav class="nav">
        <router-link :to="{ name: 'products' }">{{
          t('nav.home')
        }}</router-link>

        <el-badge
          :value="cartStore.totalCount"
          :hidden="cartStore.totalCount === 0"
        >
          <router-link :to="{ name: 'cart' }">
            <el-icon :size="22" style="vertical-align: middle">
              <ShoppingCart />
            </el-icon>
          </router-link>
        </el-badge>

        <el-button text @click="toggleLocale">
          {{ locale === 'zh-TW' ? 'EN' : '中文' }}
        </el-button>

        <el-button v-if="authStore.isLoggedIn" text @click="handleLogout">
          {{ t('nav.logout') }}
        </el-button>

        <router-link v-else :to="{ name: 'login' }">{{
          t('nav.login')
        }}</router-link>
      </nav>
    </div>
  </el-header>
</template>

<style scoped lang="scss">
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
}

.nav {
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 15px;

  a {
    color: #333;

    &.router-link-active {
      color: #409eff;
      font-weight: 600;
    }
  }
}
</style>
