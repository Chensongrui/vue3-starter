import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VxeUI from 'vxe-pc-ui'
import VxeTable from 'vxe-table'

import App from './App.vue'
import router from './router'
import { setupStore } from './store'

// Element Plus 样式
import 'element-plus/dist/index.css'
// vxe 样式：放在全局样式之前，保证 index.scss 里的主题覆盖生效
import 'vxe-pc-ui/lib/style.css'
import 'vxe-table/lib/style.css'
// 全局样式
import './styles/index.scss'
// vxe 全局配置（尺寸对齐、层级等）
import './utils/vxe'

const app = createApp(App)

// 全局注册 Element Plus 所有图标（模板中可直接用 <el-icon><HomeFilled /></el-icon>）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus, { locale: zhCn }) // 使用中文语言包
// 注册 Vxe UI：vxe 的导出面板、筛选面板、内置编辑渲染器等都依赖这些全局组件
// 代价：实测 app.use(VxeUI) 会让 vxe chunk 从 539KB 涨到 1187KB（gzip 168KB -> 361KB）
// 想瘦身可以注释掉这一行，只保留下面的 app.use(VxeTable)，并把全局配置改成
// app.use(VxeTable, { size: 'small', zIndex: 4096 })；代价是导出/筛选/自定义列等弹层面板不可用
// （直接调用 exportData() 导出仍然正常）。
app.use(VxeUI)
app.use(VxeTable) // 注册 vxe-table
setupStore(app) // 注册 Pinia（必须在 router 之前，守卫里要用 store）
app.use(router)

app.mount('#app')
