'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GameDetailsDialog } from '@/components/game-details-dialog'
import { InstallDialog } from '@/components/install-dialog'
import { UninstallDialog } from '@/components/uninstall-dialog'
import { GameCard } from '@/components/game-card'
import { ErrorDisplay } from '@/components/error'

export function GameLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGame, setSelectedGame] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isInstallOpen, setIsInstallOpen] = useState(false)
  const [isUninstallOpen, setIsUninstallOpen] = useState(false)
  const [gameData, setGameData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función para cargar los datos de juegos desde la API
  const fetchGameData = async () => {
    try {
      const response = await fetch(
        'https://secrecyfiles.github.io/fileshoster/secrecylauncher/data.json'
      )
      if (!response.ok) {
        throw new Error('No se pudo cargar los datos de los juegos')
      }
      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error al cargar los datos:', err)
      throw err
    }
  }

  // Función para cargar los datos persistentes de los juegos
  const loadPersistedGameData = async () => {
    try {
      // Cargar los datos base del juego desde la API
      const baseGameData = await fetchGameData()

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
      console.error('Error loading game data:', error)
      setError('No se pudieron cargar los juegos. Por favor, intenta más tarde.')
      setIsLoading(false)
    }
  }

  // Función para guardar solo los estados modificados de los juegos
  const saveGamesState = async (games) => {
    try {
      const gamesState = games.reduce((acc, game) => {
        acc[game.id] = {
          installed: game.installed,
          favorite: game.favorite,
          installPath: game.installPath,
          lastPlayed: game.lastPlayed,
          progress: game.progress,
          exePath: game.exePath
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
      return false
    }
  }

  const toggleFavorite = (gameId) => {
    setGameData((prev) => {
      const updatedGames = prev.map((game) =>
        game.id === gameId ? { ...game, favorite: !game.favorite } : game
      )

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

  if (error) {
    return (
      <ErrorDisplay error={error} /> // Asumiendo que tienes un componente ErrorDisplay
    )
  }

  return (
    <div className="h-full flex flex-col">
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
            onInstall={() => {
              handleInstall(selectedGame.id)
              setIsDetailsOpen(false)
            }}
          />
          <InstallDialog
            game={selectedGame}
            open={isInstallOpen}
            onOpenChange={setIsInstallOpen}
            onComplete={completeInstallation}
            onError={(error) => {
              setIsInstallOpen(false)
            }}
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
