<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useLocale } from '@/composables/useLocale';
import { ShoppingCart, Expand, Fold } from '@element-plus/icons-vue';

const { t, locale, toggleLocale } = useLocale();
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const menuOpen = ref(false);

function handleLogout() {
  authStore.logout();
  menuOpen.value = false;
  router.push({ name: 'products' });
}

function closeMenu() {
  menuOpen.value = false;
}
</script>

<template>
  <el-header
    style="
      background: #fff;
      border-bottom: 1px solid #eee;
      position: relative;
      overflow: visible;
      height: auto;
      min-height: 60px;
      padding: 0;
    "
  >
    <div class="header-inner">
      <router-link :to="{ name: 'products' }" class="logo" @click="closeMenu">
        🛍️ Vue3 Shop
      </router-link>

      <!-- 桌機版 nav -->
      <nav class="nav desktop-nav">
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

      <!-- 行動版右側：購物車 icon + 漢堡 -->
      <div class="mobile-actions">
        <el-badge
          :value="cartStore.totalCount"
          :hidden="cartStore.totalCount === 0"
        >
          <router-link :to="{ name: 'cart' }" @click="closeMenu">
            <el-icon :size="22" style="vertical-align: middle">
              <ShoppingCart />
            </el-icon>
          </router-link>
        </el-badge>

        <el-button text @click="menuOpen = !menuOpen" class="hamburger">
          <el-icon :size="22">
            <Fold v-if="menuOpen" />
            <Expand v-else />
          </el-icon>
        </el-button>
      </div>
    </div>

    <!-- 行動版展開選單 -->
    <transition name="slide">
      <nav v-if="menuOpen" class="mobile-menu">
        <router-link :to="{ name: 'products' }" @click="closeMenu">
          {{ t('nav.home') }}
        </router-link>
        <el-button text @click="toggleLocale">
          {{ locale === 'zh-TW' ? 'EN' : '中文' }}
        </el-button>
        <el-button v-if="authStore.isLoggedIn" text @click="handleLogout">
          {{ t('nav.logout') }}
        </el-button>
        <router-link v-else :to="{ name: 'login' }" @click="closeMenu">
          {{ t('nav.login') }}
        </router-link>
      </nav>
    </transition>
  </el-header>
</template>

<style scoped lang="scss">
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
  padding: 0 16px;
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

.desktop-nav {
  @media (max-width: 768px) {
    display: none;
  }
}

.mobile-actions {
  display: none;
  align-items: center;
  gap: 12px;

  a {
    color: #333;
  }

  @media (max-width: 768px) {
    display: flex;
  }
}

.hamburger {
  padding: 4px;
}

.mobile-menu {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-top: 1px solid #eee;
  padding: 0 16px;
  gap: 0;

  a {
    display: block;
    width: 100%;
    padding: 14px 0;
    font-size: 15px;
    color: #333;
    border-bottom: 1px solid #f5f5f5;

    &.router-link-active {
      color: #409eff;
      font-weight: 600;
    }
  }

  :deep(.el-button) {
    width: 100%;
    padding: 14px 0;
    font-size: 15px;
    color: #333;
    border-bottom: 1px solid #f5f5f5;
    justify-content: flex-start;
    height: auto;
    margin: 0;
  }

  @media (min-width: 769px) {
    display: none;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
