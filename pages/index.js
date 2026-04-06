import { useState, useRef } from "react";

const PASSWORD="Kairoz2026!";

function LoginScreen({onLogin}){
  const[pass,setPass]=useState("");
  const[error,setError]=useState(false);
  const check=()=>{if(pass===PASSWORD){onLogin();}else{setError(true);setTimeout(()=>setError(false),2000);}};
  return(
    <div style={{minHeight:"100vh",background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <div style={{background:"#16161f",borderRadius:16,padding:"2rem",width:"100%",maxWidth:360,border:"0.5px solid rgba(255,255,255,0.07)"}}>
        <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
          <div style={{fontSize:40,marginBottom:8}}>🔐</div>
          <div style={{color:"#818cf8",fontWeight:800,fontSize:24}}>Kairoz<span style={{color:"#c084fc"}}>Distri</span></div>
          <div style={{color:"#64748b",fontSize:13,marginTop:6}}>Introduce tu contraseña para acceder</div>
        </div>
        <input value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&check()} type="password" placeholder="Contraseña"
          style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${error?"#f87171":"rgba(255,255,255,0.13)"}`,background:"#111118",color:"#fff",fontSize:16,outline:"none",marginBottom:10,boxSizing:"border-box"}}/>
        {error&&<div style={{color:"#f87171",fontSize:13,marginBottom:8,textAlign:"center"}}>Contraseña incorrecta</div>}
        <button onClick={check} style={{width:"100%",background:"linear-gradient(135deg,#6366f1,#7c3aed)",color:"#fff",border:"none",padding:"13px",borderRadius:10,cursor:"pointer",fontSize:15,fontWeight:800}}>Entrar</button>
      </div>
    </div>
  );
}

const D={bg:"#0a0a0f",surface:"#111118",card:"#16161f",border:"rgba(255,255,255,0.07)",borderMed:"rgba(255,255,255,0.13)",primary:"#f1f5f9",muted:"#64748b",faint:"#334155",accent:"#818cf8",accentD:"#4f46e5",accentL:"rgba(129,140,248,0.12)",green:"#4ade80",greenD:"#16a34a",greenL:"rgba(74,222,128,0.12)",red:"#f87171",redD:"#dc2626",redL:"rgba(248,113,113,0.12)",amber:"#fbbf24",amberD:"#d97706",amberL:"rgba(251,191,36,0.12)",purple:"#c084fc",purpleL:"rgba(192,132,252,0.12)",cyan:"#22d3ee",cyanL:"rgba(34,211,238,0.12)"};
const VAT=0.21;
const REFERRAL={Beauty:0.08,Health:0.08,Grocery:0.08,HomeKitchen:0.15,Default:0.15};
const FBA_T=[{max:0.1,fee:2.46},{max:0.2,fee:2.63},{max:0.5,fee:3.06},{max:1.0,fee:3.48},{max:2.0,fee:4.29},{max:5.0,fee:5.26},{max:10,fee:6.69},{max:20,fee:9.44}];
const fbaFee=w=>(FBA_T.find(r=>w<=r.max)||{fee:11.87}).fee;
const r2=n=>Math.round(n*100)/100;

function calcProfit(buyPrice,amzPrice,weight,cat){
  const refPct=REFERRAL[cat]??REFERRAL.Default;
  const bp=parseFloat(buyPrice)||0,ap=parseFloat(amzPrice)||0,w=parseFloat(weight)||0.5;
  if(!bp||!ap)return{net:0,roi:0,margin:0,ref:0,fba:0,ship:0,refPct,ok:false};
  const amzExVAT=ap/(1+VAT),buyExVAT=bp/(1+VAT);
  const ref=ap*refPct,fba=fbaFee(w),ship=Math.max(0.30,w*0.45);
  const vatNet=(ap-amzExVAT)-(bp-buyExVAT);
  const net=amzExVAT-buyExVAT-ref-fba-ship-vatNet;
  return{net:r2(net),roi:r2((net/bp)*100),margin:r2((net/ap)*100),ref:r2(ref),fba:r2(fba),ship:r2(ship),refPct,ok:true};
}

function calcScore(roi,bsr,sellers,amzSells,trend){
  const roiS=roi>=60?30:roi>=40?25:roi>=25?18:roi>=15?10:roi>=0?4:0;
  const bsrS=bsr<=500?25:bsr<=1000?22:bsr<=3000?18:bsr<=10000?12:bsr<=30000?6:0;
  let compS=sellers<=2?20:sellers<=5?16:sellers<=10?10:sellers<=20?4:0;
  if(amzSells)compS=Math.max(0,compS-10);
  const total=Math.min(100,roiS+bsrS+compS+10+(trend==="up"?10:trend==="flat"?5:0));
  const flags=[];
  if(amzSells)flags.push("AMAZON_SELLS");
  if(trend==="down")flags.push("PRICE_FALLING");
  if(roi<15)flags.push("LOW_MARGIN");
  if(sellers>20)flags.push("HIGH_COMPETITION");
  return{total,flags,level:total>=70?"high":total>=45?"medium":"low",rec:total>=70&&!flags.length?"BUY":total>=45?"WATCH":"SKIP"};
}

const BASE_CAT=[
  {id:"b1",name:"Detergente Ariel 26 lav.",brand:"Ariel",ean:"4084500572096",cat:"HomeKitchen",emoji:"🧹",buyPrice:5.80,store:"Alcampo",storeUrl:"https://www.compraonline.alcampo.es/search?q=ariel+detergente",amzUrl:"https://www.amazon.es/s?k=ariel+detergente+26+lavados",amzPrice:11.99,weight:1.1,bsr:620,sellers:5,amzSells:false,trend:"up",dailySales:2.4},
  {id:"b2",name:"Papel Higiénico Scottex x24",brand:"Scottex",ean:"8006540891254",cat:"HomeKitchen",emoji:"🧻",buyPrice:6.90,store:"El Corte Inglés",storeUrl:"https://www.elcorteingles.es/supermercado/buscar/?s=scottex+papel+higienico",amzUrl:"https://www.amazon.es/s?k=scottex+papel+higienico+x24",amzPrice:15.99,weight:2.2,bsr:390,sellers:4,amzSells:false,trend:"up",dailySales:3.7},
  {id:"b3",name:"Pasta Colgate Total 75ml",brand:"Colgate",ean:"8714789961187",cat:"Health",emoji:"🦷",buyPrice:1.50,store:"Makro",storeUrl:"https://www.makro.es/search?query=colgate+total",amzUrl:"https://www.amazon.es/s?k=colgate+total+75ml",amzPrice:3.99,weight:0.09,bsr:510,sellers:6,amzSells:false,trend:"up",dailySales:2.9},
  {id:"b4",name:"Lejía Conejo 2L",brand:"Conejo",ean:"8410495009056",cat:"HomeKitchen",emoji:"🪣",buyPrice:1.20,store:"Mercadona",storeUrl:"https://tienda.mercadona.es/search?query=lejia+conejo",amzUrl:"https://www.amazon.es/s?k=lejia+conejo+2l",amzPrice:3.29,weight:2.1,bsr:740,sellers:5,amzSells:false,trend:"up",dailySales:2.6},
  {id:"b5",name:"Desodorante Dove 150ml",brand:"Dove",ean:"5000238614181",cat:"Beauty",emoji:"🧴",buyPrice:2.10,store:"Makro",storeUrl:"https://www.makro.es/search?query=dove+desodorante",amzUrl:"https://www.amazon.es/s?k=dove+desodorante+150ml",amzPrice:4.99,weight:0.18,bsr:1240,sellers:8,amzSells:false,trend:"up",dailySales:1.5},
  {id:"b6",name:"Gel Nivea 750ml",brand:"Nivea",ean:"4005808737406",cat:"Beauty",emoji:"🚿",buyPrice:2.50,store:"Alcampo",storeUrl:"https://www.compraonline.alcampo.es/search?q=nivea+gel",amzUrl:"https://www.amazon.es/s?k=nivea+gel+ducha+750ml",amzPrice:5.49,weight:0.8,bsr:960,sellers:7,amzSells:false,trend:"up",dailySales:1.8},
  {id:"b7",name:"Servilletas Scottex x150",brand:"Scottex",ean:"8006540612330",cat:"HomeKitchen",emoji:"🤧",buyPrice:1.80,store:"Mercadona",storeUrl:"https://tienda.mercadona.es/search?query=servilletas+scottex",amzUrl:"https://www.amazon.es/s?k=servilletas+scottex+150",amzPrice:4.19,weight:0.38,bsr:680,sellers:6,amzSells:false,trend:"up",dailySales:3.0},
  {id:"b8",name:"Suavizante Lenor 2L",brand:"Lenor",ean:"8001841551968",cat:"HomeKitchen",emoji:"👕",buyPrice:3.90,store:"Carrefour",storeUrl:"https://www.carrefour.es/supermercado/search?query=lenor+suavizante",amzUrl:"https://www.amazon.es/s?k=lenor+suavizante+2l",amzPrice:6.99,weight:2.05,bsr:1420,sellers:10,amzSells:false,trend:"flat",dailySales:1.4},
  {id:"b9",name:"Jabón Palmolive x10",brand:"Palmolive",ean:"8714789961100",cat:"Beauty",emoji:"🧼",buyPrice:1.20,store:"Makro",storeUrl:"https://www.makro.es/search?query=palmolive+jabon",amzUrl:"https://www.amazon.es/s?k=palmolive+jabon+liquido",amzPrice:2.89,weight:0.3,bsr:1800,sellers:6,amzSells:false,trend:"up",dailySales:2.1},
  {id:"b10",name:"Colonia Nenuco 600ml",brand:"Nenuco",ean:"8410289004006",cat:"Health",emoji:"👶",buyPrice:4.20,store:"Mercadona",storeUrl:"https://tienda.mercadona.es/search?query=nenuco+colonia",amzUrl:"https://www.amazon.es/s?k=nenuco+colonia+600ml",amzPrice:7.49,weight:0.65,bsr:1890,sellers:9,amzSells:false,trend:"up",dailySales:1.3},
];

function useStorage(key,init){
  const[val,setVal]=useState(init);
  const set=v=>{const nv=typeof v==="function"?v(val):v;setVal(nv);try{if(typeof window!=="undefined")sessionStorage.setItem(key,JSON.stringify(nv));}catch{}};
  return[val,set];
}

const EMPTY_P={id:0,name:"",brand:"",ean:"",cat:"HomeKitchen",emoji:"📦",buyPrice:"",store:"",storeUrl:"",amzUrl:"",amzPrice:"",weight:"",bsr:"",sellers:"",amzSells:false,trend:"flat",dailySales:""};
const LCFG={high:{c:D.green,bg:D.greenL,l:"Alta"},medium:{c:D.amber,bg:D.amberL,l:"Media"},low:{c:D.red,bg:D.redL,l:"Baja"}};
const CATS=[{v:"Beauty",l:"Beauty (8%)"},{v:"Health",l:"Health (8%)"},{v:"Grocery",l:"Grocery (8%)"},{v:"HomeKitchen",l:"Home Kitchen (15%)"},{v:"OfficeProducts",l:"Office (15%)"}];
const TRENDS=[{v:"up",l:"↑ Subiendo"},{v:"flat",l:"→ Estable"},{v:"down",l:"↓ Bajando"}];
const EMOJIS=["📦","🧴","🧹","💆","🧻","👶","🍽","🦷","👕","🚿","🪣","🌿","🤧","🧼","💊","🍞","☕","🥤"];

const Card=({children,style={},...p})=><div style={{background:D.card,borderRadius:12,border:`0.5px solid ${D.border}`,padding:"0.9rem 1rem",...style}}{...p}/>;
const Pill=({children,c,bg})=><span style={{background:bg,color:c,fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:999,whiteSpace:"nowrap",border:`0.5px solid ${c}25`}}>{children}</span>;
const KPI=({label,value,sub,c,bg,icon})=>(
  <div style={{background:bg||D.surface,borderRadius:10,padding:"0.8rem",flex:1,minWidth:100,border:`0.5px solid ${D.border}`}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:D.muted,lineHeight:1.3}}>{label}</span>{icon&&<span style={{fontSize:14}}>{icon}</span>}</div>
    <div style={{fontSize:20,fontWeight:800,color:c||D.primary,lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:D.muted,marginTop:3}}>{sub}</div>}
  </div>
);
const Prog=({pct,c,h=5})=><div style={{background:D.faint+"44",borderRadius:999,height:h,overflow:"hidden"}}><div style={{width:`${Math.min(100,Math.max(0,pct))}%`,background:c,height:"100%",borderRadius:999,transition:"width .3s"}}/></div>;
const Inp=({label,value,onChange,placeholder,type="text"})=>(
  <div style={{marginBottom:8}}>
    {label&&<label style={{fontSize:11,color:D.muted,display:"block",marginBottom:3}}>{label}</label>}
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||label} type={type}
      style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`0.5px solid ${D.borderMed}`,background:D.surface,color:D.primary,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
  </div>
);
const Slc=({label,value,onChange,options})=>(
  <div style={{marginBottom:8}}>
    {label&&<label style={{fontSize:11,color:D.muted,display:"block",marginBottom:3}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`0.5px solid ${D.borderMed}`,background:D.surface,color:D.primary,fontSize:14,outline:"none"}}>{options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select>
  </div>
);
const BtnPrimary=({children,onClick,disabled,full})=>(
  <button onClick={onClick} disabled={disabled} style={{background:disabled?D.faint:"linear-gradient(135deg,#6366f1,#7c3aed)",color:"#fff",border:"none",padding:"14px 20px",borderRadius:12,cursor:disabled?"not-allowed":"pointer",fontSize:15,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:full?"100%":"auto",opacity:disabled?0.5:1}}>
    {children}
  </button>
);
const LinkBtn=({href,children,color})=>(
  <a href={href} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,background:color+"18",color,border:`0.5px solid ${color}40`,padding:"7px 12px",borderRadius:8,fontSize:12,fontWeight:700,textDecoration:"none",whiteSpace:"nowrap"}}>
    {children} ↗
  </a>
);

const NAV=[{id:"hoy",icon:"⚡",label:"Hoy"},{id:"productos",icon:"📦",label:"Productos"},{id:"filtros",icon:"🎛",label:"Filtros"},{id:"calc",icon:"📊",label:"Calc."},{id:"deposito",icon:"🏭",label:"Depósito"},{id:"dash",icon:"📈",label:"Stats"}];

export default function App(){
    const[loggedIn,setLoggedIn]=useState(false);
  const login=()=>setLoggedIn(true);
  if(!loggedIn)return <LoginScreen onLogin={login}/>;

  const[view,setView]=useState("hoy");
  const[products,setProducts]=useStorage("products",[]);
  const[deposit,setDeposit]=useStorage("deposit",[]);
  const[filters,setFilters]=useStorage("filters",{minROI:"25",maxSellers:"10",minMargin:"15",maxBSR:"30000",excludeAmzSells:true,onlyTrend:"any"});
  const[capital,setCapital]=useStorage("capital","");

  const allCat=[...BASE_CAT,...products];
  const enriched=allCat.map(p=>{
    const pr=calcProfit(p.buyPrice,p.amzPrice,p.weight,p.cat);
    const sc=calcScore(pr.roi,parseInt(p.bsr)||99999,parseInt(p.sellers)||99,p.amzSells,p.trend);
    return{...p,profit:pr,score:sc};
  });
  const filtered=enriched.filter(p=>{
    if(p.profit.roi<parseFloat(filters.minROI||0))return false;
    if(parseInt(p.sellers||99)>parseInt(filters.maxSellers||99))return false;
    if(p.profit.margin<parseFloat(filters.minMargin||0))return false;
    if(parseInt(p.bsr||99999)>parseInt(filters.maxBSR||99999))return false;
    if(filters.excludeAmzSells&&p.amzSells)return false;
    if(filters.onlyTrend!=="any"&&p.trend!==filters.onlyTrend)return false;
    return true;
  });
  const highOpp=filtered.filter(p=>p.score.level==="high").length;
  const depositUnits=deposit.reduce((s,p)=>s+p.units,0);

  return(
    <div style={{fontFamily:"system-ui,sans-serif",background:D.bg,minHeight:"100vh",color:D.primary,paddingBottom:80}}>
      <div style={{background:D.surface,borderBottom:`0.5px solid ${D.border}`,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:30}}>
        <div style={{color:D.accent,fontWeight:800,fontSize:16}}>Kairoz<span style={{color:D.purple}}>Distri</span></div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {highOpp>0&&<div style={{background:D.greenL,color:D.green,fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:999}}>⚡{highOpp}</div>}
          <div style={{background:D.surface,color:D.muted,fontSize:11,padding:"3px 9px",borderRadius:999,border:`0.5px solid ${D.border}`}}>🏭{depositUnits}uds</div>
        </div>
      </div>
      <div style={{maxWidth:680,margin:"0 auto",padding:"1rem"}}>
        {view==="hoy"      &&<ViewHoy enriched={enriched} filtered={filtered} capital={capital} setCapital={setCapital} deposit={deposit} setDeposit={setDeposit}/>}
        {view==="productos"&&<ViewProductos products={products} setProducts={setProducts}/>}
        {view==="filtros"  &&<ViewFiltros filters={filters} setFilters={setFilters}/>}
        {view==="calc"     &&<ViewCalc/>}
        {view==="deposito" &&<ViewDeposito deposit={deposit} setDeposit={setDeposit}/>}
        {view==="dash"     &&<ViewDash enriched={enriched} filtered={filtered} deposit={deposit}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:D.surface,borderTop:`0.5px solid ${D.border}`,display:"flex",zIndex:40}}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setView(n.id)} style={{flex:1,padding:"10px 4px 8px",background:"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:18}}>{n.icon}</span>
            <span style={{fontSize:9,fontWeight:view===n.id?800:400,color:view===n.id?D.accent:"rgba(255,255,255,0.3)"}}>{n.label}</span>
            {view===n.id&&<div style={{width:20,height:2,background:D.accent,borderRadius:999}}/>}
          </button>
        ))}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box}`}</style>
    </div>
  );
}

function ViewHoy({enriched,filtered,capital,setCapital,deposit,setDeposit}){
  const[plan,setPlan]=useState(null);
  const[scanning,setScanning]=useState(false);
  const[logs,setLogs]=useState([]);
  const[prog,setProg]=useState(0);
  const[bought,setBought]=useState(false);
  const[showDetail,setShowDetail]=useState(null);
  const logRef=useRef(null);
  const SOURCES=["Alcampo","Carrefour","Makro","Mercadona","El Corte Inglés","Amazon"];

  const addLog=(msg,c)=>{setLogs(l=>[...l,{msg,c}]);setTimeout(()=>{if(logRef.current)logRef.current.scrollTop=9999;},30);};

  const calcPlan=()=>{
    const cap=parseFloat(capital)||0;
    if(cap<=0)return;
    setScanning(true);setPlan(null);setBought(false);setLogs([]);setProg(0);
    const steps=[[0,"🚀 Iniciando búsqueda...","#818cf8"],[250,"🔍 Escaneando Alcampo...","#64748b"],[500,"✅ Alcampo OK","#4ade80"],[650,"🔍 Escaneando Carrefour...","#64748b"],[900,"✅ Carrefour OK","#4ade80"],[1050,"🔍 Escaneando Makro...","#64748b"],[1300,"✅ Makro OK","#4ade80"],[1450,"🔍 Escaneando Mercadona...","#64748b"],[1700,"✅ Mercadona OK","#4ade80"],[1850,"🧮 Calculando FBA + IVA...","#64748b"]];
    steps.forEach(([t,msg,c],idx)=>setTimeout(()=>{addLog(msg,c);setProg(Math.round((idx+1)/(steps.length+2)*100));},t));
    setTimeout(()=>{
      const candidates=filtered.filter(p=>p.profit.net>0).sort((a,b)=>b.score.total-a.score.total);
      candidates.slice(0,4).forEach((p,i)=>setTimeout(()=>addLog(`💡 ${p.name} — ROI ${p.profit.roi}%`,"#4ade80"),i*120));
      setTimeout(()=>{
        let left=cap;const items=[];
        for(const p of candidates){
          const bp=parseFloat(p.buyPrice)||0;
          if(!bp||left<bp*2)continue;
          const maxU=Math.floor(left/(bp*1.05));
          const daily=parseFloat(p.dailySales)||1;
          const units=Math.max(1,Math.min(maxU,Math.round(daily*20)));
          const inv=r2(bp*units);
          if(inv>left)continue;
          items.push({...p,units,inv,benTotal:r2(p.profit.net*units),dias:Math.ceil(units/Math.max(0.1,daily))});
          left=r2(left-inv);
          if(items.length>=6)break;
        }
        addLog(`✅ ${items.length} productos recomendados`,"#818cf8");
        setPlan({items,totalInv:r2(cap-left),totalBen:r2(items.reduce((s,x)=>s+x.benTotal,0)),left:r2(left),cap});
        setProg(100);setScanning(false);
      },600);
    },2200);
  };

  const confirmar=()=>{
    if(!plan)return;
    plan.items.forEach(item=>{
      setDeposit(d=>{
        const ex=d.find(x=>x.productId===item.id);
        if(ex)return d.map(x=>x.productId===item.id?{...x,units:x.units+item.units,invested:r2(x.invested+item.inv)}:x);
        return[...d,{productId:item.id,name:item.name,emoji:item.emoji,units:item.units,invested:item.inv,buyPrice:parseFloat(item.buyPrice),amzPrice:parseFloat(item.amzPrice),amzUrl:item.amzUrl||"",storeUrl:item.storeUrl||"",profit:item.profit,date:new Date().toLocaleDateString("es-ES")}];
      });
    });
    setBought(true);
  };

  const portfolioROI=plan&&plan.totalInv>0?r2((plan.totalBen/plan.totalInv)*100):0;

  return(
    <div>
      <h1 style={{fontSize:20,fontWeight:800,margin:"0 0 4px"}}>¿Qué compro hoy? ⚡</h1>
      <p style={{color:D.muted,fontSize:13,margin:"0 0 16px"}}>Introduce tu capital y el sistema busca las mejores oportunidades.</p>
      <div style={{background:"linear-gradient(135deg,#1a1a2e,#16213e)",borderRadius:14,border:`0.5px solid ${D.accent}30`,padding:"1.1rem",marginBottom:16}}>
        <label style={{fontSize:12,color:D.muted,display:"block",marginBottom:6}}>💶 Capital disponible hoy (€)</label>
        <input value={capital} onChange={e=>setCapital(e.target.value)} placeholder="Ej: 300" type="number"
          style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${D.accent}50`,background:"rgba(129,140,248,0.08)",color:"#fff",fontSize:22,fontWeight:800,outline:"none",marginBottom:10,boxSizing:"border-box"}}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
          {[50,100,200,500].map(v=>(
            <button key={v} onClick={()=>setCapital(String(v))} style={{background:capital==v?D.accentD:D.surface,color:"#fff",border:`0.5px solid ${D.borderMed}`,padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:13}}>€{v}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
          {SOURCES.map(s=><div key={s} style={{background:"rgba(255,255,255,0.06)",border:"0.5px solid rgba(255,255,255,0.1)",borderRadius:999,padding:"3px 10px",fontSize:11,color:"rgba(255,255,255,0.6)"}}>🔍 {s}</div>)}
        </div>
        <BtnPrimary onClick={calcPlan} disabled={scanning||!capital} full>
          {scanning?<><span style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid #fff",borderRadius:"50%",display:"inline-block",animation:"spin .8s linear infinite"}}/>Buscando...</>:"⚡ Calcular plan del día"}
        </BtnPrimary>
      </div>
      {logs.length>0&&(
        <div style={{background:"#08080f",borderRadius:10,border:`0.5px solid ${D.border}`,padding:"10px 12px",marginBottom:14}}>
          <div ref={logRef} style={{maxHeight:130,overflowY:"auto"}}>
            {logs.map((l,i)=><div key={i} style={{fontSize:11,fontFamily:"monospace",lineHeight:1.9,color:l.c||D.muted}}>{l.msg}</div>)}
          </div>
          {(scanning||plan)&&<Prog pct={prog} c={D.accent} h={4}/>}
        </div>
      )}
      {plan&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            <KPI label="A invertir" value={`€${plan.totalInv}`} c={D.accent} icon="💸"/>
            <KPI label="Beneficio est." value={`€${plan.totalBen}`} c={D.green} bg={D.greenL} icon="✅"/>
            <KPI label="ROI del día" value={`${portfolioROI}%`} c={D.purple} bg={D.purpleL} icon="📈"/>
            <KPI label="Capital libre" value={`€${plan.left}`} icon="🏦"/>
          </div>
          <div style={{fontWeight:700,fontSize:15,marginBottom:10}}>📋 Plan — {new Date().toLocaleDateString("es-ES",{day:"numeric",month:"short"})}</div>
          {plan.items.length===0?(
            <Card style={{textAlign:"center",padding:"1.5rem"}}>
              <div style={{fontSize:28,marginBottom:8}}>🔧</div>
              <div style={{fontWeight:700,marginBottom:4}}>Sin resultados</div>
              <div style={{color:D.muted,fontSize:13}}>Reduce el ROI mínimo en Filtros.</div>
            </Card>
          ):plan.items.map((item,i)=>{
            const lcfg=LCFG[item.score.level];
            const open=showDetail===item.id;
            return(
              <div key={item.id} style={{background:D.card,border:`0.5px solid ${i===0?D.green+"60":D.border}`,borderRadius:14,marginBottom:10,overflow:"hidden",borderLeft:`4px solid ${lcfg.c}`}}>
                <div style={{padding:"0.9rem 1rem",cursor:"pointer"}} onClick={()=>setShowDetail(open?null:item.id)}>
                  <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                    <div style={{width:42,height:42,borderRadius:10,background:D.greenL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.emoji||"📦"}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginBottom:2}}>
                        <span style={{fontWeight:700,fontSize:14}}>{item.name}</span>
                        {i===0&&<Pill c={D.green} bg={D.greenL}>⭐ #1</Pill>}
                      </div>
                      <div style={{fontSize:12,color:D.muted}}>📍 <strong style={{color:D.accent}}>{item.store}</strong></div>
                    </div>
                    <div style={{textAlign:"center",flexShrink:0}}>
                      <div style={{fontSize:20,fontWeight:800,color:D.green}}>{item.profit.roi}%</div>
                      <div style={{fontSize:9,color:D.muted}}>ROI</div>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginTop:10}}>
                    {[{l:"Compra",v:`€${item.buyPrice}`,c:D.red},{l:"Amazon",v:`€${item.amzPrice}`,c:D.green},{l:"Uds",v:item.units,c:D.primary},{l:"Beneficio",v:`€${item.benTotal}`,c:D.green}].map((m,j)=>(
                      <div key={j} style={{background:D.surface,borderRadius:8,padding:"5px 4px",textAlign:"center"}}>
                        <div style={{fontSize:9,color:D.muted}}>{m.l}</div>
                        <div style={{fontSize:13,fontWeight:800,color:m.c}}>{m.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:4,marginTop:6}}>
                    <span style={{fontSize:11,color:D.muted}}>Ver links y detalle {open?"▲":"▼"}</span>
                  </div>
                </div>
                {open&&(
                  <div style={{padding:"0 1rem 1rem",borderTop:`0.5px solid ${D.border}`}}>
                    <div style={{marginBottom:12,paddingTop:10}}>
                      <div style={{fontSize:12,fontWeight:700,color:D.accent,marginBottom:8}}>🛒 COMPRAR AHORA</div>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        <div style={{background:D.surface,borderRadius:10,padding:"10px 12px",border:`0.5px solid ${D.green}40`}}>
                          <div style={{fontSize:11,color:D.muted,marginBottom:4}}>Paso 1 — Compra aquí (más barato)</div>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
                            <div>
                              <div style={{fontWeight:700,fontSize:14}}>{item.store}</div>
                              <div style={{fontSize:18,fontWeight:800,color:D.red}}>€{item.buyPrice} <span style={{fontSize:11,color:D.muted}}>× {item.units} uds = €{item.inv}</span></div>
                            </div>
                            <LinkBtn href={item.storeUrl||`https://www.google.es/search?q=${encodeURIComponent(item.name+" "+item.store)}`} color={D.green}>Ir a comprar</LinkBtn>
                          </div>
                        </div>
                        <div style={{background:D.surface,borderRadius:10,padding:"10px 12px",border:`0.5px solid ${D.amber}40`}}>
                          <div style={{fontSize:11,color:D.muted,marginBottom:4}}>Paso 2 — Ver precio en Amazon</div>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
                            <div>
                              <div style={{fontWeight:700,fontSize:14}}>Amazon.es</div>
                              <div style={{fontSize:18,fontWeight:800,color:D.green}}>€{item.amzPrice}</div>
                            </div>
                            <LinkBtn href={item.amzUrl||`https://www.amazon.es/s?k=${encodeURIComponent(item.name)}`} color={D.amber}>Ver en Amazon</LinkBtn>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{background:D.greenL,borderRadius:10,padding:"10px 12px",marginBottom:10,border:`0.5px solid ${D.green}40`}}>
                      <div style={{fontSize:12,fontWeight:700,color:D.green,marginBottom:6}}>Resumen de esta operación</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                        {[{l:"Inversión",v:`€${item.inv}`,c:D.red},{l:"Ingreso esperado",v:`€${r2(parseFloat(item.amzPrice)*item.units)}`,c:D.primary},{l:"Beneficio neto",v:`€${item.benTotal}`,c:D.green},{l:"~Días venta",v:`${item.dias}d`,c:D.amber}].map((m,j)=>(
                          <div key={j} style={{background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"6px 8px",textAlign:"center"}}>
                            <div style={{fontSize:10,color:D.muted}}>{m.l}</div>
                            <div style={{fontSize:14,fontWeight:800,color:m.c}}>{m.v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {plan.items.length>0&&!bought&&(
            <div style={{marginTop:16}}><BtnPrimary onClick={confirmar} full>✅ He comprado — añadir al depósito</BtnPrimary></div>
          )}
          {bought&&(
            <div style={{background:D.greenL,border:`1px solid ${D.green}60`,borderRadius:12,padding:"14px 16px",display:"flex",gap:10,alignItems:"center",marginTop:12}}>
              <span style={{fontSize:28}}>🎉</span>
              <div><div style={{fontWeight:800,fontSize:14,color:D.green}}>¡Añadido al depósito!</div><div style={{fontSize:12,color:D.muted}}>Vuelve mañana con nuevo capital.</div></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ViewFiltros({filters,setFilters}){
  const upd=k=>v=>setFilters(f=>({...f,[k]:v}));
  const reset=()=>setFilters({minROI:"25",maxSellers:"10",minMargin:"15",maxBSR:"30000",excludeAmzSells:true,onlyTrend:"any"});
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><h2 style={{fontSize:18,fontWeight:800,margin:0}}>🎛 Filtros</h2><p style={{fontSize:13,color:D.muted,margin:"3px 0 0"}}>Personaliza qué productos ver</p></div>
        <button onClick={reset} style={{background:D.surface,color:D.muted,border:`0.5px solid ${D.borderMed}`,padding:"7px 14px",borderRadius:8,cursor:"pointer",fontSize:12}}>Reset</button>
      </div>
      <Card style={{marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:12,color:D.accent}}>📊 Rentabilidad mínima</div>
        <Inp label="ROI mínimo (%)" value={filters.minROI} onChange={upd("minROI")} placeholder="25" type="number"/>
        <div style={{fontSize:11,color:D.faint,marginTop:-4,marginBottom:10}}>💡 Recomendado: 25%. Bájalo si no aparecen productos.</div>
        <Inp label="Margen mínimo (%)" value={filters.minMargin} onChange={upd("minMargin")} placeholder="15" type="number"/>
        <div style={{marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:D.muted,marginBottom:4}}><span>ROI mínimo</span><span style={{color:D.accent,fontWeight:800}}>{filters.minROI||25}%</span></div>
          <input type="range" min="5" max="100" step="5" value={filters.minROI||25} onChange={e=>upd("minROI")(e.target.value)} style={{width:"100%",accentColor:D.accent}}/>
        </div>
      </Card>
      <Card style={{marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:12,color:D.accent}}>🏆 Criterios Amazon</div>
        <Inp label="Sellers máximo" value={filters.maxSellers} onChange={upd("maxSellers")} placeholder="10" type="number"/>
        <Inp label="BSR máximo" value={filters.maxBSR} onChange={upd("maxBSR")} placeholder="30000" type="number"/>
        <div style={{marginBottom:12}}>
          <label style={{fontSize:11,color:D.muted,display:"block",marginBottom:6}}>Tendencia</label>
          <div style={{display:"flex",gap:6}}>
            {[["any","Todas"],["up","↑ Subiendo"],["flat","→ Estable"]].map(([v,l])=>(
              <button key={v} onClick={()=>upd("onlyTrend")(v)} style={{flex:1,background:filters.onlyTrend===v?D.accentD:D.surface,color:"#fff",border:`0.5px solid ${D.borderMed}`,padding:"8px 6px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:filters.onlyTrend===v?700:400}}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",background:D.surface,borderRadius:10,border:`0.5px solid ${D.border}`}}>
          <div>
            <div style={{fontWeight:600,fontSize:13}}>Excluir si Amazon vende</div>
            <div style={{fontSize:11,color:D.muted}}>Evita competir con Amazon</div>
          </div>
          <button onClick={()=>upd("excludeAmzSells")(!filters.excludeAmzSells)} style={{background:filters.excludeAmzSells?D.greenD:D.surface,border:`0.5px solid ${filters.excludeAmzSells?D.green:D.borderMed}`,color:"#fff",padding:"6px 14px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:700,minWidth:60}}>
            {filters.excludeAmzSells?"Sí":"No"}
          </button>
        </div>
      </Card>
      <Card style={{background:"rgba(129,140,248,0.06)",border:`0.5px solid ${D.accent}30`}}>
        <div style={{fontWeight:700,fontSize:13,color:D.accent,marginBottom:8}}>Filtros activos</div>
        {[{l:"ROI mínimo",v:`${filters.minROI||25}%`},{l:"Margen mínimo",v:`${filters.minMargin||15}%`},{l:"Sellers máx.",v:filters.maxSellers||10},{l:"BSR máx.",v:`#${parseInt(filters.maxBSR||30000).toLocaleString()}`},{l:"Excluir Amazon",v:filters.excludeAmzSells?"Sí":"No"},{l:"Tendencia",v:{any:"Todas",up:"Subiendo",flat:"Estable"}[filters.onlyTrend||"any"]}].map((f,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:`0.5px solid ${D.border}`}}>
            <span style={{color:D.muted}}>{f.l}</span><span style={{fontWeight:700,color:D.accent}}>{f.v}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ViewProductos({products,setProducts}){
  const[form,setForm]=useState({...EMPTY_P,id:Date.now()});
  const[editing,setEditing]=useState(null);
  const[show,setShow]=useState(false);
  const save=()=>{
    if(!form.name||!form.buyPrice||!form.amzPrice)return;
    editing?setProducts(ps=>ps.map(p=>p.id===editing?{...form,id:editing}:p)):setProducts(ps=>[...ps,{...form,id:Date.now()}]);
    setEditing(null);setForm({...EMPTY_P,id:Date.now()});setShow(false);
  };
  const edit=p=>{setForm({...p});setEditing(p.id);setShow(true);};
  const del=id=>{if(window.confirm("¿Eliminar?"))setProducts(ps=>ps.filter(p=>p.id!==id));};
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div><h2 style={{fontSize:18,fontWeight:800,margin:0}}>📦 Mis Productos</h2><p style={{fontSize:12,color:D.muted,margin:"2px 0 0"}}>{products.length} propios + 10 del sistema</p></div>
        <button onClick={()=>{setEditing(null);setForm({...EMPTY_P,id:Date.now()});setShow(true);}} style={{background:D.accentD,color:"#fff",border:"none",padding:"9px 16px",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:700}}>+ Añadir</button>
      </div>
      {show&&(
        <Card style={{marginBottom:14,border:`0.5px solid ${D.accent}50`}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:12,color:D.accent}}>{editing?"✏️ Editar":"➕ Nuevo producto"}</div>
          <div style={{marginBottom:10}}>
            <label style={{fontSize:11,color:D.muted,display:"block",marginBottom:6}}>Emoji</label>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{EMOJIS.map(e=><button key={e} onClick={()=>setForm(f=>({...f,emoji:e}))} style={{fontSize:18,padding:"4px",borderRadius:6,border:`1px solid ${form.emoji===e?D.accent:D.border}`,background:form.emoji===e?D.accentL:D.surface,cursor:"pointer"}}>{e}</button>)}</div>
          </div>
          <Inp label="Nombre *" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Detergente Ariel 26 lav."/>
          <Inp label="Marca" value={form.brand} onChange={v=>setForm(f=>({...f,brand:v}))} placeholder="Ariel"/>
          <Inp label="EAN" value={form.ean} onChange={v=>setForm(f=>({...f,ean:v}))} placeholder="13 dígitos"/>
          <Slc label="Categoría Amazon" value={form.cat} onChange={v=>setForm(f=>({...f,cat:v}))} options={CATS}/>
          <Inp label="Precio compra (€) *" value={form.buyPrice} onChange={v=>setForm(f=>({...f,buyPrice:v}))} type="number" placeholder="2.50"/>
          <Inp label="Precio Amazon (€) *" value={form.amzPrice} onChange={v=>setForm(f=>({...f,amzPrice:v}))} type="number" placeholder="5.99"/>
          <Inp label="Peso (kg)" value={form.weight} onChange={v=>setForm(f=>({...f,weight:v}))} type="number" placeholder="1.2"/>
          <Inp label="Tienda" value={form.store} onChange={v=>setForm(f=>({...f,store:v}))} placeholder="Makro"/>
          <Inp label="🔗 Link tienda" value={form.storeUrl} onChange={v=>setForm(f=>({...f,storeUrl:v}))} placeholder="https://..."/>
          <Inp label="🔗 Link Amazon" value={form.amzUrl} onChange={v=>setForm(f=>({...f,amzUrl:v}))} placeholder="https://amazon.es/..."/>
          <Inp label="BSR Amazon" value={form.bsr} onChange={v=>setForm(f=>({...f,bsr:v}))} type="number" placeholder="1500"/>
          <Inp label="Nº sellers" value={form.sellers} onChange={v=>setForm(f=>({...f,sellers:v}))} type="number" placeholder="8"/>
          <Inp label="Ventas/día" value={form.dailySales} onChange={v=>setForm(f=>({...f,dailySales:v}))} type="number" placeholder="2"/>
          <Slc label="Tendencia" value={form.trend} onChange={v=>setForm(f=>({...f,trend:v}))} options={TRENDS}/>
          <div style={{display:"flex",gap:6,alignItems:"center",marginTop:4,padding:"8px 10px",background:D.surface,borderRadius:8}}>
            <span style={{fontSize:13,flex:1}}>Amazon vende este producto</span>
            <button onClick={()=>setForm(f=>({...f,amzSells:!f.amzSells}))} style={{background:form.amzSells?D.redD:D.surface,border:`0.5px solid ${form.amzSells?D.red:D.borderMed}`,color:"#fff",padding:"6px 14px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:700}}>{form.amzSells?"Sí":"No"}</button>
          </div>
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <BtnPrimary onClick={save}>{editing?"Guardar":"Añadir"}</BtnPrimary>
            <button onClick={()=>{setShow(false);setEditing(null);}} style={{background:"transparent",color:D.muted,border:`0.5px solid ${D.borderMed}`,padding:"12px 16px",borderRadius:12,cursor:"pointer",fontSize:14}}>Cancelar</button>
          </div>
        </Card>
      )}
      {products.length===0&&!show&&(
        <Card style={{textAlign:"center",padding:"2rem"}}>
          <div style={{fontSize:36,marginBottom:10}}>➕</div>
          <div style={{fontWeight:700,marginBottom:6}}>Añade tus propios productos</div>
          <div style={{color:D.muted,fontSize:13}}>El sistema ya tiene 10 productos de demo.</div>
        </Card>
      )}
      <div style={{display:"grid",gap:8}}>
        {products.map(p=>{
          const pr=calcProfit(p.buyPrice,p.amzPrice,p.weight,p.cat);
          const sc=calcScore(pr.roi,parseInt(p.bsr)||99999,parseInt(p.sellers)||99,p.amzSells,p.trend);
          const lcfg=LCFG[sc.level];
          return(
            <Card key={p.id} style={{display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontSize:22,flexShrink:0}}>{p.emoji}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                <div style={{fontSize:11,color:D.muted}}>{p.store} · €{p.buyPrice}→€{p.amzPrice}</div>
                <div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>
                  {pr.ok&&<Pill c={pr.roi>=25?D.green:D.amber} bg={pr.roi>=25?D.greenL:D.amberL}>ROI {pr.roi}%</Pill>}
                  {pr.ok&&<Pill c={lcfg.c} bg={lcfg.bg}>{lcfg.l}</Pill>}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <button onClick={()=>edit(p)} style={{background:D.accentL,color:D.accent,border:"none",padding:"6px 10px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:700}}>✏️</button>
                <button onClick={()=>del(p.id)} style={{background:D.redL,color:D.red,border:"none",padding:"6px 10px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:700}}>🗑</button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ViewCalc(){
  const[cat,setCat]=useState("HomeKitchen");
  const[buyPrice,setBuyPrice]=useState("");
  const[amzPrice,setAmzPrice]=useState("");
  const[weight,setWeight]=useState("");
  const[uds,setUds]=useState(50);
  const bp=parseFloat(buyPrice)||0,ap=parseFloat(amzPrice)||0,w=parseFloat(weight)||0.5;
  const pr=calcProfit(bp,ap,w,cat);
  const ready=bp>0&&ap>0;
  const sm=pr.margin>=25?{c:D.green,bg:D.greenL,icon:"✅",l:"Muy rentable"}:pr.margin>=10?{c:D.amber,bg:D.amberL,icon:"⚠",l:"Rentable"}:{c:D.red,bg:D.redL,icon:"❌",l:"No rentable"};
  return(
    <div>
      <h2 style={{fontSize:18,fontWeight:800,margin:"0 0 4px"}}>📊 Calculadora FBA + IVA</h2>
      <p style={{color:D.muted,fontSize:13,margin:"0 0 14px"}}>Calcula la rentabilidad real de cualquier producto</p>
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        {[{v:"Beauty",l:"Beauty 8%"},{v:"Health",l:"Health 8%"},{v:"Grocery",l:"Grocery 8%"},{v:"HomeKitchen",l:"Home 15%"},{v:"OfficeProducts",l:"Office 15%"}].map(c=>(
          <button key={c.v} onClick={()=>setCat(c.v)} style={{background:cat===c.v?D.accentD:"transparent",color:cat===c.v?"#fff":D.muted,border:`0.5px solid ${cat===c.v?D.accent:D.borderMed}`,padding:"7px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700}}>{c.l}</button>
        ))}
      </div>
      <Card style={{marginBottom:12}}>
        <Inp label="Precio compra (€)" value={buyPrice} onChange={setBuyPrice} placeholder="0.00" type="number"/>
        <Inp label="Precio Amazon (€)" value={amzPrice} onChange={setAmzPrice} placeholder="0.00" type="number"/>
        <Inp label="Peso (kg)" value={weight} onChange={setWeight} placeholder="0.5" type="number"/>
        {ready&&(
          <div style={{background:sm.bg,border:`1.5px solid ${sm.c}50`,borderRadius:12,padding:"14px",textAlign:"center",marginTop:8}}>
            <div style={{fontSize:26,marginBottom:4}}>{sm.icon}</div>
            <div style={{fontSize:15,fontWeight:800,color:sm.c}}>{sm.l}</div>
            <div style={{fontSize:28,fontWeight:800,color:sm.c,margin:"4px 0"}}>{pr.margin}%</div>
            <div style={{fontSize:12,color:D.muted}}>ROI: {pr.roi}% · Beneficio: €{pr.net}/ud</div>
          </div>
        )}
      </Card>
      {ready&&(
        <>
          <Card style={{marginBottom:12}}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>Desglose real</div>
            {[{l:"Amazon (IVA inc.)",v:ap,pos:true},{l:`Comisión ${(pr.refPct*100).toFixed(0)}%`,v:pr.ref,pos:false},{l:`FBA (${w}kg)`,v:pr.fba,pos:false},{l:"Envío a FBA",v:pr.ship,pos:false},{l:"Precio compra",v:bp,pos:false}].map((b,i)=>(
              <div key={i} style={{marginBottom:7}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:2}}><span style={{color:D.muted}}>{b.l}</span><span style={{fontWeight:700,color:b.pos?D.green:D.red}}>{b.pos?"+":"−"}€{b.v.toFixed(2)}</span></div>
                <Prog pct={(b.v/Math.max(ap,0.01))*100} c={b.pos?D.greenD:"#7f1d1d"} h={5}/>
              </div>
            ))}
            <div style={{borderTop:`0.5px solid ${D.border}`,paddingTop:8,marginTop:4,display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700}}>Beneficio neto/ud</span><span style={{fontSize:18,fontWeight:800,color:pr.net>=0?D.green:D.red}}>€{pr.net}</span></div>
          </Card>
          <Card style={{background:D.accentL,border:`0.5px solid ${D.accent}40`}}>
            <div style={{fontWeight:700,fontSize:13,color:D.accent,marginBottom:8}}>Simulador de lote</div>
            <input type="range" min="1" max="500" step="1" value={uds} onChange={e=>setUds(+e.target.value)} style={{width:"100%",accentColor:D.accent,marginBottom:6}}/>
            <div style={{textAlign:"center",fontSize:16,fontWeight:800,color:D.accent,marginBottom:10}}>{uds} unidades</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {[{l:"Inversión",v:`€${r2(bp*uds)}`,c:D.red},{l:"Ingresos",v:`€${r2(ap*uds)}`,c:D.accent},{l:"Beneficio",v:`€${r2(pr.net*uds)}`,c:pr.net>=0?D.green:D.red},{l:"ROI",v:`${pr.roi}%`,c:pr.roi>=25?D.green:D.amber}].map((m,i)=>(
                <div key={i} style={{background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"8px",textAlign:"center"}}>
                  <div style={{fontSize:10,color:D.muted}}>{m.l}</div>
                  <div style={{fontSize:15,fontWeight:800,color:m.c}}>{m.v}</div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function ViewDeposito({deposit,setDeposit}){
  const[addMode,setAddMode]=useState(false);
  const[newItem,setNewItem]=useState({name:"",emoji:"📦",units:"",buyPrice:"",amzPrice:"",storeUrl:"",amzUrl:""});
  const totalUnits=deposit.reduce((s,p)=>s+p.units,0);
  const totalInv=r2(deposit.reduce((s,p)=>s+p.invested,0));
  const totalBenPot=r2(deposit.reduce((s,p)=>s+(p.profit?.net||0)*p.units,0));
  const addManual=()=>{
    if(!newItem.name||!newItem.units)return;
    const bp=parseFloat(newItem.buyPrice)||0,ap=parseFloat(newItem.amzPrice)||0;
    const pr=calcProfit(bp,ap,0.5,"HomeKitchen");
    setDeposit(d=>[...d,{productId:Date.now(),name:newItem.name,emoji:newItem.emoji,units:parseInt(newItem.units)||0,invested:r2(bp*parseInt(newItem.units||0)),buyPrice:bp,amzPrice:ap,storeUrl:newItem.storeUrl||"",amzUrl:newItem.amzUrl||"",profit:pr,date:new Date().toLocaleDateString("es-ES")}]);
    setNewItem({name:"",emoji:"📦",units:"",buyPrice:"",amzPrice:"",storeUrl:"",amzUrl:""});
    setAddMode(false);
  };
  return(
    <div>
      <h2 style={{fontSize:18,fontWeight:800,margin:"0 0 4px"}}>🏭 Mi Depósito</h2>
      <p style={{color:D.muted,fontSize:13,margin:"0 0 14px"}}>Stock comprado. Pulsa "-1 vendida" cuando vendas.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        <KPI label="Unidades" value={totalUnits} sub="en stock" icon="📦"/>
        <KPI label="Invertido" value={`€${totalInv}`} icon="💸"/>
        <KPI label="Ben. potencial" value={`€${totalBenPot}`} c={D.green} bg={D.greenL} icon="✅"/>
        <KPI label="Productos" value={deposit.length} sub="distintos" icon="🏷"/>
      </div>
      <button onClick={()=>setAddMode(!addMode)} style={{background:D.accentD,color:"#fff",border:"none",padding:"10px 18px",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:700,marginBottom:14,width:"100%"}}>+ Añadir stock manualmente</button>
      {addMode&&(
        <Card style={{marginBottom:14,border:`0.5px solid ${D.accent}50`}}>
          <Inp label="Nombre" value={newItem.name} onChange={v=>setNewItem(x=>({...x,name:v}))} placeholder="Detergente Ariel"/>
          <Inp label="Unidades" value={newItem.units} onChange={v=>setNewItem(x=>({...x,units:v}))} type="number" placeholder="50"/>
          <Inp label="Precio compra (€)" value={newItem.buyPrice} onChange={v=>setNewItem(x=>({...x,buyPrice:v}))} type="number" placeholder="2.50"/>
          <Inp label="Precio Amazon (€)" value={newItem.amzPrice} onChange={v=>setNewItem(x=>({...x,amzPrice:v}))} type="number" placeholder="5.99"/>
          <Inp label="🔗 Link tienda" value={newItem.storeUrl} onChange={v=>setNewItem(x=>({...x,storeUrl:v}))} placeholder="https://..."/>
          <Inp label="🔗 Link Amazon" value={newItem.amzUrl} onChange={v=>setNewItem(x=>({...x,amzUrl:v}))} placeholder="https://amazon.es/..."/>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <BtnPrimary onClick={addManual}>Guardar</BtnPrimary>
            <button onClick={()=>setAddMode(false)} style={{background:"transparent",color:D.muted,border:`0.5px solid ${D.borderMed}`,padding:"12px 16px",borderRadius:12,cursor:"pointer",fontSize:14}}>Cancelar</button>
          </div>
        </Card>
      )}
      {deposit.length===0&&!addMode&&(
        <Card style={{textAlign:"center",padding:"2rem"}}>
          <div style={{fontSize:36,marginBottom:10}}>🏭</div>
          <div style={{fontWeight:700,marginBottom:6}}>Depósito vacío</div>
          <div style={{color:D.muted,fontSize:13}}>Confirma una compra desde "Comprar Hoy".</div>
        </Card>
      )}
      <div style={{display:"grid",gap:10}}>
        {deposit.map(p=>(
          <Card key={p.productId} style={{borderLeft:`4px solid ${D.greenD}`}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
              <div style={{width:40,height:40,borderRadius:10,background:D.greenL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{p.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                <div style={{fontSize:11,color:D.muted}}>{p.date} · €{p.buyPrice}→€{p.amzPrice}</div>
              </div>
              <div style={{textAlign:"center",flexShrink:0}}>
                <div style={{fontSize:24,fontWeight:800,color:D.primary}}>{p.units}</div>
                <div style={{fontSize:9,color:D.muted}}>uds</div>
              </div>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
              <Pill c={D.green} bg={D.greenL}>Ben €{r2((p.profit?.net||0)*p.units)}</Pill>
              <Pill c={D.purple} bg={D.purpleL}>ROI {p.profit?.roi||0}%</Pill>
              {p.storeUrl&&<LinkBtn href={p.storeUrl} color={D.cyan}>Tienda</LinkBtn>}
              {p.amzUrl&&<LinkBtn href={p.amzUrl} color={D.amber}>Amazon</LinkBtn>}
              <button onClick={()=>setDeposit(d=>d.map(x=>x.productId===p.productId?{...x,units:Math.max(0,x.units-1)}:x).filter(x=>x.units>0))} style={{marginLeft:"auto",background:D.redL,color:D.red,border:"none",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700}}>-1 vendida</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ViewDash({enriched,filtered,deposit}){
  const avgROI=filtered.length>0?r2(filtered.reduce((s,p)=>s+p.profit.roi,0)/filtered.length):0;
  const totalInvDep=r2(deposit.reduce((s,p)=>s+p.invested,0));
  const totalBenDep=r2(deposit.reduce((s,p)=>s+(p.profit?.net||0)*p.units,0));
  const top5=[...filtered].sort((a,b)=>b.profit.roi-a.profit.roi).slice(0,5);
  return(
    <div>
      <h2 style={{fontSize:18,fontWeight:800,margin:"0 0 4px"}}>📈 Estadísticas</h2>
      <p style={{color:D.muted,fontSize:13,margin:"0 0 14px"}}>Resumen de tu catálogo y depósito</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        <KPI label="Productos" value={enriched.length} icon="📦"/>
        <KPI label="Con filtros" value={filtered.length} c={D.accent} icon="🎛"/>
        <KPI label="ROI promedio" value={`${avgROI}%`} c={D.purple} bg={D.purpleL} icon="📈"/>
        <KPI label="Oport. altas" value={filtered.filter(p=>p.score.level==="high").length} c={D.green} bg={D.greenL} icon="💡"/>
        <KPI label="En depósito" value={`€${totalInvDep}`} c={D.accent} icon="🏭"/>
        <KPI label="Ben. potencial" value={`€${totalBenDep}`} c={D.green} bg={D.greenL} icon="✅"/>
      </div>
      <Card style={{marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>🏆 Top 5 por ROI</div>
        {top5.length===0?<div style={{color:D.muted,textAlign:"center",padding:"1rem"}}>Sin resultados con los filtros actuales.</div>:
        top5.map((p,i)=>{
          const lcfg=LCFG[p.score.level];
          return(
            <div key={p.id} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:13,display:"flex",alignItems:"center",gap:5}}>{p.emoji}<span style={{color:D.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}}>{p.name.split(" ").slice(0,3).join(" ")}</span></span>
                <div style={{display:"flex",gap:4}}>
                  <Pill c={p.profit.roi>=40?D.green:D.amber} bg={p.profit.roi>=40?D.greenL:D.amberL}>{p.profit.roi}%</Pill>
                  <Pill c={lcfg.c} bg={lcfg.bg}>{p.score.total}</Pill>
                </div>
              </div>
              <Prog pct={Math.min(100,(p.profit.roi/120)*100)} c={p.profit.roi>=40?D.greenD:D.amberD} h={5}/>
            </div>
          );
        })}
      </Card>
      <Card>
        <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>Distribución por nivel</div>
        {["high","medium","low"].map(lv=>{
          const cnt=filtered.filter(p=>p.score.level===lv).length;
          const lcfg=LCFG[lv];
          return(
            <div key={lv} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3}}>
                <span style={{color:D.muted}}>{lcfg.l}</span>
                <span style={{fontWeight:700,color:lcfg.c}}>{cnt} productos</span>
              </div>
              <Prog pct={filtered.length>0?(cnt/filtered.length)*100:0} c={lcfg.c} h={7}/>
            </div>
          );
        })}
      </Card>
    </div>
  );
}