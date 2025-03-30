import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  ipc: {
    send: (channel: string, data: any) => {
      // Validación y preparación de datos
      const payload = JSON.parse(JSON.stringify(data || {}))
      ipcRenderer.send(channel, payload)
    },
    on: (channel: string, callback: (data: any) => void) => {
      // Escucha con deserialización segura
      ipcRenderer.on(channel, (_event, ...args) => {
        try {
          const data = args[0] ? JSON.parse(JSON.stringify(args[0])) : null
          callback(data)
        } catch (error) {
          console.error('Error parsing IPC data:', error)
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
      ...api // Combinamos todas las APIs
    })
  } catch (error) {
    console.error('ContextBridge Error:', error)
  }
} else {
  // @ts-ignore
  window.electron = {
    ...electronAPI,
    ...api
  }
}
