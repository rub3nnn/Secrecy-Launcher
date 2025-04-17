import {
  Download,
  Home,
  Gamepad,
  Library,
  User,
  Clock,
  GamepadIcon,
  RefreshCcw,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { SecrecyLogo } from '@/components/logo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DownloadsSidebar } from '@/components/downloads-sidebar'
import { useEffect, useState } from 'react'

export function SidebarNav({
  gameData,
  isLoading,
  handleRefresh,
  error,
  downloads = [],
  isDownloadsSidebarOpen,
  setIsDownloadsSidebarOpen,
  setCurrentSection,
  currentSection
}) {
  const [activeDownloads, setActiveDownloads] = useState(0)

  const recentGames = Array.isArray(gameData)
    ? [...gameData].sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed))
    : []
  const steamUser = window.steamAPI.getRecentUser()

  const haceCuanto = (fecha = 0) => {
    if (fecha === 0 || typeof fecha != 'number') return 'Nunca'
    const dif = Math.floor((Date.now() - fecha) / 1000)
    if (dif < 60) return 'Ahora'

    const m = [
      { v: 31536000, t: 'año' },
      { v: 2592000, t: 'mes', p: 'meses' },
      { v: 86400, t: 'día' },
      { v: 3600, t: 'hora' },
      { v: 60, t: 'minuto' }
    ].find((i) => dif >= i.v)

    const n = Math.floor(dif / m.v)
    return `Hace ${n} ${n === 1 ? m.t : m.p || m.t + 's'}`
  }

  useEffect(() => {
    setActiveDownloads(
      downloads.filter((game) => game.download && game.download.status != 'completed').length
    )
  }, [downloads])

  return (
    <>
      <div className="flex h-full w-80 flex-col border-r bg-card">
        <div className="p-4">
          <SecrecyLogo />
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <div className="p-4">
            <nav className="grid gap-2">
              <Button
                variant={currentSection === 'library' ? 'default' : 'outline'}
                className="justify-start gap-2"
                onClick={() => setCurrentSection('library')}
              >
                <Home className="h-4 w-4" />
                Inicio
              </Button>
              <Button
                variant={currentSection === 'minecraft' ? 'default' : 'outline'}
                className="justify-start gap-2"
                onClick={() => setCurrentSection('minecraft')}
              >
                <Gamepad className="h-4 w-4" />
                Minecraft
              </Button>
              <Button
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => setIsDownloadsSidebarOpen(true)}
              >
                <Download className="h-4 w-4" />
                <span className="flex-grow text-left">Descargas</span>
                {activeDownloads > 0 && (
                  <Badge variant="default" className="ml-auto text-xs px-1.5 py-0">
                    {activeDownloads}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" className="justify-start gap-2" onClick={handleRefresh}>
                <RefreshCcw className="h-4 w-4" />
                Recargar
              </Button>
            </nav>
            <Separator className="my-4" />
            <div className="space-y-3">
              <div className="flex items-center">
                <h3 className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Jugados recientemente
                </h3>
              </div>
              <div className="space-y-2">
                {isLoading ? (
                  <div className="space-y-2">
                    {/* Skeleton loaders para simular carga */}
                    {[1, 2, 3].map((_, index) => (
                      <div
                        key={index}
                        className="relative h-16 rounded-md overflow-hidden bg-muted animate-pulse"
                      >
                        <div className="absolute bottom-3 left-3 w-2/3 h-4 bg-muted-foreground/20 rounded"></div>
                        <div className="absolute bottom-3 right-3 w-5 h-4 bg-muted-foreground/20 rounded"></div>
                        <div className="absolute bottom-8 left-3 w-1/3 h-3 bg-muted-foreground/20 rounded"></div>
                      </div>
                    ))}

                    <div className="flex items-center justify-center py-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span className="ml-2 text-xs text-muted-foreground">Cargando juegos...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                    </div>
                    <h4 className="text-sm font-medium mb-1 text-destructive">Error al cargar</h4>
                    <p className="text-xs text-destructive/70 mb-3">
                      No se pudieron cargar tus juegos recientes. Comprueba tu conexión.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={handleRefresh}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      <span>Reintentar</span>
                    </Button>
                  </div>
                ) : recentGames && recentGames.length > 0 ? (
                  recentGames.map((game) => {
                    if (game.installed) {
                      return (
                        <div
                          key={game.id}
                          onClick={() => {
                            window.electron.ipcRenderer.send('launchGame', game)
                          }}
                          className="block relative h-16 rounded-md overflow-hidden group cursor-pointer"
                        >
                          {/* Imagen de fondo */}
                          <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-110">
                            <img
                              src={game.banner}
                              alt={game.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Gradiente para mejorar legibilidad */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40 opacity-80 group-hover:opacity-90 transition-opacity"></div>

                          {/* Contenido */}
                          <div className="absolute inset-0 p-3 flex flex-col justify-end">
                            <p className="text-sm font-medium text-white truncate group-hover:text-primary-foreground transition-colors">
                              {game.title}
                            </p>
                            <div className="flex items-center">
                              <p className="text-xs text-white/70 group-hover:text-white transition-colors">
                                {haceCuanto(game.lastPlayed || 0)}
                              </p>
                            </div>
                          </div>

                          {/* Borde brillante en hover */}
                          <div className="absolute inset-0 border border-transparent group-hover:border-primary/50 rounded-md transition-colors"></div>
                        </div>
                      )
                    } else {
                      return null
                    }
                  })
                ) : (
                  <div className="bg-muted/40 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <GamepadIcon className="h-6 w-6 text-primary/70" />
                      </div>
                    </div>
                    <h4 className="text-sm font-medium mb-1">No hay juegos recientes</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Instala y juega a tu primer juego para verlo aquí
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
        {steamUser && (
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={steamUser.avatar} />
                <AvatarFallback className="bg-primary/10">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{steamUser.personaName}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="truncate">Conectado con Steam</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <DownloadsSidebar
        gameData={gameData}
        games={downloads}
        isOpen={isDownloadsSidebarOpen}
        onClose={() => setIsDownloadsSidebarOpen(false)}
      />
    </>
  )
}
