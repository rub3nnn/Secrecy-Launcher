import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

// Set custom app name and userData path for secrecy-minecraft
app.setName('secrecy-minecraft')
const appDataPath = path.join(app.getPath('appData'), 'secrecy-minecraft')
app.setPath('userData', appDataPath)

// Configure electron-log to use the correct secrecy-minecraft directory
log.transports.file.resolvePathFn = () => path.join(appDataPath, 'logs', 'main.log')

// Respond to synchronous get-user-data-path requests from preload
ipcMain.on('get-user-data-path', (event) => {
  event.returnValue = app.getPath('userData')
})

// Respond to synchronous get-default-minecraft-path requests from preload
ipcMain.on('get-default-minecraft-path', (event) => {
  event.returnValue = getDefaultMinecraftPath()
})

// Legacy Secrecy Launcher migration logic
const oldPaths = [
  path.join(app.getPath('appData'), 'Secrecy Launcher'),
  path.join(app.getPath('appData'), 'Secrecy Minecraft')
]
let oldLauncherFound = false

// Create the new folder if it doesn't exist yet
if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath, { recursive: true })
}

for (const oldPath of oldPaths) {
  if (fs.existsSync(oldPath)) {
    // Only trigger the visual migration screen if the original "Secrecy Launcher" is found
    if (oldPath.endsWith('Secrecy Launcher')) {
      oldLauncherFound = true
    }

    const oldConfigPath = path.join(oldPath, 'config.json')
    const newConfigPath = path.join(appDataPath, 'config.json')

    // If we have an old config.json and the new one doesn't exist yet, copy it
    if (fs.existsSync(oldConfigPath) && !fs.existsSync(newConfigPath)) {
      try {
        fs.copyFileSync(oldConfigPath, newConfigPath)
        log.info(`[Migration] Successfully copied config.json from ${oldPath} to ${appDataPath}`)
      } catch (copyErr: any) {
        log.error(`[Migration] Failed to copy config.json from ${oldPath}: ${copyErr.message}`)
      }
    }

    // Delete the old directory entirely
    try {
      deleteFolderRecursive(oldPath)
      log.info(`[Migration] Successfully deleted legacy folder: ${oldPath}`)
    } catch (delErr: any) {
      log.error(`[Migration] Failed to delete legacy folder ${oldPath}: ${delErr.message}`)
    }
  }
}

function deleteFolderRecursive(folderPath: string) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(folderPath)
  }
}

let mainWindow: BrowserWindow | null = null

import { ConfigStore, getDefaultMinecraftPath } from './services/ConfigStore'
import { AuthManager } from './services/AuthManager'
import { MinecraftLauncher } from './services/MinecraftLauncher'
import { JavaManager } from './services/JavaManager'

// Setup Logger
log.transports.file.level = 'info'
log.transports.file.maxSize = 5 * 1024 * 1024 // 5MB
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'

function getIconPath() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'icon.png')
    : path.join(__dirname, '../../resources/icon.png')
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 810,
    show: false,
    autoHideMenuBar: true,
    icon: getIconPath(),
    ...(process.platform === 'linux' ? { icon: getIconPath() } : {}),
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
  if (is.dev) {
    autoUpdater.forceDevUpdateConfig = true
  }

  autoUpdater.autoDownload = true

  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'rub3nnn',
    repo: 'Secrecy-Launcher'
  })

  autoUpdater.logger = {
    info: (message) => log.info('[Updater] Info:', message),
    error: (message) => log.error('[Updater] Error:', message),
    warn: (message) => log.warn('[Updater] Warn:', message),
    debug: (message) => log.debug('[Updater] Debug:', message)
  }

  autoUpdater.on('update-available', (info) => {
    log.info('[Updater] Update available:', info)
    mainWindow?.webContents.send('update-available', info)
  })

  autoUpdater.on('update-not-available', (info) => {
    mainWindow?.webContents.send('update-not-available', info)
  })

  autoUpdater.on('download-progress', (progressInfo) => {
    mainWindow?.webContents.send('update-download-progress', progressInfo)
  })

  autoUpdater.on('update-downloaded', (info) => {
    mainWindow?.webContents.send('update-downloaded', info)
  })

  autoUpdater.on('error', (error) => {
    log.error('[Updater] Error:', error)
    mainWindow?.webContents.send('update-error', error)
  })
}

function checkForUpdates(): void {
  if (is.dev) {
    log.info('[Updater] Skipped update check in development')
    return
  }
  autoUpdater.checkForUpdates().catch((err) => {
    log.error('[Updater] Failed update check:', err)
  })
}

// Bootstrap App
app.whenReady().then(() => {
  electronApp.setAppUserModelId('Secrecy Minecraft')

  setupAutoUpdater()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Core window/relaunch events
  ipcMain.on('ping', () => log.info('pong'))
  ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall()
  })
  ipcMain.on('restart-app', () => {
    app.relaunch()
    app.exit(0)
  })

  // Storage bindings (fallback helpers for renderer)
  ipcMain.handle('storageGet', (_, key: string) => ConfigStore.get(key))
  ipcMain.handle('storageSet', (_, key: string, value: any) => ConfigStore.set(key, value))

  // Minecraft Auth IPCs
  ipcMain.handle('minecraftLogin', async () => {
    return await AuthManager.loginMicrosoft()
  })

  // Minecraft Launcher IPCs
  ipcMain.on('launch-minecraft', () => {
    MinecraftLauncher.launchMinecraft(mainWindow)
  })
  ipcMain.handle('fetchMinecraftVersions', async () => {
    return await MinecraftLauncher.getVersions()
  })

  // Java Portable Manager IPCs
  ipcMain.handle('get-available-java-versions', async () => {
    return await JavaManager.getAvailableJavaReleases()
  })
  ipcMain.handle('get-installed-java', async () => {
    return await JavaManager.getInstalledJavaRuntimes()
  })
  ipcMain.handle('download-java-version', async (_, data: any) => {
    const { major, type, vendor } = data || {}
    return await JavaManager.downloadJava(major, type, vendor, mainWindow)
  })
  ipcMain.handle('delete-java-version', async (_, data: any) => {
    const { id } = data || {}
    return await JavaManager.deleteJavaRuntime(id)
  })
  ipcMain.handle('select-java-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      title: 'Seleccionar ejecutable de Java (javaw.exe)',
      filters: [{ name: 'Java Executable', extensions: ['exe'] }],
      properties: ['openFile']
    })
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0]
    }
    return null
  })
  ipcMain.handle('select-minecraft-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      title: 'Seleccionar Carpeta de Minecraft (.minecraft)',
      properties: ['openDirectory', 'createDirectory']
    })
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0]
    }
    return null
  })
  ipcMain.handle('fetchMinecraftNews', async () => {
    try {
      const response = await fetch(
        'https://net-secondary.web.minecraft-services.net/api/v1.0/es-es/search?pageSize=24&sortType=Recent&category=News'
      )
      if (!response.ok) throw new Error('Network response failed')
      return await response.json()
    } catch (err) {
      log.error('[Main] Failed to fetch Minecraft News:', err)
      return { entries: [] }
    }
  })

  // Helper IPCs
  ipcMain.on('open-external', (_, url: string) => {
    if (url) shell.openExternal(url)
  })

  // Split migration IPCs
  ipcMain.handle('check-legacy-migration', () => {
    const completed = ConfigStore.get('migration.splitInstallerCompleted') === true
    const skipped = ConfigStore.get('migration.splitInstallerSkipped') === true
    return {
      needsMigration: oldLauncherFound && !completed && !skipped
    }
  })

  ipcMain.handle('download-legacy-launcher', async () => {
    try {
      const url = 'https://api.github.com/repos/rub3nnn/secrecy-launcher-releases/releases/latest'
      const headers: HeadersInit = {
        'User-Agent': 'Secrecy-Minecraft-Launcher'
      }

      log.info(`[Migration] Fetching latest release from: ${url}`)
      const res = await fetch(url, { headers })
      if (!res.ok) throw new Error(`GitHub API error: ${res.statusText}`)
      const release = (await res.json()) as any

      const asset = release.assets?.find((a: any) => a.name.endsWith('.exe'))
      if (!asset) throw new Error('No executable installer (.exe) found in release.')

      log.info(`[Migration] Found asset: ${asset.name}, URL: ${asset.browser_download_url}`)
      const tempDir = app.getPath('temp')
      const destPath = path.join(tempDir, asset.name)

      const response = await fetch(asset.browser_download_url, {
        headers: {
          'User-Agent': 'Secrecy-Minecraft-Launcher'
        }
      })
      if (!response.ok) throw new Error(`Download failed: ${response.statusText}`)

      const totalSize = parseInt(response.headers.get('content-length') || '0', 10)
      let downloadedSize = 0

      const fileStream = fs.createWriteStream(destPath)
      const reader = response.body?.getReader()
      if (!reader) throw new Error('Failed to get download reader')

      let lastProgressTime = Date.now()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        downloadedSize += value.length
        fileStream.write(value)

        const now = Date.now()
        if (now - lastProgressTime > 150) {
          const percent = (downloadedSize / totalSize) * 100
          mainWindow?.webContents.send('download-legacy-progress', {
            percent,
            transferred: downloadedSize,
            total: totalSize
          })
          lastProgressTime = now
        }
      }
      await new Promise<void>((resolve, reject) => {
        fileStream.on('finish', () => resolve())
        fileStream.on('error', (err) => reject(err))
        fileStream.end()
      })

      log.info(`[Migration] Download finished. Executing installer via shell: ${destPath}`)
      await shell.openPath(destPath)

      ConfigStore.set('migration.splitInstallerCompleted', true)
      setTimeout(() => app.quit(), 500)
      return { success: true }
    } catch (err: any) {
      log.error('[Migration] Split download failed:', err)
      throw err
    }
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
