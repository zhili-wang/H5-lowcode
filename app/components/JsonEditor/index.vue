<script setup lang="ts">
import type * as Monaco from 'monaco-editor'

defineOptions({
  name: 'JsonEditor',
})
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  // 代码
  code: {
    type: String,
    default: '{"_vid":"vid_cfb3d5471c","moduleName":"baseWidgets","componentKey":"input","label":"表单项类型 - 输入框","adjustPosition":true,"focus":true,"styles":{"display":"flex","justifyContent":"flex-start","paddingTop":"0","paddingRight":"0","paddingLeft":"0","paddingBottom":"0","tempPadding":"0"},"hasResize":false,"props":{"label":"输入框","type":"text","placeholder":"请输入","error-message-align":"left","border":true,"clear-trigger":"always","input-align":"left","label-align":"left","maxlength":"500","modelValue":"","name":"","arrow-direction":"","autosize":false,"clearable":false},"draggable":true,"showStyleConfig":true,"animations":[],"actions":[],"events":[{"label":"输入框内容变化时触发","value":"update:model-value"},{"label":"输入框获得焦点时触发","value":"focus"},{"label":"输入框失去焦点时触发","value":"blur"},{"label":"点击清除按钮时触发","value":"clear"},{"label":"点击组件时触发","value":"click"},{"label":"点击输入区域时触发","value":"click-input"},{"label":"点击左侧图标时触发","value":"click-left-icon"},{"label":"点击右侧图标时触发","value":"click-right-icon"}],"model":{},"focusWithChild":false}',
  },
  layout: {
    // 布局
    type: Object as PropType<Monaco.editor.IDimension>,
    // required: true,
    // default: () => ({ width: 600, height: 600 }),
  },
  options: {
    type: Object as PropType<Monaco.editor.IStandaloneEditorConstructionOptions>,
    default: () => ({}),
  },
  vid: [String, Number],
  onChange: {
    type: Function as PropType<(value: string, event: Monaco.editor.IModelContentChangedEvent) => void>,
  },
})
let _subscription: Monaco.IDisposable | undefined
let preventTriggerChangeEvent = false

const monaco = useMonaco()!
const containerDomRef = ref<HTMLDivElement>()
// 需要一个shallowRef: 只监听value，不关心实际对象
const editorRef = shallowRef<Monaco.editor.IStandaloneCodeEditor | null>(null)

// 格式化代码
function formatCode() {
  window.requestIdleCallback(
    () => {
      editorRef.value?.getAction('editor.action.formatDocument')?.run()
    },
    { timeout: 800 },
  )
}

onMounted(() => {
  editorRef.value = monaco.editor.create(containerDomRef.value as HTMLDivElement, {
    value: props.code, // 初始值
    theme: 'vs-dark', // vs, hc-black, or vs-dark
    language: 'json', // 代码生成语言
    formatOnPaste: true, // 当粘贴的时候自动进行一次格式化代码
    tabSize: 4, // tab缩进长度
    minimap: {
      enabled: false, // 不需要小的缩略图
    },
    fontFamily: '微软雅黑', // 字体
    automaticLayout: true, // 编辑器自适应布局，可能会影响性能
    overviewRulerBorder: false,
    scrollBeyondLastLine: false, // 滚动配置，溢出才滚动
    // 格式化
    formatOnType: true,
    ...props.options,
  })
  // 如果代码有变化，会在这里监听到，当受到外部数据改变时，不需要触发change事件
  _subscription = editorRef.value.onDidChangeModelContent((event) => {
    if (!preventTriggerChangeEvent) {
      // getValue: 获取编辑器中的所有文本
      props.onChange?.(editorRef.value!.getValue(), event)
    }
  })
  formatCode()
  if (props?.layout) {
    editorRef.value.layout(props.layout)
  }
})

onBeforeUnmount(() => {
  // 组件销毁时卸载编辑器
  if (_subscription) {
    _subscription.dispose()
  }
})
// 更新编辑器
function refreshEditor() {
  if (editorRef.value) {
    const editor = editorRef.value
    // 获取编辑器的textModel文本
    const model = editor.getModel()

    // 如果代码发生变化 这里需要更新一版
    if (model && props.code !== model.getValue()) {
      // 这是进行一次常规化的操作 文档原文：Push an "undo stop" in the undo-redo stack.
      editor.pushUndoStop()
      preventTriggerChangeEvent = true
      /**
       * @function 开始编辑编辑器, 文档原文：Push edit operations, basically editing the model. This is the preferred way of editing the model. The edit operations will land on the undo stack.
       * @param 编辑操作之前的光标状态。调用撤销或重做时，将返回此光标状态
       * @param 需要编辑的内容 range: 编辑的内容范围，这里选择的是全部范围
       * @param 在编辑器质性完成之后可以计算光标状态的一个回调参数
       */
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: props.code,
          },
        ],
        () => null,
      )
    }

    editor.pushUndoStop()
    preventTriggerChangeEvent = false
    formatCode()
  }
}

watch(() => props.vid, refreshEditor, { immediate: true })
</script>

<template>
  <div class="h-2xl flex-column b b-#eee b-solid">
    <div v-if="props.title" class="b-#eee p-10px">
      {{ props.title }}
    </div>
    <div ref="containerDomRef" class="flex-1" />
  </div>
</template>
