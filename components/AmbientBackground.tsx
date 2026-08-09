/**
 * AmbientBackground — bespoke, code-generated section backdrops.
 *
 * Replaces flat gradient <div>s with a layered, living surface:
 * drifting aurora light-blooms + a techy grid/dot matrix + an optional
 * slow scanning sweep. Pure CSS (keyframes in globals.css), so it renders
 * server-side with zero client JS and honours prefers-reduced-motion.
 *
 * Drop it as the FIRST child of a `relative overflow-hidden` section and
 * give the real content `relative z-10`.
 */

type Variant = 'mesh' | 'grid' | 'dots' | 'corridor'

interface Props {
  variant?: Variant
  /** show the slow moving light bar */
  sweep?: boolean
  /** overall opacity of the effect (0–100, tailwind-ish) */
  className?: string
}

export default function AmbientBackground({ variant = 'mesh', sweep = false, className = '' }: Props) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {/* Base wash — keeps text contrast steady over the animated layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/0 via-navy-800/25 to-navy-900/0" />

      {/* Drifting aurora blooms */}
      {(variant === 'mesh' || variant === 'grid' || variant === 'corridor') && (
        <>
          <div
            className="aurora-blob b1"
            style={{ width: '46rem', height: '46rem', top: '-12%', left: '-8%', background: 'radial-gradient(circle, rgba(0,200,83,0.16), transparent 65%)' }}
          />
          <div
            className="aurora-blob b2"
            style={{ width: '38rem', height: '38rem', bottom: '-14%', right: '-6%', background: 'radial-gradient(circle, rgba(13,79,61,0.30), transparent 68%)' }}
          />
          <div
            className="aurora-blob b3"
            style={{ width: '28rem', height: '28rem', top: '30%', right: '22%', background: 'radial-gradient(circle, rgba(0,232,122,0.10), transparent 70%)' }}
          />
        </>
      )}

      {/* Dot matrix (subtle precision texture) */}
      {variant === 'dots' && (
        <>
          <div className="grid-dots" />
          <div
            className="aurora-blob b1"
            style={{ width: '40rem', height: '40rem', top: '-10%', left: '20%', background: 'radial-gradient(circle, rgba(0,200,83,0.10), transparent 68%)' }}
          />
        </>
      )}

      {/* Perspective "energy floor" grid */}
      {(variant === 'grid' || variant === 'corridor') && (
        <div className="grid-perspective" />
      )}

      {/* Moving light bar */}
      {sweep && <div className="scan-sweep" />}
    </div>
  )
}
