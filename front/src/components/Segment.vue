<script setup lang="ts">

const props = defineProps({
  title: String,
  name: String,
  size: String,
  description: String,
  children: String,
})

</script>

<template>
  <div :class="$style['segment']">
    <h1 v-if="size=='1'" :class="$style['title']"><slot name="header"></slot></h1>
    <h2 v-else  :class="$style['title']"><slot name="header"></slot></h2>
    <p v-if="description != ''" :class="$style['description']">{{description}}</p>
    <div :class="$style['content']">
      <slot></slot>
    </div>
  </div>
</template>

<style module>
.description {
  font-size: 18px;
  margin-top: 5px;
}

.content {
  margin-top: 12px;
}
</style>
