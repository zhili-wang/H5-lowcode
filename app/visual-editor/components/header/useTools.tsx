import { useModal } from '@/visual-editor/hooks/useModal'
import { localKey, useVisualData } from '@/visual-editor/hooks/useVisualData.js'
import {
  Cellphone,
  ChatLineSquare,
  Delete,
  DocumentCopy,
  Download,
  Position,
  RefreshLeft,
  RefreshRight,
  Upload,
} from '@element-plus/icons-vue'
import { useClipboard } from '@vueuse/core'
import JsonEditor from '~/visual-editor/components/common/JsonEditor/index.vue'
// import { useQRCode } from '@vueuse/integrations/useQRCode'
import { ElMessage, ElRadio, ElRadioGroup } from 'element-plus'
import { reactive } from 'vue'
import type { VisualEditorModelValue } from '~/visual-editor/visual-editor.utils'
import 'element-plus/es/components/message/style/css'

/**
 * 工具栏
 * @returns
 */
export function useTools() {
  const { jsonData, updatePage, currentPage, overrideProject } = useVisualData()
  const state = reactive({
    coverRadio: 'current',
    importJsonValue: '',
  })
  const importJsonChange = (value) => {
    state.importJsonValue = value
  }

  return [
    {
      title: '导入JSON',
      icon: Upload,
      onClick: () => {
        useModal({
          title: '导入JSON',
          props: {
            width: 642,
          },
          content: () => (
            <>
              <ElRadioGroup v-model={state.coverRadio}>
                <ElRadio label="current">覆盖当前页面</ElRadio>
                <ElRadio label="all">覆盖整个项目</ElRadio>
              </ElRadioGroup>
              <JsonEditor
                onChange={importJsonChange}
                code={JSON.stringify(jsonData)}
                layout={{ width: 600, height: 600 }}
              />
            </>
          ),
          onConfirm: () => {
            const isCoverCurrent = state.coverRadio == 'current'
            // 覆盖当前页面
            if (isCoverCurrent) {
              updatePage({
                oldPath: currentPage.value.path,
                page: JSON.parse(state.importJsonValue),
              })
            }
            else {
              // 覆盖整个项目
              overrideProject(JSON.parse(state.importJsonValue))
            }
            ElMessage({
              showClose: true,
              type: 'success',
              duration: 2000,
              message: isCoverCurrent ? '成功覆盖当前页面' : '成功覆盖整个项目',
            })
          },
        })
      },
    },
    {
      title: '导出JSON',
      icon: Download,
      onClick: () => {
        const { copy } = useClipboard({ source: JSON.stringify(jsonData) })

        copy()
          .then(() => ElMessage.success('复制成功'))
          .catch(err => ElMessage.error(`复制失败：${err}`))
      },
    },
    // {
    //   title: '真机预览',
    //   icon: Cellphone,
    //   onClick: () => {
    //     const qrcode = useQRCode(`${location.origin}/preview`)
    //     useModal({
    //       title: '预览二维码（暂不可用）',
    //       props: {
    //         width: 300,
    //       },
    //       footer: null,
    //       content: () => (
    //         <div class="flex justify-center">
    //           <img width={220} height={220} src={qrcode.value} />
    //         </div>
    //       ),
    //     })
    //   },
    // },
    {
      title: '复制页面',
      icon: DocumentCopy,
      onClick: () => {
        ElMessage({
          showClose: true,
          type: 'info',
          duration: 2000,
          message: '敬请期待！',
        })
      },
    },
    {
      title: '撤销',
      icon: RefreshLeft,
      onClick: () => {
        ElMessage({
          showClose: true,
          type: 'info',
          duration: 2000,
          message: '敬请期待！',
        })
      },
    },
    {
      title: '重做',
      icon: RefreshRight,
      onClick: () => {
        ElMessage({
          showClose: true,
          type: 'info',
          duration: 2000,
          message: '敬请期待！',
        })
      },
    },
    {
      title: '清空页面',
      icon: Delete,
      onClick: () => {
        ElMessage({
          showClose: true,
          type: 'info',
          duration: 2000,
          message: '敬请期待！',
        })
      },
    },
    {
      title: '预览',
      icon: Position,
      onClick: () => {
        // localStorage.setItem(localKey, JSON.stringify(jsonData))
        const pageJson = usePageJson()
        pageJson.value = jsonData as VisualEditorModelValue
        // 离开页面前手动调用一次setLocal
        setLocal(localKey)
        window.open(location.href.replace('/#/', '/preview/#/'))
      },
    },
    {
      title: '反馈',
      icon: ChatLineSquare,
      onClick: () => {
        window.open('https://github.com/buqiyuan/vite-vue3-lowcode/issues/new')
      },
    },
  ]
}
