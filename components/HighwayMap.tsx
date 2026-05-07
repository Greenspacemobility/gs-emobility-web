'use client'

import dynamic from 'next/dynamic'

const HighwayMapInner = dynamic(() => import('./HighwayMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-navy-800 rounded-3xl animate-pulse flex items-center justify-center">
      <span className="text-white/20 text-sm">···</span>
    </div>
  ),
})

export default function HighwayMap() {
  return <HighwayMapInner />
}
