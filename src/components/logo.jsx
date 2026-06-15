import logo from '@renderer/assets/logo.png'

export function SecrecyLogo({ compact = false }) {
  return (
    <img
      src={logo}
      alt="Secrecy Logo"
      className={`${compact ? 'h-8' : 'h-10'} w-auto object-contain transition-all duration-300 ease-out hover:scale-105 active:scale-[0.98] cursor-pointer`}
    />
  )
}
