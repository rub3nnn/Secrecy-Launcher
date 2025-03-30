'use client'

import { AlertTriangle, X, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'

export function UninstallDialog({ game, open, onOpenChange, onConfirm }) {
  const [isUninstalling, setIsUninstalling] = useState(false)
  const [error, setError] = useState(null)

  const handleUninstall = async () => {
    setIsUninstalling(true)
    setError(null)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (err) {
      setError('Error al desinstalar. Por favor, inténtalo de nuevo.')
      console.error('Uninstall error:', err)
    } finally {
      setIsUninstalling(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={isUninstalling ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            disabled={isUninstalling}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
            {isUninstalling ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <AlertTriangle className="h-6 w-6" />
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold">¿Desinstalar {game.title}?</h2>
            <p className="text-muted-foreground mt-2">
              Esta acción eliminará el juego de tu dispositivo y liberará {game.size} de espacio.
              Podrás reinstalarlo en cualquier momento.
            </p>
            {game.installPath && (
              <p className="text-sm text-muted-foreground mt-2">
                Ruta de instalación: {game.installPath}
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 w-full mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isUninstalling}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="flex-1 text-white"
              onClick={handleUninstall}
              disabled={isUninstalling}
            >
              {isUninstalling ? 'Desinstalando...' : 'Desinstalar'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
