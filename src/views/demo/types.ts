/** 用户状态 */
export type UserStatus = '启用' | '禁用'

/** 表格行 / 用户实体 */
export interface UserRow {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: UserStatus
  createTime: string
}

/** 新增 / 编辑弹窗提交的数据（新增时没有 id） */
export type UserFormPayload = Omit<UserRow, 'id' | 'createTime'> & { id?: number }

/** 角色下拉选项 */
export const ROLE_OPTIONS = ['管理员', '编辑', '访客']
