import { createNewPage } from '~/visual-editor/hooks/useVisualData'
import type { VisualEditorModelValue } from '~/visual-editor/visual-editor.utils'

const defaultValue: VisualEditorModelValue = {
  pages: {
    // 页面
    '/': createNewPage({ title: '首页' }),
  },
  models: [], // 模型实体集合
  actions: {
    // 动作集合
    fetch: {
      name: '接口请求',
      apis: [],
    },
    dialog: {
      name: '对话框',
      handlers: [],
    },
  },
}
export const usePageJson = () => useState<VisualEditorModelValue>('pageJson', () => defaultValue)

// 需要进行持久化的数据：把需要持久化的数据放在下面这个对象中，才会持久化，不需要持久化的数据就不用放到这里了。
const enduring: { [key: string]: () => Ref<any> } = {
  usePageJson,
}

/**
 * 把所有指定数据保存到本地存储
 * @param key 要保存的数据名。不填的话就是保存全部（一般不填，统一在页面关闭时保存。如果是特别重要的数据，就时不时单独保存一下即可。）
 */
export function setLocal(key?: string) {
  if (key) {
    // console.log('只保存', key)
    // 首字母大写，其它全部转小写
    const useKey
      = `use${key.slice(0, 1).toUpperCase()}${key.slice(1).toLowerCase()}`
    const func = enduring[useKey]
    if (!func) {
      // console.log('没有找到', useKey, '对应的函数')
      return
    }
    localStorage.setItem(key, JSON.stringify(func().value))
  }
  else {
    // console.log('正在保存全部数据')
    for (const key in enduring) {
      if (Object.prototype.hasOwnProperty.call(enduring, key)) {
        const element = enduring[key]
        // 去掉前面的use ，其它全部转小写
        const setKey = key.toLowerCase().substring(3)
        try {
          localStorage.setItem(setKey, JSON.stringify(element?.().value))
        }
        catch (error) {
          // console.log(`在设置${setKey}的数据时出现错误`, error)
        }
      }
    }
  }
}
/** 从本地存储获取数据到state中 */
export function getLoacl() {
  for (const key in enduring) {
    if (Object.prototype.hasOwnProperty.call(enduring, key)) {
      const element = enduring[key]
      const setKey = key.toLowerCase().substring(3) // 去掉前面的use ，其它全部转小写
      try {
        const localData = localStorage.getItem(setKey) || ''
        if (localData && element?.()) {
          element().value = JSON.parse(localData)
          // console.log(setKey, '的本地存储数据获取成功', element().value)
        }
      }
      catch (error) {
        // console.log(`在获取${setKey}的数据时出现错误`, error)
      }
    }
  }
}
