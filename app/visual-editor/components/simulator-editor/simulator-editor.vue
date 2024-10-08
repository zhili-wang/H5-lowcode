<script lang="tsx" setup>
import type { VisualEditorBlockData } from '@/visual-editor/visual-editor.utils'
// import MonacoEditor from '@/visual-editor/components/common/monaco-editor/MonacoEditor'
import JsonEditor from '@/visual-editor/components/common/JsonEditor/index.vue'
import VerticalButtonGroup from '@/visual-editor/components/VerticalButtonGroup/index.vue'
import { useModal } from '@/visual-editor/hooks/useModal'
import { useVisualData } from '@/visual-editor/hooks/useVisualData'
import { generateNanoid } from '@/visual-editor/utils'
import { $$dropdown, DropdownOption } from '@/visual-editor/utils/dropdown-service'
import { ElButton } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { ref, watchEffect } from 'vue'
import { useGlobalProperties } from '~/hooks/useGlobalProperties'
import CompRender from './comp-render'
import DraggableTransitionGroup from './draggable-transition-group.vue'
import SlotItem from './slot-item.vue'

defineOptions({
  name: 'SimulatorEditor',
})

const { currentPage, setCurrentBlock } = useVisualData()

const { globalProperties } = useGlobalProperties()

const drag = ref(false)

/**
 * @description 操作当前页面样式表
 */
watchEffect(() => {
  const { bgImage, bgColor } = currentPage.value.config
  const bodyStyleStr = `
      .simulator-editor-content {
        background-color: ${bgColor};
        background-image: url(${bgImage});
      }`
  const styleSheets = document.styleSheets[0]
  const firstCssRule = document.styleSheets[0].cssRules[0]
  const isExistContent = firstCssRule.cssText.includes('.simulator-editor-content')
  if (isExistContent) {
    styleSheets.deleteRule(0)
  }
  styleSheets.insertRule(bodyStyleStr)
})

// 递归实现
// @leafId  为你要查找的id，
// @nodes   为原始Json数据
// @path    供递归使用，不要赋值
function findPathByLeafId(leafId, nodes: VisualEditorBlockData[] = [], path: VisualEditorBlockData[] = []) {
  for (let i = 0; i < nodes.length; i++) {
    const tmpPath = path.concat()
    tmpPath.push(nodes[i])
    if (leafId == nodes[i]._vid) {
      return tmpPath
    }
    const slots = nodes[i].props?.slots || {}
    const keys = Object.keys(slots)
    for (let j = 0; j < keys.length; j++) {
      const children = slots[keys[j]]?.children
      if (children) {
        const findResult = findPathByLeafId(leafId, children, tmpPath)
        if (findResult) {
          return findResult
        }
      }
    }
  }
}

// 给当前点击的组件设置聚焦
function handleSlotsFocus(block: VisualEditorBlockData, _vid: string) {
  const slots = block.props?.slots || {}
  if (Object.keys(slots).length > 0) {
    Object.keys(slots).forEach((key) => {
      slots[key]?.children?.forEach((item) => {
        item.focusWithChild = false
        item.focus = item._vid == _vid
        if (item.focus) {
          const arr = findPathByLeafId(_vid, currentPage.value.blocks)
          arr.forEach(n => (n.focusWithChild = true))
        }
        if (Object.keys(item.props?.slots || {}).length) {
          handleSlotsFocus(item, _vid)
        }
      })
    })
  }
}

// 选择要操作的组件
function selectComp(element: VisualEditorBlockData) {
  setCurrentBlock(element)
  currentPage.value.blocks.forEach((block) => {
    block.focus = element._vid == block._vid
    block.focusWithChild = false
    handleSlotsFocus(block, element._vid)
    element.focusWithChild = false
  })
}

/**
 * 删除组件
 * @param block
 * @param parentBlocks
 */
function deleteComp(block: VisualEditorBlockData, parentBlocks = currentPage.value.blocks) {
  console.log(block, 'block')
  const index = parentBlocks.findIndex(item => item._vid == block._vid)
  if (index != -1) {
    delete globalProperties.$$refs[parentBlocks[index]._vid]
    const delTarget = parentBlocks.splice(index, 1)[0]
    if (delTarget.focus) {
      setCurrentBlock({} as VisualEditorBlockData)
    }
  }
}
/**
 * 复制组件
 * @param block
 * @param parentBlocks
 */
function copyComp(block: VisualEditorBlockData, parentBlocks = currentPage.value.blocks) {
  const index = parentBlocks.findIndex(item => item._vid == block._vid)
  if (index != -1) {
    const setBlockVid = (block: VisualEditorBlockData) => {
      block._vid = `vid_${generateNanoid()}`
      block.focus = false
      const slots = block?.props?.slots || {}
      const slotKeys = Object.keys(slots)
      if (slotKeys.length) {
        slotKeys.forEach((slotKey) => {
          slots[slotKey]?.children?.forEach(child => setBlockVid(child))
        })
      }
    }
    const blockCopy = cloneDeep(parentBlocks[index])
    setBlockVid(blockCopy)
    parentBlocks.splice(index + 1, 0, blockCopy)
  }
}
/**
 * 查看节点
 * @param block
 */
function viewNodeInfo(block: VisualEditorBlockData) {
  useModal({
    title: '节点信息',
    footer: null,
    props: {
      width: 600,
      center: true,
    },
    content: () => (
      <JsonEditor
        code={JSON.stringify(block)}
        layout={{ width: 530, height: 540 }}
        vid={block._vid}
      />
    ),
  })
}

function onContextmenuBlock(e: MouseEvent, block: VisualEditorBlockData, parentBlocks = currentPage.value.blocks) {
  $$dropdown({
    reference: e,
    content: () => (
      <>
        <DropdownOption
          label="复制节点"
          icon="el-icon-document-copy"
          {...{
            onClick: () => copyComp(block, parentBlocks),
          }}
        />
        <DropdownOption
          label="查看节点"
          icon="el-icon-view"
          {...{
            onClick: () => viewNodeInfo(block),
          }}
        />
        <DropdownOption
          label="删除节点"
          icon="el-icon-delete"
          {...{
            onClick: () => deleteComp(block, parentBlocks),
          }}
        />
      </>
    ),
  })
}
</script>

<template>
  <div class="simulator-container">
    <div class="simulator-editor">
      <div class="simulator-editor-content">
        <DraggableTransitionGroup
          v-model:drag="drag"
          v-model="currentPage.blocks"
          class="!min-h-680px"
          draggable=".item-drag"
        >
          <template #item="{ element: outElement }">
            <div
              class="list-group-item"
              :data-label="outElement.label"
              :class="{
                focus: outElement.focus,
                focusWithChild: outElement.focusWithChild,
                drag,
                ['has-slot']: !!Object.keys(outElement.props.slots || {}).length,
              }"
              @mousedown="selectComp(outElement)"
            >
              <!-- @contextmenu.stop.prevent="onContextmenuBlock($event, outElement)" -->
              <CompRender
                :key="outElement._vid"
                :element="outElement"
                :style="{
                  pointerEvents: Object.keys(outElement.props?.slots || {}).length
                    ? 'auto'
                    : 'none',
                }"
              >
                <template
                  v-for="(value, slotKey) in outElement.props?.slots"
                  :key="slotKey"
                  #[slotKey]
                >
                  <SlotItem
                    v-model:children="value.children"
                    v-model:drag="drag"
                    :slot-key="slotKey"
                    :on-contextmenu-block="onContextmenuBlock"
                    :select-comp="selectComp"
                    :delete-comp="deleteComp"
                  />
                </template>
              </CompRender>
              <!-- 右侧：组件操作工具栏 -->
              <div v-if="outElement.focus" class="component-toolbar">
                <VerticalButtonGroup type="primary">
                  <!-- <el-tooltip content="复制" placement="right">
                    <el-button color="#006eff" @click.stop="handleCopyComponent()">
                      <Icon name="ep:copy-document" />
                    </el-button>
                  </el-tooltip> -->
                  <ElButton color="#006eff" @click.stop="copyComp(outElement)">
                    复制
                  </ElButton>
                  <ElButton color="#006eff" @click.stop="viewNodeInfo(outElement)">
                    查看
                  </ElButton>
                  <ElButton color="#006eff" @click.stop="deleteComp(outElement)">
                    删除
                  </ElButton>
                </VerticalButtonGroup>
              </div>
            </div>
          </template>
        </DraggableTransitionGroup>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import './func.scss';

  .simulator-container {
    display: flex;
    width: 100%;
    height: 100%;
    padding-right: 380px;
    align-items: center;
    justify-content: center;

    @media (max-width: 1114px) {
      padding-right: 0;
    }
  }

  .simulator-editor {
    width: 660px;
    height: 740px;
    min-width: 660px;
    padding: 60px 150px 0;
    overflow: hidden auto;
    background: #fafafa;
    border-radius: 5px;
    box-sizing: border-box;
    background-clip: content-box;
    contain: layout;

    &::-webkit-scrollbar {
      width: 0;
    }

    &-content {
      min-height: 100%;
      transform: translate(0);
      box-shadow: 0 8px 12px #ebedf0;
    }
  }

  .list-group-item {
    position: relative;
    padding: 3px;
    cursor: move;

    > div {
      position: relative;
    }

    &.focus {
      @include showComponentBorder;
    }

    &.drag::after {
      display: none;
    }

    &:not(.has-slot) {
      content: '';
    }

    &.focusWithChild {
      @include showContainerBorder;
    }

    i {
      cursor: pointer;
    }

    /* 右侧：组件操作工具栏 */
    .component-toolbar {
      position: absolute;
      top: 0;
      right: -5px;
      transform: translate(100%, 0);

      /* 左侧小三角 */
      &::before {
        position: absolute;
        top: 10px;
        left: -10px;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-right-color: #2d8cf0;
        content: ' ';
      }
    }
  }
</style>
