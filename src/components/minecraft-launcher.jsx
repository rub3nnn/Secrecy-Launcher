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
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Play,
  Download,
  Settings,
  RefreshCw,
  Layers,
  Globe,
  Users,
  Folder,
  ChevronRight,
  Clock,
  Check,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import { DualRangeSlider } from '@/components/ui/range-slider'

// Datos de ejemplo para los modpacks
const modpacks = [
  {
    id: 1,
    name: 'Better Minecraft',
    version: '1.20.1',
    author: 'ShockByte',
    downloads: '2.5M',
    image: 'https://i.imgur.com/XqQJqKD.png',
    description:
      'Una colección de mods que mejoran la experiencia de juego sin cambiar la esencia de Minecraft.',
    isInstalled: true
  },
  {
    id: 2,
    name: 'RLCraft',
    version: '1.19.4',
    author: 'Shivaxi',
    downloads: '10M+',
    image: 'https://i.imgur.com/JwfQYaT.png',
    description:
      'Un modpack hardcore que transforma Minecraft en un juego de supervivencia extremadamente difícil.',
    isInstalled: false
  },
  {
    id: 3,
    name: 'SkyFactory 4',
    version: '1.19.2',
    author: 'DarkostoHD',
    downloads: '5M+',
    image: 'https://i.imgur.com/8Lz0Fg0.png',
    description:
      'Comienza en una sola isla flotante y construye tu mundo desde cero con tecnología y magia.',
    isInstalled: false
  },
  {
    id: 4,
    name: 'All the Mods 8',
    version: '1.20.1',
    author: 'ATM Team',
    downloads: '3.2M',
    image: 'https://i.imgur.com/Iu5FQqJ.png',
    description:
      'Una colección masiva de mods que añade tecnología, magia, exploración y mucho más.',
    isInstalled: false
  }
]

// Datos de ejemplo para los perfiles
const profiles = [
  {
    id: 1,
    name: 'Default',
    version: '1.20.4',
    lastPlayed: 'Hace 2 días',
    memory: 4096,
    javaPath: 'Automático',
    isActive: true
  },
  {
    id: 2,
    name: 'Mods',
    version: '1.19.2',
    lastPlayed: 'Hace 1 semana',
    memory: 8192,
    javaPath: 'Automático',
    isActive: false
  },
  {
    id: 3,
    name: 'Servidor Amigos',
    version: '1.20.1',
    lastPlayed: 'Hace 3 días',
    memory: 6144,
    javaPath: 'Automático',
    isActive: false
  }
]

export function MinecraftLauncher({ minecraftStatus }) {
  // Estados principales
  const [selectedVersion, setSelectedVersion] = useState('')
  const [selectedProfile, setSelectedProfile] = useState(profiles[0])
  const [memoryAllocation, setMemoryAllocation] = useState([2048, 4096])
  const [isInstalling, setIsInstalling] = useState(false)
  const [installProgress, setInstallProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showOnlyInstalled, setShowOnlyInstalled] = useState(false)

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
    'C:\\Users\\Usuario\\AppData\\Roaming\\.minecraft'
  )
  const [cachePath, setCachePath] = useState(
    'C:\\Users\\Usuario\\AppData\\Roaming\\.minecraft\\cache'
  )
  const [customJavaPath, setCustomJavaPath] = useState('Automático')
  const [closeLauncher, setCloseLauncher] = useState(true)
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [showSnapshots, setShowSnapshots] = useState(false)
  const [separateDirectories, setSeparateDirectories] = useState(false)
  const [windowWidth, setWindowWidth] = useState('')
  const [windowHeight, setWindowHeight] = useState('')
  const [fullscreen, setFullscreen] = useState(false)
  const [customJavaArgs, setCustomJavaArgs] = useState('')
  const [customMcArgs, setCustomMcArgs] = useState('')
  const [useProxy, setUseProxy] = useState(false)
  const [proxyHost, setProxyHost] = useState('')
  const [proxyPort, setProxyPort] = useState('8080')
  const [proxyUsername, setProxyUsername] = useState('')
  const [proxyPassword, setProxyPassword] = useState('')
  const [timeout, setTimeout] = useState('10000')
  const [quickPlayType, setQuickPlayType] = useState('none')
  const [quickPlayIdentifier, setQuickPlayIdentifier] = useState('')
  const [quickPlayPath, setQuickPlayPath] = useState('')
  const [clientPackage, setClientPackage] = useState('')
  const [removePackage, setRemovePackage] = useState(true)
  const [forgePath, setForgePath] = useState('')
  const [isDemoUser, setIsDemoUser] = useState(false)
  const [hasCustomResolution, setHasCustomResolution] = useState(false)

  // Función para obtener las opciones de lanzamiento
  const getLaunchOptions = () => {
    // Campos obligatorios
    const launchOptions = {
      root: gameDirectory,
      version: {
        number: selectedVersion,
        type: versions.find((v) => v.id === selectedVersion)?.type || 'release',
        custom: selectedVersion
      },
      memory: {
        min: memoryAllocation[0].toString(),
        max: memoryAllocation[1].toString()
      }
    }

    // Añadir campos opcionales si tienen valores
    const optionalFields = {
      cache: cachePath,
      javaPath: customJavaPath !== 'Automático' ? customJavaPath : undefined,
      customArgs: customJavaArgs ? customJavaArgs.split(' ') : undefined,
      customLaunchArgs: customMcArgs ? customMcArgs.split(' ') : undefined,
      window:
        windowWidth || windowHeight
          ? {
              width: windowWidth,
              height: windowHeight,
              fullscreen
            }
          : undefined,
      quickPlay:
        quickPlayType !== 'none'
          ? {
              type: quickPlayType,
              identifier: quickPlayIdentifier,
              path: quickPlayPath
            }
          : undefined,
      proxy: useProxy
        ? {
            host: proxyHost,
            port: proxyPort,
            username: proxyUsername,
            password: proxyPassword
          }
        : undefined,
      timeout: timeout ? parseInt(timeout) : undefined,
      clientPackage: clientPackage || undefined,
      removePackage,
      forge: forgePath || undefined,
      features: [
        ...(isDemoUser ? ['is_demo_user'] : []),
        ...(hasCustomResolution ? ['has_custom_resolution'] : [])
      ]
    }

    // Combinar campos obligatorios con opcionales (filtrando undefined)
    return {
      ...launchOptions,
      ...Object.fromEntries(Object.entries(optionalFields).filter(([_, v]) => v !== undefined))
    }
  }

  // Función para lanzar el juego
  const handlePlayGame = () => {
    try {
      const launchOptions = getLaunchOptions()

      // Validar campos obligatorios
      if (!launchOptions.version.number) {
        throw new Error('Debes seleccionar una versión de Minecraft')
      }
      if (!launchOptions.root) {
        throw new Error('El directorio del juego es requerido')
      }

      setIsPlaying(true)
      setLoadingProgress(0)

      console.log('Opciones de lanzamiento:', launchOptions)
      window.electron.ipcRenderer.send('launch-minecraft', launchOptions)
    } catch (error) {
      console.error('Error al lanzar Minecraft:', error)
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }

  // Cargar versiones desde la API
  const fetchVersions = async (showRefresh = false) => {
    if (showRefresh) {
      setIsRefreshingVersions(true)
    } else {
      setIsLoadingVersions(true)
    }
    setVersionsError(null)

    try {
      const response = await fetch('https://mc-versions-api.net/api/java?detailed=true')
      if (!response.ok) throw new Error(`Error al obtener versiones: ${response.status}`)

      const data = await response.json()
      const processedVersions = data.result.map((version, index) => {
        const releaseDate = new Date(version.releaseDate)
        const formattedDate = releaseDate.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })

        const isSnapshot = version.version.includes('w') || version.version.includes('pre')

        return {
          id: version.version,
          name: version.version,
          type: isSnapshot ? 'snapshot' : 'release',
          releaseDate: formattedDate,
          isInstalled: index % 3 === 0
        }
      })

      setVersions(processedVersions)

      // Seleccionar la primera versión release si no hay selección
      if (!selectedVersion) {
        const firstRelease = processedVersions.find((v) => v.type === 'release')
        if (firstRelease) setSelectedVersion(firstRelease.id)
      }
    } catch (error) {
      console.error('Error cargando versiones:', error)
      setVersionsError(error.message)
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
    if (minecraftStatus.stage === 'downloading-java') {
      setLoadingProgress(minecraftStatus.progress)
    }
    if (minecraftStatus.stage === 'closed') {
      setIsPlaying(false)
      setLoadingProgress(0)
    }
  }, [minecraftStatus])

  useEffect(() => {
    fetchVersions()
    fetchNews()
  }, [])

  // Función para construir la URL completa de la imagen
  const getFullImageUrl = (imageUrl) => {
    return 'https://minecraft.net/' + imageUrl
  }

  // El resto del componente renderizado permanece igual...
  // [Aquí iría todo el JSX de renderizado que ya tenías]
  // Solo asegúrate de conectar los nuevos estados a los controles correspondientes

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
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm opacity-80">Versión seleccionada:</p>
              <div className="flex items-center gap-2">
                <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                  <SelectTrigger className="w-[200px] bg-black/50 border-white/20 text-white">
                    <SelectValue placeholder="Seleccionar versión" />
                  </SelectTrigger>
                  <SelectContent className="overflow-y-auto max-h-[30rem]">
                    {versions
                      .filter((version) => version.type === 'release')
                      .map((version) => (
                        <SelectItem key={version.id} value={version.id}>
                          {version.name} {version.isInstalled && '✓'}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              size="lg"
              className="gap-2 px-8 bg-green-600 hover:bg-green-700 text-white"
              onClick={handlePlayGame}
              disabled={isPlaying || !selectedVersion}
            >
              {isPlaying ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Iniciando...
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

      {/* Loader que reemplaza el separador cuando se está iniciando el juego */}
      <div className="relative h-1 bg-muted">
        {isPlaying && (
          <div
            className="absolute inset-0 bg-green-600 transition-all duration-300"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        )}
      </div>

      <div className="container mx-auto p-6">
        <Tabs defaultValue="versions">
          <TabsList className="mb-6">
            <TabsTrigger value="versions">Versiones</TabsTrigger>
            <TabsTrigger value="modpacks" disabled>
              Modpacks
            </TabsTrigger>
            <TabsTrigger value="profiles" disabled>
              Perfiles
            </TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
            <TabsTrigger value="news">Noticias</TabsTrigger>
          </TabsList>

          <TabsContent value="versions" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Versiones de Minecraft</h2>
              <div className="flex gap-2">
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 px-3 py-1"
                    onClick={() => setShowOnlyInstalled(!showOnlyInstalled)}
                  >
                    {showOnlyInstalled ? (
                      <span className="flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" />
                        Solo instaladas
                      </span>
                    ) : (
                      'Mostrar instaladas'
                    )}
                  </Badge>
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
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {versions
                  .filter(
                    (version) =>
                      version.type === 'release' && (!showOnlyInstalled || version.isInstalled)
                  )
                  .map((version) => (
                    <Card
                      key={version.id}
                      className={`${
                        version.id === selectedVersion ? 'border-primary/50 bg-primary/5' : ''
                      } cursor-pointer transition-all hover:border-primary/30 hover:bg-primary/5`}
                      onClick={() => setSelectedVersion(version.id)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {version.name}
                              {version.isInstalled && <Check className="h-4 w-4 text-green-500" />}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{version.releaseDate}</span>
                            </CardDescription>
                          </div>
                          <Badge variant="default">Release</Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          {/* Resto de las pestañas... */}
          {/* Asegúrate de conectar los nuevos estados a los controles correspondientes */}
          {/* Por ejemplo, en la pestaña de configuración: */}

          <TabsContent value="settings" className="space-y-6">
            <Tabs defaultValue="general">
              <TabsList className="mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="advanced">Avanzado</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
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
                        />
                        <Button variant="outline">Examinar</Button>
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
                      <Label htmlFor="close-launcher">Cerrar launcher al iniciar el juego</Label>
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
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <Label htmlFor="snapshot">Mostrar snapshots</Label>
                      <Switch
                        id="snapshot"
                        checked={showSnapshots}
                        onCheckedChange={setShowSnapshots}
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
                        <Input id="window-width" type="number" placeholder="854" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="window-height">Alto</Label>
                        <Input id="window-height" type="number" placeholder="480" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="fullscreen">Pantalla completa</Label>
                        <p className="text-xs text-muted-foreground">
                          Iniciar el juego en modo pantalla completa
                        </p>
                      </div>
                      <Switch id="fullscreen" />
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
                          value="C:\Users\Usuario\AppData\Roaming\.minecraft"
                          readOnly
                          className="flex-1"
                        />
                        <Button variant="outline">Cambiar</Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="separate-directories">
                          Usar directorios separados para versiones
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Cada versión tendrá su propia carpeta de datos
                        </p>
                      </div>
                      <Switch id="separate-directories" />
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
                      <Switch id="use-proxy" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="proxy-host">Host del proxy</Label>
                        <Input id="proxy-host" placeholder="proxy.example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="proxy-port">Puerto</Label>
                        <Input id="proxy-port" placeholder="8080" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="proxy-username">Usuario</Label>
                        <Input id="proxy-username" placeholder="usuario" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="proxy-password">Contraseña</Label>
                        <Input id="proxy-password" type="password" placeholder="••••••••" />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor="timeout">Tiempo de espera (ms)</Label>
                      <Input id="timeout" type="number" placeholder="10000" />
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
                      <Select defaultValue="none">
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
                      />
                      <p className="text-xs text-muted-foreground">
                        Nombre de la carpeta del mundo, dirección del servidor o ID del realm
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Opciones de paquetes</CardTitle>
                    <CardDescription>
                      Configura opciones para paquetes de cliente personalizados
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-package">Paquete de cliente</Label>
                      <div className="flex gap-2">
                        <Input
                          id="client-package"
                          placeholder="Ruta al archivo ZIP"
                          className="flex-1"
                        />
                        <Button variant="outline">Examinar</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ruta o URL a un archivo ZIP que se extraerá en el directorio raíz
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="remove-package">Eliminar paquete después de extraer</Label>
                        <p className="text-xs text-muted-foreground">
                          Eliminar el archivo ZIP después de extraerlo
                        </p>
                      </div>
                      <Switch id="remove-package" defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Forge</CardTitle>
                    <CardDescription>Configura opciones para Forge</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forge-path">Ruta a Forge</Label>
                      <div className="flex gap-2">
                        <Input
                          id="forge-path"
                          placeholder="Ruta al archivo JAR de Forge"
                          className="flex-1"
                        />
                        <Button variant="outline">Examinar</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ruta al archivo JAR de Forge (versiones anteriores a 1.12.2 deben ser el JAR
                        "universal", versiones posteriores a 1.13 deben ser el JAR "installer")
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline">Restablecer valores predeterminados</Button>
                  <Button>Guardar configuración avanzada</Button>
                </div>
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
        </Tabs>
      </div>
    </>
  )
}
