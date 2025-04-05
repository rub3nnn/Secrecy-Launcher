import { Download, Home, Library, User, Clock, GamepadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { SecrecyLogo } from '@/components/logo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function SidebarNav({ gameData, isLoading }) {
  console.log(gameData)
  const recentGames = [...gameData].sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed))
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

  return (
    <div className="flex h-full w-80 flex-col border-r bg-card">
      <div className="p-4">
        <SecrecyLogo />
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-4">
          <nav className="grid gap-2">
            <Button variant="outline" className="justify-start gap-2">
              <Home className="h-4 w-4" />
              Inicio
            </Button>
            <Button variant="ghost" className="justify-start gap-2 text-muted-foreground" disabled>
              <Library className="h-4 w-4" />
              <span className="flex-grow text-left">Biblioteca</span>
              <Badge variant="outline" className="ml-auto text-xs whitespace-nowrap px-1.5 py-0">
                Próximamente
              </Badge>
            </Button>
            <Button variant="ghost" className="justify-start gap-2 text-muted-foreground" disabled>
              <Download className="h-4 w-4" />
              <span className="flex-grow text-left">Descargas</span>
              <Badge variant="outline" className="ml-auto text-xs whitespace-nowrap px-1.5 py-0">
                Próximamente
              </Badge>
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
  )
}
