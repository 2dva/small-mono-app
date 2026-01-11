<template>
  <div class="page-outer">
    <div class="page-wrap">
      <h1>Change password</h1>
      <n-form ref="formRef" :model="modelRef" :rules="rules">
        <n-form-item path="oldPassword" label="Current password">
          <n-input
            v-model:value="modelRef.oldPassword"
            type="password"
            @input="handlePasswordInput"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item path="password" label="Password">
          <n-input
            v-model:value="modelRef.newPassword"
            type="password"
            @input="handlePasswordInput"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" label="Re-enter Password">
          <n-input
            v-model:value="modelRef.reenteredPassword"
            :disabled="!modelRef.newPassword"
            type="password"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: flex-end">
              <n-button :disabled="false" round type="primary" @click="handleChangeButtonClick">
                Update password
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
import { useTRPC } from '../../lib/useTrpc'

interface ModelType {
  oldPassword: string | null
  newPassword: string | null
  reenteredPassword: string | null
}

const formRef = ref<FormInst | null>(null)
const rPasswordFormItemRef = ref<FormItemInst | null>(null)
const message = useMessage()
const modelRef = ref<ModelType>({
  oldPassword: null,
  newPassword: null,
  reenteredPassword: null,
})
const trpc = useTRPC()
const changePswd = trpc.changePassword.useMutation()

function validatePasswordStartWith(_rule: FormItemRule, value: string): boolean {
  return (
    !!modelRef.value.newPassword &&
    modelRef.value.newPassword.startsWith(value) &&
    modelRef.value.newPassword.length >= value.length
  )
}

function validatePasswordSame(_rule: FormItemRule, value: string): boolean {
  return value === modelRef.value.newPassword
}

const rules: FormRules = {
  oldPassword: [
    {
      required: true,
      message: 'Current password is required',
    },
  ],
  newPassword: [
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

function handleChangeButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      try {
        await changePswd.mutateAsync({
          oldPassword: modelRef.value.oldPassword as string,
          newPassword: modelRef.value.newPassword as string,
        })
        trpc.getMe.invalidate()
        formRef.value?.restoreValidation()
        message.success('Successful!')
      } catch (err: any) {
          message.error(String(err))
      }
    }
  })
}
</script>

<style scoped>
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
