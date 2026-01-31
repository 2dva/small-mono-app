<template>
  <div class="layout-wrap">
    <n-alert v-if="error !== null" title="Error" type="error">
      {{ error }}
    </n-alert>
    <h1>Profile</h1>
    <div class="layout-panels">
    <n-image class="image"
        width="200"
         :src="getAvatarUrl(modelRef.avatar, 'big')"
      />
    <div class="layout-items">
      <div class="item">
        <n-divider title-placement="left"> Nickname </n-divider>
        <span>{{ modelRef.nickname }}</span>
      </div>
      <div class="item">
        <n-divider title-placement="left"> Name </n-divider>
        <span>{{ modelRef.name }}</span>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAvatarUrl } from '@small-mono-app/shared/src/cloudinary'
import { inject, ref } from 'vue'
import { me } from '../../lib/injectionKeys'
// import { useTRPC } from '../../lib/useTrpc'

interface ModelType {
  nickname: string | null
  name: string | null
  avatar: string | null
}

const { myData } = inject(me)!
const error = ref<string | null>(null)

if (myData.value === null) {
  error.value = 'Error: NOT_AUTHORIZED'
}

const modelRef = ref<ModelType>({
  nickname: myData.value?.nick!,
  name: myData.value?.name || null,
  avatar: myData.value?.avatar || null,
})

// const trpc = useTRPC()
// const updateProfile = trpc.updateProfile.useMutation()
</script>

<style scoped>
h1 {
  text-align: center;
}

.layout-wrap {
  min-width: 320px;
  width: 85%;
}

.layout-panels {
  display: flex;
}

.layout-items {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  flex-grow: 1;
  cursor: default;
}

.item span {
  font-size: 20px;
}

.image {
  border-radius: 10px;
}
</style>
