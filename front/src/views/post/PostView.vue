<template>
  <div v-if="post">
      <Segment :title="post.title" size="1" :description="post.description" children="">
        <template v-slot:header>
          <h1 :class="$style['postHead']">{{post.title}}</h1>
        </template>
        <template v-slot:default>
          <div :class="$style['author']">Author: {{ post.author.nick }}</div>
          <div v-html="post.content"></div>
          <n-button v-if="myData?.id === post.authorId" round type="primary" @click="handleEditButtonClick"> Edit post </n-button>
        </template>
      </Segment>
  </div>
  <div v-if="postViewQuery.isPending.value">
    <n-space justify="center">
      <n-spin size="medium" />
    </n-space>
  </div>
  <div v-if="post === null || postViewQuery.isError.value">
    <n-result
      status="404"
      title="404 Not Found"
      description="Wa can't find any post here."
    >
    </n-result>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import Segment from '../../components/Segment.vue'
import { onMounted, ref } from 'vue';
import { useTRPC } from '../../lib/useTrpc';
import { getEditPostRoute } from '../../lib/routes';
import router from '../../lib/router';
import { inject } from 'vue';
import { me } from '../../lib/injectionKeys';

// const store = usePosts()
const myData = inject(me)!
const post = ref()
const route = useRoute()
const id = String(route.params.nick)

const trpc = useTRPC()

const params = ref({ nick: id })
const postViewQuery = trpc.getPost.useQuery(params, {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})

function handleEditButtonClick() {
  router.push({ path: getEditPostRoute({ nick : post.value.nick })})
}

onMounted(async () => {
  console.log(`Posts:View:OnMounted`);
  if (typeof id !== 'undefined') {
    await postViewQuery.refetch()
    console.log(`Posts:View:getResponse:`, postViewQuery.data?.value?.post);
    post.value =  postViewQuery.data.value?.post
    // post.value = store.getPost(id)
  }
});

</script>

<style module>
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