<script setup lang="ts">
import TreeRender from './TreeRender.vue'
</script>

<template>
    <n-layout has-sider style="width: 100%;">
      <n-layout-sider content-style="padding: 24px;">
        <TreeRender />
      </n-layout-sider>
      <n-layout>
        Rght pane
      </n-layout>
    </n-layout>
</template>

<style scoped>
.n-layout-header,
.n-layout-footer {
  background: rgb(128, 128, 128, 0.2);
  padding: 24px;
}

.n-layout-sider {
  background: rgb(128, 128, 128, 0.3);
}

.n-layout-content {
  background: rgb(128, 128, 128, 0.4);
}
</style>