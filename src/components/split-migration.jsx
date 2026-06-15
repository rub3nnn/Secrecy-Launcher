import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SecrecyLogo } from '@/components/logo'

export function SplitMigration({ onSkip }) {
  const [status, setStatus] = useState('info') // 'info', 'downloading', 'error', 'finished'
  const [progress, setProgress] = useState(0)
  const [downloadedBytes, setDownloadedBytes] = useState(0)
  const [totalBytes, setTotalBytes] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleProgress = (data) => {
      if (data) {
        setProgress(Math.floor(data.percent || 0))
        setDownloadedBytes(data.transferred || 0)
        setTotalBytes(data.total || 0)
      }
    }

    window.electron.ipc.on('download-legacy-progress', handleProgress)
    return () => {
      window.electron.ipc.removeListener('download-legacy-progress', handleProgress)
    }
  }, [])

  const handleInstall = async () => {
    setStatus('downloading')
    setProgress(0)
    try {
      const result = await window.electron.ipc.invoke('download-legacy-launcher', {})
      if (result && result.success) {
        setStatus('finished')
      }
    } catch (err) {
      console.error('Error downloading split launcher:', err)
      setErrorMessage(err.message || 'Error desconocido al descargar el instalador.')
      setStatus('error')
    }
  }

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#180d28]/95 p-4 select-none backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(168,85,247,0.15),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-violet-100/10 bg-[#251737]/80 p-6 shadow-[0_12px_40px_rgba(24,13,42,0.6)] backdrop-blur-xl"
      >
        <AnimatePresence mode="wait">
          {status === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-5"
            >
              <div className="flex justify-center pb-2">
                <SecrecyLogo />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Secrecy se ha dividido
                </h2>
                <p className="mt-2 text-sm text-violet-100/60 leading-relaxed">
                  Para ofrecerte una experiencia especializada, hemos dividido Secrecy Launcher en dos aplicaciones independientes.
                </p>
              </div>

              <div className="rounded-xl border border-violet-100/8 bg-violet-950/20 p-4 space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div className="mt-1 h-2 w-2 rounded-full bg-violet-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Secrecy Minecraft</span> (este launcher) ahora es una herramienta 100% dedicada y optimizada exclusivamente para Minecraft.
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="mt-1 h-2 w-2 rounded-full bg-fuchsia-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Secrecy Launcher</span> unificado continuará siendo tu biblioteca general para descargar y jugar a todos tus otros juegos favoritos.
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={handleInstall}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-6 text-sm font-semibold shadow-lg shadow-violet-500/20 transition-all active:scale-[0.99]"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Instalar Secrecy Launcher
                </Button>
                <button
                  onClick={onSkip}
                  className="w-full py-2.5 text-xs font-semibold text-violet-100/40 hover:text-violet-100/80 transition-colors"
                >
                  Omitir e ir a Secrecy Minecraft
                </button>
              </div>
            </motion.div>
          )}

          {status === 'downloading' && (
            <motion.div
              key="downloading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 py-4 text-center"
            >
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-violet-500/10" />
                <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
                <Download className="h-6 w-6 text-violet-300" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Descargando Secrecy Launcher</h3>
                <p className="text-xs text-violet-100/50">
                  Obteniendo la última versión oficial desde GitHub...
                </p>
              </div>

              <div className="space-y-2">
                <div className="h-2 w-full rounded-full bg-violet-950/40 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-violet-100/60">
                  <span>{progress}% completado</span>
                  {totalBytes > 0 && (
                    <span>
                      {formatSize(downloadedBytes)} de {formatSize(totalBytes)}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-[11px] text-violet-100/40 italic">
                El instalador se abrirá automáticamente al finalizar la descarga.
              </div>
            </motion.div>
          )}

          {status === 'finished' && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5 text-center py-4"
            >
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Instalador Iniciado</h3>
                <p className="text-sm text-violet-100/60 leading-relaxed">
                  Se está ejecutando el instalador de Secrecy Launcher. Esta aplicación se cerrará en un momento...
                </p>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5"
            >
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <AlertCircle className="h-8 w-8" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-bold text-white">Error de Descarga</h3>
                <p className="mt-2 text-sm text-rose-200/70 leading-relaxed bg-rose-500/5 p-3 rounded-lg border border-rose-500/10">
                  {errorMessage}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleInstall}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold"
                >
                  Reintentar Descarga
                </Button>
                <Button
                  onClick={onSkip}
                  variant="outline"
                  className="border-violet-100/10 text-violet-100 hover:bg-violet-100/5"
                >
                  Continuar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
