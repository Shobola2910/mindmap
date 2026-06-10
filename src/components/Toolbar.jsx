import './Toolbar.css'

export default function Toolbar({
  theme, zoom, undoCount, redoCount,
  onThemeToggle, onZoomIn, onZoomOut, onResetZoom,
  onExportPNG, onExportPDF, onExportHTML, onImportJSON,
  onReset, onHelp, onHistory, onUndo, onRedo,
  selectedId, onDeleteSelected, onAddChild,
  onExpandAll, onCollapseAll, onAIToggle, showAI
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">ALGO <span>MAP</span></span>
        </div>
      </div>

      <div className="toolbar-center">
        {/* Undo / Redo */}
        <div className="tb-group">
          <button className={`tb-btn icon-btn ${undoCount===0?'disabled':''}`} onClick={onUndo} disabled={undoCount===0} title="Orqaga (Ctrl+Z)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M3 13A9 9 0 1 0 6 6.7L3 10"/></svg>
          </button>
          <button className={`tb-btn icon-btn ${redoCount===0?'disabled':''}`} onClick={onRedo} disabled={redoCount===0} title="Oldinga (Ctrl+Y)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M21 13A9 9 0 1 1 18 6.7L21 10"/></svg>
          </button>
          <button className="tb-btn icon-btn" onClick={onHistory} title="Versiyalar tarixi">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </button>
        </div>

        <div className="tb-divider" />

        {/* Zoom */}
        <div className="tb-group">
          <button className="tb-btn icon-btn" onClick={onZoomOut} title="Kichraytirish">−</button>
          <button className="tb-zoom-val" onClick={onResetZoom}>{Math.round(zoom*100)}%</button>
          <button className="tb-btn icon-btn" onClick={onZoomIn} title="Kattalashtirish">+</button>
        </div>

        <div className="tb-divider" />

        {/* Collapse */}
        <div className="tb-group">
          <button className="tb-btn" onClick={onCollapseAll} title="Barchasini yopish">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>
            <span className="tb-label">Yop</span>
          </button>
          <button className="tb-btn" onClick={onExpandAll} title="Barchasini ochish">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="7 13 12 18 17 13"/><polyline points="7 6 12 11 17 6"/></svg>
            <span className="tb-label">Och</span>
          </button>
        </div>

        <div className="tb-divider" />

        {/* Node actions */}
        <div className="tb-group">
          <button className={`tb-btn icon-btn ${!selectedId?'disabled':''}`} onClick={onAddChild} disabled={!selectedId} title="Node qo'shish (N)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
          </button>
          <button className={`tb-btn icon-btn danger ${!selectedId||selectedId==='root'?'disabled':''}`} onClick={onDeleteSelected} disabled={!selectedId||selectedId==='root'} title="O'chirish (Del)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>

        <div className="tb-divider" />

        {/* Export */}
        <div className="tb-group">
          <button className="tb-btn" onClick={onExportPNG} title="PNG">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span className="tb-label">PNG</span>
          </button>
          <button className="tb-btn" onClick={onExportPDF} title="PDF">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
            <span className="tb-label">PDF</span>
          </button>
          <button className="tb-btn" onClick={onExportHTML} title="HTML">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span className="tb-label">HTML</span>
          </button>
          <label className="tb-btn" title="Import JSON" style={{cursor:'pointer'}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            <span className="tb-label">Import</span>
            <input type="file" accept=".json" onChange={onImportJSON} style={{display:'none'}}/>
          </label>
        </div>

        <div className="tb-divider" />

        {/* AI */}
        <button className={`tb-btn ${showAI?'active':''}`} onClick={onAIToggle} title="AI Yordamchi">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a2 2 0 012 2v1a7 7 0 010 14v1a2 2 0 01-4 0v-1a7 7 0 010-14V4a2 2 0 012-2z"/><circle cx="12" cy="12" r="3"/></svg>
          <span className="tb-label">AI</span>
        </button>
      </div>

      <div className="toolbar-right">
        <button className="tb-btn icon-btn" onClick={onReset} title="Qayta tiklash">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
        <button className="tb-btn icon-btn" onClick={onThemeToggle} title="Tema">
          {theme==='dark'
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          }
        </button>
        <button className="tb-btn icon-btn" onClick={onHelp} title="Yordam">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
        </button>
      </div>
    </div>
  )
}
