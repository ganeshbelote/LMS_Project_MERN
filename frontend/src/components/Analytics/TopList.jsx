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

const TopList = ({ data, title, valueKey = 'enrollments', formatValue, barColor = '#10b981', labelColor = '#059669' }) => {
  const [hovered, setHovered] = useState(null)

  const safeData = (data || []).filter(d => d && d[valueKey] !== undefined && d[valueKey] !== null)
  const values = safeData.map(d => toNumber(d[valueKey]))
  const max = Math.max(...values, 1)
  const fmt = formatValue || defaultFmt

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      {safeData.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No data available yet</p>
      ) : (
        <div className="space-y-2.5">
          {safeData.map((d, i) => {
            const isHovered = hovered === i
            const val = toNumber(d[valueKey])
            return (
              <div
                key={d.title + i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-default rounded-lg p-1.5 -m-1.5 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center justify-between mb-1 gap-2">
                  <span className="text-sm text-gray-700 truncate flex-1">
                    <span className="font-medium">{i + 1}.</span> {d.title}
                  </span>
                  <span className="text-sm font-semibold flex-shrink-0" style={{ color: labelColor }}>
                    {fmt(val)}
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${(val / max) * 100}%`,
                      backgroundColor: barColor,
                      opacity: isHovered ? 1 : 0.75
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TopList