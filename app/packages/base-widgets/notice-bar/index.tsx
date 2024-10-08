import type { VisualEditorComponent } from '@/visual-editor/visual-editor.utils'
import { useGlobalProperties } from '@/hooks/useGlobalProperties'
import { NoticeBar } from 'vant'
import { createFieldProps } from './createFieldProps'

export default {
  key: 'NoticeBar',
  moduleName: 'baseWidgets',
  label: '通知栏',
  preview: () => (
    <NoticeBar
      style={{ width: '100%' }}
      leftIcon="volume-o"
      text="在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"
    />
  ),
  render: ({ block, props, styles }) => {
    const { registerRef } = useGlobalProperties()

    return () => (
      <div style={styles}>
        <NoticeBar ref={el => registerRef(el, block._vid)} style={{ width: '100%' }} {...props} />
      </div>
    )
  },
  events: [
    { label: '点击通知栏时触发', value: 'click' },
    { label: '关闭通知栏时触发', value: 'close' },
    { label: '每当滚动栏重新开始滚动时触发', value: 'replay' },
  ],
  props: createFieldProps(),
  resize: {
    width: true,
  },
  model: {
    default: '绑定字段',
  },
} as VisualEditorComponent
