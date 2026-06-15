import Store from 'electron-store'
import { app } from 'electron'
import log from 'electron-log'

import path from 'path'
import os from 'os'

const store = new Store()
log.info(`[ConfigStore] Using default data path: ${app.getPath('userData')}`)

export function getDataPath(): string {
  return app.getPath('userData')
}

export function getDefaultMinecraftPath(): string {
  if (process.platform === 'win32') {
    return path.join(app.getPath('appData'), '.minecraft')
  } else if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', 'minecraft')
  } else {
    return path.join(os.homedir(), '.minecraft')
  }
}

export function getMinecraftDir(): string {
  const directoryType = store.get('minecraft.settings.directoryType') || 'default'
  if (directoryType === 'custom') {
    return (store.get('paths.minecraft') as string) || getDefaultMinecraftPath()
  }
  return getDefaultMinecraftPath()
}

export const ConfigStore = {
  get(key: string): any {
    return store.get(key)
  },

  set(key: string, value: any): void {
    store.set(key, value)
  },

  delete(key: string): void {
    store.delete(key)
  },

  has(key: string): boolean {
    return store.has(key)
  },

  clear(): void {
    store.clear()
  },

  storeInstance: store
}
