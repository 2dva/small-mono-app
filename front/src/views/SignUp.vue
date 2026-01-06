<template>
  <div :class="$style['page-outer']">
    <div :class="$style['page-wrap']">
      <h1>Sign up</h1>
      <n-form ref="formRef" :model="modelRef" :rules="rules">
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
        <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" label="Re-enter Password">
          <n-input
            v-model:value="modelRef.reenteredPassword"
            :disabled="!modelRef.password"
            type="password"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: flex-end">
              <n-button :disabled="modelRef.nickname === null" round type="primary" @click="handleValidateButtonClick">
                Sign up
              </n-button>
            </div>
          </n-col>
        </n-row>
      </n-form>
      <!-- <pre>{{ JSON.stringify(modelRef, null, 2) }}</pre> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInst, FormItemInst, FormItemRule, FormRules, FormValidationError } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'
import { useTRPC } from '../lib/useTrpc'
import Cookies from 'js-cookie'
import router from '../lib/router'

interface ModelType {
  nickname: string | null
  password: string | null
  reenteredPassword: string | null
}

const formRef = ref<FormInst | null>(null)
const rPasswordFormItemRef = ref<FormItemInst | null>(null)
const message = useMessage()
const modelRef = ref<ModelType>({
  nickname: null,
  password: null,
  reenteredPassword: null,
})
const trpc = useTRPC()
const signUp = trpc.signUp.useMutation()
// const trpcUtils = trpc.useContext().invalidate()

function validatePasswordStartWith(rule: FormItemRule, value: string): boolean {
  return (
    !!modelRef.value.password &&
    modelRef.value.password.startsWith(value) &&
    modelRef.value.password.length >= value.length
  )
}

function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === modelRef.value.password
}

const rules: FormRules = {
  nickname: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
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

function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      try {
        const { token } = await signUp.mutateAsync({
          nick: modelRef.value.nickname as string,
          password: modelRef.value.password as string,
        })
        Cookies.set('token', token, { expires: 99999 })
        trpc.getMe.invalidate()
        message.success('Successful!')
        router.push({ name: 'posts' })
      } catch (err: any) {
        message.error('Something went wrong')
      }
    } else {
      console.log(errors)
      message.error('Invalid')
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
