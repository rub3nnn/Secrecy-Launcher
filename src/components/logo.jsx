import logo from '@renderer/assets/logo.png'

export function SecrecyLogo() {
  return (
    <div className="flex items-center">
      <div className="relative w-47 h-8 rounded-md flex items-center justify-center overflow-hidden">
        <img src={logo} alt="Secrecy Logo" className="absolute inset-0 w-full h-full"></img>
      </div>
    </div>
  )
}
