const { parentPort, workerData } = require('worker_threads')
const fs = require('fs')
const path = require('path')
const https = require('https')
const { createWriteStream } = require('fs')
const AdmZip = require('adm-zip')
const { URL } = require('url')

const { downloadUrl, extractPath } = workerData
const javaDir = extractPath

// Crear directorio si no existe
if (!fs.existsSync(javaDir)) {
  fs.mkdirSync(javaDir, { recursive: true })
}

const tempZipPath = path.join(javaDir, 'java_temp.zip')

async function downloadWithRedirects(url, dest) {
  return new Promise((resolve, reject) => {
    const download = (currentUrl) => {
      const parsedUrl = new URL(currentUrl)
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        headers: {
          'User-Agent': 'Secrecy-Launcher'
        }
      }

      https
        .get(options, (response) => {
          // Manejar redireccionamientos
          if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
            if (!response.headers.location) {
              return reject(new Error(`Redirección sin cabecera Location`))
            }
            return download(response.headers.location)
          }

          if (response.statusCode !== 200) {
            return reject(new Error(`Error al descargar. Código: ${response.statusCode}`))
          }

          const file = createWriteStream(dest)
          const totalSize = parseInt(response.headers['content-length'], 10) || 0
          let downloadedSize = 0

          response.on('data', (chunk) => {
            downloadedSize += chunk.length
            const progress =
              totalSize > 0 ? Math.min(99, Math.floor((downloadedSize / totalSize) * 100)) : 0
            parentPort.postMessage({
              type: 'download-progress',
              progress,
              downloadedSize,
              totalSize
            })
          })

          response.pipe(file)
          file.on('finish', () => {
            file.close(() => {
              parentPort.postMessage({ type: 'status', message: 'Descarga completada' })
              resolve()
            })
          })
        })
        .on('error', (err) => {
          fs.unlink(dest, () => reject(err))
        })
    }

    download(url)
  })
}

async function extractZip(zipPath, targetPath) {
  try {
    if (!fs.existsSync(zipPath)) {
      throw new Error(`Archivo no encontrado: ${zipPath}`)
    }

    const zip = new AdmZip(zipPath)
    const zipEntries = zip.getEntries()
    const totalFiles = zipEntries.length

    parentPort.postMessage({
      type: 'extract-start',
      totalFiles,
      destination: targetPath
    })

    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true })
    }

    parentPort.postMessage({
      type: 'extract-progress',
      progress: 50,
      totalFiles
    })

    zip.extractAllTo(targetPath, true)

    parentPort.postMessage({
      type: 'extract-progress',
      progress: 100,
      totalFiles
    })

    return { success: true }
  } catch (err) {
    parentPort.postMessage({
      type: 'error',
      stage: 'extraction',
      error: err.message
    })
    return { success: false }
  }
}

function findJavaw(dir) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      const found = findJavaw(fullPath)
      if (found) return found
    } else if (file.toLowerCase() === 'javaw.exe') {
      return fullPath
    }
  }
  return null
}

async function processJDKInstallation() {
  try {
    // Paso 1: Descargar
    parentPort.postMessage({ type: 'status', message: `Descargando Java` })
    await downloadWithRedirects(downloadUrl, tempZipPath)

    // Paso 2: Extraer
    parentPort.postMessage({ type: 'status', message: `Instalando Java` })
    const { success } = await extractZip(tempZipPath, javaDir)

    // Paso 3: Limpieza
    try {
      if (fs.existsSync(tempZipPath)) {
        fs.unlinkSync(tempZipPath)
      }
    } catch (cleanErr) {
      console.error('Error al limpiar archivo temporal:', cleanErr)
    }

    if (success) {
      const javawPath = findJavaw(javaDir)
      if (javawPath) {
        parentPort.postMessage({
          type: 'done',
          javaPath: javawPath
        })
      } else {
        parentPort.postMessage({
          type: 'error',
          stage: 'verification',
          error: 'No se pudo encontrar javaw.exe en los archivos extraídos'
        })
      }
    }
  } catch (err) {
    parentPort.postMessage({
      type: 'error',
      stage: 'process',
      error: err.message,
      stack: err.stack
    })
  }
}

processJDKInstallation()
