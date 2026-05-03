'use client'

import { useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'

interface Props {
  src: string
  poster?: string
  label?: string
}

export default function VideoPlayer({ src, poster, label }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) {
      v.pause()
      setPlaying(false)
    } else {
      v.play()
      setPlaying(true)
    }
  }

  /* Vertical 9:16 aspect — max height constrained so it fits nicely */
  return (
    <div className="relative w-full max-w-[280px] mx-auto" style={{ aspectRatio: '9/16' }}>
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        onCanPlay={() => setReady(true)}
        onEnded={() => setPlaying(false)}
        onClick={toggle}
        className="w-full h-full object-cover rounded-2xl cursor-pointer"
        style={{ background: '#060E09' }}
      />

      {/* Play / pause overlay — hides once playing */}
      <div
        onClick={toggle}
        className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-opacity duration-300 ${
          playing ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ background: playing ? 'transparent' : 'rgba(6,14,9,0.45)' }}
      >
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center glow-green mb-3 hover:bg-green-400 transition-colors">
          <Play className="w-7 h-7 text-navy-900 ml-1" fill="currentColor" />
        </div>
        {label && (
          <span
            className="text-white/70 text-xs uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {label}
          </span>
        )}
      </div>

      {/* Pause button — visible only while playing, fades in on hover */}
      {playing && (
        <div
          onClick={toggle}
          className="absolute inset-0 flex items-center justify-center rounded-2xl cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'rgba(6,14,9,0.25)' }}
        >
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <Pause className="w-6 h-6 text-white" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  )
}
