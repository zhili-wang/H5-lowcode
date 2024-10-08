import type { VisualEditorBlockData } from '@/visual-editor/visual-editor.utils'
import { visualConfig } from '~/visual.config'
/*
 * @Author: 卜启缘
 * @Date: 2021-05-04 05:36:58
 * @LastEditTime: 2021-07-13 17:17:52
 * @LastEditors: 卜启缘
 * @Description:
 * @FilePath: \vite-vue3-lowcode\src\visual-editor\components\simulator-editor\comp-render.tsx
 */
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CompRender',
  props: {
    element: {
      type: Object as PropType<VisualEditorBlockData>,
      default: () => ({}),
    },
  },
  setup(props) {
    return visualConfig.componentMap[props.element.componentKey].render({
      styles: props.element.styles || {},
      props: props.element.props || {},
      model: {},
      block: props.element,
      custom: {},
    })
  },
})
