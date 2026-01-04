<template>
  <div>
    <h1>Posts</h1>
    <div :class="$style['posts']">
      <div v-for="post in posts" :class="$style['post']" :key="post.nick">
        <button :class="$style['remove-button']" @click="() => removePost(post.nick)">X</button>
        <Segment :title="post.name" size="2" :description="post.description" children="">
          <template v-slot:header>
            <RouterLink :class="$style['postLink']" :to="`/posts/${post.nick}`">{{ post.name }}</RouterLink>
          </template>
        </Segment>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import Segment from '../components/Segment.vue'
import { usePosts } from '../store/post'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const store = usePosts()
const { allPosts: posts } = storeToRefs(store)
// const posts = generatePosts(8)
// const posts = ref<Post[]>([]);
onMounted(() => {
  // store.init()
  // posts.value = store.getAllPosts
})

function removePost(nick: string) {
  store.removePost(nick)
}
</script>

<style module>
.filter {
  margin-bottom: 20px;
}

.posts {
  max-width: 600px;
  margin: 0 auto;
}

.post {
  position: relative;
  padding: 20px;
  border: 1px solid #000;
  border-radius: 10px;
  margin-bottom: 15px;
}

.remove-button {
  position: absolute;
  top: 5px;
  right: 5px;
}

.more {
  margin-top: 15px;
}
</style>
