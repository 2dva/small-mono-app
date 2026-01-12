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
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import Segment from '../../components/Segment.vue'
import { me } from '../../lib/injectionKeys'
import { getViewPostRoute } from '../../lib/routes'
import { useTRPC } from '../../lib/useTrpc'
import { Post } from '../../store/post'

// const store = usePosts()
// const { allPosts: posts } = storeToRefs(store)
const posts = ref<Post[]>([])
const { myData } = inject(me)!

const trpc = useTRPC()
const queryData = trpc.getPosts.useQuery(() => {}, { enabled: false })

onMounted(async () => {
  await queryData.refetch()

  if (typeof queryData.data.value !== 'undefined') {
    console.log(`Post:list: got values:`, queryData.data.value.posts)

    posts.value = queryData.data.value.posts
  }
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
</style>
