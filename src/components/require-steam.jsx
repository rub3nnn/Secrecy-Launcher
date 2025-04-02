'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, AlertCircle, Download, X, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'

export function SteamRequirementNotification({ game, onClose, onContinue }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isInstalling, setIsInstalling] = useState(false)
  const [progress, setProgress] = useState(0)
  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setWaiting(false)
    setIsInstalling(false)
    window.electron.ipcRenderer.on('steam-download-progress', (event, data) => {
      setProgress(data.progress)
    })
    window.electron.ipcRenderer.on('steam-install-complete', () => {
      setWaiting(true)
    })
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      if (onClose) onClose()
    }, 300)
  }

  const handleContinue = () => {
    setIsVisible(false)
    setTimeout(() => {
      if (onContinue) onContinue()
    }, 300)
  }

  const handleInstallSteam = () => {
    setIsInstalling(true)
    setProgress(0)
    window.electron.ipcRenderer.send('install-steam')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-card rounded-lg shadow-xl overflow-hidden max-w-lg w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10"
                onClick={handleClose}
                disabled={isInstalling}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <AlertCircle className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold">Se requiere Steam</h2>
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-500 border-blue-500/20"
                      >
                        Requisito
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4">
                      Para jugar a {game.title} es necesario tener Steam instalado. No hemos
                      detectado Steam en tu sistema.
                    </p>

                    {!isInstalling ? (
                      <div className="space-y-4">
                        <div className="bg-muted p-3 rounded-md text-sm">
                          <p className="font-medium mb-1">¿Por qué se necesita Steam?</p>
                          <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                            <li>{game.title} utiliza las funciones multijugador de Steam</li>
                            <li>Las actualizaciones del juego se gestionan a través de Steam</li>
                            <li>Los logros y el progreso se sincronizan con tu cuenta de Steam</li>
                          </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button variant="outline" className="flex-1" onClick={handleContinue}>
                            Continuar de todos modos
                          </Button>
                          <Button
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleInstallSteam}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Instalar Steam
                          </Button>
                        </div>

                        <div className="text-center">
                          <Button
                            variant="link"
                            className="text-xs text-muted-foreground"
                            onClick={() =>
                              window.open('https://store.steampowered.com/about/', '_blank')
                            }
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Visitar sitio web de Steam
                          </Button>
                        </div>
                      </div>
                    ) : waiting ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <Settings className="h-5 w-5 text-blue-600" />
                            <h3 className="font-medium text-blue-800">
                              Termina de instalar y configurar Steam
                            </h3>
                          </div>
                          <p className="text-sm text-blue-700 mb-2">
                            El instalador de Steam se ha ejecutado, pero necesitas completar la
                            configuración:
                          </p>
                          <ol className="text-xs text-blue-600 space-y-1 list-decimal pl-5">
                            <li>Crea una cuenta nueva o inicia sesión con tu cuenta existente</li>
                            <li>Completa el proceso de configuración inicial de Steam</li>
                            <li>
                              Una vez configurado, haz clic en el botón "Continuar" para continuar
                              con el juego.
                            </li>
                          </ol>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleContinue}
                          >
                            Continuar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Descargando Steam...</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 transition-all duration-100 ease-out"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Por favor, espera mientras se descarga el instalador de Steam.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
