<template>
  <n-form-item :label="label">
    <div>
      <div class="previews">
        <div v-for="publicId in publicIds" :key="publicIds + '_key'" class="preview-wrap">
          <img class="preview-img" alt="" :src="getUploadedImagePreviewUrl(publicId, type)" />
          <n-button v-if="multiple" @click="() => handleRemoveAva(publicId)" class="delete-button"  secondary circle size="tiny"
            >
            <template #icon>
              <n-icon :size="22" :component="CloseCircleSharp" />
            </template>
          </n-button>
        </div>
      </div>
      <div class="buttons">
        <n-upload action="" :disabled="isLoading" :multiple="multiple" accept="image/*" :show-file-list="false"
          :custom-request="handleUploadAva">
          <n-button>Upload</n-button>
        </n-upload>
        <n-spin v-if="isLoading" size="small" />
       <n-button v-if="!multiple && publicIds.length && !isLoading" type="warning" @click="() => handleRemoveAva()">
          Remove
        </n-button>
      </div>
      <n-alert v-if="error !== null" title="Error" type="error">
        {{ error }}
      </n-alert>
    </div>
  </n-form-item>
</template>

<script setup lang="ts">
import { UploadCustomRequestOptions, useMessage } from 'naive-ui'
import { ref } from 'vue'
import { getUploadedImagePreviewUrl, ImageTypes, useUploadToServer } from '../lib/imageUpload'
import { useTRPC } from '../lib/useTrpc'
import { CloseCircleSharp } from '@vicons/ionicons5'

let isLoading = ref(false)
let error = ref<string | null>(null)

interface Props {
  values: string[]
  label: string
  type: ImageTypes
  multiple?: boolean
}

const { values, label, type, multiple = false } = defineProps<Props>()

let publicIds = ref<string[]>([...values])

const emit = defineEmits<{
  (e: 'uploadReady', publicIds: string[]): void
}>()

const message = useMessage()
const trpc = useTRPC()
const { uploadToCloudinary } = useUploadToServer(type, trpc)

let activeUploads = 0

function handleUploadAva({ file, onFinish }: UploadCustomRequestOptions) {
  activeUploads++
  isLoading.value = true
  error.value = null
  onFinish() // this will stop repeating callback for uploaded file

  uploadToCloudinary(file.file as File)
    .then(({ publicId }) => {
      console.log(`uploadToCloudinary:`, publicId)

      publicIds.value.push(publicId)
      emit('uploadReady', [...publicIds.value])
    })
    .catch((err) => {
      message.error(err.message)
      error.value = err.message
    })
    .finally(() => {
      activeUploads--
      if (activeUploads === 0) {
        isLoading.value = false
      }
    })
}

function handleRemoveAva(publicId?: string) {
  publicIds.value = publicIds.value.filter((el) => !!publicId ? el !== publicId : false)
  emit('uploadReady', [...publicIds.value])
}
</script>

<style scoped>
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

.buttons>div {
  margin-right: 5px;
  width: auto;
}

.delete-button {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
