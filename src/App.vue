<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue';
</script>

<template>
  <el-container direction="vertical" style="min-height: 100vh">
    <AppHeader />
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>
