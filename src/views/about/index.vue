<script setup lang="ts">
import { ref } from 'vue'

const structure = ref(`vue3-starter
├── public/                 静态资源（不参与打包处理）
├── src/
│   ├── api/                接口层
│   │   ├── request.ts      axios 封装（拦截器、统一错误处理）
│   │   └── user.ts         用户相关接口
│   ├── assets/             需要打包的静态资源
│   ├── layout/             布局
│   │   ├── index.vue       整体框架（侧边栏 + 顶栏 + 内容区）
│   │   └── components/
│   │       └── Sidebar.vue 左侧菜单
│   ├── router/             路由配置
│   │   └── index.ts
│   ├── store/              Pinia 状态管理
│   │   ├── index.ts
│   │   └── modules/        app / user / counter
│   ├── styles/             全局样式
│   │   └── index.scss
│   ├── views/              页面
│   │   ├── home/           首页
│   │   ├── about/          关于工程
│   │   ├── demo/           功能示例（表格 / 表单 / Pinia）
│   │   └── error/          404
│   ├── App.vue             根组件
│   ├── main.ts             入口文件
│   └── vite-env.d.ts       环境变量类型声明
├── .env                    通用环境变量
├── .env.development        开发环境变量
├── .env.production         生产环境变量
├── index.html              页面模板
├── package.json
├── tsconfig.json
└── vite.config.ts          Vite 配置（别名、代理、打包）`)

const deps = ref([
  { name: 'vue', version: '^3.5', desc: '核心框架' },
  { name: 'vue-router', version: '^4.5', desc: '路由' },
  { name: 'pinia', version: '^2.3', desc: '状态管理' },
  { name: 'element-plus', version: '^2.9', desc: 'UI 组件库' },
  { name: '@element-plus/icons-vue', version: '^2.3', desc: '图标库' },
  { name: 'axios', version: '^1.7', desc: 'HTTP 请求' }
])
</script>

<template>
  <div class="page-container about">
    <el-card shadow="never">
      <template #header>
        <span class="card-title">关于本工程</span>
      </template>
      <p class="intro">
        这是一套基于 <b>Vue 3 + Vite + TypeScript</b> 的基础工程模板，集成了路由（Vue Router）、
        状态管理（Pinia）、UI 组件库（Element Plus）与请求封装（Axios），可直接运行、便于扩展，
        适合用于学习练习或作为新项目脚手架。
      </p>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="构建工具">Vite 6</el-descriptions-item>
        <el-descriptions-item label="开发语言">TypeScript</el-descriptions-item>
        <el-descriptions-item label="路由模式">History 模式</el-descriptions-item>
        <el-descriptions-item label="组件库">Element Plus（中文）</el-descriptions-item>
        <el-descriptions-item label="状态管理">Pinia（组合式写法）</el-descriptions-item>
        <el-descriptions-item label="请求库">Axios（含拦截器）</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <span class="card-title">核心依赖</span>
      </template>
      <el-table :data="deps" stripe border>
        <el-table-column prop="name" label="依赖" min-width="200" />
        <el-table-column prop="version" label="版本" width="120" />
        <el-table-column prop="desc" label="说明" min-width="160" />
      </el-table>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <span class="card-title">目录结构</span>
      </template>
      <pre class="structure">{{ structure }}</pre>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.about {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .card-title {
    font-weight: 600;
  }
  .intro {
    margin-top: 0;
    line-height: 1.8;
    color: #606266;
  }
  .structure {
    margin: 0;
    padding: 16px;
    background: #f6f8fa;
    border-radius: 6px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    line-height: 1.6;
    overflow-x: auto;
    color: #24292f;
  }
}
</style>
