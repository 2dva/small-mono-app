<template>
  <div>
    <h1>Posts</h1>
    <div class="posts">
      <div v-for="post in posts" :class="post.author.id === myData?.id ? 'post post_own' : 'post'" :key="post.nick">
        <Segment size="2" :description="post.description">
          <template v-slot:header>
            <RouterLink :to="getViewPostRoute({ nick: post.nick })">{{ post.title }}</RouterLink>
          </template>
        </Segment>
      </div>
      <n-space v-if="isFetchingNextPage" justify="center">
        <n-spin size="medium" />
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import Segment from '../../components/Segment.vue'
import { me } from '../../lib/injectionKeys'
import { getViewPostRoute } from '../../lib/routes'
import { useTRPC } from '../../lib/useTrpc'
import { Post } from '../../store/post'
import { layoutScrollEvent } from '../../lib/scrollEventEmitter'

const posts = ref<Post[]>([])
const { myData } = inject(me)!
const trpc = useTRPC()
const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.getPosts.useInfiniteQuery(() => {
  return {
    limit: 2
  }
}, { 
  getNextPageParam: (lastPage) => {
    return lastPage.nextCursor
  },
  refetchOnWindowFocus: false,
  refetchOnMount: false,
 })

 if (data.value) {
  posts.value = data.value?.pages.flatMap((page) => page.posts)
}

watch(data, () => {
  if (typeof data.value !== 'undefined') {
    console.log(`Post:list: got pages:`, data.value.pages)
    posts.value = data.value.pages.flatMap((page) => page.posts)
  }
})

layoutScrollEvent.on(() => {
  if (!hasNextPage.value || isFetchingNextPage.value) return
  fetchNextPage()
})
</script>

<style scoped>
.filter {
  margin-bottom: 20px;
}

h1 {
  text-align: center;
}

.posts {
  max-width: 600px;
  margin: 0 auto;
}

.post {
  position: relative;
  padding: 20px;
  border: 1px solid #bcbcbc;
  border-radius: 10px;
  margin-bottom: 15px;
}

.post.post_own {
  background-color: #f3fff3;
}

.more {
  margin-top: 15px;
}

</style>
