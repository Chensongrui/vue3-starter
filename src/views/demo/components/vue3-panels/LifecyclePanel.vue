<script setup lang='ts'>
import { onMounted, ref } from 'vue'

const count = ref(0)
onMounted(() => {
  console.log(`the component is now mounted.`)
  console.log(`count：${count.value}`)
})
</script>

<template>
  <el-card shadow='never'>
    <template #header>
      <span class='card-title'>生命周期</span>
    </template>
    <!-- 内容待补充：当前按需求留空 -->
    <div>

    </div>
  </el-card>
</template>

<style scoped lang='scss'>
.card-title {
  font-weight: 600;
}
</style>
