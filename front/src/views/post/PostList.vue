<template>
  <div class="posts-wrap">
    <h1>Posts</h1>
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
      <div class="posts">
        <PostItem v-for="post in posts" :post="post" :isMinePost="post.author.id === myData?.id" :key="post.nick" />
      </div>
      <n-space v-if="isFetching || isLoading" justify="center">
        <n-spin size="medium" />
      </n-space>
  </div>
</template>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import { inject, ref, watch } from 'vue'
import { me } from '../../lib/injectionKeys'
import { layoutScrollEvent } from '../../lib/scrollEventEmitter'
import { useTRPC } from '../../lib/useTrpc'
import { Post } from '../../store/post'
import PostItem from '../../components/PostItem.vue'

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
        search: debouncedSearch.value.trim(),
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
    }
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

.posts-wrap {
  min-width: 320px;
  width: 85%;
}

.posts {
  margin: 0 auto;
}

.posts > div {
  margin-bottom: 15px;
  /* width: 80%; */
}

.more {
  margin-top: 15px;
}
</style>
