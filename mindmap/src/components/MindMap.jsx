import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle, useState } from 'react'
import './MindMap.css'

const NW=190, NH=38, RW=160, RH=50, HGAP=70, VGAP=8, BR=8

function hex2rgb(hex='#6366f1'){
  const c=hex.replace('#','')
  if(c.length<6)return[99,102,241]
  return[parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)]
}

function setDepth(n,d=0){n.d=d;(n.children||[]).forEach(c=>setDepth(c,d+1))}

function totalH(n,col){
  const self=n.d===0?RH:NH
  if(!n.children||!n.children.length||col.has(n.id)){n._th=self;return}
  n.children.forEach(c=>totalH(c,col))
  const sum=n.children.reduce((s,c)=>s+c._th,0)+VGAP*(n.children.length-1)
  n._th=Math.max(self,sum)
}

function layout(n,x,y,col){
  const sw=n.d===0?RW:NW,sh=n.d===0?RH:NH
  n._x=x;n._y=y+n._th/2-sh/2;n._cy=y+n._th/2
  if(!n.children||!n.children.length||col.has(n.id))return
  let cy=y
  n.children.forEach(c=>{layout(c,x+sw+HGAP,cy,col);cy+=c._th+VGAP})
}

function flatNodes(n,col,arr=[]){
  arr.push(n)
  if(!col.has(n.id))(n.children||[]).forEach(c=>flatNodes(c,col,arr))
  return arr
}

function buildLayout(data,col){
  const tree=JSON.parse(JSON.stringify(data))
  setDepth(tree);totalH(tree,col);layout(tree,0,-tree._th/2,col)
  return tree
}

const MindMap=forwardRef(function MindMap(
  {data,zoom,pan,selectedId,setZoom,setPan,setSelectedId,onEdit,onAddChild,onDelete},ref
){
  const cvs=useRef(null)
  const treeRef=useRef(null)
  const [collapsed,setCollapsed]=useState(()=>{
    const ids=new Set();(data.children||[]).forEach(c=>ids.add(c.id));return ids
  })
  const [hov,setHov]=useState(null)
  const hovRef=useRef(null)
  const panning=useRef(false)
  const ps=useRef({x:0,y:0,px:0,py:0})
  const colRef=useRef(collapsed)
  colRef.current=collapsed
  // Touch state
  const touches=useRef({})
  const lastPinchDist=useRef(null)

  useImperativeHandle(ref,()=>({
    getCanvas:()=>cvs.current,
    expandAll:()=>setCollapsed(new Set()),
    collapseAll:()=>{
      const ids=new Set()
      function collect(n){if(n.children&&n.children.length){ids.add(n.id);n.children.forEach(collect)}}
      collect(data);setCollapsed(ids)
    },
    renderOffscreen:(scale=2)=>{
      const tree=treeRef.current;if(!tree)return null
      const col=colRef.current
      const nodes=flatNodes(tree,col)
      let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity
      nodes.forEach(n=>{
        const w=n.d===0?RW:NW,h=n.d===0?RH:NH
        minX=Math.min(minX,n._x);minY=Math.min(minY,n._y)
        maxX=Math.max(maxX,n._x+w+(col.has(n.id)?28:0));maxY=Math.max(maxY,n._y+h)
      })
      const PAD=50,mW=maxX-minX+PAD*2,mH=maxY-minY+PAD*2
      const oc=document.createElement('canvas')
      oc.width=mW*scale;oc.height=mH*scale
      const ctx=oc.getContext('2d');ctx.scale(scale,scale)
      const dark=document.documentElement.dataset.theme!=='light'
      ctx.fillStyle=dark?'#0d0d0f':'#f5f4f0';ctx.fillRect(0,0,mW,mH)
      ctx.save();ctx.translate(-minX+PAD,-minY+PAD)
      drawScene(ctx,nodes,col,dark,null,null)
      ctx.restore();return oc
    }
  }),[data,collapsed])

  function drawScene(ctx,nodes,col,dark,selId,hovId){
    // edges
    nodes.forEach(n=>{
      if(!n.children||!n.children.length||col.has(n.id))return
      const[r,g,b]=hex2rgb(n.color)
      const x1=n._x+(n.d===0?RW:NW),y1=n._cy
      n.children.forEach(c=>{
        const mx=(x1+c._x)/2
        const sel=selId===n.id||selId===c.id
        ctx.beginPath();ctx.moveTo(x1,y1);ctx.bezierCurveTo(mx,y1,mx,c._cy,c._x,c._cy)
        ctx.strokeStyle=`rgba(${r},${g},${b},${selId&&!sel?0.15:0.55})`
        ctx.lineWidth=sel?1.8:1.1;ctx.stroke()
      })
    })
    // nodes
    nodes.forEach(n=>{
      const isRoot=n.d===0,w=isRoot?RW:NW,h=isRoot?RH:NH
      const x=n._x,y=n._y,col_=n.color||'#6366f1'
      const[r,g,b]=hex2rgb(col_)
      const sel=selId===n.id,hv=hovId===n.id
      const hasCh=n.children&&n.children.length>0,isCol=col.has(n.id)

      if(sel){ctx.shadowColor=`rgba(${r},${g},${b},0.55)`;ctx.shadowBlur=16}
      ctx.beginPath();ctx.roundRect(x,y,w,h,isRoot?14:8)
      if(isRoot)ctx.fillStyle=col_
      else if(sel)ctx.fillStyle=dark?`rgba(${r},${g},${b},0.26)`:`rgba(${r},${g},${b},0.18)`
      else if(hv)ctx.fillStyle=dark?`rgba(${r},${g},${b},0.18)`:`rgba(${r},${g},${b},0.12)`
      else ctx.fillStyle=dark?`rgba(${r},${g},${b},0.1)`:`rgba(${r},${g},${b},0.07)`
      ctx.fill();ctx.shadowBlur=0;ctx.shadowColor='transparent'

      ctx.strokeStyle=sel?`rgba(${r},${g},${b},1)`:hv?`rgba(${r},${g},${b},0.7)`:`rgba(${r},${g},${b},0.32)`
      ctx.lineWidth=sel?1.8:1;ctx.stroke()

      ctx.textAlign='center';ctx.textBaseline='middle'
      const btnsz=hasCh?BR*2+8:0
      if(isRoot){
        ctx.font="bold 13px 'Space Grotesk',sans-serif";ctx.fillStyle='#fff'
        ctx.fillText(n.label,x+w/2,y+h/2-6)
        ctx.font="400 9px 'JetBrains Mono',monospace";ctx.fillStyle='rgba(255,255,255,0.6)'
        ctx.fillText('ALGO Mind Map',x+w/2,y+h/2+8)
      }else{
        const tc=dark?`rgb(${Math.min(r+130,255)},${Math.min(g+130,255)},${Math.min(b+130,255)})`:`rgb(${Math.max(r-50,0)},${Math.max(g-50,0)},${Math.max(b-50,0)})`
        ctx.font="500 11px 'Space Grotesk',sans-serif";ctx.fillStyle=tc
        const maxW=w-20-btnsz;let lbl=n.label
        while(ctx.measureText(lbl).width>maxW&&lbl.length>4)lbl=lbl.slice(0,-4)+'…'
        ctx.fillText(lbl,x+(w-btnsz)/2,y+h/2)
      }
      if(!isRoot){
        ctx.beginPath();ctx.arc(x+8,y+h/2,n.d===1?3:2,0,Math.PI*2)
        ctx.fillStyle=`rgba(${r},${g},${b},0.65)`;ctx.fill()
      }
      if(hasCh){
        const bx=x+w-BR-5,by=y+h/2
        const tc=isRoot?'#fff':dark?`rgb(${Math.min(r+130,255)},${Math.min(g+130,255)},${Math.min(b+130,255)})`:`rgb(${Math.max(r-50,0)},${Math.max(g-50,0)},${Math.max(b-50,0)})`
        ctx.beginPath();ctx.arc(bx,by,BR,0,Math.PI*2)
        ctx.fillStyle=isRoot?'rgba(255,255,255,0.18)':dark?`rgba(${r},${g},${b},0.2)`:`rgba(${r},${g},${b},0.14)`
        ctx.fill();ctx.strokeStyle=isRoot?'rgba(255,255,255,0.45)':`rgba(${r},${g},${b},0.55)`;ctx.lineWidth=1.2;ctx.stroke()
        ctx.strokeStyle=tc;ctx.lineWidth=1.8;ctx.lineCap='round'
        ctx.beginPath();ctx.moveTo(bx-4,by);ctx.lineTo(bx+4,by);ctx.stroke()
        if(isCol){
          ctx.beginPath();ctx.moveTo(bx,by-4);ctx.lineTo(bx,by+4);ctx.stroke()
          const bx2=x+w+14
          ctx.beginPath();ctx.arc(bx2,by,9,0,Math.PI*2)
          ctx.fillStyle=`rgba(${r},${g},${b},0.8)`;ctx.fill()
          ctx.font="bold 8px 'Space Grotesk',sans-serif";ctx.fillStyle='#fff'
          ctx.textAlign='center';ctx.textBaseline='middle'
          ctx.fillText(String(n.children.length),bx2,by)
        }
      }
    })
  }

  useEffect(()=>{treeRef.current=buildLayout(data,collapsed)},[data,collapsed])
  useEffect(()=>{
    const initCol=new Set();(data.children||[]).forEach(c=>initCol.add(c.id))
    treeRef.current=buildLayout(data,initCol)
  },[])

  const toggle=useCallback((id)=>{
    setCollapsed(prev=>{const s=new Set(prev);s.has(id)?s.delete(id):s.add(id);return s})
  },[])

  const openNode=useCallback((id)=>{
    function findNode(n){if(n.id===id)return n;for(const c of(n.children||[])){const f=findNode(c);if(f)return f}return null}
    const node=findNode(data)
    setCollapsed(prev=>{
      const s=new Set(prev);s.delete(id)
      ;(node?.children||[]).forEach(c=>{if(c.children&&c.children.length>0)s.add(c.id)})
      return s
    })
  },[data])

  const draw=useCallback(()=>{
    const canvas=cvs.current;if(!canvas)return
    const tree=treeRef.current;if(!tree)return
    const dpr=window.devicePixelRatio||1
    const CW=canvas.clientWidth,CH=canvas.clientHeight
    if(CW===0||CH===0)return
    canvas.width=CW*dpr;canvas.height=CH*dpr
    const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr)
    const dark=document.documentElement.dataset.theme!=='light'
    ctx.fillStyle=dark?'#0d0d0f':'#f5f4f0';ctx.fillRect(0,0,CW,CH)
    const gs=28*zoom,ox=((pan.x*zoom%gs)+gs)%gs,oy=((pan.y*zoom%gs)+gs)%gs
    ctx.fillStyle=dark?'rgba(255,255,255,0.035)':'rgba(0,0,0,0.045)'
    for(let gx=ox;gx<CW;gx+=gs)for(let gy=oy;gy<CH;gy+=gs){ctx.beginPath();ctx.arc(gx,gy,1.1,0,Math.PI*2);ctx.fill()}
    ctx.save();ctx.translate(CW/2+pan.x*zoom,CH/2+pan.y*zoom);ctx.scale(zoom,zoom)
    const col=colRef.current,nodes=flatNodes(tree,col)
    drawScene(ctx,nodes,col,dark,selectedId,hovRef.current)
    ctx.restore()
  },[zoom,pan,selectedId,hov,data,collapsed])

  useEffect(()=>{requestAnimationFrame(draw)},[draw])
  useEffect(()=>{
    if(!cvs.current)return
    const ro=new ResizeObserver(()=>requestAnimationFrame(draw));ro.observe(cvs.current)
    return()=>ro.disconnect()
  },[draw])

  const hitNode=useCallback((ex,ey)=>{
    if(!cvs.current||!treeRef.current)return null
    const W=cvs.current.clientWidth,H=cvs.current.clientHeight
    const wx=(ex-W/2)/zoom-pan.x,wy=(ey-H/2)/zoom-pan.y
    const nodes=flatNodes(treeRef.current,colRef.current)
    for(let i=nodes.length-1;i>=0;i--){
      const n=nodes[i],w=n.d===0?RW:NW,h=n.d===0?RH:NH
      if(wx>=n._x&&wx<=n._x+w&&wy>=n._y&&wy<=n._y+h)return n
    }
    return null
  },[zoom,pan])

  const isOnBtn=useCallback((n,ex,ey)=>{
    if(!n.children||!n.children.length)return false
    const W=cvs.current.clientWidth,H=cvs.current.clientHeight
    const wx=(ex-W/2)/zoom-pan.x,wy=(ey-H/2)/zoom-pan.y
    const w=n.d===0?RW:NW,bx=n._x+w-BR-5,by=n._cy
    return Math.hypot(wx-bx,wy-by)<=BR+4
  },[zoom,pan])

  // ── Mouse events ─────────────────────────────────────────
  const onDown=useCallback(e=>{
    if(e.button!==0)return
    const rect=cvs.current.getBoundingClientRect()
    const ex=e.clientX-rect.left,ey=e.clientY-rect.top
    const n=hitNode(ex,ey)
    if(n){if(isOnBtn(n,ex,ey)){colRef.current.has(n.id)?openNode(n.id):toggle(n.id);return}setSelectedId(n.id)}
    else{setSelectedId(null);panning.current=true;ps.current={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y}}
  },[hitNode,isOnBtn,openNode,toggle,pan,setSelectedId])

  const onMove=useCallback(e=>{
    if(panning.current){
      const dx=(e.clientX-ps.current.x)/zoom,dy=(e.clientY-ps.current.y)/zoom
      setPan({x:ps.current.px+dx,y:ps.current.py+dy});return
    }
    const rect=cvs.current.getBoundingClientRect()
    const n=hitNode(e.clientX-rect.left,e.clientY-rect.top)
    const id=n?.id||null
    if(id!==hovRef.current){hovRef.current=id;setHov(id);cvs.current.style.cursor=id?'pointer':'grab'}
  },[hitNode,zoom,setPan])

  const onUp=useCallback(()=>{panning.current=false},[])

  const onDbl=useCallback(e=>{
    const rect=cvs.current.getBoundingClientRect()
    const ex=e.clientX-rect.left,ey=e.clientY-rect.top
    const n=hitNode(ex,ey)
    if(n&&!isOnBtn(n,ex,ey))onEdit(n)
  },[hitNode,isOnBtn,onEdit])

  const onWheel=useCallback(e=>{
    e.preventDefault()
    setZoom(z=>Math.min(Math.max(z*(e.deltaY<0?1.12:0.89),0.1),5))
  },[setZoom])

  // ── Touch events (mobile) ────────────────────────────────
  const onTouchStart=useCallback(e=>{
    e.preventDefault()
    const rect=cvs.current.getBoundingClientRect()
    if(e.touches.length===1){
      const t=e.touches[0]
      const ex=t.clientX-rect.left,ey=t.clientY-rect.top
      touches.current={id:t.identifier,x:t.clientX,y:t.clientY,time:Date.now(),ex,ey}
      lastPinchDist.current=null
      panning.current=true
      ps.current={x:t.clientX,y:t.clientY,px:pan.x,py:pan.y}
    } else if(e.touches.length===2){
      panning.current=false
      const t1=e.touches[0],t2=e.touches[1]
      lastPinchDist.current=Math.hypot(t2.clientX-t1.clientX,t2.clientY-t1.clientY)
    }
  },[pan])

  const onTouchMove=useCallback(e=>{
    e.preventDefault()
    if(e.touches.length===1&&panning.current){
      const t=e.touches[0]
      const dx=(t.clientX-ps.current.x)/zoom,dy=(t.clientY-ps.current.y)/zoom
      setPan({x:ps.current.px+dx,y:ps.current.py+dy})
    } else if(e.touches.length===2){
      const t1=e.touches[0],t2=e.touches[1]
      const dist=Math.hypot(t2.clientX-t1.clientX,t2.clientY-t1.clientY)
      if(lastPinchDist.current){
        const factor=dist/lastPinchDist.current
        setZoom(z=>Math.min(Math.max(z*factor,0.1),5))
      }
      lastPinchDist.current=dist
    }
  },[zoom,setPan,setZoom])

  const onTouchEnd=useCallback(e=>{
    e.preventDefault()
    panning.current=false
    lastPinchDist.current=null
    // Tap detection (short touch = click)
    if(e.changedTouches.length===1&&touches.current.time){
      const dt=Date.now()-touches.current.time
      const t=e.changedTouches[0]
      const dx=Math.abs(t.clientX-touches.current.x),dy=Math.abs(t.clientY-touches.current.y)
      if(dt<300&&dx<10&&dy<10){
        // single tap = click
        const rect=cvs.current.getBoundingClientRect()
        const ex=touches.current.ex,ey=touches.current.ey
        const n=hitNode(ex,ey)
        if(n){
          if(isOnBtn(n,ex,ey)){colRef.current.has(n.id)?openNode(n.id):toggle(n.id)}
          else setSelectedId(n.id)
        } else setSelectedId(null)
        // double tap = edit
        if(touches.current.lastTap&&Date.now()-touches.current.lastTap<400){
          const n=hitNode(ex,ey)
          if(n&&!isOnBtn(n,ex,ey))onEdit(n)
        }
        touches.current.lastTap=Date.now()
      }
    }
  },[hitNode,isOnBtn,openNode,toggle,setSelectedId,onEdit])

  useEffect(()=>{
    const canvas=cvs.current;if(!canvas)return
    canvas.addEventListener('touchstart',onTouchStart,{passive:false})
    canvas.addEventListener('touchmove',onTouchMove,{passive:false})
    canvas.addEventListener('touchend',onTouchEnd,{passive:false})
    return()=>{
      canvas.removeEventListener('touchstart',onTouchStart)
      canvas.removeEventListener('touchmove',onTouchMove)
      canvas.removeEventListener('touchend',onTouchEnd)
    }
  },[onTouchStart,onTouchMove,onTouchEnd])

  useEffect(()=>{
    const h=e=>{
      if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName))return
      if((e.key==='Delete'||e.key==='Backspace')&&selectedId&&selectedId!=='root')onDelete(selectedId)
      if((e.key==='n'||e.key==='N')&&selectedId)onAddChild(selectedId)
      if(e.key==='Escape')setSelectedId(null)
      if(e.key===' '&&selectedId){e.preventDefault();colRef.current.has(selectedId)?openNode(selectedId):toggle(selectedId)}
    }
    window.addEventListener('keydown',h)
    return()=>window.removeEventListener('keydown',h)
  },[selectedId,onDelete,onAddChild,setSelectedId,openNode,toggle])

  return(
    <div className="mindmap-container">
      <canvas
        ref={cvs} className="mindmap-canvas"
        onMouseDown={onDown} onMouseMove={onMove}
        onMouseUp={onUp} onMouseLeave={onUp}
        onDoubleClick={onDbl} onWheel={onWheel}
      />
      {selectedId&&selectedId!=='root'&&(
        <div className="node-actions">
          <button onClick={()=>onAddChild(selectedId)}>+ Node</button>
          <button onClick={()=>{
            const n=flatNodes(treeRef.current||{children:[]},colRef.current).find(x=>x.id===selectedId)
            if(n)onEdit(n)
          }}>✏ Edit</button>
          <button onClick={()=>colRef.current.has(selectedId)?openNode(selectedId):toggle(selectedId)}>
            {collapsed.has(selectedId)?'▶ Ochish':'▼ Yopish'}
          </button>
          <button className="del-btn" onClick={()=>onDelete(selectedId)}>✕</button>
        </div>
      )}
    </div>
  )
})

export default MindMap
