/**
 * EnergyNetwork — a bespoke "charging grid" motif.
 *
 * A constellation of hub nodes wired by lines along which electric current
 * visibly flows (animated stroke-dash). Evokes a connected EV charging /
 * freight-corridor network without using any third-party imagery. Pure SVG +
 * CSS keyframes (globals.css) → server-rendered, zero client JS.
 */

// Deterministic layout in a 1200×620 viewBox.
const nodes = [
  { x: 90, y: 470, r: 5, big: true },
  { x: 250, y: 360, r: 3 },
  { x: 360, y: 510, r: 4 },
  { x: 470, y: 300, r: 3 },
  { x: 560, y: 440, r: 6, big: true },
  { x: 680, y: 250, r: 3 },
  { x: 740, y: 420, r: 4 },
  { x: 860, y: 330, r: 3 },
  { x: 950, y: 470, r: 5, big: true },
  { x: 1050, y: 280, r: 3 },
  { x: 1130, y: 410, r: 4 },
]

// Edges by node index — the "wires" current flows along.
const edges: Array<[number, number, 'slow' | 'fast' | '']> = [
  [0, 1, ''], [1, 2, 'slow'], [1, 3, 'fast'], [3, 4, ''], [2, 4, 'slow'],
  [4, 5, 'fast'], [4, 6, ''], [6, 7, 'slow'], [5, 7, ''], [7, 8, 'fast'],
  [6, 8, ''], [7, 9, 'slow'], [9, 10, ''], [8, 10, 'fast'],
]

export default function EnergyNetwork({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 620"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="en-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00C853" stopOpacity="0.0" />
          <stop offset="50%" stopColor="#00E87A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00C853" stopOpacity="0.0" />
        </linearGradient>
        <radialGradient id="en-node" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#69F0AE" />
          <stop offset="100%" stopColor="#00C853" />
        </radialGradient>
      </defs>

      {/* Faint static base wires */}
      {edges.map(([a, b], i) => (
        <line
          key={`base-${i}`}
          x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="#00C853" strokeOpacity="0.12" strokeWidth="1"
        />
      ))}

      {/* Flowing current */}
      {edges.map(([a, b, speed], i) => (
        <line
          key={`flow-${i}`}
          className={`energy-line ${speed}`}
          x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="url(#en-line)" strokeWidth="1.6" strokeLinecap="round"
          style={{ animationDelay: `${(i % 5) * 0.4}s` }}
        />
      ))}

      {/* Hub nodes */}
      {nodes.map((n, i) => (
        <g key={`node-${i}`}>
          {n.big && (
            <circle cx={n.x} cy={n.y} r={n.r * 3.2} fill="#00C853" fillOpacity="0.10"
              className="node-pulse" style={{ animationDelay: `${(i % 4) * 0.5}s` }} />
          )}
          <circle cx={n.x} cy={n.y} r={n.r} fill="url(#en-node)"
            className="node-pulse" style={{ animationDelay: `${(i % 4) * 0.5}s` }} />
        </g>
      ))}
    </svg>
  )
}
