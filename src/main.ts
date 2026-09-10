import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import { setupStore } from './store'

// Element Plus 样式
import 'element-plus/dist/index.css'
// 全局样式
import './styles/index.scss'

const app = createApp(App)

// 全局注册 Element Plus 所有图标（模板中可直接用 <el-icon><HomeFilled /></el-icon>）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus, { locale: zhCn }) // 使用中文语言包
setupStore(app) // 注册 Pinia（必须在 router 之前，守卫里要用 store）
app.use(router)

app.mount('#app')
