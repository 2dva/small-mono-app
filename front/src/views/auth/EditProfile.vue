<template>
  <div v-if="error !== null">
    <span>{{ error }}</span>
  </div>
  <form-wrapper v-else v-bind="formData">
    <template v-slot:default>
      <n-form-item path="nickname" label="Nickname">
        <n-input v-model:value="modelRef.nickname" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item path="name" label="Name">
        <n-input v-model:value="modelRef.name" @keydown.enter.prevent />
      </n-form-item>
    </template>
  </form-wrapper>
</template>

<script setup lang="ts">
import type { FormItemRule, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { inject, ref } from 'vue'
import FormWrapper from '../../components/FormWrapper.vue'
import { me } from '../../lib/injectionKeys'
import { useTRPC } from '../../lib/useTrpc'

interface ModelType {
  nickname: string | null
  name: string | null
}

const { myData, setMyData } = inject(me)!
const error = ref<string | null>(null)
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

async function onSubmit() {
  try {
    const updatedMe = await updateProfile.mutateAsync({
      nick: modelRef.value.nickname as string,
      name: modelRef.value.name as string,
    })
    message.success('Successful!')
    setMyData(updatedMe)
  } catch (err: any) {
    message.error(String(err))
  }
}

const formData = {
  title: 'Edit profile',
  modelRef: modelRef.value,
  rules,
  submitTitle: 'Update profile',
  submitFunction: onSubmit,
}
</script>

<style scoped></style>
