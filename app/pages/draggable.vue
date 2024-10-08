<script setup>
import draggable from 'vuedraggable'

const items = ref([
  {
    title: 'Item 1',
  },
  {
    title: 'Item 2',
  },
  {
    title: 'Item 3',
  },
])
</script>

<template>
  <draggable v-model="items" handle=".handle">
    <template #item="{ element: item }">
      <div class="flex-center gap-2">
        <Icon name="material-symbols:dehaze" class="handle primary-text-hover" />
        <div class="title">
          {{ item.title }}
        </div>
      </div>
    </template>
  </draggable>
</template>
