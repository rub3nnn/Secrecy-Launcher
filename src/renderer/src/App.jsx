import { useState, useEffect } from 'react'
import { GameLibrary } from '@/components/game-library'
import { SidebarNav } from '@/components/sidebar-nav'
import { UpdateNotification } from '@/components/update'

function App() {
  const [gameData, setGameData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función para cargar los datos persistentes de los juegos
  const loadPersistedGameData = async () => {
    try {
      // Cargar los datos base del juego desde la API
      const baseGameData = await window.electron.ipcRenderer.invoke('fetchGameData')

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
      setIsLoading(true)
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

  return (
    <div className="flex h-screen bg-background">
      <SidebarNav gameData={gameData} isLoading={isLoading} />
      <main className="flex-1 overflow-auto">
        <GameLibrary
          gameData={gameData}
          setGameData={setGameData}
          isLoading={isLoading}
          error={error}
          handleRetry={() => {
            setIsLoading(true)
            setError(null)
            loadPersistedGameData()
          }}
        />
      </main>
      <UpdateNotification />
    </div>
  )
}

export default App
