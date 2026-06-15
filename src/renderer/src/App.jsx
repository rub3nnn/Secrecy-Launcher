import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MinecraftLauncher } from '@/components/minecraft-launcher'
import { AppErrorDialog } from '@/components/app-error-dialog'
import { UpdateNotification } from '@/components/update'
import { SecrecyLogo } from '@/components/logo'
import { SplashScreen } from '@/components/splash-screen'
import { SplitMigration } from '@/components/split-migration'
import { Gamepad, Settings, User } from 'lucide-react'

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !window.storage.get('launcher.firstLaunchSeen')
    } catch {
      return false
    }
  })
  const [showMigration, setShowMigration] = useState(false)
  const [currentTab, setCurrentTab] = useState('versions')

  useEffect(() => {
    const checkMigration = async () => {
      try {
        const res = await window.electron.ipc.invoke('check-legacy-migration', {})
        if (res && res.needsMigration) {
          setShowMigration(true)
        }
      } catch (e) {
        console.error('Error checking legacy migration:', e)
      }
    }
    checkMigration()
  }, [])

  const handleSkipMigration = useCallback(() => {
    try {
      window.storage.set('migration.splitInstallerSkipped', true)
    } catch (e) {
      console.error('Failed to set splitInstallerSkipped:', e)
    }
    setShowMigration(false)
  }, [])

  const handleSplashComplete = useCallback(() => {
    try {
      window.storage.set('launcher.firstLaunchSeen', true)
    } catch (e) {
      console.error('Failed to set firstLaunchSeen:', e)
    }
    setShowSplash(false)
  }, [])
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [minecraftStatus, setMinecraftStatus] = useState({})
  const [showErrorDialog, setShowErrorDialog] = useState(false)

  const [userAccount, setUserAccount] = useState(() => {
    try {
      return window.storage.get('minecraft.userAccount') || null
    } catch {
      return null
    }
  })

  const [currentError, setCurrentError] = useState({
    title: '',
    description: '',
    severity: '',
    errorCode: '',
    errorDetails: ''
  })

  const handleErrors = useCallback((error) => {
    console.error('[App] Error received:', error)
    setCurrentError({
      title: error.title || error.message || 'Ha ocurrido un error',
      description: error.description || error.error || 'No se pudo procesar la solicitud.',
      severity: error.severity || 'error',
      errorCode: error.errorCode || '',
      errorDetails: error.errorDetails || ''
    })
    setShowErrorDialog(true)
  }, [])

  // Sync user profile state from store
  const syncUserAccount = useCallback(() => {
    try {
      const acc = window.storage.get('minecraft.userAccount')
      setUserAccount(acc || null)
    } catch (e) {
      console.error('Failed to sync user account:', e)
    }
  }, [])

  useEffect(() => {
    const handleMinecraftStatus = (data) => {
      setMinecraftStatus(data || {})
      // In case account details were updated during launch setup
      syncUserAccount()
    }

    const handleError = (data) => {
      handleErrors(data || {})
      setMinecraftStatus({ stage: 'closed' })
    }

    const ipc = window.electron.ipc
    ipc.on('minecraft-status', handleMinecraftStatus)
    ipc.on('minecraft-error', handleError)
    ipc.on('error', handleError)

    // Poll storage for account changes (fallback for modal updates)
    const interval = setInterval(syncUserAccount, 1000)

    return () => {
      ipc.removeListener('minecraft-status', handleMinecraftStatus)
      ipc.removeListener('minecraft-error', handleError)
      ipc.removeListener('error', handleError)
      clearInterval(interval)
    }
  }, [handleErrors, syncUserAccount])


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentTab])

  const topNavClass = (active) =>
    `flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200/70 ${
      active
        ? 'bg-violet-100 text-[#251637]'
        : 'text-violet-100/70 hover:bg-violet-100/10 hover:text-white'
    }`

  return (
    <div className="relative flex min-h-screen flex-col bg-[#322544] text-[#ece2f9] select-none antialiased pb-24" style={{ scrollbarGutter: 'stable' }}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(196,181,253,0.18),transparent_30%),linear-gradient(180deg,#3b2d50_0%,#2f243f_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:40px_40px]" />

      {/* Overlays de degradado para destacar topbar y navbar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-15 h-24 bg-gradient-to-b from-[#1f1330] to-transparent" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-25 h-24 bg-gradient-to-t from-[#1f1330] to-transparent" />

      <header className="sticky top-4 z-20 mx-auto mt-4 flex h-14 w-full max-w-6xl items-center justify-between rounded-xl border border-violet-100/14 bg-[#46345d]/86 px-3 shadow-[0_8px_28px_rgba(24,13,42,0.16)] backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-4">
          <SecrecyLogo compact />
          <nav className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentTab('versions')
              }}
              className={topNavClass(currentTab === 'versions')}
            >
              <Gamepad className="h-[18px] w-[18px]" />
              Jugar
            </button>


            <button
              onClick={() => {
                setCurrentTab('settings')
              }}
              className={topNavClass(currentTab === 'settings')}
            >
              <Settings className="h-[18px] w-[18px]" />
              Ajustes
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {userAccount ? (
            <div className="flex items-center gap-2 rounded-lg border border-violet-100/14 bg-violet-50/8 p-1">
              <div
                className="group flex min-w-0 cursor-pointer items-center gap-3 px-2"
                onClick={() => setShowAccountModal(true)}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    userAccount.type === 'premium'
                      ? 'bg-violet-200/18 text-violet-100 border border-violet-100/24'
                      : 'bg-amber-300/16 text-amber-100 border border-amber-200/22'
                  }`}
                >
                  <User className="h-[18px] w-[18px]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="max-w-36 truncate text-sm font-semibold text-white transition-colors group-hover:text-violet-100">
                    {userAccount.username}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAccountModal(true)}
              className="flex h-9 items-center justify-center gap-2 rounded-lg border border-violet-100/18 bg-violet-50/8 px-3 text-sm font-semibold text-violet-50 transition-all duration-200 hover:bg-violet-50/14 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-100/70"
            >
              <User className="h-4 w-4" />
              Iniciar sesión
            </button>
          )}
        </div>
      </header>

      <main className="relative flex-grow overflow-visible px-4 py-2">
        <MinecraftLauncher
          minecraftStatus={minecraftStatus}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          showAccountModal={showAccountModal}
          setShowAccountModal={setShowAccountModal}
        />
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

      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!showSplash && showMigration && (
          <SplitMigration onSkip={handleSkipMigration} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
