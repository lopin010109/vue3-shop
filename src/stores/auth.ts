import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@/services/api';
import type { LoginPayload } from '@/types';

const TOKEN_KEY = 'vue3shop_token';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const isLoggedIn = computed(() => !!token.value);

  async function login(payload: LoginPayload) {
    const data = await api.auth.login(payload);
    token.value = data.token;
    localStorage.setItem(TOKEN_KEY, data.token);
  }

  function logout() {
    token.value = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  return { token, isLoggedIn, login, logout };
});
