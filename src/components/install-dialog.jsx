import { Download, RefreshCcw, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { useEffect, useState } from 'react'

export function InstallDialog({
  gameId,
  gameData,
  open,
  onOpenChange,
  isDownloadsSidebarOpen,
  setIsDownloadsSidebarOpen
}) {
  const game = gameData.find((g) => g.id === gameId)
  const [waitingForDownload, setWaitingForDownload] = useState(false)

  useEffect(() => {
    if (game.download && game.download.status === 'downloading' && waitingForDownload) {
      setIsDownloadsSidebarOpen(true)
      onOpenChange(false)
      setWaitingForDownload(false)
    }
  }, [game, waitingForDownload])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Instalar {game.title}</DialogTitle>
        <div className="relative p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </Button>

          <h2 className="text-2xl font-bold mb-6">Instalar {game.title}</h2>

          {!game.download && (
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
                  Ubicación: \AppData\Roaming\Secrecy Launcher\game-downloads\{game.id}
                </p>
              </div>

              <div className="pt-4">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    window.electron.ipcRenderer.send('installGame', game)
                    setWaitingForDownload(true)
                  }}
                  disabled={waitingForDownload}
                >
                  {waitingForDownload ? (
                    <RefreshCcw className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-5 w-5" />
                  )}
                  Instalar ahora
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
