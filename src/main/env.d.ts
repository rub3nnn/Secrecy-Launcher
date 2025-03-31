/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_GH_TOKEN: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
