// import type { TrpcRouter } from '@small-mono-app/backend/src/router'
// import { VueQueryPlugin, useQueryClient } from '@tanstack/vue-query'
// import { TrpcVueQueryPlugin } from "@colonel-sandvich/trpc-vue-query";
// import { createApp, inject } from 'vue'
// import { createTRPCClient, httpBatchLink } from '@trpc/client';
// // import type { AppRouter } from '../path/to/server/trpc';
// import { TrpcVueClient, clientKey } from "@colonel-sandvich/trpc-vue-query";

// const app = createApp({})

// const trpc = createTRPCClient<TrpcRouter>({
//     links: [
//       httpBatchLink({
//         url: 'http://localhost:3000/trpc',
//       }),
//     ],
// })


// //     install(app) {
// //     const queryClient = app.runWithContext(useQueryClient)

// //     app.provide('trpc', trpc)
// //   },
// // })


// app.use(VueQueryPlugin)
// app.use(TrpcVueQueryPlugin, {
//   trpcClient: trpc,
// })


// export function useClient() {
//   return inject(clientKey) as TrpcVueClient<TrpcRouter>;
// }

// // export function useTRPC() {
// //   const trpc = inject('trpc')
// //   if (!trpc) throw new Error('tRPC client is not available.')
// //   // return inject('trpc') as ReturnType<typeof createTRPCVueQueryClient<TrpcRouter>>
// //   return trpc
// // }

// // export function useTRPC() {
// //   const trpc = inject(trpcKey)
// //   if (!trpc) throw new Error('tRPC client is not available.')

// //   return trpc
// // }
