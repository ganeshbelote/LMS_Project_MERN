import { useState } from 'react'

const toNumber = v => {
  const num = Number(v)
  return Number.isFinite(num) ? num : 0
}

const defaultFmt = v => {
  const num = Number(v)
  if (!Number.isFinite(num)) return '0'
  return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : String(num)
}

const DonutChart = ({ data, size = 220, formatValue }) => {
  const [hovered, setHovered] = useState(null)
  const fmt = formatValue || defaultFmt

  const safeData = (data || []).filter(d => d && d.count !== undefined && d.count !== null)
  const total = safeData.reduce((s, d) => s + toNumber(d.count), 0)
  if (total === 0 || safeData.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-10">No data available yet</p>
  }

  const radius = size / 2
  const strokeW = 26
  const r = radius - strokeW / 2
  const circ = 2 * Math.PI * r

  let offset = 0

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img">
          <circle cx={radius} cy={radius} r={r} fill="none" stroke="#f3f4f6" strokeWidth={strokeW} />
          {safeData.map((d, i) => {
            const val = toNumber(d.count)
            const frac = val / total
            const dash = frac * circ
            const isHovered = hovered === i
            const el = (
              <circle
                key={d.role + i}
                cx={radius}
                cy={radius}
                r={r}
                fill="none"
                stroke={d.color}
                strokeWidth={isHovered ? strokeW + 4 : strokeW}
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={-offset}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            )
            offset += dash
            return el
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <p className="text-3xl font-bold text-gray-800">{fmt(total)}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
      </div>
      <div className="space-y-2 flex-1 w-full">
        {safeData.map((d, i) => {
          const val = toNumber(d.count)
          const pct = Math.round((val / total) * 100)
          const isHovered = hovered === i
          return (
            <div
              key={d.role + i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors cursor-default ${isHovered ? 'bg-gray-50' : ''}`}
            >
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-sm text-gray-700 capitalize flex-1">{d.role}</span>
              <span className="text-sm font-semibold text-gray-800">{fmt(val)}</span>
              <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DonutChart