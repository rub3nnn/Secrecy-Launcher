import { Worker } from 'worker_threads'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { execFile } from 'child_process'
import log from 'electron-log'
import { BrowserWindow, app } from 'electron'
import { ConfigStore, getDataPath, getMinecraftDir } from './ConfigStore'

export interface JavaRuntime {
  id: string // e.g. "temurin-jre-21"
  vendor: string // e.g. "Adoptium"
  type: 'jre' | 'jdk'
  major: number // e.g. 21
  path: string // full path to javaw.exe
}

function getJavaVersionFromExec(javaPath: string): Promise<number | null> {
  return new Promise((resolve) => {
    if (!fs.existsSync(javaPath)) {
      return resolve(null)
    }
    execFile(javaPath, ['-version'], (_, stdout, stderr) => {
      const output = stderr || stdout
      const match = output.match(/(?:java|openjdk) version "([^"]+)"/i)
      if (match) {
        const fullVersion = match[1]
        let major = parseInt(fullVersion.split('.')[0], 10)
        if (major === 1) {
          major = parseInt(fullVersion.split('.')[1], 10) // e.g. "1.8" -> 8
        }
        resolve(major)
      } else {
        resolve(null)
      }
    })
  })
}

function recursiveFindJavaw(dir: string): string | null {
  if (!fs.existsSync(dir)) return null
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    let stat
    try {
      stat = fs.statSync(fullPath)
    } catch {
      continue
    }
    if (stat.isDirectory()) {
      const found = recursiveFindJavaw(fullPath)
      if (found) return found
    } else if (file.toLowerCase() === 'javaw.exe') {
      return fullPath
    }
  }
  return null
}

function recursiveFindAllJavaw(dir: string, list: string[] = []): string[] {
  if (!fs.existsSync(dir)) return list
  let files: string[] = []
  try {
    files = fs.readdirSync(dir)
  } catch {
    return list
  }
  for (const file of files) {
    const fullPath = path.join(dir, file)
    let stat
    try {
      stat = fs.statSync(fullPath)
    } catch {
      continue
    }
    if (stat.isDirectory()) {
      recursiveFindAllJavaw(fullPath, list)
    } else if (file.toLowerCase() === 'javaw.exe') {
      list.push(fullPath)
    }
  }
  return list
}

async function findSystemJava(requiredMajor: number): Promise<string | null> {
  try {
    const defaultMajor = await getJavaVersionFromExec('javaw')
    if (defaultMajor === requiredMajor) {
      log.info(`[JavaManager] Encontrado Java ${requiredMajor} por defecto en PATH (javaw)`)
      return 'javaw'
    }
  } catch (err) {
    // javaw no está en el PATH
  }

  const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files'
  const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)'
  const localAppData = process.env['LOCALAPPDATA'] || ''
  const appData = process.env['APPDATA'] || ''
  const minecraftDir = getMinecraftDir()

  const searchDirs = [
    path.join(minecraftDir, 'runtime'),
    path.join(programFiles, 'Java'),
    path.join(programFilesX86, 'Java'),
    path.join(programFiles, 'Eclipse Adoptium'),
    path.join(programFiles, 'Eclipse Foundation'),
    path.join(programFiles, 'Zulu'),
    path.join(programFiles, 'Amazon Corretto'),
    path.join(programFiles, 'Microsoft'),
    path.join(localAppData, 'Programs', 'Adoptium'),
    path.join(localAppData, 'Packages', 'Microsoft.429489676D314_8wekyb3d8bbwe', 'LocalCache', 'Local', 'game', 'runtime'),
    path.join(appData, '.minecraft', 'runtime')
  ]

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue
    const javawPaths = recursiveFindAllJavaw(dir)
    for (const javawPath of javawPaths) {
      const major = await getJavaVersionFromExec(javawPath)
      if (major === requiredMajor) {
        log.info(`[JavaManager] Encontrado Java ${requiredMajor} del sistema/Minecraft oficial en: ${javawPath}`)
        return javawPath
      }
    }
  }

  return null
}

export const JavaManager = {
  // Get available Java versions from Adoptium API
  async getAvailableJavaReleases(): Promise<{ lts: number[]; all: number[] }> {
    try {
      const response = await fetch('https://api.adoptium.net/v3/info/available_releases')
      if (response.ok) {
        const data = await response.json() as any
        return {
          lts: data.available_lts_releases || [8, 11, 17, 21, 25],
          all: data.available_releases || [8, 11, 16, 17, 21, 25]
        }
      }
    } catch (err) {
      log.error('[JavaManager] Error fetching available releases from Adoptium API:', err)
    }
    return {
      lts: [8, 11, 17, 21, 25],
      all: [8, 11, 16, 17, 21, 25]
    }
  },

  // Map Minecraft version to required Java version
  async getRequiredJavaVersion(mcVersion: string): Promise<number> {
    const minecraftDir = getMinecraftDir()
    const localJsonPath = path.join(minecraftDir, 'versions', mcVersion, `${mcVersion}.json`)
    
    // 1. Try local version JSON
    if (fs.existsSync(localJsonPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(localJsonPath, 'utf-8'))
        if (data.javaVersion && typeof data.javaVersion.majorVersion === 'number') {
          return data.javaVersion.majorVersion
        }
      } catch (err) {
        log.warn(`[JavaManager] Error reading local version json for ${mcVersion}:`, err)
      }
    }

    // 2. Check if we have cached this version in ConfigStore
    const cachedVer = ConfigStore.get(`minecraft.java_version_cache.${mcVersion}`) as number
    if (cachedVer) {
      return cachedVer
    }

    // 3. Try fetching from Mojang API
    try {
      const manifestResponse = await fetch('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json')
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json() as any
        const verInfo = manifest.versions.find((v: any) => v.id === mcVersion)
        if (verInfo && verInfo.url) {
          const detailResponse = await fetch(verInfo.url)
          if (detailResponse.ok) {
            const details = await detailResponse.json() as any
            if (details.javaVersion && typeof details.javaVersion.majorVersion === 'number') {
              const major = details.javaVersion.majorVersion
              ConfigStore.set(`minecraft.java_version_cache.${mcVersion}`, major)
              return major
            }
          }
        }
      }
    } catch (err) {
      log.error(`[JavaManager] Error resolving required Java version for ${mcVersion} from API:`, err)
    }

    // 4. Hardcoded fallback calculation (if offline and local json doesn't exist)
    if (mcVersion.startsWith('1.21') || mcVersion.startsWith('1.22')) {
      return 21
    }
    const match = mcVersion.match(/^1\.(\d+)/)
    if (match) {
      const minor = parseInt(match[1], 10)
      if (minor >= 21) return 21
      if (minor >= 18) return 17
      if (minor >= 17) return 16
      return 8
    }
    if (/^24w|^25w/i.test(mcVersion)) return 25
    if (/^23w/i.test(mcVersion)) return 17
    
    return 21
  },

  // Scan disk to find installed portable runtimes
  async getInstalledJavaRuntimes(): Promise<JavaRuntime[]> {
    const javaDir = path.join(getDataPath(), 'java')
    if (!fs.existsSync(javaDir)) {
      return []
    }

    const runtimes: JavaRuntime[] = []
    const subdirs = fs.readdirSync(javaDir)

    for (const subdir of subdirs) {
      const fullSubdirPath = path.join(javaDir, subdir)
      if (!fs.statSync(fullSubdirPath).isDirectory()) continue

      const javawPath = recursiveFindJavaw(fullSubdirPath)
      if (javawPath) {
        // Parse metadata from directory name (format: vendor-type-major)
        const parts = subdir.split('-')
        const vendor = parts[0] || 'Adoptium'
        const type = (parts[1] === 'jre' || parts[1] === 'jdk' ? parts[1] : 'jre') as 'jre' | 'jdk'
        let major = parseInt(parts[2], 10)

        if (isNaN(major)) {
          // If we couldn't parse the version from folder name, autodetect it by running the binary
          const detectedMajor = await getJavaVersionFromExec(javawPath)
          major = detectedMajor || 17
        }

        runtimes.push({
          id: subdir,
          vendor,
          type,
          major,
          path: javawPath
        })
      }
    }

    return runtimes
  },

  // Delete a portable Java folder
  async deleteJavaRuntime(id: string): Promise<boolean> {
    try {
      const javaDir = path.join(getDataPath(), 'java', id)
      if (fs.existsSync(javaDir)) {
        fs.rmSync(javaDir, { recursive: true, force: true })
        log.info(`[JavaManager] Deleted portable Java: ${id}`)
        return true
      }
      return false
    } catch (err: any) {
      log.error(`[JavaManager] Error deleting portable Java: ${err.message}`)
      return false
    }
  },

  // Fetch JRE/JDK details using the API or direct links for various vendors
  async getReleaseInfo(
    vendor: string,
    major: number,
    type: 'jre' | 'jdk' = 'jre'
  ): Promise<{ downloadUrl: string } | null> {
    const arch = os.arch()
    const is64Bit = arch === 'x64' || arch === 'amd64'
    const architecture = is64Bit ? 'x64' : 'x32'

    try {
      if (vendor === 'temurin' || vendor === 'adoptium') {
        let response = await fetch(
          `https://api.adoptium.net/v3/assets/feature_releases/${major}/ga?architecture=${architecture}&image_type=${type}&jvm_impl=hotspot&os=windows`
        )

        if (!response.ok && type === 'jre') {
          log.warn(`[JavaManager] Adoptium JRE ${major} not found, falling back to JDK`)
          response = await fetch(
            `https://api.adoptium.net/v3/assets/feature_releases/${major}/ga?architecture=${architecture}&image_type=jdk&jvm_impl=hotspot&os=windows`
          )
        }

        if (!response.ok) {
          throw new Error(`Adoptium API responded with status ${response.status}`)
        }

        const releases = (await response.json()) as any[]
        if (!releases || releases.length === 0) {
          throw new Error(`No compatible releases found for Java ${major}`)
        }

        const firstRelease = releases[0]
        const binary = firstRelease.binaries?.[0]
        const link = binary?.package?.link

        if (!link) {
          throw new Error(`Release found but no download package link available`)
        }

        return { downloadUrl: link }
      }

      if (vendor === 'zulu') {
        let response = await fetch(
          `https://api.azul.com/metadata/v1/zulu/packages/?java_version=${major}&os=windows&arch=amd64&bundle_type=${type}&ext=zip&release_status=ga`
        )
        let packages: any[] = []
        if (response.ok) {
          packages = (await response.json()) as any[]
        }

        if ((!packages || packages.length === 0) && type === 'jre') {
          log.warn(`[JavaManager] Zulu JRE ${major} not found, falling back to JDK`)
          response = await fetch(
            `https://api.azul.com/metadata/v1/zulu/packages/?java_version=${major}&os=windows&arch=amd64&bundle_type=jdk&ext=zip&release_status=ga`
          )
          if (response.ok) {
            packages = (await response.json()) as any[]
          }
        }

        if (!response.ok || !packages || packages.length === 0) {
          throw new Error(`Zulu API query failed or empty`)
        }

        const link = packages[0]?.download_url
        if (!link) {
          throw new Error(`No download link in Zulu response`)
        }

        return { downloadUrl: link }
      }

      if (vendor === 'corretto') {
        if (major !== 8 && major !== 11 && major !== 17 && major !== 21) {
          throw new Error(`Version ${major} not supported by Corretto`)
        }
        const link = `https://corretto.aws/downloads/latest/amazon-corretto-${major}-x64-windows-jdk.zip`
        return { downloadUrl: link }
      }

      if (vendor === 'microsoft') {
        if (major !== 11 && major !== 17 && major !== 21) {
          throw new Error(`Version ${major} not supported by Microsoft OpenJDK`)
        }
        const link = `https://aka.ms/download-jdk/microsoft-jdk-${major}-windows-x64.zip`
        return { downloadUrl: link }
      }

      throw new Error(`Proveedor de Java no soportado: ${vendor}`)
    } catch (error: any) {
      log.error(`[JavaManager] Error fetching release info for ${vendor} ${major}: ${error.message}`)
      return null
    }
  },

  // Download and install a specific Java version
  async downloadJava(
    major: number,
    type: 'jre' | 'jdk' = 'jre',
    vendor: string = 'temurin',
    mainWindow: BrowserWindow | null = null
  ): Promise<string> {
    const release = await this.getReleaseInfo(vendor, major, type)
    if (!release) {
      throw new Error(`No se pudo obtener información de descarga para Java ${major} (${vendor})`)
    }

    const folderName = `${vendor}-${type}-${major}`
    const extractPath = path.join(getDataPath(), 'java', folderName)

    const workerPath = app.isPackaged
      ? path.join(process.resourcesPath, 'app.asar.unpacked/resources/javaWorker.js')
      : path.join(__dirname, '../../resources/javaWorker.js')

    return new Promise((resolve, reject) => {
      const worker = new Worker(workerPath, {
        workerData: {
          downloadUrl: release.downloadUrl,
          extractPath
        }
      })

      worker.on('message', (message) => {
        switch (message.type) {
          case 'download-progress':
            mainWindow?.webContents.send('minecraft-status', {
              stage: 'downloading-java',
              progress: message.progress,
              message: `Descargando Java ${major} (${vendor.toUpperCase()} ${type.toUpperCase()})... ${message.progress}%`
            })
            break
          case 'extract-progress':
            mainWindow?.webContents.send('minecraft-status', {
              stage: 'installing-java',
              progress: message.progress,
              message: `Instalando Java ${major} (${vendor.toUpperCase()})... ${message.progress}%`
            })
            break
          case 'done':
            const newJavaPath = message.javaPath
            log.info(`[JavaManager] Java ${major} (${vendor} ${type}) instalado en: ${newJavaPath}`)
            mainWindow?.webContents.send('minecraft-status', {
              stage: 'completed-java',
              progress: 100,
              message: `Java ${major} (${vendor}) instalado correctamente`
            })
            resolve(newJavaPath)
            break
          case 'error':
            log.error(`[JavaManager] Error en el worker de Java (${message.stage}): ${message.error}`)
            reject(new Error(message.error))
            break
        }
      })

      worker.on('error', (err) => reject(err))
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`El proceso de instalación de Java falló con código: ${code}`))
        }
      })
    })
  },

  // Resolve and get Java path dynamically for Minecraft launches
  async getJava(javaVer: number = 21, mainWindow: BrowserWindow | null = null): Promise<string> {
    // Look for a local portable installation of this major version
    const installed = await this.getInstalledJavaRuntimes()
    const match = installed.find((r) => r.major === javaVer)

    if (match && fs.existsSync(match.path)) {
      log.info(`[JavaManager] Usando Java ${javaVer} portable instalado: ${match.path}`)
      return match.path
    }

    // Check if there is a compatible Java on the system
    const systemJava = await findSystemJava(javaVer)
    if (systemJava) {
      log.info(`[JavaManager] Usando Java ${javaVer} del sistema: ${systemJava}`)
      return systemJava
    }

    // Otherwise download the JRE for this major version
    log.info(`[JavaManager] Java ${javaVer} no está instalado, iniciando descarga automática...`)
    return await this.downloadJava(javaVer, 'jre', 'temurin', mainWindow)
  }
}
