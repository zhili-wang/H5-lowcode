import {
  defineConfig,
  // presetAttributify,
  // presetIcons,
  presetTypography,
  presetUno,
  // presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
    // presetAttributify(),
    // presetIcons({
    //   scale: 1.2,
    // }),
    // presetWebFonts({
    //   fonts: {
    //     sans: 'DM Sans',
    //     serif: 'DM Serif Display',
    //     mono: 'DM Mono',
    //   },
    // }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  rules: [
    // 颜色简写  color-#fff  c-#fff  或者用 rgb(45, 183, 245) hsl(102, 53%, 61%) hwb(205 6% 9%)
    [/^(?:c|color)-((?:#|rgb|hsl|hwb).+)$/gm, ([_, color]) => ({ color })],
    [/^(?:bg|background-color)-((?:#|rgb|hsl|hwb).+)$/gm, ([_, color]) => ({ 'background-color': color })],
  ],
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
    {
      'wh-full': 'w-full h-full',
      'full-screen-w': 'w-100vw ml-[calc(-50vw+50%)]',
    },
    // flex
    {
      /** flex 水平垂直居中 */
      'flex-center': 'flex items-center justify-center',
      /** flex 垂直布局 */
      'flex-column': 'flex flex-col',
    },
    // position
    {
      /** 绝对定位水平居中 */
      'absolute-h-center': 'absolute left-50% -translate-x-50%',
      /** 绝对定位垂直居中 */
      'absolute-v-center': 'absolute top-50% -translate-y-50%',
      /** 绝对定位垂直水平居中 */
      'absolute-vh-center': 'absolute-h-center absolute-v-center',
    },
    // color
    {
      /** 主色 */
      'primary-color': 'c-#568af3',
    },
    // dom
    {
      /** 文字链接悬浮 */
      'primary-text-hover': 'cursor-pointer hover:primary-color no-underline hover:underline',
    },
    // font-size
    [/^fs-(.*)$/, ([, c]) => `font-size-${c}`],
  ],
})
