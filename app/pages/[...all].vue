<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <main class="px-4 py-10 text-center text-dark:gray-200 text-teal-700">
    <div class="text-4xl">
      <Icon name="i-carbon-warning" class="inline-block" />
    </div>
    <div>Not found</div>
    <div>
      <button class="m-3 mt-8 text-sm btn" @click="router.back()">
        Back
      </button>
    </div>
  </main>
</template>
