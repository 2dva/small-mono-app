import { zStringRequired } from '@small-mono-app/shared/src/zod'
import z from 'zod'

export const zChangePasswordTrpcInput = z.object({
  oldPassword: zStringRequired,
  newPassword: zStringRequired,
})
