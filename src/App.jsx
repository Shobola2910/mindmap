import { useState, useRef, useCallback, useEffect } from 'react'
import MindMap from './components/MindMap'
import Toolbar from './components/Toolbar'
import EditModal from './components/EditModal'
import { DEFAULT_DATA } from './data'
import './App.css'

const STORAGE_KEY = 'algo_mindmap_v3'
const deepClone = o => JSON.parse(JSON.stringify(o))

export default function App() {
  const [data, setData] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : deepClone(DEFAULT_DATA) }
    catch { return deepClone(DEFAULT_DATA) }
  })
  const [theme, setTheme] = useState(() => localStorage.getItem('algo_theme') || 'dark')
  const [zoom, setZoom] = useState(0.7)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [editNode, setEditNode] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const mapRef = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('algo_theme', theme)
  }, [theme])

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }, [data])

  const updateNode = useCallback((id, changes) => {
    const up = n => n.id === id ? { ...n, ...changes } : { ...n, children: (n.children||[]).map(up) }
    setData(prev => up(prev))
  }, [])

  const addChild = useCallback((parentId) => {
    const newId = `node_${Date.now()}`
    const node = { id: newId, label: 'Yangi Node', color: '#6366f1', children: [] }
    const add = n => n.id === parentId
      ? { ...n, children: [...(n.children||[]), node] }
      : { ...n, children: (n.children||[]).map(add) }
    setData(prev => add(prev))
    setSelectedId(newId)
  }, [])

  const deleteNode = useCallback((id) => {
    if (id === 'root') return
    const del = n => ({ ...n, children: (n.children||[]).filter(c => c.id !== id).map(del) })
    setData(prev => del(prev))
    setSelectedId(null)
  }, [])

  const resetData = useCallback(() => {
    if (window.confirm("Barcha ma'lumotlarni qayta tiklaysizmi?")) {
      setData(deepClone(DEFAULT_DATA)); setZoom(0.7); setPan({ x: 0, y: 0 })
    }
  }, [])

  // ── PNG: offscreen canvas, to'liq map, 2x ──────────────────
  const exportPNG = useCallback(() => {
    const oc = mapRef.current?.renderOffscreen?.(2)
    if (!oc) return
    oc.toBlob(blob => {
      const a = document.createElement('a')
      a.download = 'algo-mindmap.png'
      a.href = URL.createObjectURL(blob)
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(a.href), 5000)
    }, 'image/png')
  }, [])

  // ── PDF: to'g'ri o'lcham, hamma node ko'rinadi ─────────────
  const exportPDF = useCallback(async () => {
    const oc = mapRef.current?.renderOffscreen?.(1.5)
    if (!oc) return
    try {
      const { jsPDF } = await import('https://esm.sh/jspdf@2.5.1')
      // 1px = 0.2646mm (at 96dpi), oc is 1.5x so effective 144dpi → 0.1764mm/px
      const px2mm = px => px * 25.4 / 144
      const pw = px2mm(oc.width)
      const ph = px2mm(oc.height)
      const pdf = new jsPDF({
        orientation: pw > ph ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [pw, ph]
      })
      pdf.addImage(oc.toDataURL('image/png'), 'PNG', 0, 0, pw, ph)
      pdf.save('algo-mindmap.pdf')
    } catch (e) { alert('PDF xatosi: ' + e.message) }
  }, [])

  // ── HTML: standalone fayl, ichida rasm embedded ────────────
  const exportHTML = useCallback(() => {
    const oc = mapRef.current?.renderOffscreen?.(2)
    if (!oc) return
    const img = oc.toDataURL('image/png')
    const now = new Date().toLocaleString('uz-UZ')
    const html = `<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ALGO GROUP — Mind Map</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0d0d0f;color:#f0eee8;font-family:system-ui,sans-serif;min-height:100vh;display:flex;flex-direction:column}
header{padding:14px 24px;background:#141416;border-bottom:1px solid #2a2a2e;display:flex;align-items:center;gap:10px;flex-shrink:0}
.logo{font-size:17px;font-weight:700;letter-spacing:.05em;color:#f0eee8}
.logo b{color:#6366f1}
.meta{font-size:11px;color:#9a9890;margin-left:auto}
main{flex:1;overflow:auto;padding:32px;display:flex;justify-content:center;align-items:flex-start}
img{border-radius:12px;border:1px solid #2a2a2e;max-width:100%;height:auto;display:block}
</style>
</head>
<body>
<header>
  <div class="logo">&#x2B21; ALGO <b>MAP</b></div>
  <div class="meta">Eksport: ${now}</div>
</header>
<main>
  <img src="${img}" alt="ALGO GROUP Mind Map" width="${oc.width}" height="${oc.height}">
</main>
</body>
</html>`
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const a = document.createElement('a')
    a.download = 'algo-mindmap.html'
    a.href = URL.createObjectURL(blob)
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(a.href), 5000)
  }, [])

  const importJSON = useCallback(e => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try { setData(JSON.parse(ev.target.result)) }
      catch { alert("Noto'g'ri JSON fayl") }
    }
    reader.readAsText(file); e.target.value = ''
  }, [])

  return (
    <div className="app">
      <Toolbar
        theme={theme} zoom={zoom}
        onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onZoomIn={() => setZoom(z => Math.min(z + 0.15, 4))}
        onZoomOut={() => setZoom(z => Math.max(z - 0.15, 0.15))}
        onResetZoom={() => { setZoom(0.7); setPan({ x: 0, y: 0 }) }}
        onExportPNG={exportPNG}
        onExportPDF={exportPDF}
        onExportHTML={exportHTML}
        onImportJSON={importJSON}
        onReset={resetData}
        onHelp={() => setShowHelp(h => !h)}
        selectedId={selectedId}
        onDeleteSelected={() => deleteNode(selectedId)}
        onAddChild={() => selectedId && addChild(selectedId)}
        onExpandAll={() => mapRef.current?.expandAll?.()}
        onCollapseAll={() => mapRef.current?.collapseAll?.()}
      />

      <MindMap
        ref={mapRef} data={data} zoom={zoom} pan={pan}
        selectedId={selectedId} setZoom={setZoom} setPan={setPan}
        setSelectedId={setSelectedId} onEdit={setEditNode}
        onAddChild={addChild} onDelete={deleteNode}
      />

      {editNode && (
        <EditModal
          node={editNode}
          onSave={changes => { updateNode(editNode.id, changes); setEditNode(null) }}
          onClose={() => setEditNode(null)}
          onDelete={() => { deleteNode(editNode.id); setEditNode(null) }}
        />
      )}

      {showHelp && (
        <div className="help-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-box" onClick={e => e.stopPropagation()}>
            <div className="help-title">⌨ Yordam</div>
            <div className="help-items">
              <div><kbd>Scroll</kbd><span>Zoom in/out</span></div>
              <div><kbd>Drag</kbd><span>Xaritani surish</span></div>
              <div><kbd>Click</kbd><span>Node tanlash</span></div>
              <div><kbd>Dbl Click</kbd><span>Tahrirlash</span></div>
              <div><kbd>Click −/+</kbd><span>Bo'limni yop/och</span></div>
              <div><kbd>Space</kbd><span>Tanlangan nodeni yop/och</span></div>
              <div><kbd>N</kbd><span>Bola node qo'shish</span></div>
              <div><kbd>Del</kbd><span>Node o'chirish</span></div>
              <div><kbd>Esc</kbd><span>Tanlovni bekor qilish</span></div>
            </div>
            <button className="help-close" onClick={() => setShowHelp(false)}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}
