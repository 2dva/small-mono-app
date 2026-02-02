<template>
  <n-rate :value="+isLikedPost" clearable :count="1" size="medium" color="#FD1010" @click="handleLikeButtonClick">
    <n-icon size="32">
      <Heart />
    </n-icon>
  </n-rate>
</template>

<script setup lang="ts">
import { TrpcRouterOutput } from '@small-mono-app/backend/src/router'
import { Heart } from '@vicons/ionicons5'
import { ref, watch } from 'vue'
import { tracker } from '../../lib/tracker/controller'
import { useTRPC } from '../../lib/useTrpc'
interface Props {
  post: NonNullable<TrpcRouterOutput['getPost']['post']>
}
const props = defineProps<Props>()
const isLikedPost = ref(false)
const trpc = useTRPC()
const setPostLike = trpc.setPostLike.useMutation({
  onSuccess: () => {
    trpc.getPost.invalidate({ nick: props.post.nick })
  },
})

function handleLikeButtonClick() {
  isLikedPost.value = !isLikedPost.value
  setPostLike
    .mutateAsync({ postId: props.post.id, isLikedByMe: isLikedPost.value })
    .then(({ post: { isLikedByMe } }) => {
      if (isLikedByMe) {
        tracker.likePost(props.post)

      }
    })
}

isLikedPost.value = props.post.isLikedByMe

watch(props, () => {
  isLikedPost.value = props.post.isLikedByMe
})
</script>

<style scoped>
.like {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
