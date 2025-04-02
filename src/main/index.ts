import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { DownloaderHelper } from 'node-downloader-helper'
import fs from 'fs'
import { createExtractorFromFile } from 'node-unrar-js'
import Store from 'electron-store'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

// Configuración del logger
log.transports.file.level = 'info'
log.transports.file.maxSize = 5 * 1024 * 1024 // 5MB
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'

const store = new Store()
const activeDownloads = new Map<number, DownloaderHelper>()

let mainWindow: BrowserWindow | null = null

const getIconPath = () => {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'icon.png')
    : path.join(__dirname, '../../resources/icon.png')
}

// Función para obtener el token de forma segura
function getGitHubToken() {
  return import.meta.env.MAIN_VITE_GH_TOKEN
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

  if (!token && !is.dev) {
    log.error('No se encontró token de GitHub para el auto-updater')
    return
  }

  autoUpdater.autoDownload = true

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
    info: (message) => log.info('Info:', message),
    error: (message) => log.error('Error:', message),
    warn: (message) => log.warn('Warn:', message),
    debug: (message) => log.debug('Debug:', message)
  }

  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info)
    mainWindow?.webContents.send('update-available', info)
  })

  autoUpdater.on('update-not-available', (info) => {
    log.info('Update available:', info)
    mainWindow?.webContents.send('update-not-available', info)
  })

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info)
    mainWindow?.webContents.send('update-downloaded', info)
  })

  autoUpdater.on('error', (error) => {
    log.error('Update error:', error)
    mainWindow?.webContents.send('update-error', error)

    // Manejo específico de errores de autenticación
    if (error.message.includes('401') || error.message.includes('403')) {
      log.error('Error de autenticación - Verifica tu token de GitHub')
      mainWindow?.webContents.send('update-auth-error')
    }
  })
}

function checkForUpdates(): void {
  log.info('Comprobando actualizaciones...')
  autoUpdater.checkForUpdates().catch((err) => {
    log.error('Error al comprobar actualizaciones:', err)
  })
}

function ensureDirectory(directoryPath: string): void {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true })
    log.info(`Created directory: ${directoryPath}`)
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

  ipcMain.on('ping', () => log.info('pong'))

  // Handler para instalar la actualización
  ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall()
  })

  ipcMain.on('installGame', async (event, gameData) => {
    log.info('Installing game:', gameData.title)

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
      log.info('Download started:', downloadInfo)
      event.sender.send('download-started', { id: gameData.id })
      updateProgressBar(-1)
    })

    dl.on('progress', (stats) => {
      const progress = Math.floor(stats.progress)
      log.info(`Download progress: ${progress}%`)
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
      log.info('Download completed:', downloadInfo)
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

        log.info('Extraction complete')
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
        log.error('Extraction error:', error)
        updateProgressBar(-1)
        event.sender.send('installation-error', {
          id: gameData.id,
          error: error.message || 'Error al extraer el archivo RAR'
        })
      }
    })

    dl.on('error', (err) => {
      log.error('Download error:', err)
      updateProgressBar(-1)
      event.sender.send('download-error', {
        id: gameData.id,
        error: err.message
      })
      activeDownloads.delete(gameData.id)
    })

    dl.start().catch((err) => {
      log.error('Error starting download:', err)
      updateProgressBar(-1)
    })
  })

  ipcMain.on('cancelDownload', (_event, gameId) => {
    const dl = activeDownloads.get(gameId)
    if (dl) {
      dl.stop()
      activeDownloads.delete(gameId)
      log.info(`Download canceled for game ID: ${gameId}`)
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
      log.error('Failed to get from store:', error)
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
      log.error('Failed to set in store:', error)
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
      log.error('Error al desinstalar:', error)
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
      log.error('Error al verificar instalación:', error)
      return false
    }
  })

  const { spawn } = require('child_process')

  ipcMain.on('launchGame', (event, game: any) => {
    log.info('[launchGame] Evento recibido. Juego:', game)

    if (mainWindow) {
      log.info('[launchGame] Ocultando ventana principal')
      mainWindow.hide()
    } else {
      log.warn('[launchGame] mainWindow no está definido')
    }

    // Verificar si requiere Steam y si está instalado
    if (game.requireSteam) {
      log.info('[launchGame] El juego requiere Steam, verificando instalación...')
      try {
        // Buscar Steam en las ubicaciones comunes
        const steamPath = getSteamPath()
        if (!steamPath) {
          //!
          throw new Error('Steam no está instalado o no se pudo encontrar')
        }
        log.info('[launchGame] Steam encontrado en:', steamPath)
      } catch (error: any) {
        log.error('[launchGame] Error al verificar Steam:', error)

        if (mainWindow) {
          log.info('[launchGame] Mostrando ventana principal debido al error')
          mainWindow.show()
        }

        event.sender.send('launch-end', {
          id: game.id,
          success: false,
          requireSteam: true,
          error: error.message,
          game: game
        })
        return // Salir temprano si no hay Steam
      }
    }

    // Modificación importante: Escapar las rutas con espacios
    const exePath = game.exePath.includes(' ') ? `"${game.exePath}"` : game.exePath
    log.info('[launchGame] Ruta del ejecutable procesada:', exePath)

    log.info('[launchGame] Intentando iniciar proceso:', exePath)
    const appProcess = spawn(exePath, [], {
      shell: true,
      detached: false // Opcional: para que el proceso no dependa del padre
    })

    log.info('[launchGame] Proceso creado con PID:', appProcess.pid)

    appProcess.on('error', (err) => {
      log.error('[launchGame] Error al iniciar el proceso:', err)

      if (mainWindow) {
        log.info('[launchGame] Mostrando ventana principal debido al error')
        mainWindow.show()
      }

      log.info('[launchGame] Enviando evento launch-end con error')
      event.sender.send('launch-end', {
        id: game.id,
        success: false,
        error: err.message
      })
    })

    appProcess.on('close', (code, signal) => {
      log.info(`[launchGame] Proceso cerrado. Código: ${code}, Señal: ${signal}`)

      if (mainWindow) {
        log.info('[launchGame] Mostrando ventana principal')
        mainWindow.show()
      }

      // Modificación: Cambiar success a false si el código de salida no es 0
      const success = code === 0
      log.info(`[launchGame] Enviando evento launch-end con ${success ? 'éxito' : 'fallo'}`)
      event.sender.send('launch-end', {
        id: game.id,
        success: success,
        code: code,
        signal: signal
      })
    })

    appProcess.stdout?.on('data', (data) => {
      log.info(`[launchGame] stdout: ${data.toString().trim()}`)
    })

    appProcess.stderr?.on('data', (data) => {
      log.info(`[launchGame] stderr: ${data.toString().trim()}`)
    })
  })

  // Función auxiliar para encontrar la instalación de Steam
  function getSteamPath(): string | null {
    // Solo verificar rutas de Windows
    const winPaths = [
      process.env['ProgramFiles(x86)'] + '\\Steam\\steam.exe',
      process.env.ProgramFiles + '\\Steam\\steam.exe',
      'C:\\Program Files (x86)\\Steam\\steam.exe',
      'C:\\Program Files\\Steam\\steam.exe'
    ]

    for (const steamPath of winPaths) {
      try {
        if (fs.existsSync(steamPath)) {
          return steamPath
        }
      } catch (e) {
        log.warn(`[getSteamPath] Error al verificar ruta ${steamPath}:`, e)
      }
    }
    return null
  }

  ipcMain.on('install-steam', async (event) => {
    log.info('Starting Steam installation')

    const downloadPath = path.join(app.getPath('userData'), 'steam-install')
    const steamUrl = 'https://cdn.fastly.steamstatic.com/client/installer/SteamSetup.exe'

    ensureDirectory(downloadPath)

    const dl = new DownloaderHelper(steamUrl, downloadPath, {
      retry: { maxRetries: 3, delay: 3000 },
      override: true,
      fileName: 'SteamSetup.exe'
    })

    // Eventos de descarga
    dl.on('download', () => {
      log.info('Steam download started')
      event.sender.send('steam-download-started')
    })

    dl.on('progress', (stats) => {
      const progress = Math.floor(stats.progress)
      log.info(`Steam download progress: ${progress}%`)

      event.sender.send('steam-download-progress', {
        progress,
        speed: stats.speed,
        downloaded: stats.downloaded,
        total: stats.total
      })
    })

    dl.on('end', async (downloadInfo) => {
      log.info('Steam download completed')
      event.sender.send('steam-download-complete')

      try {
        log.info('Steam installation complete')
        event.sender.send('steam-install-complete', {
          installPath: downloadPath,
          executablePath: downloadInfo.filePath
        })
        const exePath = downloadInfo.filePath.includes(' ')
          ? `"${downloadInfo.filePath}"`
          : downloadInfo.filePath
        spawn(exePath, [], {
          shell: true,
          detached: false // Opcional: para que el proceso no dependa del padre
        })
      } catch (error: any) {
        log.error('Steam installation error:', error)
        event.sender.send('steam-install-error', {
          error: error.message || 'Error durante la instalación'
        })
      }
    })

    dl.on('error', (err) => {
      log.error('Steam download error:', err)
      event.sender.send('steam-download-error', {
        error: err.message
      })
    })

    try {
      await dl.start()
    } catch (err: any) {
      log.error('Error starting Steam download:', err)
      event.sender.send('steam-download-error', {
        error: err.message
      })
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
