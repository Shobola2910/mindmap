import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle, useState } from 'react'
import './MindMap.css'

// Layout constants
const NODE_W = 200
const NODE_H = 40
const ROOT_W = 180
const ROOT_H = 52
const H_GAP = 80
const V_GAP = 10

// --- Tree layout ---
function calcHeights(node) {
  if (!node.children || node.children.length === 0) {
    node._height = NODE_H
    return
  }
  node.children.forEach(calcHeights)
  const childTotal = node.children.reduce((s, c) => s + c._height, 0) + V_GAP * (node.children.length - 1)
  node._height = Math.max(node._depth === 0 ? ROOT_H : NODE_H, childTotal)
}

function assignDepths(node, depth = 0) {
  node._depth = depth
  ;(node.children || []).forEach(c => assignDepths(c, depth + 1))
}

function placeNodes(node, x, y) {
  const selfH = node._depth === 0 ? ROOT_H : NODE_H
  const selfW = node._depth === 0 ? ROOT_W : NODE_W
  
  node._x = x
  node._y = y + node._height / 2 - selfH / 2
  node._cy = y + node._height / 2
  node._w = selfW
  node._h = selfH

  if (!node.children || node.children.length === 0) return

  let childY = y
  const childX = x + selfW + H_GAP

  node.children.forEach(child => {
    placeNodes(child, childX, childY)
    childY += child._height + V_GAP
  })
}

function buildLayout(data) {
  const clone = JSON.parse(JSON.stringify(data))
  assignDepths(clone)
  calcHeights(clone)
  placeNodes(clone, 0, 0)
  return clone
}

function flatten(node, acc = []) {
  acc.push(node)
  ;(node.children || []).forEach(c => flatten(c, acc))
  return acc
}

function hexToRgb(hex) {
  if (!hex || hex.length < 7) return { r: 99, g: 102, b: 241 }
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

// --- Component ---
const MindMap = forwardRef(function MindMap({
  data, zoom, pan, selectedId,
  setZoom, setPan, setSelectedId,
  onEdit, onAddChild, onDelete
}, ref) {
  const canvasRef = useRef(null)
  const layoutRef = useRef(null)
  const [hovered, setHovered] = useState(null)
  const hovRef = useRef(null)
  const isPanning = useRef(false)
  const panStart = useRef({ x: 0, y: 0, px: 0, py: 0 })

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current
  }))

  // Rebuild layout when data changes
  useEffect(() => {
    layoutRef.current = buildLayout(data)
  }, [data])

  // Initial layout
  useEffect(() => {
    layoutRef.current = buildLayout(data)
  }, [])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const layout = layoutRef.current
    if (!layout) return

    const dpr = window.devicePixelRatio || 1
    const W = canvas.clientWidth
    const H = canvas.clientHeight

    if (W === 0 || H === 0) return

    canvas.width = W * dpr
    canvas.height = H * dpr

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const dark = document.documentElement.getAttribute('data-theme') !== 'light'

    // Background
    ctx.fillStyle = dark ? '#0d0d0f' : '#f5f4f0'
    ctx.fillRect(0, 0, W, H)

    // Dot grid
    const gs = 30 * zoom
    const ox = ((pan.x * zoom) % gs + gs) % gs + W / 2 - (W / 2 % gs)
    const oy = ((pan.y * zoom) % gs + gs) % gs + H / 2 - (H / 2 % gs)
    ctx.fillStyle = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'
    for (let gx = ox % gs; gx < W; gx += gs) {
      for (let gy = oy % gs; gy < H; gy += gs) {
        ctx.beginPath(); ctx.arc(gx, gy, 1.2, 0, Math.PI * 2); ctx.fill()
      }
    }

    ctx.save()
    // Center + pan + zoom
    ctx.translate(W / 2 + pan.x * zoom, H / 2 + pan.y * zoom)
    ctx.scale(zoom, zoom)

    const nodes = flatten(layout)

    // --- Draw edges ---
    nodes.forEach(node => {
      if (!node.children || node.children.length === 0) return
      node.children.forEach(child => {
        const x1 = node._x + node._w
        const y1 = node._cy
        const x2 = child._x
        const y2 = child._cy
        const cp = (x1 + x2) / 2

        const { r, g, b } = hexToRgb(child.color)
        const sel = selectedId === child.id || selectedId === node.id
        const alpha = selectedId && !sel ? 0.2 : 0.55

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.bezierCurveTo(cp, y1, cp, y2, x2, y2)
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.lineWidth = sel ? 2 : 1.2
        ctx.stroke()
      })
    })

    // --- Draw nodes ---
    nodes.forEach(node => {
      const { _x: x, _y: y, _w: w, _h: h, _depth: depth } = node
      const color = node.color || '#6366f1'
      const { r, g, b } = hexToRgb(color)
      const isSel = selectedId === node.id
      const isHov = hovRef.current === node.id
      const isRoot = depth === 0
      const radius = isRoot ? 16 : 9

      // Shadow
      if (isSel) {
        ctx.shadowColor = `rgba(${r},${g},${b},0.6)`
        ctx.shadowBlur = 18
      }

      // Fill
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, radius)

      if (isRoot) {
        ctx.fillStyle = color
      } else if (isSel) {
        ctx.fillStyle = dark ? `rgba(${r},${g},${b},0.28)` : `rgba(${r},${g},${b},0.18)`
      } else if (isHov) {
        ctx.fillStyle = dark ? `rgba(${r},${g},${b},0.2)` : `rgba(${r},${g},${b},0.13)`
      } else {
        ctx.fillStyle = dark ? `rgba(${r},${g},${b},0.1)` : `rgba(${r},${g},${b},0.07)`
      }
      ctx.fill()

      ctx.shadowBlur = 0
      ctx.shadowColor = 'transparent'

      // Border
      ctx.strokeStyle = isSel
        ? `rgba(${r},${g},${b},1)`
        : isHov ? `rgba(${r},${g},${b},0.7)` : `rgba(${r},${g},${b},0.35)`
      ctx.lineWidth = isSel ? 2 : 1
      ctx.stroke()

      // Text
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (isRoot) {
        ctx.font = `700 14px 'Space Grotesk', sans-serif`
        ctx.fillStyle = '#ffffff'
        ctx.fillText(node.label, x + w / 2, y + h / 2 - 7)
        ctx.font = `400 9px 'JetBrains Mono', monospace`
        ctx.fillStyle = 'rgba(255,255,255,0.65)'
        ctx.fillText('Mind Map', x + w / 2, y + h / 2 + 9)
      } else {
        // choose text color
        const tc = isRoot ? '#fff'
          : dark ? `rgba(${Math.min(r + 130, 255)},${Math.min(g + 130, 255)},${Math.min(b + 130, 255)},0.95)`
          : `rgba(${Math.max(r - 60, 10)},${Math.max(g - 60, 10)},${Math.max(b - 60, 10)},0.95)`
        ctx.fillStyle = tc

        const maxW = w - 24
        let label = node.label
        ctx.font = `500 11.5px 'Space Grotesk', sans-serif`
        while (ctx.measureText(label).width > maxW && label.length > 5) {
          label = label.slice(0, -4) + '...'
        }
        ctx.fillText(label, x + w / 2, y + h / 2)
      }

      // depth dot
      if (depth > 0) {
        ctx.beginPath()
        ctx.arc(x + 9, y + h / 2, depth === 1 ? 3 : 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},0.7)`
        ctx.fill()
      }
    })

    ctx.restore()
  }, [zoom, pan, selectedId, hovered, data])

  // Render on every state change
  useEffect(() => {
    requestAnimationFrame(render)
  }, [render])

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(() => requestAnimationFrame(render))
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [render])

  // Hit test
  const nodeAt = useCallback((cx, cy) => {
    const canvas = canvasRef.current
    if (!canvas || !layoutRef.current) return null
    const W = canvas.clientWidth, H = canvas.clientHeight
    const mx = (cx - W / 2) / zoom - pan.x
    const my = (cy - H / 2) / zoom - pan.y
    const nodes = flatten(layoutRef.current)
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i]
      if (mx >= n._x && mx <= n._x + n._w && my >= n._y && my <= n._y + n._h) return n
    }
    return null
  }, [zoom, pan])

  const onMouseDown = useCallback(e => {
    if (e.button !== 0) return
    const rect = canvasRef.current.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const node = nodeAt(cx, cy)
    if (node) {
      setSelectedId(node.id)
    } else {
      setSelectedId(null)
      isPanning.current = true
      panStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }
    }
  }, [nodeAt, pan, setSelectedId])

  const onMouseMove = useCallback(e => {
    if (isPanning.current) {
      const dx = (e.clientX - panStart.current.x) / zoom
      const dy = (e.clientY - panStart.current.y) / zoom
      setPan({ x: panStart.current.px + dx, y: panStart.current.py + dy })
      return
    }
    const rect = canvasRef.current.getBoundingClientRect()
    const node = nodeAt(e.clientX - rect.left, e.clientY - rect.top)
    const nid = node?.id || null
    if (nid !== hovRef.current) {
      hovRef.current = nid
      setHovered(nid)
      canvasRef.current.style.cursor = nid ? 'pointer' : 'grab'
    }
  }, [nodeAt, zoom, setPan])

  const onMouseUp = useCallback(() => { isPanning.current = false }, [])

  const onDblClick = useCallback(e => {
    const rect = canvasRef.current.getBoundingClientRect()
    const node = nodeAt(e.clientX - rect.left, e.clientY - rect.top)
    if (node) onEdit(node)
  }, [nodeAt, onEdit])

  const onWheel = useCallback(e => {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.12 : 0.89
    setZoom(z => Math.min(Math.max(z * factor, 0.15), 4))
  }, [setZoom])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = e => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement.tagName === 'INPUT') return
        if (selectedId && selectedId !== 'root') onDelete(selectedId)
      }
      if ((e.key === 'n' || e.key === 'N') && selectedId) {
        if (document.activeElement.tagName === 'INPUT') return
        onAddChild(selectedId)
      }
      if (e.key === 'Escape') setSelectedId(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedId, onDelete, onAddChild, setSelectedId])

  return (
    <div className="mindmap-container">
      <canvas
        ref={canvasRef}
        className="mindmap-canvas"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onDoubleClick={onDblClick}
        onWheel={onWheel}
      />
      {selectedId && selectedId !== 'root' && (
        <div className="node-actions">
          <button onClick={() => onAddChild(selectedId)}>+ Node</button>
          <button onClick={() => {
            const n = flatten(layoutRef.current || {children:[]}).find(x => x.id === selectedId)
            if (n) onEdit(n)
          }}>✏ Edit</button>
          <button className="del-btn" onClick={() => onDelete(selectedId)}>✕ O'chir</button>
        </div>
      )}
    </div>
  )
})

export default MindMap
