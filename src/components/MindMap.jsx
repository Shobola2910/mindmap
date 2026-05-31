import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle, useState } from 'react'
import './MindMap.css'

const NODE_W = 200
const NODE_H = 40
const ROOT_W = 180
const ROOT_H = 52
const H_GAP = 80
const V_GAP = 10
const BTN_R = 9  // collapse button radius

function assignDepths(node, depth = 0) {
  node._depth = depth
  ;(node.children || []).forEach(c => assignDepths(c, depth + 1))
}

function calcHeights(node, collapsed) {
  const isCollapsed = collapsed.has(node.id)
  if (!node.children || node.children.length === 0 || isCollapsed) {
    node._height = node._depth === 0 ? ROOT_H : NODE_H
    return
  }
  node.children.forEach(c => calcHeights(c, collapsed))
  const childTotal = node.children.reduce((s, c) => s + c._height, 0) + V_GAP * (node.children.length - 1)
  node._height = Math.max(node._depth === 0 ? ROOT_H : NODE_H, childTotal)
}

function placeNodes(node, x, y, collapsed) {
  const selfH = node._depth === 0 ? ROOT_H : NODE_H
  const selfW = node._depth === 0 ? ROOT_W : NODE_W
  node._x = x
  node._y = y + node._height / 2 - selfH / 2
  node._cy = y + node._height / 2
  node._w = selfW
  node._h = selfH

  const isCollapsed = collapsed.has(node.id)
  if (!node.children || node.children.length === 0 || isCollapsed) return

  let childY = y
  const childX = x + selfW + H_GAP
  node.children.forEach(child => {
    placeNodes(child, childX, childY, collapsed)
    childY += child._height + V_GAP
  })
}

function buildLayout(data, collapsed) {
  const clone = JSON.parse(JSON.stringify(data))
  assignDepths(clone)
  calcHeights(clone, collapsed)
  placeNodes(clone, 0, 0, collapsed)
  return clone
}

function flatten(node, acc = []) {
  acc.push(node)
  ;(node.children || []).forEach(c => flatten(c, acc))
  return acc
}

function hexToRgb(hex) {
  if (!hex || hex.length < 7) return { r: 99, g: 102, b: 241 }
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  }
}

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
  const [collapsed, setCollapsed] = useState(new Set())

  useImperativeHandle(ref, () => ({ getCanvas: () => canvasRef.current }))

  // Rebuild layout
  useEffect(() => {
    layoutRef.current = buildLayout(data, collapsed)
  }, [data, collapsed])

  useEffect(() => {
    layoutRef.current = buildLayout(data, collapsed)
  }, [])

  const toggleCollapse = useCallback((id) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // Expand all / collapse all (exposed via ref)
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    expandAll: () => setCollapsed(new Set()),
    collapseAll: () => {
      const layout = layoutRef.current
      if (!layout) return
      const ids = new Set()
      function collectIds(n) {
        if (n.children && n.children.length > 0) {
          ids.add(n.id)
          n.children.forEach(collectIds)
        }
      }
      collectIds(layout)
      setCollapsed(ids)
    }
  }), [])

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
    ctx.fillStyle = dark ? '#0d0d0f' : '#f5f4f0'
    ctx.fillRect(0, 0, W, H)

    // Dot grid
    const gs = 30 * zoom
    const ox = ((pan.x * zoom) % gs + gs) % gs
    const oy = ((pan.y * zoom) % gs + gs) % gs
    ctx.fillStyle = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'
    for (let gx = ox % gs; gx < W; gx += gs)
      for (let gy = oy % gs; gy < H; gy += gs) {
        ctx.beginPath(); ctx.arc(gx, gy, 1.2, 0, Math.PI * 2); ctx.fill()
      }

    ctx.save()
    ctx.translate(W / 2 + pan.x * zoom, H / 2 + pan.y * zoom)
    ctx.scale(zoom, zoom)

    // Only draw visible (not collapsed) nodes
    const allNodes = flatten(layout)
    const visibleNodes = allNodes.filter(n => n._x !== undefined)

    // Edges
    visibleNodes.forEach(node => {
      if (!node.children || node.children.length === 0) return
      if (collapsed.has(node.id)) return
      node.children.forEach(child => {
        if (child._x === undefined) return
        const x1 = node._x + node._w
        const y1 = node._cy
        const x2 = child._x
        const y2 = child._cy
        const cp = (x1 + x2) / 2
        const { r, g, b } = hexToRgb(child.color)
        const sel = selectedId === child.id || selectedId === node.id
        const alpha = selectedId && !sel ? 0.18 : 0.55
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.bezierCurveTo(cp, y1, cp, y2, x2, y2)
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.lineWidth = sel ? 2 : 1.2
        ctx.stroke()
      })
    })

    // Nodes
    visibleNodes.forEach(node => {
      const { _x: x, _y: y, _w: w, _h: h, _depth: depth } = node
      const color = node.color || '#6366f1'
      const { r, g, b } = hexToRgb(color)
      const isSel = selectedId === node.id
      const isHov = hovRef.current === node.id
      const isRoot = depth === 0
      const isCollapsed = collapsed.has(node.id)
      const hasChildren = node.children && node.children.length > 0
      const radius = isRoot ? 16 : 9

      if (isSel) { ctx.shadowColor = `rgba(${r},${g},${b},0.6)`; ctx.shadowBlur = 18 }

      ctx.beginPath()
      ctx.roundRect(x, y, w, h, radius)

      if (isRoot) ctx.fillStyle = color
      else if (isSel) ctx.fillStyle = dark ? `rgba(${r},${g},${b},0.28)` : `rgba(${r},${g},${b},0.18)`
      else if (isHov) ctx.fillStyle = dark ? `rgba(${r},${g},${b},0.2)` : `rgba(${r},${g},${b},0.13)`
      else ctx.fillStyle = dark ? `rgba(${r},${g},${b},0.1)` : `rgba(${r},${g},${b},0.07)`
      ctx.fill()

      ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'
      ctx.strokeStyle = isSel ? `rgba(${r},${g},${b},1)` : isHov ? `rgba(${r},${g},${b},0.7)` : `rgba(${r},${g},${b},0.35)`
      ctx.lineWidth = isSel ? 2 : 1
      ctx.stroke()

      // Text
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      if (isRoot) {
        ctx.font = `700 14px 'Space Grotesk', sans-serif`
        ctx.fillStyle = '#ffffff'
        ctx.fillText(node.label, x + w / 2, y + h / 2 - 7)
        ctx.font = `400 9px 'JetBrains Mono', monospace`
        ctx.fillStyle = 'rgba(255,255,255,0.65)'
        ctx.fillText('Mind Map', x + w / 2, y + h / 2 + 9)
      } else {
        const tc = dark
          ? `rgba(${Math.min(r + 130, 255)},${Math.min(g + 130, 255)},${Math.min(b + 130, 255)},0.95)`
          : `rgba(${Math.max(r - 60, 10)},${Math.max(g - 60, 10)},${Math.max(b - 60, 10)},0.95)`
        ctx.fillStyle = tc
        const maxW = w - 24 - (hasChildren ? BTN_R * 2 + 8 : 0)
        let label = node.label
        ctx.font = `500 11.5px 'Space Grotesk', sans-serif`
        while (ctx.measureText(label).width > maxW && label.length > 5)
          label = label.slice(0, -4) + '...'
        ctx.fillText(label, x + w / 2 - (hasChildren ? BTN_R : 0), y + h / 2)
      }

      // Depth dot
      if (depth > 0) {
        ctx.beginPath()
        ctx.arc(x + 9, y + h / 2, depth === 1 ? 3 : 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},0.7)`
        ctx.fill()
      }

      // +/- collapse button
      if (hasChildren) {
        const bx = x + w - BTN_R - 6
        const by = y + h / 2
        // Circle bg
        ctx.beginPath(); ctx.arc(bx, by, BTN_R, 0, Math.PI * 2)
        ctx.fillStyle = isRoot ? 'rgba(255,255,255,0.2)' : dark ? `rgba(${r},${g},${b},0.22)` : `rgba(${r},${g},${b},0.15)`
        ctx.fill()
        ctx.strokeStyle = isRoot ? 'rgba(255,255,255,0.5)' : `rgba(${r},${g},${b},0.6)`
        ctx.lineWidth = 1.2
        ctx.stroke()
        // +/- symbol
        ctx.strokeStyle = isRoot ? '#fff' : tc || `rgba(${r},${g},${b},0.9)`
        ctx.lineWidth = 1.8
        ctx.lineCap = 'round'
        // horizontal bar
        ctx.beginPath(); ctx.moveTo(bx - 4.5, by); ctx.lineTo(bx + 4.5, by); ctx.stroke()
        // vertical bar (only when collapsed)
        if (isCollapsed) {
          ctx.beginPath(); ctx.moveTo(bx, by - 4.5); ctx.lineTo(bx, by + 4.5); ctx.stroke()
        }
        // child count badge when collapsed
        if (isCollapsed) {
          const count = node.children.length
          const bx2 = x + w + 14
          const by2 = y + h / 2
          ctx.beginPath(); ctx.arc(bx2, by2, 9, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r},${g},${b},0.85)`
          ctx.fill()
          ctx.font = `700 9px 'Space Grotesk', sans-serif`
          ctx.fillStyle = '#fff'
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
          ctx.fillText(count, bx2, by2)
        }
      }
    })

    ctx.restore()
  }, [zoom, pan, selectedId, hovered, data, collapsed])

  useEffect(() => { requestAnimationFrame(render) }, [render])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(() => requestAnimationFrame(render))
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [render])

  const nodeAt = useCallback((cx, cy) => {
    const canvas = canvasRef.current
    if (!canvas || !layoutRef.current) return null
    const W = canvas.clientWidth, H = canvas.clientHeight
    const mx = (cx - W / 2) / zoom - pan.x
    const my = (cy - H / 2) / zoom - pan.y
    const nodes = flatten(layoutRef.current).filter(n => n._x !== undefined)
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i]
      if (mx >= n._x && mx <= n._x + n._w && my >= n._y && my <= n._y + n._h) return n
    }
    return null
  }, [zoom, pan])

  // Check if click is on the +/- button
  const isOnCollapseBtn = useCallback((node, cx, cy) => {
    const canvas = canvasRef.current
    if (!canvas) return false
    if (!node.children || node.children.length === 0) return false
    const W = canvas.clientWidth, H = canvas.clientHeight
    const mx = (cx - W / 2) / zoom - pan.x
    const my = (cy - H / 2) / zoom - pan.y
    const bx = node._x + node._w - BTN_R - 6
    const by = node._cy
    return Math.hypot(mx - bx, my - by) <= BTN_R + 2
  }, [zoom, pan])

  const onMouseDown = useCallback(e => {
    if (e.button !== 0) return
    const rect = canvasRef.current.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const node = nodeAt(cx, cy)
    if (node) {
      if (isOnCollapseBtn(node, cx, cy)) {
        toggleCollapse(node.id)
        return
      }
      setSelectedId(node.id)
    } else {
      setSelectedId(null)
      isPanning.current = true
      panStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }
    }
  }, [nodeAt, isOnCollapseBtn, toggleCollapse, pan, setSelectedId])

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
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const node = nodeAt(cx, cy)
    if (node && !isOnCollapseBtn(node, cx, cy)) onEdit(node)
  }, [nodeAt, isOnCollapseBtn, onEdit])

  const onWheel = useCallback(e => {
    e.preventDefault()
    setZoom(z => Math.min(Math.max(z * (e.deltaY < 0 ? 1.12 : 0.89), 0.15), 4))
  }, [setZoom])

  useEffect(() => {
    const h = e => {
      if (document.activeElement.tagName === 'INPUT') return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId && selectedId !== 'root') onDelete(selectedId)
      }
      if ((e.key === 'n' || e.key === 'N') && selectedId) onAddChild(selectedId)
      if (e.key === 'Escape') setSelectedId(null)
      if (e.key === ' ' && selectedId) {
        e.preventDefault()
        toggleCollapse(selectedId)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [selectedId, onDelete, onAddChild, setSelectedId, toggleCollapse])

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
            const n = flatten(layoutRef.current || { children: [] }).find(x => x.id === selectedId)
            if (n) onEdit(n)
          }}>✏ Edit</button>
          <button onClick={() => toggleCollapse(selectedId)}>
            {collapsed.has(selectedId) ? '▶ Ochish' : '▼ Yopish'}
          </button>
          <button className="del-btn" onClick={() => onDelete(selectedId)}>✕ O'chir</button>
        </div>
      )}
    </div>
  )
})

export default MindMap
