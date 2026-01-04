<template>
  <div v-if="post">
      <Segment :title="post.name" size="1" :description="post.description" children="">
        <template v-slot:header>
          <h1 :class="$style['postHead']">{{post.name}}</h1>
        </template>
      </Segment>
  </div>
  <div v-else>
    <n-result
      status="404"
      title="404 Not Found"
      description="You know life is always ridiculous."
    >
    </n-result>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import Segment from '../components/Segment.vue'
import { usePosts } from '../store/post';
import { onMounted, ref } from 'vue';

const store = usePosts()
const post = ref()
const route = useRoute()
const id = String(route.params.nick)

onMounted(() => {
  console.log(`PostView:OnMounted`);
  if (typeof id !== 'undefined') {
    post.value = store.getPost(id)
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