import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { DownloaderHelper } from 'node-downloader-helper'
import fs from 'fs'
import { createExtractorFromFile } from 'node-unrar-js'
import Store from 'electron-store'
import { autoUpdater } from 'electron-updater'

const store = new Store()
const activeDownloads = new Map<number, DownloaderHelper>()

// Variable para mantener referencia a la ventana principal
let mainWindow: BrowserWindow | null = null

const getIconPath = () => {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'icon.png') // Producción
    : path.join(__dirname, '../../resources/icon.png') // Desarrollo
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
  console.log('La ruta del icono es:', path.join(__dirname, '../../resources/icon.png'))

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    // Iniciar la comprobación de actualizaciones después de que la ventana esté lista
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

// Configuración del auto-updater
function setupAutoUpdater(): void {
  // Configuración básica
  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  // Configura el logger (opcional)
  autoUpdater.logger = {
    info: (message) => console.log('Info:', message),
    error: (message) => console.error('Error:', message),
    warn: (message) => console.warn('Warn:', message),
    debug: (message) => console.debug('Debug:', message)
  }

  // Eventos del autoUpdater
  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info)
    mainWindow?.webContents.send('update-available', info)
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded:', info)
    mainWindow?.webContents.send('update-downloaded', info)
  })

  autoUpdater.on('error', (error) => {
    console.error('Update error:', error)
    mainWindow?.webContents.send('update-error', error)
  })
}

// Función para comprobar actualizaciones
function checkForUpdates(): void {
  if (is.dev) {
    console.log('En modo desarrollo, no se comprueban actualizaciones')
    return
  }

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

// Función para actualizar la barra de progreso
function updateProgressBar(progress: number): void {
  if (!mainWindow) return

  if (progress < 0) {
    // Modo indeterminado (cuando no sabemos el progreso exacto)
    mainWindow.setProgressBar(-1)
  } else if (progress >= 1) {
    // Completado (la barra desaparece)
    mainWindow.setProgressBar(1)
    // Esperar un poco y luego limpiar la barra
    setTimeout(() => mainWindow?.setProgressBar(-1), 1000)
  } else {
    // Progreso normal
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

  // Handler para instalar la actualización cuando el usuario lo solicite
  ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall()
  })

  ipcMain.on('installGame', async (event, gameData) => {
    console.log('Installing game:', gameData.title)

    // Directorios
    const downloadPath = path.join(
      app.getPath('downloads'),
      'game-downloads',
      gameData.id.toString()
    )
    const extractPath = path.join(downloadPath, 'extracted')

    // Asegurar que los directorios existan
    ensureDirectory(downloadPath)
    ensureDirectory(extractPath)

    const dl = new DownloaderHelper(gameData.url, downloadPath, {
      fileName: `${gameData.id}.rar`,
      retry: { maxRetries: 3, delay: 3000 },
      override: true
    })

    // Almacenar la descarga
    activeDownloads.set(gameData.id, dl)

    dl.on('download', (downloadInfo) => {
      console.log('Download started:', downloadInfo)
      event.sender.send('download-started', { id: gameData.id })
      // Iniciar barra de progreso (modo indeterminado al principio)
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
      // Actualizar barra de progreso (convertir a fracción 0-1)
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
          exePath: path.join(downloadPath, gameData.executable)
        })
      }

      // Comenzar la extracción RAR
      const filePath = path.join(downloadPath, `${gameData.id}.rar`)

      try {
        event.sender.send('installing-progress', {
          id: gameData.id,
          stage: 'extracting',
          progress: 0,
          message: 'Preparando para instalar archivos...'
        })

        // Poner la barra en modo indeterminado durante la preparación
        updateProgressBar(-1)

        // Usar createExtractorFromFile para extraer directamente del archivo
        const extractor = await createExtractorFromFile({
          filepath: filePath,
          targetPath: extractPath
        })

        // Obtener lista de archivos primero para calcular progreso
        const list = extractor.getFileList()
        const fileHeaders = [...list.fileHeaders] // Consumir el iterador
        const totalFiles = fileHeaders.length

        if (totalFiles === 0) {
          throw new Error('El archivo RAR está vacío')
        }

        // Extraer archivos con seguimiento de progreso
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

          // Actualizar barra de progreso durante la extracción
          updateProgressBar(progress / 100)
        }

        console.log('Extraction complete')
        event.sender.send('installing-progress', {
          id: gameData.id,
          stage: 'extracting',
          progress: 100,
          message: 'Instalación completada'
        })

        // Completar la barra de progreso
        updateProgressBar(1)

        // Instalación completada
        setTimeout(() => {
          event.sender.send('installation-complete', {
            id: gameData.id,
            installPath: downloadPath,
            exePath: path.join(extractPath, gameData.executable)
          })
        }, 2000)
      } catch (error: any) {
        console.error('Extraction error:', error)
        // Limpiar barra de progreso en caso de error
        updateProgressBar(-1)
        event.sender.send('installation-error', {
          id: gameData.id,
          error: error.message || 'Error al extraer el archivo RAR'
        })
      }
    })

    dl.on('error', (err) => {
      console.error('Download error:', err)
      // Limpiar barra de progreso en caso de error
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
      // Limpiar barra de progreso al cancelar
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

      // Verificar si la ruta existe (forma sincrónica)
      if (!fs.existsSync(installPath)) {
        return { success: true, message: 'La ruta ya no existe' }
      }

      // Eliminar directorio recursivamente (forma sincrónica)
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
