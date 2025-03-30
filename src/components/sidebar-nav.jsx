import { Download, Home, Library } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { SecrecyLogo } from '@/components/logo'

export function SidebarNav() {
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
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Colecciones</h3>
            <div className="text-xs text-muted-foreground italic mb-2">
              Más colecciones estarán disponibles cuando tengas más juegos
            </div>
            <nav className="grid gap-1">
              <Button variant="ghost" size="sm" className="justify-start">
                Todos los juegos
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-muted-foreground"
                disabled
              >
                <span className="flex-grow text-left">Jugados recientemente</span>
                <Badge variant="outline" className="ml-auto text-xs whitespace-nowrap px-1.5 py-0">
                  Próximamente
                </Badge>
              </Button>
              <Button variant="ghost" size="sm" className="justify-start">
                Favoritos
              </Button>
            </nav>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
