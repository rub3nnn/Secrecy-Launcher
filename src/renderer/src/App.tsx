import { GameLibrary } from '@/components/game-library'
import { SidebarNav } from '@/components/sidebar-nav'
import { UpdateNotification } from '@/components/update'

function App() {
  return (
    <div className="flex h-screen bg-background">
      <SidebarNav />
      <main className="flex-1 overflow-auto">
        <GameLibrary />
      </main>
      <UpdateNotification />
    </div>
  )
}

export default App
