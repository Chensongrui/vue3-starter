import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { ElMessage } from 'element-plus'

/** vxe 表格实例的最小契约，避免 composable 与 vxe 内部类型强耦合 */
interface VxeTableLike {
  getColumns: () => Array<{ field?: string | null; type?: string | null }>
  getCheckboxRecords?: (isFull?: boolean) => unknown[]
  updateData?: () => Promise<void>
}

interface ActiveCell {
  row: Record<string, unknown>
  field: string
}

export interface UseVxeClipboardOptions {
  /** 只允许写入这些字段；不传时按表格列的先后顺序写入 */
  fields?: string[]
}

/**
 * 给 vxe-table 补上「Excel 复制粘贴」能力
 *
 * 背景：vxe-table 的单元格区域框选 / 复制粘贴（clipConfig）属于企业版付费功能，
 * 免费版没有。这里用原生剪贴板事件做一个轻量兜底，覆盖最高频的场景：
 * - 从 Excel 复制一片区域 -> 点住起始单元格 -> Ctrl+V 批量写入
 * - Ctrl+C 复制勾选的行（没勾选则复制当前单元格所在行）
 *
 * 注意：监听挂在 document 上，靠 activeCell 判断是不是本表格，
 * 所以同一页面多个表格各用一次本 composable 也不会串。
 */
export function useVxeClipboard(
  tableRef: Ref<unknown>,
  rows: Ref<Record<string, unknown>[]>,
  options: UseVxeClipboardOptions = {}
) {
  const activeCell = ref<ActiveCell | null>(null)

  /** 可写入的字段列表：优先用白名单，否则取表格里有 field 的普通列 */
  function getWritableFields(table: VxeTableLike): string[] {
    if (options.fields?.length) return options.fields
    return table
      .getColumns()
      .filter((column) => !column.type && column.field)
      .map((column) => column.field as string)
  }

  /** 点击单元格时记录起始位置 */
  function handleCellClick(params: {
    row: Record<string, unknown>
    column: { field?: string | null }
  }) {
    if (!params.column.field) return
    activeCell.value = { row: params.row, field: params.column.field }
  }

  function writeText(text: string): Promise<void> {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
    // 非安全上下文（http）下的兜底
    return new Promise((resolve, reject) => {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (ok) {
        resolve()
      } else {
        reject(new Error('复制失败'))
      }
    })
  }

  function handleCopy() {
    const table = tableRef.value as VxeTableLike | undefined
    if (!table) return

    const fields = getWritableFields(table)
    if (!fields.length) return

    const checked = (table.getCheckboxRecords?.() ?? []) as Record<string, unknown>[]
    const target = checked.length ? checked : activeCell.value ? [activeCell.value.row] : []
    if (!target.length) {
      ElMessage.warning('请先勾选行，或点击一个单元格')
      return
    }

    const tsv = target
      .map((row) => fields.map((field) => String(row[field] ?? '')).join('\t'))
      .join('\n')
    writeText(tsv)
      .then(() => ElMessage.success(`已复制 ${target.length} 行到剪贴板`))
      .catch(() => ElMessage.error('复制失败，请检查浏览器剪贴板权限'))
  }

  function handlePaste(event: ClipboardEvent) {
    if (!activeCell.value) return

    const text = event.clipboardData?.getData('text/plain')
    if (!text) return

    const table = tableRef.value as VxeTableLike | undefined
    if (!table) return

    const fields = getWritableFields(table)
    const startCol = fields.indexOf(activeCell.value.field)
    if (startCol < 0) return

    const startRow = rows.value.indexOf(activeCell.value.row)
    if (startRow < 0) return

    const matrix = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n$/, '')
      .split('\n')
      .map((line) => line.split('\t'))

    event.preventDefault()

    let count = 0
    matrix.forEach((cells, rowOffset) => {
      const row = rows.value[startRow + rowOffset]
      if (!row) return
      cells.forEach((value, colOffset) => {
        const field = fields[startCol + colOffset]
        if (!field) return
        row[field] = value
        count += 1
      })
    })

    if (!count) return
    // 通知表格刷新（虚拟滚动下必须，否则视口外回切可能不更新）
    table.updateData?.()
    ElMessage.success(`已粘贴 ${count} 个单元格`)
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!(event.ctrlKey || event.metaKey)) return
    if (event.key.toLowerCase() !== 'c') return
    handleCopy()
  }

  onMounted(() => {
    document.addEventListener('paste', handlePaste)
    document.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('paste', handlePaste)
    document.removeEventListener('keydown', handleKeydown)
  })

  return { activeCell, handleCellClick, handleCopy }
}

export default useVxeClipboard
