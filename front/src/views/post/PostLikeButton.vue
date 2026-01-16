<template>
  <n-rate :value="+isLikedPost" clearable :count="1" size="medium" color="#FD1010" @click="handleLikeButtonClick"/>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTRPC } from '../../lib/useTrpc'
import { TrpcRouterOutput } from '@small-mono-app/backend/src/router';

interface Props {
  post: NonNullable<TrpcRouterOutput['getPost']['post']>
}
const props = defineProps<Props>()
const isLikedPost = ref(false)
const trpc = useTRPC()
const setPostLike = trpc.setPostLike.useMutation({
    onMutate: ({ isLikedByMe }) => {
      // Тут нам надо переписать кеш с актуальным значением likesCount и isLikedByMe

      // const oldGetPostData = trpc.getPost.getData({ nick: post.value.nick })
      // if (oldGetPostData?.post) {
      //   const newGetPostData = {
      //     ...oldGetPostData,
      //     post: {
      //       ...oldGetPostData.post,
      //       isLikedByMe,
      //       likesCount: oldGetPostData.post.likesCount + (isLikedByMe ? 1 : -1),
      //     },
      //   }
      //   trpc.getPost.setQueryData({ nick: post.value.nick }, newGetPostData)
      // }
    },
    onSuccess: () => {
      trpc.getPost.invalidate({ nick: props.post.nick })
    },
})

function handleLikeButtonClick() {
  isLikedPost.value = !isLikedPost.value
  setPostLike.mutateAsync({ postId: props.post.id, isLikedByMe: isLikedPost.value })
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