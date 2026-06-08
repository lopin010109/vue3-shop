<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useLocale } from '@/composables/useLocale';
import type { LoginPayload } from '@/types';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { t } = useLocale();

const form = reactive<LoginPayload>({
  username: '',
  password: '',
});
const loading = ref(false);
const error = ref<string | null>(null);

async function handleLogin() {
  error.value = null;
  loading.value = true;
  try {
    await authStore.login(form);
    const redirect = route.query.redirect as string | undefined;
    router.push(redirect || { name: 'products' });
  } catch {
    error.value = t('login.error');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <el-card class="login-card">
      <h1 class="title">{{ t('login.title') }}</h1>

      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
        style="margin-bottom: 16px"
      />

      <el-form @submit.prevent="handleLogin">
        <el-form-item>
          <el-input
            v-model="form.username"
            :placeholder="t('login.username')"
            size="large"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="form.password"
            :placeholder="t('login.password')"
            type="password"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            native-type="submit"
            :loading="loading"
            style="width: 100%"
          >
            {{ t('login.submit') }}
          </el-button>
        </el-form-item>
      </el-form>

      <p class="hint">
        測試帳號：<strong>mor_2314</strong>　密碼：<strong>83r5^_</strong>
      </p>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 420px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 24px;
}

.hint {
  text-align: center;
  font-size: 13px;
  color: #999;
  margin-top: 16px;
}
</style>
