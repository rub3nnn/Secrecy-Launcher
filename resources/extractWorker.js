// extractWorker.js
const { parentPort, workerData } = require('worker_threads')
const fs = require('fs')
const path = require('path')
const { createExtractorFromFile } = require('node-unrar-js')
const AdmZip = require('adm-zip')

const gameData = workerData.gameData
const filePaths = workerData.filePaths
const extractPath = workerData.extractPath

let totalFiles = 0
let extractedFiles = 0
let extractionErrors = 0

async function extract() {
  for (const filePath of filePaths) {
    try {
      if (filePath.endsWith('.rar')) {
        const extractorOptions = {
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
          continue
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
          } catch {
            extractionErrors++
          }
        }
      } else if (filePath.endsWith('.zip')) {
        const zip = new AdmZip(filePath)
        const zipEntries = zip.getEntries()
        totalFiles += zipEntries.length

        if (gameData.extractPassword) {
          zip.setPassword(gameData.extractPassword)
        }

        for (const entry of zipEntries) {
          try {
            extractedFiles++
            const progress = Math.min(99, Math.floor((extractedFiles / totalFiles) * 100))
            parentPort.postMessage({
              type: 'progress',
              fileName: entry.entryName,
              progress
            })
          } catch {
            extractionErrors++
          }
        }

        zip.extractAllTo(extractPath, true)
      }
    } catch {
      extractionErrors++
    }
  }

  parentPort.postMessage({
    type: 'done',
    extractionErrors
  })
}

extract()
