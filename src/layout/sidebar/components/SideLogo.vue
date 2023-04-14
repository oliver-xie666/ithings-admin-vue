<script setup lang="ts">
import { useThemeStore } from '@/store'
const title = import.meta.env.VITE_APP_TITLE

const themeStore = useThemeStore()
</script>

<template>
  <router-link h-60 f-c-c to="/">
    <div>
      <img src="@/assets/logo/Group.png" alt="logo" text-36 color-primary w-40px>
    </div>
    <h2 v-show="!themeStore.sider.collapsed" ml-15 color-primary text-18 font-bold max-w-140 flex-shrink-0>
      {{ title }}
    </h2>
  </router-link>
</template>
