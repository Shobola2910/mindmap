import { useState, useCallback } from 'react'
import { loadProjects, createProject, deleteProject, duplicateProject, renameProject } from '../store/projects.js'
import { t } from '../i18n/index.js'
import './ProjectsModal.css'

function timeAgo(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (d > 0) return `${d} kun oldin`
  if (h > 0) return `${h} soat oldin`
  if (m > 0) return `${m} daq oldin`
  return 'Hozir'
}

export default function ProjectsModal({ activeId, onSelect, onClose, lang }) {
  const [projects, setProjects] = useState(loadProjects)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [renaming, setRenaming] = useState(null)
  const [renameVal, setRenameVal] = useState('')

  const refresh = () => setProjects(loadProjects())

  const handleCreate = useCallback(() => {
    const name = newName.trim() || t('nomsiz')
    const proj = createProject(name)
    setNewName(''); setCreating(false)
    refresh()
    onSelect(proj.id)
  }, [newName, onSelect])

  const handleDelete = useCallback((id, e) => {
    e.stopPropagation()
    if (!window.confirm(t('ochirish_confirm'))) return
    if (deleteProject(id)) {
      refresh()
      if (id === activeId) {
        const remaining = loadProjects()
        if (remaining.length > 0) onSelect(remaining[0].id)
      }
    }
  }, [activeId, onSelect])

  const handleDuplicate = useCallback((id, e) => {
    e.stopPropagation()
    const proj = duplicateProject(id)
    refresh()
    if (proj) onSelect(proj.id)
  }, [onSelect])

  const handleRenameStart = useCallback((p, e) => {
    e.stopPropagation()
    setRenaming(p.id); setRenameVal(p.name)
  }, [])

  const handleRenameConfirm = useCallback((id) => {
    if (renameVal.trim()) renameProject(id, renameVal.trim())
    setRenaming(null); refresh()
  }, [renameVal])

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-box" onClick={e => e.stopPropagation()}>
        <div className="pm-header">
          <div className="pm-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
            </svg>
            {t('loyihalar')}
          </div>
          <div className="pm-header-right">
            <button className="pm-new-btn" onClick={() => setCreating(true)}>
              + {t('yangi_loyiha')}
            </button>
            <button className="pm-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {creating && (
          <div className="pm-create-row">
            <input
              className="pm-input"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder={t('loyiha_nomi') + '...'}
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false) }}
            />
            <button className="pm-btn-primary" onClick={handleCreate}>{t('yaratish')}</button>
            <button className="pm-btn-ghost" onClick={() => setCreating(false)}>{t('bekor_q')}</button>
          </div>
        )}

        <div className="pm-list">
          {projects.map(p => (
            <div
              key={p.id}
              className={`pm-item ${p.id === activeId ? 'active' : ''}`}
              onClick={() => { onSelect(p.id); onClose() }}
            >
              <div className="pm-item-icon" style={{ background: p.id === activeId ? '#6366f1' : 'var(--bg3)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.id === activeId ? '#fff' : 'var(--text2)'} strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                </svg>
              </div>

              <div className="pm-item-info">
                {renaming === p.id ? (
                  <input
                    className="pm-rename-input"
                    value={renameVal}
                    onChange={e => setRenameVal(e.target.value)}
                    onClick={e => e.stopPropagation()}
                    autoFocus
                    onKeyDown={e => {
                      e.stopPropagation()
                      if (e.key === 'Enter') handleRenameConfirm(p.id)
                      if (e.key === 'Escape') setRenaming(null)
                    }}
                    onBlur={() => handleRenameConfirm(p.id)}
                  />
                ) : (
                  <div className="pm-item-name">{p.name}</div>
                )}
                <div className="pm-item-meta">{timeAgo(p.updatedAt)}</div>
              </div>

              <div className="pm-item-actions" onClick={e => e.stopPropagation()}>
                <button className="pm-action-btn" onClick={e => handleRenameStart(p, e)} title={t('nomini_ozgartir')}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button className="pm-action-btn" onClick={e => handleDuplicate(p.id, e)} title={t('nusxa')}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                </button>
                {projects.length > 1 && (
                  <button className="pm-action-btn danger" onClick={e => handleDelete(p.id, e)} title={t('ochirish')}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
