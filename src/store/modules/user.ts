import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getToken, removeToken, setToken } from '@/utils/auth'

export interface UserInfo {
  username: string
  nickname: string
  roles: string[]
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 用户状态：登录态、用户信息
 *
 * 当前 login / fetchUserInfo 均为 mock 实现（本工程没有真实后端）。
 * 接入真实后端时，只需把这两个函数里的 mock 部分替换掉：
 *
 *   async function login(username: string, password: string) {
 *     const { token: t } = await loginApi({ username, password })
 *     setToken(t)
 *     token.value = t
 *     await fetchUserInfo()
 *   }
 *
 *   async function fetchUserInfo() {
 *     userInfo.value = await getUserInfoApi()
 *   }
 */
export const useUserStore = defineStore('user', () => {
  // token 从本地读取，保证刷新页面后登录态不丢
  const token = ref<string>(getToken())
  // 用户信息：刷新后为 null，由路由守卫触发 fetchUserInfo 补拉
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const nickname = computed(
    () => userInfo.value?.nickname || userInfo.value?.username || '未登录'
  )
  const roles = computed(() => userInfo.value?.roles ?? [])
  const avatarText = computed(() => nickname.value.charAt(0).toUpperCase())

  /** 登录：写入 token 并拉取用户信息 */
  async function login(username: string, password: string) {
    await delay(400) // 模拟网络耗时，方便看到 loading 效果
    if (!username || !password) {
      throw new Error('请输入用户名和密码')
    }
    // TODO: 替换为真实登录接口
    const mockToken = `mock-token-${Date.now()}`
    setToken(mockToken)
    token.value = mockToken
    await fetchUserInfo()
    return mockToken
  }

  /** 获取用户信息（mock：返回一份默认用户） */
  async function fetchUserInfo() {
    await delay(200)
    if (!token.value) {
      throw new Error('未登录')
    }
    userInfo.value = {
      username: 'admin',
      nickname: '管理员',
      roles: ['admin']
    }
    return userInfo.value
  }

  /** 退出登录：清空状态与本地凭证 */
  function logout() {
    token.value = ''
    userInfo.value = null
    removeToken()
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    nickname,
    roles,
    avatarText,
    login,
    fetchUserInfo,
    logout
  }
})
