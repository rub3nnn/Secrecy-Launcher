import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { AlertTriangle, Gamepad2, Pickaxe } from 'lucide-react'
const store = window.storage

export function VersionUpdateAnimation() {
  const [open, setOpen] = useState(store.get('advertseen.blockeddownloads') !== true)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white border-slate-200 text-slate-900">
          <DialogHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">!</span>
                </div>
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Aviso Importante - Secrecy Launcher
            </DialogTitle>
            <DialogDescription className="text-slate-700 text-base leading-relaxed space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-start gap-3 mb-3">
                  <Gamepad2 className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">
                      Problemas con Descarga de Juegos
                    </h4>
                    <div className="text-sm text-slate-700">
                      Debido a los recientes bloqueos de las operadoras a los servidores que proveen
                      los juegos,
                      <span className="font-semibold text-red-600">
                        {' '}
                        no podemos asegurar la disponibilidad
                      </span>{' '}
                      de las descargas de juegos en este momento.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <Pickaxe className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">
                      Nueva Funcionalidad Principal
                    </h4>
                    <div className="text-sm text-slate-700">
                      A partir de ahora,{' '}
                      <span className="font-semibold text-green-600">
                        Secrecy Launcher se enfocará principalmente en Minecraft
                      </span>
                      , donde podrás disfrutar de todas las funcionalidades sin interrupciones.
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 text-center mt-4">
                Agradecemos tu comprensión mientras trabajamos en solucionar estos inconvenientes
                técnicos.
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-3 mt-6">
            <Button
              onClick={() => {
                setOpen(false)
                store.set('advertseen.blockeddownloads', true)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 font-semibold"
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
