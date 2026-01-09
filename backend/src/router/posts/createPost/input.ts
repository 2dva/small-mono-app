import { z } from 'zod'

export const zCreatePostTrpcInput = z.object({
  title: z.string().min(1),
  nick: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Nick may contain only letters and numbers'),
  description: z.string().min(1),
  content: z.string().min(50),
})
