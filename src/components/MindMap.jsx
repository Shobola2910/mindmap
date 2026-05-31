import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle, useState } from 'react'
import './MindMap.css'

const NODE_W = 180
const NODE_H = 44
const ROOT_W = 160
const ROOT_H = 56
const H_GAP = 60
const V_GAP = 14

function measureTree(node, depth = 0) {
  if (!node.children || node.children.length === 0) {
    return { ...node, _w: NODE_W, _h: NODE_H, _totalH: NODE_H, _depth: depth }
  }
  const children = node.children.map(c => measureTree(c, depth + 1))
  const totalChildH = children.reduce((s, c) => s + c._totalH, 0) + V_GAP * (children.length - 1)
  const selfH = depth === 0 ? ROOT_H : NODE_H
  const totalH = Math.max(selfH, totalChildH)
  return { ...node, children, _w: NODE_W, _h: selfH, _totalH: totalH, _depth: depth }
}

function layoutTree(node, x, y) {
  const selfH = node._h
  const selfCY = y + node._totalH / 2
  const nodeX = x
  const nodeY = selfCY - selfH / 2

  let childY = y
  const children = (node.children || []).map(child => {
    const laid = layoutTree(child, x + (node._depth === 0 ? ROOT_W : NODE_W) + H_GAP, childY)
    childY += child._totalH + V_GAP
    return laid
  })

  return { ...node, children, _x: nodeX, _y: nodeY, _cx: nodeX + (node._depth === 0 ? ROOT_W : NODE_W) / 2, _cy: selfCY }
}

function flattenTree(node, acc = []) {
  acc.push(node)
  node.children.forEach(c => flattenTree(c, acc))
  return acc
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function lighten(hex, amount = 0.15) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r},${g},${b},${amount})`
}

const MindMap = forwardRef(function MindMap({
  data, zoom, pan, selectedId, setZoom, setPan, setSelectedId, onEdit, onAddChild, onDelete
}, ref) {
  const canvasRef = useRef(null)
  const offscreenRef = useRef(null)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 })
  const hoveredRef = useRef(null)
  const [hovered, setHovered] = useState(null)
  const layoutRef = useRef(null)
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light'

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current
  }))

  const getLayout = useCallback(() => {
    const measured = measureTree(data)
    const layout = layoutTree(measured, 0, 0)
    layoutRef.current = layout
    return layout
  }, [data])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight

    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr
      canvas.height = H * dpr
    }

    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const dark = document.documentElement.getAttribute('data-theme') !== 'light'
    const bg = dark ? '#0d0d0f' : '#f5f4f0'
    const gridColor = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'
    const textColor = dark ? '#f0eee8' : '#1a1918'
    const subTextColor = dark ? '#9a9890' : '#6b6a65'
    const lineBase = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'

    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // Grid dots
    const gridSize = 28 * zoom
    const offX = (pan.x * zoom) % gridSize
    const offY = (pan.y * zoom) % gridSize
    ctx.fillStyle = gridColor
    for (let gx = offX; gx < W; gx += gridSize) {
      for (let gy = offY; gy < H; gy += gridSize) {
        ctx.beginPath(); ctx.arc(gx, gy, 1, 0, Math.PI * 2); ctx.fill()
      }
    }

    ctx.save()
    ctx.translate(pan.x * zoom + W / 2 - (pan.x * zoom), pan.y * zoom + H / 2 - (pan.y * zoom))
    ctx.translate(pan.x, pan.y)
    ctx.scale(zoom, zoom)

    const layout = getLayout()
    const nodes = flattenTree(layout)

    // Draw connections first
    nodes.forEach(node => {
      if (!node.children || node.children.length === 0) return
      const isRoot = node._depth === 0
      const startX = node._x + (isRoot ? ROOT_W : NODE_W)
      const startY = node._cy

      node.children.forEach(child => {
        const endX = child._x
        const endY = child._cy
        const cpX = (startX + endX) / 2

        const color = child.color || '#6366f1'
        const { r, g, b } = hexToRgb(color)
        const opacity = selectedId && selectedId !== child.id && selectedId !== node.id ? 0.3 : 0.6

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.bezierCurveTo(cpX, startY, cpX, endY, endX, endY)
        ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`
        ctx.lineWidth = selectedId === child.id ? 2 : 1.2
        ctx.stroke()
      })
    })

    // Draw nodes
    nodes.forEach(node => {
      const isRoot = node._depth === 0
      const w = isRoot ? ROOT_W : NODE_W
      const h = isRoot ? ROOT_H : NODE_H
      const x = node._x, y = node._y
      const color = node.color || '#6366f1'
      const isSelected = selectedId === node.id
      const isHov = hovered === node.id

      const { r, g, b } = hexToRgb(color)

      // Shadow for selected
      if (isSelected) {
        ctx.shadowColor = `rgba(${r},${g},${b},0.5)`
        ctx.shadowBlur = 16
      }

      // Background
      const radius = isRoot ? 16 : 10
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, radius)

      if (isRoot) {
        ctx.fillStyle = color
      } else if (isSelected) {
        ctx.fillStyle = `rgba(${r},${g},${b},0.25)`
      } else if (isHov) {
        ctx.fillStyle = `rgba(${r},${g},${b},0.18)`
      } else {
        ctx.fillStyle = dark ? `rgba(${r},${g},${b},0.12)` : `rgba(${r},${g},${b},0.08)`
      }
      ctx.fill()

      ctx.shadowBlur = 0

      // Border
      ctx.strokeStyle = isSelected
        ? `rgba(${r},${g},${b},0.9)`
        : isHov ? `rgba(${r},${g},${b},0.6)`
        : `rgba(${r},${g},${b},0.3)`
      ctx.lineWidth = isSelected ? 2 : 1
      ctx.stroke()

      // Label
      const maxW = w - 20
      let fontSize = isRoot ? 14 : 12
      ctx.font = `${isRoot ? 700 : 500} ${fontSize}px 'Space Grotesk', sans-serif`
      ctx.fillStyle = isRoot ? '#fff' : (dark ? `rgba(${r > 200 ? r - 20 : r + 180},${g > 200 ? g - 20 : g + 180},${b > 200 ? b - 20 : b + 180},0.95)` : `rgba(${Math.min(r - 40, 80)},${Math.min(g - 40, 80)},${Math.min(b - 40, 80)},0.95)`)

      if (isRoot) ctx.fillStyle = '#ffffff'
      else ctx.fillStyle = dark ? color : `hsl(${getHue(color)}, 60%, 30%)`

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Truncate if needed
      let label = node.label
      while (ctx.measureText(label).width > maxW && label.length > 4) {
        label = label.slice(0, -4) + '...'
      }

      if (isRoot) {
        ctx.font = `700 15px 'Space Grotesk', sans-serif`
        ctx.fillStyle = '#ffffff'
        ctx.fillText(label, x + w / 2, y + h / 2 - 6)
        ctx.font = `400 10px 'JetBrains Mono', monospace`
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.fillText('Logistics Knowledge Map', x + w / 2, y + h / 2 + 10)
      } else {
        ctx.fillText(label, x + w / 2, y + h / 2)
      }

      // Depth indicator dot
      if (node._depth > 0 && node._depth < 3) {
        ctx.beginPath()
        ctx.arc(x + 10, y + h / 2, 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},0.6)`
        ctx.fill()
      }
    })

    ctx.restore()
  }, [data, zoom, pan, selectedId, hovered, getLayout])

  function getHue(hex) {
    const { r, g, b } = hexToRgb(hex)
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0
    if (max !== min) {
      const d = max - min
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
      else if (max === g) h = (b - r) / d + 2
      else h = (r - g) / d + 4
      h *= 60
    }
    return h
  }

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const obs = new ResizeObserver(() => draw())
    obs.observe(canvas)
    return () => obs.disconnect()
  }, [draw])

  const getNodeAt = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const W = canvas.offsetWidth, H = canvas.offsetHeight
    const mx = (clientX - rect.left - pan.x - W / 2 + pan.x) / zoom - pan.x
    const my = (clientY - rect.top - pan.y - H / 2 + pan.y) / zoom - pan.y

    const layout = layoutRef.current
    if (!layout) return null
    const nodes = flattenTree(layout)

    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i]
      const isRoot = n._depth === 0
      const w = isRoot ? ROOT_W : NODE_W
      const h = isRoot ? ROOT_H : NODE_H
      if (mx >= n._x && mx <= n._x + w && my >= n._y && my <= n._y + h) {
        return n
      }
    }
    return null
  }, [pan, zoom])

  const getCanvasCoords = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const W = canvas.offsetWidth, H = canvas.offsetHeight
    return {
      x: (clientX - W / 2) / zoom - pan.x + W / 2,
      y: (clientY - H / 2) / zoom - pan.y + H / 2
    }
  }, [zoom, pan])

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    const node = getNodeAt(e.clientX, e.clientY)
    if (node) {
      setSelectedId(node.id)
      isDragging.current = false
    } else {
      setSelectedId(null)
      isDragging.current = true
      dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }
    }
  }, [getNodeAt, pan, setSelectedId])

  const handleMouseMove = useCallback((e) => {
    if (isDragging.current) {
      const dx = (e.clientX - dragStart.current.x) / zoom
      const dy = (e.clientY - dragStart.current.y) / zoom
      setPan({ x: dragStart.current.px + dx, y: dragStart.current.py + dy })
    } else {
      const node = getNodeAt(e.clientX, e.clientY)
      const nid = node ? node.id : null
      if (nid !== hoveredRef.current) {
        hoveredRef.current = nid
        setHovered(nid)
        canvasRef.current.style.cursor = nid ? 'pointer' : 'grab'
      }
    }
  }, [getNodeAt, zoom, setPan])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const handleDblClick = useCallback((e) => {
    const node = getNodeAt(e.clientX, e.clientY)
    if (node) onEdit(node)
  }, [getNodeAt, onEdit])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(z => {
      const newZ = Math.min(Math.max(z * delta, 0.2), 3)
      return newZ
    })
  }, [setZoom])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedId && selectedId !== 'root') onDelete(selectedId)
    }
    if (e.key === 'n' || e.key === 'N') {
      if (selectedId) onAddChild(selectedId)
    }
    if (e.key === 'Escape') setSelectedId(null)
    if (e.key === 'Enter' && selectedId) {
      const layout = layoutRef.current
      if (layout) {
        const nodes = flattenTree(layout)
        const node = nodes.find(n => n.id === selectedId)
        if (node) onEdit(node)
      }
    }
  }, [selectedId, onDelete, onAddChild, setSelectedId, onEdit])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Context menu on right click
  const handleContextMenu = useCallback((e) => {
    e.preventDefault()
    const node = getNodeAt(e.clientX, e.clientY)
    if (node) {
      setSelectedId(node.id)
      onEdit(node)
    }
  }, [getNodeAt, setSelectedId, onEdit])

  return (
    <div className="mindmap-container">
      <canvas
        ref={canvasRef}
        className="mindmap-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDblClick}
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
      />
      {selectedId && selectedId !== 'root' && (
        <div className="node-actions">
          <button onClick={() => onAddChild(selectedId)}>+ Qo'shish</button>
          <button onClick={() => {
            const nodes = flattenTree(layoutRef.current)
            const node = nodes.find(n => n.id === selectedId)
            if (node) onEdit(node)
          }}>✏ Tahrirlash</button>
          <button className="del-btn" onClick={() => onDelete(selectedId)}>✕ O'chirish</button>
        </div>
      )}
    </div>
  )
})

export default MindMap
