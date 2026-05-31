import { useState, useRef, useCallback, useEffect } from 'react'
import MindMap from './components/MindMap'
import Toolbar from './components/Toolbar'
import EditModal from './components/EditModal'
import { DEFAULT_DATA } from './data'
import './App.css'

const STORAGE_KEY = 'algo_mindmap_v1'

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : deepClone(DEFAULT_DATA)
    } catch { return deepClone(DEFAULT_DATA) }
  })
  const [theme, setTheme] = useState(() => localStorage.getItem('algo_theme') || 'dark')
  const [zoom, setZoom] = useState(1)
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

  // Center on load
  useEffect(() => {
    const timer = setTimeout(() => {
      const w = window.innerWidth
      const h = window.innerHeight
      setPan({ x: w / 2 - 20, y: h / 2 - 40 })
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  const updateNode = useCallback((id, changes) => {
    function update(node) {
      if (node.id === id) return { ...node, ...changes }
      return { ...node, children: node.children.map(update) }
    }
    setData(prev => update(prev))
  }, [])

  const addChild = useCallback((parentId) => {
    const newNode = {
      id: `node_${Date.now()}`,
      label: 'Yangi Node',
      color: '#6366f1',
      children: []
    }
    function addTo(node) {
      if (node.id === parentId) return { ...node, children: [...node.children, newNode] }
      return { ...node, children: node.children.map(addTo) }
    }
    setData(prev => addTo(prev))
    return newNode.id
  }, [])

  const deleteNode = useCallback((id) => {
    if (id === 'root') return
    function remove(node) {
      return { ...node, children: node.children.filter(c => c.id !== id).map(remove) }
    }
    setData(prev => remove(prev))
    setSelectedId(null)
  }, [])

  const resetData = useCallback(() => {
    if (confirm('Hamma ma\'lumotlarni qayta tiklaysizmi?')) {
      setData(deepClone(DEFAULT_DATA))
    }
  }, [])

  const exportPNG = useCallback(async () => {
    const canvas = mapRef.current?.getCanvas?.()
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'algo-mindmap.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  const exportPDF = useCallback(async () => {
    const canvas = mapRef.current?.getCanvas?.()
    if (!canvas) return
    const imgData = canvas.toDataURL('image/png')
    const w = canvas.width, h = canvas.height
    const ratio = w / h
    const pdfW = 297, pdfH = pdfW / ratio
    const { jsPDF } = await import('https://esm.sh/jspdf@2.5.1')
    const pdf = new jsPDF({ orientation: ratio > 1 ? 'landscape' : 'portrait', unit: 'mm', format: [pdfW, Math.max(pdfH, 210)] })
    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
    pdf.save('algo-mindmap.pdf')
  }, [])

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'algo-mindmap.json'
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }, [data])

  const importJSON = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        setData(parsed)
      } catch { alert('Noto\'g\'ri JSON fayl') }
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [])

  const zoomIn = () => setZoom(z => Math.min(z + 0.15, 3))
  const zoomOut = () => setZoom(z => Math.max(z - 0.15, 0.2))
  const resetZoom = () => { setZoom(1); const w = window.innerWidth; const h = window.innerHeight; setPan({ x: w/2-20, y: h/2-40 }) }

  return (
    <div className="app">
      <Toolbar
        theme={theme}
        zoom={zoom}
        onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        onExportPNG={exportPNG}
        onExportPDF={exportPDF}
        onExportJSON={exportJSON}
        onImportJSON={importJSON}
        onReset={resetData}
        onHelp={() => setShowHelp(h => !h)}
        selectedId={selectedId}
        onDeleteSelected={() => deleteNode(selectedId)}
        onAddChild={() => { if (selectedId) { const nid = addChild(selectedId); setSelectedId(nid) }}}
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
          onSave={(changes) => { updateNode(editNode.id, changes); setEditNode(null) }}
          onClose={() => setEditNode(null)}
          onDelete={() => { deleteNode(editNode.id); setEditNode(null) }}
        />
      )}

      {showHelp && (
        <div className="help-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-box" onClick={e => e.stopPropagation()}>
            <div className="help-title">Yordam</div>
            <div className="help-items">
              <div><kbd>Scroll</kbd> Zoom</div>
              <div><kbd>Drag</kbd> Xaritani surish</div>
              <div><kbd>Click</kbd> Node tanlash</div>
              <div><kbd>Dbl Click</kbd> Tahrirlash</div>
              <div><kbd>Del</kbd> O'chirish</div>
              <div><kbd>N</kbd> Yangi bola node</div>
              <div><kbd>Esc</kbd> Tanlovni bekor qilish</div>
            </div>
            <button className="help-close" onClick={() => setShowHelp(false)}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}
