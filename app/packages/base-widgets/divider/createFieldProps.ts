import {
  createEditorColorProp,
  createEditorInputProp,
  createEditorSelectProp,
  createEditorSwitchProp,
} from '@/visual-editor/visual-editor.props'

export function createFieldProps() {
  return {
    'text': createEditorInputProp({ label: '展示文本', defaultValue: '文本' }),
    'content-position': createEditorSelectProp({
      label: '文本位置',
      options: [
        { label: '左边', value: 'left' },
        { label: '中间', value: 'center' },
        { label: '右边', value: 'right' },
      ],
      defaultValue: 'center',
    }),
    'dashed': createEditorSwitchProp({ label: '是否为虚线' }),
    'hairline': createEditorSwitchProp({ label: '是否使用 0.5px 线' }),
    'text-color': createEditorColorProp({ label: '文本颜色' }),
    'divider-color': createEditorColorProp({ label: '分割线颜色' }),
  }
}
