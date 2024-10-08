<script setup lang="ts">
import { initVisualData, injectKey, localKey } from '@/visual-editor/hooks/useVisualData'
import { provide } from 'vue'
import { appName } from '~/constants'

const page = ref()

const visualData = initVisualData()
// 注入可视化编辑器所有配置
provide(injectKey, visualData)

const { jsonData } = visualData
const pageJson = usePageJson()

useHead({
  title: appName,
})

// 挂载钩子，必须在onMounted的时候才能用local和window
onMounted(() => {
  getLoacl()
  // 离开页面时保存数据，由于可能突发情况，所以重要数据请手动调用setLocal函数
  window.onbeforeunload = () => {
    pageJson.value = jsonData
    // 如果需要调试本地存储数据，记得把这个注释一下
    setLocal()
  }
  // window.onbeforeunload = () => {
  //   sessionStorage.setItem(localKey, JSON.stringify(jsonData))
  // }
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage ref="page" />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  background: #222;
  color: white;
}
</style>
