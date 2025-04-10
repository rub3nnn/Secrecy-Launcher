import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Zap, Layers, Palette, ArrowRight, Check } from 'lucide-react'
import { SecrecyLogo } from '@/components/logo'

export function VersionUpdateAnimation() {
  const [showAnimation, setShowAnimation] = useState(true)
  const [animationStep, setAnimationStep] = useState(0)

  useEffect(() => {
    if (!showAnimation) return

    const sequence = [
      { step: 1, delay: 1000 },
      { step: 2, delay: 1000 },
      { step: 3, delay: 1500 },
      { step: 4, delay: 1000 }
    ]

    let timeoutId

    const runSequence = (index) => {
      if (index >= sequence.length) {
        setShowAnimation(false)
        return
      }

      const { step, delay } = sequence[index]
      setAnimationStep(step)

      timeoutId = setTimeout(() => {
        runSequence(index + 1)
      }, delay)
    }

    runSequence(0)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [showAnimation])

  const features = [
    {
      icon: <Zap className="h-5 w-5 text-purple-300" />,
      title: 'Rendimiento mejorado',
      description: 'Hasta un 200% más rápido y optimizado para los juegos'
    },
    {
      icon: <Palette className="h-5 w-5 text-purple-200" />,
      title: 'Nuevo diseño',
      description: 'Interfaz más efectiva y rápida'
    },
    {
      icon: <Layers className="h-5 w-5 text-purple-400" />,
      title: 'Más juegos',
      description: 'Biblioteca expandida con nuevos títulos y aumentando'
    },
    {
      icon: <Sparkles className="h-5 w-5 text-purple-500" />,
      title: 'Más velocidad',
      description: 'Descarga los juegos en menor tiempo'
    }
  ]

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/90 via-gray-900 to-purple-900/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Fondo con partículas mejoradas */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 100 }).map((_, i) => {
              const size = 1 + Math.random() * 2
              const duration = 3 + Math.random() * 4
              const delay = Math.random() * 5
              const opacity = 0.3 + Math.random() * 0.7

              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-purple-300"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: opacity
                  }}
                  animate={{
                    opacity: [opacity, opacity * 0.5, opacity],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    duration: duration,
                    delay: delay,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              )
            })}

            {/* Nebulosa con movimiento suave y continuo */}
            <motion.div
              className="absolute inset-0 opacity-20 pointer-events-none"
              initial={{
                background: `
                  radial-gradient(circle at 30% 50%, rgba(126, 34, 206, 0.8), transparent 60%),
                  radial-gradient(circle at 70% 30%, rgba(88, 28, 135, 0.6), transparent 60%)
                `,
                backgroundSize: '200% 200%'
              }}
              animate={{
                backgroundPosition: [
                  '30% 50%, 70% 30%',
                  '40% 60%, 60% 40%',
                  '50% 70%, 50% 50%',
                  '30% 50%, 70% 30%'
                ]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          </div>

          {/* Contenido principal (igual que antes) */}
          <div className="relative z-10 max-w-3xl w-full px-6 py-8">
            {/* Logo y versión */}
            <motion.div
              className="flex flex-col items-center justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="scale-150 mb-4">
                <SecrecyLogo />
              </div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: animationStep >= 1 ? 1 : 0,
                  scale: animationStep >= 1 ? 1 : 0.8
                }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="text-4xl font-bold text-white mt-4 flex items-center">
                  <span>2.0</span>
                  <span className="ml-3 text-xl bg-purple-800/50 px-3 py-1 rounded-full text-purple-200">
                    NUEVA VERSIÓN PRINCIPAL
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Características */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
              initial={{ opacity: 0 }}
              animate={{
                opacity: animationStep >= 2 ? 1 : 0
              }}
              transition={{ duration: 0.5, staggerChildren: 0.1, delayChildren: 0.2 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-purple-900/30 backdrop-blur-sm rounded-lg p-4 flex items-start border border-purple-800/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: animationStep >= 2 ? 1 : 0,
                    y: animationStep >= 2 ? 0 : 20
                  }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="h-10 w-10 rounded-full bg-purple-800/50 flex items-center justify-center mr-3 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-purple-100 font-medium">{feature.title}</h3>
                    <p className="text-purple-300/80 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Mensaje final */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: animationStep >= 3 ? 1 : 0,
                y: animationStep >= 3 ? 0 : 20
              }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-purple-800/50 border border-purple-700/50"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <Check className="h-8 w-8 text-purple-200" />
              </motion.div>
              <h2 className="text-2xl font-bold text-purple-100 mb-2">
                ¡Bienvenido a la nueva experiencia!
              </h2>
              <p className="text-purple-300/80 mb-6">
                Disfruta de todas las nuevas funciones y mejoras que hemos preparado para ti.
              </p>
              <div className="flex items-center justify-center ">
                <span className="text-purple-200">Iniciando Secrecy Launcher 2.0.1</span>
                <ArrowRight className="ml-2 h-4 w-4 animate-pulse text-purple-300" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
