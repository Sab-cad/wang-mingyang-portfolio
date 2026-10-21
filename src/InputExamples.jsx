import {useState} from 'react'

const base='/case01/inputs/'
const examples=[
 {tab:'青三祛痘套装',title:'同一组产品素材，沿着参考图的场景逻辑生成新画面。',assets:[['suite-product.png','青三套装产品素材'],['source-logo.png','品牌 Logo']],copy:'一套控油祛痘保湿 / 出游送礼不出错',input:'青三套装白底产品图与品牌 Logo，锁定真实包装、数量和品牌识别。',reference:'参考图提供秋日车窗、旅行氛围、暖色光线与前景陈列关系，不复制参考图中的产品与文字。',process:'AI 保留参考图的空间气氛，将真实青三套装重新置入场景，并按本次文案重建标题层级与品牌信息。',output:'形成一张秋日出游主题的青三套装推广图，产品、场景与销售信息统一成完整画面。'},
 {tab:'儿童面霜',title:'让参考构图、真实产品与品牌模特在同一画面里成立。',assets:[['cream-product.png','面霜产品素材'],['cream-model.png','品牌模特素材'],['cream-badge.png','儿童化妆品图标'],['source-logo.png','品牌 Logo']],copy:'KO秋冬红敏！ / 小脸水嫩嫩',input:'面霜产品、品牌小女孩模特、儿童化妆品图标与 Logo，共同锁定产品和人物依据。',reference:'参考图提供人物与产品的比例、秋季色彩和视觉重心，作为场景与构图方向。',process:'AI 延续模特形象与点涂动作，结合手持产品近景、秋日背景和信息排版，重新组织完整画面。',output:'生成一张人物互动明确、产品展示突出、秋冬护理主题完整的推广图。'},
 {tab:'去黑头组合',title:'把包装素材与参考陈列关系，转化为更完整的商业画面。',assets:[['blackhead-product.jpg','袋装与外盒素材'],['source-logo.png','品牌 Logo']],copy:'使用三步曲 细腻收毛孔 / 无酸溶解不刺激',input:'去黑头组合的袋装、外盒产品素材与品牌 Logo，提供真实包装、色彩和套装数量依据。',reference:'参考图提供红色视觉基调、产品阵列与促销画面的信息密度，作为构图方向。',process:'AI 围绕核心文案重建红黄配色、前后陈列与透视关系，再将标题和卖点图标纳入统一版式。',output:'生成一张主体突出、包装陈列有层次、卖点阅读路径清楚的红色推广图。'}
]

export default function InputExamples(){
 const [active,setActive]=useState(0)
 const e=examples[active]
 const result=base+`selected-result-${active+1}.png`
 const reference=base+`reference-${active+1}.png`
 return <section className="cs-input-examples" id="inputs">
  <div className="cs-section-line"><span>FROM INPUT TO OUTPUT</span><span>真实素材 × 参考图 × AI 结果</span></div>
  <div className="cs-section-heading"><h2>上传了什么，<br/><em>最终生成了什么。</em></h2><p>每个案例都对应同一条真实生产链路：产品与品牌素材锁定事实，参考图定义视觉方向，AI 完成场景、构图和信息表达。</p></div>
  <div className="cs-evolution-tabs" role="group" aria-label="输入输出示例">{examples.map((item,i)=><button key={item.tab} aria-pressed={active===i} onClick={()=>setActive(i)}>{item.tab}</button>)}</div>
  <h3 className="cs-input-title">{e.title}</h3>
  <div className="cs-material-panel">
   <span className="cs-label">01 / UPLOAD · 产品与品牌素材</span>
   <div className="cs-material-grid">{e.assets.map(([file,label])=><figure key={file}><a href={base+file} target="_blank" rel="noreferrer"><img src={base+file} alt={label}/></a><figcaption>{label}</figcaption></figure>)}</div>
   <div className="cs-material-copy"><small>文案输入</small><p>{e.copy}</p></div>
  </div>
  <div className="cs-reference-output">
   <figure className="cs-compare-card cs-reference-card"><figcaption><span>02 / REFERENCE · 上传参考图</span><a href={reference} target="_blank" rel="noreferrer">查看来源 ↗</a></figcaption><a href={reference} target="_blank" rel="noreferrer"><img className={'cs-reference-image cs-reference-image-'+(active+1)} src={reference} alt={e.tab+'上传参考图'}/></a></figure>
   <div className="cs-compare-arrow" aria-hidden="true"><span>REFERENCE + ASSETS</span><b>→</b><em>AI</em></div>
   <figure className="cs-compare-card cs-result-card"><figcaption><span>03 / OUTPUT · 实际生成结果</span><a href={result} target="_blank" rel="noreferrer">查看原图 ↗</a></figcaption><a href={result} target="_blank" rel="noreferrer"><img src={result} alt={e.tab+'实际生成结果'}/></a></figure>
  </div>
  <p className="cs-case-summary">以真实产品与品牌素材为基础，提取参考图的构图和氛围，再由 AI 完成本次推广图的场景、产品与文案表达。</p>
 </section>
}
