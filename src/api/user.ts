import { request } from './request'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
}

/** 登录（示例，接口地址按后端实际调整） */
export function loginApi(data: LoginParams) {
  return request<LoginResult>({
    url: '/user/login',
    method: 'post',
    data
  })
}

/** 获取用户信息（示例） */
export function getUserInfoApi() {
  return request<{ username: string; roles: string[] }>({
    url: '/user/info',
    method: 'get'
  })
}
