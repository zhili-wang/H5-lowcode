import type { VisualEditorComponent } from '@/visual-editor/visual-editor.utils'
import { createEditorInputProp, createEditorSwitchProp } from '@/visual-editor/visual-editor.props'

export function getTabbarItem(): VisualEditorComponent {
  return {
    key: 'tabbar-item',
    moduleName: 'baseWidgets',
    label: '底部标签栏',
    preview: () => <></>,
    render: () => () => <></>,
    props: {
    // name: createEditorInputProp({
    //   label: '标签名称，作为匹配的标识符',
    //   defaultValue: '当前标签的索引值'
    // }),
      icon: createEditorInputProp({ label: '图标名称或图片链接', defaultValue: 'home-o' }),
      iconPrefix: createEditorInputProp({
        label: '图标类名前缀',
        tips: '图标类名前缀，同 Icon 组件的 class-prefix 属性',
        defaultValue: 'van-icon',
      }),
      dot: createEditorSwitchProp({ label: '是否显示图标右上角小红点', defaultValue: false }),
      badge: createEditorInputProp({ label: '图标右上角徽标的内容', defaultValue: '' }),
      url: createEditorInputProp({ label: '点击后跳转的链接地址', defaultValue: '' }),
      // to: createEditorInputProp({
      //   label: '点击后跳转的目标路由对象',
      //   tips: '点击后跳转的目标路由对象，同 vue-router 的 to 属性',
      //   defaultValue: ''
      // }),
      replace: createEditorSwitchProp({ label: '是否在跳转时替换当前页面历史', defaultValue: false }),
    },
    events: [
      { label: '点击左侧按钮时触发', value: 'click-left' },
      { label: '点击右侧按钮时触发', value: 'click-right' },
    ],
    draggable: false,
  }
}
