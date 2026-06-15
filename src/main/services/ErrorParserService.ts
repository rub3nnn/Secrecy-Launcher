export interface ParsedError {
  title: string
  description: string
  severity: 'error' | 'warning'
  errorCode?: string
  errorDetails?: string
}

function classVersionToJava(versionStr: string): string {
  const major = parseFloat(versionStr)
  if (isNaN(major)) return versionStr
  // Java 5 is class version 49, Java 6 is 50, ..., Java 21 is 65, Java 25 is 69
  if (major >= 49) {
    return `Java ${Math.round(major - 44)}`
  }
  return `Java (clase ${versionStr})`
}

export const ErrorParserService = {
  parseLogs(logs: string[], exitCode?: number | null): ParsedError | null {
    const fullLog = logs.join('\n')

    // 1. Java Version Mismatch (UnsupportedClassVersionError)
    if (fullLog.includes('UnsupportedClassVersionError') || /compiled by a more recent version of the Java Runtime/i.test(fullLog)) {
      const match = fullLog.match(/class file version (\d+(?:\.\d+)?).*recognizes class file versions up to (\d+(?:\.\d+)?)/i)
      let detailedDiff = ''
      if (match) {
        const requiredJava = classVersionToJava(match[1])
        const currentJava = classVersionToJava(match[2])
        detailedDiff = ` (Se requiere ${requiredJava} pero se ejecutó con ${currentJava})`
      }
      return {
        title: 'Versión de Java Incompatible',
        description: `La versión de Java que tienes configurada en los ajustes es demasiado antigua para esta versión de Minecraft.${detailedDiff}. Por favor, ve a los Ajustes del Launcher y asegúrate de elegir una versión compatible en 'Ejecutable de Java' o déjala en 'Automático'.`,
        severity: 'error',
        errorCode: 'JAVA_VERSION_MISMATCH',
        errorDetails: fullLog.slice(-1500)
      }
    }

    // 2. JVM Argument Error
    if (fullLog.includes('Unrecognized VM option') || fullLog.includes('Could not create the Java Virtual Machine')) {
      return {
        title: 'Argumentos JVM Incorrectos',
        description: 'El juego no pudo iniciarse porque los argumentos de Java (JVM arguments) configurados en Ajustes no son reconocidos o no son compatibles con tu versión de Java. Por favor, ve a Ajustes y borra o corrige los Argumentos JVM.',
        severity: 'error',
        errorCode: 'INVALID_JVM_ARGUMENTS',
        errorDetails: fullLog.slice(-1000)
      }
    }

    // 3. Out of Memory Error
    if (
      fullLog.includes('OutOfMemoryError') ||
      fullLog.includes('Could not reserve enough space for object heap') ||
      /Error occurred during initialization of VM/i.test(fullLog) && /reserve.*heap/i.test(fullLog)
    ) {
      return {
        title: 'Fallo de Memoria RAM',
        description: 'No se pudo asignar suficiente memoria RAM para iniciar el juego. Esto ocurre cuando intentas asignar más memoria de la que tu sistema tiene libre en este momento, o si estás usando una versión de Java de 32 bits. Por favor, ve a Ajustes y reduce la cantidad de Memoria RAM asignada.',
        severity: 'error',
        errorCode: 'OUT_OF_MEMORY',
        errorDetails: fullLog.slice(-1000)
      }
    }

    // 4. OpenGL / Graphic Driver error
    if (
      fullLog.includes('Pixel format not accelerated') ||
      fullLog.includes('WGL: The driver does not appear to support OpenGL') ||
      /GLFW error \d+:.*OpenGL/i.test(fullLog)
    ) {
      return {
        title: 'Error de Gráficos (OpenGL/GLFW)',
        description: 'Tu tarjeta gráfica o sus controladores (drivers) no soportan la versión de OpenGL necesaria para jugar a esta versión de Minecraft. Por favor, actualiza los drivers de tu tarjeta de video (NVIDIA, AMD o Intel) desde su sitio web oficial.',
        severity: 'error',
        errorCode: 'GRAPHICS_DRIVER_OUTDATED',
        errorDetails: fullLog.slice(-1200)
      }
    }

    // 5. Mod Conflict or Mixin Crash
    if (
      fullLog.includes('Mixin apply failed') ||
      fullLog.includes('MixinTransformationError') ||
      fullLog.includes('Crash report written to') ||
      /has crashed!/i.test(fullLog) ||
      /A crash report has been saved/i.test(fullLog)
    ) {
      const crashMatch = fullLog.match(/Crash report written to:?[\s\r\n]+([^\r\n]+)/i)
      const locationInfo = crashMatch ? `\n\nEl reporte se guardó en:\n${crashMatch[1]}` : ''
      return {
        title: 'Fallo del Cliente (Crasheo de Mods)',
        description: `Minecraft se ha cerrado debido a un error crítico o conflicto entre los mods cargados (Fabric/Forge/NeoForge). Si has añadido mods recientemente, asegúrate de que sean compatibles con la versión de Minecraft instalada.${locationInfo}`,
        severity: 'error',
        errorCode: 'MODS_CONFLICT_CRASH',
        errorDetails: fullLog.slice(-1500)
      }
    }

    // 6. Missing or Corrupted Files
    if (
      fullLog.includes('java.io.FileNotFoundException') ||
      fullLog.includes('ClassNotFoundException') ||
      fullLog.includes('ENOENT') ||
      fullLog.includes('Failed to start due to Error')
    ) {
      return {
        title: 'Archivos Dañados o Faltantes',
        description: 'No se pudo iniciar el juego porque faltan archivos esenciales de la versión (como el archivo JSON de configuración o el ejecutable del juego). Si has cambiado de directorio, asegúrate de que contenga todos los archivos de esa versión, o vuelve a descargarla si es necesario.',
        severity: 'error',
        errorCode: 'CORRUPTED_GAME_FILES',
        errorDetails: fullLog.slice(-1200)
      }
    }

    // 7. Session/Authentication Expired
    if (
      fullLog.includes('Invalid session') ||
      fullLog.includes('Authentication failed') ||
      /session.*invalid/i.test(fullLog)
    ) {
      return {
        title: 'Sesión Expirada',
        description: 'La sesión actual del juego ha caducado o no es válida. Por favor, cierra la sesión actual desde el menú superior del launcher e ingresa tus datos de cuenta nuevamente.',
        severity: 'error',
        errorCode: 'INVALID_SESSION',
        errorDetails: fullLog.slice(-800)
      }
    }

    // Fallback: If game exited abnormally but we didn't match any specific signature
    if (exitCode !== undefined && exitCode !== null && exitCode !== 0) {
      // Get the last 15 lines for context
      const lines = logs.slice(-20)
      return {
        title: 'Minecraft se cerró inesperadamente',
        description: `El juego finalizó de forma anormal con un código de salida (exit code: ${exitCode}). Esto suele deberse a un fallo interno de Java, a un mod incompatible o a una falta de memoria del sistema.`,
        severity: 'error',
        errorCode: `EXIT_CODE_${exitCode}`,
        errorDetails: lines.length > 0 ? lines.join('\n') : 'No hay logs disponibles.'
      }
    }

    return null
  }
}
