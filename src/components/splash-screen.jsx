import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import splashVideo from '@renderer/assets/splashscreen.webm'

export function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const onCompleteRef = useRef(onComplete)

  // Sincronizar el ref con el callback actual
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Desactivar scroll y ocultar scrollbar durante la presentación
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
    }
  }, [])

  useEffect(() => {
    const startTime = Date.now()
    const duration = 10000 // 10 segundos

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const currentProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(currentProgress)

      if (elapsed >= duration) {
        clearInterval(interval)
        if (onCompleteRef.current) {
          onCompleteRef.current()
        }
      }
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col justify-end bg-black overflow-hidden select-none"
    >
      <video
        src={splashVideo}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      {/* Barra de progreso pegada al borde inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40 backdrop-blur-[1px]">
        <div
          className="h-full bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 shadow-[0_0_12px_rgba(168,85,247,0.8)] transition-all duration-75 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  )
}
