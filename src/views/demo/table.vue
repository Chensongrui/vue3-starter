<script setup lang='ts'>
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

import UserEditDialog from './components/UserEditDialog.vue'
import type { UserFormPayload, UserRow } from './types'
import { useUsersStore } from '@/store/modules/users'

const usersStore = useUsersStore()

// 搜索与分页
const keyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 弹窗状态：editingId 为 null 表示新增
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)

// 多选
const selectedRows = ref<UserRow[]>([])

const filteredData = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return usersStore.list
  return usersStore.list.filter(
    (item) =>
      item.name.toLowerCase().includes(kw) ||
      item.email.toLowerCase().includes(kw) ||
      item.phone.includes(kw)
  )
})

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

/** 删除后当前页可能已无数据，往前退一页 */
function fixPage(total: number) {
  const maxPage = Math.max(1, Math.ceil(total / pageSize.value))
  if (currentPage.value > maxPage) currentPage.value = maxPage
}

function handleSearch() {
  currentPage.value = 1
}

function handleReset() {
  keyword.value = ''
  currentPage.value = 1
}

function handleAdd() {
  editingId.value = null
  dialogVisible.value = true
}

function handleEdit(row: UserRow) {
  editingId.value = row.id
  dialogVisible.value = true
}

/** 新增 / 编辑统一提交入口 */
function handleSubmit(payload: UserFormPayload) {
  if (payload.id) {
    usersStore.updateUser(payload.id, payload)
    ElMessage.success('编辑成功')
  } else {
    usersStore.addUser(payload)
    currentPage.value = 1
    ElMessage.success('新增成功')
  }
}

function handleDelete(row: UserRow) {
  ElMessageBox.confirm(`确定删除「${row.name}」吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      usersStore.removeUser(row.id)
      fixPage(filteredData.value.length)
      ElMessage.success('删除成功')
    })
    .catch(() => {
    })
}

function handleBatchDelete() {
  if (!selectedRows.value.length) return
  const ids = selectedRows.value.map((item) => item.id)
  ElMessageBox.confirm(`确定删除选中的 ${ids.length} 位用户吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      usersStore.removeBatch(ids)
      selectedRows.value = []
      fixPage(filteredData.value.length)
      ElMessage.success('删除成功')
    })
    .catch(() => {
    })
}

function handleSelectionChange(rows: UserRow[]) {
  selectedRows.value = rows
}
</script>

<template>
  <div class='page-container demo-table'>
    <el-card shadow='never'>
      <template #header>
        <div class='card-header'>
          <span class='card-title'>表格示例</span>
          <span class='card-tip'>演示 el-table + 搜索 + 分页 + 新增/编辑/删除</span>
        </div>
      </template>

      <!-- 搜索与操作区 -->
      <div class='toolbar'>
        <div class='toolbar-left'>
          <el-input
            v-model='keyword'
            placeholder='搜索姓名 / 邮箱 / 手机号'
            clearable
            class='search-input'
            @keyup.enter='handleSearch'
          >
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
          <el-button type='primary' @click='handleSearch'>搜索</el-button>
          <el-button @click='handleReset'>重置</el-button>
        </div>
        <div class='toolbar-right'>
          <el-button type='primary' @click='handleAdd'>新增用户</el-button>
          <el-button
            type='danger'
            plain
            :disabled='!selectedRows.length'
            @click='handleBatchDelete'
          >
            批量删除
          </el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        :data='pagedData'
        border
        stripe
        style='width: 100%'
        @selection-change='handleSelectionChange'
      >
        <el-table-column type='selection' width='50' />
        <el-table-column type='index' label='#' width='60' />
        <el-table-column prop='name' label='姓名' min-width='120' />
        <el-table-column prop='email' label='邮箱' min-width='200' />
        <el-table-column prop='phone' label='手机号' min-width='140' />
        <el-table-column prop='role' label='角色' width='100' />
        <el-table-column label='状态' width='100'>
          <template #default='{ row }'>
            <el-tag :type="row.status === '启用' ? 'success' : 'danger'" size='small'>
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop='createTime' label='创建时间' min-width='160' />
        <el-table-column label='操作' width='150' fixed='right'>
          <template #default='{ row }'>
            <el-button link type='primary' @click='handleEdit(row as UserRow)'>编辑</el-button>
            <el-button link type='danger' @click='handleDelete(row as UserRow)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class='pagination'>
        <el-pagination
          v-model:current-page='currentPage'
          v-model:page-size='pageSize'
          :total='filteredData.length'
          :page-sizes='[10, 20, 50]'
          layout='total, sizes, prev, pager, next, jumper'
          background
        />
      </div>
    </el-card>

    <!-- 新增 / 编辑弹窗 -->
    <UserEditDialog v-model='dialogVisible' :id='editingId' @submit='handleSubmit' />
  </div>
</template>

<style scoped lang='scss'>
.demo-table {
  .card-header {
    display: flex;
    align-items: baseline;
    gap: 12px;

    .card-title {
      font-weight: 600;
    }

    .card-tip {
      color: #909399;
      font-size: 13px;
    }
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;

    .toolbar-left,
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .search-input {
      width: 260px;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
</style>
