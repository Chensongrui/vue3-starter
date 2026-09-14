import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserFormPayload, UserRow } from '@/views/demo/types'

/** 生成 YYYY-MM-DD HH:mm 格式的当前时间 */
function formatNow() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/**
 * 用户列表状态：表格示例的本地 mock 数据与增删改逻辑。
 *
 * 把数据与操作下沉到这里后，「用户编辑弹窗」只需拿到 id，
 * 即可通过 getUserById 自行查到整行数据来回填表单，无需父组件传递整行对象。
 */
export const useUsersStore = defineStore('users', () => {
  // state：用户列表（原 table.vue 的 allData）
  const list = ref<UserRow[]>(
    Array.from({ length: 26 }).map((_, i) => ({
      id: i + 1,
      name: `用户 ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `13${String(100000000 + i).slice(0, 9)}`,
      role: ['管理员', '编辑', '访客'][i % 3],
      status: i % 4 === 0 ? '禁用' : '启用',
      createTime: `2026-0${(i % 9) + 1}-1${i % 9} 10:00`
    }))
  )

  // getter：按 id 查行
  function getUserById(id: number): UserRow | undefined {
    return list.value.find((item) => item.id === id)
  }

  // action：新增
  function addUser(payload: UserFormPayload) {
    const nextId = Math.max(0, ...list.value.map((item) => item.id)) + 1
    list.value.unshift({
      id: nextId,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      status: payload.status,
      createTime: formatNow()
    })
  }

  // action：编辑（按 id 合并）
  function updateUser(id: number, payload: UserFormPayload) {
    const idx = list.value.findIndex((item) => item.id === id)
    if (idx > -1) {
      list.value[idx] = { ...list.value[idx], ...payload, id }
    }
  }

  // action：删除单条
  function removeUser(id: number) {
    list.value = list.value.filter((item) => item.id !== id)
  }

  // action：批量删除
  function removeBatch(ids: number[]) {
    list.value = list.value.filter((item) => !ids.includes(item.id))
  }

  return { list, getUserById, addUser, updateUser, removeUser, removeBatch }
})
