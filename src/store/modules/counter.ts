import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * 计数器示例：演示 state / getter / action 三件套
 * 对应「Pinia 示例」页面
 */
export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)

  // getter（computed）
  const doubleCount = computed(() => count.value * 2)
  const isPositive = computed(() => count.value > 0)

  // action
  function increment() {
    count.value++
  }
  function decrement() {
    count.value--
  }
  function reset() {
    count.value = 0
  }
  function incrementBy(step: number) {
    count.value += step
  }

  return {
    count,
    doubleCount,
    isPositive,
    increment,
    decrement,
    reset,
    incrementBy
  }
})
