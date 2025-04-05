import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GameDetailsDialog } from '@/components/game-details-dialog'
import { InstallDialog } from '@/components/install-dialog'
import { UninstallDialog } from '@/components/uninstall-dialog'
import { GameCard } from '@/components/game-card'
import { ErrorDisplay } from '@/components/error'
import { SteamRequirementNotification } from '@/components/require-steam'

export function GameLibrary({ gameData, setGameData, isLoading, error, handleRetry }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGame, setSelectedGame] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isInstallOpen, setIsInstallOpen] = useState(false)
  const [isUninstallOpen, setIsUninstallOpen] = useState(false)
  const [steamRequiredOpen, setSteamRequiredOpen] = useState('')
  const [steamRequiredMode, setSteamRequiredMode] = useState('')

  useEffect(() => {
    window.electron.ipcRenderer.on('launch-end', (event, data) => {
      setGameData((prev) =>
        prev.map((game) =>
          game.id === data.id
            ? {
                ...game,
                lastPlayed: Date.now()
              }
            : game
        )
      )
      if (data.error && data.requireSteam) {
        setSteamRequiredOpen(data.game)
        setSteamRequiredMode(data.steamRequiredMode)
        setSelectedGame(null)
      }
    })
  }, [])

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
    return <ErrorDisplay error={error} retry={handleRetry} />
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 pb-6 pt-0 px-5">
        <Tabs defaultValue="all">
          <div className="sticky top-0 z-10 bg-background pt-4 pb-4 mb-2">
            <div className="flex justify-between items-center px-1">
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
            <div className="h-4 bg-gradient-to-b from-background to-transparent absolute left-0 right-0 -bottom-4 z-[-1]"></div>
          </div>
          <TabsContent value="all" className="m-0 px-1">
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
          <TabsContent value="installed" className="m-0  px-1">
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
          <TabsContent value="favorites" className="m-0 px-1">
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
      {steamRequiredOpen && (
        <SteamRequirementNotification
          game={steamRequiredOpen}
          mode={steamRequiredMode}
          onClose={() => setSteamRequiredOpen('')}
          onContinue={() => {
            window.electron.ipcRenderer.send('launchGame', {
              ...steamRequiredOpen,
              requireSteam: false
            })
            setSteamRequiredOpen('')
          }}
        />
      )}
    </div>
  )
}
