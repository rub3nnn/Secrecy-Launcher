'use client'

import { useCallback, useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  Check,
  Cpu,
  FolderOpen,
  Loader2,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
  Trash2,
  Download
} from 'lucide-react'
import SkinViewerComponent from '@/components/minecraft-skin-viewer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const surface = 'rounded-xl border border-violet-100/14 bg-[#46345d]/72'
const subtleSurface = 'rounded-lg border border-violet-100/10 bg-[#382a4d]/72'

export function MinecraftLauncher({
  minecraftStatus,
  currentTab,
  setShowAccountModal,
  showAccountModal
}) {
  const storage = window.storage
  const DEFAULT_MINECRAFT_PATH = storage.getDefaultMinecraftPath()

  const [customMinecraftPath, setCustomMinecraftPath] = useState(
    () => storage.get('paths.minecraft') || DEFAULT_MINECRAFT_PATH
  )

  const [selectedVersion, setSelectedVersion] = useState(
    () => storage.get('minecraft.settings.selectedVersion') || { id: '1.21.1', type: 'release' }
  )
  const [memoryAllocation, setMemoryAllocation] = useState(
    () => storage.get('minecraft.settings.memoryAllocation') || [2048, 4096]
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [versions, setVersions] = useState([])
  const [isLoadingVersions, setIsLoadingVersions] = useState(true)
  const [versionsError, setVersionsError] = useState(null)
  const [versionTypeFilters, setVersionTypeFilters] = useState(['release', 'custom'])
  const [showOnlyInstalled, setShowOnlyInstalled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [directoryType, setDirectoryType] = useState(
    () => storage.get('minecraft.settings.directoryType') || 'default'
  )
  const activeMinecraftPath =
    directoryType === 'default' ? DEFAULT_MINECRAFT_PATH : customMinecraftPath
  const [customJavaPath, setCustomJavaPath] = useState(
    () => storage.get('minecraft.settings.customJavaPath') || 'Automático'
  )
  const [closeLauncher, setCloseLauncher] = useState(
    () => storage.get('minecraft.settings.closeLauncher') !== false
  )
  const [customJavaArgs, setCustomJavaArgs] = useState(
    () => storage.get('minecraft.settings.customJavaArgs') || ''
  )
  const [customMcArgs, setCustomMcArgs] = useState(
    () => storage.get('minecraft.settings.customMcArgs') || ''
  )
  const [accountUsername, setAccountUsername] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [userAccount, setUserAccount] = useState(() => storage.get('minecraft.userAccount') || null)

  useEffect(() => {
    if (minecraftStatus.progress !== undefined) setLoadingProgress(minecraftStatus.progress)
    if (minecraftStatus.stage === 'launching') setIsPlaying(true)
    if (minecraftStatus.stage === 'closed') {
      setIsPlaying(false)
      setLoadingProgress(0)
    }
  }, [minecraftStatus])

  const [installedJavas, setInstalledJavas] = useState([])
  const [isLoadingJavas, setIsLoadingJavas] = useState(false)
  const [showJavaModal, setShowJavaModal] = useState(false)
  const [activeDownloadVersion, setActiveDownloadVersion] = useState(null)
  const [activeSettingsTab, setActiveSettingsTab] = useState('performance')
  const [selectedProvider, setSelectedProvider] = useState('temurin')
  const [visibleCount, setVisibleCount] = useState(24)
  const [availableJavaVersions, setAvailableJavaVersions] = useState([])
  const [isLoadingAvailableJavas, setIsLoadingAvailableJavas] = useState(true)

  useEffect(() => {
    const fetchAvailableJavas = async () => {
      setIsLoadingAvailableJavas(true)
      try {
        const data = await window.electron.ipc.invoke('get-available-java-versions')
        const versionsList = (data?.lts || [8, 11, 17, 21, 25]).sort((a, b) => b - a)

        if (!versionsList.includes(16) && (data?.all || []).includes(16)) {
          versionsList.push(16)
          versionsList.sort((a, b) => b - a)
        }

        const mapped = versionsList.map((major) => {
          let mc = 'Minecraft compatible'
          if (major === 25) mc = 'Minecraft 1.21.2+ (snapshots 25w, etc.)'
          else if (major === 21) mc = 'Minecraft 1.20.5+ (1.21, etc.)'
          else if (major === 17) mc = 'Minecraft 1.18 a 1.20.4'
          else if (major === 16) mc = 'Minecraft 1.17'
          else if (major === 11) mc = 'Minecraft 1.12 a 1.16'
          else if (major === 8) mc = 'Minecraft 1.12 o inferior'
          else if (major > 25) mc = 'Minecraft versiones futuras'

          const vendors = ['temurin', 'zulu']
          if ([8, 11, 17, 21, 25].includes(major) || major > 21) {
            vendors.push('corretto')
          }
          if ([11, 17, 21, 25].includes(major) || major > 21) {
            vendors.push('microsoft')
          }

          return {
            major,
            label: `Java ${major}`,
            mc,
            vendors
          }
        })
        setAvailableJavaVersions(mapped)
      } catch (err) {
        console.error('Error fetching available Java versions:', err)
        setAvailableJavaVersions([
          {
            major: 25,
            label: 'Java 25',
            mc: 'Minecraft 1.21.2+ (snapshots 25w, etc.)',
            vendors: ['temurin', 'zulu', 'corretto', 'microsoft']
          },
          {
            major: 21,
            label: 'Java 21',
            mc: 'Minecraft 1.20.5+ (1.21, etc.)',
            vendors: ['temurin', 'zulu', 'corretto', 'microsoft']
          },
          {
            major: 17,
            label: 'Java 17',
            mc: 'Minecraft 1.18 a 1.20.4',
            vendors: ['temurin', 'zulu', 'corretto', 'microsoft']
          },
          { major: 16, label: 'Java 16', mc: 'Minecraft 1.17', vendors: ['temurin', 'zulu'] },
          {
            major: 11,
            label: 'Java 11',
            mc: 'Minecraft 1.12 a 1.16',
            vendors: ['temurin', 'zulu', 'corretto', 'microsoft']
          },
          {
            major: 8,
            label: 'Java 8',
            mc: 'Minecraft 1.12 o inferior',
            vendors: ['temurin', 'zulu', 'corretto']
          }
        ])
      } finally {
        setIsLoadingAvailableJavas(false)
      }
    }
    fetchAvailableJavas()
  }, [])

  const loadInstalledJavas = useCallback(async () => {
    setIsLoadingJavas(true)
    try {
      const runtimes = await window.electron.ipc.invoke('get-installed-java')
      setInstalledJavas(runtimes || [])
    } catch (err) {
      console.error('Error listing installed Javas:', err)
    } finally {
      setIsLoadingJavas(false)
    }
  }, [])

  useEffect(() => {
    loadInstalledJavas()
  }, [loadInstalledJavas])

  useEffect(() => {
    if (minecraftStatus.progress !== undefined) setLoadingProgress(minecraftStatus.progress)
    if (minecraftStatus.stage === 'launching') setIsPlaying(true)
    if (minecraftStatus.stage === 'closed') {
      setIsPlaying(false)
      setLoadingProgress(0)
    }
    if (minecraftStatus.stage === 'completed-java') {
      loadInstalledJavas()
      setActiveDownloadVersion(null)
    }
  }, [minecraftStatus, loadInstalledJavas])

  const handleDownloadJava = async (major, type, vendor = selectedProvider) => {
    setActiveDownloadVersion({ major, type, vendor })
    try {
      await window.electron.ipc.invoke('download-java-version', { major, type, vendor })
    } catch (err) {
      console.error(`Error downloading Java ${major}:`, err)
      setActiveDownloadVersion(null)
    }
  }

  const handleDeleteJava = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta versión de Java portable?')) return
    try {
      const success = await window.electron.ipc.invoke('delete-java-version', { id })
      if (success) {
        loadInstalledJavas()
        const runtime = installedJavas.find((r) => r.id === id)
        if (runtime && customJavaPath === runtime.path) {
          setCustomJavaPath('Automático')
          saveLauncherSettings({ customJavaPath: 'Automático' })
        }
      }
    } catch (err) {
      console.error(`Error deleting Java ${id}:`, err)
    }
  }

  const handleBrowseJava = async () => {
    try {
      const selectedPath = await window.electron.ipc.invoke('select-java-file')
      if (selectedPath) {
        setCustomJavaPath(selectedPath)
        saveLauncherSettings({ customJavaPath: selectedPath })
      }
    } catch (err) {
      console.error('Error selecting Java executable:', err)
    }
  }

  const handleBrowseDirectory = async () => {
    try {
      const selectedPath = await window.electron.ipc.invoke('select-minecraft-directory')
      if (selectedPath) {
        setCustomMinecraftPath(selectedPath)
        storage.set('paths.minecraft', selectedPath)
        fetchVersions()
      }
    } catch (err) {
      console.error('Error selecting Minecraft directory:', err)
    }
  }

  const saveLauncherSettings = useCallback(
    (updatedSettings) => {
      const currentSettings = storage.get('minecraft.settings') || {}
      storage.set('minecraft.settings', { ...currentSettings, ...updatedSettings })
    },
    [storage]
  )

  const fetchVersions = useCallback(async () => {
    setIsLoadingVersions(true)
    setVersionsError(null)
    try {
      if (!storage.get('paths.minecraft')) storage.set('paths.minecraft', DEFAULT_MINECRAFT_PATH)
      const data = await window.electron.ipc.invoke('fetchMinecraftVersions')
      const newVersions = data?.versions || []
      setVersions(newVersions)

      if (newVersions.length > 0) {
        const currentSelected = storage.get('minecraft.settings.selectedVersion')
        if (currentSelected) {
          const exists = newVersions.some((v) => v.id === currentSelected.id)
          if (!exists) {
            setSelectedVersion(null)
            storage.delete('minecraft.settings.selectedVersion')
          }
        }
      }
    } catch (err) {
      console.error(err)
      setVersionsError('No se pudieron cargar las versiones de Minecraft')
    } finally {
      setIsLoadingVersions(false)
    }
  }, [storage, DEFAULT_MINECRAFT_PATH])
  useEffect(() => {
    fetchVersions()
  }, [fetchVersions])

  const handleLaunchGame = () => {
    if (isPlaying) return
    if (!userAccount) {
      setShowAccountModal(true)
      return
    }
    setIsPlaying(true)
    storage.set('minecraft.userAccount', userAccount)
    storage.set('minecraft.settings.selectedVersion', selectedVersion)
    storage.set('minecraft.settings.memoryAllocation', memoryAllocation)
    storage.set('minecraft.settings.directoryType', directoryType)
    storage.set('minecraft.settings.customJavaPath', customJavaPath)
    storage.set('minecraft.settings.closeLauncher', closeLauncher)
    storage.set('minecraft.settings.customJavaArgs', customJavaArgs)
    storage.set('minecraft.settings.customMcArgs', customMcArgs)
    window.electron.ipc.send('launch-minecraft')
  }

  const handleMicrosoftLogin = async () => {
    setIsLoggingIn(true)
    try {
      const username = await window.electron.ipc.invoke('minecraftLogin')
      const profile = storage.get('minecraft.profile')
      const acc = { type: 'premium', username, skinUrl: profile?.skins?.[0]?.url || null }
      setUserAccount(acc)
      storage.set('minecraft.userAccount', acc)
      setShowAccountModal(false)
    } catch (err) {
      console.error('Premium Login Error:', err)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleOfflineLogin = () => {
    if (!accountUsername.trim()) return
    const acc = { type: 'offline', username: accountUsername.trim(), skinUrl: null }
    setUserAccount(acc)
    storage.set('minecraft.userAccount', acc)
    storage.delete('minecraft.auth')
    storage.delete('minecraft.profile')
    setShowAccountModal(false)
    setAccountUsername('')
  }

  const filteredVersions = versions.filter((v) => {
    if (versionTypeFilters.length > 0 && !versionTypeFilters.includes(v.type)) return false
    if (versionTypeFilters.length === 0) return false
    if (showOnlyInstalled && !v.isInstalled) return false
    if (searchQuery && !v.id.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const filterClass = (active) =>
    `h-8 rounded-md px-3 text-xs font-semibold transition-colors ${
      active
        ? 'bg-violet-100 text-[#251637]'
        : 'text-violet-100/62 hover:bg-violet-100/10 hover:text-white'
    }`

  return (
    <div className="relative h-auto text-violet-50 flex flex-col pb-24">
      {currentTab === 'versions' && (
        <div className="mx-auto w-full max-w-6xl space-y-6">
          {/* Bento Header: Perfil & Resumen */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {/* Perfil del Jugador */}
            <div className={`${surface} p-4 flex items-center justify-between gap-4 md:col-span-1`}>
              <div className="flex items-center gap-3 min-w-0">
                {userAccount?.type === 'premium' ? (
                  <div className="h-20 w-14 shrink-0 rounded-lg border border-violet-100/10 bg-[#362848] flex items-center justify-center overflow-hidden">
                    <SkinViewerComponent
                      skinUrl={
                        userAccount?.skinUrl || 'https://mineskin.org/assets/skins/steve.png'
                      }
                      width={50}
                      height={70}
                      animation="rotating"
                    />
                  </div>
                ) : (
                  <div className="h-14 w-14 shrink-0 rounded-xl border border-violet-100/10 bg-violet-100/5 flex items-center justify-center text-violet-300">
                    <User className="h-7 w-7" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-violet-100/40">
                    Jugador
                  </p>
                  <p className="truncate text-base font-semibold text-white">
                    {userAccount ? userAccount.username : 'Sin cuenta'}
                  </p>
                  <p className="text-xs text-violet-100/50 capitalize mt-0.5">
                    {userAccount ? `${userAccount.type} Mode` : 'Inicia sesión'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAccountModal(true)}
                className="rounded-lg border border-violet-100/12 bg-violet-100/8 px-3 py-1.5 text-xs font-semibold text-violet-50 transition hover:bg-violet-100/14 whitespace-nowrap"
              >
                Cambiar
              </button>
            </div>

            {/* Resumen Activo */}
            <div className={`${surface} p-4 md:col-span-2 flex flex-col justify-between`}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-violet-100/40">
                  Configuración Activa
                </p>
                <div className="grid grid-cols-3 gap-3 text-xs mt-2">
                  <div className="rounded-lg border border-violet-100/10 bg-[#382a4d]/40 p-2.5 min-w-0">
                    <p className="font-semibold text-violet-100/50">Java</p>
                    <p className="truncate font-medium text-white mt-0.5" title={customJavaPath}>
                      {customJavaPath.split('\\').pop() || customJavaPath}
                    </p>
                  </div>
                  <div className="rounded-lg border border-violet-100/10 bg-[#382a4d]/40 p-2.5 min-w-0">
                    <p className="font-semibold text-violet-100/50">Memoria RAM</p>
                    <p className="font-medium text-white mt-0.5">{memoryAllocation[1]} MB</p>
                  </div>
                  <div className="rounded-lg border border-violet-100/10 bg-[#382a4d]/40 p-2.5 min-w-0">
                    <p className="font-semibold text-violet-100/50">Directorio</p>
                    <p
                      className="truncate font-mono text-[10px] text-violet-50/70 mt-0.5"
                      title={activeMinecraftPath}
                    >
                      {activeMinecraftPath.split('\\').pop() || activeMinecraftPath}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explorador de Versiones */}
          <div className={`${surface} p-5 space-y-5`}>
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-white">Explorador de Versiones</h2>
                  <button
                    onClick={fetchVersions}
                    disabled={isLoadingVersions}
                    title="Recargar versiones"
                    className="p-1 rounded-md text-violet-100/50 hover:text-white hover:bg-violet-100/10 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoadingVersions ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <p className="text-xs text-violet-100/50">
                  {filteredVersions.length} versiones disponibles
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-60">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-100/40" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setVisibleCount(24)
                    }}
                    placeholder="Buscar versión..."
                    className="h-9 rounded-lg border-violet-100/12 bg-[#332545] pl-9 text-sm text-violet-50 placeholder:text-violet-100/30"
                  />
                </div>

                {/* Filter pills */}
                <div className="flex items-center gap-1.5 rounded-lg bg-[#332545] p-1 shrink-0 overflow-x-auto">
                  {[
                    { id: 'release', label: 'Releases', dotColor: 'bg-amber-400' },
                    { id: 'snapshot', label: 'Snapshots', dotColor: 'bg-sky-400' },
                    { id: 'custom', label: 'Custom', dotColor: 'bg-emerald-400' }
                  ].map((filter) => {
                    const isActive = versionTypeFilters.includes(filter.id)
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => {
                          setVersionTypeFilters((prev) =>
                            prev.includes(filter.id)
                              ? prev.filter((t) => t !== filter.id)
                              : [...prev, filter.id]
                          )
                          setVisibleCount(24)
                        }}
                        className={`flex items-center gap-1.5 h-8 rounded-md px-3 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-violet-100 text-[#251637] shadow-sm'
                            : 'text-violet-100/62 hover:bg-violet-100/10 hover:text-white'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${filter.dotColor} ${isActive ? 'scale-110 opacity-100' : 'opacity-60'}`}
                        />
                        {filter.label}
                      </button>
                    )
                  })}
                </div>

                {/* Only Installed Toggle */}
                <label className="flex items-center gap-2 rounded-lg border border-violet-100/8 bg-[#332545] px-3 py-1.5 text-xs text-violet-100/70 shrink-0 cursor-pointer hover:bg-violet-100/5 transition-colors">
                  Solo locales
                  <Switch
                    checked={showOnlyInstalled}
                    onCheckedChange={(checked) => {
                      setShowOnlyInstalled(checked)
                      setVisibleCount(24)
                    }}
                  />
                </label>
              </div>
            </div>

            {versionsError && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-200">
                {versionsError}
              </div>
            )}

            {isLoadingVersions ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-xl bg-violet-100/5 border border-violet-100/8"
                  />
                ))}
              </div>
            ) : filteredVersions.length === 0 ? (
              <p className="text-sm text-violet-100/40 italic text-center py-12">
                No se encontraron versiones con los filtros aplicados.
              </p>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredVersions.slice(0, visibleCount).map((v) => {
                    const isSelected = selectedVersion?.id === v.id

                    let badgeColor = 'bg-violet-500/10 text-violet-300 border-violet-500/20'
                    let typeLabel = v.type
                    if (v.type === 'release') {
                      typeLabel = 'Official Release'
                      badgeColor = 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    } else if (v.type === 'snapshot') {
                      typeLabel = 'Development Snapshot'
                      badgeColor = 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                    } else if (v.type === 'custom') {
                      typeLabel = `Custom (${v.inheritsFrom || 'Base'})`
                      badgeColor = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    }

                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVersion(v)}
                        className={`group rounded-xl border p-4 transition-all duration-200 cursor-pointer relative flex flex-col justify-between min-h-[110px] ${
                          isSelected
                            ? 'border-violet-300 bg-[#4e366e]/70 shadow-lg shadow-violet-950/20 scale-[1.01]'
                            : 'border-violet-100/8 bg-[#382a4d]/40 hover:bg-[#46345d]/40 hover:border-violet-100/20 hover:scale-[1.005]'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-violet-100 flex items-center justify-center shadow-md">
                            <Check className="h-3.5 w-3.5 text-[#251637] stroke-[3]" />
                          </div>
                        )}

                        <div className="space-y-1">
                          <span
                            className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide capitalize ${badgeColor}`}
                          >
                            {v.type}
                          </span>
                          <h3 className="text-base font-bold text-white tracking-wide truncate group-hover:text-violet-100">
                            {v.id}
                          </h3>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-violet-100/40 border-t border-violet-100/5 pt-2">
                          <span className="truncate">{typeLabel}</span>
                          {v.isInstalled && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              Local
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {filteredVersions.length > visibleCount && (
                  <div className="flex justify-center pt-2">
                    <Button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 24)}
                      className="h-9 rounded-lg border border-violet-100/12 bg-violet-100/8 px-6 text-sm font-semibold text-violet-50 hover:bg-violet-100/14 active:scale-[0.98] transition-all"
                    >
                      Cargar más versiones
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {currentTab === 'settings' && (
        <div className="mx-auto h-auto w-full max-w-6xl">
          <section className={`${surface} p-5`}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-[-0.035em] text-white">Ajustes</h1>
                <p className="mt-1 text-sm text-violet-100/58">
                  Opciones de rendimiento, rutas y Java runtime.
                </p>
              </div>
            </div>

            <div className="mb-5 flex border-b border-violet-100/10 gap-6">
              {[
                { id: 'performance', name: 'Rendimiento' },
                { id: 'paths', name: 'Directorio' },
                { id: 'java', name: 'Java (JRE/JDK)' }
              ].map((tab) => {
                const active = activeSettingsTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSettingsTab(tab.id)}
                    className={`pb-2.5 text-sm font-semibold transition-colors relative ${
                      active ? 'text-white' : 'text-violet-100/40 hover:text-violet-100/70'
                    }`}
                  >
                    {tab.name}
                    {active && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-violet-400" />}
                  </button>
                )
              })}
            </div>

            {activeSettingsTab === 'performance' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className={`${subtleSurface} p-4 md:col-span-2`}>
                  <div className="mb-4 flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Cpu className="h-4 w-4" /> Memoria RAM
                    </Label>
                    <span className="rounded-md bg-violet-100 px-2.5 py-1 text-xs font-semibold text-[#251637]">
                      {memoryAllocation[1]} MB
                    </span>
                  </div>
                  <Slider
                    min={1024}
                    max={12288}
                    step={512}
                    value={[memoryAllocation[1]]}
                    onValueChange={(val) => {
                      setMemoryAllocation([1024, val[0]])
                      saveLauncherSettings({ memoryAllocation: [1024, val[0]] })
                    }}
                  />
                </div>

                <div className={`${subtleSurface} p-4 md:col-span-2`}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">Cerrar al iniciar</p>
                      <p className="mt-1 text-xs text-violet-100/52">
                        Oculta el launcher cuando abre Minecraft.
                      </p>
                    </div>
                    <Switch
                      checked={closeLauncher}
                      onCheckedChange={(value) => {
                        setCloseLauncher(value)
                        saveLauncherSettings({ closeLauncher: value })
                      }}
                    />
                  </div>
                </div>

                <div className={`${subtleSurface} space-y-2 p-4`}>
                  <Label className="text-sm font-semibold text-white">Argumentos JVM</Label>
                  <Input
                    value={customJavaArgs}
                    onChange={(e) => {
                      setCustomJavaArgs(e.target.value)
                      saveLauncherSettings({ customJavaArgs: e.target.value })
                    }}
                    placeholder="-XX:+UseG1GC"
                    className="h-10 rounded-lg border-violet-100/12 bg-[#2f233f] text-violet-50 placeholder:text-violet-100/34"
                  />
                </div>

                <div className={`${subtleSurface} space-y-2 p-4`}>
                  <Label className="text-sm font-semibold text-white">Argumentos Minecraft</Label>
                  <Input
                    value={customMcArgs}
                    onChange={(e) => {
                      setCustomMcArgs(e.target.value)
                      saveLauncherSettings({ customMcArgs: e.target.value })
                    }}
                    placeholder="Opcional"
                    className="h-10 rounded-lg border-violet-100/12 bg-[#2f233f] text-violet-50 placeholder:text-violet-100/34"
                  />
                </div>
              </div>
            )}

            {activeSettingsTab === 'paths' && (
              <div className="grid gap-4">
                <div className={`${subtleSurface} p-4`}>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <FolderOpen className="h-4 w-4" /> Directorio
                  </div>
                  <div className="mb-3 flex gap-2">
                    <button
                      onClick={() => {
                        setDirectoryType('default')
                        saveLauncherSettings({ directoryType: 'default' })
                        setTimeout(() => fetchVersions(), 0)
                      }}
                      className={filterClass(directoryType === 'default')}
                    >
                      Default
                    </button>
                    <button
                      onClick={() => {
                        setDirectoryType('custom')
                        saveLauncherSettings({ directoryType: 'custom' })
                        setTimeout(() => fetchVersions(), 0)
                      }}
                      className={filterClass(directoryType === 'custom')}
                    >
                      Custom
                    </button>
                  </div>
                  <p
                    className="truncate rounded-lg bg-[#2f233f] p-3 font-mono text-xs text-violet-50/64 mb-3"
                    title={activeMinecraftPath}
                  >
                    {activeMinecraftPath}
                  </p>
                  {directoryType === 'custom' && (
                    <button
                      onClick={handleBrowseDirectory}
                      className="flex h-9 items-center justify-center gap-2 rounded-lg border border-violet-100/18 bg-violet-50/8 px-4 text-xs font-semibold text-violet-50 transition-all duration-200 hover:bg-violet-50/14 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-100/70"
                    >
                      <FolderOpen className="h-4 w-4" />
                      Buscar Carpeta...
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeSettingsTab === 'java' && (
              <div className="grid gap-4">
                <div className={`${subtleSurface} space-y-2 p-4`}>
                  <Label className="text-sm font-semibold text-white">Ejecutable de Java</Label>
                  <Select
                    value={
                      customJavaPath === 'Automático'
                        ? 'Automático'
                        : installedJavas.some((j) => j.path === customJavaPath)
                          ? customJavaPath
                          : 'custom'
                    }
                    onValueChange={async (value) => {
                      if (value === 'browse') {
                        await handleBrowseJava()
                      } else if (value === 'custom') {
                        await handleBrowseJava()
                      } else {
                        setCustomJavaPath(value)
                        saveLauncherSettings({ customJavaPath: value })
                      }
                    }}
                  >
                    <SelectTrigger className="h-10 rounded-lg border-violet-100/12 bg-[#2f233f] text-violet-50 focus:ring-violet-400">
                      <SelectValue placeholder="Seleccionar Java" />
                    </SelectTrigger>
                    <SelectContent className="border-violet-100/16 bg-[#2d1e3e] text-violet-50">
                      <SelectItem
                        value="Automático"
                        className="focus:bg-[#3f2b57] focus:text-white"
                      >
                        Automático (Recomendado)
                      </SelectItem>
                      {installedJavas.map((j) => (
                        <SelectItem
                          key={j.id}
                          value={j.path}
                          className="focus:bg-[#3f2b57] focus:text-white"
                        >
                          {j.vendor.toUpperCase()} {j.type.toUpperCase()} {j.major} (Portable)
                        </SelectItem>
                      ))}
                      {customJavaPath !== 'Automático' &&
                        !installedJavas.some((j) => j.path === customJavaPath) && (
                          <SelectItem
                            value="custom"
                            className="focus:bg-[#3f2b57] focus:text-white"
                          >
                            Personalizado ({customJavaPath.split('\\').pop() || customJavaPath})
                          </SelectItem>
                        )}
                      <SelectItem
                        value="browse"
                        className="text-violet-300 focus:bg-[#3f2b57] focus:text-white font-semibold"
                      >
                        Buscar en el equipo...
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className={`${subtleSurface} p-4 space-y-3`}>
                  <h3 className="text-sm font-semibold text-white">
                    Versiones Portables Instaladas
                  </h3>
                  {isLoadingJavas ? (
                    <div className="flex items-center gap-2 text-sm text-violet-100/58 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Cargando versiones...
                    </div>
                  ) : installedJavas.length === 0 ? (
                    <p className="text-xs text-violet-100/40 italic py-1">
                      No hay versiones portables instaladas en el launcher.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {installedJavas.map((j) => (
                        <div
                          key={j.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-violet-100/10 bg-[#2d1e3e]/40 p-2.5"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">
                              {j.vendor.toUpperCase()} {j.type.toUpperCase()} {j.major}
                            </p>
                            <p className="truncate text-[10px] text-violet-100/40 font-mono">
                              {j.path}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteJava(j.id)}
                            className="rounded-lg p-2 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors shrink-0"
                            title="Eliminar esta versión"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`${subtleSurface} p-4 space-y-4`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Descargar Entornos de Java
                      </h3>
                      <p className="text-xs text-violet-100/52">
                        Descarga ejecutables portables oficiales desde los repositorios
                        correspondientes.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-violet-100/60 font-medium">Proveedor:</span>
                      <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                        <SelectTrigger className="h-8 w-44 rounded-md border-violet-100/12 bg-[#2d1e3e] text-xs text-violet-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-violet-100/16 bg-[#2d1e3e] text-violet-50">
                          <SelectItem
                            value="temurin"
                            className="focus:bg-[#3f2b57] focus:text-white"
                          >
                            Adoptium Temurin
                          </SelectItem>
                          <SelectItem value="zulu" className="focus:bg-[#3f2b57] focus:text-white">
                            Azul Zulu
                          </SelectItem>
                          <SelectItem
                            value="corretto"
                            className="focus:bg-[#3f2b57] focus:text-white"
                          >
                            Amazon Corretto
                          </SelectItem>
                          <SelectItem
                            value="microsoft"
                            className="focus:bg-[#3f2b57] focus:text-white"
                          >
                            Microsoft OpenJDK
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-violet-100/8 pt-3">
                    {isLoadingAvailableJavas ? (
                      <div className="flex items-center gap-2 text-sm text-violet-100/58 py-4">
                        <Loader2 className="h-4 w-4 animate-spin" /> Obteniendo versiones de Java
                        disponibles...
                      </div>
                    ) : (
                      availableJavaVersions
                        .filter((v) => v.vendors.includes(selectedProvider))
                        .map(({ major, label, mc }) => {
                          const hasJre = installedJavas.some(
                            (j) =>
                              j.major === major && j.type === 'jre' && j.vendor === selectedProvider
                          )
                          const hasJdk = installedJavas.some(
                            (j) =>
                              j.major === major && j.type === 'jdk' && j.vendor === selectedProvider
                          )
                          const isDownloadingThisMajor =
                            activeDownloadVersion?.major === major &&
                            activeDownloadVersion?.vendor === selectedProvider
                          const isDownloadingThisJre =
                            isDownloadingThisMajor && activeDownloadVersion?.type === 'jre'
                          const isDownloadingThisJdk =
                            isDownloadingThisMajor && activeDownloadVersion?.type === 'jdk'
                          const isAnyDownloading = !!activeDownloadVersion
                          const jreSupported =
                            selectedProvider === 'temurin' || selectedProvider === 'zulu'

                          return (
                            <div
                              key={major}
                              className="flex items-center justify-between gap-4 rounded-lg border border-violet-100/6 bg-[#2d1e3e]/20 p-3"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-white">{label}</p>
                                <p className="text-[11px] text-violet-100/50">{mc}</p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {/* JRE button */}
                                {jreSupported && (
                                  <>
                                    {hasJre ? (
                                      <span className="rounded bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/14">
                                        JRE local
                                      </span>
                                    ) : isDownloadingThisJre ? (
                                      <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] text-violet-300 animate-pulse flex items-center gap-1">
                                          <Loader2 className="h-3 w-3 animate-spin" /> Descargando
                                          JRE...
                                        </span>
                                        <span className="text-[10px] font-bold text-violet-200">
                                          {loadingProgress}%
                                        </span>
                                      </div>
                                    ) : (
                                      <Button
                                        type="button"
                                        onClick={() => handleDownloadJava(major, 'jre')}
                                        disabled={isAnyDownloading}
                                        className="h-7 rounded-md bg-violet-100/8 border border-violet-100/14 px-2.5 text-xs font-semibold text-violet-50 hover:bg-violet-100 hover:text-[#251637] disabled:opacity-50 transition-colors"
                                      >
                                        <Download className="h-3.5 w-3.5 mr-1" /> JRE
                                      </Button>
                                    )}
                                  </>
                                )}

                                {/* JDK button */}
                                {hasJdk ? (
                                  <span className="rounded bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/14">
                                    JDK local
                                  </span>
                                ) : isDownloadingThisJdk ? (
                                  <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] text-violet-300 animate-pulse flex items-center gap-1">
                                      <Loader2 className="h-3 w-3 animate-spin" /> Descargando
                                      JDK...
                                    </span>
                                    <span className="text-[10px] font-bold text-violet-200">
                                      {loadingProgress}%
                                    </span>
                                  </div>
                                ) : (
                                  <Button
                                    type="button"
                                    onClick={() => handleDownloadJava(major, 'jdk')}
                                    disabled={isAnyDownloading}
                                    className="h-7 rounded-md bg-violet-100/8 border border-violet-100/14 px-2.5 text-xs font-semibold text-violet-50 hover:bg-violet-100 hover:text-[#251637] disabled:opacity-50 transition-colors"
                                  >
                                    <Download className="h-3.5 w-3.5 mr-1" /> JDK
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        })
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      <div className="fixed inset-x-4 bottom-4 z-40">
        <div className="mx-auto relative overflow-hidden flex h-14 max-w-6xl items-center justify-between gap-4 rounded-xl border border-violet-100/16 bg-[#493660]/94 px-3 shadow-[0_10px_34px_rgba(18,10,30,0.26)] backdrop-blur-xl">
          {isPlaying && (
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500/15 to-violet-400/25 transition-all duration-300 ease-out pointer-events-none"
              style={{ width: `${loadingProgress}%` }}
            />
          )}

          <div className="relative z-10 flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100/10 text-violet-100">
              <Play className="h-4 w-4 fill-current" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-white">
                  {selectedVersion?.id || 'Sin versión seleccionada'}
                </p>
                <span className="hidden rounded-md bg-violet-100/10 px-2 py-0.5 text-[11px] capitalize text-violet-100/68 sm:inline-flex">
                  {selectedVersion?.type || 'release'}
                </span>
              </div>
              <p className="truncate text-xs text-violet-100/52">
                {isPlaying
                  ? `${minecraftStatus.message || 'Preparando recursos'} (${loadingProgress}%)`
                  : userAccount
                    ? `${userAccount.username} · ${memoryAllocation[1]} MB RAM`
                    : 'Inicia sesión para jugar'}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex shrink-0 items-center gap-2">
            {!userAccount && (
              <Button
                onClick={() => setShowAccountModal(true)}
                className="h-9 rounded-lg border border-violet-100/14 bg-violet-100/8 px-3 text-sm font-semibold text-white hover:bg-violet-100/12"
              >
                <User className="h-4 w-4" />
                Cuenta
              </Button>
            )}
            <Button
              onClick={handleLaunchGame}
              disabled={isPlaying || !selectedVersion}
              className="h-9 rounded-lg bg-violet-100 px-5 text-sm font-semibold text-[#251637] hover:bg-white active:scale-[0.98] disabled:opacity-50"
            >
              {isPlaying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4 fill-[#251637]" />
              )}
              {isPlaying ? 'Iniciando' : 'Jugar'}
            </Button>
          </div>
        </div>
      </div>

      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d1428]/76 p-4 backdrop-blur-lg">
          <Card className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-violet-100/16 bg-[#46345d]/95 shadow-[0_24px_64px_rgba(18,10,30,0.42)] backdrop-blur-xl">
            <button
              onClick={() => setShowAccountModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-violet-100/56 transition-all hover:bg-violet-100/10 hover:text-white active:scale-95"
            >
              <Plus className="h-5 w-5 rotate-45" />
            </button>

            <CardContent className="space-y-6 p-6 mt-2">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-white">Iniciar Sesión</h2>
                <p className="mt-1.5 text-xs text-violet-100/58">
                  Elige tu método preferido para jugar a Minecraft
                </p>
              </div>

              {/* Side-by-side layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-2">
                {/* Column 1: Microsoft Premium */}
                <div className="flex flex-col justify-between h-full space-y-6 md:pr-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-300">
                        <ShieldCheck className="h-4.5 w-4.5" />
                      </div>
                      <h3 className="text-base font-semibold text-white">Cuenta Microsoft</h3>
                    </div>

                    <div className="rounded-xl border border-violet-100/8 bg-[#3d2c53]/40 p-4 text-xs text-violet-100/70 space-y-2.5 leading-relaxed min-h-[120px]">
                      <p className="font-semibold text-violet-100 flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Ventajas Premium:
                      </p>
                      <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-violet-200/60">
                        <li>Acceso a servidores oficiales</li>
                        <li>Tu propia skin oficial visible</li>
                        <li>Sincronización segura de Microsoft</li>
                      </ul>
                    </div>
                  </div>

                  <Button
                    onClick={handleMicrosoftLogin}
                    disabled={isLoggingIn}
                    className="h-11 w-full rounded-xl bg-violet-100 font-bold text-[#251637] hover:bg-white active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10"
                  >
                    {isLoggingIn ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <ShieldCheck className="h-5 w-5" />
                    )}
                    {isLoggingIn ? 'Conectando...' : 'Iniciar con Microsoft'}
                  </Button>
                </div>

                {/* Column 2: Local Username */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleOfflineLogin()
                  }}
                  className="flex flex-col justify-between h-full space-y-6 pt-6 md:pt-0 md:pl-8"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
                        <User className="h-4.5 w-4.5" />
                      </div>
                      <h3 className="text-base font-semibold text-white">
                        Nombre Local (No Premium)
                      </h3>
                    </div>

                    <div className="rounded-xl border border-violet-100/8 bg-[#3d2c53]/40 p-4 text-[11px] text-violet-200/60 leading-relaxed min-h-[120px]">
                      <p className="font-semibold text-violet-100 flex items-center gap-1.5 mb-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                        Acceso Rápido / Offline:
                      </p>
                      Juega de forma instantánea sin contraseña. Podrás ingresar a servidores
                      semi-premium configurando el nombre de usuario de tu elección.
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="local-username"
                        className="text-xs font-semibold text-violet-100/70"
                      >
                        Nombre de usuario
                      </Label>
                      <Input
                        id="local-username"
                        value={accountUsername}
                        onChange={(e) => setAccountUsername(e.target.value)}
                        placeholder="Ej: Steve_Pro"
                        required
                        className="h-11 rounded-xl border border-violet-100/12 bg-[#2f233f] text-sm text-violet-50 placeholder:text-violet-100/24 focus-visible:ring-violet-400 focus-visible:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={!accountUsername.trim()}
                    className="h-11 w-full rounded-xl bg-[#3c255a] border border-violet-100/14 font-bold text-white hover:bg-[#482d6b] hover:border-violet-100/24 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    Usar Nombre Local
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
