<template>
  <div v-if="error !== null">
    <span>{{ error }}</span>
  </div>
  <form-wrapper v-else v-bind="formData">
    <template v-slot:default>
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
    </template>
  </form-wrapper>
</template>

<script setup lang="ts">
import FormWrapper from '../../components/FormWrapper.vue'
import type { FormInst, FormItemInst, FormItemRule, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { inject, ref } from 'vue'
import { useTRPC } from '../../lib/useTrpc'
import { me } from '../../lib/injectionKeys'

interface ModelType {
  oldPassword: string | null
  newPassword: string | null
  reenteredPassword: string | null
}

const { myData } = inject(me)!
const formRef = ref<FormInst | null>(null)
const rPasswordFormItemRef = ref<FormItemInst | null>(null)
const error = ref<string | null>(null)
const message = useMessage()
const modelRef = ref<ModelType>({
  oldPassword: null,
  newPassword: null,
  reenteredPassword: null,
})
const trpc = useTRPC()
const changePswd = trpc.changePassword.useMutation()

if (myData.value === null) {
  error.value = 'Error: NOT_AUTHORIZED'
}

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

async function onSubmit() {
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

const formData = {
  title: 'Change password',
  modelRef: modelRef.value,
  rules,
  submitTitle: 'Update password',
  submitFunction: onSubmit,
}
</script>

<style scoped></style>
