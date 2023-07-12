<script setup lang="ts">
import { useAppStore } from '@/store'
const appStore = useAppStore()
</script>

<template>
  <div p-20>
    <router-view v-slot="{ Component, route }">
      <component :is="Component" v-if="appStore.reloadFlag" :key="route.path" />
    </router-view>
  </div>
</template>
