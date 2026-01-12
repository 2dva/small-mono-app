<template>
  <form-wrapper v-bind="formData">
    <template v-slot:default>
      <n-form-item path="nickname" label="Nickname">
        <n-input v-model:value="modelRef.nickname" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item path="password" label="Password">
        <n-input
          v-model:value="modelRef.password"
          type="password"
          @input="handlePasswordInput"
          @keydown.enter.prevent
        />
      </n-form-item>
    </template>
  </form-wrapper>
</template>

<script setup lang="ts">
import type { FormItemInst, FormItemRule, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'
import { useTRPC } from '../../lib/useTrpc'
import Cookies from 'js-cookie'
import router from '../../lib/router'
import { getAllPostsRoute } from '../../lib/routes'
import FormWrapper from '../../components/FormWrapper.vue'

interface ModelType {
  nickname: string | null
  password: string | null
}

const rPasswordFormItemRef = ref<FormItemInst | null>(null)
const message = useMessage()
const modelRef = ref<ModelType>({
  nickname: null,
  password: null,
})
const trpc = useTRPC()
const signIn = trpc.signIn.useMutation()

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
  password: [
    {
      required: true,
      message: 'Password is required',
    },
  ],
}

function handlePasswordInput() {
  rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
}

async function onSubmit() {
  try {
    const { token } = await signIn.mutateAsync({
      nick: modelRef.value.nickname as string,
      password: modelRef.value.password as string,
    })
    Cookies.set('token', token, { expires: 99999 })
    trpc.getMe.invalidate()
    message.success('Successful!')
    router.push({ path: getAllPostsRoute() })
  } catch (err: any) {
    message.error(err.message)
  }
}

const formData = {
  title: 'Sign in',
  modelRef: modelRef.value,
  rules,
  submitTitle: 'Sign in',
  submitFunction: onSubmit,
}
</script>

<style scoped></style>
