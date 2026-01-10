<template>
  <div :class="$style['page-outer']">
    <div :class="$style['page-wrap']">
      <div v-if="error !== null">
        <span>{{ error }}</span>
      </div>
      <div v-else>
        <h1>New post</h1>
        <n-form ref="formRef" :model="modelRef" :rules="rules" :disabled="isSubmitting">
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
          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: flex-end">
                <n-button :disabled="false" round type="primary" @click="handleCreateButtonClick"> Create post </n-button>
              </div>
            </n-col>
          </n-row>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInst, FormItemRule, FormRules, FormValidationError } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { inject, ref } from 'vue'
import { useTRPC } from '../../lib/useTrpc'
import router from '../../lib/router'
import { CONTENT_MIN_LENGTH } from '../../store/post'
import { me } from '../../lib/injectionKeys'

interface ModelType {
  title: string | null
  nick: string | null
  description: string | null
  content: string | null
}

const myData = inject(me)!
const error = ref<string | null>(null)
const formRef = ref<FormInst | null>(null)
const isSubmitting = ref(false)
const message = useMessage()
const modelRef = ref<ModelType>({
  title: null,
  nick: null,
  description: null,
  content: null,
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

function handleCreateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      try {
        isSubmitting.value = true
        await createPost.mutateAsync({
          title: modelRef.value.title as string,
          nick: modelRef.value.nick as string,
          description: modelRef.value.description as string,
          content: modelRef.value.content as string,
        })
        message.success('Successful!')
        router.push({ name: 'posts' })
      } catch (err: any) {
        message.error(String(err))
      } finally {
        isSubmitting.value = false
      }
    }
  }).catch(() => {})
}

if (myData.value === null) {
  error.value = 'Error: NOT_AUTHORIZED'
}

</script>

<style module>
.page-outer {
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 400px;
}

.page-wrap {
  margin: 0 auto;
}
</style>
