import {useState} from 'react'

const base='/case01/inputs/'
const examples=[
 {tab:'祛痘沐浴露',title:'真实产品与生活场景结合，形成清爽、有说服力的青少年护理画面。',assets:[['showcase/bodywash-product.webp','祛痘沐浴露产品素材'],['source-logo.png','品牌 Logo']],copy:'12岁+青少年专研 / 浴后保湿 祛痘不易干燥',reference:'showcase/bodywash-reference.png',result:'/case01/featured/featured-01.webp'},
 {tab:'去黑头贴',title:'从真实包装出发，强化产品功能与使用场景的直观表达。',assets:[['showcase/blackhead-product.webp','去黑头组合产品素材'],['source-logo.png','品牌 Logo']],copy:'黑头“吸尘器” / 使用三步曲 细腻收毛孔',reference:'showcase/blackhead-reference.png',result:'/case01/featured/featured-07.webp'},
 {tab:'护手霜',title:'围绕学生送礼场景，组织产品组合、色彩与节日氛围。',assets:[['showcase/handcream-product.webp','护手霜三支装产品素材'],['source-logo.png','品牌 Logo']],copy:'学生党送礼实用礼物 / 青少年专研护手霜3支装',reference:'showcase/handcream-reference.png',result:'/case01/featured/featured-05.webp'},
 {tab:'修护面膜',title:'将包装质感、成分卖点与清透护肤氛围统一到一张画面。',assets:[['showcase/mask-product.webp','清润修护面膜产品素材'],['cream-badge.png','儿童化妆品图标'],['source-logo.png','品牌 Logo']],copy:'平衡水油 稳韧青春肌 / 15min舒缓小红脸',reference:'showcase/mask-reference.png',result:'/case01/featured/featured-09.webp'},
 {tab:'小暖霜',title:'用真实产品与温暖生活场景，呈现儿童秋冬保湿主题。',assets:[['cream-product.png','小暖霜产品素材'],['cream-badge.png','儿童化妆品图标'],['source-logo.png','品牌 Logo']],copy:'1抹爆珠 水润舒干痒 / 宝宝小脸润嘟嘟',reference:'reference-2.png',result:'/case01/featured/featured-04.webp'}
]

export default function InputExamples(){
 const [active,setActive]=useState(0)
 const e=examples[active]
 const reference=base+e.reference
 return <section className="cs-input-examples" id="inputs">
  <div className="cs-section-line"><span>FROM INPUT TO OUTPUT</span><span>真实素材 × 参考图 × AI 结果</span></div>
  <div className="cs-section-heading"><h2>从真实素材<br/><em>到最终画面</em></h2><p>五组代表案例分别对应真实产品素材、视觉参考与最终成品，清晰呈现从输入到输出的设计链路。</p></div>
  <div className="cs-evolution-tabs cs-input-tabs" role="group" aria-label="输入输出示例">{examples.map((item,i)=><button key={item.tab} aria-pressed={active===i} onClick={()=>setActive(i)}><small>0{i+1}</small>{item.tab}</button>)}</div>
  <h3 className="cs-input-title">{e.title}</h3>
  <div className="cs-material-panel">
   <span className="cs-label">01 / UPLOAD · 产品与品牌素材</span>
   <div className="cs-material-grid">{e.assets.map(([file,label])=><figure key={file}><a href={base+file} target="_blank" rel="noreferrer"><img src={base+file} alt={label}/></a><figcaption>{label}</figcaption></figure>)}</div>
   <div className="cs-material-copy"><small>文案输入</small><p>{e.copy}</p></div>
  </div>
  <div className="cs-reference-output">
   <figure className="cs-compare-card cs-reference-card"><figcaption><span>02 / REFERENCE · 上传参考图</span><a href={reference} target="_blank" rel="noreferrer">查看来源 ↗</a></figcaption><a href={reference} target="_blank" rel="noreferrer"><img src={reference} alt={e.tab+'上传参考图'}/></a></figure>
   <div className="cs-compare-arrow" aria-hidden="true"><span>REFERENCE + ASSETS</span><b>→</b><em>AI</em></div>
   <figure className="cs-compare-card cs-result-card"><figcaption><span>03 / OUTPUT · 实际生成结果</span><a href={e.result} target="_blank" rel="noreferrer">查看原图 ↗</a></figcaption><a href={e.result} target="_blank" rel="noreferrer"><img src={e.result} alt={e.tab+'实际生成结果'}/></a></figure>
  </div>
  <p className="cs-case-summary">每组均使用对应任务的真实产品素材、参考图与最终成品，完整呈现从输入到输出的实际设计链路。</p>
 </section>
}
