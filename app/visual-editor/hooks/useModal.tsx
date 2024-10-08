import type {
  ComponentInternalInstance,
  PropType,
} from 'vue'
import { isFunction } from '@/visual-editor/utils/is'
import { ElButton, ElDialog } from 'element-plus'
import {
  createApp,
  defineComponent,
  getCurrentInstance,
  isVNode,
  reactive,
} from 'vue'

interface ModalOptions {
  title?: string
  footer?: null | (() => JSX.Element)
  content: ComponentInternalInstance | (() => JSX.Element)
  onConfirm?: () => void
  onCancel?: () => void
  props?: {
    [propName: string]: any
  }
}

const Modal = defineComponent({
  props: {
    options: {
      type: Object as PropType<ModalOptions>,
      default: () => ({}),
    },
  },
  setup(props) {
    const instance = getCurrentInstance()!

    const state = reactive({
      options: props.options,
      visible: true,
    })

    const methods = {
      service: (options: ModalOptions) => {
        state.options = options as any
        methods.show()
      },
      show: () => (state.visible = true),
      hide: () => (state.visible = false),
    }

    const handler = {
      onConfirm: async () => {
        await state.options.onConfirm?.()
        methods.hide()
      },
      onCancel: () => {
        state.options.onCancel?.()
        methods.hide()
      },
    }

    Object.assign(instance.proxy!, methods)

    return () => (
      <ElDialog
        v-model={state.visible}
        title={state.options.title}
        destroyOnClose={true}
        {...state.options.props}
        onClose={handler.onCancel}
      >
        {{
          default: () =>
            isVNode(state.options.content)
              ? (
                  <content />
                )
              : isFunction(state.options.content)
                ? (
                    state.options.content()
                  )
                : null,
          footer: () =>
            state.options.footer === null
              ? null
              : (
                  <div>
                    <ElButton {...({ onClick: handler.onCancel } as any)}>取消</ElButton>
                    <ElButton type="primary" {...({ onClick: handler.onConfirm } as any)}>
                      确定
                    </ElButton>
                  </div>
                ),
        }}
      </ElDialog>
    )
  },
})

export const useModal = (() => {
  let instance: any
  return (options: ModalOptions) => {
    if (instance) {
      instance.service(options)
      return instance
    }
    const div = document.createElement('div')
    document.body.appendChild(div)
    const app = createApp(Modal, { options })
    instance = app.mount(div)
    return instance
  }
})()
