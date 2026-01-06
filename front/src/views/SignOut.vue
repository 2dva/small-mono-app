<template>
  <div>Loading...</div>
</template>

<script setup lang="ts">
import Cookies from 'js-cookie'
import router from '../lib/router';

Cookies.remove('token')
// TODO: сделать инвалидацию запросов
// const trpcUtils = trpc.useContext().invalidate()
//.then(() => { ...redirect... })
router.push({ name: 'signin' })


</script>
  
