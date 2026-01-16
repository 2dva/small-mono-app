<template>
  <div v-if="post">
    <Segment :title="post.title" size="1" :description="post.description">
      <template v-slot:header>
        {{ post.title }}
      </template>
      <template v-slot:default>
        <div class="author">Author: {{ post.author.nick }}{{ post.author.name ? ` (${post.author.name})` : '' }}</div>
        <div class="createdAt">Created: {{ new Date(post.createdAt).toLocaleDateString('ru-RU') }}</div>
        <div class="text">{{ post.content }}</div>
        <div class="likes">
          Likes: {{ post.likesCount }}
          <div v-if="myData">
            <br />
            <PostLikeButton :post="post"></PostLikeButton>
          </div>
        </div>
        <n-button v-if="myData?.id === post.authorId" round type="primary" @click="handleEditButtonClick">
          Edit post </n-button
        >&nbsp;
        <n-button v-if="myData?.id === post.authorId" round type="warning" @click="console.log('Not yet')">
          Delete post </n-button
        >&nbsp;
      </template>
    </Segment>
  </div>
  <div v-if="isPending">
    <n-space justify="center">
      <n-spin size="medium" />
    </n-space>
  </div>
  <div v-if="post === null || isError">
    <n-result status="404" title="404 Not Found" description="Wa can't find any post here."> </n-result>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { inject } from 'vue'
import { useRoute } from 'vue-router'
import Segment from '../../components/Segment.vue'
import { me } from '../../lib/injectionKeys'
import router from '../../lib/router'
import { getEditPostRoute } from '../../lib/routes'
import { useTRPC } from '../../lib/useTrpc'
import PostLikeButton from './PostLikeButton.vue'

const { myData } = inject(me)!
const route = useRoute()
const id = String(route.params.nick)
const trpc = useTRPC()
const params = ref({ nick: id })
const { data, isPending, isError } = trpc.getPost.useQuery(params)

const post = computed(() => {
  return data.value?.post
})

function handleEditButtonClick() {
  router.push({ path: getEditPostRoute({ nick: post.value!.nick }) })
}
</script>

<style scoped>
.createdAt {
  font-size: 12px;
  margin-bottom: 10px;
}

.author {
  display: flex;
  flex-flow: row nowrap;
  font-weight: bold;
  font-size: 16px;
  margin: 10px 0;
  align-items: center;
}

.name {
  flex: 1 1 100%;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 20px;
  margin-left: 10px;
}

.avatar {
  flex: 0 0 100px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.text {
  font-size: 14px;
}

.editButton {
  margin-top: 20px;
}
</style>
