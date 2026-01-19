import { CronJob } from 'cron'
import { type AppContext } from './ctx'

export const applyCron = (ctx: AppContext) => {
  new CronJob(
    '0 10 1 * *', // At 10:00 on day-of-month 1
    () => {
      console.log(`Hello from cron`);
    },
    null, // onComplete
    true // start right now
  )
}
