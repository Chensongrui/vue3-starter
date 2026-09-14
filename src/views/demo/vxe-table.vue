<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { VxeTableInstance } from 'vxe-table'

import { useVxeClipboard } from '@/composables/useVxeClipboard'

type UserRow = {
  id: number
  name: string
  dept: string
  role: string
  phone: string
  email: string
  city: string
  salary: number
  status: string
  joinDate: string
}

type DeptNode = {
  id: number
  name: string
  manager: string
  headcount: number
  children?: DeptNode[]
}

type SalaryRow = {
  name: string
  dept: string
  base: number
  bonus: number
}

const DEPTS = ['研发部', '市场部', '财务部', '运营部', '人事部']
const ROLES = ['管理员', '编辑', '访客']
const CITIES = ['北京', '上海', '广州', '深圳', '杭州', '成都']

/* ===== 场景一：2000 行大数据，虚拟滚动 + 左右固定列 ===== */
const bigList = ref<UserRow[]>(
  Array.from({ length: 2000 }, (_, i) => ({
    id: i + 1,
    name: `员工 ${i + 1}`,
    dept: DEPTS[i % DEPTS.length],
    role: ROLES[i % ROLES.length],
    phone: `13${String(100000000 + i).slice(0, 9)}`,
    email: `user${i + 1}@example.com`,
    city: CITIES[i % CITIES.length],
    salary: 8000 + (i % 20) * 1500,
    status: i % 5 === 0 ? '禁用' : '启用',
    joinDate: `202${i % 5}-0${(i % 9) + 1}-1${i % 9}`
  }))
)

const bigTableRef = ref<VxeTableInstance>()
const { handleCellClick: onBigCellClick, handleCopy: copyBigRows } = useVxeClipboard(
  bigTableRef,
  bigList
)

function handleExportCsv() {
  bigTableRef.value?.exportData({ type: 'csv', filename: '员工数据' })
}

function handleOpenExport() {
  bigTableRef.value?.openExport()
}

/* ===== 场景二：行内编辑 + 数据校验 ===== */
const editList = ref<UserRow[]>(
  Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: `员工 ${i + 1}`,
    dept: DEPTS[i % DEPTS.length],
    role: ROLES[i % ROLES.length],
    phone: `13${String(100000000 + i).slice(0, 9)}`,
    email: `user${i + 1}@example.com`,
    city: CITIES[i % CITIES.length],
    salary: 9000 + i * 500,
    status: '启用',
    joinDate: `2024-0${(i % 9) + 1}-1${i % 9}`
  }))
)

const editTableRef = ref<VxeTableInstance>()

/** 校验规则：content 是提示文案（message 已废弃） */
const editRules = {
  name: [{ required: true, content: '姓名不能为空' }],
  email: [
    { required: true, content: '邮箱不能为空' },
    { pattern: /^[\w.+-]+@[\w-]+\.[\w.]+$/, content: '邮箱格式不正确' }
  ],
  salary: [
    {
      validator: ({ cellValue }: { cellValue: number }) => {
        if (Number(cellValue) < 3000) return new Error('薪资不能低于 3000')
      }
    }
  ]
}

/** validate() 通过时 resolve，不通过时 reject，两种都要处理 */
async function handleValidate() {
  try {
    const errMap = await editTableRef.value?.validate(true)
    if (errMap && Object.keys(errMap).length) {
      ElMessage.error(`有 ${Object.keys(errMap).length} 行校验不通过`)
      return
    }
    ElMessage.success('校验通过')
  } catch (errMap) {
    const count = Object.keys((errMap ?? {}) as object).length
    ElMessage.error(`有 ${count} 行校验不通过`)
  }
}

function handleEditReset() {
  editTableRef.value?.clearValidate()
  ElMessage.info('已清除校验状态')
}

/* ===== 场景三：树形表格 ===== */
const treeData = ref<DeptNode[]>([
  {
    id: 1,
    name: '技术中心',
    manager: '张三',
    headcount: 128,
    children: [
      { id: 11, name: '前端组', manager: '李四', headcount: 42 },
      { id: 12, name: '后端组', manager: '王五', headcount: 56 },
      {
        id: 13,
        name: '测试组',
        manager: '赵六',
        headcount: 30,
        children: [
          { id: 131, name: '自动化测试', manager: '孙七', headcount: 12 },
          { id: 132, name: '性能测试', manager: '周八', headcount: 18 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '市场中心',
    manager: '吴九',
    headcount: 64,
    children: [
      { id: 21, name: '品牌组', manager: '郑十', headcount: 24 },
      { id: 22, name: '渠道组', manager: '冯一', headcount: 40 }
    ]
  }
])

/* ===== 场景四：多级表头 + 合并单元格 ===== */
const salaryList = ref<SalaryRow[]>([
  { name: '员工 1', dept: '研发部', base: 12000, bonus: 3000 },
  { name: '员工 1', dept: '研发部', base: 12000, bonus: 2000 },
  { name: '员工 3', dept: '市场部', base: 9000, bonus: 2500 },
  { name: '员工 4', dept: '市场部', base: 9500, bonus: 2800 },
  { name: '员工 5', dept: '财务部', base: 10000, bonus: 1500 }
])

/** 合并规则：row/col 为起始行列下标，rowspan/colspan 为跨度 */
const mergeCells = [
  { row: 0, col: 0, rowspan: 2, colspan: 1 },
  { row: 2, col: 1, rowspan: 2, colspan: 1 }
]
</script>

<template>
  <div class="page-container vxe-demo">
    <!-- 场景一：虚拟滚动 + 固定列 -->
    <el-card shadow="never" class="demo-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">场景一 · 虚拟滚动 + 固定列</span>
          <span class="card-tip">
            2000 行数据常驻内存，只渲染可视区域。左侧「姓名」和右侧「操作」均为固定列。
          </span>
        </div>
      </template>

      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" size="small" @click="handleExportCsv">导出 CSV</el-button>
          <el-button size="small" @click="handleOpenExport">打开导出面板</el-button>
          <el-button size="small" @click="copyBigRows">复制勾选行</el-button>
        </div>
        <div class="toolbar-right">
          <span class="hint"> 从 Excel 复制一片区域 → 点住起始单元格 → Ctrl+V 批量写入 </span>
        </div>
      </div>

      <vxe-table
        ref="bigTableRef"
        :data="bigList"
        :export-config="{ types: ['csv', 'html'] }"
        :scroll-y="{ enabled: true, gt: 0 }"
        :row-config="{ keyField: 'id' }"
        height="380"
        border
        stripe
        @cell-click="onBigCellClick"
      >
        <vxe-column type="checkbox" width="50" fixed="left" />
        <vxe-column type="seq" title="#" width="60" fixed="left" />
        <vxe-column field="name" title="姓名" width="120" fixed="left" />
        <vxe-column field="dept" title="部门" width="120" />
        <vxe-column field="role" title="角色" width="100" />
        <vxe-column field="phone" title="手机号" width="140" />
        <vxe-column field="email" title="邮箱" width="200" />
        <vxe-column field="city" title="城市" width="100" />
        <vxe-column field="salary" title="月薪" width="110" align="right" />
        <vxe-column field="joinDate" title="入职日期" width="130" />
        <vxe-column field="status" title="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'danger'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="ElMessage.info(`查看 ${row.name}`)">
              查看
            </el-button>
          </template>
        </vxe-column>
      </vxe-table>
    </el-card>

    <!-- 场景二：行内编辑 + 校验 -->
    <el-card shadow="never" class="demo-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">场景二 · 行内编辑 + 数据校验</span>
          <span class="card-tip">
            点击单元格直接编辑，编辑器用的是 Element Plus 的 el-input / el-select /
            el-input-number，演示两套库如何混用。
          </span>
        </div>
      </template>

      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" size="small" @click="handleValidate">校验全部</el-button>
          <el-button size="small" @click="handleEditReset">清除校验</el-button>
        </div>
        <div class="toolbar-right">
          <span class="hint">试着把姓名清空、邮箱改错、薪资改成 1000，再点「校验全部」</span>
        </div>
      </div>

      <vxe-table
        ref="editTableRef"
        :data="editList"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
        :edit-rules="editRules"
        :row-config="{ keyField: 'id' }"
        border
      >
        <vxe-column type="seq" title="#" width="60" />
        <vxe-column field="name" title="姓名" width="140" :edit-render="{}">
          <template #edit="{ row }">
            <el-input v-model="row.name" size="small" placeholder="请输入姓名" />
          </template>
        </vxe-column>
        <vxe-column field="email" title="邮箱" width="220" :edit-render="{}">
          <template #edit="{ row }">
            <el-input v-model="row.email" size="small" placeholder="请输入邮箱" />
          </template>
        </vxe-column>
        <vxe-column field="role" title="角色" width="140" :edit-render="{}">
          <template #edit="{ row }">
            <el-select v-model="row.role" size="small">
              <el-option v-for="item in ROLES" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </vxe-column>
        <vxe-column field="salary" title="月薪" width="160" :edit-render="{}">
          <template #edit="{ row }">
            <el-input-number v-model="row.salary" :min="0" :step="500" size="small" />
          </template>
        </vxe-column>
        <vxe-column field="dept" title="部门" min-width="120" />
      </vxe-table>
    </el-card>

    <!-- 场景三：树形表格 -->
    <el-card shadow="never" class="demo-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">场景三 · 树形表格</span>
          <span class="card-tip">支持多层嵌套、展开折叠，节点量大时可配合虚拟树渲染。</span>
        </div>
      </template>

      <vxe-table
        :data="treeData"
        :tree-config="{ children: 'children', expandAll: true }"
        :row-config="{ keyField: 'id' }"
        border
      >
        <vxe-column field="name" title="部门" tree-node min-width="240" />
        <vxe-column field="manager" title="负责人" width="140" />
        <vxe-column field="headcount" title="编制人数" width="120" align="right" />
      </vxe-table>
    </el-card>

    <!-- 场景四：多级表头 + 合并单元格 -->
    <el-card shadow="never" class="demo-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">场景四 · 多级表头 + 合并单元格</span>
          <span class="card-tip">
            「固定列 + 虚拟滚动 + 合并」三者叠加是 el-table-v2 已知出问题的组合，vxe 原生支持。
          </span>
        </div>
      </template>

      <vxe-table :data="salaryList" :merge-cells="mergeCells" border stripe>
        <vxe-colgroup title="员工信息">
          <vxe-column field="name" title="姓名" width="140" />
          <vxe-column field="dept" title="部门" width="140" />
        </vxe-colgroup>
        <vxe-colgroup title="薪资构成">
          <vxe-column field="base" title="基本工资" width="140" align="right" />
          <vxe-column field="bonus" title="绩效奖金" width="140" align="right" />
        </vxe-colgroup>
      </vxe-table>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.vxe-demo {
  .demo-card {
    margin-bottom: 16px;
  }

  .card-header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    flex-wrap: wrap;

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
    margin-bottom: 12px;
    flex-wrap: wrap;

    .toolbar-left,
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .hint {
      color: #909399;
      font-size: 13px;
    }
  }
}
</style>
