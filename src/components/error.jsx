'use client'

import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ErrorDisplay({ error, retry }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-card border border-destructive/20 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-destructive/10 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center text-destructive mb-4">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-destructive mb-2">Error de conexión</h2>
            <p className="text-muted-foreground">
              No se ha podido conectar con el servidor de juegos.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Detalles del error:</h3>
            <p className="text-xs text-muted-foreground break-all">
              {error.message || 'Error al conectar con api.secrecylauncher.com/games'}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Posibles soluciones:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>Comprueba tu conexión a Internet</li>
              <li>Verifica que no haya un firewall bloqueando la conexión</li>
              <li>Los servidores podrían estar en mantenimiento</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" disabled>
              <WifiOff className="h-4 w-4 mr-2" />
              Modo sin conexión
            </Button>
            <Button className="flex-1" onClick={retry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar conexión
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
        <p>
          El modo sin conexión te permitirá acceder a los juegos guardados localmente, pero algunas
          funciones como actualizaciones y nuevos juegos no estarán disponibles.
        </p>
      </div>
    </div>
  )
}
