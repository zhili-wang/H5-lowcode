<script setup lang="ts">
const name = ref('')

const router = useRouter()
function go() {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}
</script>

<template>
  <div>
    <input
      id="input"
      v-model="name"
      placeholder="What's your name?"
      type="text" autocomplete="off"
      class="outline-active:none w-250px b b-dark:gray-700 b-gray-200 b-rounded bg-transparent px-4 py-2 text-center outline-none"
      @keydown.enter="go"
    >
    <div>
      <button
        class="m-3 text-sm btn"
        :disabled="!name"
        @click="go"
      >
        GO
      </button>
    </div>
  </div>
</template>
