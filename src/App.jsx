import { useState, useRef, useCallback, useEffect } from 'react'
import MindMap from './components/MindMap'
import Toolbar from './components/Toolbar'
import EditModal from './components/EditModal'
import AIPanel from './components/AIPanel'
import ProjectsModal from './components/ProjectsModal'
import { t, getLang, setLang } from './i18n/index.js'
import {
  loadProjects, getActiveId, setActiveId,
  updateProjectData, getProject
} from './store/projects.js'
import './App.css'

const MAX_HISTORY = 10
const deepClone = o => JSON.parse(JSON.stringify(o))
const countNodes = n => 1 + (n.children||[]).reduce((s,c)=>s+countNodes(c),0)

export default function App() {
  const [lang, setLangState] = useState(getLang)
  const [activeProjectId, setActiveProjectId] = useState(getActiveId)
  const [projectName, setProjectName] = useState(() => {
    const p = getProject(getActiveId()); return p?.name || 'ALGO MAP'
  })

  const [data, setDataRaw] = useState(() => {
    const p = getProject(getActiveId())
    return p?.data ? deepClone(p.data) : deepClone(loadProjects()[0]?.data)
  })

  const [theme, setTheme] = useState(() => localStorage.getItem('algo_theme')||'dark')
  const [zoom, setZoom] = useState(0.7)
  const [pan, setPan] = useState({x:0,y:0})
  const [editNode, setEditNode] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [showProjects, setShowProjects] = useState(false)
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const mapRef = useRef(null)
  const skipHistory = useRef(false)
  const saveTimer = useRef(null)

  // re-render on lang change
  const handleLangChange = useCallback((code) => {
    setLang(code); setLangState(code)
  }, [])

  // Switch project
  const handleSelectProject = useCallback((id) => {
    const p = getProject(id)
    if (!p) return
    setActiveId(id)
    setActiveProjectId(id)
    setProjectName(p.name)
    setDataRaw(deepClone(p.data))
    setHistory([]); setHistIdx(-1)
    setSelectedId(null); setZoom(0.7); setPan({x:0,y:0})
  }, [])

  // Auto-save to project store (debounced)
  useEffect(() => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      updateProjectData(activeProjectId, data)
    }, 800)
    return () => clearTimeout(saveTimer.current)
  }, [data, activeProjectId])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('algo_theme', theme)
  }, [theme])

  // setData with history
  const setData = useCallback((updater) => {
    setDataRaw(prev => {
      const next = typeof updater==='function' ? updater(prev) : updater
      if (skipHistory.current) return next
      setHistory(h => {
        const entry = {data:deepClone(next), time:Date.now(), count:countNodes(next)}
        return [entry, ...h.slice(0, MAX_HISTORY-1)]
      })
      setHistIdx(0)
      return next
    })
  }, [])

  const undo = useCallback(() => {
    setHistory(h => {
      if (histIdx >= h.length-1) return h
      const ni = histIdx+1; setHistIdx(ni)
      skipHistory.current = true
      setDataRaw(h[ni].data)
      setTimeout(()=>{ skipHistory.current=false },0)
      return h
    })
  }, [histIdx])

  const redo = useCallback(() => {
    if (histIdx<=0) return
    const ni = histIdx-1; setHistIdx(ni)
    skipHistory.current = true
    setDataRaw(history[ni].data)
    setTimeout(()=>{ skipHistory.current=false },0)
  }, [histIdx, history])

  const restoreVersion = useCallback((idx) => {
    skipHistory.current = true
    setDataRaw(deepClone(history[idx].data))
    setHistIdx(idx); setShowHistory(false)
    setTimeout(()=>{ skipHistory.current=false },0)
  }, [history])

  const updateNode = useCallback((id,changes) => {
    const up = n => n.id===id ? {...n,...changes} : {...n,children:(n.children||[]).map(up)}
    setData(prev=>up(prev))
  }, [setData])

  const addChild = useCallback((parentId, labelText=null) => {
    const newId = `node_${Date.now()}`
    const node = {id:newId, label:labelText||t('yangi_node'), color:'#6366f1', children:[]}
    const add = n => n.id===parentId ? {...n,children:[...(n.children||[]),node]} : {...n,children:(n.children||[]).map(add)}
    setData(prev=>add(prev))
    setSelectedId(newId)
  }, [setData, lang])

  const deleteNode = useCallback((id) => {
    if(id==='root') return
    const del = n => ({...n,children:(n.children||[]).filter(c=>c.id!==id).map(del)})
    setData(prev=>del(prev))
    setSelectedId(null)
  }, [setData])

  const resetData = useCallback(() => {
    if(window.confirm(t('reset_confirm'))) {
      const p = getProject(activeProjectId)
      if(p){ import('./data.js').then(({DEFAULT_DATA})=>{ setData(deepClone(DEFAULT_DATA)) }) }
      setZoom(0.7); setPan({x:0,y:0})
    }
  }, [setData, activeProjectId, lang])

  // Exports
  const exportPNG = useCallback(() => {
    const oc = mapRef.current?.renderOffscreen?.(2); if(!oc) return
    oc.toBlob(blob=>{
      const a=document.createElement('a'); a.download=`${projectName}.png`
      a.href=URL.createObjectURL(blob); document.body.appendChild(a); a.click()
      document.body.removeChild(a); setTimeout(()=>URL.revokeObjectURL(a.href),5000)
    },'image/png')
  }, [projectName])

  const exportPDF = useCallback(async () => {
    const oc = mapRef.current?.renderOffscreen?.(1.5); if(!oc) return
    try {
      const {jsPDF} = await import('https://esm.sh/jspdf@2.5.1')
      const px2mm = px=>px*25.4/144
      const pw=px2mm(oc.width), ph=px2mm(oc.height)
      const pdf = new jsPDF({orientation:pw>ph?'landscape':'portrait', unit:'mm', format:[pw,ph]})
      pdf.addImage(oc.toDataURL('image/png'),'PNG',0,0,pw,ph)
      pdf.save(`${projectName}.pdf`)
    } catch(e){ alert('PDF xatosi: '+e.message) }
  }, [projectName])

  const exportHTML = useCallback(() => {
    const oc = mapRef.current?.renderOffscreen?.(2); if(!oc) return
    const img = oc.toDataURL('image/png')
    const now = new Date().toLocaleString('uz-UZ')
    const html = `<!DOCTYPE html><html lang="uz"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${projectName}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0d0d0f;color:#f0eee8;font-family:system-ui,sans-serif;min-height:100vh;display:flex;flex-direction:column}header{padding:14px 24px;background:#141416;border-bottom:1px solid #2a2a2e;display:flex;align-items:center;gap:10px}.logo{font-size:17px;font-weight:700}.logo b{color:#6366f1}.meta{font-size:11px;color:#9a9890;margin-left:auto}main{flex:1;overflow:auto;padding:24px;display:flex;justify-content:center}img{border-radius:12px;border:1px solid #2a2a2e;max-width:100%;height:auto}</style></head><body><header><div class="logo">&#x2B21; ALGO <b>MAP</b></div><div class="meta">${projectName} — ${now}</div></header><main><img src="${img}" alt="${projectName}" width="${oc.width}" height="${oc.height}"></main></body></html>`
    const blob = new Blob([html],{type:'text/html;charset=utf-8'})
    const a = document.createElement('a'); a.download=`${projectName}.html`
    a.href=URL.createObjectURL(blob); document.body.appendChild(a); a.click()
    document.body.removeChild(a); setTimeout(()=>URL.revokeObjectURL(a.href),5000)
  }, [projectName])

  const importJSON = useCallback(e => {
    const file=e.target.files[0]; if(!file) return
    const reader=new FileReader()
    reader.onload=ev=>{ try{setData(JSON.parse(ev.target.result))}catch{alert(t('noto_g_ri_json'))} }
    reader.readAsText(file); e.target.value=''
  }, [setData, lang])

  // Keyboard shortcuts
  useEffect(()=>{
    const h = e => {
      if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return
      if((e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();undo()}
      if((e.ctrlKey||e.metaKey)&&(e.key==='y'||(e.shiftKey&&e.key==='z'))){e.preventDefault();redo()}
    }
    window.addEventListener('keydown',h)
    return ()=>window.removeEventListener('keydown',h)
  },[undo,redo])

  // Selected node for AI
  const [selectedNode, setSelectedNode] = useState(null)
  useEffect(()=>{
    if(!selectedId){setSelectedNode(null);return}
    const find = n => { if(n.id===selectedId)return n; for(const c of(n.children||[])){const f=find(c);if(f)return f}return null }
    setSelectedNode(find(data))
  },[selectedId,data])

  return (
    <div className="app">
      <Toolbar
        theme={theme} zoom={zoom} lang={lang}
        undoCount={histIdx<history.length-1?1:0}
        redoCount={histIdx>0?1:0}
        projectName={projectName}
        onThemeToggle={()=>setTheme(th=>th==='dark'?'light':'dark')}
        onZoomIn={()=>setZoom(z=>Math.min(z+0.15,4))}
        onZoomOut={()=>setZoom(z=>Math.max(z-0.15,0.15))}
        onResetZoom={()=>{setZoom(0.7);setPan({x:0,y:0})}}
        onExportPNG={exportPNG} onExportPDF={exportPDF} onExportHTML={exportHTML}
        onImportJSON={importJSON} onReset={resetData}
        onHelp={()=>setShowHelp(h=>!h)}
        onHistory={()=>setShowHistory(h=>!h)}
        onUndo={undo} onRedo={redo}
        onLangChange={handleLangChange}
        onProjectsOpen={()=>setShowProjects(true)}
        selectedId={selectedId}
        onDeleteSelected={()=>deleteNode(selectedId)}
        onAddChild={()=>selectedId&&addChild(selectedId)}
        onExpandAll={()=>mapRef.current?.expandAll?.()}
        onCollapseAll={()=>mapRef.current?.collapseAll?.()}
        onAIToggle={()=>setShowAI(a=>!a)}
        showAI={showAI}
        t={t}
      />

      <MindMap
        ref={mapRef} data={data} zoom={zoom} pan={pan}
        selectedId={selectedId} setZoom={setZoom} setPan={setPan}
        setSelectedId={setSelectedId} onEdit={setEditNode}
        onAddChild={addChild} onDelete={deleteNode}
      />

      {showAI && <AIPanel selectedNode={selectedNode} onAddChild={addChild} onClose={()=>setShowAI(false)} lang={lang} t={t}/>}
      {editNode && (
        <EditModal node={editNode}
          onSave={changes=>{updateNode(editNode.id,changes);setEditNode(null)}}
          onClose={()=>setEditNode(null)}
          onDelete={()=>{deleteNode(editNode.id);setEditNode(null)}}
          t={t}
        />
      )}

      {/* Projects modal */}
      {showProjects && (
        <ProjectsModal
          activeId={activeProjectId}
          onSelect={handleSelectProject}
          onClose={()=>setShowProjects(false)}
          lang={lang} t={t}
        />
      )}

      {/* Help */}
      {showHelp && (
        <div className="help-overlay" onClick={()=>setShowHelp(false)}>
          <div className="help-box" onClick={e=>e.stopPropagation()}>
            <div className="help-title">⌨ {t('yordam')}</div>
            <div className="help-items">
              <div><kbd>Scroll</kbd><span>{t('zoom')}</span></div>
              <div><kbd>Drag</kbd><span>{t('surish')}</span></div>
              <div><kbd>Click</kbd><span>{t('tanlash')}</span></div>
              <div><kbd>Dbl Click</kbd><span>{t('tahrirlash')}</span></div>
              <div><kbd>± tugma</kbd><span>{t('yopoch')}</span></div>
              <div><kbd>N</kbd><span>{t('node_qosh')}</span></div>
              <div><kbd>Del</kbd><span>{t('node_ochir')}</span></div>
              <div><kbd>Ctrl+Z</kbd><span>{t('orqaga')}</span></div>
              <div><kbd>Ctrl+Y</kbd><span>{t('oldinga')}</span></div>
              <div><kbd>Esc</kbd><span>{t('bekor')}</span></div>
              <div><kbd>Pinch</kbd><span>Mobil zoom</span></div>
            </div>
            <button className="help-close" onClick={()=>setShowHelp(false)}>✕</button>
          </div>
        </div>
      )}

      {/* Version History */}
      {showHistory && (
        <div className="history-overlay" onClick={()=>setShowHistory(false)}>
          <div className="history-box" onClick={e=>e.stopPropagation()}>
            <div className="history-header">
              <div className="history-title">🕐 {t('versiyalar')}</div>
              <button className="help-close" onClick={()=>setShowHistory(false)}>✕</button>
            </div>
            {history.length===0 ? (
              <div className="history-empty">{t('hali_ozgarish')}</div>
            ) : (
              <div className="history-list">
                {history.map((h,i)=>(
                  <div key={i} className={`history-item ${i===histIdx?'current':''}`}>
                    <div className="history-dot"/>
                    <div className="history-info">
                      <div className="history-time">{new Date(h.time).toLocaleTimeString()}</div>
                      <div className="history-nodes">{h.count} {t('node_ta')}</div>
                    </div>
                    {i!==histIdx
                      ? <button className="history-restore" onClick={()=>restoreVersion(i)}>{t('tiklash')}</button>
                      : <span style={{fontSize:11,color:'var(--accent)'}}>{t('joriy')}</span>
                    }
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile bottom bar */}
      <div className="mobile-actions">
        <button onClick={()=>setShowProjects(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
          {t('loyihalar')}
        </button>
        <button onClick={()=>mapRef.current?.collapseAll?.()}>{t('yop')}</button>
        <button onClick={()=>mapRef.current?.expandAll?.()}>{t('och')}</button>
        <button onClick={()=>setZoom(z=>Math.min(z+0.2,4))}>+</button>
        <button onClick={()=>setZoom(z=>Math.max(z-0.2,0.15))}>−</button>
        <button className={showAI?'active':''} onClick={()=>setShowAI(a=>!a)}>✦ AI</button>
      </div>
    </div>
  )
}
