import { AlertCircle, AlertTriangle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

// Niveles de severidad del error
export const ERROR_SEVERITY = {
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
}

export function AppErrorDialog({
  open,
  onOpenChange,
  title = 'Ha ocurrido un error',
  description = 'Se ha producido un error al procesar tu solicitud.',
  severity = ERROR_SEVERITY.ERROR,
  errorCode,
  errorDetails
}) {
  // Determinar el icono según la severidad
  const getSeverityIcon = () => {
    switch (severity) {
      case ERROR_SEVERITY.WARNING:
        return <AlertTriangle className="h-6 w-6" />
      case ERROR_SEVERITY.CRITICAL:
        return <XCircle className="h-6 w-6" />
      case ERROR_SEVERITY.ERROR:
      default:
        return <AlertCircle className="h-6 w-6" />
    }
  }

  // Determinar los colores según la severidad
  const getSeverityColors = () => {
    switch (severity) {
      case ERROR_SEVERITY.WARNING:
        return {
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-500',
          border: 'border-yellow-500/20',
          icon: 'text-yellow-500'
        }
      case ERROR_SEVERITY.CRITICAL:
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-500',
          border: 'border-red-500/20',
          icon: 'text-red-500'
        }
      case ERROR_SEVERITY.ERROR:
      default:
        return {
          bg: 'bg-destructive/10',
          text: 'text-destructive',
          border: 'border-destructive/20',
          icon: 'text-destructive'
        }
    }
  }

  const colors = getSeverityColors()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
        <div className={`${colors.bg} p-6 border-b ${colors.border}`}>
          <div className="flex items-start">
            <div
              className={`h-10 w-10 rounded-full bg-background/80 flex items-center justify-center ${colors.icon} mr-4 flex-shrink-0`}
            >
              {getSeverityIcon()}
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-semibold ${colors.text}`}>{title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {errorCode && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Código de error:</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">{errorCode}</code>
            </div>
          )}

          {errorDetails && (
            <div className="bg-muted p-3 rounded-md text-xs font-mono text-muted-foreground max-h-32 overflow-y-auto">
              {typeof errorDetails === 'string' ? (
                errorDetails
              ) : (
                <pre>{JSON.stringify(errorDetails, null, 2)}</pre>
              )}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
