// extractWorker.js
const { parentPort, workerData } = require('worker_threads')
const fs = require('fs')
const path = require('path')
const { createExtractorFromFile } = require('node-unrar-js')
const AdmZip = require('adm-zip')

const filePaths = workerData.filePaths
const extractPath = workerData.extractPath
const deleteAfter = workerData.deleteAfter || false

let totalFiles = 0
let extractedFiles = 0
let extractionErrors = 0

async function extractRar(filePath) {
  try {
    const extractor = await createExtractorFromFile({
      filepath: filePath,
      targetPath: extractPath
    })

    const list = extractor.getFileList()
    const fileHeaders = [...list.fileHeaders]
    totalFiles += fileHeaders.length

    if (fileHeaders.length === 0) {
      return
    }

    const extracted = extractor.extract()
    for (const { fileHeader } of extracted.files) {
      try {
        extractedFiles++
        const progress = Math.min(99, Math.floor((extractedFiles / totalFiles) * 100))
        parentPort.postMessage({
          type: 'progress',
          fileName: fileHeader.name,
          progress
        })
      } catch (err) {
        console.error('Error al extraer archivo:', fileHeader.name, err)
        extractionErrors++
      }
    }
  } catch (err) {
    console.error('Error al extraer RAR:', err)
    extractionErrors++
    throw err
  }
}

async function extractZip(filePath) {
  try {
    const zip = new AdmZip(filePath)
    const zipEntries = zip.getEntries()
    totalFiles += zipEntries.length

    for (const entry of zipEntries) {
      try {
        extractedFiles++
        const progress = Math.min(99, Math.floor((extractedFiles / totalFiles) * 100))
        parentPort.postMessage({
          type: 'progress',
          fileName: entry.entryName,
          progress
        })
      } catch (err) {
        console.error('Error al procesar entrada ZIP:', entry.entryName, err)
        extractionErrors++
      }
    }

    zip.extractAllTo(extractPath, true)
  } catch (err) {
    console.error('Error al extraer ZIP:', err)
    extractionErrors++
    throw err
  }
}

async function extract() {
  try {
    for (const filePath of filePaths) {
      if (filePath.endsWith('.rar')) {
        await extractRar(filePath)
      } else if (filePath.endsWith('.zip')) {
        await extractZip(filePath)
      }

      // Eliminar archivo después de extraer si se especificó
      if (deleteAfter) {
        try {
          fs.unlinkSync(filePath)
          console.log(`Archivo eliminado: ${filePath}`)
        } catch (err) {
          console.error(`Error al eliminar archivo ${filePath}:`, err)
          extractionErrors++
        }
      }
    }

    parentPort.postMessage({
      type: 'done',
      extractionErrors,
      totalFiles,
      extractedFiles: extractedFiles - extractionErrors
    })
  } catch (err) {
    parentPort.postMessage({
      type: 'error',
      error: err.message,
      stage: 'extraction'
    })
  }
}

extract()
