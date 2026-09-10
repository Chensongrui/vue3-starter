import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { ElMessage } from 'element-plus'

import Layout from '@/layout/index.vue'
import { useUserStore } from '@/store'
import { getToken } from '@/utils/auth'

/**
 * 路由表
 * - 需要在左侧菜单中展示的路由，配置 meta.title（菜单名称）和 meta.icon（图标名）
 * - meta.hidden: true 可让路由不在菜单中显示
 */
export const menuRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled' }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/about/index.vue'),
        meta: { title: '关于工程', icon: 'InfoFilled' }
      }
    ]
  },
  {
    path: '/demo',
    component: Layout,
    redirect: '/demo/table',
    meta: { title: '功能示例', icon: 'Menu' },
    children: [
      {
        path: 'table',
        name: 'TableDemo',
        component: () => import('@/views/demo/table.vue'),
        meta: { title: '表格示例', icon: 'Grid' }
      },
      {
        path: 'form',
        name: 'FormDemo',
        component: () => import('@/views/demo/form.vue'),
        meta: { title: '表单示例', icon: 'EditPen' }
      },
      {
        path: 'store',
        name: 'StoreDemo',
        component: () => import('@/views/demo/store.vue'),
        meta: { title: 'Pinia 示例', icon: 'Coin' }
      }
    ]
  }
]

/** 免登录即可访问的路由白名单 */
const WHITE_LIST = ['/login']

const routes: RouteRecordRaw[] = [
  ...menuRoutes,
  // 登录页不套 Layout，也不放进 menuRoutes（避免出现在左侧菜单里）
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hidden: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 切换路由时回到页面顶部
  scrollBehavior: () => ({ left: 0, top: 0 })
})

/**
 * 全局前置守卫
 * 1. 统一设置页面标题
 * 2. 未登录 -> 跳登录页，并用 redirect 记住原本要去的地址
 * 3. 已登录还访问登录页 -> 直接回首页
 * 4. 已登录但用户信息为空（刷新页面导致）-> 补拉一次，失败视为登录失效
 */
router.beforeEach(async (to, _from, next) => {
  const appTitle = import.meta.env.VITE_APP_TITLE
  const pageTitle = to.meta?.title as string | undefined
  document.title = pageTitle ? `${pageTitle} - ${appTitle}` : appTitle

  // 未登录
  if (!getToken()) {
    if (WHITE_LIST.includes(to.path)) return next()
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // 已登录，不再允许回到登录页
  if (to.path === '/login') {
    return next({ path: '/' })
  }

  // 已登录但用户信息为空（例如刷新页面）
  const userStore = useUserStore()
  if (!userStore.userInfo) {
    try {
      await userStore.fetchUserInfo()
    } catch {
      userStore.logout()
      ElMessage.error('登录状态已失效，请重新登录')
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }
  }

  next()
})

export default router
