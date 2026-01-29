<template>
  <div v-if="isLoading">
    <n-space justify="center">
      <n-spin size="medium" />
    </n-space>
  </div>
  <n-alert v-else-if="error !== null" title="Error" type="error">
    {{ error }}
  </n-alert>
  <div v-else>
    <form-wrapper v-bind="formData">
      <template v-slot:default>
        <n-form-item path="title" label="Title">
          <n-input v-model:value="modelRef.title" @keydown.enter.prevent />
        </n-form-item>
        <n-form-item path="nick" label="Nick">
          <n-input v-model:value="modelRef.nick" @keydown.enter.prevent />
        </n-form-item>
        <n-form-item path="description" label="Description">
          <n-input v-model:value="modelRef.description" @keydown.enter.prevent />
        </n-form-item>
        <n-form-item path="content" label="Text">
          <n-input v-model:value="modelRef.content" placeholder="Textarea" type="textarea" />
        </n-form-item>
        <uploads-to-cloudinery
          label="Images"
          name="images"
          type="image"
          preset="preview"
          :values="[]"
          @upload-ready="handleUploadReady"
 />
      </template>
    </form-wrapper>
  </div>
</template>

<script setup lang="ts">
import { canEditPost } from '@small-mono-app/backend/src/utils/can'
import { pick } from '@small-mono-app/shared/src/pick'
import type { FormItemRule, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import FormWrapper from '../../components/FormWrapper.vue'
import { me } from '../../lib/injectionKeys'
import router from '../../lib/router'
import { getViewPostRoute } from '../../lib/routes'
import { useTRPC } from '../../lib/useTrpc'
import { CONTENT_MIN_LENGTH } from '../../store/post'
import UploadsToCloudinery from '../../components/UploadsToCloudinery.vue'

interface ModelType {
  title: string | null
  nick: string | null
  description: string | null
  content: string | null
  images: string[],
}

const { myData } = inject(me)!
const isLoading = ref(true)
const error = ref<string | null>(null)
const post = ref()
const route = useRoute()
let id: string | null = null
const nick = String(route.params.nick)
const message = useMessage()
const modelRef = ref<ModelType>({
  title: null,
  nick: null,
  description: null,
  content: null,
  images: [],
})
const trpc = useTRPC()
const getPostResult = trpc.getPost.useQuery(ref({ nick }), {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})

const updatePost = trpc.updatePost.useMutation()

const rules: FormRules = {
  title: [
    {
      required: true,
      message: 'Title is required',
    },
  ],
  nick: [
    {
      required: true,
      validator(_rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('Nick is required')
        } else if (!/^[a-z0-9-]+$/.test(value)) {
          return new Error('Nick should contain only lower case alphanumeric symbols')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  description: [
    {
      required: true,
      message: 'Description is required',
    },
  ],
  content: [
    {
      required: true,
      validator(_rule: FormItemRule, value: string) {
        if (!value || value.trim().length < CONTENT_MIN_LENGTH) {
          return new Error(`Content should be at least ${CONTENT_MIN_LENGTH} charachters long`)
        }
        return true
      },
    },
  ],
}

function handleUploadReady(publicId: string) {
  // console.log(`handleUploadReady:`, publicId);
  console.log(`modelRef.value`, modelRef.value, modelRef.value.images);
    
  modelRef.value.images.push(publicId)
}

async function onSubmit() {
  try {
    await updatePost.mutateAsync({
      postId: id as string,
      title: modelRef.value.title as string,
      nick: modelRef.value.nick as string,
      description: modelRef.value.description as string,
      content: modelRef.value.content as string,
      images: modelRef.value.images,
    })
    message.success('Successful!')
    router.push({ path: getViewPostRoute({ nick: modelRef.value.nick as string }) })
  } catch (err: any) {
    message.error(String(err))
  }
}

function setError(msg: string) {
  error.value = msg
}

if (myData.value === null) {
  setError('Error: NOT_AUTHORIZED')
}

onMounted(async () => {
  if (typeof nick !== 'undefined') {
    await getPostResult.refetch()
    isLoading.value = false
    if (getPostResult.isError.value) {
      setError('Error: ' + getPostResult.error.value)
      return
    } else if (!getPostResult.data.value) {
      setError('Post not found')
      return
    } else if (!canEditPost(myData.value, getPostResult.data.value.post)) {
      setError('Error: not your post')
      return
    }
    console.log(`Posts:Edit:getResponse:`, getPostResult.data?.value?.post)
    post.value = getPostResult.data.value?.post
    id = post.value.id
    modelRef.value = pick(post.value, ['title', 'nick', 'description', 'content', 'images'])
    modelRef.value.images = [] // TODO: take from request
  }
})

const formData = computed(() => ({
  title: 'Edit post',
  modelRef: modelRef.value,
  rules,
  submitTitle: 'Update post',
  submitFunction: onSubmit,
}))
</script>

<style scoped></style>
