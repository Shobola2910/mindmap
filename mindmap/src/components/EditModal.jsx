import { useState, useEffect, useRef } from 'react'
import './EditModal.css'

const PRESET_COLORS = [
  '#6366f1', '#3b82f6', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
  '#f97316', '#a855f7', '#0ea5e9', '#84cc16',
  '#e11d48', '#06b6d4', '#d97706', '#7c3aed',
]

export default function EditModal({ node, onSave, onClose, onDelete }) {
  const [label, setLabel] = useState(node.label)
  const [color, setColor] = useState(node.color || '#6366f1')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const handleSave = () => {
    if (label.trim()) onSave({ label: label.trim(), color })
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Node tahrirlash</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <label className="field-label">Matn</label>
          <input
            ref={inputRef}
            className="modal-input"
            value={label}
            onChange={e => setLabel(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Node matni..."
          />

          <label className="field-label">Rang</label>
          <div className="color-grid">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                className={`color-swatch ${color === c ? 'active' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          <label className="field-label">Yoki o'z rangingizni kiriting</label>
          <div className="custom-color-row">
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="color-picker"
            />
            <input
              className="modal-input hex-input"
              value={color}
              onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) setColor(e.target.value) }}
            />
          </div>

          <div className="preview-row">
            <div className="preview-node" style={{
              background: `${color}22`,
              border: `1.5px solid ${color}66`,
              color: color
            }}>
              {label || 'Node matni'}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {node.id !== 'root' && (
            <button className="btn-delete" onClick={onDelete}>O'chirish</button>
          )}
          <div style={{ flex: 1 }} />
          <button className="btn-cancel" onClick={onClose}>Bekor</button>
          <button className="btn-save" onClick={handleSave}>Saqlash</button>
        </div>
      </div>
    </div>
  )
}
