<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCounterStore, useUserStore } from '@/store'

// 使用 storeToRefs 解构，保持响应式
const counterStore = useCounterStore()
const { count, doubleCount, isPositive } = storeToRefs(counterStore)
const { increment, decrement, reset, incrementBy } = counterStore

const userStore = useUserStore()
const { userInfo, isLoggedIn } = storeToRefs(userStore)
</script>

<template>
  <div class="page-container demo-store">
    <el-row :gutter="16">
      <!-- 计数器 -->
      <el-col :xs="24" :md="12">
        <el-card shadow="never" class="store-card">
          <template #header>
            <span class="card-title">计数器 Store（counter）</span>
          </template>
          <div class="counter-display">
            <el-statistic title="count" :value="count" />
            <el-statistic title="doubleCount（getter）" :value="doubleCount" />
          </div>
          <el-tag :type="isPositive ? 'success' : 'info'" size="small" class="mt">
            isPositive: {{ isPositive }}
          </el-tag>

          <div class="btn-group">
            <el-button type="primary" @click="increment()">+1</el-button>
            <el-button @click="decrement()">-1</el-button>
            <el-button @click="incrementBy(5)">+5</el-button>
            <el-button type="danger" plain @click="reset()">重置</el-button>
          </div>
          <p class="hint">
            数据定义在 <code>src/store/modules/counter.ts</code>，多个页面共享同一份状态。
          </p>
        </el-card>
      </el-col>

      <!-- 用户 -->
      <el-col :xs="24" :md="12">
        <el-card shadow="never" class="store-card">
          <template #header>
            <span class="card-title">用户 Store（user）</span>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户名">
              {{ userInfo?.username || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="昵称">
              {{ userInfo?.nickname || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="角色">
              <el-tag v-for="r in userInfo?.roles ?? []" :key="r" size="small">{{ r }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="登录状态">
              <el-tag :type="isLoggedIn ? 'success' : 'danger'" size="small">
                {{ isLoggedIn ? '已登录' : '未登录' }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <p class="hint">
            数据定义在 <code>src/store/modules/user.ts</code>，token 读写统一走
            <code>src/utils/auth.ts</code>。
          </p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.demo-store {
  .store-card {
    margin-bottom: 16px;

    .card-title {
      font-weight: 600;
    }
  }

  .counter-display {
    display: flex;
    gap: 40px;
    margin-bottom: 12px;
  }

  .mt {
    margin-top: 4px;
  }

  .btn-group {
    margin-top: 16px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .hint {
    margin: 16px 0 0;
    color: #909399;
    font-size: 13px;

    code {
      background: #f2f3f5;
      padding: 2px 6px;
      border-radius: 4px;
      color: #d63384;
    }
  }
}
</style>
