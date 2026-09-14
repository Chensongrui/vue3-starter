# Vue3 Starter

一套开箱即用的 Vue3 基础工程模板，参考主流开源项目（如 vue-manage-system、Geeker-Admin）的目录组织方式搭建。
技术栈：**Vue 3 + Vite + TypeScript + Vue Router 4 + Pinia + Element Plus + VxeTable + Axios**。

适合用来：学习 Vue3 全家桶、做练手项目、作为新项目的起步脚手架。

---

## 一、环境要求

| 工具 | 版本要求 | 说明 |
| --- | --- | --- |
| Node.js | >= 18（推荐 20 / 22） | 运行环境 |
| npm | >= 9 | 包管理器（也可用 pnpm / yarn） |

检查版本：

```bash
node -v
npm -v
```

## 二、安装与启动

```bash
# 1. 进入工程目录
cd vue3-starter

# 2. 安装依赖（国内建议加镜像加速）
npm install
# 或：npm install --registry=https://registry.npmmirror.com

# 3. 启动开发服务器（默认 http://localhost:5173，会自动打开浏览器）
npm run dev
```

打包与预览：

```bash
npm run build      # 打包生产环境，产物在 dist/
npm run preview    # 本地预览打包结果
npm run type-check # TypeScript 类型检查
```

## 三、目录结构

```
vue3-starter
├── public/                 静态资源（原样拷贝，不参与打包处理）
├── src/
│   ├── api/                接口层
│   │   ├── request.ts      axios 封装（请求/响应拦截器、统一错误提示）
│   │   └── user.ts         用户相关接口示例
│   ├── assets/             需要被打包处理的静态资源（图片、字体等）
│   ├── layout/             布局
│   │   ├── index.vue       整体框架：侧边栏 + 顶栏 + 内容区
│   │   └── components/
│   │       └── Sidebar.vue 左侧菜单（根据路由自动生成）
│   ├── router/
│   │   └── index.ts        路由配置 + 全局守卫（登录校验）
│   ├── store/              Pinia 状态管理
│   │   ├── index.ts        创建并注册 Pinia，统一导出各模块
│   │   └── modules/
│   │       ├── app.ts      应用状态（侧边栏折叠等）
│   │       ├── user.ts     用户状态（token、用户信息、登录/登出）
│   │       └── counter.ts  计数器示例（state/getter/action）
│   ├── styles/
│   │   └── index.scss      全局样式
│   ├── composables/        组合式函数
│   │   └── useVxeClipboard.ts 给 vxe-table 补上 Excel 复制粘贴（免费版缺失的能力）
│   ├── utils/
│   │   ├── auth.ts         token 统一读写（getToken / setToken / removeToken）
│   │   └── vxe.ts          vxe 全局配置（尺寸对齐、弹层层级）
│   ├── views/              页面
│   │   ├── login/          登录页
│   │   ├── home/           首页
│   │   ├── about/          关于工程
│   │   ├── demo/           功能示例：表格 / 表单 / Pinia / VxeTable
│   │   └── error/404.vue   404 页面
│   ├── App.vue             根组件
│   ├── main.ts             入口文件（注册组件库、路由、Pinia）
│   └── vite-env.d.ts       环境变量类型声明
├── .env                    通用环境变量
├── .env.development        开发环境变量
├── .env.production         生产环境变量
├── index.html              页面模板
├── package.json
├── tsconfig.json
└── vite.config.ts          Vite 配置（别名 / 代理 / 打包拆分）
```

## 四、核心用法

### 1. 新增一个页面

**第一步**：在 `src/views/` 下新建页面文件，例如 `src/views/demo/user.vue`：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const title = ref('用户管理')
</script>

<template>
  <div class="page-container">
    <h2>{{ title }}</h2>
  </div>
</template>
```

**第二步**：在 `src/router/index.ts` 的 `menuRoutes` 中注册路由：

```ts
{
  path: 'user',
  name: 'UserDemo',
  component: () => import('@/views/demo/user.vue'),
  meta: { title: '用户管理', icon: 'User' } // title 用于菜单显示，icon 为 Element Plus 图标名
}
```

保存后菜单会自动出现，无需手动改菜单代码。

> 小技巧：`meta.hidden: true` 可让路由不在菜单中显示（如详情页）；`meta.icon` 可填任意 Element Plus 图标名。

### 2. 路由跳转与传参

```vue
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 编程式跳转
router.push('/demo/table')
router.push({ path: '/demo/table', query: { page: 2 } })

// 读取参数
console.log(route.query.page)   // query 参数
console.log(route.params.id)    // 动态路由参数
</script>

<template>
  <!-- 声明式跳转 -->
  <router-link to="/about">关于</router-link>
</template>
```

### 3. 状态管理（Pinia）

在 `src/store/modules/` 下新建 store，例如 `count2.ts`：

```ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCount2Store = defineStore('count2', () => {
  const num = ref(0)                        // state
  const double = computed(() => num.value * 2) // getter
  function add() { num.value++ }            // action
  return { num, double, add }
})
```

在组件中使用：

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCount2Store } from '@/store'

const store = useCount2Store()
// 解构 state/getter 要用 storeToRefs 才能保持响应式
const { num, double } = storeToRefs(store)
// action 可以直接解构
const { add } = store
</script>
```

> 记得在 `src/store/index.ts` 里 `export * from './modules/count2'` 方便统一引入。

### 4. 组件库（Element Plus）

- 已在 `main.ts` 中**全局注册**，任意组件内直接使用，无需 import：

```vue
<template>
  <el-button type="primary">按钮</el-button>
  <el-table :data="list">...</el-table>
</template>
```

- 所有图标已全局注册，可直接使用：

```vue
<template>
  <el-icon><HomeFilled /></el-icon>
</template>
```

- 需要弹窗提示时：

```ts
import { ElMessage, ElMessageBox } from 'element-plus'
ElMessage.success('操作成功')
ElMessageBox.confirm('确定删除吗？', '提示')
```

> 组件库已配置中文语言包（`zh-cn`），日期、分页等组件默认显示中文。

### 5. 接口请求（Axios）

`src/api/request.ts` 已封装好 axios 实例，含：
- 请求拦截：自动携带 token（`Authorization: Bearer xxx`）
- 响应拦截：统一处理业务错误并弹出提示
- 约定后端返回结构为 `{ code, data, message }`，`code` 为 0 或 200 视为成功

新增接口示例（`src/api/user.ts`）：

```ts
import { request } from './request'

export function getUserList(params: { page: number }) {
  return request<{ list: any[]; total: number }>({
    url: '/user/list',
    method: 'get',
    params
  })
}
```

在组件中调用：

```ts
import { getUserList } from '@/api/user'

const data = await getUserList({ page: 1 })
```

### 6. 环境变量与接口代理

- 环境变量写在 `.env` / `.env.development` / `.env.production`，必须以 `VITE_` 开头。
- 代码中通过 `import.meta.env.VITE_XXX` 读取：

```ts
const title = import.meta.env.VITE_APP_TITLE
const baseUrl = import.meta.env.VITE_API_BASE_URL
```

- 开发环境跨域：在 `vite.config.ts` 的 `server.proxy` 中配置代理，把 `/api` 转发到后端：

```ts
proxy: {
  '/api': {
    target: 'http://localhost:8080', // 你的后端地址
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

### 7. 路径别名

已配置 `@` 指向 `src`，导入文件更简洁：

```ts
import Sidebar from '@/layout/components/Sidebar.vue'
```

（同时已在 `tsconfig.json` 的 `paths` 中配置，TS 也能正确识别。）

### 8. 登录与路由守卫

工程已内置一套完整的登录流程，演示账号：**admin / 123456**。

**守卫逻辑**（`src/router/index.ts`）：

1. 每次跳转统一设置 `document.title`；
2. **未登录**访问受保护页面 → 跳 `/login`，并把原地址写进 `?redirect=`，登录成功后原路返回；
3. **已登录**再访问 `/login` → 直接回首页；
4. 已登录但 `userInfo` 为空（刷新页面导致）→ 自动补拉一次，失败则清 token 并跳登录页。

免登录白名单在 `router/index.ts` 顶部维护：

```ts
const WHITE_LIST = ['/login']
```

**token 存放**：统一走 `src/utils/auth.ts`（默认 `localStorage`，键名 `token`），`src/api/request.ts` 的请求拦截器会自动读取并加上 `Authorization: Bearer xxx` 请求头。想换成 `sessionStorage` 或加过期时间，只改这一个文件即可。

**登录页**（`src/views/login/index.vue`）包含表单校验、loading 态、回车提交。核心调用：

```ts
await userStore.login(form.username, form.password)
router.replace((route.query.redirect as string) || '/')
```

**退出登录**：顶栏头像下拉 → 退出登录，二次确认后执行 `userStore.logout()` 并跳回登录页。

> 当前 `userStore.login` / `fetchUserInfo` 是 **mock 实现**（本工程没有真实后端），文件内注释给出了替换成真实接口的写法。接入后端时把 `src/api/user.ts` 里的 `loginApi`、`getUserInfoApi` 换上去即可。

## 五、内置示例页面

| 页面 | 路由 | 演示内容 |
| --- | --- | --- |
| 登录页 | `/login` | `el-form` 校验、loading 态、回车提交、redirect 回跳 |
| 首页 | `/home` | 卡片布局、`el-statistic`、Pinia 计数联动 |
| 关于工程 | `/about` | `el-descriptions`、`el-table`、目录结构说明 |
| 表格示例 | `/demo/table` | `el-table` + 搜索 + 分页 + 操作列 + 二次确认 |
| VxeTable 示例 | `/demo/vxe-table` | 虚拟滚动 + 固定列 / 行内编辑 + 校验 / 树形 / 多级表头 + 合并 / 导出 |
| 表单示例 | `/demo/form` | `el-form` 校验、各类表单控件 |
| Pinia 示例 | `/demo/store` | state / getter / action、`storeToRefs` 用法 |

## 六、常见问题

**1. 端口被占用**
修改 `vite.config.ts` 中 `server.port`，或启动时指定：`npm run dev -- --port 3000`。

**2. `npm install` 很慢或失败**
切换镜像后重试：

```bash
npm config set registry https://registry.npmmirror.com
npm install
```

**3. 页面空白 / 控制台报错**
- 确认 Node 版本 ≥ 18；
- 删除 `node_modules` 和 `package-lock.json` 后重新 `npm install`。

**4. Element Plus 组件没有样式**
确认 `main.ts` 中引入了 `import 'element-plus/dist/index.css'`。

**5. 修改环境变量不生效**
需要重启开发服务器（`Ctrl + C` 后重新 `npm run dev`）。

**6. 登录后刷新页面又跳回登录页**
检查浏览器是否禁用了 `localStorage`，或本地是否残留了过期 token（清空后重试）。

**7. 一直停在登录页、无法进入首页**
守卫在拿到 `userInfo` 之前会等待 `fetchUserInfo()`。若改成了真实接口，确认 `/user/info` 返回结构与 `src/api/user.ts` 中的类型一致。

## 七、代码规范（ESLint + Prettier）

工程已集成 **ESLint 10（扁平配置）+ Prettier 3**，覆盖 `.js / .ts / .vue / .scss / .json`。

| 命令                | 作用                                       |
| ------------------- | ------------------------------------------ |
| `npm run lint`      | 检查全部代码（含 Prettier 格式，只报不改） |
| `npm run lint:fix`  | 检查并自动修复可修复问题                   |
| `npm run format`     | 用 Prettier 格式化全部源码                 |
| `npm run format:check` | 只检查格式是否符合规范（适合放 CI）     |
| `npm run type-check` | TS 类型检查（`vue-tsc`）                   |

相关配置文件：

| 文件                | 说明                                                             |
| ------------------- | ---------------------------------------------------------------- |
| `eslint.config.js`  | ESLint 扁平配置：`JS → TypeScript → Vue3 → 团队规则 → Prettier`   |
| `.prettierrc`       | 格式化风格：无分号、单引号、2 空格、行宽 100、无尾逗号、LF         |
| `.prettierignore`   | 不需要格式化的目录/文件                                          |
| `.editorconfig`     | 编辑器层统一缩进与换行（IDE 通用）                               |
| `.vscode/settings.json` | 保存时自动 `eslint --fix` + Prettier 格式化                  |

要点说明：

- **Prettier 只管格式，ESLint 管质量**。两者冲突的规则由 `eslint-config-prettier` 统一关闭，格式化差异以 `prettier/prettier` 规则报错并支持 `--fix`，因此只需要跑一条 `npm run lint:fix`。
- **类型检查与 lint 分离**：ESLint 不开启类型感知规则（更快），类型问题交给 `npm run type-check`。
- **提交前建议**：本地先跑 `npm run lint && npm run type-check`；如需强制约束，可再加 `husky` + `lint-staged` 做提交前校验。
- VS Code 用户请安装推荐插件（打开项目时会提示）：`ESLint`、`Prettier - Code formatter`、`Vue - Official`。

## 八、下一步可以练习什么

- 接入真实后端接口，把 `views/demo/table.vue` 改成请求数据渲染；
- 把 `userStore` 里的 mock 登录换成 `src/api/user.ts` 的真实接口，并给 token 加过期时间；
- 把菜单改为**根据后端返回的权限动态生成**（参考 RBAC 思路），配合 `roles` 做按钮级权限；
- 按需引入 Element Plus（`unplugin-vue-components` + `unplugin-auto-import`）减小打包体积；
- 用 `husky` + `lint-staged` 把 `npm run lint` 做成提交前钩子；
- 增加暗黑模式切换（Element Plus 支持 `dark` 类）。

## 九、表格选型：什么时候用 el-table，什么时候用 vxe-table？

工程里两套表格共存，按场景选，不要为了统一而统一：

| 场景 | 用哪个 | 原因 |
| --- | --- | --- |
| 简单展示：几百行内 + 后端分页 + 排序筛选 | `el-table` | 上手快、和 EP 观感天然一致 |
| 数据量大（千行以上） | `vxe-table` | `el-table` 全量渲染 DOM 会卡，`el-table-v2` 又缺功能 |
| 行内编辑 + 数据校验 | `vxe-table` | 原生支持，el-table 需要大量二次封装 |
| Excel 导入导出 / 打印 | `vxe-table` | 原生支持，el-table 没有 |
| 树形、多级表头、合并单元格、固定列叠加 | `vxe-table` | 组合场景下 el-table-v2 有已知 bug |

### 使用要点

- vxe 已在 `main.ts` 全局注册，模板里直接写 `<vxe-table>` / `<vxe-column>`，无需 import
- 全局配置集中在 `src/utils/vxe.ts`：尺寸对齐（EP `default` → vxe `small`）、`zIndex: 4096` 防止被 EP 弹窗遮挡
- 主题色在 `src/styles/index.scss` 中用 `--vxe-ui-*` 变量对齐到 Element Plus 的 `#409eff`（注意前缀是 `--vxe-ui-`，不是 `--vxe-`）
- 版本号一律用 `~` 锁小版本（`~4.21.10`），vxe 迭代快，官方明确不建议用 `^`
- 编辑态用 Element Plus 组件（在 `#edit` 插槽里放 `el-input` / `el-select`），避免引入第二套表单观感

### 已知限制

- **单元格区域框选、单元格复制/粘贴、查找替换属于 vxe 企业版付费功能**，免费版没有。
  本工程用 `src/composables/useVxeClipboard.ts` 做了轻量兜底：
  从 Excel 复制一片区域 → 点住起始单元格 → `Ctrl+V` 批量写入；`Ctrl+C` 复制勾选行（未勾选则复制当前行）。
- 导出内置支持 CSV / HTML。需要 .xlsx 时官方插件 `vxe-table-plugin-export-xlsx` 最后更新于 2024-10，
  与 vxe 4.21 的兼容性存疑，更稳妥的做法是用 `xlsx` 库自行实现或走后端导出。
- **体积**：`npm run build` 后 vxe chunk 约 1187 KB（gzip 361 KB），已通过 `manualChunks` 单独拆出。
  其中 `app.use(VxeUI)` 占了大头（约 647 KB / gzip 192 KB），它提供导出面板、筛选面板、内置编辑渲染器等
  依赖的全局组件。注释掉 `src/main.ts` 里的这行可降到 539 KB（gzip 168 KB），
  代价是这些弹层面板不可用（直接调 `exportData()` 导出仍正常）。按项目对体积的敏感度二选一。

---

_本工程为学习/起步模板，业务逻辑请按需替换。_
