import { useState, useEffect, useCallback, useMemo } from 'react'
import { GameLibrary } from '@/components/game-library'
import { SidebarNav } from '@/components/sidebar-nav'
import { UpdateNotification } from '@/components/update'
import { AppErrorDialog } from '@/components/app-error-dialog'
import { MinecraftLauncher } from '@/components/minecraft-launcher'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PinAccess } from '@/components/pass-game-library'
function App() {
  const [gameData, setGameData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [isDownloadsSidebarOpen, setIsDownloadsSidebarOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState('minecraft')
  const [minecraftStatus, setMinecraftStatus] = useState({})
  const [libraryAccess, setLibraryAccess] = useState(false)
  const [currentError, setCurrentError] = useState({
    title: '',
    description: '',
    severity: '',
    errorCode: '',
    errorDetails: ''
  })
  const [scrollPosition, setScrollPosition] = useState(0)

  // Memoized handler for errors
  const handleErrors = useCallback((error) => {
    console.error('Error:', error)
    setCurrentError({
      title: error.title || 'Ha ocurrido un error',
      description: error.description || 'No se pudo procesar la solicitud.',
      severity: error.severity || 'error',
      errorCode: error.errorCode,
      errorDetails: error.errorDetails
    })
    setShowErrorDialog(true)
  }, [])

  // Throttled progress updates
  const throttledProgressUpdate = useCallback((data) => {
    setGameData((prev) => {
      const newData = [...prev]
      const gameIndex = newData.findIndex((g) => g.id === data.id)
      if (gameIndex !== -1) {
        newData[gameIndex] = {
          ...newData[gameIndex],
          download: {
            ...newData[gameIndex].download,
            status: 'downloading',
            progress: data.progress,
            speed: data.speed,
            downloaded: data.downloaded,
            total: data.total,
            message: data.message
          }
        }
      }
      return newData
    })
  }, [])

  useEffect(() => {
    const downloadProgressHandler = (event, data) => {
      throttledProgressUpdate(data)
    }

    const downloadErrorHandler = (event, data) => {
      setGameData((prev) => {
        const newData = [...prev]
        const gameIndex = newData.findIndex((g) => g.id === data.id)
        if (gameIndex !== -1) {
          newData[gameIndex] = {
            ...newData[gameIndex],
            download: ''
          }
        }
        return newData
      })
      handleErrors({
        title: 'Error de descarga',
        description: data.description,
        errorCode: data.errorCode,
        errorDetails: data.error
      })
    }

    const installingProgressHandler = (event, data) => {
      setGameData((prev) => {
        const newData = [...prev]
        const gameIndex = newData.findIndex((g) => g.id === data.id)
        if (gameIndex !== -1) {
          newData[gameIndex] = {
            ...newData[gameIndex],
            download: {
              ...newData[gameIndex].download,
              status: 'installing',
              progress: data.progress,
              message: data.message
            }
          }
        }
        return newData
      })
    }

    const installationCompleteHandler = (event, data) => {
      setGameData((prev) => {
        const newData = [...prev]
        const gameIndex = newData.findIndex((g) => g.id === data.id)
        if (gameIndex !== -1) {
          newData[gameIndex] = {
            ...newData[gameIndex],
            download: {
              status: 'completed'
            },
            installed: true,
            installPath: data.installPath,
            exePath: data.exePath,
            lastPlayed: newData[gameIndex].lastPlayed || 0,
            installedVersion: data.version
          }
        }
        return newData
      })
    }

    const launchEndHandler = (event, data) => {
      setGameData((prev) => {
        const newData = [...prev]
        const gameIndex = newData.findIndex((g) => g.id === data.id)
        if (gameIndex !== -1) {
          newData[gameIndex] = {
            ...newData[gameIndex],
            lastPlayed: Date.now()
          }
        }
        return newData
      })

      if (data.error) {
        if (!data.requireSteam) {
          handleErrors(data.error)
        }
      }
    }

    const handleStatusDownload = (event, data) => {
      if (data.status === 'canceled') {
        setGameData((prev) => {
          const newData = [...prev]
          const gameIndex = newData.findIndex((g) => g.id === data.id)
          if (gameIndex !== -1) {
            newData[gameIndex] = {
              ...newData[gameIndex],
              download: ''
            }
          }
          return newData
        })
      } else {
        setGameData((prev) => {
          const newData = [...prev]
          const gameIndex = newData.findIndex((g) => g.id === data.id)
          if (gameIndex !== -1) {
            newData[gameIndex] = {
              ...newData[gameIndex],
              download: {
                ...newData[gameIndex].download,
                status: data.status,
                message: data.message
              }
            }
          }
          return newData
        })
      }
    }

    const handleError = (event, data) => {
      handleErrors(data)
    }

    const handleMinecraftStatus = (event, data) => {
      setMinecraftStatus(data)
    }

    const ipc = window.electron.ipcRenderer
    ipc.on('download-progress', downloadProgressHandler)
    ipc.on('download-status', handleStatusDownload)
    ipc.on('download-error', downloadErrorHandler)
    ipc.on('installing-progress', installingProgressHandler)
    ipc.on('installation-complete', installationCompleteHandler)
    ipc.on('minecraft-status', handleMinecraftStatus)
    ipc.on('error', handleError)
    ipc.on('launch-end', launchEndHandler)

    return () => {
      ipc.removeListener('download-progress', downloadProgressHandler)
      ipc.removeListener('download-status', handleStatusDownload)
      ipc.removeListener('download-error', downloadErrorHandler)
      ipc.removeListener('installing-progress', installingProgressHandler)
      ipc.removeListener('minecraft-status', handleMinecraftStatus)
      ipc.removeListener('installation-complete', installationCompleteHandler)
      ipc.removeListener('error', handleError)
      ipc.removeListener('launch-end', launchEndHandler)
    }
  }, [throttledProgressUpdate, handleErrors])

  // Memoized function to load game data
  const loadPersistedGameData = useCallback(async () => {
    try {
      const baseGameData = (await window.electron.ipcRenderer.invoke('fetchGameData')) || []
      const persistedData = window.storage.get('gamesState') || {}

      const mergedGameData = baseGameData.map((game) => {
        if (persistedData[game.id]) {
          return {
            ...game,
            ...persistedData[game.id]
          }
        }
        return game
      })

      setGameData(mergedGameData)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading game data:', error)
      setError('No se pudieron cargar los juegos. Por favor, intenta más tarde.')
      setIsLoading(false)
    }
  }, [])

  // Memoized function to save game state
  const saveGamesState = useCallback((games) => {
    console.log(games)
    const gamesState = games.reduce((acc, game) => {
      acc[game.id] = {
        installed: game.installed,
        favorite: game.favorite,
        installPath: game.installPath,
        lastPlayed: game.lastPlayed,
        progress: game.progress,
        exePath: game.exePath,
        installedVersion: game.installedVersion
      }
      return acc
    }, {})
    window.storage.set('gamesState', gamesState)
  }, [])

  // Initial load
  useEffect(() => {
    loadPersistedGameData()
  }, [loadPersistedGameData])

  // Auto-save when gameData changes
  useEffect(() => {
    if (!isLoading && gameData.length > 0) {
      saveGamesState(gameData)
    }
  }, [gameData, isLoading, saveGamesState])

  // Memoized game data to prevent unnecessary re-renders
  const memoizedGameData = useMemo(() => gameData, [gameData])

  // Memoized refresh function
  const handleRefresh = useCallback(() => {
    setIsLoading(true)
    setError(null)
    loadPersistedGameData()
  }, [loadPersistedGameData])

  const downloads = gameData.filter((game) => game.download)

  const onSuccessLibraryAccess = useCallback(() => {
    setLibraryAccess(true)
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <SidebarNav
        gameData={memoizedGameData}
        isLoading={isLoading}
        handleRefresh={handleRefresh}
        error={error}
        downloads={downloads}
        isDownloadsSidebarOpen={isDownloadsSidebarOpen}
        setIsDownloadsSidebarOpen={setIsDownloadsSidebarOpen}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
      <main className="flex-1 overflow-auto">
        <ScrollArea className="h-full" setScrollPosition={setScrollPosition}>
          {currentSection === 'library' && libraryAccess ? (
            <GameLibrary
              gameData={memoizedGameData}
              setGameData={setGameData}
              isLoading={isLoading}
              error={error}
              handleRetry={handleRefresh}
              handleErrors={handleErrors}
              isDownloadsSidebarOpen={isDownloadsSidebarOpen}
              setIsDownloadsSidebarOpen={setIsDownloadsSidebarOpen}
            />
          ) : (
            currentSection === 'library' &&
            !libraryAccess && <PinAccess onSuccess={onSuccessLibraryAccess} />
          )}
          {currentSection === 'minecraft' && (
            <MinecraftLauncher minecraftStatus={minecraftStatus} scrollPosition={scrollPosition} />
          )}
        </ScrollArea>
      </main>
      <UpdateNotification />
      <AppErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        title={currentError.title}
        description={currentError.description}
        severity={currentError.severity}
        errorCode={currentError.errorCode}
        errorDetails={currentError.errorDetails}
      />
    </div>
  )
}

export default App
