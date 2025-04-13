import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Zap,
  Layers,
  Palette,
  ArrowRight,
  Check,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react'
import { SecrecyLogo } from '@/components/logo'
import { ScrollArea } from '@/components/ui/scroll-area'

export function VersionUpdateAnimation() {
  const [showAnimation, setShowAnimation] = useState(true)
  const [animationStep, setAnimationStep] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [showContent, setShowContent] = useState(true)

  useEffect(() => {
    if (!showAnimation) return

    const sequence = [
      { step: 1, delay: 1000 },
      { step: 2, delay: 1000 },
      { step: 3, delay: 1500 },
      { step: 4, delay: 1000 },
      { action: 'hideContent', delay: 500 }, // Primero ocultamos el contenido
      { action: 'showWarning' } // Luego mostramos la advertencia
    ]

    let timeoutId

    const runSequence = (index) => {
      if (index >= sequence.length) {
        clearTimeout(timeoutId)
        return
      }

      const { step, action, delay } = sequence[index]

      if (step) {
        setAnimationStep(step)
      } else if (action === 'hideContent') {
        setShowContent(false)
      } else if (action === 'showWarning') {
        setShowWarning(true)
      } else if (action === 'hideAll') {
        setShowAnimation(false)
      }

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

          {/* Contenido principal */}
          <div className="relative z-10 max-w-3xl w-full px-6 py-8">
            {/* Advertencia */}
            <AnimatePresence>
              {showWarning && (
                <motion.div
                  className="bg-purple-900/70 backdrop-blur-lg rounded-xl p-6 border border-purple-600/50 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-purple-700/60 flex items-center justify-center mr-3 flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-purple-200" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-purple-50 mb-3">
                          Aviso Legal y Condiciones de Uso
                        </h3>

                        <ScrollArea className="h-[60vh] pr-3 text-purple-200" type="always">
                          <div className="space-y-4 pb-4">
                            <p className="bg-purple-900/40 p-3 rounded-lg border border-purple-800/50">
                              <strong>Descargo de responsabilidad:</strong> Secrecy es un software
                              de código abierto que facilita el acceso a contenidos disponibles en
                              fuentes de la comunidad. No almacenamos ni distribuimos archivos
                              protegidos por derechos de autor.
                            </p>

                            <ul className="space-y-4">
                              <li className="flex items-start">
                                <span className="flex-shrink-0 text-purple-400 mr-2">•</span>
                                <div>
                                  <strong>Falsos positivos comunes:</strong> Muchos juegos
                                  modificados por la comunidad (cracks, traducciones, etc.) son
                                  detectados erróneamente como amenazas por antivirus. Esto ocurre
                                  frecuentemente con:
                                  <ul className="list-[circle] pl-5 mt-2 space-y-2 text-sm">
                                    <li>Archivos .dll modificados</li>
                                    <li>Ejecutables de lanzamiento alternativo (como Steamless)</li>
                                    <li>Herramientas de desbloqueo de contenido</li>
                                  </ul>
                                </div>
                              </li>

                              <li className="flex items-start">
                                <span className="flex-shrink-0 text-purple-400 mr-2">•</span>
                                <div>
                                  <strong>Contenidos de terceros:</strong> Los archivos provienen de
                                  fuentes comunitarias como
                                  <i> online-fix.me</i>, <i>gamecopy.world</i> y otros repositorios
                                  de confianza en la escena. Sin embargo, recomendamos:
                                  <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm">
                                    <li>Verificar comentarios y reputación de cada release</li>
                                    <li>
                                      Comparar hash MD5/SHA-1 con fuentes oficiales cuando sea
                                      posible
                                    </li>
                                    <li>Usar máquinas virtuales para contenido no verificado</li>
                                  </ol>
                                </div>
                              </li>

                              <li className="flex items-start">
                                <span className="flex-shrink-0 text-purple-400 mr-2">•</span>
                                <div>
                                  <strong>Limitaciones técnicas:</strong> Este servicio gratuito
                                  tiene:
                                  <ul className="list-[circle] pl-5 mt-2 space-y-2 text-sm">
                                    <li>
                                      Limitación de velocidad en algunos juegos después de 6GB
                                      descargados/día
                                    </li>
                                    <li>No garantía de disponibilidad continua</li>
                                    <li>No hay soporte para problemas con archivos específicos</li>
                                  </ul>
                                </div>
                              </li>
                            </ul>

                            <div className="bg-yellow-900/20 border border-yellow-800/50 p-3 rounded-lg">
                              <h4 className="font-semibold text-yellow-300 flex items-center mb-1">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Advertencia importante
                              </h4>
                              <p className="text-yellow-200/90 text-xs">
                                Aunque muchos detectores de virus marcan falsos positivos, algunos
                                cracks/modificaciones pueden contener malware real. Recomendamos
                                usar siempre una solución antivirus actualizada y revisar los
                                archivos en{' '}
                                <a
                                  href="https://www.virustotal.com"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-yellow-300 underline"
                                >
                                  VirusTotal
                                </a>{' '}
                                antes de ejecutarlos.
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-red-400/90 italic pt-4 border-t border-red-900/50">
                            NOTA LEGAL: El uso de cracks o juegos sin licencia puede violar las
                            leyes de propiedad intelectual en su país. Secrecy no fomenta la
                            piratería y recomienda apoyar a los desarrolladores comprando copias
                            originales cuando sea posible.
                          </p>
                          <div className="bg-red-900/20 p-4 rounded-lg border border-red-800/50 my-4">
                            <h4 className="font-bold text-red-300 flex items-center">
                              <ShieldAlert className="h-4 w-4 mr-2" />
                              Advertencia Legal Explícita
                            </h4>
                            <p className="text-red-200/90 text-xs">
                              Según la Digital Millennium Copyright Act (DMCA) y la Directiva EUCD,
                              el uso no autorizado de material protegido puede constituir delito.
                              Este software es para investigación de seguridad y pruebas técnicas
                              únicamente.
                            </p>
                          </div>
                        </ScrollArea>
                        <p className="text-xs text-purple-300/70 italic pt-2 border-t border-purple-800/50 mb-4">
                          Al hacer clic en "Acepto", certificas que eres mayor de edad en tu país,
                          que tienes derecho legal a acceder a estos contenidos según las leyes de
                          tu jurisdicción, y que eximes a Secrecy de toda responsabilidad por el uso
                          que hagas del software descargado.
                        </p>
                      </div>
                    </div>

                    <motion.div
                      className="flex justify-center pt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <button
                        onClick={() => setShowAnimation(false)}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-lg text-white font-medium shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Acepto los términos y condiciones
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contenido de la animación principal */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Logo y versión */}
                  <motion.div
                    className="flex flex-col items-center justify-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: animationStep >= 1 ? 1 : 0,
                      y: animationStep >= 1 ? 0 : 20
                    }}
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
                      <span className="text-purple-200">Iniciando Secrecy Launcher 2.0.2</span>
                      <ArrowRight className="ml-2 h-4 w-4 animate-pulse text-purple-300" />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
