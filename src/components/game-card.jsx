'use client'

import { useState, useEffect, useRef } from 'react'
import { Download, MoreHorizontal, Play, Star } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'

import video from '@renderer/assets/video.webm' // Adjust the path as necessary
import banner from '@renderer/assets/banner.jpg' // Adjust the path as necessary

export function GameCard({ game, onViewDetails, onInstall, onUninstall, onToggleFavorite }) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && game.backgroundVideo && isHovered && !videoLoaded) {
      const handleLoadedData = () => {
        setVideoLoaded(true)
      }

      const handleError = () => {
        setVideoError(true)
      }

      videoRef.current.addEventListener('loadeddata', handleLoadedData)
      videoRef.current.addEventListener('error', handleError)

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', handleLoadedData)
          videoRef.current.removeEventListener('error', handleError)
        }
      }
    }
  }, [isHovered, game.backgroundVideo, videoLoaded])

  // Reset video state when hover ends
  useEffect(() => {
    if (!isHovered) {
      setVideoLoaded(false)
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.pause()
      }
    } else if (videoRef.current) {
      videoRef.current.play().catch((e) => console.error('Error playing video:', e))
    }
  }, [isHovered])

  return (
    <Card
      className="overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-[400px]">
        {/* Banner image (always shown, or as fallback) */}
        <img
          src={banner}
          alt={game.title}
          className={`w-full h-full object-cover absolute inset-0 ${videoLoaded && isHovered ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        />

        {/* Background video (if available and hovered) */}
        {game.backgroundVideo && isHovered && (
          <video
            ref={videoRef}
            src={video}
            className={`w-full h-full object-cover absolute inset-0 ${videoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
            autoPlay
            loop
            muted
            playsInline
          />
        )}

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Game info overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
          <div className="flex justify-between items-start">
            {game.favorite && (
              <Badge variant="secondary" className="mb-2">
                <Star className="h-3 w-3 fill-current mr-1" />
                Favorito
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Más opciones</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onViewDetails}>Ver detalles</DropdownMenuItem>
                <DropdownMenuItem onClick={onToggleFavorite}>
                  {game.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                </DropdownMenuItem>
                {game.installed && (
                  <DropdownMenuItem onClick={onUninstall}>Desinstalar</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-auto">
            <div className="mb-4">
              <h3 className="text-3xl font-bold mb-1">{game.title}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{game.genre}</Badge>
                <span className="text-sm text-white/80">
                  {game.installed ? `${game.size} • ${game.lastPlayed}` : `Tamaño: ${game.size}`}
                </span>
              </div>
            </div>

            <p className="text-white/90 mb-6 line-clamp-3">{game.description}</p>

            {game.progress > 0 && game.progress < 100 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Descargando...</span>
                  <span>{game.progress}%</span>
                </div>
                <Progress value={game.progress} className="h-2" />
              </div>
            )}

            <div className="flex gap-3">
              <Button size="lg" variant="secondary" className="flex-1" onClick={onViewDetails}>
                Ver detalles
              </Button>
              {game.installed ? (
                <Button size="lg" variant="default" className="flex-1">
                  <Play className="mr-2 h-4 w-4" />
                  Jugar
                </Button>
              ) : (
                <Button size="lg" variant="default" className="flex-1" onClick={onInstall}>
                  <Download className="mr-2 h-4 w-4" />
                  Instalar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
