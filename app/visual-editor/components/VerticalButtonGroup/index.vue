<script setup lang="ts">
import { ElButtonGroup } from 'element-plus'

/**
 * 垂直按钮组
 * Element官方的按钮组只支持水平显示，通过重写样式实现垂直布局
 */
defineOptions({ name: 'VerticalButtonGroup' })
</script>

<template>
  <ElButtonGroup v-bind="$attrs">
    <slot />
  </ElButtonGroup>
</template>

<style scoped lang="scss">
  $borderRadiusBase: var(--el-border-radius-base);
  $buttonDivideBorderColor: var(--el-button-divide-border-color);

  .el-button-group {
    display: inline-flex;
    flex-direction: column;
    background-color: #fff;
  }

  .el-button-group > :deep(.el-button:first-child) {
    border-bottom-color: $buttonDivideBorderColor;
    border-top-right-radius: $borderRadiusBase;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .el-button-group > :deep(.el-button:last-child) {
    border-top-color: $buttonDivideBorderColor;
    border-top-right-radius: 0;
    border-bottom-left-radius: $borderRadiusBase;
    border-top-left-radius: 0;
  }

  .el-button-group :deep(.el-button--primary:not(:first-child, :last-child)) {
    border-top-color: $buttonDivideBorderColor;
    border-bottom-color: $buttonDivideBorderColor;
  }

  .el-button-group > :deep(.el-button:not(:last-child)) {
    margin-right: 0;
    margin-bottom: -1px;
  }
</style>
