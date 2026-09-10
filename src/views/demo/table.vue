<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

interface UserRow {
  id: number
  name: string
  email: string
  role: string
  status: '启用' | '禁用'
  createTime: string
}

// 模拟数据
const allData = ref<UserRow[]>(
  Array.from({ length: 26 }).map((_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ['管理员', '编辑', '访客'][i % 3],
    status: i % 4 === 0 ? '禁用' : '启用',
    createTime: `2026-0${(i % 9) + 1}-1${i % 9} 10:00`
  }))
)

// 搜索与分页
const keyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const filteredData = computed(() =>
  allData.value.filter(
    (item) => item.name.includes(keyword.value) || item.email.includes(keyword.value)
  )
)

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

function handleSearch() {
  currentPage.value = 1
}

function handleReset() {
  keyword.value = ''
  currentPage.value = 1
}

function handleDelete(row: UserRow) {
  ElMessageBox.confirm(`确定删除「${row.name}」吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      allData.value = allData.value.filter((item) => item.id !== row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

function handleEdit(row: UserRow) {
  ElMessage.info(`编辑：${row.name}`)
}
</script>

<template>
  <div class="page-container demo-table">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">表格示例</span>
          <span class="card-tip">演示 el-table + 搜索 + 分页 + 操作列</span>
        </div>
      </template>

      <!-- 搜索区 -->
      <div class="toolbar">
        <el-input
          v-model="keyword"
          placeholder="搜索姓名 / 邮箱"
          clearable
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <!-- 表格 -->
      <el-table :data="pagedData" border stripe style="width: 100%">
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="name" label="姓名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column prop="role" label="角色" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'danger'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row as UserRow)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row as UserRow)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredData.length"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
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
    gap: 10px;
    margin-bottom: 16px;

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
