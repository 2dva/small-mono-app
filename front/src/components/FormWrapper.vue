<template>
  <div class="form-outer">
    <div class="form-wrap">
      <h1>{{ props.title }}</h1>
      <n-form ref="formRef" :model="props.modelRef" :rules="props.rules">
        <!-- Слот для полей формы -->
        <slot></slot>
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: flex-end">
              <n-button round type="primary" @click="onSubmit">
                {{ props.submitTitle }}
              </n-button>
              <!-- Слот для других действий -->
              <slot name="actions"></slot>
            </div>
          </n-col>
        </n-row>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInst, FormRules, FormValidationError } from 'naive-ui'
import { onMounted, type Ref, ref } from 'vue'

interface Props {
  title?: string
  modelRef: object
  rules?: FormRules
  submitTitle: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
})

const emit = defineEmits<{
  (e: 'ready', formRef: Ref<FormInst | null>): void
  (e: 'submit'): void
}>()

const formRef = ref<FormInst | null>(null)

function onSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      emit('submit')
    }
  })
}

onMounted(() => {
  emit('ready', formRef)
})
</script>

<style scoped>
.form-outer {
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 400px;
}

.form-wrap {
  margin: 0 auto;
}
</style>
