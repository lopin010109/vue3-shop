<template>
  <div style="padding: 80px 0">
    <el-result icon="warning" title="404" sub-title="找不到這個頁面">
      <template #extra>
        <el-button type="primary" @click="$router.push({ name: 'products' })">
          回首頁
        </el-button>
      </template>
    </el-result>
  </div>
</template>
