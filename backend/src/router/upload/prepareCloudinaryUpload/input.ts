import { cloudinaryUploadTypes } from '@small-mono-app/shared/src/cloudinary'
import { getKeysAsArray } from '@small-mono-app/shared/src/getKeysAsArray'
import { z } from 'zod'

export const zPrepareCloudinaryUploadTrpcInput = z.object({
  type: z.enum(getKeysAsArray(cloudinaryUploadTypes)),
})
