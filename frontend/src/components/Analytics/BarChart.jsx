import { useState } from 'react'

const toNumber = v => {
  const num = Number(v)
  return Number.isFinite(num) ? num : 0
}

const BarChart = ({ data, color = '#3b82f6', formatValue, valueKey = 'count' }) => {
  const [hovered, setHovered] = useState(null)

  const safeData = (data || []).filter(d => d && d[valueKey] !== undefined && d[valueKey] !== null)
  const values = safeData.map(d => toNumber(d[valueKey]))
  const max = Math.max(...values, 1)
  const chartW = 720
  const chartH = 260
  const padL = 30
  const padB = 30
  const padT = 20
  const innerW = chartW - padL - 8
  const innerH = chartH - padT - padB
  const n = safeData.length
  const slot = innerW / Math.max(n, 1)
  const barW = Math.max(10, Math.min(34, slot * 0.55))

  const fmt = formatValue || ((v) => {
    const num = Number(v)
    if (!Number.isFinite(num)) return '0'
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : String(num)
  })

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[560px]">
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" role="img">
          {[0, 0.25, 0.5, 0.75, 1].map(t => {
            const y = padT + innerH - t * innerH
            return (
              <g key={t}>
                <line x1={padL} x2={chartW - 8} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
                <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                  {fmt(Math.round(t * max))}
                </text>
              </g>
            )
          })}

          {safeData.map((d, i) => {
            const val = toNumber(d[valueKey])
            const h = (val / max) * innerH
            const x = padL + i * slot + (slot - barW) / 2
            const y = padT + innerH - h
            const isHovered = hovered === i
            return (
              <g key={d.key + i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                <rect x={padL + i * slot} y={padT} width={slot} height={innerH} fill="transparent" className="cursor-pointer" />
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={Math.max(h, 2)}
                  rx="5"
                  fill={color}
                  opacity={isHovered ? 1 : 0.8}
                  className="transition-opacity duration-150"
                />
                {isHovered && (
                  <g>
                    <rect x={x + barW / 2 - 24} y={y - 30} width="48" height="20" rx="6" fill="#1f2937" />
                    <text x={x + barW / 2} y={y - 16} textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">
                      {fmt(val)}
                    </text>
                  </g>
                )}
                <text x={x + barW / 2} y={chartH - 10} textAnchor="middle" fontSize="9" fill="#9ca3af">
                  {d.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export default BarChart