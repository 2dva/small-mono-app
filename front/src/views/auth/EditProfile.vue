<template>
  <div :class="$style['page-outer']">
    <div :class="$style['page-wrap']">
      <div v-if="error !== null">
        <span>{{ error }}</span>
      </div>
      <div v-else>
        <h1>Edit profile</h1>
        <n-form ref="formRef" :model="modelRef" :rules="rules">
          <n-form-item path="nickname" label="Nickname">
            <n-input v-model:value="modelRef.nickname" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="name" label="Name">
            <n-input v-model:value="modelRef.name" @keydown.enter.prevent />
          </n-form-item>
          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: flex-end">
                <n-button :disabled="modelRef.nickname === null" round type="primary" @click="handleUpdateButtonClick">
                  Update profile
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
import { inject, ref } from 'vue'
import { useTRPC } from '../../lib/useTrpc'
import { me } from '../../lib/injectionKeys'

interface ModelType {
  nickname: string | null
  name: string | null
}

const { myData, setMyData } = inject(me)!
const error = ref<string | null>(null)
const formRef = ref<FormInst | null>(null)
const isSubmitting = ref(false)
const message = useMessage()

if (myData.value === null) {
  error.value = 'Error: NOT_AUTHORIZED'
}

const modelRef = ref<ModelType>({
  nickname: myData.value?.nick!,
  name: myData.value?.name || null,
})

const trpc = useTRPC()
const updateProfile = trpc.updateProfile.useMutation()
const rules: FormRules = {
  nickname: [
    {
      required: true,
      validator(_rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('Nickname is required')
        } else if (!/^[a-z0-9-]+$/.test(value)) {
          return new Error('Nickname should contain only lower case alphanumeric symbols')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  name: [
    {
      validator(_rule: FormItemRule, value: string) {
        if (value?.length > 50) {
          return new Error('Name may contain no more than 50 symbols')
        }
        return true
      },
    },
  ],
}

function handleUpdateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      try {
        isSubmitting.value = true
        const updatedMe = await updateProfile.mutateAsync({
          nick: modelRef.value.nickname as string,
          name: modelRef.value.name as string,
        })
        message.success('Successful!')
        setMyData(updatedMe)
      } catch (err: any) {
        message.error(String(err))
      } finally {
        isSubmitting.value = false
      }
    }
  })
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
