import type { VisualEditorComponent } from '@/visual-editor/visual-editor.utils'
import {
  createEditorColorProp,
  createEditorInputNumberProp,
  createEditorInputProp,
  createEditorSwitchProp,
} from '@/visual-editor/visual-editor.props'
import { Progress } from 'vant'

export default {
  key: 'process',
  moduleName: 'baseWidgets',
  label: '进度条',
  preview: () => <Progress style="width:190px" percentage={50} />,
  render: ({ props, styles }) => {
    const RenderProgress = () => <Progress {...props} pivotText={props.pivotText || undefined} />

    return () => (
      <div style={styles}>
        <RenderProgress />
      </div>
    )
  },
  props: {
    percentage: createEditorInputNumberProp({ label: '进度百分比', defaultValue: 50 }),
    strokeWidth: createEditorInputNumberProp({ label: '线条粗细', defaultValue: 5 }),
    inactive: createEditorSwitchProp({ label: '是否置灰', defaultValue: false }),
    color: createEditorColorProp({ label: '进度条颜色', defaultValue: '#1989fa' }),
    trackColor: createEditorColorProp({ label: '轨道颜色', defaultValue: '#e5e5e5' }),
    pivotText: createEditorInputProp({ label: '进度文字内容' }),
    pivotColor: createEditorColorProp({ label: '进度文字背景色', defaultValue: '#1989fa' }),
    textColor: createEditorColorProp({ label: '进度文字颜色', defaultValue: '#ffffff' }),
    showPivot: createEditorSwitchProp({ label: '是否显示进度文字', defaultValue: true }),
  },
} as VisualEditorComponent
