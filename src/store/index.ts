import type { App } from 'vue'
import { createPinia } from 'pinia'

const pinia = createPinia()

/** 在 main.ts 中调用，注册 Pinia */
export function setupStore(app: App) {
  app.use(pinia)
}

export { pinia }

// 统一导出各模块 store，方便按需引入
export * from './modules/app'
export * from './modules/user'
export * from './modules/counter'
