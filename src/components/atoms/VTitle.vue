<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <h2 class="text-center">{{ title }}</h2>
</template>
