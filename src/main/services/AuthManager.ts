import { Auth } from 'msmc'
import log from 'electron-log'
import { ConfigStore } from './ConfigStore'

const authManager = new Auth('select_account')

export const AuthManager = {
  async loginMicrosoft(): Promise<string> {
    try {
      log.info('[AuthManager] Starting Microsoft Login flow...')
      const xboxManager = await authManager.launch('electron')
      const minecraftData = await xboxManager.getMinecraft()
      
      ConfigStore.set('minecraft.auth', minecraftData.mclc())
      ConfigStore.set('minecraft.profile', minecraftData.profile)
      ConfigStore.set('minecraft.userAccount', {
        type: 'premium',
        username: minecraftData.profile?.name || 'Player'
      })
      
      log.info(`[AuthManager] Microsoft Login successful. Username: ${minecraftData.profile?.name}`)
      return minecraftData.profile?.name || 'Player'
    } catch (error) {
      log.error('[AuthManager] Microsoft Login error:', error)
      throw error
    }
  },

  loginOffline(username: string): string {
    if (!username || username.trim() === '') {
      throw new Error('Username cannot be empty')
    }

    const cleanUsername = username.trim()
    ConfigStore.set('minecraft.userAccount', {
      type: 'offline',
      username: cleanUsername
    })
    // Remove premium auth cache to avoid conflicts
    ConfigStore.delete('minecraft.auth')
    ConfigStore.delete('minecraft.profile')

    log.info(`[AuthManager] Offline mode configured. Username: ${cleanUsername}`)
    return cleanUsername
  },

  logout(): void {
    ConfigStore.delete('minecraft.userAccount')
    ConfigStore.delete('minecraft.auth')
    ConfigStore.delete('minecraft.profile')
    log.info('[AuthManager] User logged out, profile deleted.')
  }
}
