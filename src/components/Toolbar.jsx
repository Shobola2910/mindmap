import './Toolbar.css'

export default function Toolbar({
  theme, zoom,
  onThemeToggle, onZoomIn, onZoomOut, onResetZoom,
  onExportPNG, onExportPDF, onExportHTML, onImportJSON,
  onReset, onHelp, selectedId, onDeleteSelected, onAddChild,
  onExpandAll, onCollapseAll
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
        {/* Zoom */}
        <div className="tb-group">
          <button className="tb-btn icon-btn" onClick={onZoomOut} title="Kichraytirish">−</button>
          <button className="tb-zoom-val" onClick={onResetZoom}>{Math.round(zoom * 100)}%</button>
          <button className="tb-btn icon-btn" onClick={onZoomIn} title="Kattalashtirish">+</button>
        </div>

        <div className="tb-divider" />

        {/* Collapse / Expand */}
        <div className="tb-group">
          <button className="tb-btn" onClick={onCollapseAll} title="Barchasini yopish">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/>
            </svg>
            Yop
          </button>
          <button className="tb-btn" onClick={onExpandAll} title="Barchasini ochish">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="7 13 12 18 17 13"/><polyline points="7 6 12 11 17 6"/>
            </svg>
            Och
          </button>
        </div>

        <div className="tb-divider" />

        {/* Node edit */}
        <div className="tb-group">
          <button
            className={`tb-btn icon-btn ${!selectedId ? 'disabled' : ''}`}
            onClick={onAddChild} disabled={!selectedId}
            title="Bola node qo'shish (N)"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
            </svg>
          </button>
          <button
            className={`tb-btn icon-btn danger ${!selectedId || selectedId === 'root' ? 'disabled' : ''}`}
            onClick={onDeleteSelected} disabled={!selectedId || selectedId === 'root'}
            title="O'chirish (Del)"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
            </svg>
          </button>
        </div>

        <div className="tb-divider" />

        {/* Export */}
        <div className="tb-group">
          <button className="tb-btn" onClick={onExportPNG} title="PNG yuklab olish">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            PNG
          </button>
          <button className="tb-btn" onClick={onExportPDF} title="PDF yuklab olish">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>
              <path d="M9 13h2a2 2 0 010 4H9v-4z"/>
            </svg>
            PDF
          </button>
          <button className="tb-btn" onClick={onExportHTML} title="HTML yuklab olish">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            HTML
          </button>
          <label className="tb-btn" title="JSON import">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
            Import
            <input type="file" accept=".json" onChange={onImportJSON} style={{display:'none'}} />
          </label>
        </div>
      </div>

      <div className="toolbar-right">
        <button className="tb-btn icon-btn" onClick={onReset} title="Qayta tiklash">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
          </svg>
        </button>
        <button className="tb-btn icon-btn" onClick={onThemeToggle} title="Tema o'zgartirish">
          {theme === 'dark'
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          }
        </button>
        <button className="tb-btn icon-btn" onClick={onHelp} title="Yordam">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
