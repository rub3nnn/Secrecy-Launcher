import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import Store from 'electron-store'

const userDataPath = ipcRenderer.sendSync('get-user-data-path')
const defaultMinecraftPath = ipcRenderer.sendSync('get-default-minecraft-path')
const store = new Store({ cwd: userDataPath })

function getDataPath(): string {
  return userDataPath
}

function getDefaultMinecraftPath(): string {
  return defaultMinecraftPath
}

const api = {
  ipc: {
    send: (channel: string, data: any) => {
      const payload = JSON.parse(JSON.stringify(data || {}))
      ipcRenderer.send(channel, payload)
    },
    on: (channel: string, callback: (data: any) => void) => {
      ipcRenderer.on(channel, (_event, ...args) => {
        try {
          const data = args[0] ? JSON.parse(JSON.stringify(args[0])) : null
          callback(data)
        } catch (error) {
          console.error('[Preload] Error parsing IPC data:', error)
          callback(null)
        }
      })
    },
    invoke: async (channel: string, data: any) => {
      const payload = JSON.parse(JSON.stringify(data || {}))
      return await ipcRenderer.invoke(channel, payload)
    },
    removeListener: (channel: string) => {
      ipcRenderer.removeAllListeners(channel)
    }
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      ...api
    })

    contextBridge.exposeInMainWorld('storage', {
      get: (key: string) => store.get(key),
      set: (key: string, value: unknown) => store.set(key, value),
      delete: (key: string) => store.delete(key),
      getDataPath: () => getDataPath(),
      getDefaultMinecraftPath: () => getDefaultMinecraftPath()
    })
  } catch (error) {
    console.error('[Preload] ContextBridge Error:', error)
  }
}
