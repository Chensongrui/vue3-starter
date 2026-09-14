<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Component } from 'vue'

import ComposableApiPanel from './components/vue3-panels/ComposableApiPanel.vue'
import ReactivityPanel from './components/vue3-panels/ReactivityPanel.vue'
import WatcherPanel from './components/vue3-panels/WatcherPanel.vue'
import LifecyclePanel from './components/vue3-panels/LifecyclePanel.vue'
import ComponentCommPanel from './components/vue3-panels/ComponentCommPanel.vue'
import TemplateSyntaxPanel from './components/vue3-panels/TemplateSyntaxPanel.vue'
import ComposablesPanel from './components/vue3-panels/ComposablesPanel.vue'
import BuiltinComponentsPanel from './components/vue3-panels/BuiltinComponentsPanel.vue'

interface Topic {
  key: string
  title: string
  desc: string
  tag: '基础' | '组件' | '进阶'
}

/** Vue3 核心知识点清单 */
const topics = ref<Topic[]>([
  { key: 'composable-api', title: '组合式 API', desc: 'setup 与 script setup 语法糖，按逻辑关注点组织代码', tag: '基础' },
  { key: 'reactivity', title: '响应式系统', desc: 'ref / reactive / computed，基于 Proxy 的依赖收集与派发', tag: '基础' },
  { key: 'watcher', title: '侦听器', desc: 'watch / watchEffect，监听数据变化并执行副作用逻辑', tag: '基础' },
  { key: 'lifecycle', title: '生命周期', desc: 'onMounted / onUpdated / onUnmounted 等组合式钩子', tag: '基础' },
  { key: 'component-comm', title: '组件通信', desc: 'defineProps / defineEmits / provide-inject / defineExpose', tag: '组件' },
  { key: 'template-syntax', title: '模板语法', desc: '指令 v-if / v-for / v-model，以及插槽 slot 的使用', tag: '组件' },
  { key: 'composables', title: '组合式函数', desc: 'Composables，将「有状态的逻辑」抽离并跨组件复用', tag: '进阶' },
  { key: 'builtin-components', title: '内置组件', desc: 'Transition / KeepAlive / Teleport / Suspense', tag: '进阶' }
])

/** 知识点 key -> 专属详情面板组件 */
const panelMap: Record<string, Component> = {
  'composable-api': ComposableApiPanel,
  reactivity: ReactivityPanel,
  watcher: WatcherPanel,
  lifecycle: LifecyclePanel,
  'component-comm': ComponentCommPanel,
  'template-syntax': TemplateSyntaxPanel,
  composables: ComposablesPanel,
  'builtin-components': BuiltinComponentsPanel
}

const tagType = (tag: Topic['tag']) =>
  tag === '基础' ? 'primary' : tag === '组件' ? 'success' : 'warning'

/** 当前选中的知识点 title，点击上方卡片时变更 */
const activeKey = ref<string>('')
const activeTopic = computed(() => topics.value.find(t => t.title === activeKey.value) ?? null)
const activePanel = computed<Component | null>(() =>
  activeTopic.value ? panelMap[activeTopic.value.key] ?? null : null
)
</script>

<template>
  <div class="page-container vue3-demo">
    <el-card shadow="never">
      <template #header>
        <span class="card-title">学习vue3</span>
      </template>
      <p class="intro">
        下面是 Vue 3 的核心知识点清单，从基础到进阶逐项对照学习即可。
      </p>
      <ul class="topic-list">
        <li
          v-for="(item, index) in topics"
          :key="item.title"
          class="topic-item"
          :class="{ active: activeKey === item.title }"
          @click="activeKey = item.title"
        >
          <span class="topic-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="topic-body">
            <div class="topic-head">
              <span class="topic-title">{{ item.title }}</span>
              <el-tag size="small" effect="light" :type="tagType(item.tag)">
                {{ item.tag }}
              </el-tag>
            </div>
            <p class="topic-desc">{{ item.desc }}</p>
          </div>
        </li>
      </ul>
    </el-card>

    <div class="detail-wrap">
      <!-- 每个知识点对应各自的独立面板组件，内容暂留空 -->
      <component :is="activePanel" v-if="activePanel" />
      <div v-else class="empty-tip">请点击上方任一知识点查看详情</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vue3-demo {
  .card-title {
    font-weight: 600;
  }

  .intro {
    margin-top: 0;
    line-height: 1.8;
    color: #606266;
  }

  .topic-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
  }

  .topic-item {
    display: flex;
    gap: 12px;
    padding: 12px 14px;
    background: #fafafa;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s, background 0.2s;

    &:hover {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);
    }

    &.active {
      border-color: #409eff;
      background: #ecf5ff;
    }
  }

  .topic-index {
    flex-shrink: 0;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 16px;
    font-weight: 600;
    color: #409eff;
  }

  .topic-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .topic-title {
    font-weight: 600;
    color: #303133;
  }

  .topic-desc {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: #606266;
  }

  .detail-wrap {
    margin-top: 16px;
  }

  .empty-tip {
    color: #909399;
    font-size: 13px;
  }
}
</style>
