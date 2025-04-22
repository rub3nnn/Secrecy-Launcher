const { parentPort, workerData } = require('worker_threads')
const fs = require('fs')
const path = require('path')
const https = require('https')
const { createWriteStream } = require('fs')
const AdmZip = require('adm-zip')
const { URL } = require('url')

const { downloadUrl, extractPath, directoryName } = workerData
const javaDir = extractPath

// Crear directorio si no existe
if (!fs.existsSync(javaDir)) {
  fs.mkdirSync(javaDir, { recursive: true })
}

const tempZipPath = path.join(javaDir, 'temurin_temp.zip')

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
  let totalFiles = 0
  let extractionErrors = 0

  try {
    if (!fs.existsSync(zipPath)) {
      throw new Error(`Archivo no encontrado: ${zipPath}`)
    }

    const zip = new AdmZip(zipPath)
    const zipEntries = zip.getEntries()
    totalFiles = zipEntries.length

    parentPort.postMessage({
      type: 'extract-start',
      totalFiles,
      destination: targetPath
    })

    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true })
    }

    for (const entry of zipEntries) {
      try {
        const progress = Math.min(99, Math.floor(totalFiles * 100))
        parentPort.postMessage({
          type: 'extract-progress',
          fileName: entry.entryName,
          progress,
          totalFiles
        })
      } catch (err) {
        extractionErrors++
        parentPort.postMessage({
          type: 'extract-error',
          fileName: entry.entryName,
          error: err.message
        })
      }
    }

    zip.extractAllTo(targetPath, true)
    return { success: true, extractionErrors }
  } catch (err) {
    parentPort.postMessage({
      type: 'error',
      stage: 'extraction',
      error: err.message
    })
    return { success: false, extractionErrors }
  }
}

async function processJDKInstallation() {
  try {
    // Paso 1: Descargar con manejo de redirecciones
    parentPort.postMessage({ type: 'status', message: `Iniciando descarga de JDK` })
    await downloadWithRedirects(downloadUrl, tempZipPath)

    // Paso 2: Extraer el archivo
    parentPort.postMessage({ type: 'status', message: `Extrayendo JDK` })
    const targetPath = path.join(javaDir)
    const { success, extractionErrors } = await extractZip(tempZipPath, targetPath)

    // Paso 3: Limpieza
    try {
      if (fs.existsSync(tempZipPath)) {
        fs.unlinkSync(tempZipPath)
      }
    } catch (cleanErr) {
      console.error('Error al limpiar archivo temporal:', cleanErr)
    }

    if (success) {
      parentPort.postMessage({
        type: 'done',
        javaPath: path.join(extractPath, directoryName, 'bin', 'javaw.exe'),
        extractionErrors
      })
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
