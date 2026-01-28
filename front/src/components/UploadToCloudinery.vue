<template>
  <div :class="{ field: true, disabled: isSubmitting }">
    <n-space v-if="isLoading" justify="center">
      <n-spin size="medium" />
    </n-space>
    <div v-if="!!previewUrl && !isLoading" class="preview-wrap">
      <img class="preview-img" alt="" :src="previewUrl" />
    </div>
    <div class="buttons">
      <n-upload action="" accept="image/*" :disabled="isLoading" :show-file-list="false" :custom-request="handleUploadAva">
        <n-button>Upload</n-button>
      </n-upload>
      <n-button v-if="!!previewUrl && !isLoading" type="warning" @click="handleRemoveAva">
        Remove
      </n-button>
    </div>
    <n-alert v-if="error !== null" title="Error" type="error">
      {{ error }}
    </n-alert>
  </div>
</template>

<script setup lang="ts">
import {
  getCloudinaryUploadUrl,
  type CloudinaryUploadPresetName,
  type CloudinaryUploadTypeName,
} from '@small-mono-app/shared/src/cloudinary'
import { UploadCustomRequestOptions, useMessage } from 'naive-ui'
import { ref } from 'vue'
import { useUploadToCloudinary } from '../lib/imageUpload'
import { useTRPC } from '../lib/useTrpc'

let isLoading = ref(false)
let isSubmitting = ref(false)
let error = ref<string | null>(null)
let previewUrl = ref<string | null>(null)

interface Props {
  value: string | null
  label: string
  name: string
  type: CloudinaryUploadTypeName
  preset: CloudinaryUploadPresetName<'avatar'> //!!! quick fix, should be correct common type
}

const props = defineProps<Props>()

if (props.value) {
  previewUrl.value = getCloudinaryUploadUrl(props.value, props.type, props.preset)
}

const emit = defineEmits<{
  (e: 'avatarReady', publicId: string | null): void
}>()

const message = useMessage()
const trpc = useTRPC()
const { uploadToCloudinary } = useUploadToCloudinary(props.type, trpc)

function handleUploadAva({
  file,
  data,
}: UploadCustomRequestOptions) {
  error.value = null
  isLoading.value = true
  const formData = new FormData()
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key as keyof UploadCustomRequestOptions['data']])
    })
  }
  formData.append(file.name, file.file as File)

  uploadToCloudinary(file.file as File)
    .then(({ publicId }) => {
      previewUrl.value = getCloudinaryUploadUrl(publicId, props.type, props.preset)
      emit('avatarReady', publicId)
    })
    .catch((err) => {
      message.error(err.message)
      error.value = err.message
    }).finally(() => {
      isLoading.value = false
    })
}

function handleRemoveAva(){
  previewUrl.value = null
  emit('avatarReady', null)
}
</script>

<style scoped>
.field {
  margin-bottom: 10px;
}

.preview-wrap {
  position: relative;
  box-sizing: content-box;
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 1px solid gray;
  background-color: rgb(220, 220, 220);
  border-radius: 3px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-img {
  max-width: 100%;
  max-height: 100%;
}

.buttons {
  display: flex;
}
.buttons > div {
  margin-right: 5px;
}
</style>
