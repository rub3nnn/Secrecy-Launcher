import { GameLibrary } from '@/components/game-library'
import { SidebarNav } from '@/components/sidebar-nav'

function App() {
  return (
    <div className="flex h-screen bg-background">
      <SidebarNav />
      <main className="flex-1 overflow-auto">
        <GameLibrary />
      </main>
    </div>
  )
}

export default App
