<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCounterStore, useUserStore } from '@/store'

const router = useRouter()
const counterStore = useCounterStore()
const userStore = useUserStore()

const techList = ref([
  { name: 'Vue 3.5', desc: '渐进式 JavaScript 框架，组合式 API', color: '#42b883' },
  { name: 'Vite 6', desc: '极速的下一代前端构建工具', color: '#646cff' },
  { name: 'TypeScript', desc: '带类型的 JavaScript 超集', color: '#3178c6' },
  { name: 'Vue Router 4', desc: '官方路由管理器', color: '#42b883' },
  { name: 'Pinia 2', desc: '官方推荐的状态管理库', color: '#ffd859' },
  { name: 'Element Plus', desc: '基于 Vue 3 的组件库', color: '#409eff' }
])

const stats = ref([
  { label: '页面数', value: 6, icon: 'Document' },
  { label: '状态模块', value: 3, icon: 'Coin' },
  { label: '组件库', value: 1, icon: 'Grid' }
])
</script>

<template>
  <div class="page-container home">
    <!-- 欢迎卡片 -->
    <el-card shadow="never" class="welcome-card">
      <div class="welcome-inner">
        <div class="welcome-text">
          <h2>欢迎使用 Vue3 Starter 🎉</h2>
          <p>
            你好，{{ userStore.nickname }}！这是一套可直接上手的基础工程，
            集成了路由、状态管理、组件库与请求封装，适合用来做练习或作为新项目起点。
          </p>
          <div class="welcome-actions">
            <el-button type="primary" @click="router.push('/demo/table')"> 查看表格示例 </el-button>
            <el-button @click="router.push('/about')">了解工程结构</el-button>
          </div>
        </div>
        <div class="welcome-counter">
          <el-statistic title="Pinia 计数（点击按钮试试）" :value="counterStore.count" />
          <div class="counter-btns">
            <el-button type="primary" circle @click="counterStore.increment()">+</el-button>
            <el-button circle @click="counterStore.decrement()">-</el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 数据概览 -->
    <el-row :gutter="16" class="stat-row">
      <el-col v-for="s in stats" :key="s.label" :xs="24" :sm="8">
        <el-card shadow="hover" class="stat-card">
          <el-icon :size="28" color="#409eff"><component :is="s.icon" /></el-icon>
          <div class="stat-value">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 技术栈 -->
    <el-card shadow="never" class="tech-card">
      <template #header>
        <span class="card-title">技术栈</span>
      </template>
      <el-row :gutter="16">
        <el-col v-for="t in techList" :key="t.name" :xs="24" :sm="12" :md="8">
          <div class="tech-item">
            <span class="tech-dot" :style="{ backgroundColor: t.color }" />
            <div>
              <div class="tech-name">{{ t.name }}</div>
              <div class="tech-desc">{{ t.desc }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.welcome-card {
  .welcome-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }
  .welcome-text {
    flex: 1;
    min-width: 260px;

    h2 {
      margin: 0 0 8px;
    }
    p {
      margin: 0 0 16px;
      color: #606266;
      line-height: 1.7;
    }
  }
  .welcome-counter {
    text-align: center;

    .counter-btns {
      margin-top: 12px;
      display: flex;
      justify-content: center;
      gap: 8px;
    }
  }
}

.stat-row {
  .stat-card {
    text-align: center;
    margin-bottom: 16px;

    .stat-value {
      font-size: 26px;
      font-weight: 600;
      margin: 8px 0 4px;
    }
    .stat-label {
      color: #909399;
    }
  }
}

.tech-card {
  .card-title {
    font-weight: 600;
  }
  .tech-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 0;

    .tech-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-top: 5px;
      flex-shrink: 0;
    }
    .tech-name {
      font-weight: 500;
    }
    .tech-desc {
      color: #909399;
      font-size: 13px;
    }
  }
}
</style>
