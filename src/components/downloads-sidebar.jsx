'use client'

import {
  Download,
  Pause,
  Play,
  X,
  Settings,
  ChevronRight,
  HardDrive,
  RefreshCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'

export function DownloadsSidebar({ games, isOpen, onClose }) {
  // Manejar pausa/reanudación de descarga
  const togglePause = (id) => {
    if (games.find((game) => game.id === id).download.status === 'paused') {
      window.electron.ipcRenderer.send('resumeDownload', id)
    } else {
      window.electron.ipcRenderer.send('pauseDownload', id)
    }
  }

  // Cancelar descarga
  const cancelDownload = (id) => {
    window.electron.ipcRenderer.send('cancelDownload', id)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar de descargas */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-[400px] bg-card border-l shadow-lg z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Descargas</h2>
                <Badge variant="secondary" className="ml-1">
                  {games.length}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 flex flex-col px-4 pt-2">
              {games.length === 0 ? (
                <div className="text-center py-8">
                  <Download className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-muted-foreground">No hay descargas activas</p>
                </div>
              ) : (
                games.map((game) => (
                  <div key={game.id} className="bg-muted/30 rounded-lg overflow-hidden">
                    <div className="p-3">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={game.image}
                            alt={game.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{game.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                            <Badge
                              variant={
                                game.download.status === 'completed'
                                  ? 'secondary'
                                  : game.download.status === 'paused'
                                    ? 'outline'
                                    : 'default'
                              }
                              className={`text-xs px-1 py-0 h-4 ${game.download.status === 'completed' && 'bg-green-100'}`}
                            >
                              {game.download.status === 'completed' && 'Completado'}
                              {game.download.status === 'paused' && 'Pausado'}
                              {game.download.status === 'downloading' && 'Descargando'}
                              {game.download.status === 'installing' && 'Instalando'}
                              {game.download.status === 'resuming' && 'Reanudando'}
                            </Badge>
                          </div>
                        </div>
                        {game.download.status != 'completed' && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => togglePause(game.id)}
                              disabled={
                                game.download.status === 'installing' ||
                                game.download.status === 'resuming'
                              }
                            >
                              {game.download.status === 'paused' ? (
                                <Play className="h-4 w-4" />
                              ) : (
                                <Pause className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => cancelDownload(game.id)}
                              disabled={
                                game.download.status === 'paused' ||
                                game.download.status === 'resuming' ||
                                game.download.status === 'installing'
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {game.download.status != 'completed' && (
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>{game.download.message}</span>
                              <span>{game.download.progress}%</span>
                            </div>
                            <Progress value={game.download.progress} className="h-2" />
                          </div>

                          <div className="flex justify-between text-xs text-muted-foreground">
                            <div className="flex items-center">
                              {game.download.status === 'installing' ? (
                                <RefreshCcw className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <Download className="h-3 w-3 mr-1" />
                              )}
                              <span>
                                {game.download.status === 'paused'
                                  ? 'Pausado'
                                  : game.download.status === 'installing'
                                    ? 'Instalando'
                                    : `${((game.download.speed * 8) / 1_000_000).toFixed(2)} Mb/s`}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <HardDrive className="h-3 w-3 mr-1" />
                              <span>
                                {game.download.status === 'paused'
                                  ? '-'
                                  : (game.download.total - game.download.downloaded) /
                                        game.download.speed <
                                      60
                                    ? 'Unos segundos'
                                    : (() => {
                                        const totalMinutes =
                                          (game.download.total - game.download.downloaded) /
                                          game.download.speed /
                                          60
                                        // Verificar si el resultado es infinito
                                        if (!isFinite(totalMinutes)) {
                                          return 'Cargando...'
                                        }
                                        const hours = Math.floor(totalMinutes / 60)
                                        const minutes = Math.floor(totalMinutes % 60)
                                        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
                                      })()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t flex justify-between items-center">
              <div className="text-xs text-muted-foreground"></div>
              <Button variant="ghost" size="sm" className="h-7 gap-1" disabled>
                <Settings className="h-3 w-3" />
                <span>Configuración</span>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
