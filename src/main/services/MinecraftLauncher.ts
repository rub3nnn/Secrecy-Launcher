import { Client, Authenticator } from 'minecraft-launcher-core'
import path from 'path'
import fs from 'fs'
import log from 'electron-log'
import { BrowserWindow } from 'electron'
import { ConfigStore, getMinecraftDir } from './ConfigStore'
import { JavaManager } from './JavaManager'
import { ErrorParserService } from './ErrorParserService'

function setupLauncherEvents(
  launcher: Client,
  mainWindow: BrowserWindow | null,
  installProgressStageName: string,
  launchMessage: string
): void {
  const logBuffer: string[] = []

  launcher.on('debug', (data) => {
    const line = String(data).trim()
    if (line) {
      console.log('Minecraft debug:', line)
      logBuffer.push(line)
      if (logBuffer.length > 200) logBuffer.shift()
    }
  })

  launcher.on('data', (data) => {
    const line = String(data).trim()
    if (line) {
      console.log('Minecraft data:', line)
      logBuffer.push(line)
      if (logBuffer.length > 200) logBuffer.shift()
    }
  })

  launcher.on('progress', (e) => {
    let percent = 0
    if (e && typeof e.task === 'number' && typeof e.total === 'number' && e.total > 0) {
      percent = Math.floor((e.task / e.total) * 100)
    }
    mainWindow?.webContents.send('minecraft-status', {
      stage: installProgressStageName,
      progress: percent,
      message: `${launchMessage} ${percent}%`
    })
  })

  launcher.on('arguments', () => {
    mainWindow?.webContents.send('minecraft-status', {
      stage: 'launching',
      message: 'Iniciando...'
    })
    mainWindow?.hide()
  })

  launcher.on('close', (code) => {
    log.info(`[MinecraftLauncher] Process closed with exit code: ${code}`)
    mainWindow?.show()
    mainWindow?.webContents.send('minecraft-status', { stage: 'closed' })

    const parsedError = ErrorParserService.parseLogs(logBuffer, code)
    if (parsedError) {
      log.error('[MinecraftLauncher] Minecraft crash detected:', parsedError)
      mainWindow?.webContents.send('minecraft-error', {
        title: parsedError.title,
        description: parsedError.description,
        severity: parsedError.severity,
        errorCode: parsedError.errorCode,
        errorDetails: parsedError.errorDetails
      })
    }
  })

  launcher.on('error', (err) => {
    log.error('[MinecraftLauncher] Launcher emitted error:', err)
    mainWindow?.show()
    mainWindow?.webContents.send('minecraft-status', { stage: 'closed' })
    
    // Check if error message can be parsed or use a default representation
    const logMessage = err instanceof Error ? err.message : String(err)
    const tempBuffer = [logMessage, ...logBuffer]
    const parsedError = ErrorParserService.parseLogs(tempBuffer, null)
    
    if (parsedError) {
      mainWindow?.webContents.send('minecraft-error', {
        title: parsedError.title,
        description: parsedError.description,
        severity: parsedError.severity,
        errorCode: parsedError.errorCode,
        errorDetails: parsedError.errorDetails
      })
    } else {
      mainWindow?.webContents.send('minecraft-error', {
        title: 'Error de Lanzamiento',
        description: logMessage,
        severity: 'error',
        errorCode: 'LAUNCHER_EMITTED_ERROR',
        errorDetails: logMessage
      })
    }
  })
}

async function checkInternetConnection(): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      cache: 'no-cache'
    })
    return response.ok
  } catch {
    return false
  }
}



export const MinecraftLauncher = {
  async getVersions(): Promise<any> {
    try {
      const minecraftDir = getMinecraftDir()
      const versionsDir = path.join(minecraftDir, 'versions')
      
      const installedVersions: string[] = []
      const customVersions: any[] = []

      if (fs.existsSync(versionsDir)) {
        const versionFolders = fs.readdirSync(versionsDir)
        for (const folder of versionFolders) {
          const versionJsonPath = path.join(versionsDir, folder, `${folder}.json`)
          if (fs.existsSync(versionJsonPath)) {
            try {
              const versionData = JSON.parse(fs.readFileSync(versionJsonPath, 'utf-8'))
              if (versionData.inheritsFrom) {
                customVersions.push({
                  id: folder,
                  type: 'custom',
                  inheritsFrom: versionData.inheritsFrom
                })
              } else {
                installedVersions.push(folder)
              }
            } catch (e) {
              log.error(`Error reading version folder ${folder}:`, e)
            }
          }
        }
      }

      let manifest: any = null
      let isOnline = true

      try {
        const manifestResponse = await fetch(
          'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json',
          { signal: AbortSignal.timeout(5000) }
        )
        if (manifestResponse.ok) {
          manifest = await manifestResponse.json()
        }
      } catch (error) {
        log.warn('[MinecraftLauncher] Offline mode version list loading')
        isOnline = false
      }

      if (installedVersions.length === 0 && customVersions.length === 0 && !isOnline) {
        log.warn('[MinecraftLauncher] No installed versions found and offline')
      }

      const result: { versions: any[] } = { versions: [] }

      if (manifest && isOnline) {
        const officialVersions = manifest.versions.map((v: any) => ({
          id: v.id,
          type: v.type === 'release' || v.type === 'snapshot' ? v.type : 'release',
          releaseTime: v.releaseTime
            ? new Date(v.releaseTime).toLocaleDateString('es-ES')
            : undefined,
          isLatestRelease: v.id === manifest.latest.release,
          isLatestSnapshot: v.id === manifest.latest.snapshot,
          isInstalled: installedVersions.includes(v.id)
        }))

        officialVersions.sort(
          (a: any, b: any) => new Date(b.releaseTime || 0).getTime() - new Date(a.releaseTime || 0).getTime()
        )
        result.versions.push(...officialVersions)
      } else {
        const localVersions = installedVersions.map((id) => ({
          id,
          type: 'release',
          isInstalled: true
        }))
        result.versions.push(...localVersions)
      }

      customVersions.forEach((custom) => {
        const parentIndex = custom.inheritsFrom
          ? result.versions.findIndex((v) => v.id === custom.inheritsFrom)
          : -1

        if (parentIndex >= 0) {
          result.versions.splice(parentIndex + 1, 0, {
            id: custom.id,
            type: 'custom',
            inheritsFrom: custom.inheritsFrom,
            isInstalled: true
          })
        } else {
          result.versions.push({
            id: custom.id,
            type: 'custom',
            inheritsFrom: custom.inheritsFrom,
            isInstalled: true
          })
        }
      })

      return result
    } catch (err) {
      log.error('[MinecraftLauncher] Error loading versions:', err)
      throw err
    }
  },

  async launchMinecraft(mainWindow: BrowserWindow | null): Promise<void> {
    const minecraftDir = getMinecraftDir()

    try {
      const isOnline = await checkInternetConnection()

      if (!isOnline) {
        const selectedVersion = ConfigStore.get('minecraft.settings.selectedVersion') as any
        const versionId = selectedVersion.type === 'custom' ? selectedVersion.inheritsFrom! : selectedVersion.id
        const versionPath = path.join(minecraftDir, 'versions', versionId)
        const jarPath = path.join(versionPath, `${versionId}.jar`)

        if (!fs.existsSync(jarPath)) {
          mainWindow?.webContents.send('minecraft-status', { stage: 'closed' })
          mainWindow?.webContents.send('minecraft-error', {
            title: 'Sin Conexión a Internet',
            description: 'No se puede lanzar Minecraft sin conexión porque faltan archivos del juego. Por favor, conéctate a internet primero.',
            severity: 'error',
            errorCode: 'OFFLINE_NO_FILES'
          })
          return
        }
      }

      const selectedVersion = ConfigStore.get('minecraft.settings.selectedVersion') as any
      let javaPath = ConfigStore.get('minecraft.settings.customJavaPath') as string || 'Automático'

      if (javaPath === 'Automático' || !javaPath.trim()) {
        const mcVersion = selectedVersion.inheritsFrom || selectedVersion.id
        const requiredJavaVer = await JavaManager.getRequiredJavaVersion(mcVersion)
        javaPath = await JavaManager.getJava(requiredJavaVer, mainWindow)
      } else {
        if (!fs.existsSync(javaPath)) {
          throw new Error(`El ejecutable de Java especificado no existe en la ruta: ${javaPath}`)
        }
      }
      log.info(`[MinecraftLauncher] Java found at: ${javaPath}`)

      const userAccount = ConfigStore.get('minecraft.userAccount') as {
        type: string
        username: string
      }
      const premiumSession = ConfigStore.get('minecraft.auth') as any
      const memoryAllocation = ConfigStore.get('minecraft.settings.memoryAllocation') as [number, number]

      const opts: any = {
        authorization:
          userAccount.type === 'premium'
            ? premiumSession
            : Authenticator.getAuth(userAccount.username ?? 'Player'),
        root: minecraftDir,
        javaPath: javaPath,
        version:
          selectedVersion.type === 'custom'
            ? {
                number: selectedVersion.inheritsFrom!,
                custom: selectedVersion.id,
                type: 'Secrecy'
              }
            : {
                number: selectedVersion.id,
                type: selectedVersion.type
              },
        memory: {
          min: memoryAllocation?.[0] ?? 1024,
          max: memoryAllocation?.[1] ?? 4096
        },
        offline: !isOnline
      }

      // Add options if configured
      const quickPlayType = ConfigStore.get('minecraft.settings.quickPlayType')
      const quickPlayIdentifier = ConfigStore.get('minecraft.settings.quickPlayIdentifier')
      if (quickPlayType && quickPlayIdentifier) {
        opts.quickPlay = {
          type: quickPlayType,
          identifier: quickPlayIdentifier
        }
      }

      const fullscreen = ConfigStore.get('minecraft.settings.fullscreen')
      const windowWidth = ConfigStore.get('minecraft.settings.windowWidth')
      const windowHeight = ConfigStore.get('minecraft.settings.windowHeight')
      if (fullscreen !== undefined && windowWidth && windowHeight) {
        opts.window = {
          fullscreen,
          width: windowWidth,
          height: windowHeight
        }
      }

      const proxyHost = ConfigStore.get('minecraft.settings.proxyHost')
      const proxyPort = ConfigStore.get('minecraft.settings.proxyPort')
      if (proxyHost && proxyPort) {
        opts.proxy = {
          host: proxyHost,
          port: proxyPort,
          username: ConfigStore.get('minecraft.settings.proxyUsername') || undefined,
          password: ConfigStore.get('minecraft.settings.proxyPassword') || undefined
        }
      }

      const timeout = ConfigStore.get('minecraft.settings.minecraftTimeout')
      if (timeout !== undefined && timeout !== null) {
        opts.timeout = timeout
      }

      const customLaunchArgs = ConfigStore.get('minecraft.settings.customMcArgs')
      if (Array.isArray(customLaunchArgs) && customLaunchArgs.length > 0) {
        opts.customLaunchArgs = customLaunchArgs
      }

      const customJavaArgs = ConfigStore.get('minecraft.settings.customJavaArgs')
      if (Array.isArray(customJavaArgs) && customJavaArgs.length > 0) {
        opts.customArgs = customJavaArgs
      }

      const launcher = new Client()
      setupLauncherEvents(
        launcher,
        mainWindow,
        'installing-minecraft',
        'Cargando archivos de Minecraft...'
      )
      launcher.launch(opts)
    } catch (error: any) {
      log.error('[MinecraftLauncher] Failed to launch Minecraft:', error)
      mainWindow?.show()
      mainWindow?.webContents.send('minecraft-status', { stage: 'closed' })
      mainWindow?.webContents.send('minecraft-error', {
        title: 'Error al lanzar Minecraft',
        description: error instanceof Error ? error.message : String(error),
        severity: 'error',
        errorCode: 'LAUNCH_UNKNOWN_ERROR'
      })
    }
  }
}
