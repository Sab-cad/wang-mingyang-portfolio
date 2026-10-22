import {useState,useRef} from 'react'
import allWorks from '../data/case01-batch.json'

const keptCategories=['儿童润唇膏','孕产AI样图','抚触油','小暖霜','护手霜']
const works=allWorks.filter(work=>keptCategories.includes(work.category))
const categories=keptCategories.filter(category=>works.some(work=>work.category===category))

export default function BatchGallery(){
 const [category,setCategory]=useState('全部')
 const [query,setQuery]=useState('')
 const [page,setPage]=useState(0)
 const [current,setCurrent]=useState(0)
 const modal=useRef(null)
 const heading=useRef(null)
 const filtered=works.filter(work=>(category==='全部'||work.category===category)&&`${work.number} ${work.category}`.toLowerCase().includes(query.trim().toLowerCase()))
 const pages=Math.ceil(filtered.length/30)
 const visible=filtered.slice(page*30,page*30+30)
 const selected=filtered[current]
 function changePage(next){setPage(next);heading.current?.scrollIntoView({block:'start'})}
 function move(delta){setCurrent(index=>(index+delta+filtered.length)%filtered.length)}
 function open(work){setCurrent(filtered.indexOf(work));modal.current.showModal()}
 return <section className="cs-gallery cs-batch" id="works">
  <div className="cs-section-line"><span>05 / 精选批量作品</span><span>2026.09 · 真实项目产出</span></div>
  <div className="cs-section-heading"><h2>批量创作<br/><em>精选结果</em></h2><p>精选儿童润唇膏、孕产、抚触油、小暖霜与护手霜五类作品，集中展示稳定的批量产出能力。</p></div>
  <div className="cs-batch-summary"><b>{works.length} <small>张 AI 样图</small></b><b>{categories.length} <small>个产品分组</small></b><span>保留原图 · 按原表编号展示</span></div>
  <div className="cs-batch-tools" ref={heading}>
   <label>产品分组<select value={category} onChange={event=>{setCategory(event.target.value);setPage(0);setCurrent(0)}}><option value="全部">全部作品（{works.length}）</option>{categories.map(item=><option key={item} value={item}>{item}（{works.filter(work=>work.category===item).length}）</option>)}</select></label>
   <label>搜索作品<input type="search" value={query} onChange={event=>{setQuery(event.target.value);setPage(0);setCurrent(0)}} placeholder="产品名称或编号，如 AI-023"/></label>
   <span role="status">共 {filtered.length} 张{filtered.length>0&&` · 当前 ${page*30+1}—${Math.min((page+1)*30,filtered.length)}`}</span>
  </div>
  <div className="cs-gallery-grid">{visible.map(work=><button className="cs-work-card" key={work.number} onClick={()=>open(work)} aria-label={'查看 '+work.number+' '+work.category}><img src={work.src} alt={work.title} loading="lazy" decoding="async"/><span><small>{work.number}</small><b>{work.category}</b><i>↗</i></span></button>)}</div>
  {!filtered.length&&<p className="cs-batch-empty">没有匹配作品，请调整产品分组或搜索词。<button onClick={()=>{setCategory('全部');setQuery('');setPage(0);setCurrent(0)}}>查看全部作品</button></p>}
  {pages>1&&<nav className="cs-batch-pages" aria-label="作品分页"><button disabled={page===0} onClick={()=>changePage(page-1)}>← 上一页</button>{Array.from({length:pages},(_,index)=><button key={index} aria-current={page===index?'page':undefined} onClick={()=>changePage(index)}>{index+1}</button>)}<button disabled={page===pages-1} onClick={()=>changePage(page+1)}>下一页 →</button></nav>}
  <p className="cs-gallery-note">当前展示从 9 月项目归档中筛选的五类作品，保留原始编号；原图中的价格与活动信息为历史画面内容。</p>
  <dialog className="cs-image-dialog" ref={modal} aria-label="AI 推广图原图查看" onKeyDown={event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}if(event.key==='ArrowRight'){event.preventDefault();move(1)}}} onClick={event=>{if(event.target===modal.current)modal.current.close()}}>
   <button className="cs-dialog-close" autoFocus onClick={()=>modal.current.close()}>关闭 ×</button>
   {selected&&<><img src={selected.src} alt={selected.title}/><div className="cs-batch-viewer-nav"><button onClick={()=>move(-1)} aria-label="上一张作品">←</button><p>{selected.number} · {selected.category}<small>{current+1} / {filtered.length} · 支持键盘左右切换</small></p><button onClick={()=>move(1)} aria-label="下一张作品">→</button></div><a className="cs-original-link" href={selected.src} target="_blank" rel="noreferrer">独立查看原图 ↗</a></>}
  </dialog>
 </section>
}
