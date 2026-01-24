<template>
  <div class="layout">
    <div class="left-menu">
      <n-menu :options="menuOptions" />
    </div>
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MenuOption } from 'naive-ui'
import { h, inject } from 'vue'
import { RouterLink } from 'vue-router'
import { me } from '../../lib/injectionKeys'
import { getChangePasswordRoute, getEditProfileRoute, getShowProfileRoute } from '../../lib/routes'

const { myData } = inject(me)!

const menuOptions: MenuOption[] = [
  {
    label: () => h(RouterLink, { to: getShowProfileRoute() }, () => 'Profile'),
    key: 'profile-view',
  },
  {
    label: () => h(RouterLink, { to: getEditProfileRoute() }, () => 'Edit profile'),
    key: 'profile-edit',
    show: myData.value !== null,
  },
  {
    label: () => h(RouterLink, { to: getChangePasswordRoute() }, () => 'Change password'),
    key: 'password-change',
    show: myData.value !== null,
  },
]
</script>

<style scoped>
.layout {
  position: relative;
  padding-top: 1px;
  display: flex;
}

.content {
  flex-grow: 1;
  margin: 10px;
  display: flex;
  justify-content: center;
}

.left-menu {
  width: 200px;
  border-right: 1px solid #eeeeee;
}
</style>
