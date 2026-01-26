<template>
  <form-wrapper v-bind="formData">
    <template v-slot:default>
      <n-form-item path="nickname" label="Nickname">
        <n-input v-model:value="modelRef.nickname" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item path="email" label="Email">
        <n-input v-model:value="modelRef.email" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item path="password" label="Password">
        <n-input
          v-model:value="modelRef.password"
          type="password"
          @input="handlePasswordInput"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" label="Re-enter Password">
        <n-input
          v-model:value="modelRef.reenteredPassword"
          :disabled="!modelRef.password"
          type="password"
          @keydown.enter.prevent
        />
      </n-form-item>
    </template>
  </form-wrapper>
</template>

<script setup lang="ts">
import Cookies from 'js-cookie'
import type { FormItemInst, FormItemRule, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'
import FormWrapper from '../../components/FormWrapper.vue'
import router from '../../lib/router'
import { getAllPostsRoute } from '../../lib/routes'
import { useTRPC } from '../../lib/useTrpc'

interface ModelType {
  nickname: string | null
  email: string | null
  password: string | null
  reenteredPassword: string | null
}

const rPasswordFormItemRef = ref<FormItemInst | null>(null)
const message = useMessage()
const modelRef = ref<ModelType>({
  nickname: null,
  email: null,
  password: null,
  reenteredPassword: null,
})
const trpc = useTRPC()
const signUp = trpc.signUp.useMutation()

function validatePasswordStartWith(_rule: FormItemRule, value: string): boolean {
  return (
    !!modelRef.value.password &&
    modelRef.value.password.startsWith(value) &&
    modelRef.value.password.length >= value.length
  )
}

function validatePasswordSame(_rule: FormItemRule, value: string): boolean {
  return value === modelRef.value.password
}

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
  email: [
    {
      required: true,
      validator(_rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('Email is required')
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          return new Error('Email is wrong')
        }
        return true
      },
    },
  ],
  password: [
    {
      required: true,
      message: 'Password is required',
    },
  ],
  reenteredPassword: [
    {
      required: true,
      message: 'Re-entered password is required',
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordStartWith,
      message: 'Password is not same as re-entered password!',
      trigger: 'input',
    },
    {
      validator: validatePasswordSame,
      message: 'Password is not same as re-entered password!',
      trigger: ['blur', 'password-input'],
    },
  ],
}

function handlePasswordInput() {
  if (modelRef.value.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
  }
}

async function onSubmit() {
  try {
    const { token } = await signUp.mutateAsync({
      nick: modelRef.value.nickname as string,
      email: modelRef.value.email as string,
      password: modelRef.value.password as string,
    })
    Cookies.set('token', token, { expires: 99999 })
    trpc.getMe.invalidate()
    message.success('Successful!')
    router.push({ path: getAllPostsRoute() })
  } catch (err: any) {
    message.error(String(err))
  }
}

const formData = {
  title: 'Sign up',
  modelRef: modelRef.value,
  rules,
  submitTitle: 'Sign up',
  submitFunction: onSubmit,
}
</script>

<style scoped></style>
