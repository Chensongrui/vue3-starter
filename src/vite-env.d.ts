/// <reference types="vite/client" />

// 自定义环境变量类型提示（在 .env 文件中定义的 VITE_ 变量）
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_PROXY_TARGET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
