<template>
  <div :class="$style['page-outer']">
    <div :class="$style['page-wrap']">
      <h1>Sign in</h1>
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
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: flex-end">
              <n-button :disabled="modelRef.nickname === null" round type="primary" @click="handleValidateButtonClick">
                Sign in
              </n-button>
            </div>
          </n-col>
        </n-row>
      </n-form>
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
}

const formRef = ref<FormInst | null>(null)
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
}

function handlePasswordInput() {
  rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
}

function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      try {
        const { token } = await signIn.mutateAsync({
          nick: modelRef.value.nickname as string,
          password: modelRef.value.password as string,
        })
        Cookies.set('token', token, { expires: 99999 })
        message.success('Successful!')
        router.push({ name: 'posts' })
      } catch (err: any) {
        message.error(err.message)
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
