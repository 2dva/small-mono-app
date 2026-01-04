<template>
  <div :class="$style['layout']">
    <div :class="$style['left-menu']">
      <n-menu :options="menuOptions" />
      <button @click="handleGenerateClick" style="margin: 5px">Generate</button>
    </div>
    <div :class="$style['content']">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { usePosts } from '../store/post'
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { MenuOption } from 'naive-ui'
import { h } from 'vue'

const showPost = ref(false)
const postId = ref('')
const route = useRoute()

const id = route.params.nick || ''

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

watch(
  () => route.params.nick,
  (newId) => {
    postId.value = newId as string
    showPost.value = !!newId
  },
  { immediate: true } // Run the watcher immediately on component mount
)

function handleGenerateClick() {
  store.generatePosts()
}

if (id) {
  showPost.value = true
  postId.value = String(id)
  console.log(`PostPage: setting prop to ${id}`)
}

const store = usePosts()
store.init()
onMounted(() => {
  console.log(`Post:OnMounted`)
})
</script>

<style module>
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
