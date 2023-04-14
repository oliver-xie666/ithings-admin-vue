<script setup lang="ts">
const title: string = import.meta.env.VITE_APP_CAP_TITLE
</script>

<template>
  <footer text-14 f-c-c flex-col color="#6a6a6a">
    <p>
      Copyright©2022
      <a href="https://github.com/i4de" target="__blank" hover="decoration-underline color-primary"> {{ title }}</a>
    </p>
    <!-- <p>
      <a href="http://beian.miit.gov.cn/" target="__blank" hover="decoration-underline color-primary">
        赣ICP备2020015008号-1
      </a>
    </p> -->
  </footer>
</template>
