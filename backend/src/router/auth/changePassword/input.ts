import z from 'zod'

export const zChangePasswordTrpcInput = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(1),
})
