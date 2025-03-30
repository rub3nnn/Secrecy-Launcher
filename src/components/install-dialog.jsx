'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

export function InstallDialog({ game, open, onOpenChange, onComplete, onError }) {
  const [step, setStep] = useState('specs')
  const [downloadProgress, setDownloadProgress] = useState('')
  const [installProgress, setInstallProgress] = useState('')

  useEffect(() => {
    if (open && step === 'install') {
      window.electron.ipcRenderer.send('installGame', game)
      setStep('downloading')
    }
    if (open && step === 'downloading') {
      window.electron.ipcRenderer.on('download-progress', (event, data) => {
        console.log(data)
        setDownloadProgress(data)
      })
      window.electron.ipcRenderer.on('download-error', (event, data) => {
        console.log(data)
        onError(data)
      })
      window.electron.ipcRenderer.on('download-complete', () => {
        setStep('installing')
      })
    }
    if (open && step === 'installing') {
      window.electron.ipcRenderer.on('installing-progress', (event, data) => {
        setInstallProgress(data)
      })
      window.electron.ipcRenderer.on('installation-complete', (event, data) => {
        console.log(data)
        setStep('complete')
        setTimeout(() => {
          onComplete(data.id, data.installPath, data.exePath)
        }, 2500)
      })
    }
  }, [open, step])

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setStep('specs')
      setDownloadProgress({ progress: 0 })
      setInstallProgress({ progress: 0 })
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          {step === 'downloading' ? 'Descargando' : 'Instalar'} {game.title}
        </DialogTitle>
        <div className="relative p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4"
            disabled={step === 'installing'}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </Button>

          <h2 className="text-2xl font-bold mb-6">
            {step === 'downloading' ? 'Descargando' : 'Instalar'} {game.title}
          </h2>

          {step === 'specs' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Requisitos del sistema</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Mínimos</h4>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                      {game.systemRequirements.minimum.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Recomendados</h4>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                      {game.systemRequirements.recommended.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Información de instalación</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Tamaño de descarga: {game.size}
                </p>
                <p className="text-sm text-muted-foreground">
                  Ubicación: C:\SecrecyLauncher\Games\{game.title.replace(/\s+/g, '')}
                </p>
              </div>

              <div className="pt-4">
                <Button size="lg" className="w-full" onClick={() => setStep('install')}>
                  <Download className="mr-2 h-5 w-5" />
                  Instalar ahora
                </Button>
              </div>
            </div>
          )}

          {step === 'downloading' && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Descargando...</span>
                  <span>{downloadProgress.progress}%</span>
                </div>
                <Progress value={downloadProgress.progress} className="h-3" />
              </div>

              <div className="space-y-2">
                <p className="text-sm">
                  Descargando... ({((downloadProgress.speed * 8) / 1_000_000).toFixed(2)} Mbps)
                </p>
                <p className="text-sm">
                  Tiempo restante estimado:{' '}
                  {(
                    (downloadProgress.total - downloadProgress.downloaded) /
                    downloadProgress.speed /
                    60
                  ).toFixed(0) === '0'
                    ? 'Unos segundos'
                    : `${(
                        (downloadProgress.total - downloadProgress.downloaded) /
                        downloadProgress.speed /
                        60
                      ).toFixed(0)} minutos`}
                </p>

                <p className="text-sm text-muted-foreground">
                  Por favor, no cierre la aplicación durante la instalación.
                </p>
              </div>
            </div>
          )}

          {step === 'installing' && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Instalando...</span>
                  <span>{installProgress.progress}%</span>
                </div>
                <Progress value={installProgress.progress} className="h-3" />
              </div>

              <div className="space-y-2">
                <p className="text-sm">{installProgress.message}</p>
                <p className="text-sm text-muted-foreground">
                  Por favor, no cierre la aplicación durante la instalación.
                </p>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="space-y-6 text-center">
              <div className="py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">¡Instalación completada!</h3>
                <p className="text-muted-foreground mt-2">
                  {game.title} ha sido instalado correctamente.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
