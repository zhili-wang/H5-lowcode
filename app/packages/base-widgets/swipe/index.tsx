import type { VisualEditorComponent } from '@/visual-editor/visual-editor.utils'
import { useGlobalProperties } from '@/hooks/useGlobalProperties'
import { Swipe, SwipeItem } from 'vant'
import { createFieldProps } from './createFieldProps'

const swipeItemStyle = `color: #fff;
font-size: 20px;
line-height: 150px;
text-align: center;
background-color: #39a9ed;`

export default {
  key: 'swipe',
  moduleName: 'baseWidgets',
  label: '轮播图',
  preview: () => (
    <Swipe style={{ width: '180px', height: '80%' }} indicatorColor="white">
      <SwipeItem style={swipeItemStyle}>1</SwipeItem>
      <SwipeItem style={swipeItemStyle}>2</SwipeItem>
      <SwipeItem style={swipeItemStyle}>3</SwipeItem>
      <SwipeItem style={swipeItemStyle}>4</SwipeItem>
    </Swipe>
  ),
  render: ({ block, props }) => {
    const { registerRef } = useGlobalProperties()

    return () => (
      <div>
        <Swipe
          ref={el => registerRef(el, block._vid)}
          {...props}
          style={{ height: `${props.height}px` }}
        >
          {props.images?.map(item => (
            <>
              <SwipeItem key={item}>
                <img style={{ width: '100%' }} src={item} />
              </SwipeItem>
            </>
          ))}
        </Swipe>
      </div>
    )
  },
  props: createFieldProps(),
  events: [{ label: '每一页轮播结束后触发', value: 'change' }],
  showStyleConfig: false,
  resize: {
    width: true,
  },
  model: {
    default: '绑定字段',
  },
} as VisualEditorComponent
