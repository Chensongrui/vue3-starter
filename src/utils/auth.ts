/**
 * 登录凭证（token）统一读写
 * 集中在一处，方便将来换成 sessionStorage / Cookie 或加上过期时间
 */

const TOKEN_KEY = 'token'

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
