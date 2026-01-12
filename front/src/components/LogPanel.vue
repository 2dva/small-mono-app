<template>
  <n-button size="tiny" focusable @click="addLogsClick">Add logs</n-button>
  <n-button size="tiny" focusable @click="clearClick">Clear</n-button>
  <n-log
    :log="logRef"
    ref="logInstRef"
    :loading="loadingRef"
    trim
    :rows="22"
    @reach-top="handleReachTop"
    @reach-bottom="handleReachBottom"
  />
</template>
<script setup lang="ts">
import type { LogInst } from 'naive-ui'
import { nextTick, onMounted, ref, watchEffect } from 'vue'
import { useTRPC } from '../lib/useTrpc.ts'

// function onAddLogsClick() {
//   logRef.value = logRef.value + log()
// }

function log() {
  const l: string[] = []
  for (let i = 0; i < 2; ++i) {
    l.push(Math.random().toString(16))
  }
  return `${l.join('\n')}\n`
}

const loadingRef = ref(false)
const logRef = ref(`Initializing logs...\n`)
const logInstRef = ref<LogInst | null>(null)
const startRef = ref(false)
const timerRef = ref<number | null>(null)

function clearClick() {
  logRef.value = ''
}

function addLogsClick() {
  startRef.value = !startRef.value
  if (startRef.value) {
    timerRef.value = window.setInterval(() => {
      logRef.value = logRef.value + log()
    }, 1000)
  }
  else if (timerRef.value) {
    clearInterval(timerRef.value)
    timerRef.value = null
  }
}
onMounted(() => {
  watchEffect(() => {
    if (logRef.value) {
      nextTick(() => {
        logInstRef.value?.scrollTo({ position: 'bottom', silent: true })
      })
    }
  })
})

function handleReachTop() {
  // message.info('Reach Top')
}

function handleReachBottom() {
  // message.info('Reach Bottom')
}

const trpc = useTRPC()
trpc.onLogAdd.useSubscription(undefined, {
  onData: (data) => {
    console.log(`TRPC SSE: ${data}`)
    logRef.value = logRef.value + String(data) + '\n'
  },
})


// const eventSource = new EventSource('http://localhost:3000/events'); // Подключаемся к /events

// eventSource.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     console.log('Получено:', data);
//       logRef.value = logRef.value + JSON.stringify(data) + '\n'
//     // document.getElementById('messages').innerHTML += `<p>${JSON.stringify(data)}</p>`;
// };

// eventSource.onerror = (err) => {
//     console.error('Ошибка EventSource:', err);
//     eventSource.close();
// };



</script>