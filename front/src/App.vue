<script setup lang="ts">
import LogPanel from './LogPanel.vue';
import TreeRender from './TreeRender.vue'
// import Panels from './Panels.vue'
</script>

<template>
<n-loading-bar-provider>
  <n-message-provider>
    <n-notification-provider>
            <!-- <div class="pane-left">
            </div> -->
            <!-- <div class="pane-logs"> -->
    <n-layout has-sider sider-placement="right"
    position="absolute">
      <n-layout-content content-style="padding: 0;">
                <TreeRender />

      </n-layout-content>
      <n-layout-sider
        collapse-mode="transform"
        :native-scrollbar="false"
        :collapsed-width="200"
        :width="440"
        show-trigger="bar"
        content-style="padding: 0; height: 100%;"
        bordered
        default-collapsed        
      >
        <LogPanel />
      </n-layout-sider>
    </n-layout>
            <!-- </div> -->
    </n-notification-provider>
  </n-message-provider>
</n-loading-bar-provider>
</template>

<style>
 .pane-root {
    height: 100%;
    width: 100%;
    display: flex;
    flex: 1 600px;
 }

 .pane-left {
    /* width: 100%; */
    /* margin: 0 auto; */
    background-color: lightgray;
 }

 .pane-right {
    width: 600px;
    position: relative;
 }

.pane-logs {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 500px;
}
</style>