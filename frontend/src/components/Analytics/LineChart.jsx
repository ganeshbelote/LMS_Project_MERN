import { useState } from 'react'

const fmtCount = n => {
  const num = Number(n)
  if (!Number.isFinite(num)) return '0'
  return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : String(num)
}

const toNumber = v => {
  const num = Number(v)
  return Number.isFinite(num) ? num : 0
}

const LineChart = ({ data, color = '#8b5cf6', formatValue = fmtCount, valueKey = 'total' }) => {
  const [hovered, setHovered] = useState(null)

  const safeData = (data || []).filter(d => d && d[valueKey] !== undefined && d[valueKey] !== null)
  const values = safeData.map(d => toNumber(d[valueKey]))
  const max = Math.max(...values, 1)
  const chartW = 720
  const chartH = 260
  const padL = 40
  const padB = 30
  const padT = 20
  const innerW = chartW - padL - 8
  const innerH = chartH - padT - padB
  const n = safeData.length
  const step = n > 1 ? innerW / (n - 1) : innerW

  const pts = safeData.map((d, i) => ({
    x: padL + (n > 1 ? i * step : 0),
    y: padT + innerH - (toNumber(d[valueKey]) / max) * innerH,
    ...d
  }))

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const lastX = pts[pts.length - 1]?.x ?? padL
  const firstX = pts[0]?.x ?? padL
  const baseY = padT + innerH
  const areaD = `${pathD} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`

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
                  {fmtCount(Math.round(t * max))}
                </text>
              </g>
            )
          })}

          {pts.length > 1 && <path d={areaD} fill={color} opacity="0.12" />}
          {pts.length > 1 && <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

          {pts.map((p, i) => {
            const isHovered = hovered === i
            return (
              <g key={p.key + i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                <rect x={p.x - step / 2} y={padT} width={step} height={innerH} fill="transparent" className="cursor-pointer" />
                {isHovered && (
                  <g>
                    <line x1={p.x} x2={p.x} y1={padT} y2={padT + innerH} stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
                    <rect x={p.x - 30} y={p.y - 30} width="60" height="22" rx="6" fill="#1f2937" />
                    <text x={p.x} y={p.y - 15} textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">
                      {formatValue(toNumber(p[valueKey]))}
                    </text>
                  </g>
                )}
                <circle cx={p.x} cy={p.y} r={isHovered ? 6 : 3.5} fill="#fff" stroke={color} strokeWidth="2.5" className="transition-all" />
              </g>
            )
          })}

          {pts.map((p, i) => (
            <text key={p.key + 'lbl'} x={p.x} y={chartH - 10} textAnchor="middle" fontSize="9" fill="#9ca3af">
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}

export default LineChart