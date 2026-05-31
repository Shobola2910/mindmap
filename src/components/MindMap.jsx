import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle, useState } from 'react'
import './MindMap.css'

// ─── constants ───────────────────────────────────────────────
const NW = 190   // node width
const NH = 38    // node height
const RW = 160   // root width
const RH = 50    // root height
const HGAP = 70  // horizontal gap between levels
const VGAP = 8   // vertical gap between siblings
const BR = 8     // collapse button radius

// ─── helpers ─────────────────────────────────────────────────
function hex2rgb(hex = '#6366f1') {
  const c = hex.replace('#', '')
  if (c.length < 6) return [99, 102, 241]
  return [
    parseInt(c.slice(0,2), 16),
    parseInt(c.slice(2,4), 16),
    parseInt(c.slice(4,6), 16),
  ]
}

// ─── tree layout (pure functions) ────────────────────────────
// Step 1: assign depth
function setDepth(node, d = 0) {
  node.d = d
  ;(node.children || []).forEach(c => setDepth(c, d + 1))
}

// Step 2: compute total height (considering collapsed)
function totalH(node, col) {
  const self = node.d === 0 ? RH : NH
  if (!node.children || node.children.length === 0 || col.has(node.id)) {
    node._th = self
    return
  }
  node.children.forEach(c => totalH(c, col))
  const sum = node.children.reduce((s, c) => s + c._th, 0) + VGAP * (node.children.length - 1)
  node._th = Math.max(self, sum)
}

// Step 3: assign x/y positions
function layout(node, x, y, col) {
  const sw = node.d === 0 ? RW : NW
  const sh = node.d === 0 ? RH : NH
  node._x = x
  node._y = y + node._th / 2 - sh / 2
  node._cy = y + node._th / 2

  if (!node.children || node.children.length === 0 || col.has(node.id)) return
  let cy = y
  node.children.forEach(c => {
    layout(c, x + sw + HGAP, cy, col)
    cy += c._th + VGAP
  })
}

// Step 4: flatten all nodes (only laid-out ones)
function flat(node, arr = []) {
  arr.push(node)
  if (!col_cache.has(node.id)) {
    ;(node.children || []).forEach(c => flat(c, arr))
  }
  return arr
}

// We need collapsed set accessible in flat — use closure approach
function flatNodes(node, col, arr = []) {
  arr.push(node)
  if (!col.has(node.id)) {
    ;(node.children || []).forEach(c => flatNodes(c, col, arr))
  }
  return arr
}

let col_cache = new Set()

function buildLayout(data, col) {
  col_cache = col
  const tree = JSON.parse(JSON.stringify(data))
  setDepth(tree)
  totalH(tree, col)
  layout(tree, 0, -tree._th / 2, col)
  return tree
}

// ─── component ───────────────────────────────────────────────
const MindMap = forwardRef(function MindMap(
  { data, zoom, pan, selectedId, setZoom, setPan, setSelectedId, onEdit, onAddChild, onDelete },
  ref
) {
  const cvs = useRef(null)
  const treeRef = useRef(null)
  // Boshlanganda faqat root bolalari yopiq — faqat ALGO GROUP ko'rinadi
  const [collapsed, setCollapsed] = useState(() => {
    const ids = new Set()
    ;(data.children || []).forEach(c => ids.add(c.id))
    return ids
  })
  const [hov, setHov] = useState(null)
  const hovRef = useRef(null)
  const panning = useRef(false)
  const ps = useRef({ x:0, y:0, px:0, py:0 })
  const colRef = useRef(collapsed)
  colRef.current = collapsed

  // expose methods
  useImperativeHandle(ref, () => ({
    getCanvas: () => cvs.current,
    expandAll: () => setCollapsed(new Set()),
    collapseAll: () => {
      const ids = new Set()
      function collect(n) {
        if (n.children && n.children.length > 0) {
          ids.add(n.id)
          n.children.forEach(collect)
        }
      }
      collect(data)
      setCollapsed(ids)
    },

    // Render full map to an offscreen canvas at given scale, returns canvas
    renderOffscreen: (scale = 2) => {
      const tree = treeRef.current
      if (!tree) return null
      const col = colRef.current
      const nodes = flatNodes(tree, col)

      // compute bounding box
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      nodes.forEach(n => {
        const w = n.d === 0 ? RW : NW
        const h = n.d === 0 ? RH : NH
        minX = Math.min(minX, n._x)
        minY = Math.min(minY, n._y)
        maxX = Math.max(maxX, n._x + w)
        maxY = Math.max(maxY, n._y + h)
        // include badge
        if (col.has(n.id)) maxX = Math.max(maxX, n._x + (n.d === 0 ? RW : NW) + 28)
      })

      const PAD = 60
      const mapW = maxX - minX + PAD * 2
      const mapH = maxY - minY + PAD * 2

      const oc = document.createElement('canvas')
      oc.width  = mapW * scale
      oc.height = mapH * scale
      const ctx = oc.getContext('2d')
      ctx.scale(scale, scale)

      const dark = document.documentElement.dataset.theme !== 'light'
      ctx.fillStyle = dark ? '#0d0d0f' : '#f5f4f0'
      ctx.fillRect(0, 0, mapW, mapH)

      // offset so minX/minY maps to PAD
      const ox = -minX + PAD
      const oy = -minY + PAD
      ctx.save()
      ctx.translate(ox, oy)

      // edges
      nodes.forEach(n => {
        if (!n.children || n.children.length === 0 || col.has(n.id)) return
        const [r,g,b] = hex2rgb(n.color)
        const x1 = n._x + (n.d === 0 ? RW : NW)
        const y1 = n._cy
        n.children.forEach(c => {
          const mx = (x1 + c._x) / 2
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.bezierCurveTo(mx, y1, mx, c._cy, c._x, c._cy)
          ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`
          ctx.lineWidth = 1.1
          ctx.stroke()
        })
      })

      // nodes
      nodes.forEach(n => {
        const isRoot = n.d === 0
        const w = isRoot ? RW : NW
        const h = isRoot ? RH : NH
        const x = n._x, y = n._y
        const col_ = n.color || '#6366f1'
        const [r,g,b] = hex2rgb(col_)
        const hasCh = n.children && n.children.length > 0
        const isCol = col.has(n.id)

        ctx.beginPath()
        ctx.roundRect(x, y, w, h, isRoot ? 14 : 8)
        if (isRoot) ctx.fillStyle = col_
        else ctx.fillStyle = dark ? `rgba(${r},${g},${b},0.12)` : `rgba(${r},${g},${b},0.09)`
        ctx.fill()
        ctx.strokeStyle = `rgba(${r},${g},${b},0.4)`
        ctx.lineWidth = 1
        ctx.stroke()

        // label
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        const btnsz = hasCh ? BR * 2 + 8 : 0
        if (isRoot) {
          ctx.font = "bold 13px 'Space Grotesk',sans-serif"
          ctx.fillStyle = '#fff'
          ctx.fillText(n.label, x + w/2, y + h/2 - 6)
          ctx.font = "400 9px 'JetBrains Mono',monospace"
          ctx.fillStyle = 'rgba(255,255,255,0.6)'
          ctx.fillText('ALGO Mind Map', x + w/2, y + h/2 + 8)
        } else {
          const tc = dark
            ? `rgb(${Math.min(r+130,255)},${Math.min(g+130,255)},${Math.min(b+130,255)})`
            : `rgb(${Math.max(r-50,0)},${Math.max(g-50,0)},${Math.max(b-50,0)})`
          ctx.font = "500 11px 'Space Grotesk',sans-serif"
          ctx.fillStyle = tc
          const maxW = w - 20 - btnsz
          let lbl = n.label
          while (ctx.measureText(lbl).width > maxW && lbl.length > 4)
            lbl = lbl.slice(0, -4) + '…'
          ctx.fillText(lbl, x + (w - btnsz)/2, y + h/2)
        }

        if (!isRoot) {
          ctx.beginPath()
          ctx.arc(x + 8, y + h/2, n.d === 1 ? 3 : 2, 0, Math.PI*2)
          ctx.fillStyle = `rgba(${r},${g},${b},0.65)`
          ctx.fill()
        }

        if (hasCh) {
          const bx = x + w - BR - 5
          const by = y + h/2
          ctx.beginPath(); ctx.arc(bx, by, BR, 0, Math.PI*2)
          ctx.fillStyle = isRoot ? 'rgba(255,255,255,0.18)' : dark ? `rgba(${r},${g},${b},0.2)` : `rgba(${r},${g},${b},0.14)`
          ctx.fill()
          ctx.strokeStyle = isRoot ? 'rgba(255,255,255,0.45)' : `rgba(${r},${g},${b},0.55)`
          ctx.lineWidth = 1.2; ctx.stroke()
          const sym = isRoot ? '#fff' : dark
            ? `rgb(${Math.min(r+130,255)},${Math.min(g+130,255)},${Math.min(b+130,255)})`
            : `rgb(${Math.max(r-50,0)},${Math.max(g-50,0)},${Math.max(b-50,0)})`
          ctx.strokeStyle = sym; ctx.lineWidth = 1.8; ctx.lineCap = 'round'
          ctx.beginPath(); ctx.moveTo(bx-4, by); ctx.lineTo(bx+4, by); ctx.stroke()
          if (isCol) {
            ctx.beginPath(); ctx.moveTo(bx, by-4); ctx.lineTo(bx, by+4); ctx.stroke()
            const bx2 = x + w + 14
            ctx.beginPath(); ctx.arc(bx2, by, 9, 0, Math.PI*2)
            ctx.fillStyle = `rgba(${r},${g},${b},0.8)`; ctx.fill()
            ctx.font = "bold 8px 'Space Grotesk',sans-serif"
            ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillText(String(n.children.length), bx2, by)
          }
        }
      })
      ctx.restore()
      return oc
    }
  }), [data, collapsed])

  // rebuild layout when data or collapsed changes
  useEffect(() => {
    treeRef.current = buildLayout(data, collapsed)
  }, [data, collapsed])

  // initial build — root bolalari yopiq boshlanadi
  useEffect(() => {
    const initCol = new Set()
    ;(data.children || []).forEach(ch => initCol.add(ch.id))
    treeRef.current = buildLayout(data, initCol)
  }, [])

  // Nodeni ochganda uning BEVOSITA bolalarini yopib qo'yamiz
  // Shunda galma-gal darajama-daraja ochiladi
  const toggle = useCallback((id) => {
    setCollapsed(prev => {
      const s = new Set(prev)
      if (s.has(id)) {
        // Yopish — shunchaki o'chirish
        s.delete(id)
      } else {
        // Ochish — bolalarini ham yopib qo'yish (agar ochiq bo'lsa)
        s.add(id)
      }
      return s
    })
  }, [])

  // Nodeni ochganda uning to'g'ridan-to'g'ri bolalarini yopiq qilish
  // data ichidan id bo'yicha node topib, bolalarini collapse qiladi
  const openNode = useCallback((id) => {
    // data tree ichidan id bo'yicha node topamiz
    function findNode(n) {
      if (n.id === id) return n
      for (const c of (n.children || [])) {
        const f = findNode(c)
        if (f) return f
      }
      return null
    }
    const node = findNode(data)
    setCollapsed(prev => {
      const s = new Set(prev)
      // o'zini ochamiz
      s.delete(id)
      // bolalarini yopamiz (faqat bevosita bolalar)
      ;(node?.children || []).forEach(c => {
        if (c.children && c.children.length > 0) s.add(c.id)
      })
      return s
    })
  }, [data])

  // ─── DRAW ────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = cvs.current
    if (!canvas) return
    const tree = treeRef.current
    if (!tree) return

    const dpr = window.devicePixelRatio || 1
    const CW = canvas.clientWidth
    const CH = canvas.clientHeight
    if (CW === 0 || CH === 0) return

    canvas.width  = CW * dpr
    canvas.height = CH * dpr

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const dark = document.documentElement.dataset.theme !== 'light'

    // background
    ctx.fillStyle = dark ? '#0d0d0f' : '#f5f4f0'
    ctx.fillRect(0, 0, CW, CH)

    // dot grid
    const gs = 28 * zoom
    const ox = ((pan.x * zoom % gs) + gs) % gs
    const oy = ((pan.y * zoom % gs) + gs) % gs
    ctx.fillStyle = dark ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.045)'
    for (let gx = ox; gx < CW; gx += gs)
      for (let gy = oy; gy < CH; gy += gs) {
        ctx.beginPath()
        ctx.arc(gx, gy, 1.1, 0, Math.PI * 2)
        ctx.fill()
      }

    // world transform: origin at screen center + pan
    ctx.save()
    ctx.translate(CW / 2 + pan.x * zoom, CH / 2 + pan.y * zoom)
    ctx.scale(zoom, zoom)

    const col = colRef.current
    const nodes = flatNodes(tree, col)

    // ── edges ──
    nodes.forEach(n => {
      if (!n.children || n.children.length === 0 || col.has(n.id)) return
      const [r,g,b] = hex2rgb(n.color)
      const x1 = n._x + (n.d === 0 ? RW : NW)
      const y1 = n._cy
      n.children.forEach(c => {
        const x2 = c._x
        const y2 = c._cy
        const mx = (x1 + x2) / 2
        const sel = selectedId === n.id || selectedId === c.id
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.bezierCurveTo(mx, y1, mx, y2, x2, y2)
        ctx.strokeStyle = `rgba(${r},${g},${b},${selectedId && !sel ? 0.15 : 0.55})`
        ctx.lineWidth = sel ? 1.8 : 1.1
        ctx.stroke()
      })
    })

    // ── nodes ──
    nodes.forEach(n => {
      const isRoot = n.d === 0
      const w = isRoot ? RW : NW
      const h = isRoot ? RH : NH
      const x = n._x, y = n._y
      const col_  = n.color || '#6366f1'
      const [r,g,b] = hex2rgb(col_)
      const sel = selectedId === n.id
      const hv  = hovRef.current === n.id
      const hasCh = n.children && n.children.length > 0
      const isCol = collapsed.has(n.id)

      // shadow
      if (sel) {
        ctx.shadowColor = `rgba(${r},${g},${b},0.55)`
        ctx.shadowBlur  = 16
      }

      // fill
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, isRoot ? 14 : 8)
      if (isRoot)     ctx.fillStyle = col_
      else if (sel)   ctx.fillStyle = dark ? `rgba(${r},${g},${b},0.26)` : `rgba(${r},${g},${b},0.18)`
      else if (hv)    ctx.fillStyle = dark ? `rgba(${r},${g},${b},0.18)` : `rgba(${r},${g},${b},0.12)`
      else            ctx.fillStyle = dark ? `rgba(${r},${g},${b},0.1)`  : `rgba(${r},${g},${b},0.07)`
      ctx.fill()

      ctx.shadowBlur  = 0
      ctx.shadowColor = 'transparent'

      // border
      ctx.strokeStyle = sel  ? `rgba(${r},${g},${b},1)` :
                        hv   ? `rgba(${r},${g},${b},0.7)` :
                               `rgba(${r},${g},${b},0.32)`
      ctx.lineWidth = sel ? 1.8 : 1
      ctx.stroke()

      // label
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'
      const btnsz = hasCh ? BR * 2 + 8 : 0

      if (isRoot) {
        ctx.font      = "bold 13px 'Space Grotesk',sans-serif"
        ctx.fillStyle = '#fff'
        ctx.fillText(n.label, x + w / 2, y + h / 2 - 6)
        ctx.font      = "400 9px 'JetBrains Mono',monospace"
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.fillText('ALGO Mind Map', x + w / 2, y + h / 2 + 8)
      } else {
        const tc = dark
          ? `rgb(${Math.min(r+130,255)},${Math.min(g+130,255)},${Math.min(b+130,255)})`
          : `rgb(${Math.max(r-50,0)},${Math.max(g-50,0)},${Math.max(b-50,0)})`
        ctx.font      = "500 11px 'Space Grotesk',sans-serif"
        ctx.fillStyle = tc
        const maxW = w - 20 - btnsz
        let lbl = n.label
        while (ctx.measureText(lbl).width > maxW && lbl.length > 4)
          lbl = lbl.slice(0, -4) + '…'
        ctx.fillText(lbl, x + (w - btnsz) / 2, y + h / 2)
      }

      // depth dot
      if (!isRoot) {
        ctx.beginPath()
        ctx.arc(x + 8, y + h / 2, n.d === 1 ? 3 : 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},0.65)`
        ctx.fill()
      }

      // collapse button (+/-)
      if (hasCh) {
        const bx = x + w - BR - 5
        const by = y + h / 2

        // circle bg
        ctx.beginPath()
        ctx.arc(bx, by, BR, 0, Math.PI * 2)
        ctx.fillStyle = isRoot
          ? 'rgba(255,255,255,0.18)'
          : dark ? `rgba(${r},${g},${b},0.2)` : `rgba(${r},${g},${b},0.14)`
        ctx.fill()
        ctx.strokeStyle = isRoot ? 'rgba(255,255,255,0.45)' : `rgba(${r},${g},${b},0.55)`
        ctx.lineWidth = 1.2
        ctx.stroke()

        // bar symbol
        const sym = isRoot ? '#fff' :
          dark ? `rgb(${Math.min(r+130,255)},${Math.min(g+130,255)},${Math.min(b+130,255)})`
               : `rgb(${Math.max(r-50,0)},${Math.max(g-50,0)},${Math.max(b-50,0)})`
        ctx.strokeStyle = sym
        ctx.lineWidth   = 1.8
        ctx.lineCap     = 'round'

        // − always
        ctx.beginPath()
        ctx.moveTo(bx - 4, by)
        ctx.lineTo(bx + 4, by)
        ctx.stroke()

        // | only when collapsed (= + symbol)
        if (isCol) {
          ctx.beginPath()
          ctx.moveTo(bx, by - 4)
          ctx.lineTo(bx, by + 4)
          ctx.stroke()
        }

        // badge when collapsed
        if (isCol) {
          const cnt = n.children.length
          const bx2 = x + w + 14
          const by2 = y + h / 2
          ctx.beginPath()
          ctx.arc(bx2, by2, 9, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r},${g},${b},0.8)`
          ctx.fill()
          ctx.font      = "bold 8px 'Space Grotesk',sans-serif"
          ctx.fillStyle = '#fff'
          ctx.textAlign    = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(String(cnt), bx2, by2)
        }
      }
    })

    ctx.restore()
  }, [zoom, pan, selectedId, hov, data, collapsed])

  // redraw on any dep change
  useEffect(() => { requestAnimationFrame(draw) }, [draw])

  // resize observer
  useEffect(() => {
    if (!cvs.current) return
    const ro = new ResizeObserver(() => requestAnimationFrame(draw))
    ro.observe(cvs.current)
    return () => ro.disconnect()
  }, [draw])

  // ─── hit test ────────────────────────────────────────────────
  const hitNode = useCallback((ex, ey) => {
    if (!cvs.current || !treeRef.current) return null
    const W = cvs.current.clientWidth
    const H = cvs.current.clientHeight
    const wx = (ex - W/2) / zoom - pan.x
    const wy = (ey - H/2) / zoom - pan.y
    const nodes = flatNodes(treeRef.current, colRef.current)
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i]
      const w = n.d === 0 ? RW : NW
      const h = n.d === 0 ? RH : NH
      if (wx >= n._x && wx <= n._x + w && wy >= n._y && wy <= n._y + h)
        return n
    }
    return null
  }, [zoom, pan])

  const onBtn = useCallback((n, ex, ey) => {
    if (!n.children || !n.children.length) return false
    const W = cvs.current.clientWidth
    const H = cvs.current.clientHeight
    const wx = (ex - W/2) / zoom - pan.x
    const wy = (ey - H/2) / zoom - pan.y
    const w = n.d === 0 ? RW : NW
    const bx = n._x + w - BR - 5
    const by = n._cy
    return Math.hypot(wx - bx, wy - by) <= BR + 3
  }, [zoom, pan])

  // ─── events ──────────────────────────────────────────────────
  const onDown = useCallback(e => {
    if (e.button !== 0) return
    const rect = cvs.current.getBoundingClientRect()
    const ex = e.clientX - rect.left
    const ey = e.clientY - rect.top
    const n = hitNode(ex, ey)
    if (n) {
      if (onBtn(n, ex, ey)) { colRef.current.has(n.id) ? openNode(n.id) : toggle(n.id); return }
      setSelectedId(n.id)
    } else {
      setSelectedId(null)
      panning.current = true
      ps.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }
    }
  }, [hitNode, onBtn, toggle, openNode, pan, setSelectedId])

  const onMove = useCallback(e => {
    if (panning.current) {
      const dx = (e.clientX - ps.current.x) / zoom
      const dy = (e.clientY - ps.current.y) / zoom
      setPan({ x: ps.current.px + dx, y: ps.current.py + dy })
      return
    }
    const rect = cvs.current.getBoundingClientRect()
    const n = hitNode(e.clientX - rect.left, e.clientY - rect.top)
    const id = n?.id || null
    if (id !== hovRef.current) {
      hovRef.current = id
      setHov(id)
      cvs.current.style.cursor = id ? 'pointer' : 'grab'
    }
  }, [hitNode, zoom, setPan])

  const onUp = useCallback(() => { panning.current = false }, [])

  const onDbl = useCallback(e => {
    const rect = cvs.current.getBoundingClientRect()
    const ex = e.clientX - rect.left
    const ey = e.clientY - rect.top
    const n = hitNode(ex, ey)
    if (n && !onBtn(n, ex, ey)) onEdit(n)
  }, [hitNode, onBtn, onEdit])

  const onWheel = useCallback(e => {
    e.preventDefault()
    const f = e.deltaY < 0 ? 1.12 : 0.89
    setZoom(z => Math.min(Math.max(z * f, 0.1), 5))
  }, [setZoom])

  useEffect(() => {
    const h = e => {
      if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && selectedId !== 'root')
        onDelete(selectedId)
      if ((e.key === 'n' || e.key === 'N') && selectedId) onAddChild(selectedId)
      if (e.key === 'Escape') setSelectedId(null)
      if (e.key === ' ' && selectedId) { e.preventDefault(); colRef.current.has(selectedId) ? openNode(selectedId) : toggle(selectedId) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [selectedId, onDelete, onAddChild, setSelectedId, toggle, openNode])

  return (
    <div className="mindmap-container">
      <canvas
        ref={cvs} className="mindmap-canvas"
        onMouseDown={onDown} onMouseMove={onMove}
        onMouseUp={onUp} onMouseLeave={onUp}
        onDoubleClick={onDbl} onWheel={onWheel}
      />
      {selectedId && selectedId !== 'root' && (
        <div className="node-actions">
          <button onClick={() => onAddChild(selectedId)}>+ Node</button>
          <button onClick={() => {
            const n = flatNodes(treeRef.current || {children:[]}, colRef.current).find(x => x.id === selectedId)
            if (n) onEdit(n)
          }}>✏ Edit</button>
          <button onClick={() => colRef.current.has(selectedId) ? openNode(selectedId) : toggle(selectedId)}>
            {collapsed.has(selectedId) ? '▶ Ochish' : '▼ Yopish'}
          </button>
          <button className="del-btn" onClick={() => onDelete(selectedId)}>✕ O'chir</button>
        </div>
      )}
    </div>
  )
})

export default MindMap
