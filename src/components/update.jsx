'use client'

import { useState, useEffect } from 'react'
import { Download, X, Check, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { VersionUpdateAnimation } from '@/components/update-animation'

export function UpdateNotification() {
  const [updateInfo, setUpdateInfo] = useState({
    available: false,
    version: undefined,
    downloaded: undefined
  })

  const [isInstalling, setIsInstalling] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // Escuchar eventos de actualización desde el main process
    const updateAvailableListener = (_, info) => {
      setUpdateInfo({
        available: true,
        version: info.version,
        downloaded: false
      })
      setIsInstalling(true)
    }

    const updateDownloadedListener = (_, info) => {
      setUpdateInfo((prev) => ({
        ...prev,
        downloaded: true
      }))
    }

    const updateErrorListener = (_, error) => {
      console.error('Update error:', error)
      setUpdateInfo({ available: false })
      setIsInstalling(false)
    }

    const updateNotAvailable = async (_, info) => {
      setUpdateInfo({
        available: false,
        version: info.version,
        downloaded: false
      })
      const updated = await window.electron.ipcRenderer.invoke('storageGet', 'updated')
      if (updated === false) {
        setShowSuccess(true)
        window.electron.ipcRenderer.invoke('storageSet', 'updated', true)
        setTimeout(() => {
          setShowSuccess(false)
        }, 5000)
      }
    }

    window.electron.ipcRenderer.on('update-available', updateAvailableListener)
    window.electron.ipcRenderer.on('update-not-available', updateNotAvailable)
    window.electron.ipcRenderer.on('update-downloaded', updateDownloadedListener)
    window.electron.ipcRenderer.on('update-error', updateErrorListener)

    return () => {
      window.electron.ipcRenderer.removeListener('update-available', updateAvailableListener)
      window.electron.ipcRenderer.removeListener('update-downloaded', updateDownloadedListener)
      window.electron.ipcRenderer.removeListener('update-error', updateErrorListener)
    }
  }, [])
  useEffect(() => {
    if (updateInfo.downloaded) {
      window.electron.ipcRenderer.invoke('storageSet', 'updated', false)
      setTimeout(() => {
        window.electron.ipcRenderer.send('install-update')
      }, 2000)
    }
  }, [updateInfo.downloaded])

  const dismissUpdate = () => {
    setUpdateInfo({ available: false })
  }

  return (
    <>
      <VersionUpdateAnimation />
      {/* Notificación de actualización disponible */}
      <AnimatePresence>
        {false && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 max-w-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-card border rounded-lg shadow-lg p-4">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {updateInfo.downloaded
                        ? 'Actualización lista'
                        : 'Nueva actualización disponible'}
                    </h3>
                    {updateInfo.version && (
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        v{updateInfo.version}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {updateInfo.downloaded
                      ? 'La actualización está lista para instalarse.'
                      : 'Secrecy Launcher tiene una nueva actualización con mejoras y correcciones de errores.'}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={handleInstallUpdate}>
                      <Download className="h-4 w-4 mr-1" />
                      {updateInfo.downloaded ? 'Instalar ahora' : 'Descargar'} {updateInfo.progress}{' '}
                      %
                    </Button>
                    <Button size="sm" variant="outline" onClick={dismissUpdate}>
                      Más tarde
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-2"
                  onClick={dismissUpdate}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pantalla de instalación de actualización */}
      <AnimatePresence>
        {isInstalling && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card border rounded-lg shadow-lg p-6 max-w-md w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
                <h2 className="text-xl font-semibold">
                  {updateInfo.downloaded ? 'Instalando actualización' : 'Descargando actualización'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Por favor, no cierre la aplicación durante el proceso.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 max-w-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-card border rounded-lg shadow-lg p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                  <Check className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <h3 className="font-medium">Estás en la última versión</h3>
                    <p className="text-sm text-muted-foreground">
                      La aplicación se ha actualizado correctamente
                    </p>
                  </div>

                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    v{updateInfo.version}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
