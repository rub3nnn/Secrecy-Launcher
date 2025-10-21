import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { HardDrive, FolderOpen } from 'lucide-react'

const store = window.storage
const { ipcRenderer } = window.electron

export function VersionUpdateAnimation() {
  const [open, setOpen] = useState(false)
  const [hasDDrive, setHasDDrive] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkRelocateData = async () => {
      // Verificar si ya se mostró el aviso
      const relocateDataSeen = store.get('advertseen.relocatedata')

      if (relocateDataSeen === true) {
        setIsChecking(false)
        return
      }

      // Verificar si existe la unidad D:
      try {
        const result = await window.electron.ipc.invoke('check-d-drive', {})
        if (result.exists) {
          setHasDDrive(true)
          setOpen(true)
        }
      } catch (error) {
        console.error('Error checking D: drive:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkRelocateData()
  }, [])

  const handleAccept = async () => {
    try {
      // Crear la estructura en D:\SecrecyLauncher
      await window.electron.ipc.invoke('setup-custom-path', {})

      // Reiniciar la aplicación
      window.electron.ipc.send('restart-app', {})
    } catch (error) {
      console.error('Error setting up custom path:', error)
      alert('Error al configurar la nueva ubicación. Por favor, inténtalo de nuevo.')
    }
  }

  const handleDecline = () => {
    store.set('advertseen.relocatedata', true)
    setOpen(false)
  }

  if (isChecking) {
    return null // O un spinner si prefieres
  }

  if (!hasDDrive) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className=" bg-white border-slate-200 text-slate-900">
          <DialogHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <HardDrive className="w-8 h-8 text-blue-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ubicación de Almacenamiento Detectada
            </DialogTitle>
            <DialogDescription className="text-slate-700 text-base leading-relaxed space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <HardDrive className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">
                      Se ha detectado la unidad D:
                    </h4>
                    <div className="text-sm text-slate-700 space-y-2">
                      <p>
                        Hemos encontrado que tu sistema tiene una unidad D: disponible.
                        <span className="font-semibold text-blue-600">
                          {' '}
                          ¿Te gustaría guardar los archivos de Secrecy Launcher ahí?
                        </span>
                      </p>
                      <div className="mt-3 p-3 bg-white rounded border border-blue-100">
                        <p className="text-xs font-medium text-slate-600 mb-1">
                          La nueva ubicación será:
                        </p>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-blue-700 font-mono">
                          D:\SecrecyLauncher
                        </code>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Esto puede ayudar a liberar espacio en tu unidad principal y mejorar el
                        rendimiento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 text-center mt-4">
                Si aceptas, la aplicación se reiniciará automáticamente para aplicar los cambios.
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-3 mt-6">
            <Button
              onClick={handleDecline}
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6"
            >
              No, mantener ubicación actual
            </Button>
            <Button
              onClick={handleAccept}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 font-semibold"
            >
              Sí, usar D:\SecrecyLauncher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
