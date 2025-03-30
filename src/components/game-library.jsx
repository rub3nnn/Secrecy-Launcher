'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GameDetailsDialog } from '@/components/game-details-dialog'
import { InstallDialog } from '@/components/install-dialog'
import { UninstallDialog } from '@/components/uninstall-dialog'
import { GameCard } from '@/components/game-card'

// Datos de juego de respaldo en caso de error al cargar el JSON
const fallbackGameData = [
  {
    id: 1,
    title: 'R.E.P.O.',
    url: 'https://www.dropbox.com/scl/fi/lev8mhz83iv1eb7ilyyhj/R.E.P.O.rar?rlkey=i7bhebpsluep3ukiedf9g90kh&st=154r0jiz&dl=1',
    executable: 'REPO.exe',
    needExtract: true,
    image: '/header.jpg',
    banner:
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3241660/header.jpg?t=1740578354',
    backgroundVideo: '/video.webm',
    genre: 'Terror cooperativo en línea',
    size: '1.7 GB',
    lastPlayed: '(Estadísticas no disponibles)',
    description:
      'R.E.P.O. es un juego de horror cooperativo para hasta 6 jugadores, donde debes localizar, manipular y extraer objetos valiosos con físicas realistas para cumplir los deseos de tu creador.',
    fullDescription:
      'En R.E.P.O., tú y tu equipo seréis enviados por una entidad misteriosa para recuperar objetos de valor en entornos oscuros y peligrosos. Con una mecánica de físicas compleja, cada objeto debe ser manejado con precisión mientras lidias con horrores ocultos. La experiencia se centra en el trabajo en equipo, la tensión constante y una ambientación espeluznante. Con una comunidad activa y reseñas extremadamente positivas, R.E.P.O. se ha convertido en un fenómeno cooperativo del terror.',
    developer: 'semiwork',
    publisher: 'semiwork',
    releaseDate: '26 FEB 2025',
    platform: 'Windows',
    systemRequirements: {
      minimum: [
        'OS: Windows 10 64-bit',
        'Procesador: Intel i5-4590 / AMD FX 8350',
        'Memoria: 8 GB RAM',
        'Gráficos: NVIDIA GTX 970 / AMD Radeon R9 290',
        'DirectX: Versión 11',
        'Almacenamiento: 10 GB disponibles'
      ],
      recommended: [
        'OS: Windows 10 64-bit',
        'Procesador: Intel i7 / AMD Ryzen 7',
        'Memoria: 16 GB RAM',
        'Gráficos: NVIDIA RTX 2060 / AMD RX 5700',
        'DirectX: Versión 12',
        'Almacenamiento: 10 GB SSD'
      ]
    }
  },
  {
    id: 2,
    title: 'Instalador de Steam',
    url: 'https://cdn.fastly.steamstatic.com/client/installer/SteamSetup.exe',
    executable: 'SteamSetup.exe',
    needExtract: false,
    image: '/header.jpg',
    banner:
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3241660/header.jpg?t=1740578354',
    backgroundVideo: '/video.webm',
    genre: 'Terror cooperativo en línea',
    size: '1.7 GB',
    lastPlayed: '(Estadísticas no disponibles)',
    description:
      'R.E.P.O. es un juego de horror cooperativo para hasta 6 jugadores, donde debes localizar, manipular y extraer objetos valiosos con físicas realistas para cumplir los deseos de tu creador.',
    fullDescription:
      'En R.E.P.O., tú y tu equipo seréis enviados por una entidad misteriosa para recuperar objetos de valor en entornos oscuros y peligrosos. Con una mecánica de físicas compleja, cada objeto debe ser manejado con precisión mientras lidias con horrores ocultos. La experiencia se centra en el trabajo en equipo, la tensión constante y una ambientación espeluznante. Con una comunidad activa y reseñas extremadamente positivas, R.E.P.O. se ha convertido en un fenómeno cooperativo del terror.',
    developer: 'semiwork',
    publisher: 'semiwork',
    releaseDate: '26 FEB 2025',
    platform: 'Windows',
    systemRequirements: {
      minimum: [
        'OS: Windows 10 64-bit',
        'Procesador: Intel i5-4590 / AMD FX 8350',
        'Memoria: 8 GB RAM',
        'Gráficos: NVIDIA GTX 970 / AMD Radeon R9 290',
        'DirectX: Versión 11',
        'Almacenamiento: 10 GB disponibles'
      ],
      recommended: [
        'OS: Windows 10 64-bit',
        'Procesador: Intel i7 / AMD Ryzen 7',
        'Memoria: 16 GB RAM',
        'Gráficos: NVIDIA RTX 2060 / AMD RX 5700',
        'DirectX: Versión 12',
        'Almacenamiento: 10 GB SSD'
      ]
    }
  }
]

export function GameLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGame, setSelectedGame] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isInstallOpen, setIsInstallOpen] = useState(false)
  const [isUninstallOpen, setIsUninstallOpen] = useState(false)
  const [gameData, setGameData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Función para cargar los datos persistentes de los juegos
  const loadPersistedGameData = async () => {
    try {
      // Cargar los datos base del juego
      const baseGameData = fallbackGameData

      // Cargar los estados persistentes (solo los que han cambiado)
      const persistedData =
        (await window.electron.ipcRenderer.invoke('storageGet', 'gamesState')) || {}

      // Combinar los datos base con los persistentes (solo para juegos modificados)
      const mergedGameData = baseGameData.map((game) => {
        // Si existe data persistente para este juego, la usamos
        if (persistedData[game.id]) {
          return {
            ...game,
            ...persistedData[game.id] // Solo sobrescribe las propiedades que han cambiado
          }
        }
        return game // Si no hay cambios, devuelve el juego original
      })

      setGameData(mergedGameData)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading persisted game data:', error)
      setGameData(fallbackGameData)
      setIsLoading(false)
    }
  }

  // Función para guardar solo los estados modificados de los juegos
  const saveGamesState = async (games) => {
    try {
      // Extraer solo los juegos que tienen cambios respecto a los datos originales
      const gamesState = games.reduce((acc, game) => {
        const originalGame = fallbackGameData.find((g) => g.id === game.id)

        // Solo guardamos si hay diferencias con el juego original
        if (
          originalGame &&
          (game.installed !== originalGame.installed ||
            game.favorite !== originalGame.favorite ||
            game.installPath !== originalGame.installPath ||
            game.lastPlayed !== originalGame.lastPlayed ||
            game.progress !== originalGame.progress)
        ) {
          acc[game.id] = {
            installed: game.installed,
            favorite: game.favorite,
            installPath: game.installPath,
            lastPlayed: game.lastPlayed,
            progress: game.progress
          }
        }
        return acc
      }, {})

      await window.electron.ipcRenderer.invoke('storageSet', 'gamesState', gamesState)
    } catch (error) {
      console.error('Error saving games state:', error)
    }
  }

  useEffect(() => {
    loadPersistedGameData()
  }, [])

  // Actualizar el estado guardado cada vez que gameData cambie
  useEffect(() => {
    if (!isLoading && gameData.length > 0) {
      saveGamesState(gameData)
    }
  }, [gameData, isLoading])

  const filteredGames = gameData.filter((game) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInstall = (gameId) => {
    setSelectedGame(gameData.find((g) => g.id === gameId) || null)
    setIsInstallOpen(true)
  }

  const handleUninstall = (gameId) => {
    setSelectedGame(gameData.find((g) => g.id === gameId) || null)
    setIsUninstallOpen(true)
  }

  const completeInstallation = (gameId, installPath, exePath) => {
    setGameData((prev) =>
      prev.map((game) =>
        game.id === gameId
          ? {
              ...game,
              installed: true,
              installPath: installPath || game.installPath,
              lastPlayed: 'Nunca',
              progress: 0,
              exePath: exePath || ''
            }
          : game
      )
    )
    setIsInstallOpen(false)
  }

  const completeUninstallation = async (gameId) => {
    const game = gameData.find((g) => g.id === gameId)
    if (!game) return

    try {
      // Llamar al backend para desinstalar
      const result = await window.electron.ipcRenderer.invoke('uninstallGame', game.installPath)

      if (!result.success) {
        throw new Error(result.message)
      }

      // Actualizar el estado local
      setGameData((prev) =>
        prev.map((g) =>
          g.id === gameId
            ? {
                ...g,
                installed: false,
                installPath: '',
                lastPlayed: 'Nunca',
                progress: 0
              }
            : g
        )
      )

      return true
    } catch (error) {
      console.error('Error al desinstalar:', error)
      // Puedes mostrar una notificación al usuario aquí
      return false
    }
  }

  // Función para verificar el estado de instalación al cargar
  const verifyInstallations = async () => {
    const updatedGames = await Promise.all(
      gameData.map(async (game) => {
        if (!game.installed || !game.installPath) return game

        const isInstalled = await window.electron.ipcRenderer.invoke(
          'checkGameInstalled',
          game.installPath
        )

        return {
          ...game,
          installed: isInstalled,
          ...(!isInstalled && { installPath: '' })
        }
      })
    )

    setGameData(updatedGames)
  }

  const toggleFavorite = (gameId) => {
    setGameData((prev) => {
      const updatedGames = prev.map((game) =>
        game.id === gameId ? { ...game, favorite: !game.favorite } : game
      )

      // Actualizar también el juego seleccionado si es el mismo
      if (gameId === selectedGame?.id) {
        setSelectedGame(updatedGames.find((g) => g.id === gameId))
      }

      return updatedGames
    })
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando juegos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 px-4 py-3 rounded-md mx-6 mt-4">
        <p className="text-sm">
          <strong>Nota:</strong> Actualmente solo hay un juego disponible. Más títulos y
          funcionalidades serán añadidos próximamente.
        </p>
      </div>
      <div className="flex-1 p-6">
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">Todos los juegos</TabsTrigger>
              <TabsTrigger value="installed">Instalados</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            </TabsList>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar juegos..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <TabsContent value="all" className="m-0">
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onViewDetails={() => {
                      setSelectedGame(game)
                      setIsDetailsOpen(true)
                    }}
                    onInstall={() => handleInstall(game.id)}
                    onUninstall={() => handleUninstall(game.id)}
                    onToggleFavorite={() => toggleFavorite(game.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No se encontraron juegos</h3>
                <p className="text-muted-foreground">Intenta con otra búsqueda</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="installed" className="m-0">
            {filteredGames.filter((game) => game.installed).length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredGames
                  .filter((game) => game.installed)
                  .map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onViewDetails={() => {
                        setSelectedGame(game)
                        setIsDetailsOpen(true)
                      }}
                      onInstall={() => handleInstall(game.id)}
                      onUninstall={() => handleUninstall(game.id)}
                      onToggleFavorite={() => toggleFavorite(game.id)}
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No hay juegos instalados</h3>
                <p className="text-muted-foreground">Instala tu primer juego para verlo aquí</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="favorites" className="m-0">
            {filteredGames.filter((game) => game.favorite).length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredGames
                  .filter((game) => game.favorite)
                  .map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onViewDetails={() => {
                        setSelectedGame(game)
                        setIsDetailsOpen(true)
                      }}
                      onInstall={() => handleInstall(game.id)}
                      onUninstall={() => handleUninstall(game.id)}
                      onToggleFavorite={() => toggleFavorite(game.id)}
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No hay juegos favoritos</h3>
                <p className="text-muted-foreground">
                  Marca un juego como favorito para verlo aquí
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      {selectedGame && (
        <>
          <GameDetailsDialog
            game={selectedGame}
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            onToggleFavorite={() => toggleFavorite(selectedGame.id)}
          />
          <InstallDialog
            game={selectedGame}
            open={isInstallOpen}
            onOpenChange={setIsInstallOpen}
            onComplete={completeInstallation}
          />
          <UninstallDialog
            game={selectedGame}
            open={isUninstallOpen}
            onOpenChange={setIsUninstallOpen}
            onConfirm={() => completeUninstallation(selectedGame.id)}
          />
        </>
      )}
    </div>
  )
}
