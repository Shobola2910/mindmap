import { LANGS } from '../i18n/index.js'
import './Toolbar.css'

export default function Toolbar({
  theme, zoom, undoCount, redoCount, lang,
  onThemeToggle, onZoomIn, onZoomOut, onResetZoom,
  onExportPNG, onExportPDF, onExportHTML, onImportJSON,
  onReset, onHelp, onHistory, onUndo, onRedo, onLangChange,
  onProjectsOpen, projectName,
  selectedId, onDeleteSelected, onAddChild,
  onExpandAll, onCollapseAll, onAIToggle, showAI,
  t
}) {
  return (
    <div className="toolbar">
      {/* LEFT: Logo + Project */}
      <div className="toolbar-left">
        <div className="logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">ALGO <span>MAP</span></span>
        </div>
        <button className="tb-project-btn" onClick={onProjectsOpen} title="Loyihalar">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>
          <span className="tb-project-name">{projectName}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>

      {/* CENTER: Tools */}
      <div className="toolbar-center">
        {/* Undo/Redo/History */}
        <div className="tb-group">
          <button className={`tb-btn icon-btn ${undoCount===0?'disabled':''}`} onClick={onUndo} disabled={undoCount===0} title={t('orqaga')+' Ctrl+Z'}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M3 13A9 9 0 1 0 6 6.7L3 10"/></svg>
          </button>
          <button className={`tb-btn icon-btn ${redoCount===0?'disabled':''}`} onClick={onRedo} disabled={redoCount===0} title={t('oldinga')+' Ctrl+Y'}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M21 13A9 9 0 1 1 18 6.7L21 10"/></svg>
          </button>
          <button className="tb-btn icon-btn" onClick={onHistory} title={t('tarix')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </button>
        </div>

        <div className="tb-divider"/>

        {/* Zoom */}
        <div className="tb-group">
          <button className="tb-btn icon-btn" onClick={onZoomOut}>−</button>
          <button className="tb-zoom-val" onClick={onResetZoom}>{Math.round(zoom*100)}%</button>
          <button className="tb-btn icon-btn" onClick={onZoomIn}>+</button>
        </div>

        <div className="tb-divider"/>

        {/* Collapse/Expand */}
        <div className="tb-group">
          <button className="tb-btn" onClick={onCollapseAll}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>
            <span className="tb-label">{t('yop')}</span>
          </button>
          <button className="tb-btn" onClick={onExpandAll}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="7 13 12 18 17 13"/><polyline points="7 6 12 11 17 6"/></svg>
            <span className="tb-label">{t('och')}</span>
          </button>
        </div>

        <div className="tb-divider"/>

        {/* Node actions */}
        <div className="tb-group">
          <button className={`tb-btn icon-btn ${!selectedId?'disabled':''}`} onClick={onAddChild} disabled={!selectedId}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
          </button>
          <button className={`tb-btn icon-btn danger ${!selectedId||selectedId==='root'?'disabled':''}`} onClick={onDeleteSelected} disabled={!selectedId||selectedId==='root'}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>

        <div className="tb-divider"/>

        {/* Export */}
        <div className="tb-group">
          <button className="tb-btn" onClick={onExportPNG}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span className="tb-label">{t('png')}</span>
          </button>
          <button className="tb-btn" onClick={onExportPDF}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
            <span className="tb-label">{t('pdf')}</span>
          </button>
          <button className="tb-btn" onClick={onExportHTML}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span className="tb-label">{t('html')}</span>
          </button>
          <label className="tb-btn" style={{cursor:'pointer'}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            <span className="tb-label">{t('import')}</span>
            <input type="file" accept=".json" onChange={onImportJSON} style={{display:'none'}}/>
          </label>
        </div>

        <div className="tb-divider"/>

        {/* AI */}
        <button className={`tb-btn ${showAI?'active':''}`} onClick={onAIToggle}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a2 2 0 012 2v1a7 7 0 010 14v1a2 2 0 01-4 0v-1a7 7 0 010-14V4a2 2 0 012-2z"/><circle cx="12" cy="12" r="3"/></svg>
          <span className="tb-label">{t('ai')}</span>
        </button>
      </div>

      {/* RIGHT: Lang + Theme + Help */}
      <div className="toolbar-right">
        {/* Language switcher */}
        <div className="tb-lang-group">
          {LANGS.map(l => (
            <button
              key={l.code}
              className={`tb-lang-btn ${lang===l.code?'active':''}`}
              onClick={() => onLangChange(l.code)}
              title={l.label}
            >
              {l.flag} <span className="tb-lang-label">{l.label}</span>
            </button>
          ))}
        </div>

        <div className="tb-divider"/>

        <button className="tb-btn icon-btn" onClick={onReset} title={t('tiklash')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
        <button className="tb-btn icon-btn" onClick={onThemeToggle} title={t('tema')}>
          {theme==='dark'
            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          }
        </button>
        <button className="tb-btn icon-btn" onClick={onHelp} title={t('yordam')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
        </button>
      </div>
    </div>
  )
}
