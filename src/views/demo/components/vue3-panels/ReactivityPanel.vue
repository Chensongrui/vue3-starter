<script setup lang="ts">

import {computed, reactive, ref} from 'vue'

const count = ref(0)
const object = {id: ref(1)}
const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})
// 一个计算属性 ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <span class="card-title">响应式系统</span>
    </template>
    <!-- 内容待补充：当前按需求留空 -->
    <div>
      <!--      在模板渲染上下文中，只有顶级的 ref 属性才会被解包。-->
      <!--      {{ object.id + 1 }}-->
      {{ object.id.value + 1 }}
      <p>Has published books:</p>
      <span>{{ publishedBooksMessage }}</span>
    </div>

  </el-card>
</template>

<style scoped lang="scss">
.card-title {
  font-weight: 600;
}
</style>
