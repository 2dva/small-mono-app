<template>
  <div :class="$style['tree-render']">
    <div :class="$style['tree-wrap']">
      <h1 :class="$style['header']">Tree Render</h1>
      <form @submit.prevent="">
        <div :class="$style['tree-input-wrap']">
          <n-auto-complete
            v-model:value="treeValue"
            ref="inputSource"
            size="large"
            :input-props="{ autocomplete: 'disabled' }"
            :options="options"
            placeholder="Введите строку"
            clearable
            @keyup.enter="onSelect"
          />
        </div>
        <n-button type="primary" native-type="submit" size="large" focusable @click="onDrawClick">Отрисовать</n-button>
      </form>
      <p v-if="treeError" :class="$style['tree-error']">{{ treeError }}</p>
      <pre v-else :class="$style['tree-space']">{{ treeGraphicFromBackend }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { validateTree } from '@small-mono-app/backend/src/lib/tree.ts'
import { computed, ref, onMounted } from 'vue'
import { useTRPC } from '../../lib/useTrpc.ts'

const treeValue = ref('')
const htmlTreeGraphic = ref('')
const treeError = ref('')
const treeGraphicFromBackend = ref('')
const inputSource = ref(null)
const suggestsSource = ref<string[]>([])
const trpc = useTRPC()
const treeMutation = trpc.getTree.useMutation()
const queryData = trpc.getSudggests.useQuery(() => {}, { enabled: false })

const options = computed(() => {
  const prefix = treeValue.value
  return suggestsSource.value.filter((str) => {
    return str.startsWith(prefix)
  })
})

function applySuggests() {
  if (typeof queryData.data.value !== 'undefined') suggestsSource.value = queryData.data.value

  if (inputSource.value) (inputSource.value as HTMLInputElement).focus()
  treeValue.value = suggestsSource.value[Math.floor(Math.random() * suggestsSource.value.length)]
}

onMounted(async () => {
  console.log(`Tree:onMounted`)

  await queryData.refetch()
  applySuggests()
})

function onSelect() {
  setTimeout(onDrawClick, 100)
}

function clearOutput() {
  htmlTreeGraphic.value = ''
  treeError.value = ''
  treeGraphicFromBackend.value = ''
}

async function onDrawClick() {
  clearOutput()

  treeGraphicFromBackend.value = 'Loading...'

  try {
    const stringTree = treeValue.value.trim()
    validateTree(stringTree)

    await treeMutation.mutateAsync({ stringTree })
    treeGraphicFromBackend.value = String(treeMutation.data.value?.tree)
  } catch (e) {
    clearOutput()
    treeError.value = String(e) || `Error while parsing tree`
  }
  ;(inputSource.value! as HTMLInputElement).focus()
}
</script>

<style module>
.tree-render {
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 400px;
}

.tree-wrap {
  margin: 0 auto;
}

.tree-input-wrap {
  max-width: 200px;
  display: inline-block;
  margin-right: 4px;
}

h1.header {
  font-size: 3em;
  line-height: 1.1;
  text-align: center;
}

input[type='text'] {
  margin-right: 4px;
}

.tree-outer-block {
  margin: 0;
}

.tree-error {
  color: red;
  padding: 3px;
}

.tree-space {
  color: #381d7a;
  background: #efefef;
  font-family: 'Courier New', Courier, monospace;
  padding: 3px;
}

.tree-space:empty {
  background: none;
}
</style>
