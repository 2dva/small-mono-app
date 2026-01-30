<template>
  <div v-if="isPending">
    <n-space justify="center">
      <n-spin size="medium" />
    </n-space>
  </div>
  <n-alert v-else-if="isError" title="Error" type="error">
    {{ error }}
  </n-alert>
  <div v-else-if="post === null">
    <n-result status="404" title="404 Not Found" description="We can't find any post here.">
      <template #footer>
        <n-button @click="router.push({ path: getAllPostsRoute() })">Show all posts</n-button>
      </template>
    </n-result>
  </div>
  <div v-else-if="post">
    <Segment :title="post.title" size="1" :description="post.description">
      <template v-slot:header>
        {{ post.title }}
      </template>
      <template v-slot:default>
        <div class="author">
          <img class="avatar" alt="" :src="getAvatarUrl(post.author.avatar, 'small')" />
          <div class="name">
            Author: <br />
            {{ post.author.nick }}{{ post.author.name ? ` (${post.author.name})` : '' }}
          </div>
        </div>
        <div class="createdAt">Created: {{ new Date(post.createdAt).toLocaleDateString('ru-RU') }}</div>
        <div class="text">{{ post.content }}</div>
        <p v-if="publicIds?.length"><b>Images:</b></p>
        <div class="previews">
          <div v-for="publicId in publicIds" :key="publicIds + '_key'" class="preview-wrap">
            <img class="preview-img" alt="" :src="getCloudinaryUploadUrl(publicId, 'image', 'preview')" />
          </div>
        </div>
        <div class="likes">
          Likes: {{ post.likesCount }}
          <div v-if="myData">
            <PostLikeButton :post="post"></PostLikeButton>
          </div>
        </div>
        <n-button
          class="bottom-btn"
          v-if="canEditPost(myData, post)"
          round
          type="primary"
          @click="handleEditButtonClick"
        >
          Edit post
        </n-button>
        <n-button class="bottom-btn" v-if="canBlockPost(myData)" round type="warning" @click="handleBlockButtonClick">
          Block post
        </n-button>
      </template>
    </Segment>
  </div>
</template>

<script setup lang="ts">
import { canBlockPost, canEditPost } from '@small-mono-app/backend/src/utils/can'
import { computed, inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import Segment from '../../components/Segment.vue'
import { me } from '../../lib/injectionKeys'
import router from '../../lib/router'
import { getAllPostsRoute, getEditPostRoute } from '../../lib/routes'
import { useTRPC } from '../../lib/useTrpc'
import PostLikeButton from './PostLikeButton.vue'
import { getAvatarUrl, getCloudinaryUploadUrl } from '@small-mono-app/shared/src/cloudinary'

const { myData } = inject(me)!
const route = useRoute()
const id = String(route.params.nick)
const trpc = useTRPC()
const params = ref({ nick: id })
const { data, refetch, isPending, isError, error } = trpc.getPost.useQuery(params, {
  refetchOnWindowFocus: false,
  retry: 1,
})

const publicIds = ref<string[]>([])

const post = computed(() => {
  publicIds.value = data.value?.post?.images ? data.value.post.images.split(',') : []
  return data.value?.post
})
const blockPost = trpc.blockPost.useMutation()

async function handleBlockButtonClick() {
  await blockPost.mutateAsync({ postId: post.value?.id! })
  refetch()
}

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

.likes {
  margin-top: 10px;
  margin-bottom: 10px;
}

.bottom-btn {
  margin-right: 10px;
}

.previews {
  display: flex;
}

.preview-wrap {
  position: relative;
  box-sizing: content-box;
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 3px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
}

.preview-img {
  max-width: 100%;
  max-height: 100%;
}
</style>
