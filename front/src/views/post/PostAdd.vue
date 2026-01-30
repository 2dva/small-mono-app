<template>
  <n-alert v-if="error !== null" title="Error" type="error">
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
        <uploads-to-cloudinery label="Images" name="images" type="image" preset="preview" :values="postImages"
          @upload-ready="handleUploadReady" />
      </template>
    </form-wrapper>
  </div>
</template>

<script setup lang="ts">
import type { FormItemRule, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { computed, inject, ref } from 'vue'
import FormWrapper from '../../components/FormWrapper.vue'
import { me } from '../../lib/injectionKeys'
import router from '../../lib/router'
import { getAllPostsRoute } from '../../lib/routes'
import { useTRPC } from '../../lib/useTrpc'
import { CONTENT_MIN_LENGTH } from '../../store/post'
import UploadsToCloudinery from '../../components/UploadsToCloudinery.vue'

interface ModelType {
  title: string | null
  nick: string | null
  description: string | null
  content: string | null
  images: string | null
}

const { myData } = inject(me)!
const error = ref<string | null>(null)
const message = useMessage()
const modelRef = ref<ModelType>({
  title: null,
  nick: null,
  description: null,
  content: null,
  images: null,
})

const postImages = computed(() => {
  return modelRef.value.images ? modelRef.value.images.split(',') : []
})


const trpc = useTRPC()
const createPost = trpc.createPost.useMutation()

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

function handleUploadReady(publicIds: string[]) {
  modelRef.value.images = publicIds.length ? publicIds.join(',') : ''
}

async function onSubmit() {
  try {
    await createPost.mutateAsync({
      title: modelRef.value.title as string,
      nick: modelRef.value.nick as string,
      description: modelRef.value.description as string,
      content: modelRef.value.content as string,
      images: modelRef.value.images as string,
    })
    message.success('Successful!')
    router.push({ path: getAllPostsRoute() })
  } catch (err: any) {
    message.error(String(err))
  }
}

if (myData.value === null) {
  error.value = 'Error: NOT_AUTHORIZED'
}

const formData = {
  title: 'New post',
  modelRef: modelRef.value,
  rules,
  submitTitle: 'Create post',
  submitFunction: onSubmit,
}
</script>

<style scoped></style>
