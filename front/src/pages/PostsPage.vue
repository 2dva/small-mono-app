<template>
  <div style="position: relative; padding-top: 1px;">
    <div :class="$style['left-menu']">
      <n-menu :options="menuOptions" />
      <button @click="handleGenerateClick" style="margin: 5px;">Generate</button>
    </div>
    <div v-if="showPost"><ViewPost :postId="postId"/></div>
    <div v-else><AllPosts/></div>
</div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { usePosts } from '../store/post';
import { onMounted, ref, watch } from 'vue';
import AllPosts from './AllPosts.vue';
import { RouterLink, useRoute } from 'vue-router';
import ViewPost from './ViewPost.vue';
import { MenuOption } from 'naive-ui';
import { h } from 'vue'

const showPost = ref(false)
const postId = ref('')
const route = useRoute()

const id = route.params.nick || ''

const menuOptions: MenuOption[] = [
  {
    label: () => h(RouterLink, { to: '/posts'}, 'All posts'),
    key: "all-posts",
  },
  {
    label: "Add post",
    key: "add-post",
  },
]

watch(
  () => route.params.nick,
  (newId, oldId) => {
    console.log(`Id is changed from ${oldId} to ${newId}`)
    postId.value = newId as string
    showPost.value = !!newId
  },
  { immediate: true } // Run the watcher immediately on component mount
);

function handleGenerateClick() {
  console.log(`generating...`);
  store.generatePosts()
}

console.log(`PostsPage:check id: ${id}`);

if (id) {
  showPost.value = true
  postId.value = String(id)
  console.log(`PostPage: setting prop to ${id}`);
}

const store = usePosts()
onMounted(() => {
  store.init()
});

</script>

<style module>
.left-menu {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 200px;

}
</style>
