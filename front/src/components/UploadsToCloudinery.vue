<template>
  <div :class="{ field: true, disabled: isSubmitting }">
    <div class="previews">
      <div v-for="publicId in publicIds" :key="publicIds + '_key'" class="preview-wrap">
        <img class="preview-img" alt="" :src="getCloudinaryUploadUrl(publicId, props.type, props.preset)" />
        <n-button  @click="() => handleRemoveAva(publicId)" class="delete-button" strong secondary circle size="tiny" type="error">
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

interface Props {
  values: string[]
  label: string
  name: string
  type: CloudinaryUploadTypeName
  preset: CloudinaryUploadPresetName<'image'> //!!! quick fix, should be correct common type
}

const props = defineProps<Props>()

let publicIds = ref<string[]>([...props.values])

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

      publicIds.value.push(publicId)
      emit('uploadReady', [...publicIds.value])
    })
    .catch((err) => {
      message.error(err.message)
      error.value = err.message
    })
    .finally(() => {
      isLoading.value = false
    })
}

function handleRemoveAva(publicId: string) {
  publicIds.value = publicIds.value.filter((el) => el !== publicId)
  emit('uploadReady', [...publicIds.value])
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
