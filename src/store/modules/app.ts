import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 应用级状态：侧边栏折叠、主题等
 * 采用「组合式 API（setup）」写法，与组件内的写法保持一致
 */
export const useAppStore = defineStore('app', () => {
  // 侧边栏是否折叠
  const sidebarCollapsed = ref(false)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setSidebarCollapsed(value: boolean) {
    sidebarCollapsed.value = value
  }

  return {
    sidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed
  }
})
