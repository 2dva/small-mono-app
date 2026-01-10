<template>
  <div :class="$style['page-outer']">
    <div :class="$style['page-wrap']">
      <div v-if="isLoading">
        <n-space justify="center">
          <n-spin size="medium" />
        </n-space>
      </div>
      <div v-else-if="error !== null">
        <span>{{ error }}</span>
      </div>
      <div v-else>
        <h1>Edit post</h1>
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
                <n-button :disabled="false" round type="primary" @click="handleUpdateButtonClick">
                  Update post
                </n-button>
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
import { inject, onMounted, ref } from 'vue'
import { useTRPC } from '../../lib/useTrpc'
import router from '../../lib/router'
import { CONTENT_MIN_LENGTH } from '../../store/post'
import { useRoute } from 'vue-router'
import { pick } from 'lodash'
import { getViewPostRoute } from '../../lib/routes'
import { me } from '../../lib/injectionKeys'

interface ModelType {
  title: string | null
  nick: string | null
  description: string | null
  content: string | null
}

const { myData } = inject(me)!
const isLoading = ref(true)
const error = ref<string | null>(null)
const post = ref()
const isSubmitting = ref(false)
const route = useRoute()
let id: string | null = null
const nick = String(route.params.nick)
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const modelRef = ref<ModelType>({
  title: null,
  nick: null,
  description: null,
  content: null,
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

function handleUpdateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value
    ?.validate(async (errors: Array<FormValidationError> | undefined) => {
      if (!errors) {
        try {
          isSubmitting.value = true
          await updatePost
            .mutateAsync({
              postId: id as string,
              title: modelRef.value.title as string,
              nick: modelRef.value.nick as string,
              description: modelRef.value.description as string,
              content: modelRef.value.content as string,
            })
          message.success('Successful!')
          router.push({ path: getViewPostRoute({ nick: modelRef.value.nick as string }) })
        } catch (err: any) {
          message.error(String(err))
        } finally {
          isSubmitting.value = false
        }
      }
    })
    .catch(() => {})
}

function setError(msg: string) {
  error.value = msg
}

console.log(`PostEdit:inject:me: `, myData.value)
if (myData.value === null) {
  setError('Error: NOT_AUTHORIZED')
}

onMounted(async () => {
  console.log(`Posts:Edit:OnMounted`)

  if (typeof nick !== 'undefined') {
    await getPostResult.refetch()
    isLoading.value = false
    if (getPostResult.isError.value) {
      setError('Error: ' + getPostResult.error.value)
      return
    } else if (!getPostResult.data.value) {
      setError('Post not found')
      return
    } else if (myData.value?.id !== getPostResult.data.value.post?.authorId) {
      setError('Error: not your post')
      return
    }
    console.log(`Posts:Edit:getResponse:`, getPostResult.data?.value?.post)
    post.value = getPostResult.data.value?.post
    id = post.value.id
    modelRef.value = pick(post.value, ['title', 'nick', 'description', 'content'])
  }
})
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
