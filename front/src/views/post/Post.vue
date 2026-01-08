<template>
  <div :class="$style['layout']">
    <div :class="$style['left-menu']">
      <n-menu :options="menuOptions" />
      <n-button type="primary" size="medium" @click="handleGenerateClick"  style="margin: 8px">Generate</n-button>
    </div>
    <div :class="$style['content']">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { usePosts } from '../../store/post'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { MenuOption } from 'naive-ui'
import { h } from 'vue'
import { useTRPC } from '../../lib/useTrpc'

const menuOptions: MenuOption[] = [
  {
    label: () => h(RouterLink, { to: '/posts' }, () => 'All posts'),
    key: 'all-posts',
  },
  {
    label: 'Add post',
    key: 'add-post',
  },
]

const trpc = useTRPC()
const generateQuery = trpc.generatePosts.useQuery(() => {}, {
  enabled: false,
})

function handleGenerateClick() {
  generateQuery.refetch()
}

usePosts().init()

onMounted(() => {
  console.log(`Post:OnMounted`)
})
</script>

<style module>
h1 {
  text-align: center;
}

.layout {
  position: relative;
  padding-top: 1px;
  display: flex;
}

.left-menu {
  width: 200px;
}

.content {
   flex-grow: 1;
}
</style>
