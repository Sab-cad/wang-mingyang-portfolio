import {useState} from 'react'

export default function ResumeIntro(){
  const [flipped,setFlipped]=useState(false)
  return <section className={`replica-hero${flipped?' is-flipped':''}`} id="resume">
    <div className="replica-orbits" aria-hidden="true"><i/><i/><i/><i/></div>
    <div className="replica-node replica-node-a"><b>✦</b><span>AI 设计<small>GENERATIVE / 01</small></span></div>
    <div className="replica-node replica-node-b"><span>品牌视觉<small>BRAND / 02</small></span><b>◎</b></div>
    <div className="replica-node replica-node-c"><b>＋</b><span>自动化系统<small>AUTOMATION / 03</small></span></div>
    <div className="replica-node replica-node-d"><span>创意落地<small>DELIVERY / 04</small></span><b>↗</b></div>

    <div className="replica-flip">
      <div className="replica-face replica-front">
        <span className="replica-badge">● 王名杨 · 美术指导 / AI 视觉设计 ↗</span>
        <h1>让创意被看见<br/><em>让效率被重新设计</em></h1>
        <p>5 年以上电商视觉设计经验。连接品牌、产品与生成式技术，<br/>让视觉方案更快进入真实业务，并形成可持续复用的创作系统。</p>
        <div className="replica-actions"><a href="#selected">查看作品 <i>↗</i></a><button className="replica-primary" onClick={()=>setFlipped(true)}>查看个人简历</button></div>
      </div>

      <div className="replica-face replica-back">
        <div className="resume-back-head"><div><span>PROFILE / 个人简历</span><h2>王名杨</h2><p>美术指导 · AI 设计师 · AIGC 视觉设计师</p></div><div className="resume-back-meta"><b>5+</b><span>YEARS OF<br/>EXPERIENCE</span></div><button onClick={()=>setFlipped(false)}>返回正面 ↙</button></div>
        <div className="resume-back-grid">
          <div className="resume-back-about"><span>ABOUT / 个人简介</span><p>拥有 5 年以上电商视觉设计经验，具备从创意构思、视觉方案到素材交付的完整能力。现以美术指导视角推进 AI 设计应用，聚焦推广图批量自动化与项目创意快速落地。</p><p>结合品牌调性、产品卖点与推广需求，将 AI 生成能力应用于实际设计任务，并通过人工设计判断把控产品准确性、信息层级与品牌一致性。</p><dl><div><dt>电话</dt><dd><a href="tel:19924329234">199 2432 9234</a></dd></div><div><dt>邮箱</dt><dd><a href="mailto:1330255896@qq.com">1330255896@qq.com</a></dd></div><div><dt>学历</dt><dd>本科 · 视觉传达艺术设计</dd></div></dl><div className="resume-capabilities"><span>CORE CAPABILITIES</span><p>AI 批量自动化出图</p><p>创意方案快速落地</p><p>电商视觉与品牌表达</p><p>AI 生成与人工精修</p></div></div>
          <div className="resume-back-exp"><span>EXPERIENCE / 工作经历</span><article><time>现在</time><div><b>袋鼠妈妈</b><h3>美术指导 / AI 设计方向</h3><p>负责 AI 视觉方向与品质把控，推动推广图批量生产、创意方案可视化及设计流程自动化；统筹产品、文案与参考素材，将生成结果优化至实际交付标准。</p></div></article><article><time>2025.02—2026.02</time><div><b>广州尊蓝生物科技有限公司</b><h3>电商视觉设计 / AI 赋能设计</h3><p>负责首页、活动页与详情页视觉；参与大促创意及 AI 工具、素材资源与工作流程搭建，支持团队效率提升。</p></div></article><article><time>2022.06—2024.12</time><div><b>广州爱居科技有限公司</b><h3>电商视觉设计</h3><p>负责店铺首页、专题页、主图、详情页和营销素材，并完成 PC 与移动端适配及持续迭代。</p></div></article></div>
        </div>
        <div className="resume-back-foot"><div><span>SELECTED PRACTICE</span><p>AI 推广图批量自动化生产 · 项目创意快速可视化与落地</p></div><div><span>TOOLS / 专业工具</span><p>Photoshop · Stable Diffusion · ComfyUI · Midjourney · Lovart · 即梦 AI</p></div></div>
      </div>
    </div>

    <div className="replica-bottom"><span><b>↓</b> 01 / 04 · SCROLL DOWN</span><span>CREATIVE SYSTEMS <i/><i/><i/></span></div>
  </section>
}
