import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { DownloaderHelper } from 'node-downloader-helper'
import fs from 'fs'
import { createExtractorFromFile } from 'node-unrar-js'
import Store from 'electron-store'
import { autoUpdater } from 'electron-updater'
import dotenv from 'dotenv'

// Configurar variables de entorno
dotenv.config()

const store = new Store()
const activeDownloads = new Map<number, DownloaderHelper>()

let mainWindow: BrowserWindow | null = null

const getIconPath = () => {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'icon.png')
    : path.join(__dirname, '../../resources/icon.png')
}

// Función para obtener el token de forma segura
function getGitHubToken(): string | null {
  // 1. Intenta desde variables de entorno (para desarrollo y producción)
  if (process.env.GH_TOKEN) {
    return process.env.GH_TOKEN
  }

  // 2. Intenta desde el store (último recurso, no recomendado para producción)
  try {
    const storedToken = store.get('gh_token') as string
    return storedToken || null
  } catch {
    return null
  }
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 810,
    show: false,
    autoHideMenuBar: true,
    icon: getIconPath(),
    ...(process.platform === 'linux' ? { getIconPath } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    checkForUpdates()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

function setupAutoUpdater(): void {
  const token = getGitHubToken()

  if (is.dev) {
    autoUpdater.forceDevUpdateConfig = true
  }

  if (!token && !is.dev) {
    console.error('No se encontró token de GitHub para el auto-updater')
    return
  }

  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  // Configuración específica para repositorio privado
  if (token) {
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'rub3nnn', // Reemplaza con tu usuario/organización
      repo: 'Secrecy-Launcher', // Reemplaza con tu repo
      token: token,
      private: true
    })
  }

  autoUpdater.logger = {
    info: (message) => console.log('Info:', message),
    error: (message) => console.error('Error:', message),
    warn: (message) => console.warn('Warn:', message),
    debug: (message) => console.debug('Debug:', message)
  }

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info)
    mainWindow?.webContents.send('update-available', info)
  })

  autoUpdater.on('update-not-available', (info) => {
    console.log('Update available:', info)
    mainWindow?.webContents.send('update-not-available', info)
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded:', info)
    mainWindow?.webContents.send('update-downloaded', info)
  })

  autoUpdater.on('error', (error) => {
    console.error('Update error:', error)
    mainWindow?.webContents.send('update-error', error)

    // Manejo específico de errores de autenticación
    if (error.message.includes('401') || error.message.includes('403')) {
      console.error('Error de autenticación - Verifica tu token de GitHub')
      mainWindow?.webContents.send('update-auth-error')
    }
  })
}

function checkForUpdates(): void {
  console.log('Comprobando actualizaciones...')
  autoUpdater.checkForUpdates().catch((err) => {
    console.error('Error al comprobar actualizaciones:', err)
  })
}

function ensureDirectory(directoryPath: string): void {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true })
    console.log(`Created directory: ${directoryPath}`)
  }
}

function updateProgressBar(progress: number): void {
  if (!mainWindow) return

  if (progress < 0) {
    mainWindow.setProgressBar(-1)
  } else if (progress >= 1) {
    mainWindow.setProgressBar(1)
    setTimeout(() => mainWindow?.setProgressBar(-1), 1000)
  } else {
    mainWindow.setProgressBar(progress)
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  // Configurar el auto-updater
  setupAutoUpdater()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  // Handler para instalar la actualización
  ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall()
  })

  ipcMain.on('installGame', async (event, gameData) => {
    console.log('Installing game:', gameData.title)

    const downloadPath = path.join(
      app.getPath('userData'),
      'game-downloads',
      gameData.id.toString()
    )
    const extractPath = path.join(downloadPath, 'extracted')

    ensureDirectory(downloadPath)
    ensureDirectory(extractPath)

    const dl = new DownloaderHelper(gameData.url, downloadPath, {
      retry: { maxRetries: 3, delay: 3000 },
      override: true
    })

    activeDownloads.set(gameData.id, dl)

    dl.on('download', (downloadInfo) => {
      console.log('Download started:', downloadInfo)
      event.sender.send('download-started', { id: gameData.id })
      updateProgressBar(-1)
    })

    dl.on('progress', (stats) => {
      const progress = Math.floor(stats.progress)
      console.log(`Download progress: ${progress}%`)
      event.sender.send('download-progress', {
        id: gameData.id,
        progress: progress,
        speed: stats.speed,
        downloaded: stats.downloaded,
        total: stats.total
      })
      updateProgressBar(progress / 100)
    })

    dl.on('end', async (downloadInfo) => {
      console.log('Download completed:', downloadInfo)
      event.sender.send('download-complete', { id: gameData.id })
      activeDownloads.delete(gameData.id)

      if (gameData.needExtract === false) {
        return event.sender.send('installation-complete', {
          id: gameData.id,
          installPath: downloadPath,
          exePath: downloadInfo.filePath
        })
      }

      const filePath = downloadInfo.filePath

      try {
        event.sender.send('installing-progress', {
          id: gameData.id,
          stage: 'extracting',
          progress: 0,
          message: 'Preparando para instalar archivos...'
        })

        updateProgressBar(-1)

        const extractor = await createExtractorFromFile({
          filepath: filePath,
          targetPath: extractPath
        })

        const list = extractor.getFileList()
        const fileHeaders = [...list.fileHeaders]
        const totalFiles = fileHeaders.length

        if (totalFiles === 0) {
          throw new Error('El archivo RAR está vacío')
        }

        let extractedFiles = 0
        const extracted = extractor.extract()

        for (const { fileHeader } of extracted.files) {
          extractedFiles++
          const progress = Math.min(99, Math.floor((extractedFiles / totalFiles) * 100))

          event.sender.send('installing-progress', {
            id: gameData.id,
            stage: 'extracting',
            progress: progress,
            message: `Procesando: ${fileHeader.name} (${extractedFiles}/${totalFiles})`
          })

          updateProgressBar(progress / 100)
        }

        console.log('Extraction complete')
        event.sender.send('installing-progress', {
          id: gameData.id,
          stage: 'extracting',
          progress: 100,
          message: 'Instalación completada'
        })

        updateProgressBar(1)

        setTimeout(() => {
          event.sender.send('installation-complete', {
            id: gameData.id,
            installPath: downloadPath,
            exePath: path.join(extractPath, gameData.executable)
          })
        }, 2000)
      } catch (error: any) {
        console.error('Extraction error:', error)
        updateProgressBar(-1)
        event.sender.send('installation-error', {
          id: gameData.id,
          error: error.message || 'Error al extraer el archivo RAR'
        })
      }
    })

    dl.on('error', (err) => {
      console.error('Download error:', err)
      updateProgressBar(-1)
      event.sender.send('download-error', {
        id: gameData.id,
        error: err.message
      })
      activeDownloads.delete(gameData.id)
    })

    dl.start().catch((err) => {
      console.error('Error starting download:', err)
      updateProgressBar(-1)
    })
  })

  ipcMain.on('cancelDownload', (_event, gameId) => {
    const dl = activeDownloads.get(gameId)
    if (dl) {
      dl.stop()
      activeDownloads.delete(gameId)
      console.log(`Download canceled for game ID: ${gameId}`)
      updateProgressBar(-1)
    }
  })

  ipcMain.handle('storageGet', (_event, key: string) => {
    if (typeof key !== 'string') {
      throw new Error('Invalid key type')
    }
    try {
      return store.get(key)
    } catch (error) {
      console.error('Failed to get from store:', error)
      throw error
    }
  })

  ipcMain.handle('storageSet', (_event, key: string, value: unknown) => {
    if (typeof key !== 'string') {
      throw new Error('Invalid key type')
    }
    try {
      store.set(key, value)
      return { success: true }
    } catch (error) {
      console.error('Failed to set in store:', error)
      throw error
    }
  })

  ipcMain.handle('uninstallGame', async (_event, installPath: string) => {
    try {
      if (!installPath) {
        throw new Error('No se proporcionó ruta de instalación')
      }

      if (!fs.existsSync(installPath)) {
        return { success: true, message: 'La ruta ya no existe' }
      }

      if (fs.lstatSync(installPath).isDirectory()) {
        fs.rmdirSync(installPath, { recursive: true })
      } else {
        fs.unlinkSync(installPath)
      }

      return { success: true, message: 'Juego desinstalado correctamente' }
    } catch (error) {
      console.error('Error al desinstalar:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido al desinstalar'
      }
    }
  })

  ipcMain.handle('checkGameInstalled', (_event, installPath: string) => {
    try {
      if (!installPath) return false
      return fs.existsSync(installPath)
    } catch (error) {
      console.error('Error al verificar instalación:', error)
      return false
    }
  })

  const { spawn } = require('child_process')

  ipcMain.on('launchGame', (event, game: any) => {
    mainWindow?.hide()
    const appProcess = spawn(game.exePath, [], {
      shell: true // Necesario en Windows para .exe
    })
    // Evento 'error': Falló al iniciar
    appProcess.on('error', (err) => {
      mainWindow?.show()
      event.sender.send('launch-end', {
        id: game.id,
        success: false,
        error: err.message
      })
    })

    // Evento 'close': La aplicación se cerró
    appProcess.on('close', (code) => {
      mainWindow?.show()
      event.sender.send('launch-end', {
        id: game.id,
        success: true,
        code: code
      })
    })
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
