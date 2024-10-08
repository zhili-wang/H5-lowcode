import type { VisualEditorComponent } from '@/visual-editor/visual-editor.utils'
import { useGlobalProperties } from '@/hooks/useGlobalProperties'
import { Divider } from 'vant'
import { computed } from 'vue'
import { createFieldProps } from './createFieldProps'

export default {
  key: 'divider',
  moduleName: 'baseWidgets',
  label: '分割线',
  preview: () => <Divider style="width:190px">文本</Divider>,
  props: createFieldProps(),
  render: ({ props, block, styles }) => {
    const { registerRef } = useGlobalProperties()

    const style = computed(() => ({
      width: '100%',
      color: props['text-color'],
      borderColor: props['divider-color'],
    }))

    return () => (
      <div style={styles}>
        <Divider ref={el => registerRef(el, block._vid)} {...props} style={style.value}>
          {{
            default: () => props.text,
          }}
        </Divider>
      </div>
    )
  },
} as VisualEditorComponent
