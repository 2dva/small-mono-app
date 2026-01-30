<template>
  <div :class="{ field: true, disabled: isSubmitting }">
    <div class="previews">
      <div v-for="previewUrl in previewUrls" :key="previewUrl + '_key'" class="preview-wrap">
        <img class="preview-img" alt="" :src="previewUrl" />
        <n-button  @click="() => handleRemoveAva(previewUrl)" class="delete-button" strong secondary circle size="tiny" type="error">
          <template #icon> ❌ </template>
        </n-button>
      </div>
    </div>

    <div class="buttons">
      <n-upload action="" :multiple="true" accept="image/*" :show-file-list="false" :custom-request="handleUploadAva">
        <n-button>Upload</n-button>
      </n-upload>
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
let previewUrls = ref<string[]>([])

interface Props {
  values: string[]
  label: string
  name: string
  type: CloudinaryUploadTypeName
  preset: CloudinaryUploadPresetName<'image'> //!!! quick fix, should be correct common type
}

const props = defineProps<Props>()

for (let value in props.values) {
  previewUrls.value.push(getCloudinaryUploadUrl(value, props.type, props.preset))
}

const emit = defineEmits<{
  (e: 'uploadReady', publicIds: string[]): void
}>()

const message = useMessage()
const trpc = useTRPC()
const { uploadToCloudinary } = useUploadToCloudinary(props.type, trpc)

function handleUploadAva({ file, onFinish }: UploadCustomRequestOptions) {
  isLoading.value = true
  error.value = null
  onFinish() // this will stop repeating callback for uploaded file
  
  uploadToCloudinary(file.file as File)
    .then(({ publicId }) => {
      console.log(`uploadToCloudinary:`, publicId)

      previewUrls.value.push(getCloudinaryUploadUrl(publicId, props.type, props.preset))
      emit('uploadReady', [...previewUrls.value])
    })
    .catch((err) => {
      message.error(err.message)
      error.value = err.message
    })
    .finally(() => {
      isLoading.value = false
    })
}

function handleRemoveAva(previewUrl: string) {
  previewUrls.value = previewUrls.value.filter((el) => el !== previewUrl)
  //TODO: implement
  // previewUrl.value = null
  // emit('uploadReady', null)
  emit('uploadReady', [...previewUrls.value])
}
</script>

<style scoped>
.field {
  margin-bottom: 10px;
}

.previews {
  display: flex;
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
  margin-right: 5px;
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

.delete-button {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
