import VxeUI from 'vxe-pc-ui'

/**
 * vxe-table 全局配置
 *
 * 与 Element Plus 共存时有两处必须对齐，否则会出现明显的视觉/交互问题：
 * 1. 尺寸命名不同：Element Plus 是 large / default / small，vxe 是 medium / small / mini
 * 2. 弹层层级：vxe 的下拉、校验提示必须盖在 Element Plus 弹窗之上
 */
VxeUI.setConfig({
  size: 'small', // 对齐 Element Plus 的 default
  zIndex: 4096 // 高于 Element Plus 弹窗默认层级（2000 起）
})

/** Element Plus 尺寸 -> vxe 尺寸 */
export const epToVxeSize = (size: 'large' | 'default' | 'small') =>
  (({ large: 'medium', default: 'small', small: 'mini' }) as const)[size]

export default VxeUI
