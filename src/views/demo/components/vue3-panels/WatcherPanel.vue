<script setup lang='ts'>
import { reactive, ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')
const loading = ref(false)

// 可以直接侦听一个 ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.includes('?')) {
    loading.value = true
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    } finally {
      loading.value = false
    }
  }
})
const obj = reactive({ count: 0 })
watch(
  () => obj.count,
  (count) => {
    console.log(`Count is: ${count}`)
  },
  { immediate: true }
)

function addCount() {
  obj.count++
}
</script>

<template>
  <el-card shadow='never'>
    <template #header>
      <span class='card-title'>侦听器</span>
    </template>
    <!-- 内容待补充：当前按需求留空 -->
    <div>
      <p>
        Ask a yes/no question:
        <input v-model='question' :disabled='loading' />
      </p>
      <p>{{ answer }}</p>
      <el-card>
        <el-button @click='addCount'>Add Count</el-button>
        <span>{{ obj.count }}</span>
      </el-card>
    </div>
  </el-card>
</template>

<style scoped lang='scss'>
.card-title {
  font-weight: 600;
}
</style>
