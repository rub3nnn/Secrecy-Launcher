'use client'

import { useState, useEffect, useRef } from 'react'
import { Download, Play, Star, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import video from '@renderer/assets/video.webm' // Adjust the path as necessary
import banner from '@renderer/assets/banner.jpg'

export function GameDetailsDialog({ game, open, onOpenChange, onToggleFavorite, onInstall }) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    if (open && videoRef.current && game.backgroundVideo && !videoLoaded) {
      const handleLoadedData = () => {
        setVideoLoaded(true)
      }

      const handleError = () => {
        setVideoError(true)
      }

      videoRef.current.addEventListener('loadeddata', handleLoadedData)
      videoRef.current.addEventListener('error', handleError)

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', handleLoadedData)
          videoRef.current.removeEventListener('error', handleError)
        }
      }
    }
  }, [open, game.backgroundVideo, videoLoaded])

  // Reset video state when dialog closes
  useEffect(() => {
    if (!open) {
      setVideoLoaded(false)
      setVideoError(false)
    }
  }, [open])

  const headerHeight = videoLoaded ? 'h-72' : 'h-48'

  return (
    <Dialog open={open} onOpenChange={onOpenChange} hideCloseButton>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <div
          className={`relative ${headerHeight} bg-gradient-to-b from-black/60 to-black/20 transition-all duration-500`}
        >
          {/* Banner image (always shown, or as fallback) */}
          <img
            src={game.banner || '/placeholder.svg'}
            alt={game.title}
            className={`w-full h-full object-cover absolute -z-10 ${videoLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          />

          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-black/20"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </Button>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white">{game.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{game.genre}</Badge>
              {!game.url && (
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                  Próximamente disponible
                </Badge>
              )}
              <Button
                size="sm"
                className={`h-7 px-2 ${game.favorite ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-transparent'}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite()
                }}
              >
                <Star className={`h-3 w-3 mr-1 ${game.favorite ? 'fill-current' : ''}`} />
                {game.favorite ? 'Favorito' : 'Añadir a favoritos'}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-muted-foreground">
                {game.installed
                  ? `Instalado • ${game.size} • Último juego ${game.lastPlayed}`
                  : `Tamaño: ${game.size}`}
              </p>
              {game.progress < 100 && game.progress > 0 && (
                <div className="mt-2 w-64">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Descargando...</span>
                    <span>{game.progress}%</span>
                  </div>
                  <Progress value={game.progress} className="h-2" />
                </div>
              )}
            </div>
            {game.url &&
              (game.installed ? (
                <Button
                  size="lg"
                  variant={game.installed ? 'default' : 'outline'}
                  onClick={() => {
                    window.electron.ipcRenderer.send('launchGame', game)
                  }}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Jugar
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant={game.installed ? 'default' : 'outline'}
                  onClick={() => {
                    onInstall(game.id)
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Instalar
                </Button>
              ))}
          </div>

          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about">Acerca de</TabsTrigger>
              <TabsTrigger value="dlc">DLC</TabsTrigger>
              <TabsTrigger value="achievements">Logros</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                  <p className="text-sm text-muted-foreground">
                    {game.fullDescription || game.description}
                  </p>

                  <h3 className="text-lg font-semibold mt-4 mb-2">Requisitos del sistema</h3>
                  {game.systemRequirements ? (
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
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium">Mínimos</h4>
                        <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                          <li>OS: Windows 10 64-bit</li>
                          <li>Procesador: Intel Core i5-4460</li>
                          <li>Memoria: 8 GB RAM</li>
                          <li>Gráficos: NVIDIA GTX 960</li>
                          <li>Almacenamiento: 50 GB disponibles</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Recomendados</h4>
                        <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                          <li>OS: Windows 10/11 64-bit</li>
                          <li>Procesador: Intel Core i7-8700K</li>
                          <li>Memoria: 16 GB RAM</li>
                          <li>Gráficos: NVIDIA RTX 3060</li>
                          <li>Almacenamiento: 50 GB SSD</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Detalles</h3>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Desarrollador</dt>
                      <dd>{game.developer}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Editor</dt>
                      <dd>{game.publisher}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Fecha de lanzamiento</dt>
                      <dd>{game.releaseDate}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Plataforma</dt>
                      <dd>{game.platform}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Género</dt>
                      <dd>{game.genre}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="dlc">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay DLC disponible para este juego</p>
                <p className="text-xs text-muted-foreground mt-2">
                  El contenido descargable estará disponible en futuras actualizaciones
                </p>
              </div>
            </TabsContent>
            <TabsContent value="achievements">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Sistema de logros no disponible</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Esta función estará disponible próximamente
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
