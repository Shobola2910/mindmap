import { useState, useCallback } from 'react'
import './AIPanel.css'

export default function AIPanel({ selectedNode, onAddChild, onClose }) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [added, setAdded] = useState(new Set())

  const getSuggestions = useCallback(async () => {
    if(!selectedNode) return
    setLoading(true); setError(null); setSuggestions([])
    const prompt = `Siz logistics va trucking sohasidagi ekspertsiz.
Node: "${selectedNode.label}"
Bu logistics mind map nodesi uchun 5 ta qisqa, aniq foydali bola-node taklif qiling.
Faqat JSON massiv qaytaring, boshqa matn yo'q:
["taklif 1", "taklif 2", "taklif 3", "taklif 4", "taklif 5"]
Javob faqat o'zbek tilida bo'lsin.`
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:500, messages:[{role:'user',content:prompt}]})
      })
      const data = await res.json()
      const text = data.content?.[0]?.text||''
      const match = text.match(/\[[\s\S]*\]/)
      if(match){ setSuggestions(JSON.parse(match[0]).filter(s=>typeof s==='string'&&s.trim())) }
      else setError('Taklif olishda xatolik')
    } catch(e){ setError('Xatolik: '+e.message) }
    finally { setLoading(false) }
  }, [selectedNode])

  const handleAdd = useCallback((s,i) => {
    if(!selectedNode) return
    onAddChild(selectedNode.id, s)
    setAdded(prev => new Set([...prev,i]))
  }, [selectedNode, onAddChild])

  return (
    <div className="ai-panel">
      <div className="ai-header">
        <div className="ai-title"><span className="ai-icon">✦</span> AI Yordamchi</div>
        <button className="ai-close" onClick={onClose}>✕</button>
      </div>
      <div className="ai-body">
        {!selectedNode ? (
          <div className="ai-empty">Node tanlang, keyin AI tahlil qiladi</div>
        ) : (
          <>
            <div className="ai-selected">
              <span className="ai-sel-dot" style={{background:selectedNode.color}}/>
              <span className="ai-sel-label">{selectedNode.label}</span>
            </div>
            <button className="ai-generate-btn" onClick={getSuggestions} disabled={loading}>
              {loading ? <><span className="ai-spinner"/>Tahlil qilinyapti…</> : <><span>✦</span> AI Taklif qilsin</>}
            </button>
            {error && <div className="ai-error">{error}</div>}
            {suggestions.length>0 && (
              <>
                <div className="ai-suggestions">
                  {suggestions.map((s,i)=>(
                    <div key={i} className={`ai-suggestion ${added.has(i)?'added':''}`}>
                      <span className="ai-sug-text">{s}</span>
                      <button className="ai-sug-btn" onClick={()=>handleAdd(s,i)} disabled={added.has(i)}>
                        {added.has(i)?'✓':'+ Qo\'sh'}
                      </button>
                    </div>
                  ))}
                </div>
                {suggestions.some((_,i)=>!added.has(i)) && (
                  <button className="ai-add-all" onClick={()=>{
                    suggestions.forEach((s,i)=>{if(!added.has(i))handleAdd(s,i)})
                  }}>Barchasini qo'shish</button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
