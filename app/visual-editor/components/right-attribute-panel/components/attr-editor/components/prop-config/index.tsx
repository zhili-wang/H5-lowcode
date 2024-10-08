import type { VisualEditorProps } from '@/visual-editor/visual-editor.props'
import type { VisualEditorBlockData, VisualEditorComponent } from '@/visual-editor/visual-editor.utils'
import type { PropType } from 'vue'
import { useDotProp } from '@/visual-editor/hooks/useDotProp'
import { useVisualData } from '@/visual-editor/hooks/useVisualData'
import { VisualEditorPropsType } from '@/visual-editor/visual-editor.props'
import { Warning } from '@element-plus/icons-vue'
import {
  ElCascader,
  ElColorPicker,
  ElFormItem,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElOption,
  ElSelect,
  ElSwitch,
  ElTooltip,
  ExpandTrigger,
} from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { computed, defineComponent } from 'vue'
import { CrossSortableOptionsEditor, TablePropEditor } from '..'

export const PropConfig = defineComponent({
  props: {
    component: {
      type: Object as PropType<VisualEditorComponent>,
      default: () => ({}),
    },
    block: {
      type: Object as PropType<VisualEditorBlockData>,
      default: () => ({}),
    },
  },
  setup(props) {
    const { jsonData } = useVisualData()
    /**
     * @description 模型集合
     */
    const models = computed(() => cloneDeep(jsonData.models))

    const renderPropItem = (propName: string, propConfig: VisualEditorProps) => {
      const { propObj, prop } = useDotProp(props.block.props, propName)

      propObj[prop] ??= propConfig.defaultValue

      return {
        [VisualEditorPropsType.input]: () => {
          if (!Object.is(propObj[prop], undefined) && !Object.is(propObj[prop], null)) {
            propObj[prop] = `${propObj[prop]}`
          }
          return (
            <ElInput v-model={propObj[prop]} placeholder={propConfig.tips || propConfig.label} />
          )
        },
        [VisualEditorPropsType.inputNumber]: () => {
          const parseRes = Number.parseFloat(propObj[prop])
          propObj[prop] = Number.isNaN(parseRes) ? 0 : parseRes
          return <ElInputNumber v-model={propObj[prop]} />
        },
        [VisualEditorPropsType.switch]: () => <ElSwitch v-model={propObj[prop]} />,
        [VisualEditorPropsType.color]: () => <ElColorPicker v-model={propObj[prop]} />,
        [VisualEditorPropsType.crossSortable]: () => (
          <CrossSortableOptionsEditor
            v-model={propObj[prop]}
            multiple={propConfig.multiple}
            showItemPropsConfig={propConfig.showItemPropsConfig}
          />
        ),
        [VisualEditorPropsType.select]: () => (
          <ElSelect v-model={propObj[prop]} valueKey="value" multiple={propConfig.multiple}>
            {propConfig.options?.map(opt => (
              <ElOption label={opt.label} style={{ fontFamily: opt.value }} value={opt.value} />
            ))}
          </ElSelect>
        ),
        [VisualEditorPropsType.table]: () => (
          <TablePropEditor v-model={propObj[prop]} propConfig={propConfig} />
        ),
        [VisualEditorPropsType.modelBind]: () => (
          <ElCascader
            clearable={true}
            props={{
              checkStrictly: true,
              children: 'entitys',
              label: 'name',
              value: 'key',
              expandTrigger: ExpandTrigger.HOVER,
            }}
            placeholder="请选择绑定的请求数据"
            v-model={propObj[prop]}
            options={[...models.value]}
          >
          </ElCascader>
        ),
      }[propConfig.type]()
    }

    return () => {
      return Object.entries(props.component.props ?? {}).map(([propName, propConfig]) => (
        <>
          <ElFormItem
            key={props.block._vid + propName}
            style={
              propConfig.labelPosition == 'top'
                ? {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }
                : {}
            }
          >
            {{
              label: () => (
                <>
                  {propConfig.tips && (
                    <ElTooltip
                      placement="left-start"
                      popper-class="max-w-200px"
                      content={propConfig.tips}
                    >
                      <div>
                        <ElIcon>
                          <Warning />
                        </ElIcon>
                      </div>
                    </ElTooltip>
                  )}
                  {propConfig.label}
                </>
              ),
              default: () => renderPropItem(propName, propConfig),
            }}
          </ElFormItem>
        </>
      ))
    }
  },
})
