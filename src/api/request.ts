import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'

/** 后端统一返回结构，按实际项目调整 */
export interface ApiResult<T = any> {
  code: number
  data: T
  message: string
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})

// 请求拦截器：统一携带 token
service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：统一处理业务错误
service.interceptors.response.use(
  (response: AxiosResponse<ApiResult>) => {
    const res = response.data
    // 约定 code 为 0 或 200 表示成功
    if (res && typeof res === 'object' && 'code' in res) {
      if (res.code !== 0 && res.code !== 200) {
        ElMessage.error(res.message || '请求失败')
        return Promise.reject(new Error(res.message || 'Error'))
      }
      return res.data
    }
    // 非约定结构直接返回
    return res as any
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || '网络异常，请稍后重试'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

/** 通用请求方法：泛型 T 为返回数据类型 */
export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  // 响应拦截器已经把 { code, data, message } 剥壳成 data，
  // 因此运行时实际返回的就是 T，这里做一次类型断言
  return service.request(config) as unknown as Promise<T>
}

export default service
