<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { menuRoutes } from '@/router'
import { useAppStore } from '@/store'

const route = useRoute()
const appStore = useAppStore()

interface MenuItem {
  path: string
  title: string
  icon?: string
  children?: MenuItem[]
}

/**
 * 根据路由表自动生成菜单
 * - 有 meta.title 的路由才显示
 * - 无 meta.title 的容器路由，直接展开其子路由
 */
function buildMenus(routes: readonly RouteRecordRaw[], parentPath = ''): MenuItem[] {
  const result: MenuItem[] = []
  routes.forEach((r) => {
    if (r.meta?.hidden) return

    const fullPath = r.path.startsWith('/')
      ? r.path
      : `${parentPath}/${r.path}`.replace(/\/{2,}/g, '/')

    // 没有标题的容器路由，展开子路由
    if (!r.meta?.title) {
      if (r.children) result.push(...buildMenus(r.children, fullPath))
      return
    }

    const children = r.children ? buildMenus(r.children, fullPath) : []
    result.push({
      path: fullPath,
      title: r.meta.title as string,
      icon: r.meta.icon as string | undefined,
      children: children.length ? children : undefined
    })
  })
  return result
}

const menus = computed(() => buildMenus(menuRoutes))
// 当前激活菜单
const activeMenu = computed(() => route.path)
</script>

<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="appStore.sidebarCollapsed"
    :collapse-transition="false"
    background-color="#001529"
    text-color="rgba(255,255,255,0.75)"
    active-text-color="#fff"
    unique-opened
    router
    class="sidebar-menu"
  >
    <template v-for="item in menus" :key="item.path">
      <!-- 有子菜单 -->
      <el-sub-menu v-if="item.children" :index="item.path">
        <template #title>
          <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
          <el-icon v-if="child.icon"><component :is="child.icon" /></el-icon>
          <template #title>{{ child.title }}</template>
        </el-menu-item>
      </el-sub-menu>

      <!-- 无子菜单 -->
      <el-menu-item v-else :index="item.path">
        <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
        <template #title>{{ item.title }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<style scoped lang="scss">
.sidebar-menu {
  border-right: none;

  &:not(.el-menu--collapse) {
    width: 220px;
  }
}
</style>
