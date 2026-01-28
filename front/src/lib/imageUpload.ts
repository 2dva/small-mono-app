import { CloudinaryUploadTypeName } from '@small-mono-app/shared/src/cloudinary'
import { memoize } from 'lodash'
import { TrpcClient } from './useTrpc'

export const useUploadToCloudinary = (type: CloudinaryUploadTypeName, trpc: TrpcClient) => {
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
