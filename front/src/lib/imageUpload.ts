import {
  CloudinaryUploadPresetName,
  CloudinaryUploadTypeName,
  getCloudinaryUploadUrl,
} from '@small-mono-app/shared/src/cloudinary'
import { memoize } from 'lodash'
import { TrpcClient } from './useTrpc'

export enum ImageTypes {
  'Avatar',
  'Image',
}

export function getUploadedImagePreviewUrl(publicId: string, imageType: ImageTypes) {
  const type: CloudinaryUploadTypeName = imageType === ImageTypes.Avatar ? 'avatar' : 'image'
  const preset: CloudinaryUploadPresetName<'avatar' & 'image'> = imageType === ImageTypes.Avatar ? 'small' : 'preview'
  return getCloudinaryUploadUrl(publicId, type, preset)
}

export const useUploadToCloudinary = (imageType: ImageTypes, trpc: TrpcClient) => {
  const type: CloudinaryUploadTypeName = imageType === ImageTypes.Avatar ? 'avatar' : 'image'
  const prepareCloudinaryUpload = trpc.prepareCloudinaryUpload.useMutation()

  const getPreparedData = memoize(
    async () => {
      const { preparedData } = await prepareCloudinaryUpload.mutateAsync({ type })
      return preparedData
    },
    () => JSON.stringify({ type, minutes: new Date().getMinutes() })
  )

  const uploadToCloudinary = async (file: File) => {
    const preparedData = await getPreparedData()

    const formData = new FormData()
    formData.append('file', file)
    formData.append('timestamp', preparedData.timestamp)
    formData.append('folder', preparedData.folder)
    formData.append('transformation', preparedData.transformation)
    formData.append('eager', preparedData.eager)
    formData.append('signature', preparedData.signature)
    formData.append('api_key', preparedData.apiKey)

    return await fetch(preparedData.url, {
      method: 'POST',
      body: formData,
    })
      .then(async (rawRes) => {
        return await rawRes.json()
      })
      .then((res) => {
        if (res.error) {
          throw new Error(res.error.message)
        }
        return {
          publicId: res.public_id as string,
          res,
        }
      })
  }

  return { uploadToCloudinary }
}
