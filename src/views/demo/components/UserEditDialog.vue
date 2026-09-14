<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ROLE_OPTIONS } from '../types'
import type { UserFormPayload, UserRow, UserStatus } from '../types'
import { useUsersStore } from '@/store/modules/users'

const usersStore = useUsersStore()

/** 传入 null 表示新增，传入 id 表示编辑（弹窗按 id 自行查行数据回填） */
const props = defineProps<{
  id: number | null
}>()

/** 弹窗显示/隐藏，父组件用 v-model 绑定 */
const visible = defineModel<boolean>({ required: true})

const emit = defineEmits<{
  submit: [payload: UserFormPayload]
}>()

interface FormModel {
  id?: number
  name: string
  email: string
  phone: string
  role: string
  status: UserStatus
}

const formRef = ref<FormInstance>()

function createEmptyForm(): FormModel {
  return { id: undefined, name: '', email: '', phone: '', role: '', status: '启用' }
}

const form = reactive<FormModel>(createEmptyForm())

const rules: FormRules<FormModel> = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const isEdit = computed(() => props.id !== null)

// 每次打开：编辑时按 id 从 store 查行回填，新增时清空
watch(visible, async (open) => {
  if (!open) return
  if (props.id != null) {
    const row = usersStore.getUserById(props.id)
    if (row) {
      const { id, name, email, phone, role, status } = row
      Object.assign(form, { id, name, email, phone, role, status })
    }
  } else {
    Object.assign(form, createEmptyForm())
  }
  await nextTick()
  formRef.value?.clearValidate()
})

async function handleConfirm() {
  // 校验失败时 validate() 会 reject，这里兜住并返回 false
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  emit('submit', { ...form })
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑用户' : '新增用户'"
    width="480px"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" clearable />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" clearable />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="请输入手机号（选填）"
          clearable
          maxlength="11"
        />
      </el-form-item>

      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
          <el-option v-for="item in ROLE_OPTIONS" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio value="启用">启用</el-radio>
          <el-radio value="禁用">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>
