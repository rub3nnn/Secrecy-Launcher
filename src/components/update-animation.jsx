'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Zap,
  Layers,
  Palette,
  ArrowRight,
  Check,
  AlertTriangle,
  ShieldAlert,
  Download,
  Shield,
  Users,
  Cpu
} from 'lucide-react'
import { SecrecyLogo } from '@/components/logo'
import { ScrollArea } from '@/components/ui/scroll-area'

export function VersionUpdateAnimation() {
  const [showAnimation, setShowAnimation] = useState(true)
  const [animationStep, setAnimationStep] = useState(-1) // Comenzamos en -1 para el logo inicial
  const [showWarning, setShowWarning] = useState(false)
  const [showContent, setShowContent] = useState(true)
  const [showMinecraftIntro, setShowMinecraftIntro] = useState(false) // Inicialmente no mostramos el intro de Minecraft
  const [showInitialLogo, setShowInitialLogo] = useState(true) // Mostrar solo el logo al inicio
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef(null)

  // Minecraft launcher features
  const minecraftFeatures = [
    {
      icon: <Download className="h-5 w-5 text-green-300" />,
      title: 'Todas las versiones',
      description:
        'Soporte completo para todas las versiones de Minecraft, desde Classic hasta las últimas snapshots'
    },
    {
      icon: <Cpu className="h-5 w-5 text-green-200" />,
      title: 'Ultra-optimizado',
      description: 'Rendimiento mejorado para jugar con shaders y mods pesados sin sacrificar FPS'
    },
    {
      icon: <Shield className="h-5 w-5 text-green-400" />,
      title: 'Cuentas Premium',
      description:
        'Soporte completo para cuentas oficiales de Minecraft con todas sus funcionalidades'
    },
    {
      icon: <Users className="h-5 w-5 text-green-500" />,
      title: 'Cuentas No-Premium',
      description: 'Juega en servidores que permiten acceso sin cuenta oficial'
    }
  ]

  useEffect(() => {
    if (!showAnimation) return

    // Solo iniciamos la secuencia cuando el video está listo o cuando estamos en la fase inicial del logo
    if ((!videoReady && animationStep >= 0) || !showAnimation) return

    const sequence = [
      // Logo inicial de Secrecy (2 segundos)
      { step: -1, delay: 2000 },
      { action: 'hideInitialLogo', delay: 500 },
      { action: 'showMinecraftIntro', delay: 500 },

      // Secuencia de Minecraft
      { step: 0, delay: 2000 }, // Mostrar título de MINECRAFT
      { step: 1, delay: 2000 }, // Mostrar subtítulo
      { step: 2, delay: 2000 }, // Mostrar características del launcher
      { step: 3, delay: 3000 }, // Mostrar más información
      { step: 4, delay: 3000 }, // Transición a Secrecy
      { action: 'hideMinecraftIntro', delay: 1000 }, // Ocultar intro de Minecraft

      // Secuencia original de Secrecy
      { step: 5, delay: 1500 }, // Equivalente al paso 1 original
      { step: 6, delay: 1500 }, // Equivalente al paso 2 original
      { step: 7, delay: 2000 }, // Equivalente al paso 3 original
      { step: 8, delay: 1500 }, // Equivalente al paso 4 original
      { action: 'hideContent', delay: 1000 }, // Primero ocultamos el contenido
      { action: 'showWarning' } // Luego mostramos la advertencia
    ]

    let timeoutId

    const runSequence = (index) => {
      if (index >= sequence.length) {
        clearTimeout(timeoutId)
        return
      }

      const { step, action, delay } = sequence[index]

      if (step !== undefined) {
        setAnimationStep(step)
      } else if (action === 'hideContent') {
        setShowContent(false)
      } else if (action === 'showWarning') {
        setShowWarning(true)
      } else if (action === 'hideMinecraftIntro') {
        setShowMinecraftIntro(false)
      } else if (action === 'showMinecraftIntro') {
        setShowMinecraftIntro(true)
      } else if (action === 'hideInitialLogo') {
        setShowInitialLogo(false)
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
  }, [showAnimation, videoReady])

  // Manejar el evento cuando el video está listo
  const handleVideoReady = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error('Error al reproducir el video:', error)
      })
      setVideoReady(true)
    }
  }

  // Características originales de Secrecy
  const secrecyFeatures = [
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
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Logo inicial de Secrecy */}
          <AnimatePresence>
            {showInitialLogo && (
              <motion.div
                className="absolute inset-0 z-50 flex items-center justify-center bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
              >
                <motion.div
                  className="scale-[3]"
                  initial={{ opacity: 0, scale: 2 }}
                  animate={{ opacity: 1, scale: 3 }}
                  exit={{ opacity: 0, scale: 4 }}
                  transition={{ duration: 0.5 }}
                >
                  <SecrecyLogo />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sección de Minecraft */}
          <AnimatePresence>
            {showMinecraftIntro && (
              <motion.div
                className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 1 } }}
              >
                {/* Video de fondo de Minecraft */}
                <div className="absolute inset-0 bg-black">
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    src="https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/videos/Homepage_Gameplay-Trailer_MC-OV_1080x720.webm"
                    muted
                    loop
                    playsInline
                    onCanPlay={handleVideoReady}
                  />
                  <div className="absolute inset-0 bg-black/60" />{' '}
                  {/* Overlay para mejorar la legibilidad */}
                </div>

                {/* Contenido de Minecraft - Todo centrado */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
                  {/* Título de MINECRAFT - Más grande y centrado */}
                  <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.8 }}
                    animate={{
                      opacity: animationStep >= 0 && videoReady ? 1 : 0,
                      y: animationStep >= 0 && videoReady ? 0 : -50,
                      scale: animationStep >= 0 && videoReady ? 1 : 0.8
                    }}
                    transition={{ duration: 1, type: 'spring' }}
                    className="mb-8 w-full text-center"
                  >
                    <h1
                      className="text-9xl md:text-[10rem] font-bold tracking-wider inline-block"
                      style={{
                        fontFamily: 'monospace',
                        color: '#44bd32',
                        textShadow:
                          '0 0 15px rgba(68, 189, 50, 0.7), 0 0 30px rgba(68, 189, 50, 0.5)'
                      }}
                    >
                      MINECRAFT
                    </h1>
                  </motion.div>

                  {/* Subtítulo - Centrado */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                      opacity: animationStep >= 1 && videoReady ? 1 : 0,
                      y: animationStep >= 1 && videoReady ? 0 : 30
                    }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-8 text-center w-full"
                  >
                    <h2 className="text-3xl font-bold text-green-300 mb-2">
                      ¡AHORA EN SECRECY LAUNCHER!
                    </h2>
                    <p className="text-xl text-green-100/80">
                      La experiencia definitiva para jugar Minecraft está aquí
                    </p>
                  </motion.div>

                  {/* Características del launcher de Minecraft - Mejor organizado para caber en pantalla */}
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 w-full max-w-4xl mx-auto px-4"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: animationStep >= 2 && videoReady ? 1 : 0
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {minecraftFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="bg-green-900/30 backdrop-blur-sm rounded-lg p-3 flex items-start border border-green-800/50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: animationStep >= 2 && videoReady ? 1 : 0,
                          y: animationStep >= 2 && videoReady ? 0 : 20
                        }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <div className="h-9 w-9 rounded-full bg-green-800/50 flex items-center justify-center mr-2 flex-shrink-0">
                          {feature.icon}
                        </div>
                        <div className="text-left">
                          <h3 className="text-green-100 font-medium text-sm sm:text-base">
                            {feature.title}
                          </h3>
                          <p className="text-green-300/80 text-xs sm:text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Información adicional - Centrada y más compacta */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                      opacity: animationStep >= 3 && videoReady ? 1 : 0,
                      y: animationStep >= 3 && videoReady ? 0 : 30
                    }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 w-full max-w-3xl mx-auto px-4"
                  >
                    <div className="bg-green-900/40 backdrop-blur-sm rounded-xl p-4 border border-green-700/50">
                      <h3 className="text-xl font-bold text-green-200 mb-2 text-center">
                        Launcher Ultra-Optimizado
                      </h3>
                      <p className="text-green-300/90 mb-3 text-sm text-center">
                        Nuestro launcher integrado de Minecraft ha sido diseñado para ofrecer el
                        mejor rendimiento posible, permitiéndote jugar con shaders y mods pesados
                        sin sacrificar FPS.
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-green-800/30 rounded-lg p-2">
                          <p className="text-green-100 font-bold text-lg">+200%</p>
                          <p className="text-green-300/80 text-xs">Mejora de FPS</p>
                        </div>
                        <div className="bg-green-800/30 rounded-lg p-2">
                          <p className="text-green-100 font-bold text-lg">100%</p>
                          <p className="text-green-300/80 text-xs">Compatibilidad</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Transición a Secrecy - Centrada */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: animationStep >= 4 && videoReady ? 1 : 0,
                      scale: animationStep >= 4 && videoReady ? 1 : 0.9
                    }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center text-center"
                  >
                    <p className="text-xl text-white mb-4">Y muchas más novedades en...</p>
                    <div className="scale-150 mb-4">
                      <SecrecyLogo />
                    </div>
                    <div className="text-2xl font-bold text-purple-200 mt-2">
                      Secrecy Launcher 2.0
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sección original de Secrecy - Corregido el centrado */}
          <AnimatePresence>
            {!showMinecraftIntro && !showInitialLogo && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-gray-900 to-purple-900/90 flex items-center justify-center"
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
                          repeat: Number.POSITIVE_INFINITY,
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
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'linear'
                    }}
                  />
                </div>

                {/* Contenido principal - Centrado correctamente */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <div className="w-full max-w-3xl px-4 py-8 flex flex-col items-center">
                    {/* Advertencia */}
                    <AnimatePresence>
                      {showWarning && (
                        <motion.div
                          className="bg-purple-900/70 backdrop-blur-lg rounded-xl p-6 border border-purple-600/50 w-full max-w-2xl mx-auto"
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
                                      <strong>Descargo de responsabilidad:</strong> Secrecy es un
                                      software de código abierto que facilita el acceso a contenidos
                                      disponibles en fuentes de la comunidad. No almacenamos ni
                                      distribuimos archivos protegidos por derechos de autor.
                                    </p>

                                    <ul className="space-y-4">
                                      <li className="flex items-start">
                                        <span className="flex-shrink-0 text-purple-400 mr-2">
                                          •
                                        </span>
                                        <div>
                                          <strong>Falsos positivos comunes:</strong> Muchos juegos
                                          modificados por la comunidad (cracks, traducciones, etc.)
                                          son detectados erróneamente como amenazas por antivirus.
                                          Esto ocurre frecuentemente con:
                                          <ul className="list-[circle] pl-5 mt-2 space-y-2 text-sm">
                                            <li>Archivos .dll modificados</li>
                                            <li>
                                              Ejecutables de lanzamiento alternativo (como
                                              Steamless)
                                            </li>
                                            <li>Herramientas de desbloqueo de contenido</li>
                                          </ul>
                                        </div>
                                      </li>

                                      <li className="flex items-start">
                                        <span className="flex-shrink-0 text-purple-400 mr-2">
                                          •
                                        </span>
                                        <div>
                                          <strong>Contenidos de terceros:</strong> Los archivos
                                          provienen de fuentes comunitarias como
                                          <i> online-fix.me</i>, <i>gamecopy.world</i> y otros
                                          repositorios de confianza en la escena. Sin embargo,
                                          recomendamos:
                                          <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm">
                                            <li>
                                              Verificar comentarios y reputación de cada release
                                            </li>
                                            <li>
                                              Comparar hash MD5/SHA-1 con fuentes oficiales cuando
                                              sea posible
                                            </li>
                                            <li>
                                              Usar máquinas virtuales para contenido no verificado
                                            </li>
                                          </ol>
                                        </div>
                                      </li>

                                      <li className="flex items-start">
                                        <span className="flex-shrink-0 text-purple-400 mr-2">
                                          •
                                        </span>
                                        <div>
                                          <strong>Limitaciones técnicas:</strong> Este servicio
                                          gratuito tiene:
                                          <ul className="list-[circle] pl-5 mt-2 space-y-2 text-sm">
                                            <li>
                                              Limitación de velocidad en algunos juegos después de
                                              6GB descargados/día
                                            </li>
                                            <li>No garantía de disponibilidad continua</li>
                                            <li>
                                              No hay soporte para problemas con archivos específicos
                                            </li>
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
                                        Aunque muchos detectores de virus marcan falsos positivos,
                                        algunos cracks/modificaciones pueden contener malware real.
                                        Recomendamos usar siempre una solución antivirus actualizada
                                        y revisar los archivos en{' '}
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
                                    NOTA LEGAL: El uso de cracks o juegos sin licencia puede violar
                                    las leyes de propiedad intelectual en su país. Secrecy no
                                    fomenta la piratería y recomienda apoyar a los desarrolladores
                                    comprando copias originales cuando sea posible.
                                  </p>
                                  <div className="bg-red-900/20 p-4 rounded-lg border border-red-800/50 my-4">
                                    <h4 className="font-bold text-red-300 flex items-center">
                                      <ShieldAlert className="h-4 w-4 mr-2" />
                                      Advertencia Legal Explícita
                                    </h4>
                                    <p className="text-red-200/90 text-xs">
                                      Según la Digital Millennium Copyright Act (DMCA) y la
                                      Directiva EUCD, el uso no autorizado de material protegido
                                      puede constituir delito. Este software es para investigación
                                      de seguridad y pruebas técnicas únicamente.
                                    </p>
                                  </div>
                                </ScrollArea>
                                <p className="text-xs text-purple-300/70 italic pt-2 border-t border-purple-800/50 mb-4">
                                  Al hacer clic en "Acepto", certificas que eres mayor de edad en tu
                                  país, que tienes derecho legal a acceder a estos contenidos según
                                  las leyes de tu jurisdicción, y que eximes a Secrecy de toda
                                  responsabilidad por el uso que hagas del software descargado.
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

                    {/* Contenido de la animación principal - Todo centrado */}
                    <AnimatePresence>
                      {showContent && (
                        <motion.div
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="flex flex-col items-center w-full"
                        >
                          {/* Logo y versión - Centrado */}
                          <motion.div
                            className="flex flex-col items-center justify-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                              opacity: animationStep >= 5 ? 1 : 0,
                              y: animationStep >= 5 ? 0 : 20
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="scale-150 mb-4">
                              <SecrecyLogo />
                            </div>

                            <motion.div
                              className="relative text-center"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{
                                opacity: animationStep >= 5 ? 1 : 0,
                                scale: animationStep >= 5 ? 1 : 0.8
                              }}
                              transition={{ duration: 0.5, delay: 0.3 }}
                            >
                              <div className="text-4xl font-bold text-white mt-4 flex flex-wrap items-center justify-center gap-2">
                                <span>2.1.0</span>
                                <span className="text-xl bg-purple-800/50 px-3 py-1 rounded-full text-purple-200">
                                  NUEVA VERSIÓN PRINCIPAL
                                </span>
                              </div>
                            </motion.div>
                          </motion.div>

                          {/* Características - Centradas y responsivas */}
                          <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 w-full max-w-3xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: animationStep >= 6 ? 1 : 0
                            }}
                            transition={{ duration: 0.5, staggerChildren: 0.1, delayChildren: 0.2 }}
                          >
                            {secrecyFeatures.map((feature, index) => (
                              <motion.div
                                key={index}
                                className="bg-purple-900/30 backdrop-blur-sm rounded-lg p-4 flex items-start border border-purple-800/50"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                  opacity: animationStep >= 6 ? 1 : 0,
                                  y: animationStep >= 6 ? 0 : 20
                                }}
                                transition={{ duration: 0.3, delay: 0.1 * index }}
                              >
                                <div className="h-10 w-10 rounded-full bg-purple-800/50 flex items-center justify-center mr-3 flex-shrink-0">
                                  {feature.icon}
                                </div>
                                <div>
                                  <h3 className="text-purple-100 font-medium">{feature.title}</h3>
                                  <p className="text-purple-300/80 text-sm">
                                    {feature.description}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>

                          {/* Mensaje final - Centrado */}
                          <motion.div
                            className="text-center w-full"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                              opacity: animationStep >= 7 ? 1 : 0,
                              y: animationStep >= 7 ? 0 : 20
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
                                repeat: Number.POSITIVE_INFINITY
                              }}
                            >
                              <Check className="h-8 w-8 text-purple-200" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-purple-100 mb-2">
                              ¡Bienvenido a la nueva experiencia!
                            </h2>
                            <p className="text-purple-300/80 mb-6">
                              Disfruta de todas las nuevas funciones y mejoras que hemos preparado
                              para ti.
                            </p>
                            <div className="flex items-center justify-center">
                              <span className="text-purple-200">
                                Iniciando Secrecy Launcher 2.0.2
                              </span>
                              <ArrowRight className="ml-2 h-4 w-4 animate-pulse text-purple-300" />
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
