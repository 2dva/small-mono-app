import { on } from 'events'
import { ee } from '../../lib/logger'
import { trpc } from "../../lib/trpc"

export const logSubscriptionTrpcRoute = trpc.procedure.subscription(async function* (opts) {
  // listen for new events
  for await (const [data] of on(ee, 'log', {
    // Passing the AbortSignal from the request automatically
    //  cancels the event emitter when the request is aborted
    signal: opts.signal,
  })) {
    // console.log(`TRPC Server: `, data)
    const post = JSON.stringify(data)// as Post;
    yield post;
  }
})

// const ee = new EventEmitter()
// const myStreamRouter = trpc.procedure.stream()
//   .input(z.object({ userId: z.string() }))
//   .query(async ({ input, ctx, emit }) => {
//         // Отправляем несколько событий
//         await emit({ message: 'Hello', from: 'Server' });
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         await emit({ message: 'World', from: 'Server' });
//         return; // Завершаем поток
//     });





// ПРИМЕР РАБОТЫ С SSE:

// expressApp.get('/events', (req, res) => {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');

//   // Отправляем первое сообщение
//   res.write('data: {"message": "Добро пожаловать на сервер!"}\n\n');
//   console.log('START SSE EVENTS!')
//   // Имитация отправки данных каждую секунду
//   const intervalId = setInterval(() => {
//     const data = { timestamp: new Date().toISOString() };
//     res.write(`data: ${JSON.stringify(data)}\n\n`);
//   }, 3000);

//   // Обработка закрытия соединения клиентом
//   req.on('close', () => {
//     clearInterval(intervalId);
//     console.log('Клиент отключился');
//     res.end();
//   });
// });
