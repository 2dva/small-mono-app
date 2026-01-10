<template>
  <div>Loading...</div>
</template>

<script setup lang="ts">
import Cookies from 'js-cookie'
import router from '../../lib/router'
import { useTRPC } from '../../lib/useTrpc'
import { getSignInRoute } from '../../lib/routes'

Cookies.remove('token')
const trpc = useTRPC()
trpc.getMe.invalidate().then(() => {
  router.push({ path: getSignInRoute() })
})
</script>
