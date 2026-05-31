import { useState, useRef, useCallback, useEffect } from 'react'
import MindMap from './components/MindMap'
import Toolbar from './components/Toolbar'
import EditModal from './components/EditModal'
import { DEFAULT_DATA } from './data'
import './App.css'

const STORAGE_KEY = 'algo_mindmap_v2'

function deepClone(o) { return JSON.parse(JSON.stringify(o)) }

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      return s ? JSON.parse(s) : deepClone(DEFAULT_DATA)
    } catch { return deepClone(DEFAULT_DATA) }
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const updateNode = useCallback((id, changes) => {
    function up(n) {
      if (n.id === id) return { ...n, ...changes }
      return { ...n, children: (n.children || []).map(up) }
    }
    setData(prev => up(prev))
  }, [])

  const addChild = useCallback((parentId) => {
    const newId = `node_${Date.now()}`
    const newNode = { id: newId, label: 'Yangi Node', color: '#6366f1', children: [] }
    function add(n) {
      if (n.id === parentId) return { ...n, children: [...(n.children || []), newNode] }
      return { ...n, children: (n.children || []).map(add) }
    }
    setData(prev => add(prev))
    setSelectedId(newId)
  }, [])

  const deleteNode = useCallback((id) => {
    if (id === 'root') return
    function del(n) {
      return { ...n, children: (n.children || []).filter(c => c.id !== id).map(del) }
    }
    setData(prev => del(prev))
    setSelectedId(null)
  }, [])

  const resetData = useCallback(() => {
    if (window.confirm('Barcha ma\'lumotlarni qayta tiklaysizmi?')) {
      setData(deepClone(DEFAULT_DATA))
      setZoom(0.7)
      setPan({ x: 0, y: 0 })
    }
  }, [])

  const exportPNG = useCallback(() => {
    const c = mapRef.current?.getCanvas?.()
    if (!c) return
    const link = document.createElement('a')
    link.download = 'algo-mindmap.png'
    link.href = c.toDataURL('image/png')
    link.click()
  }, [])

  const exportPDF = useCallback(async () => {
    const c = mapRef.current?.getCanvas?.()
    if (!c) return
    try {
      const { jsPDF } = await import('https://esm.sh/jspdf@2.5.1')
      const imgData = c.toDataURL('image/jpeg', 0.9)
      const W = 297, H = Math.round(297 * c.height / c.width)
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [W, Math.max(H, 210)] })
      pdf.addImage(imgData, 'JPEG', 0, 0, W, H)
      pdf.save('algo-mindmap.pdf')
    } catch (e) { alert('PDF export xatosi: ' + e.message) }
  }, [])

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.download = 'algo-mindmap.json'
    a.href = URL.createObjectURL(blob)
    a.click()
  }, [data])

  const importJSON = useCallback(e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try { setData(JSON.parse(ev.target.result)) }
      catch { alert('Noto\'g\'ri JSON fayl') }
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [])

  return (
    <div className="app">
      <Toolbar
        theme={theme}
        zoom={zoom}
        onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onZoomIn={() => setZoom(z => Math.min(z + 0.15, 4))}
        onZoomOut={() => setZoom(z => Math.max(z - 0.15, 0.15))}
        onResetZoom={() => { setZoom(0.7); setPan({ x: 0, y: 0 }) }}
        onExportPNG={exportPNG}
        onExportPDF={exportPDF}
        onExportJSON={exportJSON}
        onImportJSON={importJSON}
        onReset={resetData}
        onHelp={() => setShowHelp(h => !h)}
        selectedId={selectedId}
        onDeleteSelected={() => deleteNode(selectedId)}
        onAddChild={() => selectedId && addChild(selectedId)}
      />

      <MindMap
        ref={mapRef}
        data={data}
        zoom={zoom}
        pan={pan}
        selectedId={selectedId}
        setZoom={setZoom}
        setPan={setPan}
        setSelectedId={setSelectedId}
        onEdit={setEditNode}
        onAddChild={addChild}
        onDelete={deleteNode}
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
