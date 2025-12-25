// import type { TrpcRouter } from '@small-mono-app/backend/src/router'
// import { createTRPCVueQueryClient } from '@falcondev-oss/trpc-vue-query'
// import { VueQueryPlugin, useQueryClient } from '@tanstack/vue-query'
// import { createApp, inject } from 'vue'
// import { httpBatchLink } from '@trpc/client'


// // ЭТО НЕРАБОЧИЙ МОДУЛЬ !!

// const app = createApp({})

// app.use(VueQueryPlugin)
// app.use({
//   install(app) {
//     const queryClient = app.runWithContext(useQueryClient)
//     const trpc = createTRPCVueQueryClient<TrpcRouter>({
//       queryClient,
//       trpc: {
//         links: [
//           httpBatchLink({
//             url: 'http://localhost:3000/trpc',
//           }),
//         ],
//       },
//     })

//     app.provide('trpc', trpc)
//   },
// })

// export function useTRPC() {
//   const trpc = inject('trpc')
//   if (!trpc) throw new Error('tRPC client is not available.')
//   // return inject('trpc') as ReturnType<typeof createTRPCVueQueryClient<TrpcRouter>>
//   return trpc
// }

// // export function useTRPC() {
// //   const trpc = inject(trpcKey)
// //   if (!trpc) throw new Error('tRPC client is not available.')

// //   return trpc
// // }
