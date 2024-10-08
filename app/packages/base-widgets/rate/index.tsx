import type { VisualEditorComponent } from '@/visual-editor/visual-editor.utils'
import { useGlobalProperties } from '@/hooks/useGlobalProperties'
import {
  createEditorInputNumberProp,
  createEditorInputProp,
  createEditorModelBindProp,
  createEditorSwitchProp,
} from '@/visual-editor/visual-editor.props'
import { Field, Rate } from 'vant'
import { createFieldProps } from './createFieldProps'

export default {
  key: 'rate',
  moduleName: 'baseWidgets',
  label: '表单项类型 - 评分',
  preview: () => (
    <Field
      name="rate"
      label="评分"
      labelWidth={50}
      v-slots={{ input: () => <Rate modelValue={3} /> }}
    >
    </Field>
  ),
  render: ({ styles, block, props }) => {
    const { registerRef } = useGlobalProperties()

    return () => (
      <div style={styles}>
        <Field
          {...props}
          modelValue=""
          name={Array.isArray(props.name) ? [...props.name].pop() : props.name}
          v-slots={{
            input: () => (
              <Rate
                ref={el => registerRef(el, block._vid)}
                {...props}
                v-model={props.modelValue}
              >
              </Rate>
            ),
          }}
        />
      </div>
    )
  },
  props: {
    'modelValue': createEditorInputNumberProp({ label: '默认值', defaultValue: 0 }),
    'name': createEditorModelBindProp({ label: '字段绑定', defaultValue: '' }),
    'label': createEditorInputProp({ label: '输入框左侧文本', defaultValue: '评分' }),
    'count': createEditorInputNumberProp({ label: '图标总数', defaultValue: 5 }),
    'size': createEditorInputProp({ label: '图标大小' }),
    'allow-half': createEditorSwitchProp({ label: '是否允许半选' }),
    ...createFieldProps(),
  },
  resize: {
    width: true,
  },
  model: {
    default: '绑定字段',
  },
} as VisualEditorComponent
