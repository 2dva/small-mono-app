<template>
  <div>
    <h1>Posts</h1>
    <div class="posts">
      <div class="filter">
        <n-input
          name="search_string"
          v-model:value="searchRef"
          placeholder="Type title to search"
          maxlength="99"
          @keydown.enter.prevent
          clearable
        />
      </div>
      <n-alert v-if="isError" title="Error" type="error">
        {{ error }}
      </n-alert>
      <n-alert v-else-if="!posts.length" title="No results" type="info"> No results for this request </n-alert>
      <div v-for="post in posts" :class="post.author.id === myData?.id ? 'post post_own' : 'post'" :key="post.nick">

        <Segment size="2" :description="post.description">
          <template v-slot:header>
            <RouterLink :to="getViewPostRoute({ nick: post.nick })">{{ post.title }}</RouterLink>
          </template>
          <template v-slot:default> Likes: {{ post.likesCount }} </template>
        </Segment>
      </div>
      <n-space v-if="isFetching || isLoading" justify="center">
        <n-spin size="medium" />
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import { inject, ref, watch } from 'vue'
import Segment from '../../components/Segment.vue'
import { me } from '../../lib/injectionKeys'
import { getViewPostRoute } from '../../lib/routes'
import { layoutScrollEvent } from '../../lib/scrollEventEmitter'
import { useTRPC } from '../../lib/useTrpc'
import { Post } from '../../store/post'

const MAX_POSTS_PER_PAGE = 4
const posts = ref<Post[]>([])
const { myData } = inject(me)!
const searchRef = ref('')
const debouncedSearch = refDebounced(searchRef, 400)
const trpc = useTRPC()

const { data, hasNextPage, isError, error, fetchNextPage, isFetchingNextPage, isLoading, isFetching } =
  trpc.getPosts.useInfiniteQuery(
    () => {
      return {
        limit: MAX_POSTS_PER_PAGE,
        search: debouncedSearch.value,
      }
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 2,
    },
  )

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
