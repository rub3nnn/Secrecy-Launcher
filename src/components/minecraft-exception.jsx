import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Loader2, Sparkles, User, Star, Settings, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import video from '@renderer/assets/minecraftVideo.webm'
import modsimage from '@renderer/assets/minecraftmods.png'

// Crear un componente Microsoft para el icono
const Microsoft = ({ className }) => (
  <svg className={className} viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f25022" d="M1 1h10v10H1z" />
    <path fill="#00a4ef" d="M1 12h10v10H1z" />
    <path fill="#7fba00" d="M12 1h10v10H12z" />
    <path fill="#ffb900" d="M12 12h10v10H12z" />
  </svg>
)

const storage = window.storage

export function MinecraftException({ minecraftStatus }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isInstallingMods, setIsInstallingMods] = useState(false)
  const [modInstallProgress, setModInstallProgress] = useState(0)
  const [selectedMode, setSelectedMode] = useState(null)

  // Estados para el modal de configuración inicial
  const [showSetupModal, setShowSetupModal] = useState(false)
  const [setupStep, setSetupStep] = useState(1)
  const [setupDone, setSetupDone] = useState(storage.get('setupDone') || false)
  const [accountType, setAccountType] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [usernameType, setUsernameType] = useState('')
  const [customUsername, setCustomUsername] = useState('')

  // Estado para la cuenta de usuario
  const [userAccount, setUserAccount] = useState(storage.get('minecraft.userAccount') || null)
  const [showAccountModal, setShowAccountModal] = useState(false)

  const steamUser = window.steamAPI.getRecentUser()

  // Sincronizar estado de carga con minecraftStatus
  useEffect(() => {
    setLoadingProgress(minecraftStatus.progress)
    if (minecraftStatus.stage === 'closed') {
      setIsPlaying(false)
      setLoadingProgress(0)
      setSelectedMode(null)
    }
  }, [minecraftStatus])

  // Efecto para mostrar el modal de configuración inicial
  useEffect(() => {
    if (!setupDone) {
      setTimeout(() => {
        setShowSetupModal(true)
      }, 1000)
    }
  }, [setupDone])

  // Guardar cuenta de usuario en el almacenamiento
  useEffect(() => {
    storage.set('minecraft.userAccount', userAccount)
  }, [userAccount])

  const handlePlayWithMods = () => {
    if (!userAccount) {
      setShowSetupModal(true)
      return
    }
    setSelectedMode('mods')
    setIsPlaying(true)
    window.electron.ipcRenderer.send('launch-server')
  }

  const handlePlayNormal = () => {
    if (!userAccount) {
      setShowSetupModal(true)
      return
    }
    setSelectedMode('normal')
    setIsPlaying(true)
    window.electron.ipcRenderer.send('launch-offline')
  }

  // Función para manejar el inicio de sesión con Microsoft
  const handleMicrosoftLogin = async () => {
    setIsPopupOpen(false)
    setIsLoggingIn(true)
    const loginUser = await window.electron.ipcRenderer.invoke('minecraftLogin')

    if (loginUser) {
      setIsPopupOpen(true)

      // Establecer la cuenta como premium
      setUserAccount({
        type: 'premium',
        username: loginUser
      })

      // Avanzar al siguiente paso después del inicio de sesión
      if (!setupDone) {
        setSetupStep(2)
        setAccountType('')
      }
    }
  }

  // Función para manejar el siguiente paso del modal
  const handleNextStep = () => {
    if (setupStep === 1) {
      if (accountType === 'premium') {
        return handleMicrosoftLogin()
      } else if (accountType === 'no-premium') {
        // Validar que se haya seleccionado un nombre de usuario si es personalizado
        if (usernameType === 'custom' && !customUsername.trim()) {
          return
        }

        // Establecer la cuenta como no premium
        setUserAccount({
          type: 'no-premium',
          username: usernameType === 'custom' ? customUsername : steamUser.personaName
        })

        // Avanzar al siguiente paso
        setSetupStep(2)
        setAccountType('')
      }
    } else if (setupStep === 2) {
      finishSetup()
    }
  }

  // Función para finalizar la configuración
  const finishSetup = () => {
    setShowSetupModal(false)
    setSetupDone(true)
    storage.set('setupDone', true)
  }

  // Función para manejar el paso anterior
  const handlePreviousStep = () => {
    setSetupStep(1)
  }

  // Función para cambiar la configuración de cuenta
  const handleAccountChange = () => {
    if (accountType === 'premium') {
      return handleMicrosoftLogin()
    } else if (accountType === 'no-premium') {
      if (usernameType === 'custom' && !customUsername.trim()) {
        return
      }

      setUserAccount({
        type: 'no-premium',
        username: usernameType === 'custom' ? customUsername : steamUser.personaName
      })

      setShowAccountModal(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex flex-col">
      {/* Video de fondo a pantalla completa */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={video} type="video/webm" />
      </video>

      {/* Overlay oscuro gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>

      {/* Header con información de usuario */}
      {userAccount && (
        <div className="absolute top-4 right-4 z-40">
          <div
            className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full pl-1.5 cursor-pointer hover:bg-black/60 transition-colors border border-white/10"
            onClick={() => setShowAccountModal(true)}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${userAccount.type === 'premium' ? 'bg-blue-500' : 'bg-orange-500'}`}
            >
              {userAccount.type === 'premium' ? (
                <Star className="h-4 w-4 text-white" />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>
            <span className="text-white font-medium text-sm">{userAccount.username}</span>
          </div>
        </div>
      )}

      {/* Imagen de personajes - Ajustada */}
      <img
        src={modsimage}
        alt="Personajes de Minecraft"
        className={`absolute right-0 bottom-0 h-[25%] w-auto drop-shadow-2xl pointer-events-none transition-opacity z-30 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Contenido principal - Flex para empujar el loader al fondo */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 py-12">
        <div className="max-w-5xl w-full">
          {!isPlaying ? (
            <>
              {/* Badge BETA */}
              <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-top-5 duration-500">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/15 text-orange-100 backdrop-blur-md border border-orange-500/20">
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
                  <span className="font-medium text-sm">BETA</span>
                </div>
              </div>

              {/* Banner de Paintball - NUEVO */}
              <div className="mb-8 animate-in fade-in slide-in-from-top-8 duration-700 delay-100">
                <div className="max-w-3xl mx-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 blur-xl"></div>
                  <div className="relative bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 backdrop-blur-md rounded-2xl p-4 border border-amber-500/30 shadow-2xl">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
                        <Sparkles className="h-4 w-4 text-white animate-pulse" />
                        <span className="text-white font-bold text-sm">NUEVO</span>
                      </div>
                      <p className="text-white font-semibold text-lg">
                        🎨 Modalidad de Paintball ya disponible
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Título */}
              <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 drop-shadow-2xl">
                  Servidor de Minecraft
                </h1>
                <p className="text-lg text-white/80 drop-shadow-lg">Selecciona tu modo de juego</p>
              </div>

              {/* Grid de opciones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* Opción con Mods */}
                <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all shadow-2xl animate-in fade-in slide-in-from-left-8 duration-700 delay-200 flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative flex-1 flex flex-col">
                    <div className="flex-1 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-3 shadow-lg shadow-purple-500/20">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1.5">Con Mods</h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Contenido exclusivo y mejoras
                      </p>
                    </div>

                    <Button
                      size="lg"
                      className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 h-12"
                      onClick={handlePlayWithMods}
                    >
                      <Play className="h-5 w-5" />
                      <span className="font-semibold">Jugar con Mods</span>
                    </Button>
                  </div>
                </div>

                {/* Opción Normal */}
                <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700 delay-200 flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative flex-1 flex flex-col">
                    <div className="flex-1 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1.5">Normal</h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Servidor oficial sin mods
                      </p>
                    </div>

                    <Button
                      size="lg"
                      className="w-full gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 h-12"
                      onClick={handlePlayNormal}
                    >
                      <Play className="h-5 w-5" />
                      <span className="font-semibold">Jugar Normal</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Barra de progreso de instalación de mods */}
              {isInstallingMods && (
                <div className="mt-8 max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white text-sm font-medium">Instalando mods...</span>
                    <span className="text-white/80 text-sm font-mono">
                      {Math.round(modInstallProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300 shadow-lg"
                      style={{ width: `${modInstallProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Vista cuando está cargando - Título del modo seleccionado
            <div className="text-center animate-in fade-in zoom-in-95 duration-700">
              <div className="mb-8">
                <div
                  className={`w-24 h-24 mx-auto rounded-2xl ${
                    selectedMode === 'mods'
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500 shadow-2xl shadow-purple-500/30'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-2xl shadow-emerald-500/30'
                  } flex items-center justify-center mb-6`}
                >
                  <Play className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                  {selectedMode === 'mods' ? 'Modo con Mods' : 'Modo Normal'}
                </h2>
                <p className="text-xl text-white/70 drop-shadow-lg">
                  {selectedMode === 'mods' ? 'Preparando mods...' : 'Cargando recursos...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra de progreso de carga del juego - Fija en la parte inferior */}
      <div
        className={`relative z-20 bg-black/90 backdrop-blur-xl border-t border-white/10 transition-all duration-500 ${
          isPlaying ? 'h-20 opacity-100' : 'h-0 opacity-0 overflow-hidden'
        }`}
      >
        {isPlaying && (
          <div className="h-full flex flex-col justify-center px-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Información del estado */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {minecraftStatus.stage === 'installing-java' && 'Instalando Java Runtime...'}
                    {minecraftStatus.stage === 'completed-java' && 'Java instalado correctamente'}
                    {minecraftStatus.stage === 'installing-minecraft' &&
                      'Descargando recursos del juego...'}
                    {minecraftStatus.stage === 'launching' && 'Iniciando Minecraft...'}
                  </p>
                  <p className="text-white/60 text-xs mt-0.5">{minecraftStatus.message}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-mono text-lg font-bold">
                  {Math.round(loadingProgress)}%
                </p>
                <p className="text-white/60 text-xs">Progreso total</p>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300 ease-out shadow-lg overflow-hidden"
                style={{ width: `${loadingProgress}%` }}
              >
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={`absolute bottom-2 left-0 right-0 text-center z-10 transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
      >
        <p className="text-white/30 text-xs">Secrecy Launcher © 2025 - Versión Beta</p>
      </div>

      {/* Modal de configuración inicial */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-5 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-hidden transition-all relative">
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Configuración inicial</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${setupStep === 1 ? 'bg-primary' : 'bg-muted'}`}
                  ></span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${setupStep >= 2 ? 'bg-primary' : 'bg-muted'}`}
                  ></span>
                </div>
              </div>
            </div>

            {isLoggingIn && (
              <div className="p-9 inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10 animate-in fade-in zoom-in-95 duration-200">
                {isPopupOpen ? (
                  <div className="text-center p-5">
                    <h3 className="text-lg font-medium mb-3">
                      ¡Hola {storage.get('minecraft.profile')?.name || 'Usuario'}!
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      Has iniciado sesión correctamente con tu cuenta premium de Minecraft
                    </p>
                    <div className="flex justify-between gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          handlePreviousStep()
                          setIsLoggingIn(false)
                        }}
                        size="sm"
                      >
                        Atrás
                      </Button>
                      <Button variant="default" onClick={() => setIsLoggingIn(false)} size="sm">
                        Continuar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-5">
                    <div className="flex justify-center mb-3">
                      <Microsoft className="h-10 w-10 text-blue-600 animate-bounce" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Iniciando sesión con Microsoft</h3>
                    <p className="text-muted-foreground mb-3">
                      Inicia sesión con tu cuenta de Microsoft desde la ventana emergente.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Paso 1: Tipo de cuenta */}
            {setupStep === 1 && !isLoggingIn && (
              <div className="space-y-3 animate-in fade-in slide-in-from-left-5 duration-300">
                <p className="text-muted-foreground mb-2">
                  ¿Qué tipo de cuenta de Minecraft utilizarás?
                </p>

                {/* Opciones de tipo de cuenta */}
                <div className="grid grid-cols-1 gap-3">
                  <div
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${accountType === 'premium' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                    onClick={() => setAccountType('premium')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Star className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Minecraft Premium</h3>
                        <p className="text-xs text-muted-foreground">
                          Inicia sesión con tu cuenta de Microsoft.
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${accountType === 'premium' ? 'border-primary' : 'border-muted-foreground'}`}
                      >
                        {accountType === 'premium' && (
                          <div className="w-3 h-3 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${accountType === 'no-premium' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                    onClick={() => setAccountType('no-premium')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Minecraft No Premium</h3>
                        <p className="text-xs text-muted-foreground">
                          Juega sin una cuenta oficial de Minecraft.
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${accountType === 'no-premium' ? 'border-primary' : 'border-muted-foreground'}`}
                      >
                        {accountType === 'no-premium' && (
                          <div className="w-3 h-3 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Opciones adicionales para No Premium */}
                {accountType === 'no-premium' && (
                  <div className="mt-3 space-y-3 animate-in slide-in-from-top-5 fade-in-50 duration-300">
                    <h3 className="font-medium text-sm">Nombre de usuario</h3>
                    <div className="space-y-2">
                      {steamUser && (
                        <div
                          className={`border rounded-lg p-2 cursor-pointer transition-all ${usernameType === 'steam' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                          onClick={() => setUsernameType('steam')}
                        >
                          <div className="flex items-center gap-2">
                            <div className="bg-slate-100 p-1.5 rounded-full">
                              <User className="h-4 w-4 text-slate-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Usar nombre de Steam</p>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${usernameType === 'steam' ? 'border-primary' : 'border-muted-foreground'}`}
                            >
                              {usernameType === 'steam' && (
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <div
                        className={`border rounded-lg p-2 cursor-pointer transition-all ${usernameType === 'custom' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                        onClick={() => setUsernameType('custom')}
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-slate-100 p-1.5 rounded-full">
                            <User className="h-4 w-4 text-slate-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Nombre personalizado</p>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${usernameType === 'custom' ? 'border-primary' : 'border-muted-foreground'}`}
                          >
                            {usernameType === 'custom' && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                        </div>
                      </div>

                      {usernameType === 'custom' && (
                        <div className="mt-2 animate-in slide-in-from-top-3 fade-in-80 duration-200">
                          <Input
                            placeholder="Introduce tu nombre de usuario"
                            value={customUsername}
                            onChange={(e) => setCustomUsername(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Botones de navegación */}
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="default"
                    onClick={handleNextStep}
                    disabled={
                      !accountType ||
                      (accountType === 'no-premium' &&
                        usernameType === 'custom' &&
                        !customUsername.trim())
                    }
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {/* Paso 2: Carpeta de instalación */}
            {setupStep === 2 && !isLoggingIn && (
              <div className="space-y-3 animate-in fade-in slide-in-from-right-5 duration-300">
                <p className="text-muted-foreground mb-2">Configuración completada</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-green-800 mb-1">¡Todo listo!</h3>
                  <p className="text-green-600 text-sm">
                    Tu cuenta ha sido configurada correctamente.
                  </p>
                </div>

                {/* Botones de navegación */}
                <div className="flex justify-between gap-2 mt-4">
                  <Button variant="outline" onClick={handlePreviousStep} size="sm">
                    Atrás
                  </Button>
                  <Button variant="default" onClick={finishSetup} size="sm">
                    Comenzar a jugar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de configuración de cuenta */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-5 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Configuración de cuenta</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAccountModal(false)}
                disabled={isLoggingIn}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isLoggingIn && (
              <div className="p-9 inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10 animate-in fade-in zoom-in-95 duration-200">
                {isPopupOpen ? (
                  <div className="text-center p-5">
                    <h3 className="text-lg font-medium mb-3">
                      ¡Hola {storage.get('minecraft.profile')?.name || 'Usuario'}!
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      Has iniciado sesión correctamente con tu cuenta premium de Minecraft
                    </p>
                    <Button
                      variant="default"
                      onClick={() => {
                        setIsLoggingIn(false)
                        setShowAccountModal(false)
                      }}
                      size="sm"
                    >
                      Continuar
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-5">
                    <div className="flex justify-center mb-3">
                      <Microsoft className="h-10 w-10 text-blue-600 animate-bounce" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Iniciando sesión con Microsoft</h3>
                    <p className="text-muted-foreground mb-3">
                      Inicia sesión con tu cuenta de Microsoft desde la ventana emergente.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!isLoggingIn && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${userAccount?.type === 'premium' ? 'bg-blue-500' : 'bg-orange-500'}`}
                  >
                    {userAccount?.type === 'premium' ? (
                      <Star className="h-6 w-6 text-white" />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{userAccount?.username}</h3>
                    <p className="text-sm text-muted-foreground">
                      {userAccount?.type === 'premium' ? 'Cuenta Premium' : 'Cuenta No Premium'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Cambiar tipo de cuenta</h3>

                  <div className="grid grid-cols-1 gap-3">
                    <div
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${accountType === 'premium' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                      onClick={() => setAccountType('premium')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Star className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Minecraft Premium</h3>
                          <p className="text-xs text-muted-foreground">
                            Inicia sesión con tu cuenta de Microsoft.
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${accountType === 'premium' ? 'border-primary' : 'border-muted-foreground'}`}
                        >
                          {accountType === 'premium' && (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${accountType === 'no-premium' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                      onClick={() => setAccountType('no-premium')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Minecraft No Premium</h3>
                          <p className="text-xs text-muted-foreground">
                            Juega sin una cuenta oficial de Minecraft.
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${accountType === 'no-premium' ? 'border-primary' : 'border-muted-foreground'}`}
                        >
                          {accountType === 'no-premium' && (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Añadir campo para cambiar el nombre de usuario si es No Premium */}
                {accountType === 'no-premium' && (
                  <div className="mt-3 space-y-3 animate-in slide-in-from-top-5 fade-in-50 duration-300">
                    <h3 className="font-medium text-sm">Nombre de usuario</h3>
                    <div className="space-y-2">
                      {steamUser && (
                        <div
                          className={`border rounded-lg p-2 cursor-pointer transition-all ${usernameType === 'steam' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                          onClick={() => setUsernameType('steam')}
                        >
                          <div className="flex items-center gap-2">
                            <div className="bg-slate-100 p-1.5 rounded-full">
                              <User className="h-4 w-4 text-slate-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Usar nombre de Steam</p>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${usernameType === 'steam' ? 'border-primary' : 'border-muted-foreground'}`}
                            >
                              {usernameType === 'steam' && (
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <div
                        className={`border rounded-lg p-2 cursor-pointer transition-all ${usernameType === 'custom' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                        onClick={() => setUsernameType('custom')}
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-slate-100 p-1.5 rounded-full">
                            <User className="h-4 w-4 text-slate-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Nombre personalizado</p>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${usernameType === 'custom' ? 'border-primary' : 'border-muted-foreground'}`}
                          >
                            {usernameType === 'custom' && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                        </div>
                      </div>

                      {usernameType === 'custom' && (
                        <div className="mt-2 animate-in slide-in-from-top-3 fade-in-80 duration-200">
                          <Input
                            placeholder="Introduce tu nombre de usuario"
                            value={customUsername}
                            onChange={(e) => setCustomUsername(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <Button
                    className={'mr-2'}
                    onClick={() => handleAccountChange()}
                    disabled={
                      !accountType ||
                      (accountType === 'no-premium' &&
                        usernameType === 'custom' &&
                        !customUsername.trim())
                    }
                  >
                    {accountType === 'premium' ? 'Iniciar sesión' : 'Guardar'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowAccountModal(false)}>
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Estilos para animación de shimmer */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
