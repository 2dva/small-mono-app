<template>
 <n-thing content-indented  :class="cssClass">
    <template #header>
      <h2><RouterLink :to="getViewPostRoute({ nick: post.nick })">{{ post.title }}</RouterLink></h2>
    </template>
    <template #description>
    <span class="description">{{  post.description }}</span>
    </template>
    <template #footer>
       Likes: {{ post.likesCount }} 
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import { getViewPostRoute } from '../lib/routes';
import { Post } from '../store/post';

interface Props {
  post: NonNullable<Post>
  isMinePost: boolean
}
const props = defineProps<Props>()
const cssClass = props.isMinePost ? 'post post_own' : 'post'
</script>

<style scoped>
.description {
  font-size: 18px;
}

.post {
  position: relative;
  padding: 20px;
  border: 1px solid #bcbcbc;
  border-radius: 10px;
}

.post.post_own {
  background-color: #f3fff3;
}
</style>
