<script setup lang='ts'>

// 举例来说，defineProps<{ title: string }> 会被编译为 { msg: { title: String, required: true }}。
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <el-card shadow='never'>
    <template #header>
      <span class='card-title'>组件通信</span>
    </template>
    <!-- 内容待补充：当前按需求留空 -->
  </el-card>
</template>

<style scoped lang='scss'>
.card-title {
  font-weight: 600;
}
</style>
