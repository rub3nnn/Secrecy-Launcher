import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import fs from 'fs'
import path from 'path'
import vdf from 'vdf-parser'
import Store from 'electron-store'

const store = new Store()

// Custom APIs for renderer
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

// Función para leer la imagen del avatar y convertirla a Base64
function getSteamAvatar(steamId: string): string | null {
  try {
    const steamAvatarPath = path.join(
      'C:\\Program Files (x86)\\Steam\\config\\avatarcache',
      `${steamId}.png`
    )

    if (!fs.existsSync(steamAvatarPath)) {
      console.error('Avatar file does not exist:', steamAvatarPath)
      return null
    }

    // Leer la imagen como Buffer y convertirla a Base64
    const imageBuffer = fs.readFileSync(steamAvatarPath)
    const base64Image = imageBuffer.toString('base64')
    return `data:image/png;base64,${base64Image}`
  } catch (error) {
    console.error('Error loading Steam avatar:', error)
    return null
  }
}

// Función para obtener datos del usuario de Steam
function getSteamUserData() {
  try {
    const steamConfigPath = 'C:\\Program Files (x86)\\Steam\\config'
    const vdfFilePath = path.join(steamConfigPath, 'loginusers.vdf')

    const vdfContent = fs.readFileSync(vdfFilePath, 'utf-8')
    const parsedData: any = vdf.parse(vdfContent)
    const users = parsedData.users

    for (const steamId in users) {
      if (users[steamId].MostRecent === 1) {
        return {
          steamId: steamId,
          accountName: users[steamId].AccountName,
          personaName: users[steamId].PersonaName,
          autoLogin: users[steamId].AllowAutoLogin === '1',
          timestamp: new Date(parseInt(users[steamId].Timestamp) * 1000),
          rawData: users[steamId]
        }
      }
    }
    return null
  } catch (error) {
    console.error('Error al obtener usuario de Steam:', error)
    return null
  }
}

// Exponer APIs al renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      ...api
    })

    contextBridge.exposeInMainWorld('steamAPI', {
      getRecentUser: () => {
        const user = getSteamUserData()
        if (!user) return null

        // Obtener el avatar del usuario
        const avatar = getSteamAvatar(user.steamId)
        return { ...user, avatar }
      }
    })
    contextBridge.exposeInMainWorld('storage', {
      get: (key: string) => store.get(key),
      set: (key: string, value: unknown) => store.set(key, value)
      // Puedes añadir más métodos si los necesitas (delete, has, etc.)
    })
  } catch (error) {
    console.error('ContextBridge Error:', error)
  }
}
