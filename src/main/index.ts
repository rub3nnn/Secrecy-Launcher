import { app, shell, BrowserWindow, Notification, ipcMain } from 'electron'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { DownloaderHelper } from 'node-downloader-helper'
import fs from 'fs'
import { createExtractorFromFile } from 'node-unrar-js'
import Store from 'electron-store'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import AdmZip from 'adm-zip'

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

  if (is.dev) {
    autoUpdater.forceDevUpdateConfig = true
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

function showNotificationIfBackground(title: string, body: string) {
  if (!mainWindow) return

  // Verifica si la ventana está minimizada, oculta o no está enfocada
  if (mainWindow.isMinimized() || !mainWindow.isVisible() || !mainWindow.isFocused()) {
    // Crea una notificación
    const icon = getIconPath()

    const notification = new Notification({
      title,
      body,
      icon: icon
    })

    notification.show()

    // Opcional: enfocar la ventana al hacer clic en la notificación
    notification.on('click', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    })
  }
  // Si la ventana está activa, no hacer nada
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
  electronApp.setAppUserModelId('Secrecy Launcher')

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

  // Variables para controlar descargas pausadas
  interface PausedDownload {
    downloader: DownloaderHelper
    resumeData: any
  }
  const pausedDownloads = new Map<number, PausedDownload>()

  ipcMain.on(
    'installGame',
    async (
      event,
      gameData: {
        title: string
        id: number
        url: string | string[]
        needExtract: boolean
        extractPassword?: string
        executable?: string
      }
    ) => {
      log.info('Installing game:', gameData.title)

      const downloadPath = path.join(
        app.getPath('userData'),
        'game-downloads',
        gameData.id.toString()
      )
      const extractPath = path.join(downloadPath, 'extracted')

      ensureDirectory(downloadPath)
      ensureDirectory(extractPath)

      // Función para manejar la descarga de una URL (se mantiene igual)
      const downloadFile = async (url: string, index?: number, total?: number): Promise<string> => {
        const message =
          total !== undefined
            ? `Descargando parte ${index! + 1} de ${total}`
            : 'Descargando archivos del juego'

        const dl = new DownloaderHelper(url, downloadPath, {
          retry: { maxRetries: 3, delay: 3000 },
          override: true,
          resumeIfFileExists: true
        })

        activeDownloads.set(gameData.id, dl)

        dl.on('download', (downloadInfo) => {
          log.info('Download started:', downloadInfo)
          event.sender.send('download-started', { id: gameData.id })
          updateProgressBar(-1)
        })

        dl.on('progress', (stats) => {
          const progress = Math.floor(stats.progress)
          event.sender.send('download-progress', {
            id: gameData.id,
            progress: progress,
            speed: stats.speed,
            downloaded: stats.downloaded,
            total: stats.total,
            message: message
          })
          updateProgressBar(progress / 100)
        })

        return new Promise<string>((resolve, reject) => {
          dl.on('end', (downloadInfo) => {
            log.info('Download completed:', downloadInfo)
            resolve(downloadInfo.filePath)
          })

          dl.on('error', (err) => {
            log.error('Download error:', err)
            reject(err)
          })

          dl.start().catch((err) => {
            log.error('Error starting download:', err)
            reject(err)
          })
        })
      }

      try {
        let filePaths: string[] = []

        // Manejar múltiples URLs o una sola (COMPORTAMIENTO ORIGINAL)
        if (Array.isArray(gameData.url)) {
          const totalParts = gameData.url.length
          for (let i = 0; i < totalParts; i++) {
            const url = gameData.url[i]
            if (url) {
              filePaths.push(await downloadFile(url, i, totalParts))
            }
          }
        } else if (typeof gameData.url === 'string') {
          filePaths.push(await downloadFile(gameData.url))
        }

        activeDownloads.delete(gameData.id)

        if (gameData.needExtract === false) {
          return event.sender.send('installation-complete', {
            id: gameData.id,
            installPath: downloadPath,
            exePath: filePaths[0] // Devuelve el primer archivo si no hay extracción
          })
        }

        // MODIFICACIÓN: Solo cambios en la parte de extracción para ignorar errores
        let extractionErrors = 0
        event.sender.send('installing-progress', {
          id: gameData.id,
          stage: 'extracting',
          progress: 0,
          message: 'Preparando para instalar archivos...'
        })

        updateProgressBar(-1)

        let totalFiles = 0
        let extractedFiles = 0

        // Procesar cada archivo descargado
        for (const filePath of filePaths) {
          try {
            if (filePath.endsWith('.rar')) {
              try {
                const extractorOptions: any = {
                  filepath: filePath,
                  targetPath: extractPath
                }

                if (gameData.extractPassword) {
                  extractorOptions.password = gameData.extractPassword
                }

                const extractor = await createExtractorFromFile(extractorOptions)
                const list = extractor.getFileList()
                const fileHeaders = [...list.fileHeaders]
                totalFiles += fileHeaders.length

                if (fileHeaders.length === 0) {
                  log.warn(`El archivo RAR ${filePath} está vacío`)
                  continue
                }

                const extracted = extractor.extract()

                for (const { fileHeader } of extracted.files) {
                  try {
                    extractedFiles++
                    const progress = Math.min(99, Math.floor((extractedFiles / totalFiles) * 100))

                    event.sender.send('installing-progress', {
                      id: gameData.id,
                      stage: 'extracting',
                      progress: progress,
                      message: `Procesando: ${fileHeader.name} (${extractedFiles}/${totalFiles})`
                    })

                    updateProgressBar(progress / 100)
                  } catch (err) {
                    extractionErrors++
                    log.error(`Error al procesar archivo ${fileHeader.name}:`, err)
                  }
                }
              } catch (err) {
                extractionErrors++
                log.error(`Error al extraer archivo RAR ${filePath}:`, err)
              }
            } else if (filePath.endsWith('.zip')) {
              try {
                const zip = new AdmZip(filePath)
                const zipEntries = zip.getEntries()
                totalFiles += zipEntries.length

                if (zipEntries.length === 0) {
                  log.warn(`El archivo ZIP ${filePath} está vacío`)
                  continue
                }

                if (gameData.extractPassword) {
                  zip.setPassword(gameData.extractPassword)
                }

                zipEntries.forEach((entry) => {
                  try {
                    extractedFiles++
                    const progress = Math.min(99, Math.floor((extractedFiles / totalFiles) * 100))

                    event.sender.send('installing-progress', {
                      id: gameData.id,
                      stage: 'extracting',
                      progress: progress,
                      message: `Procesando: ${entry.entryName} (${extractedFiles}/${totalFiles})`
                    })

                    updateProgressBar(progress / 100)
                  } catch (err) {
                    extractionErrors++
                    log.error(`Error al procesar entrada ZIP ${entry.entryName}:`, err)
                  }
                })

                zip.extractAllTo(extractPath, true)
              } catch (err) {
                extractionErrors++
                log.error(`Error al extraer archivo ZIP ${filePath}:`, err)
              }
            } else {
              log.warn(`Formato de archivo no soportado: ${filePath}`)
            }
          } catch (err) {
            extractionErrors++
            log.error(`Error general al procesar archivo ${filePath}:`, err)
          }
        }

        log.info(`Extracción completada con ${extractionErrors} errores`)

        updateProgressBar(1)

        // Eliminar archivos comprimidos después de la extracción
        for (const filePath of filePaths) {
          try {
            fs.unlinkSync(filePath)
            log.info(`Archivo eliminado: ${filePath}`)
          } catch (err) {
            log.error(`Error al eliminar el archivo ${filePath}:`, err)
          }
        }

        // Notificar al usuario si hubo errores
        if (extractionErrors > 0) {
          showNotificationIfBackground(
            'Instalación completada con advertencias',
            `El juego ${gameData.title} se instaló, pero hubo ${extractionErrors} errores durante la extracción.`
          )
        } else {
          showNotificationIfBackground(
            'Instalación completada',
            `El juego ${gameData.title} se ha instalado correctamente.`
          )
        }

        event.sender.send('installation-complete', {
          id: gameData.id,
          installPath: downloadPath,
          exePath: gameData.executable ? path.join(extractPath, gameData.executable) : extractPath
        })
      } catch (error: any) {
        log.error('Download error:', error)
        updateProgressBar(-1)
        event.sender.send('download-error', {
          id: gameData.id,
          description: `Error al descargar ${gameData.title}`,
          error: error.message,
          errorCode: error.status || 'DOWNLOAD_ERROR'
        })
        activeDownloads.delete(gameData.id)
      }
    }
  )

  ipcMain.on('cancelDownload', (event, gameId: number) => {
    const dl = activeDownloads.get(gameId)
    if (dl) {
      dl.stop()
      activeDownloads.delete(gameId)
      log.info(`Download canceled for game ID: ${gameId}`)
      updateProgressBar(-1)
      event.sender.send('download-status', {
        id: gameId,
        status: 'canceled'
      })
    }
  })

  ipcMain.on('pauseDownload', (event, gameId: number) => {
    const dl = activeDownloads.get(gameId)
    if (dl) {
      dl.pause()
        .then((resumeData) => {
          pausedDownloads.set(gameId, { downloader: dl, resumeData })
          activeDownloads.delete(gameId)
          log.info(`Download paused for game ID: ${gameId}`)
          updateProgressBar(-1)
          event.sender.send('download-status', {
            id: gameId,
            status: 'paused'
          })
        })
        .catch((err) => {
          log.error(`Error pausing download for game ID: ${gameId}`, err)
        })
    }
  })

  // Alternativa usando .start() en lugar de .resume()
  ipcMain.on('resumeDownload', async (event, gameId: number) => {
    const paused = pausedDownloads.get(gameId)
    if (!paused) return
    event.sender.send('download-status', {
      id: gameId,
      status: 'resuming',
      message: 'Reanudando descarga...'
    })
    const { downloader } = paused
    activeDownloads.set(gameId, downloader)
    pausedDownloads.delete(gameId)

    try {
      await downloader.start()
      log.info(`Download resumed successfully for game ID: ${gameId}`)
    } catch (error) {
      log.error(`Resume failed for game ID: ${gameId}:`, error)
      event.sender.send('download-status', {
        id: gameId,
        status: 'paused'
      })
      event.sender.send('download-error', {
        id: gameId,
        error: 'RESUME_FAILED',
        message: 'No se pudo reanudar la descarga'
      })
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

  const { spawn, exec } = require('child_process')

  // Función auxiliar para verificar si Steam está en ejecución (Windows)
  function isSteamRunning(): Promise<boolean> {
    return new Promise((resolve) => {
      exec('tasklist', (error, stdout) => {
        if (error) {
          log.error('[isSteamRunning] Error al listar procesos:', error)
          resolve(false)
        } else {
          const isRunning = stdout.toLowerCase().includes('steam.exe')
          resolve(isRunning)
        }
      })
    })
  }

  ipcMain.on('launchGame', async (event, game: any) => {
    log.info('[launchGame] Evento recibido. Juego:', game)

    // Ocultar ventana principal al iniciar
    if (mainWindow) {
      log.info('[launchGame] Ocultando ventana principal')
      mainWindow.hide()
    } else {
      log.warn('[launchGame] mainWindow no está definido')
    }

    // --- Verificación de Steam (si es requerido) ---
    if (game.requireSteam) {
      log.info('[launchGame] El juego requiere Steam, verificando...')

      try {
        // 1. Verificar instalación
        const steamPath = getSteamPath()
        if (!steamPath) {
          throw new Error('install') // Lanzar error especial para instalación
        }
        log.info('[launchGame] Steam encontrado en:', steamPath)

        // 2. Verificar si está en ejecución
        const steamRunning = await isSteamRunning()
        if (!steamRunning) {
          throw new Error('running') // Lanzar error especial para ejecución
        }
        log.info('[launchGame] Steam está en ejecución.')
      } catch (error: any) {
        log.error('[launchGame] Error en Steam:', error.message)

        // Determinar el modo requerido
        const requireSteamMode = error.message.includes('install') ? 'install' : 'running'

        // Enviar respuesta de error
        event.sender.send('launch-end', {
          id: game.id,
          success: false,
          requireSteam: true,
          requireSteamMode: requireSteamMode, // 'install' o 'running'
          error: true,
          game: game
        })

        // Mostrar ventana principal si existe
        if (mainWindow) mainWindow.show()
        return
      }
    }

    // --- Lanzar el juego ---
    const exePath = game.exePath.includes(' ') ? `"${game.exePath}"` : game.exePath
    log.info('[launchGame] Iniciando juego:', exePath)

    const appProcess = spawn(exePath, [], {
      shell: true,
      detached: false
    })

    log.info('[launchGame] Proceso del juego PID:', appProcess.pid)

    // Manejo de errores
    appProcess.on('error', (err) => {
      log.error('[launchGame] Error al iniciar:', err)
      if (mainWindow) mainWindow.show()
      event.sender.send('launch-end', {
        id: game.id,
        success: false,
        error: {
          title: 'Error al iniciar el juego',
          description: 'No se pudo ejecutar el archivo del juego',
          severity: 'error',
          errorCode: 'GAME_LAUNCH_FAILED',
          errorDetails: err.message
        }
      })
    })

    // Cuando el juego se cierra
    appProcess.on('close', (code, signal) => {
      log.info(`[launchGame] Juego cerrado. Código: ${code}, Señal: ${signal}`)
      if (mainWindow) mainWindow.show()
      event.sender.send('launch-end', {
        id: game.id,
        success: code === 0,
        code: code,
        signal: signal,
        ...(code !== 0 && {
          error: {
            title: 'El juego se cerró inesperadamente',
            description: `El proceso del juego terminó con código ${code}`,
            severity: code === 0 ? 'none' : 'critical',
            errorCode: `GAME_EXIT_${code}`,
            errorDetails: signal ? `Señal recibida: ${signal}` : ''
          }
        })
      })
    })

    // Opcional: Logs de consola del juego
    appProcess.stdout?.on('data', (data) => {
      log.info(`[launchGame] stdout: ${data.toString().trim()}`)
    })

    appProcess.stderr?.on('data', (data) => {
      log.error(`[launchGame] stderr: ${data.toString().trim()}`)
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

  ipcMain.handle('open-steam', async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const steamPath = getSteamPath()
      if (!steamPath) {
        return { success: false, error: 'Steam no está instalado' }
      }

      // 1. Iniciar Steam minimizado
      const command = `"${steamPath}" -silent -nochatui`
      spawn(command, [], {
        shell: true,
        detached: true,
        windowsHide: true
      })

      // 2. Esperar a que Steam esté completamente inicializado
      const isReady = await waitForFullSteamStart(15000) // 15 segundos máximo
      return {
        success: isReady,
        error: isReady ? undefined : 'Steam no completó su inicialización'
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

  // Función mejorada de espera
  async function waitForFullSteamStart(timeout: number): Promise<boolean> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      // Verificar tanto el proceso como la ventana principal
      const [processRunning, windowExists] = await Promise.all([
        isSteamRunning(),
        checkSteamWindowExists()
      ])

      if (processRunning && windowExists) {
        return true // Steam completamente inicializado
      }

      await new Promise((resolve) => setTimeout(resolve, 500)) // Polling cada 500ms
    }

    return false // Timeout alcanzado
  }

  // Verifica si existe la ventana principal de Steam (Windows API)
  async function checkSteamWindowExists(): Promise<boolean> {
    try {
      const { execSync } = require('child_process')
      const stdout = execSync(
        'tasklist /FI "IMAGENAME eq steam.exe" /FI "WINDOWTITLE ne N/A" /NH'
      ).toString()
      return stdout.includes('steam.exe')
    } catch {
      return false
    }
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

  ipcMain.handle('fetchGameData', async () => {
    log.info('Fetching game data...')
    try {
      const response = await fetch(
        'https://secrecyfiles.github.io/fileshoster/secrecylauncher/data.json'
      )
      if (!response.ok) {
        throw new Error('No se pudo cargar los datos de los juegos')
      }
      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error al cargar los datos:', err)
      throw err
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
