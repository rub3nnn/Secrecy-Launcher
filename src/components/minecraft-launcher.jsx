'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Play,
  RefreshCw,
  Globe,
  Folder,
  ChevronRight,
  Clock,
  Check,
  AlertTriangle,
  Loader2,
  Lock,
  User,
  UserCheck,
  Star,
  FolderOpen,
  ComputerIcon as Steam,
  ChevronLeft,
  X,
  UserCircle,
  Settings
} from 'lucide-react'
import { DualRangeSlider } from '@/components/ui/range-slider'
import SkinViewerComponent from '@/components/minecraft-skin-viewer'

const storage = window.storage

// Crear un componente Microsoft para el icono
const Microsoft = ({ className }) => (
  <svg className={className} viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f25022" d="M1 1h10v10H1z" />
    <path fill="#00a4ef" d="M1 12h10v10H1z" />
    <path fill="#7fba00" d="M12 1h10v10H12z" />
    <path fill="#ffb900" d="M12 12h10v10H12z" />
  </svg>
)

// Rutas predefinidas
const DEFAULT_MINECRAFT_PATH = storage.get('paths.appData') + '\\.minecraft'
const SECRECY_LAUNCHER_PATH = storage.get('paths.userData') + '\\.minecraft'

export function MinecraftLauncher({ minecraftStatus }) {
  useEffect(() => {
    console.log(minecraftStatus)
  }, [minecraftStatus])
  // Estados principales
  const [selectedVersion, setSelectedVersion] = useState(
    storage.get('minecraft.settings.selectedVersion') || ''
  )
  const [memoryAllocation, setMemoryAllocation] = useState(
    storage.get('minecraft.settings.memoryAllocation') || [2048, 4096]
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Modificar los estados para el filtrado de versiones
  // Reemplazar el estado showSnapshots por un estado más versátil para el tipo de versión
  const [showOnlyInstalled, setShowOnlyInstalled] = useState(false)
  const [versionTypeFilter, setVersionTypeFilter] = useState('all') // "all", "release", "snapshot"

  // Estado para etapas de carga
  const [loadingStage, setLoadingStage] = useState('idle') // idle, installing-java, downloading-assets, launching

  // Estados para el modal de configuración inicial
  const [showSetupModal, setShowSetupModal] = useState(false)
  const [setupStep, setSetupStep] = useState(1) // 1: Tipo de cuenta, 2: Carpeta de instalación
  const [setupDone, setSetupDone] = useState(storage.get('setupDone') || false)
  const [accountType, setAccountType] = useState('') // premium, no-premium
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [usernameType, setUsernameType] = useState('') // steam, custom
  const [customUsername, setCustomUsername] = useState('')
  const [minecraftFolder, setMinecraftFolder] = useState('default') // default, custom

  // Añadir estado para la cuenta de usuario después de los estados del modal de configuración inicial
  const [userAccount, setUserAccount] = useState(storage.get('minecraft.userAccount') || null) // null, { type: "premium", username: "..." } o { type: "no-premium", username: "..." }
  const [showAccountModal, setShowAccountModal] = useState(false)

  // Estados para versiones y noticias
  const [versions, setVersions] = useState([])
  const [isLoadingVersions, setIsLoadingVersions] = useState(true)
  const [versionsError, setVersionsError] = useState(null)
  const [isRefreshingVersions, setIsRefreshingVersions] = useState(false)
  const [news, setNews] = useState([])
  const [isLoadingNews, setIsLoadingNews] = useState(true)
  const [newsError, setNewsError] = useState(null)

  // Estados de configuración
  const [gameDirectory, setGameDirectory] = useState(
    storage.get('paths.minecraft') || DEFAULT_MINECRAFT_PATH
  )
  const [directoryType, setDirectoryType] = useState(
    storage.get('minecraft.settings.directoryType') || 'default'
  ) // default, secrecy, custom
  const [customJavaPath, setCustomJavaPath] = useState(
    storage.get('minecraft.settings.customJavaPath') || 'Automático'
  )
  const [closeLauncher, setCloseLauncher] = useState(
    storage.get('minecraft.settings.closeLauncher') || true
  )
  const [autoUpdate, setAutoUpdate] = useState(storage.get('minecraft.settings.autoUpdate') || true)
  const [showSnapshots, setShowSnapshots] = useState(
    storage.get('minecraft.settings.showSnapshots') || false
  )

  const [windowWidth, setWindowWidth] = useState(
    storage.get('minecraft.settings.windowWidth') || ''
  )
  const [windowHeight, setWindowHeight] = useState(
    storage.get('minecraft.settings.windowHeight') || ''
  )
  const [fullscreen, setFullscreen] = useState(
    storage.get('minecraft.settings.fullScreen') || false
  )
  const [customJavaArgs, setCustomJavaArgs] = useState(
    storage.get('minecraft.settings.customJavaArgs') || ''
  )
  const [customMcArgs, setCustomMcArgs] = useState(
    storage.get('minecraft.settings.customMcArgs') || ''
  )
  const [useProxy, setUseProxy] = useState(storage.get('minecraft.settings.useProxy') || false)
  const [proxyHost, setProxyHost] = useState(storage.get('minecraft.settings.proxyHost') || '')
  const [proxyPort, setProxyPort] = useState(storage.get('minecraft.settings.proxyPort') || '8080')
  const [proxyUsername, setProxyUsername] = useState(
    storage.get('minecraft.settings.proxyUsername') || ''
  )
  const [proxyPassword, setProxyPassword] = useState(
    storage.get('minecraft.settings.proxyPassword') || ''
  )
  const [minecraftTimeout, setMinecraftTimeout] = useState(
    storage.get('minecraft.settings.minecraftTimeout') || '10000'
  )
  const [quickPlayType, setQuickPlayType] = useState(
    storage.get('minecraft.settings.quickPlayType') || 'none'
  )
  const [quickPlayIdentifier, setQuickPlayIdentifier] = useState(
    storage.get('minecraft.settings.quickPlayIdentifier') || ''
  )

  const steamUser = window.steamAPI.getRecentUser()

  const handlePreviousStep = () => {
    setSetupStep(1)
  }

  // Modificar la función handleMicrosoftLogin para añadir animaciones
  const handleMicrosoftLogin = async () => {
    setIsPopupOpen(false)
    setIsLoggingIn(true) // Esto es asíncrono, pero se ejecuta inmediatamente
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

  // Modificar la función handleNextStep para manejar correctamente el flujo de inicio de sesión
  const handleNextStep = () => {
    console.log(accountType)
    if (setupStep === 1) {
      if (accountType === 'premium') {
        // Iniciar el proceso de login con Microsoft en lugar de avanzar al siguiente paso
        return handleMicrosoftLogin()
      } else if (accountType === 'no-premium') {
        // Validar que se haya seleccionado un nombre de usuario si es personalizado
        if (usernameType === 'custom' && !customUsername.trim()) {
          return // No avanzar si no hay nombre de usuario
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

  useEffect(() => {
    storage.set('minecraft.settings', {
      ...storage.get('minecraft.settings'),
      selectedVersion,
      directoryType,
      customJavaPath,
      closeLauncher,
      autoUpdate,
      showSnapshots,
      windowWidth,
      windowHeight,
      fullScreen: fullscreen,
      customJavaArgs,
      customMcArgs,
      useProxy,
      proxyHost,
      proxyPort,
      proxyUsername,
      proxyPassword,
      minecraftTimeout,
      quickPlayType,
      quickPlayIdentifier,
      memoryAllocation
    })
  }, [
    selectedVersion,
    directoryType,
    customJavaPath,
    closeLauncher,
    autoUpdate,
    showSnapshots,
    windowWidth,
    windowHeight,
    fullscreen,
    customJavaArgs,
    customMcArgs,
    useProxy,
    proxyHost,
    proxyPort,
    proxyUsername,
    proxyPassword,
    minecraftTimeout,
    quickPlayType,
    quickPlayIdentifier,
    memoryAllocation
  ])

  const handleAccountChange = () => {
    if (accountType === 'premium') {
      // Iniciar el proceso de login con Microsoft en lugar de avanzar al siguiente paso
      return handleMicrosoftLogin()
    } else if (accountType === 'no-premium') {
      // Validar que se haya seleccionado un nombre de usuario si es personalizado
      if (usernameType === 'custom' && !customUsername.trim()) {
        return // No avanzar si no hay nombre de usuario
      }

      // Establecer la cuenta como no premium
      setUserAccount({
        type: 'no-premium',
        username: usernameType === 'custom' ? customUsername : steamUser.personaName
      })

      setShowAccountModal(false) // Cerrar el modal de cuenta
    }
  }
  // Modificar la función finishSetup para actualizar isFirstTime
  const finishSetup = () => {
    setShowSetupModal(false)
    setSetupDone(true) // Ya no es la primera vez
    storage.set('setupDone', true) // Guardar en el almacenamiento local
  }

  // Función para manejar el cambio de tipo de directorio
  const handleDirectoryTypeChange = (type) => {
    setDirectoryType(type)
    if (type === 'default') {
      setGameDirectory(DEFAULT_MINECRAFT_PATH)
    } else if (type === 'secrecy') {
      setGameDirectory(SECRECY_LAUNCHER_PATH)
    }
    // Si es custom, no cambiamos el gameDirectory
  }

  useEffect(() => {
    storage.set('paths.minecraft', gameDirectory)
    fetchVersions(true)
  }, [gameDirectory])

  useEffect(() => {
    storage.set('minecraft.userAccount', userAccount)
  }, [userAccount])

  // Función para manejar el cambio manual del directorio
  const handleDirectoryChange = (e) => {
    const newPath = e.target.value
    setGameDirectory(newPath)

    // Si el path coincide con alguno de los predefinidos, actualizamos el tipo
    if (newPath === DEFAULT_MINECRAFT_PATH) {
      setDirectoryType('default')
    } else if (newPath === SECRECY_LAUNCHER_PATH) {
      setDirectoryType('secrecy')
    } else {
      setDirectoryType('custom')
    }
  }

  // Cargar versiones desde la API (simulado)
  const fetchVersions = async (showRefresh = false) => {
    if (!setupDone) return setIsLoadingVersions(true)

    if (showRefresh) {
      setIsRefreshingVersions(true)
    } else {
      setIsLoadingVersions(true)
    }
    setVersionsError(null)

    try {
      // Datos de ejemplo con el nuevo formato
      const mockVersionsData = await window.electron.ipcRenderer.invoke('fetchMinecraftVersions')
      console.log(mockVersionsData)

      const processedVersions = mockVersionsData.versions

      setVersions(processedVersions)

      // Seleccionar la primera versión release si no hay selección
      if (!selectedVersion) {
        const firstRelease = processedVersions.find((v) => v.type === 'release')
        if (firstRelease) setSelectedVersion(firstRelease)
      }
    } catch (error) {
      console.error('Error cargando versiones:', error)
      setVersionsError(
        'Error al conectar con el servidor de versiones. Inténtalo de nuevo más tarde.'
      )
    } finally {
      setIsLoadingVersions(false)
      setIsRefreshingVersions(false)
    }
  }

  // Cargar noticias desde la API de Minecraft
  const fetchNews = async () => {
    setIsLoadingNews(true)
    try {
      const news = await window.electron.ipcRenderer.invoke('fetchMinecraftNews')
      setNews(news.article_grid || [])
    } catch (error) {
      console.error('Error cargando noticias:', error)
      setNewsError(error.message)
    } finally {
      setIsLoadingNews(false)
    }
  }

  // Efectos
  useEffect(() => {
    setLoadingProgress(minecraftStatus.progress)
    if (minecraftStatus.stage === 'closed') {
      setIsPlaying(false)
      setLoadingProgress(0)
    }
  }, [minecraftStatus])

  // Modificar el useEffect para mostrar el modal solo la primera vez
  useEffect(() => {
    // Mostrar el modal de configuración inicial solo si es la primera vez
    if (!setupDone) {
      setTimeout(() => {
        setShowSetupModal(true)
      }, 1000)
    } else {
      fetchVersions()
      fetchNews()
    }
  }, [setupDone])

  // Función para construir la URL completa de la imagen
  const getFullImageUrl = (imageUrl) => {
    // Para simular las URLs completas en un entorno web
    return `https://minecraft.net${imageUrl}`
  }

  // Añadir estado para el nombre de usuario en el modal de cuenta
  const [accountUsername, setAccountUsername] = useState('')

  return (
    <>
      {/* Header con video de fondo */}
      <div className="relative h-64 overflow-hidden">
        {/* Video de fondo */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/videos/Homepage_Gameplay-Trailer_MC-OV_1080x720.webm"
            type="video/webm"
          />
        </video>

        {/* Overlay para mejorar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

        {/* Contenido del header */}
        <div className="relative h-full container mx-auto p-6 flex flex-col">
          <div className="flex items-center justify-between mb-auto">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Minecraft</h1>
                <p className="text-white/70">Launcher integrado</p>
              </div>
            </div>
            {/* Información de usuario */}
            {userAccount && (
              <div
                className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full cursor-pointer hover:bg-black/40 transition-colors"
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
                <span className="text-white font-medium">{userAccount.username}</span>
              </div>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-80">Versión seleccionada:</p>

              <div className="flex items-center gap-2 group">
                <h2 className="text-3xl font-bold tracking-tight group-hover:text-gray-400  transition-colors">
                  {selectedVersion.id || 'Seleccionar versión'}
                </h2>
              </div>
            </div>
            <Button
              size="lg"
              className="gap-2 px-8 bg-green-600 hover:bg-green-700 text-white"
              onClick={
                () => {
                  setIsPlaying(true)
                  window.electron.ipcRenderer.send('launch-minecraft')
                }
                //handlePlayGame
              }
              disabled={isPlaying || !selectedVersion}
            >
              {isPlaying ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {minecraftStatus.stage === 'installing-java' && 'Instalando Java...'}
                  {minecraftStatus.stage === 'completed-java' && 'Cargando...'}
                  {minecraftStatus.stage === 'installing-minecraft' && 'Descargando recursos...'}
                  {minecraftStatus.stage === 'launching' && 'Iniciando juego...'}
                </span>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Jugar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Loader que solo aparece cuando se está iniciando el juego */}
      <div
        className={`relative h-6 bg-muted overflow-hidden transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0 h-0'}`}
      >
        {isPlaying && (
          <>
            <div
              className="absolute inset-0 bg-green-600 transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
              {minecraftStatus.message}
            </div>
          </>
        )}
      </div>

      <div className={`container mx-auto p-6 transition-all ${isPlaying ? 'pt-6' : 'pt-3'}`}>
        <Tabs defaultValue="versions">
          <TabsList className="mb-6">
            <TabsTrigger value="versions">Versiones</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
            <TabsTrigger value="news">Noticias</TabsTrigger>
            <TabsTrigger value="modpacks">
              <div className="flex items-center gap-1">Modpacks</div>
            </TabsTrigger>
            <TabsTrigger value="profiles">
              <div className="flex items-center gap-1">Perfiles</div>
            </TabsTrigger>
          </TabsList>

          {/* Modificar la sección de versiones en el TabsContent para incluir el filtro de snapshots */}
          <TabsContent value="versions" className="space-y-4">
            {/* Modificar la sección de filtros en el TabsContent de versiones */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Versiones de Minecraft</h2>
              <div className="flex items-center gap-3">
                {/* Filtro de tipo de versión */}
                <div className="bg-muted/30 rounded-lg p-1 flex">
                  <Button
                    variant={versionTypeFilter === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setVersionTypeFilter('all')}
                    className="rounded-r-none"
                  >
                    Todas
                  </Button>
                  <Button
                    variant={versionTypeFilter === 'release' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setVersionTypeFilter('release')}
                    className="rounded-none border-x border-border/30"
                  >
                    Releases
                  </Button>
                  <Button
                    variant={versionTypeFilter === 'snapshot' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setVersionTypeFilter('snapshot')}
                    className="rounded-none border-x border-border/30"
                  >
                    Snapshots
                  </Button>
                  <Button
                    variant={versionTypeFilter === 'custom' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setVersionTypeFilter('custom')}
                    className="rounded-l-none"
                  >
                    Custom
                  </Button>
                </div>

                {/* Filtro de instaladas */}
                <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-1">
                  <Label htmlFor="installed-filter" className="text-sm cursor-pointer select-none">
                    Solo instaladas
                  </Label>
                  <Switch
                    id="installed-filter"
                    checked={showOnlyInstalled}
                    onCheckedChange={setShowOnlyInstalled}
                    size="sm"
                  />
                </div>

                {/* Botón de refresco */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fetchVersions(true)}
                  disabled={isRefreshingVersions}
                >
                  {isRefreshingVersions ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {isLoadingVersions ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="h-5 bg-muted rounded w-24"></div>
                          <div className="h-4 bg-muted rounded w-32"></div>
                        </div>
                        <div className="h-5 bg-muted rounded w-16"></div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : versionsError ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2 text-destructive">
                  Error al cargar versiones
                </h3>
                <p className="text-muted-foreground mb-4">{versionsError}</p>
                <Button variant="outline" onClick={() => fetchVersions()}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reintentar
                </Button>
              </div>
            ) : (
              // Modificar la lógica de filtrado en la sección donde se muestran las versiones
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {versions
                  .filter(
                    (version) =>
                      // Filtrar por tipo
                      (versionTypeFilter === 'all' || version.type === versionTypeFilter) &&
                      // Filtrar por instaladas
                      (!showOnlyInstalled || version.isInstalled || version.type === 'custom') &&
                      (showSnapshots ||
                        version.type != 'snapshot' ||
                        versionTypeFilter === 'snapshot')
                  )
                  .map((version) => (
                    <Card
                      key={version.id}
                      className={`${
                        version === selectedVersion ? 'border-primary/50 bg-primary/5' : ''
                      } cursor-pointer transition-all hover:border-primary/30 hover:bg-primary/5 ${
                        version.isLatestRelease ? 'ring-2 ring-offset-2 ring-primary/30' : ''
                      } ${version.type === 'custom' ? 'bg-primary/4' : ''}`}
                      onClick={() => setSelectedVersion(version)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {version.type !== 'custom' ? version.id : version.inheritsFrom}
                              {version.isInstalled && <Check className="h-4 w-4 text-green-500" />}
                              {version.isLatestRelease && (
                                <Badge
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Última
                                </Badge>
                              )}
                              {version.isLatestSnapshot && (
                                <Badge
                                  variant="default"
                                  className="bg-amber-600 hover:bg-amber-700"
                                >
                                  Última
                                </Badge>
                              )}
                            </CardTitle>

                            <CardDescription className="flex items-center gap-1 mt-1">
                              {version.type != 'custom' ? (
                                <>
                                  <Clock className="h-3.5 w-3.5" />

                                  <span>{version.releaseTime}</span>
                                </>
                              ) : (
                                <span className="text-xs text-primary">{version.id}</span>
                              )}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              version.type === 'release'
                                ? 'default'
                                : version.type === 'snapshot'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {version.type === 'release'
                              ? 'Release'
                              : version.type === 'snapshot'
                                ? 'Snapshot'
                                : 'Custom'}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Tabs defaultValue="general">
              <TabsList className="mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="advanced">Avanzado</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cuenta de usuario</CardTitle>
                    <CardDescription>Gestiona tu cuenta de Minecraft</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userAccount && (
                      <>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${userAccount.type === 'premium' ? 'bg-blue-500' : 'bg-orange-500'}`}
                          >
                            {userAccount.type === 'premium' ? (
                              <Star className="h-5 w-5 text-white" />
                            ) : (
                              <User className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{userAccount.username}</h3>
                            <p className="text-xs text-muted-foreground">
                              {userAccount.type === 'premium'
                                ? 'Cuenta Premium'
                                : 'Cuenta No Premium'}
                              {userAccount.email && ` - ${userAccount.email}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-4">
                          <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() => setShowAccountModal(true)}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Cambiar configuración de cuenta
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Java</CardTitle>
                    <CardDescription>
                      Configura la versión de Java y la asignación de memoria
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="java-path">Ruta de Java</Label>
                      <div className="flex gap-2">
                        <Input
                          id="java-path"
                          value={customJavaPath}
                          onChange={(e) => setCustomJavaPath(e.target.value)}
                          className="flex-1"
                          disabled
                        />
                        <Button variant="outline" disabled>
                          Examinar
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="memory-slider">Asignación de memoria</Label>
                        <span className="text-sm">
                          {(memoryAllocation[0] / 1024).toFixed(1)} GB -{' '}
                          {(memoryAllocation[1] / 1024).toFixed(1)} GB
                        </span>
                      </div>
                      <DualRangeSlider
                        id="memory-slider"
                        min={1024}
                        max={16384}
                        step={1024}
                        value={memoryAllocation}
                        onValueChange={setMemoryAllocation}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configuración del launcher</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="close-launcher">Ocultar launcher al iniciar el juego</Label>
                      <Switch
                        id="close-launcher"
                        checked={closeLauncher}
                        onCheckedChange={setCloseLauncher}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-update">Actualizar automáticamente</Label>
                      <Switch
                        id="auto-update"
                        checked={autoUpdate}
                        onCheckedChange={setAutoUpdate}
                        disabled
                      />
                    </div>
                    <Separator />
                    {/* Modificar la sección de configuración para sincronizar con el nuevo sistema de filtros */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="snapshot">Mostrar snapshots en todos los filtros</Label>
                      <Switch
                        id="snapshot"
                        checked={showSnapshots}
                        onCheckedChange={(checked) => setShowSnapshots(checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resolución de pantalla</CardTitle>
                    <CardDescription>Configura el tamaño de la ventana del juego</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="window-width">Ancho</Label>
                        <Input
                          id="window-width"
                          type="number"
                          placeholder="854"
                          value={windowWidth}
                          onChange={(e) => setWindowWidth(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="window-height">Alto</Label>
                        <Input
                          id="window-height"
                          type="number"
                          placeholder="480"
                          value={windowHeight}
                          onChange={(e) => setWindowHeight(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="fullscreen">Pantalla completa</Label>
                        <p className="text-xs text-muted-foreground">
                          Iniciar el juego en modo pantalla completa
                        </p>
                      </div>
                      <Switch
                        id="fullscreen"
                        checked={fullscreen}
                        onCheckedChange={setFullscreen}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Carpetas del juego</CardTitle>
                    <CardDescription>
                      Configura las ubicaciones de los archivos del juego
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="game-directory">Directorio del juego</Label>
                      <div className="flex gap-2">
                        <Input
                          id="game-directory"
                          value={gameDirectory}
                          onChange={handleDirectoryChange}
                          className="flex-1"
                          disabled={directoryType === 'default' || directoryType === 'secrecy'}
                        />
                        <Button variant="outline">Examinar</Button>
                      </div>

                      <div className="flex flex-col gap-2 mt-3">
                        <div className="text-sm font-medium mb-1">Opciones predeterminadas:</div>
                        <div className="flex gap-2">
                          <Button
                            variant={directoryType === 'default' ? 'default' : 'outline'}
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDirectoryTypeChange('default')}
                          >
                            <Folder className="mr-2 h-4 w-4" />
                            Carpeta Minecraft oficial
                          </Button>
                          <Button
                            variant={directoryType === 'secrecy' ? 'default' : 'outline'}
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDirectoryTypeChange('secrecy')}
                          >
                            <Folder className="mr-2 h-4 w-4" />
                            Carpeta Secrecy Launcher
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Selecciona una opción predeterminada o introduce una ruta personalizada.
                          {directoryType !== 'custom' &&
                            ' El campo de ruta se ha bloqueado para evitar modificaciones accidentales.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Argumentos personalizados</CardTitle>
                    <CardDescription>
                      Configura argumentos adicionales para Java y Minecraft
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="custom-java-args">Argumentos de Java</Label>
                      <Input
                        id="custom-java-args"
                        placeholder="-XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20"
                        value={customJavaArgs}
                        onChange={(e) => setCustomJavaArgs(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Argumentos adicionales para la máquina virtual de Java
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custom-mc-args">Argumentos de Minecraft</Label>
                      <Input
                        id="custom-mc-args"
                        placeholder="--quickPlayMultiplayer mc.example.com:25565"
                        value={customMcArgs}
                        onChange={(e) => setCustomMcArgs(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Argumentos adicionales para el cliente de Minecraft
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de red</CardTitle>
                    <CardDescription>Configura opciones de proxy y conexión</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="use-proxy">Usar proxy</Label>
                        <p className="text-xs text-muted-foreground">
                          Conectar a través de un servidor proxy
                        </p>
                      </div>
                      <Switch id="use-proxy" checked={useProxy} onCheckedChange={setUseProxy} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="proxy-host">Host del proxy</Label>
                        <Input
                          id="proxy-host"
                          placeholder="proxy.example.com"
                          value={proxyHost}
                          onChange={(e) => setProxyHost(e.target.value)}
                          disabled={!useProxy}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="proxy-port">Puerto</Label>
                        <Input
                          id="proxy-port"
                          placeholder="8080"
                          value={proxyPort}
                          onChange={(e) => setProxyPort(e.target.value)}
                          disabled={!useProxy}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="proxy-username">Usuario</Label>
                        <Input
                          id="proxy-username"
                          placeholder="usuario"
                          value={proxyUsername}
                          onChange={(e) => setProxyUsername(e.target.value)}
                          disabled={!useProxy}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="proxy-password">Contraseña</Label>
                        <Input
                          id="proxy-password"
                          type="password"
                          placeholder="••••••••"
                          value={proxyPassword}
                          onChange={(e) => setProxyPassword(e.target.value)}
                          disabled={!useProxy}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor="timeout">Tiempo de espera (ms)</Label>
                      <Input
                        id="timeout"
                        type="number"
                        placeholder="10000"
                        value={minecraftTimeout}
                        onChange={(e) => setMinecraftTimeout(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Tiempo máximo de espera para las solicitudes de descarga
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Inicio rápido (QuickPlay)</CardTitle>
                    <CardDescription>
                      Configura opciones para iniciar directamente en un mundo o servidor
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="quickplay-type">Tipo</Label>
                      <Select value={quickPlayType} onValueChange={setQuickPlayType}>
                        <SelectTrigger id="quickplay-type">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Ninguno</SelectItem>
                          <SelectItem value="singleplayer">Un jugador</SelectItem>
                          <SelectItem value="multiplayer">Multijugador</SelectItem>
                          <SelectItem value="realms">Realms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quickplay-identifier">Identificador</Label>
                      <Input
                        id="quickplay-identifier"
                        placeholder="Nombre del mundo o dirección del servidor"
                        value={quickPlayIdentifier}
                        onChange={(e) => setQuickPlayIdentifier(e.target.value)}
                        disabled={quickPlayType === 'none'}
                      />
                      <p className="text-xs text-muted-foreground">
                        Nombre de la carpeta del mundo, dirección del servidor o ID del realm
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Sección de noticias actualizada para usar la API */}
          <TabsContent value="news" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Últimas noticias de Minecraft</h2>

            {isLoadingNews ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 bg-muted animate-pulse"></div>
                    <CardHeader className="pb-2">
                      <div className="h-6 bg-muted animate-pulse rounded mb-2"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="h-4 bg-muted animate-pulse rounded mb-2"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="h-9 bg-muted animate-pulse rounded w-full"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : news.length <= 0 ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2 text-destructive">
                  Error al cargar noticias
                </h3>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reintentar
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((item, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden transition-transform hover:scale-[1.01]"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={
                            getFullImageUrl(item.default_tile.image.imageURL) || '/placeholder.svg'
                          }
                          alt={item.default_tile.image.alt}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{item.default_tile.title}</CardTitle>
                          <Badge variant="outline">{item.primary_category}</Badge>
                        </div>
                        <CardDescription>{item.default_tile.sub_header}</CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            window.open(`https://www.minecraft.net${item.article_url}`, '_blank')
                          }
                        >
                          <Globe className="mr-2 h-4 w-4" />
                          Leer artículo
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open('https://www.minecraft.net/es-es/articles', '_blank')
                    }
                  >
                    Ver todas las noticias
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          {/* Pestañas deshabilitadas */}
          <TabsContent value="modpacks" className="space-y-4">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-muted/50 p-4 rounded-full mb-4">
                <Lock className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Modpacks - Próximamente</h2>
              <p className="text-muted-foreground max-w-md">
                Estamos trabajando en esta funcionalidad. Pronto podrás instalar y gestionar
                modpacks directamente desde el launcher.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="profiles" className="space-y-4">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-muted/50 p-4 rounded-full mb-4">
                <Lock className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Perfiles - Próximamente</h2>
              <p className="text-muted-foreground max-w-md">
                Estamos trabajando en esta funcionalidad. Pronto podrás crear y gestionar perfiles
                con diferentes configuraciones.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de configuración inicial con pasos */}
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
                      ¡Hola {storage.get('minecraft.profile').name}!
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      Has iniciado sesión correctamente con tu cuenta premium de Minecraft
                    </p>
                    <SkinViewerComponent
                      skinUrl={storage.get('minecraft.profile').skins[0].url}
                      username={storage.get('minecraft.profile').name}
                    />
                    <div className="flex justify-between gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          handlePreviousStep()
                          setIsLoggingIn(false)
                        }}
                        size="sm"
                      >
                        <ChevronLeft className="mr-1 h-4 w-4" />
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

            {/* Paso 1: Tipo de cuenta - Contenido más compacto */}
            {setupStep === 1 && !isLoggingIn && (
              <div className="space-y-3 animate-in fade-in slide-in-from-left-5 duration-300">
                <p className="text-muted-foreground mb-2">
                  ¿Qué tipo de cuenta de Minecraft utilizarás?
                </p>

                {/* Opciones de tipo de cuenta - Más compactas */}
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

                {/* Opciones adicionales para No Premium - Más compactas */}
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
                              <Steam className="h-4 w-4 text-slate-600" />
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
                            <UserCheck className="h-4 w-4 text-slate-600" />
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

            {/* Paso 2: Carpeta de instalación - Contenido más compacto */}
            {setupStep === 2 && !isLoggingIn && (
              <div className="space-y-3 animate-in fade-in slide-in-from-right-5 duration-300">
                <p className="text-muted-foreground mb-2">¿Dónde quieres que funcione Minecraft?</p>

                {/* Opciones de carpeta de instalación - Más compactas */}
                <div className="space-y-3">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderOpen className="h-4 w-4 text-amber-500" />
                      <h3 className="font-medium text-sm">Directorio de Minecraft</h3>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <Input
                        value={gameDirectory}
                        onChange={handleDirectoryChange}
                        className="flex-1 text-xs"
                        disabled={directoryType === 'default' || directoryType === 'secrecy'}
                      />
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <Folder className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className={`border rounded-lg p-2 cursor-pointer transition-all ${directoryType === 'default' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                        onClick={() => handleDirectoryTypeChange('default')}
                      >
                        <div className="flex flex-col items-center gap-1 text-center">
                          <div className="bg-blue-100 p-1.5 rounded-full">
                            <Folder className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium">Carpeta Minecraft oficial</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Usa la carpeta .minecraft estándar
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`border rounded-lg p-2 cursor-pointer transition-all ${directoryType === 'secrecy' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                        onClick={() => handleDirectoryTypeChange('secrecy')}
                      >
                        <div className="flex flex-col items-center gap-1 text-center">
                          <div className="bg-green-100 p-1.5 rounded-full">
                            <Folder className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium">Carpeta Secrecy Launcher</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Instalación independiente
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de navegación */}
                <div className="flex justify-between gap-2 mt-4">
                  <Button variant="outline" onClick={handlePreviousStep} size="sm">
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Atrás
                  </Button>
                  <Button variant="default" onClick={finishSetup} size="sm">
                    Finalizar
                  </Button>
                </div>
              </div>
            )}

            {/* Estado de inicio de sesión con Microsoft */}
          </div>
        </div>
      )}

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
                      ¡Hola {storage.get('minecraft.profile').name}!
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      Has iniciado sesión correctamente con tu cuenta premium de Minecraft
                    </p>
                    <SkinViewerComponent
                      skinUrl={storage.get('minecraft.profile').skins[0].url}
                      username={storage.get('minecraft.profile').name}
                    />
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
                      {userAccount?.email && ` - ${userAccount.email}`}
                    </p>
                  </div>
                </div>

                <Separator />

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
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${userAccount?.type === 'no-premium' ? 'border-primary' : 'border-muted-foreground'}`}
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
                              <Steam className="h-4 w-4 text-slate-600" />
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
                            <UserCheck className="h-4 w-4 text-slate-600" />
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

      {/* Estilos adicionales para animaciones */}
      <style jsx global>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        @keyframes pulse-scale {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }

        @keyframes pulse-height {
          0%,
          100% {
            height: 30%;
          }
          50% {
            height: 70%;
          }
        }
        .animate-pulse-height {
          animation: pulse-height 1.5s ease-in-out infinite;
          position: absolute;
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce {
          animation: bounce 1.5s ease-in-out infinite;
        }

        .slide-transition {
          transition: all 0.3s ease-in-out;
        }
      `}</style>
    </>
  )
}
