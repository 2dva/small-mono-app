<template>
  <div class="centered">
      <h1>Not found</h1>
      <p class="info">Sorry, page is not found</p>
      <img :src="image404" class="image" width="800" height="600" alt="" />
  </div>
</template>
<script setup lang="ts">
import image404 from '../assets/images/404.png'
</script>
<style scoped>
.centered {
  text-align: center;
}
.image {
  max-width: 100%;
  height: auto;
  margin: -50px;
}
.info {
  font-size: 22px;
}
</style>
