/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_ASSET_REVERSE: string
  readonly VITE_INTERNAL_WEB: string
  readonly VITE_USE_MOCK: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
