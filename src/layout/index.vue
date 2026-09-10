<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Expand, Fold } from '@element-plus/icons-vue'
import { useAppStore, useUserStore } from '@/store'
import Sidebar from './components/Sidebar.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

// 面包屑：取当前匹配到的、带 title 的路由
const breadcrumbs = computed(() =>
  route.matched.filter((item) => item.meta?.title).map((item) => ({
    path: item.path,
    title: item.meta.title as string
  }))
)

// 顶栏下拉菜单
async function handleCommand(command: string | number | object) {
  if (command !== 'logout') {
    ElMessage.info('个人中心待实现')
    return
  }

  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return // 用户点了取消
  }

  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<template>
  <el-container class="layout">
    <!-- 左侧菜单 -->
    <el-aside
      class="layout-aside"
      :width="appStore.sidebarCollapsed ? '64px' : '220px'"
    >
      <div class="logo">
        <img src="/favicon.svg" alt="logo" class="logo-img" />
        <span v-show="!appStore.sidebarCollapsed" class="logo-title">Vue3 Starter</span>
      </div>
      <Sidebar />
    </el-aside>

    <el-container>
      <!-- 顶部栏 -->
      <el-header class="layout-header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="appStore.toggleSidebar()">
            <Fold v-if="!appStore.sidebarCollapsed" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-tag type="success" effect="plain" size="small">Element Plus</el-tag>
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="28" class="user-avatar">{{ userStore.avatarText }}</el-avatar>
              <span class="user-name">{{ userStore.nickname }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容区 -->
      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layout {
  height: 100%;

  .layout-aside {
    background-color: #001529;
    transition: width 0.25s;
    overflow: hidden;

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 56px;
      padding: 0 16px;
      color: #fff;
      white-space: nowrap;

      .logo-img {
        width: 28px;
        height: 28px;
        flex-shrink: 0;
      }
      .logo-title {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .layout-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 20px;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .collapse-btn {
        font-size: 20px;
        cursor: pointer;
        color: #5a5e66;

        &:hover {
          color: #409eff;
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;

      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        outline: none;

        .user-avatar {
          background-color: #409eff;
          color: #fff;
        }
        .user-name {
          color: #303133;
        }
      }
    }
  }

  .layout-main {
    padding: 16px;
    background-color: #f5f7fa;
    overflow-y: auto;
  }
}
</style>
