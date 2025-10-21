import { Download, LibraryBig, Gamepad, RefreshCcw, Github, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { SecrecyLogo } from '@/components/logo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DownloadsSidebar } from '@/components/downloads-sidebar'
import { useEffect, useState } from 'react'

export function SidebarNav({
  gameData,
  isLoading,
  handleRefresh,
  error,
  downloads = [],
  isDownloadsSidebarOpen,
  setIsDownloadsSidebarOpen,
  setCurrentSection,
  currentSection
}) {
  const [activeDownloads, setActiveDownloads] = useState(0)

  useEffect(() => {
    setActiveDownloads(
      downloads.filter((game) => game.download && game.download.status != 'completed').length
    )
  }, [downloads])

  const handleOpenGithub = () => {
    window.electron.ipcRenderer.send('open-external', 'https://github.com/rub3nnn')
  }

  const handleOpenPortfolio = () => {
    window.electron.ipcRenderer.send('open-external', 'https://rub3n.es')
  }

  return (
    <>
      <div className="flex h-full w-80 flex-col border-r bg-card">
        {/* LOGO */}
        <div className="p-4">
          <SecrecyLogo />
        </div>
        <Separator />

        {/* NAVIGATION */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            <nav className="grid gap-2">
              <Button
                variant={currentSection === 'minecraft' ? 'default' : 'outline'}
                className="justify-start gap-2"
                onClick={() => setCurrentSection('minecraft')}
              >
                <Gamepad className="h-4 w-4" />
                Minecraft
              </Button>

              <Button
                variant={currentSection === 'library' ? 'default' : 'outline'}
                className="justify-start gap-2"
                onClick={() => setCurrentSection('library')}
              >
                <LibraryBig className="h-4 w-4" />
                Librería
              </Button>

              <Button
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => setIsDownloadsSidebarOpen(true)}
              >
                <Download className="h-4 w-4" />
                <span className="flex-grow text-left">Descargas</span>
                {activeDownloads > 0 && (
                  <Badge variant="default" className="ml-auto text-xs px-1.5 py-0">
                    {activeDownloads}
                  </Badge>
                )}
              </Button>

              <Button variant="ghost" className="justify-start gap-2" onClick={handleRefresh}>
                <RefreshCcw className="h-4 w-4" />
                Recargar
              </Button>
            </nav>
          </div>
        </ScrollArea>

        {/* DESARROLLADOR */}
        <div className="mt-auto">
          <Separator />
          <div className="p-4">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
              <Avatar className="h-16 w-16 mb-3">
                <AvatarImage src="https://github.com/rub3nnn.png" />
                <AvatarFallback className="bg-primary/10 text-lg">R3</AvatarFallback>
              </Avatar>

              <p className="text-base font-semibold">rub3nnn</p>
              <p className="text-xs text-muted-foreground mb-2">Desarrollador · Autor</p>
              <p className="text-xs text-muted-foreground mb-3">Secrecy Launcher</p>

              <a
                className="text-sm text-primary hover:underline mb-3"
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenPortfolio()
                }}
              >
                rub3n.es
              </a>

              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleOpenGithub}
                  className="flex items-center gap-1"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleOpenPortfolio}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Portfolio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DownloadsSidebar
        gameData={gameData}
        games={downloads}
        isOpen={isDownloadsSidebarOpen}
        onClose={() => setIsDownloadsSidebarOpen(false)}
      />
    </>
  )
}
