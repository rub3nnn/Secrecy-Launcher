import React, { useEffect, useRef } from 'react'
import * as skinview3d from 'skinview3d'

const SkinViewerComponent = ({
  skinUrl,
  width = 300,
  height = 400,
  background = null,
  capeUrl = null,
  animation = null
}) => {
  const canvasRef = useRef(null)
  const skinViewerRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current && !skinViewerRef.current) {
      // Initialize the skin viewer
      skinViewerRef.current = new skinview3d.SkinViewer({
        canvas: canvasRef.current,
        width: width,
        height: height,
        skin: skinUrl
      })

      // Set background if provided
      if (background) {
        if (typeof background === 'number') {
          skinViewerRef.current.background = background
        } else if (typeof background === 'string') {
          skinViewerRef.current.loadBackground(background)
        }
      }

      // Set up auto-rotate
      skinViewerRef.current.autoRotate = true
      skinViewerRef.current.autoRotateSpeed = 0.5
    }

    return () => {
      // Clean up
      if (skinViewerRef.current) {
        skinViewerRef.current.dispose()
        skinViewerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (skinViewerRef.current && skinUrl) {
      skinViewerRef.current.loadSkin(skinUrl)
    }
  }, [skinUrl])

  useEffect(() => {
    if (skinViewerRef.current && capeUrl) {
      skinViewerRef.current.loadCape(capeUrl)
    } else if (skinViewerRef.current && capeUrl === null) {
      skinViewerRef.current.loadCape(null)
    }
  }, [capeUrl])

  useEffect(() => {
    if (skinViewerRef.current) {
      if (animation === 'walking') {
        skinViewerRef.current.animation = new skinview3d.WalkingAnimation()
      } else if (animation === 'running') {
        skinViewerRef.current.animation = new skinview3d.RunningAnimation()
      } else if (animation === 'rotating') {
        skinViewerRef.current.animation = new skinview3d.RotatingAnimation()
      } else {
        skinViewerRef.current.animation = null
      }
    }
  }, [animation])

  return <canvas ref={canvasRef} width={width} height={height} />
}

export default SkinViewerComponent
