import { useState, useRef, useEffect } from 'react'
import { Lock, AlertCircle } from 'lucide-react'

export function PinAccess({ correctPin = '2238', onSuccess }) {
  const [pin, setPin] = useState(['', '', '', ''])
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(false)
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    inputRefs[0].current?.focus()
  }, [])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)
    setError(false)

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus()
    }

    if (newPin.every((digit) => digit !== '') && index === 3) {
      const enteredPin = newPin.join('')
      if (enteredPin === correctPin) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess()
        }, 800)
      } else {
        setError(true)
        setShake(true)
        setTimeout(() => {
          setPin(['', '', '', ''])
          setShake(false)
          inputRefs[0].current?.focus()
        }, 500)
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 4)
    if (!/^\d+$/.test(pastedData)) return

    const newPin = [...pin]
    for (let i = 0; i < pastedData.length && i < 4; i++) {
      newPin[i] = pastedData[i]
    }
    setPin(newPin)

    if (pastedData.length === 4) {
      if (pastedData === correctPin) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess()
        }, 800)
      } else {
        setError(true)
        setShake(true)
        setTimeout(() => {
          setPin(['', '', '', ''])
          setShake(false)
          inputRefs[0].current?.focus()
        }, 500)
      }
    } else {
      const nextIndex = Math.min(pastedData.length, 3)
      inputRefs[nextIndex].current?.focus()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-border">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg transition-all duration-300">
              <Lock
                className={`w-8 h-8 text-white transition-all duration-300 ${success ? 'scale-0 rotate-180' : 'scale-100'}`}
              />
              {success && (
                <svg
                  className="w-8 h-8 text-white absolute animate-check-appear"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Acceso Restringido</h2>
            <p className="text-muted-foreground text-center text-sm">
              Esta sección está protegida. Solo para usuarios autorizados.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3 text-center">
              Introduce el código PIN
            </label>
            <div className={`flex justify-center gap-3 ${shake ? 'animate-shake' : ''}`}>
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={success}
                  className={`w-14 h-16 text-center text-2xl font-bold rounded-lg transition-all duration-200
                    ${
                      success
                        ? 'bg-green-500/20 border-2 border-green-500 text-green-600 scale-105'
                        : error
                          ? 'bg-red-500/20 border-2 border-red-500 text-red-400'
                          : 'bg-muted border-2 border-input text-foreground focus:border-primary focus:bg-background'
                    }
                    focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed`}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              <span>PIN incorrecto. Inténtalo de nuevo.</span>
            </div>
          )}

          {success && (
            <div className="flex items-center justify-center gap-2 text-green-500 text-sm animate-fade-in font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>¡Acceso concedido!</span>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Zona de desarrollo • Solo fines educativos
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes check-appear {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
          }
          50% {
            transform: scale(1.2) rotate(0deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        .animate-check-appear {
          animation: check-appear 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
