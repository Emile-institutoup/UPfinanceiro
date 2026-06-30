import { useState } from "react";

const C = {
  primary:"#1B4F72", accent:"#2ECC71", danger:"#E74C3C",
  warning:"#F39C12", light:"#F0F4F8", white:"#FFFFFF",
  text:"#1A202C", muted:"#718096", border:"#E2E8F0", bg:"#F7FAFC",
  purple:"#8E44AD", teal:"#16A085",
};

const fmt     = v => Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const fmtPct  = v => `${Math.round((v||0)*100)}%`;
const fmtDate = d => { if(!d) return "—"; const p=d.split("-"); return `${p[2]}/${p[1]}/${p[0]}`; };

const STATUS = {
  pago:      { label:"Pago",       cor:"#27AE60", bg:"#EAFAF1", icon:"✅" },
  agendado:  { label:"Agendado",   cor:"#F39C12", bg:"#FEF9E7", icon:"📅" },
  esperando: { label:"Aguardando", cor:"#95A5A6", bg:"#F2F3F4", icon:"⏳" },
  atraso:    { label:"Em atraso",  cor:"#E74C3C", bg:"#FDEDEC", icon:"🔴" },
};

const CONVENIOS = [
  { id:"PARTICULAR", label:"Particular", cor:"#27AE60" },
  { id:"UNIMED",     label:"Unimed",     cor:"#1B4F72" },
  { id:"CELOS",      label:"Celos",      cor:"#8E44AD" },
  { id:"SC_SAUDE",   label:"SC Saúde",   cor:"#E67E22" },
  { id:"REEMBOLSO",  label:"Reembolso",  cor:"#16A085" },
];

const PROFS = [
  { nome:"Emile",     esp:"Neuropsicopedagoga", pct:0.60, cor:C.primary },
  { nome:"Aline",     esp:"Neuropsicopedagoga", pct:0.60, cor:C.teal    },
  { nome:"Jhennifer", esp:"Psicóloga",          pct:0.60, cor:C.purple  },
  { nome:"Nathália",  esp:"Psicóloga",          pct:0.50, cor:"#27AE60" },
  { nome:"Ana Paula", esp:"Neuropsicóloga",     pct:0.50, cor:C.danger  },
  { nome:"Monike",    esp:"Nutricionista",      pct:0.60, cor:"#E67E22" },
  { nome:"Ariane",    esp:"Fonoaudióloga",      pct:0.60, cor:C.warning },
  { nome:"Amanda",    esp:"Fonoaudióloga",      pct:0.50, cor:C.accent  },
];

const CATS = ["FIXO","PESSOAL","IMPOSTO","SERVIÇO","MARKETING","FINANC.","OUTROS"];

const MESES = [
  { id:"dez25", label:"Dez/2025",
    fat:{Emile:14530,Aline:5000,Ariane:12170,Jhennifer:11950,Monike:720,"Ana Paula":0,Amanda:2780,Nathália:6170},
    bruto:53320, das:5275.21, iss:0, lucro:26698,
    fixos:[{d:"Aluguel",v:3072.60},{d:"Condomínio",v:1965.94},{d:"Luz",v:333.47},{d:"Internet",v:79.90},{d:"Secretária",v:1039.57},{d:"Contador",v:598.06},{d:"Limpeza",v:760.00},{d:"Mídia",v:900.00},{d:"Celular",v:33.99}],
    vars:[{d:"DARF",v:0},{d:"Resp. Técnica",v:1000.00},{d:"Empréstimo",v:1388.89},{d:"Décimo/Férias",v:225.00}] },
  { id:"jan26", label:"Jan/2026",
    fat:{Emile:10740,Aline:2510,Ariane:6300,Jhennifer:10062,Monike:900,"Ana Paula":2800,Amanda:5180,Nathália:5010},
    bruto:43502, das:0, iss:0, lucro:18419.80,
    fixos:[{d:"Aluguel",v:3072.60},{d:"Condomínio",v:2011.79},{d:"Luz",v:333.47},{d:"Internet",v:79.99},{d:"Secretária",v:1039.57},{d:"Contador",v:600.00},{d:"Limpeza",v:760.00},{d:"Mídia",v:900.00},{d:"Celular",v:33.99}],
    vars:[{d:"DARF",v:1722.24},{d:"Simples Nacional",v:809.98},{d:"CEF",v:113.88},{d:"Resp. Técnica",v:1000.00},{d:"Empréstimo",v:1432.12},{d:"Décimo/Férias",v:225.00}] },
  { id:"fev26", label:"Fev/2026",
    fat:{Emile:12830,Aline:4160,Ariane:12260,Jhennifer:13240,Monike:900,"Ana Paula":0,Amanda:5780,Nathália:5100},
    bruto:54270, das:0, iss:0, lucro:28236,
    fixos:[{d:"Aluguel",v:3072.60},{d:"Condomínio",v:2011.79},{d:"Luz",v:333.47},{d:"Internet",v:79.99},{d:"Secretária",v:1039.57},{d:"Contador",v:600.00},{d:"Limpeza",v:760.00},{d:"Mídia",v:900.00},{d:"Celular",v:33.99}],
    vars:[{d:"DARF",v:1722.24},{d:"Simples Nacional",v:809.98},{d:"CEF",v:113.88},{d:"Resp. Técnica",v:1000.00},{d:"Empréstimo",v:1432.12},{d:"Décimo/Férias",v:225.00}] },
  { id:"mar26", label:"Mar/2026",
    fat:{Emile:15510,Aline:4750,Ariane:12620,Jhennifer:12820,Monike:1620,"Ana Paula":0,Amanda:6260,Nathália:6980},
    bruto:60560, das:3501.33, iss:0, lucro:25548,
    fixos:[{d:"Aluguel",v:3600.42},{d:"Condomínio",v:1965.94},{d:"Luz",v:503.83},{d:"Internet",v:79.90},{d:"Secretária",v:1247.49},{d:"Contador",v:600.00},{d:"Limpeza",v:760.00},{d:"Mídia",v:900.00},{d:"Celular",v:39.99}],
    vars:[{d:"DARF 05/2025",v:1085.68},{d:"DARF",v:595.52},{d:"Simples Nacional",v:826.17},{d:"CEF",v:107.89},{d:"Resp. Técnica",v:1000.00},{d:"Empréstimo",v:1431.19},{d:"Vale Transporte",v:114.90},{d:"Décimo/Férias",v:225.00}] },
  { id:"abr26", label:"Abr/2026",
    fat:{Emile:15300,Aline:6160,Ariane:12340,Jhennifer:14420,Monike:0,"Ana Paula":2500,Amanda:5520,Nathália:7020},
    bruto:63260, das:3000.00, iss:1354.79, lucro:26808,
    fixos:[{d:"Aluguel",v:3779.12},{d:"Condomínio",v:1965.94},{d:"Luz",v:627.70},{d:"Internet",v:80.89},{d:"Secretária",v:790.08},{d:"Contador",v:600.00},{d:"Sistema",v:383.36},{d:"Limpeza",v:760.00},{d:"Mídia",v:900.00},{d:"Celular",v:39.99}],
    vars:[{d:"Simples Nacional",v:844.80},{d:"DARF",v:612.36},{d:"CEF",v:125.87},{d:"Resp. Técnica",v:1000.00},{d:"Água",v:102.00},{d:"Manut. impressora",v:180.00},{d:"Manut. ar cond.",v:190.00},{d:"Empréstimo",v:1388.89},{d:"Vale Transporte",v:280.74},{d:"Vale Alimentação",v:500.00},{d:"Décimo/Férias",v:225.00}] },
  { id:"mai26", label:"Mai/2026",
    fat:{Emile:17400,Aline:6241.84,Ariane:11120.32,Jhennifer:9795.44,Monike:0,"Ana Paula":2500,Amanda:6635.28,Nathália:8431.92},
    bruto:62124.80, das:4476.46, iss:1593.62, lucro:34140.24,
    fixos:[
      {d:"Aluguel",v:3421.68},{d:"Condomínio",v:1965.94},{d:"Luz",v:510.32},
      {d:"Internet",v:79.99},{d:"Secretária",v:1247.49},{d:"Contador",v:600.00},
      {d:"Sistema",v:385.00},{d:"Limpeza",v:760.00},{d:"Mídia",v:900.00},{d:"Celular",v:39.99},
    ],
    vars:[
      {d:"DARF",v:595.52},{d:"CEF Matriz",v:107.89},{d:"Simples Nacional (5/5)",v:826.17},
      {d:"Resp. Técnica",v:1000.00},{d:"Mídia extra",v:1200.00},{d:"Água",v:51.00},
      {d:"Empréstimo",v:1388.89},{d:"Vale Transporte",v:211.64},
      {d:"Vale Alimentação",v:500.00},{d:"Limpeza ar cond.",v:740.00},
      {d:"Décimo/Férias",v:225.00},{d:"Luciane",v:1000.00},
      {d:"Cartão PF",v:365.13},{d:"Cartão inter empresarial",v:2018.13},
    ] },
  { id:"jun26", label:"Jun/2026",
    fat:{Emile:4740,Aline:2380,Ariane:5680,Jhennifer:2620,Monike:0,"Ana Paula":10600,Amanda:720,Nathália:2400},
    bruto:62246.48, das:4491.02, iss:1321.97, lucro:20842.33,
    fixos:[{d:"Aluguel",v:3600.40},{d:"Condomínio",v:1955.94},{d:"Luz",v:346.22},{d:"Internet",v:79.99},{d:"Secretária",v:1247.15},{d:"Contador",v:600.00},{d:"Sistema",v:385.00},{d:"Limpeza",v:760.00},{d:"Mídia",v:900.00},{d:"Celular",v:39.99}],
    vars:[{d:"CEF matriz",v:107.89},{d:"DARF",v:595.52},{d:"Resp. Técnica",v:1000.00},{d:"Cartão PF",v:372.00},{d:"Cartão inter",v:1413.33},{d:"Luciane",v:1000.00},{d:"Empréstimos",v:1388.89},{d:"Vale Transporte",v:308.38},{d:"Vale Alimentação",v:500.00},{d:"Limpeza ar cond.",v:370.00},{d:"Água",v:72.00},{d:"Décimo/Férias",v:225.00}] },
];

const LINHAS_FIXOS = ["Aluguel","Condomínio","Luz","Internet","Secretária","Contador","Sistema","Limpeza","Mídia","Celular"];

const TABS = [
  { id:"dashboard",   label:"Dashboard",    icon:"📊" },
  { id:"consultas",   label:"Consultas",    icon:"🩺" },
  { id:"repTerapeutas",label:"Repasse",     icon:"💸" },
  { id:"contas",      label:"Contas",       icon:"💳" },
  { id:"calendario",  label:"Calendário",   icon:"📆" },
  { id:"repasses",    label:"Resumo DRE",   icon:"👩‍⚕️" },
  { id:"dre",         label:"DRE Mensal",   icon:"📈" },
  { id:"custos",      label:"Custos Fixos", icon:"📤" },
];

// ─── Estilos base ────────────────────────────────────────────────────────────
const OV  = {position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000};
const CARD= {background:C.white,borderRadius:14,boxShadow:"0 1px 6px rgba(0,0,0,.08)",padding:20};
const TH  = {padding:"10px 13px",textAlign:"left",fontWeight:700,fontSize:12,color:C.muted,whiteSpace:"nowrap"};
const TD  = {padding:"10px 13px",verticalAlign:"middle",fontSize:13};
const INP = {width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid "+C.border,fontSize:13,outline:"none",boxSizing:"border-box",background:"#fff"};
const SEL = {width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid "+C.border,fontSize:13,outline:"none",boxSizing:"border-box",background:"#fff"};
const BP  = {background:C.primary,color:"#fff",border:"none",borderRadius:8,padding:"9px 18px",fontWeight:700,cursor:"pointer",fontSize:13};
const BS  = {background:C.light,color:C.text,border:"1px solid "+C.border,borderRadius:8,padding:"9px 18px",fontWeight:600,cursor:"pointer",fontSize:13};

// ─── Componentes ─────────────────────────────────────────────────────────────
function Badge({ children, color }) {
  return <span style={{background:color+"22",color,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{children}</span>;
}

function SCard({ label, value, icon, color, sub }) {
  return (
    <div style={{background:C.white,borderRadius:14,boxShadow:"0 1px 6px rgba(0,0,0,.08)",padding:"15px 18px",borderLeft:"4px solid "+color,flex:1,minWidth:145}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:12,color:C.muted,fontWeight:500}}>{label}</span>
        <span style={{fontSize:17}}>{icon}</span>
      </div>
      <div style={{fontSize:19,fontWeight:800,color:C.text}}>{value}</div>
      {sub && <div style={{fontSize:11,color:C.muted,marginTop:3}}>{sub}</div>}
    </div>
  );
}

function MesSel({ val, set }) {
  return (
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
      {MESES.map(m => (
        <button key={m.id} onClick={() => set(m.id)} style={{
          padding:"5px 13px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,
          background:val===m.id?C.primary:C.light,
          color:val===m.id?"#fff":C.muted,
          fontWeight:val===m.id?700:500,
        }}>{m.label}</button>
      ))}
    </div>
  );
}

function StatusBtns({ itemId, currentStatus, onToggle, size }) {
  const sz = size || 26;
  return (
    <div style={{display:"flex",gap:4}}>
      {Object.entries(STATUS).map(([k, v]) => (
        <button
          key={k}
          onClick={() => onToggle(itemId, k)}
          title={v.label}
          style={{
            width:sz, height:sz, borderRadius:"50%",
            border:"2px solid "+(currentStatus===k ? v.cor : "#ddd"),
            background:currentStatus===k ? v.cor : "#fff",
            cursor:"pointer", fontSize:sz>24?13:10,
            boxShadow:currentStatus===k ? "0 0 0 2px "+v.cor+"44" : "none",
            transition:"all .15s",
          }}
        >{v.icon}</button>
      ))}
    </div>
  );
}

function Calendario({ contas, onToggle }) {
  const hoje  = new Date();
  const ano   = hoje.getFullYear();
  const mesN  = hoje.getMonth();
  const offset= new Date(ano, mesN, 1).getDay();
  const dias  = new Date(ano, mesN+1, 0).getDate();
  const nome  = hoje.toLocaleString("pt-BR",{month:"long",year:"numeric"});

  const porDia = {};
  contas.forEach(c => {
    if (!c.venc) return;
    const d = new Date(c.venc+"T12:00:00");
    if (d.getFullYear()===ano && d.getMonth()===mesN) {
      const dd = d.getDate();
      if (!porDia[dd]) porDia[dd] = [];
      porDia[dd].push(c);
    }
  });

  const celulas = [];
  const off = offset===0 ? 6 : offset-1;
  for (let i=0;i<off;i++) celulas.push(null);
  for (let d=1;d<=dias;d++) celulas.push(d);

  const hojeD = hoje.getDate();
  const totalMes = Object.values(porDia).flat().reduce((a,c)=>a+c.valor,0);

  return (
    <div>
      <div style={{textAlign:"center",fontWeight:800,fontSize:16,marginBottom:14,textTransform:"capitalize"}}>{nome}</div>

      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:14,fontSize:12}}>
        {Object.entries(STATUS).map(([k,v]) => (
          <span key={k} style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:12,height:12,borderRadius:3,background:v.cor,display:"inline-block"}}/>
            <span style={{color:v.cor,fontWeight:600}}>{v.label}</span>
          </span>
        ))}
      </div>

      <div style={{...CARD,padding:0,overflow:"hidden",marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:C.primary}}>
          {["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map(d => (
            <div key={d} style={{padding:"8px 0",textAlign:"center",color:"#fff",fontSize:12,fontWeight:700}}>{d}</div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,background:C.border}}>
          {celulas.map((dia,i) => {
            if (!dia) return <div key={"e"+i} style={{background:C.light,minHeight:80}}/>;
            const lista = porDia[dia] || [];
            const isHoje = dia===hojeD;
            const totalD = lista.reduce((a,c)=>a+c.valor,0);
            return (
              <div key={dia} style={{background:"#fff",minHeight:80,padding:"5px 5px"}}>
                <div style={{
                  width:22,height:22,borderRadius:"50%",display:"flex",
                  alignItems:"center",justifyContent:"center",
                  background:isHoje?C.primary:"transparent",
                  color:isHoje?"#fff":C.text,
                  fontWeight:isHoje?800:500,fontSize:12,marginBottom:3,
                }}>{dia}</div>
                {lista.slice(0,3).map(c => {
                  const st = STATUS[c.status]||STATUS.esperando;
                  return (
                    <div key={c.id}
                      title={c.desc+" · "+fmt(c.valor)}
                      style={{background:st.cor,color:"#fff",borderRadius:3,
                        padding:"1px 4px",fontSize:9,fontWeight:700,marginBottom:2,
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {st.icon} {c.desc}
                    </div>
                  );
                })}
                {lista.length>3 && <div style={{fontSize:9,color:C.muted}}>+{lista.length-3}</div>}
                {totalD>0 && <div style={{fontSize:9,color:C.muted,marginTop:1}}>{fmt(totalD)}</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={CARD}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>📋 Vencimentos do mês</div>
        {Object.keys(porDia).length===0 && (
          <div style={{textAlign:"center",color:C.muted,padding:24}}>Nenhum vencimento cadastrado neste mês.</div>
        )}
        {Object.keys(porDia).sort((a,b)=>Number(a)-Number(b)).map(dia => (
          <div key={dia}>
            <div style={{fontWeight:700,fontSize:11,color:C.muted,
              padding:"8px 0 4px",borderBottom:"1px solid "+C.border,
              marginBottom:6,letterSpacing:.5}}>
              DIA {String(dia).padStart(2,"0")}
            </div>
            {porDia[dia].map(c => {
              const st = STATUS[c.status]||STATUS.esperando;
              return (
                <div key={c.id} style={{
                  display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"8px 10px",borderRadius:8,marginBottom:6,
                  background:st.bg,border:"1px solid "+st.cor+"33",
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
                    <span style={{fontSize:16,flexShrink:0}}>{st.icon}</span>
                    <div style={{minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.desc}</div>
                      <div style={{fontSize:11,color:C.muted}}>{c.cat}{c.obs?" · "+c.obs:""}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0,marginLeft:10}}>
                    <div style={{fontWeight:800,fontSize:14}}>{fmt(c.valor)}</div>
                    <StatusBtns itemId={c.id} currentStatus={c.status} onToggle={onToggle} size={22}/>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        {Object.keys(porDia).length>0 && (
          <div style={{display:"flex",justifyContent:"space-between",
            padding:"12px 10px",background:C.light,borderRadius:8,
            marginTop:10,fontWeight:800,fontSize:14}}>
            <span>Total do mês</span>
            <span style={{color:C.primary}}>{fmt(totalMes)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Componente PDF Preview ──────────────────────────────────────────────────
function PdfPreview({ data, onClose }) {
  if (!data) return null;
  const { prof, pct, mesLabel, dataPart, dataUni, cPart, cUni, totalP, totalU, total } = data;

  const fmtD = d => { if(!d) return "—"; const p=d.split("-"); return `${p[2]}/${p[1]}/${p[0]}`; };

  function baixarPdf() {
    const el = document.getElementById("pdf-content-preview");
    if (!el) return;
    const clone = el.cloneNode(true);
    clone.style.width = "794px";
    clone.style.padding = "40px";
    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(`
      <!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
      <title>Repasse ${prof.nome} - ${mesLabel}</title>
      <style>
        body{font-family:Arial,sans-serif;margin:0;padding:40px;color:#1A202C;font-size:13px;}
        table{width:100%;border-collapse:collapse;margin-bottom:0;}
        th{background:#F0F4F8;padding:8px 10px;text-align:left;font-size:11px;color:#718096;border:1px solid #E2E8F0;}
        td{padding:8px 10px;border:1px solid #E2E8F0;font-size:12px;}
        .hdr{background:${prof.cor};color:#fff;padding:14px 18px;border-radius:8px 8px 0 0;display:flex;justify-content:space-between;margin-bottom:0;}
        .sec{padding:8px 14px;font-weight:700;font-size:12px;}
        .green{background:#EAFAF1;color:#27AE60;}
        .blue{background:#EBF5FB;color:#1B4F72;}
        .sub{background:#F0F4F8;font-weight:700;}
        .tot{padding:12px 18px;display:flex;justify-content:space-between;font-weight:800;font-size:15px;background:${prof.cor}15;border-radius:0 0 8px 8px;margin-bottom:24px;}
        .logo{font-size:22px;font-weight:900;color:#1B4F72;}
        .foot{margin-top:32px;border-top:1px solid #E2E8F0;padding-top:12px;font-size:11px;color:#718096;text-align:center;}
        @media print{button{display:none!important;}body{padding:20px;}}
      </style></head><body>
      ${clone.innerHTML}
      <script>setTimeout(()=>window.print(),400);<\/script>
      </body></html>
    `);
    win.document.close();
  }

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:2000,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:820,
        maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 8px 48px rgba(0,0,0,.25)"}}>

        {/* Barra superior */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"14px 20px",borderBottom:"1px solid "+C.border,flexShrink:0}}>
          <div style={{fontWeight:800,fontSize:15,color:C.primary}}>
            📄 Prévia do PDF — {prof.nome}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={baixarPdf}
              style={{background:C.accent,color:"#fff",border:"none",borderRadius:8,
                padding:"8px 18px",fontWeight:700,cursor:"pointer",fontSize:13,
                display:"flex",alignItems:"center",gap:6}}>
              ⬇️ Baixar / Imprimir PDF
            </button>
            <button onClick={onClose}
              style={{background:C.light,color:C.text,border:"1px solid "+C.border,
                borderRadius:8,padding:"8px 14px",fontWeight:600,cursor:"pointer",fontSize:13}}>
              ✕ Fechar
            </button>
          </div>
        </div>

        {/* Conteúdo com scroll */}
        <div style={{overflowY:"auto",flex:1,padding:20}}>
          <div id="pdf-content-preview"
            style={{background:"#fff",maxWidth:760,margin:"0 auto",fontFamily:"Arial,sans-serif"}}>

            {/* Cabeçalho */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
              marginBottom:20,borderBottom:"3px solid "+C.primary,paddingBottom:14}}>
              <div>
                <div style={{fontSize:20,fontWeight:900,color:C.primary}}>🏥 Instituto Up</div>
                <div style={{fontSize:11,color:C.muted}}>Clínica Multidisciplinar — Sistema Financeiro</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontWeight:700,fontSize:13,textTransform:"capitalize"}}>
                  Repasse · {mesLabel}
                </div>
                <div style={{fontSize:11,color:C.muted}}>
                  Gerado em {new Date().toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>

            {/* Header profissional */}
            <div style={{background:prof.cor,color:"#fff",padding:"12px 16px",
              borderRadius:"8px 8px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:800,fontSize:16}}>{prof.nome}</div>
                <div style={{fontSize:11,opacity:.85}}>{prof.esp} · Repasse: {fmtPct(pct)}</div>
              </div>
              <div style={{fontWeight:900,fontSize:20}}>{fmt(total)}</div>
            </div>

            {/* Particular */}
            {cPart.length > 0 && (
              <div>
                <div style={{background:"#EAFAF1",color:"#27AE60",padding:"8px 14px",
                  fontWeight:700,fontSize:12,borderBottom:"1px solid #D5F5E3"}}>
                  🟢 PARTICULAR — Pagamento: {fmtD(dataPart)}
                </div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead>
                    <tr style={{background:C.light}}>
                      <th style={{padding:"7px 10px",textAlign:"left",fontWeight:700,color:C.muted}}>Paciente</th>
                      <th style={{padding:"7px 10px",textAlign:"center",fontWeight:700,color:C.muted}}>Tipo</th>
                      <th style={{padding:"7px 10px",textAlign:"right",fontWeight:700,color:C.muted}}>Valor</th>
                      <th style={{padding:"7px 10px",textAlign:"center",fontWeight:700,color:C.muted}}>%</th>
                      <th style={{padding:"7px 10px",textAlign:"right",fontWeight:700,color:C.muted}}>Repasse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cPart.map((c,i) => (
                      <tr key={i} style={{borderBottom:"1px solid "+C.border}}>
                        <td style={{padding:"7px 10px",fontWeight:600}}>{c.paciente}</td>
                        <td style={{padding:"7px 10px",textAlign:"center"}}>
                          <span style={{background:c.tipo==="pacote"?"#EAFAF1":"#EBF5FB",
                            color:c.tipo==="pacote"?"#27AE60":C.primary,
                            borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700}}>
                            {c.tipo==="pacote"?"📦 Pacote":"🔢 Sessão"}
                          </span>
                        </td>
                        <td style={{padding:"7px 10px",textAlign:"right"}}>{fmt(c.valor)}</td>
                        <td style={{padding:"7px 10px",textAlign:"center",color:"#27AE60",fontWeight:700}}>{fmtPct(pct)}</td>
                        <td style={{padding:"7px 10px",textAlign:"right",fontWeight:700,color:"#27AE60"}}>{fmt(c.valor*pct)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{background:"#EAFAF1",fontWeight:800}}>
                      <td style={{padding:"8px 10px"}} colSpan={2}>Subtotal Particular</td>
                      <td style={{padding:"8px 10px",textAlign:"right"}}>{fmt(cPart.reduce((a,c)=>a+c.valor,0))}</td>
                      <td/>
                      <td style={{padding:"8px 10px",textAlign:"right",color:"#27AE60"}}>{fmt(totalP)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* Convênio */}
            {cUni.length > 0 && (
              <div style={{marginTop: cPart.length>0?16:0}}>
                <div style={{background:"#EBF5FB",color:C.primary,padding:"8px 14px",
                  fontWeight:700,fontSize:12,borderBottom:"1px solid #AED6F1"}}>
                  🔵 CONVÊNIO — Pagamento: {fmtD(dataUni)}
                </div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead>
                    <tr style={{background:C.light}}>
                      <th style={{padding:"7px 10px",textAlign:"left",fontWeight:700,color:C.muted}}>Paciente</th>
                      <th style={{padding:"7px 10px",textAlign:"center",fontWeight:700,color:C.muted}}>Convênio</th>
                      <th style={{padding:"7px 10px",textAlign:"right",fontWeight:700,color:C.muted}}>Valor Guia</th>
                      <th style={{padding:"7px 10px",textAlign:"center",fontWeight:700,color:C.muted}}>%</th>
                      <th style={{padding:"7px 10px",textAlign:"right",fontWeight:700,color:C.muted}}>Repasse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cUni.map((c,i) => {
                      const aConf = c.valor === 0;
                      const convLbl = CONVENIOS.find(x=>x.id===c.conv)?.label||c.conv;
                      const convCr  = CONVENIOS.find(x=>x.id===c.conv)?.cor||C.primary;
                      return (
                        <tr key={i} style={{borderBottom:"1px solid "+C.border,background:aConf?"#FFFBF0":"#fff"}}>
                          <td style={{padding:"7px 10px",fontWeight:600}}>{c.paciente}</td>
                          <td style={{padding:"7px 10px",textAlign:"center"}}>
                            <Badge color={convCr}>{convLbl}</Badge>
                          </td>
                          <td style={{padding:"7px 10px",textAlign:"right",color:aConf?C.warning:C.text,fontWeight:aConf?700:400}}>
                            {aConf ? "⚠️ A confirmar" : fmt(c.valor)}
                          </td>
                          <td style={{padding:"7px 10px",textAlign:"center",color:C.primary,fontWeight:700}}>{fmtPct(pct)}</td>
                          <td style={{padding:"7px 10px",textAlign:"right",fontWeight:700,color:aConf?C.warning:C.primary}}>
                            {aConf ? "—" : fmt(c.valor*pct)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{background:"#EBF5FB",fontWeight:800}}>
                      <td style={{padding:"8px 10px"}} colSpan={2}>Subtotal Convênio</td>
                      <td style={{padding:"8px 10px",textAlign:"right"}}>{fmt(cUni.filter(c=>c.valor>0).reduce((a,c)=>a+c.valor,0))}</td>
                      <td/>
                      <td style={{padding:"8px 10px",textAlign:"right",color:C.primary}}>{fmt(totalU)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* Total geral */}
            <div style={{background:prof.cor+"15",padding:"12px 16px",
              borderRadius:"0 0 8px 8px",display:"flex",justifyContent:"space-between",
              alignItems:"center",fontWeight:800,fontSize:15,marginBottom:24,
              borderTop:"2px solid "+prof.cor+"33"}}>
              <span style={{color:prof.cor}}>💸 TOTAL A REPASSAR PARA {prof.nome.toUpperCase()}</span>
              <span style={{color:prof.cor,fontSize:20}}>{fmt(total)}</span>
            </div>

            {/* Rodapé */}
            <div style={{textAlign:"center",fontSize:11,color:C.muted,
              borderTop:"1px solid "+C.border,paddingTop:12}}>
              Instituto Up Clínica Multidisciplinar · Documento gerado em {new Date().toLocaleDateString("pt-BR")} pelo Sistema Financeiro
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,    setTab]    = useState("dashboard");
  const [mesSel, setMesSel] = useState("mai26");

  // Porcentagens
  const [pcts,    setPcts]    = useState(Object.fromEntries(PROFS.map(p=>[p.nome,p.pct])));
  const [pctEdit, setPctEdit] = useState(false);
  const [pctTemp, setPctTemp] = useState({});

  // Repasse a terapeutas
  const [repMesSel,   setRepMesSel]   = useState("");
  const [repProfSel,  setRepProfSel]  = useState("TODOS");
  const [diaParticular, setDiaParticular] = useState("15");
  const [diaUnimed,     setDiaUnimed]     = useState("26");
  const [repStatusMap,  setRepStatusMap]  = useState({});

  const [pdfModal, setPdfModal] = useState(false);
  const [pdfData,  setPdfData]  = useState(null);

  function toggleRepStatus(key) {
    setRepStatusMap(prev => {
      const cur = prev[key] || "pendente";
      const next = cur === "pendente" ? "pago" : cur === "pago" ? "agendado" : "pendente";
      return {...prev, [key]: next};
    });
  }
  function setRepPago(key) {
    setRepStatusMap(prev => ({...prev, [key]: prev[key]==="pago" ? "pendente" : "pago"}));
  }

  function gerarPdfRepasse(profNome, mesStr, consultasMes, pcts, diaParticular, diaUnimed) {
    const prof = PROFS.find(p => p.nome === profNome);
    if (!prof) return;
    const pct  = pcts[profNome] ?? prof.pct;
    const [ano, mesN] = mesStr.split("-");
    const mesLabel = new Date(Number(ano), Number(mesN)-1, 1)
      .toLocaleString("pt-BR", {month:"long", year:"numeric"});
    const dataPart = `${ano}-${mesN}-${String(diaParticular).padStart(2,"0")}`;
    const dataUni  = `${ano}-${mesN}-${String(diaUnimed).padStart(2,"0")}`;
    const cPart = consultasMes.filter(c => c.prof === profNome && c.conv === "PARTICULAR");
    const cUni  = consultasMes.filter(c => c.prof === profNome && c.conv !== "PARTICULAR");
    const totalP = cPart.reduce((a,c) => a + c.valor * pct, 0);
    const totalU = cUni.filter(c=>c.valor>0).reduce((a,c) => a + c.valor * pct, 0);
    setPdfData({ prof, pct, mesLabel, dataPart, dataUni, cPart, cUni, totalP, totalU, total: totalP+totalU });
    setPdfModal(true);
  }


  // Consultas
  const emptyC = {paciente:"",prof:"",conv:"PARTICULAR",valor:"",dataPag:"",obs:"",tipo:"sessao"};
  const [consultas,   setConsultas]   = useState([
  // ── Consultas de Maio/2026 (pagas em junho) ─────────────────────────
  {id:"1000", paciente:"Alice Vieira Vasconcelos", prof:"Emile", conv:"PARTICULAR", valor:500, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1001", paciente:"Amábile Vieira Vasconcelos", prof:"Aline", conv:"PARTICULAR", valor:500, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1002", paciente:"Amábile Vieira Vasconcelos", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1003", paciente:"Amanda Oliveira da Silva", prof:"Emile", conv:"UNIMED", valor:360, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1004", paciente:"Ana Arasaki Marcilio", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1005", paciente:"Ana Arasaki Marcilio", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1006", paciente:"Ana Clara Goulart Forgerini", prof:"Emile", conv:"UNIMED", valor:720, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1007", paciente:"Annelize de Oliveira Rodrigues", prof:"Emile", conv:"PARTICULAR", valor:540, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1008", paciente:"Antônio Pires Alberton", prof:"Ariane", conv:"UNIMED", valor:908.4, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1009", paciente:"Antônio Pires Alberton", prof:"Jhennifer", conv:"UNIMED", valor:363.36, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1010", paciente:"Antônio Pires Alberton", prof:"Nathália", conv:"UNIMED", valor:363.36, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1011", paciente:"Arthur Pelozato", prof:"Emile", conv:"UNIMED", valor:900, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1012", paciente:"Beatriz Carvalho Pereira", prof:"Aline", conv:"UNIMED", valor:726.72, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1013", paciente:"Beatriz Carvalho Pereira", prof:"Jhennifer", conv:"UNIMED", valor:545.04, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1014", paciente:"Bento Nascimento Oliveira André", prof:"Amanda", conv:"PARTICULAR", valor:580, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1015", paciente:"Bernardo Machado Kessler", prof:"Emile", conv:"PARTICULAR", valor:580, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1016", paciente:"Betina da Cunha Nikolay", prof:"Emile", conv:"UNIMED", valor:780, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1017", paciente:"Betina da Cunha Nikolay", prof:"Aline", conv:"UNIMED", valor:720, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1018", paciente:"Betina da Cunha Nikolay", prof:"Ariane", conv:"UNIMED", valor:900, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1019", paciente:"Betina da Cunha Nikolay", prof:"Jhennifer", conv:"UNIMED", valor:600, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1020", paciente:"Caetano Souto Ribeiro", prof:"Ana Paula", conv:"REEMBOLSO", valor:540, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1021", paciente:"Clara Tristão", prof:"Ana Paula", conv:"UNIMED", valor:1635.12, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1022", paciente:"Bernardo Zanelatto Marques", prof:"Ariane", conv:"PARTICULAR", valor:180, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1023", paciente:"Davi Cabral Nascimento", prof:"Aline", conv:"PARTICULAR", valor:600, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1024", paciente:"Deniz Vieira Cruz", prof:"Ariane", conv:"PARTICULAR", valor:680, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1025", paciente:"Deniz Vieira Cruz", prof:"Jhennifer", conv:"PARTICULAR", valor:780, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1026", paciente:"Eduardo Peres", prof:"Emile", conv:"UNIMED", valor:1620, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1027", paciente:"Eduardo Peres", prof:"Nathália", conv:"UNIMED", valor:1090.08, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1028", paciente:"Eduardo Ioppi Gomes", prof:"Jhennifer", conv:"UNIMED", valor:545.04, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1029", paciente:"Gabriel da Silva", prof:"Jhennifer", conv:"PARTICULAR", valor:1040, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1030", paciente:"Elis Dessaune Vigano", prof:"Nathália", conv:"UNIMED", valor:545.04, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1031", paciente:"Gael Lorenzi Pretto", prof:"Ana Paula", conv:"UNIMED", valor:726.72, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1032", paciente:"Germano Capeletti Larsen", prof:"Emile", conv:"UNIMED", valor:780, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1033", paciente:"Germano Capeletti Larsen", prof:"Jhennifer", conv:"UNIMED", valor:720, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1034", paciente:"Guilherme Machado", prof:"Aline", conv:"UNIMED", valor:1090.08, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1035", paciente:"Guilherme Machado", prof:"Ariane", conv:"UNIMED", valor:726.72, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1036", paciente:"Guilherme Machado", prof:"Jhennifer", conv:"UNIMED", valor:726.72, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1037", paciente:"Icaro Costa Cristóvao", prof:"Emile", conv:"UNIMED", valor:720, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1038", paciente:"Icaro Costa Cristóvao", prof:"Ana Paula", conv:"UNIMED", valor:1560, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1039", paciente:"Icaro Costa Cristóvao", prof:"Nathália", conv:"UNIMED", valor:1200, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1040", paciente:"Jhonny do Nascimento da M. G.", prof:"Emile", conv:"UNIMED", valor:1980, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1041", paciente:"Jhonny do Nascimento da M. G.", prof:"Ariane", conv:"UNIMED", valor:908.4, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1042", paciente:"Jhonny do Nascimento da M. G.", prof:"Jhennifer", conv:"UNIMED", valor:545.04, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1043", paciente:"Henrique Batista da Cruz", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1044", paciente:"Isabelly Vitoria da Luz", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1045", paciente:"Isabelly Vitoria da Luz", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1046", paciente:"Jonatas dos Santos Menezes", prof:"Emile", conv:"PARTICULAR", valor:720, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1047", paciente:"Jonatas dos Santos Menezes", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1048", paciente:"Joaquim Martins Machado", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1049", paciente:"Julia Prado de Paula", prof:"Jhennifer", conv:"UNIMED", valor:545.04, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1050", paciente:"Julia Prado de Paula", prof:"Ana Paula", conv:"UNIMED", valor:726.72, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1051", paciente:"Kauan Vieira Cintra", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1052", paciente:"Leonardo Junior Teixeira Gomes", prof:"Emile", conv:"UNIMED", valor:540, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1053", paciente:"Leonardo Junior Teixeira Gomes", prof:"Ariane", conv:"UNIMED", valor:545.04, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1054", paciente:"Leonardo Junior Teixeira Gomes", prof:"Jhennifer", conv:"UNIMED", valor:363.36, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1055", paciente:"Lara Sanfelice Calone", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1056", paciente:"Lorenzo Silveira da Silva", prof:"Aline", conv:"PARTICULAR", valor:600, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1057", paciente:"Luna Ferreira Alves", prof:"Emile", conv:"UNIMED", valor:720, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1058", paciente:"Luiz Henrique Sutil de Gois", prof:"Ana Paula", conv:"SC_SAUDE", valor:2500, dataPag:"2026-06-15", obs:"ref. mai/26 · Avaliação"},
  {id:"1059", paciente:"Matteo Mautone Gomes", prof:"Aline", conv:"PARTICULAR", valor:180, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1060", paciente:"Miguel Xavier Latzke", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1061", paciente:"Miguel Xavier Latzke", prof:"Ariane", conv:"PARTICULAR", valor:680, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1062", paciente:"Lorenzo Vultolini", prof:"Nathália", conv:"UNIMED", valor:726.72, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1063", paciente:"Miguel Santos", prof:"Jhennifer", conv:"UNIMED", valor:545.04, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1064", paciente:"Miguel Santos", prof:"Ana Paula", conv:"UNIMED", valor:726.72, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1065", paciente:"Natalia Cristine da Silva Vieira", prof:"Emile", conv:"UNIMED", valor:720, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1066", paciente:"Natalia Cristine da Silva Vieira", prof:"Nathália", conv:"UNIMED", valor:726.72, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1067", paciente:"Nicolas da Silva Brito", prof:"Emile", conv:"UNIMED", valor:720, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1068", paciente:"Nicolas da Silva Brito", prof:"Ariane", conv:"UNIMED", valor:363.36, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1069", paciente:"Nicolas da Silva Brito", prof:"Jhennifer", conv:"UNIMED", valor:1090.08, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1070", paciente:"Nicolas Santos Furniel", prof:"Ariane", conv:"CELOS", valor:720, dataPag:"2026-06-26", obs:"ref. mai/26 · Reembolso"},
  {id:"1071", paciente:"Olivia Tamanini Lang", prof:"Emile", conv:"UNIMED", valor:480, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1072", paciente:"Olivia Tamanini Lang", prof:"Ariane", conv:"UNIMED", valor:720, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1073", paciente:"Olivia Tamanini Lang", prof:"Jhennifer", conv:"UNIMED", valor:660, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1074", paciente:"Pedro Kempes Coraldi Spencer", prof:"Ariane", conv:"UNIMED", valor:545.04, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1075", paciente:"Rafael Chaves Ronchi", prof:"Emile", conv:"UNIMED", valor:720, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1076", paciente:"Rafael Chaves Ronchi", prof:"Ariane", conv:"UNIMED", valor:363.36, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1077", paciente:"Rafael Chaves Ronchi", prof:"Jhennifer", conv:"UNIMED", valor:363.36, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1078", paciente:"Sofia Brasil", prof:"Aline", conv:"UNIMED", valor:545.04, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1079", paciente:"Sofia Brasil", prof:"Jhennifer", conv:"UNIMED", valor:363.36, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1080", paciente:"Ricardo Frantz Viero", prof:"Emile", conv:"UNIMED", valor:900, dataPag:"2026-06-26", obs:"ref. mai/26"},
  {id:"1081", paciente:"Nina Borges", prof:"Aline", conv:"PARTICULAR", valor:720, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1082", paciente:"Pedro Fagundes Paula", prof:"Aline", conv:"PARTICULAR", valor:560, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1083", paciente:"Ravi de Oliveira Matos", prof:"Ana Paula", conv:"PARTICULAR", valor:800, dataPag:"2026-06-15", obs:"ref. mai/26"},
  {id:"1084", paciente:"Ravi de Oliveira Matos", prof:"Nathália", conv:"PARTICULAR", valor:720, dataPag:"2026-06-15", obs:"ref. mai/26"},
  // ── Previsões Jul-Dez/2026 ─────────────────────────────────────────
  {id:"2000", paciente:"Alice Vieira Vasconcelos", prof:"Emile", conv:"PARTICULAR", valor:500, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2001", paciente:"Amábile Vieira Vasconcelos", prof:"Aline", conv:"PARTICULAR", valor:500, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2002", paciente:"Amábile Vieira Vasconcelos", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2003", paciente:"Ana Arasaki Marcilio", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2004", paciente:"Ana Arasaki Marcilio", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2005", paciente:"Annelize de Oliveira Rodrigues", prof:"Emile", conv:"PARTICULAR", valor:540, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2006", paciente:"Bento Nascimento Oliveira André", prof:"Amanda", conv:"PARTICULAR", valor:580, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2007", paciente:"Bernardo Machado Kessler", prof:"Emile", conv:"PARTICULAR", valor:580, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2008", paciente:"Bernardo Zanelatto Marques", prof:"Ariane", conv:"PARTICULAR", valor:180, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2009", paciente:"Davi Cabral Nascimento", prof:"Aline", conv:"PARTICULAR", valor:600, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2010", paciente:"Deniz Vieira Cruz", prof:"Ariane", conv:"PARTICULAR", valor:680, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2011", paciente:"Deniz Vieira Cruz", prof:"Jhennifer", conv:"PARTICULAR", valor:780, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2012", paciente:"Gabriel da Silva", prof:"Jhennifer", conv:"PARTICULAR", valor:1040, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2013", paciente:"Henrique Batista da Cruz", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2014", paciente:"Isabelly Vitoria da Luz", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2015", paciente:"Isabelly Vitoria da Luz", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2016", paciente:"Jonatas dos Santos Menezes", prof:"Emile", conv:"PARTICULAR", valor:720, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2017", paciente:"Jonatas dos Santos Menezes", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2018", paciente:"Joaquim Martins Machado", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2019", paciente:"Kauan Vieira Cintra", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2020", paciente:"Lara Sanfelice Calone", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2021", paciente:"Lorenzo Silveira da Silva", prof:"Aline", conv:"PARTICULAR", valor:600, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2022", paciente:"Matteo Mautone Gomes", prof:"Aline", conv:"PARTICULAR", valor:180, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2023", paciente:"Miguel Xavier Latzke", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2024", paciente:"Miguel Xavier Latzke", prof:"Ariane", conv:"PARTICULAR", valor:680, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2025", paciente:"Nina Borges", prof:"Aline", conv:"PARTICULAR", valor:720, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2026", paciente:"Pedro Fagundes Paula", prof:"Aline", conv:"PARTICULAR", valor:560, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2027", paciente:"Ravi de Oliveira Matos", prof:"Ana Paula", conv:"PARTICULAR", valor:800, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2028", paciente:"Ravi de Oliveira Matos", prof:"Nathália", conv:"PARTICULAR", valor:720, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2029", paciente:"Luiz Henrique Sutil de Gois", prof:"Ana Paula", conv:"SC_SAUDE", valor:2500, dataPag:"2026-07-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2030", paciente:"Amanda Oliveira da Silva", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2031", paciente:"Ana Clara Goulart Forgerini", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2032", paciente:"Antônio Pires Alberton", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2033", paciente:"Antônio Pires Alberton", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2034", paciente:"Antônio Pires Alberton", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2035", paciente:"Arthur Pelozato", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2036", paciente:"Beatriz Carvalho Pereira", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2037", paciente:"Beatriz Carvalho Pereira", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2038", paciente:"Betina da Cunha Nikolay", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2039", paciente:"Betina da Cunha Nikolay", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2040", paciente:"Betina da Cunha Nikolay", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2041", paciente:"Betina da Cunha Nikolay", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2042", paciente:"Caetano Souto Ribeiro", prof:"Ana Paula", conv:"CELOS", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2043", paciente:"Clara Tristão", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2044", paciente:"Eduardo Peres", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2045", paciente:"Eduardo Peres", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2046", paciente:"Eduardo Ioppi Gomes", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2047", paciente:"Elis Dessaune Vigano", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2048", paciente:"Gael Lorenzi Pretto", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2049", paciente:"Germano Capeletti Larsen", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2050", paciente:"Germano Capeletti Larsen", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2051", paciente:"Guilherme Machado", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2052", paciente:"Guilherme Machado", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2053", paciente:"Guilherme Machado", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2054", paciente:"Icaro Costa Cristóvao", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2055", paciente:"Icaro Costa Cristóvao", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2056", paciente:"Icaro Costa Cristóvao", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2057", paciente:"Jhonny do Nascimento da M. G.", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2058", paciente:"Jhonny do Nascimento da M. G.", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2059", paciente:"Jhonny do Nascimento da M. G.", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2060", paciente:"Julia Prado de Paula", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2061", paciente:"Julia Prado de Paula", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2062", paciente:"Leonardo Junior Teixeira Gomes", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2063", paciente:"Leonardo Junior Teixeira Gomes", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2064", paciente:"Leonardo Junior Teixeira Gomes", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2065", paciente:"Lorenzo Vultolini", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2066", paciente:"Luna Ferreira Alves", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2067", paciente:"Miguel Santos", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2068", paciente:"Miguel Santos", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2069", paciente:"Natalia Cristine da Silva Vieira", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2070", paciente:"Natalia Cristine da Silva Vieira", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2071", paciente:"Nicolas da Silva Brito", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2072", paciente:"Nicolas da Silva Brito", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2073", paciente:"Nicolas da Silva Brito", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2074", paciente:"Nicolas Santos Furniel", prof:"Ariane", conv:"CELOS", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2075", paciente:"Olivia Tamanini Lang", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2076", paciente:"Olivia Tamanini Lang", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2077", paciente:"Olivia Tamanini Lang", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2078", paciente:"Pedro Kempes Coraldi Spencer", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2079", paciente:"Rafael Chaves Ronchi", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2080", paciente:"Rafael Chaves Ronchi", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2081", paciente:"Rafael Chaves Ronchi", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2082", paciente:"Sofia Brasil", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2083", paciente:"Sofia Brasil", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2084", paciente:"Ricardo Frantz Viero", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-07-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2085", paciente:"Alice Vieira Vasconcelos", prof:"Emile", conv:"PARTICULAR", valor:500, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2086", paciente:"Amábile Vieira Vasconcelos", prof:"Aline", conv:"PARTICULAR", valor:500, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2087", paciente:"Amábile Vieira Vasconcelos", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2088", paciente:"Ana Arasaki Marcilio", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2089", paciente:"Ana Arasaki Marcilio", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2090", paciente:"Annelize de Oliveira Rodrigues", prof:"Emile", conv:"PARTICULAR", valor:540, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2091", paciente:"Bento Nascimento Oliveira André", prof:"Amanda", conv:"PARTICULAR", valor:580, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2092", paciente:"Bernardo Machado Kessler", prof:"Emile", conv:"PARTICULAR", valor:580, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2093", paciente:"Bernardo Zanelatto Marques", prof:"Ariane", conv:"PARTICULAR", valor:180, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2094", paciente:"Davi Cabral Nascimento", prof:"Aline", conv:"PARTICULAR", valor:600, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2095", paciente:"Deniz Vieira Cruz", prof:"Ariane", conv:"PARTICULAR", valor:680, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2096", paciente:"Deniz Vieira Cruz", prof:"Jhennifer", conv:"PARTICULAR", valor:780, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2097", paciente:"Gabriel da Silva", prof:"Jhennifer", conv:"PARTICULAR", valor:1040, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2098", paciente:"Henrique Batista da Cruz", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2099", paciente:"Isabelly Vitoria da Luz", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2100", paciente:"Isabelly Vitoria da Luz", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2101", paciente:"Jonatas dos Santos Menezes", prof:"Emile", conv:"PARTICULAR", valor:720, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2102", paciente:"Jonatas dos Santos Menezes", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2103", paciente:"Joaquim Martins Machado", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2104", paciente:"Kauan Vieira Cintra", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2105", paciente:"Lara Sanfelice Calone", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2106", paciente:"Lorenzo Silveira da Silva", prof:"Aline", conv:"PARTICULAR", valor:600, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2107", paciente:"Matteo Mautone Gomes", prof:"Aline", conv:"PARTICULAR", valor:180, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2108", paciente:"Miguel Xavier Latzke", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2109", paciente:"Miguel Xavier Latzke", prof:"Ariane", conv:"PARTICULAR", valor:680, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2110", paciente:"Nina Borges", prof:"Aline", conv:"PARTICULAR", valor:720, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2111", paciente:"Pedro Fagundes Paula", prof:"Aline", conv:"PARTICULAR", valor:560, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2112", paciente:"Ravi de Oliveira Matos", prof:"Ana Paula", conv:"PARTICULAR", valor:800, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2113", paciente:"Ravi de Oliveira Matos", prof:"Nathália", conv:"PARTICULAR", valor:720, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2114", paciente:"Luiz Henrique Sutil de Gois", prof:"Ana Paula", conv:"SC_SAUDE", valor:2500, dataPag:"2026-08-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2115", paciente:"Amanda Oliveira da Silva", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2116", paciente:"Ana Clara Goulart Forgerini", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2117", paciente:"Antônio Pires Alberton", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2118", paciente:"Antônio Pires Alberton", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2119", paciente:"Antônio Pires Alberton", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2120", paciente:"Arthur Pelozato", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2121", paciente:"Beatriz Carvalho Pereira", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2122", paciente:"Beatriz Carvalho Pereira", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2123", paciente:"Betina da Cunha Nikolay", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2124", paciente:"Betina da Cunha Nikolay", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2125", paciente:"Betina da Cunha Nikolay", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2126", paciente:"Betina da Cunha Nikolay", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2127", paciente:"Caetano Souto Ribeiro", prof:"Ana Paula", conv:"CELOS", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2128", paciente:"Clara Tristão", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2129", paciente:"Eduardo Peres", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2130", paciente:"Eduardo Peres", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2131", paciente:"Eduardo Ioppi Gomes", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2132", paciente:"Elis Dessaune Vigano", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2133", paciente:"Gael Lorenzi Pretto", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2134", paciente:"Germano Capeletti Larsen", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2135", paciente:"Germano Capeletti Larsen", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2136", paciente:"Guilherme Machado", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2137", paciente:"Guilherme Machado", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2138", paciente:"Guilherme Machado", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2139", paciente:"Icaro Costa Cristóvao", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2140", paciente:"Icaro Costa Cristóvao", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2141", paciente:"Icaro Costa Cristóvao", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2142", paciente:"Jhonny do Nascimento da M. G.", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2143", paciente:"Jhonny do Nascimento da M. G.", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2144", paciente:"Jhonny do Nascimento da M. G.", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2145", paciente:"Julia Prado de Paula", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2146", paciente:"Julia Prado de Paula", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2147", paciente:"Leonardo Junior Teixeira Gomes", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2148", paciente:"Leonardo Junior Teixeira Gomes", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2149", paciente:"Leonardo Junior Teixeira Gomes", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2150", paciente:"Lorenzo Vultolini", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2151", paciente:"Luna Ferreira Alves", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2152", paciente:"Miguel Santos", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2153", paciente:"Miguel Santos", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2154", paciente:"Natalia Cristine da Silva Vieira", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2155", paciente:"Natalia Cristine da Silva Vieira", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2156", paciente:"Nicolas da Silva Brito", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2157", paciente:"Nicolas da Silva Brito", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2158", paciente:"Nicolas da Silva Brito", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2159", paciente:"Nicolas Santos Furniel", prof:"Ariane", conv:"CELOS", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2160", paciente:"Olivia Tamanini Lang", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2161", paciente:"Olivia Tamanini Lang", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2162", paciente:"Olivia Tamanini Lang", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2163", paciente:"Pedro Kempes Coraldi Spencer", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2164", paciente:"Rafael Chaves Ronchi", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2165", paciente:"Rafael Chaves Ronchi", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2166", paciente:"Rafael Chaves Ronchi", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2167", paciente:"Sofia Brasil", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2168", paciente:"Sofia Brasil", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2169", paciente:"Ricardo Frantz Viero", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-08-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2170", paciente:"Alice Vieira Vasconcelos", prof:"Emile", conv:"PARTICULAR", valor:500, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2171", paciente:"Amábile Vieira Vasconcelos", prof:"Aline", conv:"PARTICULAR", valor:500, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2172", paciente:"Amábile Vieira Vasconcelos", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2173", paciente:"Ana Arasaki Marcilio", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2174", paciente:"Ana Arasaki Marcilio", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2175", paciente:"Annelize de Oliveira Rodrigues", prof:"Emile", conv:"PARTICULAR", valor:540, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2176", paciente:"Bento Nascimento Oliveira André", prof:"Amanda", conv:"PARTICULAR", valor:580, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2177", paciente:"Bernardo Machado Kessler", prof:"Emile", conv:"PARTICULAR", valor:580, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2178", paciente:"Bernardo Zanelatto Marques", prof:"Ariane", conv:"PARTICULAR", valor:180, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2179", paciente:"Davi Cabral Nascimento", prof:"Aline", conv:"PARTICULAR", valor:600, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2180", paciente:"Deniz Vieira Cruz", prof:"Ariane", conv:"PARTICULAR", valor:680, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2181", paciente:"Deniz Vieira Cruz", prof:"Jhennifer", conv:"PARTICULAR", valor:780, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2182", paciente:"Gabriel da Silva", prof:"Jhennifer", conv:"PARTICULAR", valor:1040, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2183", paciente:"Henrique Batista da Cruz", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2184", paciente:"Isabelly Vitoria da Luz", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2185", paciente:"Isabelly Vitoria da Luz", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2186", paciente:"Jonatas dos Santos Menezes", prof:"Emile", conv:"PARTICULAR", valor:720, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2187", paciente:"Jonatas dos Santos Menezes", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2188", paciente:"Joaquim Martins Machado", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2189", paciente:"Kauan Vieira Cintra", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2190", paciente:"Lara Sanfelice Calone", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2191", paciente:"Lorenzo Silveira da Silva", prof:"Aline", conv:"PARTICULAR", valor:600, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2192", paciente:"Matteo Mautone Gomes", prof:"Aline", conv:"PARTICULAR", valor:180, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2193", paciente:"Miguel Xavier Latzke", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2194", paciente:"Miguel Xavier Latzke", prof:"Ariane", conv:"PARTICULAR", valor:680, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2195", paciente:"Nina Borges", prof:"Aline", conv:"PARTICULAR", valor:720, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2196", paciente:"Pedro Fagundes Paula", prof:"Aline", conv:"PARTICULAR", valor:560, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2197", paciente:"Ravi de Oliveira Matos", prof:"Ana Paula", conv:"PARTICULAR", valor:800, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2198", paciente:"Ravi de Oliveira Matos", prof:"Nathália", conv:"PARTICULAR", valor:720, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2199", paciente:"Luiz Henrique Sutil de Gois", prof:"Ana Paula", conv:"SC_SAUDE", valor:2500, dataPag:"2026-09-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2200", paciente:"Amanda Oliveira da Silva", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2201", paciente:"Ana Clara Goulart Forgerini", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2202", paciente:"Antônio Pires Alberton", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2203", paciente:"Antônio Pires Alberton", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2204", paciente:"Antônio Pires Alberton", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2205", paciente:"Arthur Pelozato", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2206", paciente:"Beatriz Carvalho Pereira", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2207", paciente:"Beatriz Carvalho Pereira", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2208", paciente:"Betina da Cunha Nikolay", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2209", paciente:"Betina da Cunha Nikolay", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2210", paciente:"Betina da Cunha Nikolay", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2211", paciente:"Betina da Cunha Nikolay", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2212", paciente:"Caetano Souto Ribeiro", prof:"Ana Paula", conv:"CELOS", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2213", paciente:"Clara Tristão", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2214", paciente:"Eduardo Peres", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2215", paciente:"Eduardo Peres", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2216", paciente:"Eduardo Ioppi Gomes", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2217", paciente:"Elis Dessaune Vigano", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2218", paciente:"Gael Lorenzi Pretto", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2219", paciente:"Germano Capeletti Larsen", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2220", paciente:"Germano Capeletti Larsen", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2221", paciente:"Guilherme Machado", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2222", paciente:"Guilherme Machado", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2223", paciente:"Guilherme Machado", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2224", paciente:"Icaro Costa Cristóvao", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2225", paciente:"Icaro Costa Cristóvao", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2226", paciente:"Icaro Costa Cristóvao", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2227", paciente:"Jhonny do Nascimento da M. G.", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2228", paciente:"Jhonny do Nascimento da M. G.", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2229", paciente:"Jhonny do Nascimento da M. G.", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2230", paciente:"Julia Prado de Paula", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2231", paciente:"Julia Prado de Paula", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2232", paciente:"Leonardo Junior Teixeira Gomes", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2233", paciente:"Leonardo Junior Teixeira Gomes", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2234", paciente:"Leonardo Junior Teixeira Gomes", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2235", paciente:"Lorenzo Vultolini", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2236", paciente:"Luna Ferreira Alves", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2237", paciente:"Miguel Santos", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2238", paciente:"Miguel Santos", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2239", paciente:"Natalia Cristine da Silva Vieira", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2240", paciente:"Natalia Cristine da Silva Vieira", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2241", paciente:"Nicolas da Silva Brito", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2242", paciente:"Nicolas da Silva Brito", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2243", paciente:"Nicolas da Silva Brito", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2244", paciente:"Nicolas Santos Furniel", prof:"Ariane", conv:"CELOS", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2245", paciente:"Olivia Tamanini Lang", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2246", paciente:"Olivia Tamanini Lang", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2247", paciente:"Olivia Tamanini Lang", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2248", paciente:"Pedro Kempes Coraldi Spencer", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2249", paciente:"Rafael Chaves Ronchi", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2250", paciente:"Rafael Chaves Ronchi", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2251", paciente:"Rafael Chaves Ronchi", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2252", paciente:"Sofia Brasil", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2253", paciente:"Sofia Brasil", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2254", paciente:"Ricardo Frantz Viero", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-09-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2255", paciente:"Alice Vieira Vasconcelos", prof:"Emile", conv:"PARTICULAR", valor:500, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2256", paciente:"Amábile Vieira Vasconcelos", prof:"Aline", conv:"PARTICULAR", valor:500, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2257", paciente:"Amábile Vieira Vasconcelos", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2258", paciente:"Ana Arasaki Marcilio", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2259", paciente:"Ana Arasaki Marcilio", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2260", paciente:"Annelize de Oliveira Rodrigues", prof:"Emile", conv:"PARTICULAR", valor:540, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2261", paciente:"Bento Nascimento Oliveira André", prof:"Amanda", conv:"PARTICULAR", valor:580, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2262", paciente:"Bernardo Machado Kessler", prof:"Emile", conv:"PARTICULAR", valor:580, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2263", paciente:"Bernardo Zanelatto Marques", prof:"Ariane", conv:"PARTICULAR", valor:180, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2264", paciente:"Davi Cabral Nascimento", prof:"Aline", conv:"PARTICULAR", valor:600, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2265", paciente:"Deniz Vieira Cruz", prof:"Ariane", conv:"PARTICULAR", valor:680, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2266", paciente:"Deniz Vieira Cruz", prof:"Jhennifer", conv:"PARTICULAR", valor:780, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2267", paciente:"Gabriel da Silva", prof:"Jhennifer", conv:"PARTICULAR", valor:1040, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2268", paciente:"Henrique Batista da Cruz", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2269", paciente:"Isabelly Vitoria da Luz", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2270", paciente:"Isabelly Vitoria da Luz", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2271", paciente:"Jonatas dos Santos Menezes", prof:"Emile", conv:"PARTICULAR", valor:720, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2272", paciente:"Jonatas dos Santos Menezes", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2273", paciente:"Joaquim Martins Machado", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2274", paciente:"Kauan Vieira Cintra", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2275", paciente:"Lara Sanfelice Calone", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2276", paciente:"Lorenzo Silveira da Silva", prof:"Aline", conv:"PARTICULAR", valor:600, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2277", paciente:"Matteo Mautone Gomes", prof:"Aline", conv:"PARTICULAR", valor:180, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2278", paciente:"Miguel Xavier Latzke", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2279", paciente:"Miguel Xavier Latzke", prof:"Ariane", conv:"PARTICULAR", valor:680, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2280", paciente:"Nina Borges", prof:"Aline", conv:"PARTICULAR", valor:720, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2281", paciente:"Pedro Fagundes Paula", prof:"Aline", conv:"PARTICULAR", valor:560, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2282", paciente:"Ravi de Oliveira Matos", prof:"Ana Paula", conv:"PARTICULAR", valor:800, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2283", paciente:"Ravi de Oliveira Matos", prof:"Nathália", conv:"PARTICULAR", valor:720, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2284", paciente:"Luiz Henrique Sutil de Gois", prof:"Ana Paula", conv:"SC_SAUDE", valor:2500, dataPag:"2026-10-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2285", paciente:"Amanda Oliveira da Silva", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2286", paciente:"Ana Clara Goulart Forgerini", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2287", paciente:"Antônio Pires Alberton", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2288", paciente:"Antônio Pires Alberton", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2289", paciente:"Antônio Pires Alberton", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2290", paciente:"Arthur Pelozato", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2291", paciente:"Beatriz Carvalho Pereira", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2292", paciente:"Beatriz Carvalho Pereira", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2293", paciente:"Betina da Cunha Nikolay", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2294", paciente:"Betina da Cunha Nikolay", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2295", paciente:"Betina da Cunha Nikolay", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2296", paciente:"Betina da Cunha Nikolay", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2297", paciente:"Caetano Souto Ribeiro", prof:"Ana Paula", conv:"CELOS", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2298", paciente:"Clara Tristão", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2299", paciente:"Eduardo Peres", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2300", paciente:"Eduardo Peres", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2301", paciente:"Eduardo Ioppi Gomes", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2302", paciente:"Elis Dessaune Vigano", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2303", paciente:"Gael Lorenzi Pretto", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2304", paciente:"Germano Capeletti Larsen", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2305", paciente:"Germano Capeletti Larsen", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2306", paciente:"Guilherme Machado", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2307", paciente:"Guilherme Machado", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2308", paciente:"Guilherme Machado", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2309", paciente:"Icaro Costa Cristóvao", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2310", paciente:"Icaro Costa Cristóvao", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2311", paciente:"Icaro Costa Cristóvao", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2312", paciente:"Jhonny do Nascimento da M. G.", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2313", paciente:"Jhonny do Nascimento da M. G.", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2314", paciente:"Jhonny do Nascimento da M. G.", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2315", paciente:"Julia Prado de Paula", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2316", paciente:"Julia Prado de Paula", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2317", paciente:"Leonardo Junior Teixeira Gomes", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2318", paciente:"Leonardo Junior Teixeira Gomes", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2319", paciente:"Leonardo Junior Teixeira Gomes", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2320", paciente:"Lorenzo Vultolini", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2321", paciente:"Luna Ferreira Alves", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2322", paciente:"Miguel Santos", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2323", paciente:"Miguel Santos", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2324", paciente:"Natalia Cristine da Silva Vieira", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2325", paciente:"Natalia Cristine da Silva Vieira", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2326", paciente:"Nicolas da Silva Brito", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2327", paciente:"Nicolas da Silva Brito", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2328", paciente:"Nicolas da Silva Brito", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2329", paciente:"Nicolas Santos Furniel", prof:"Ariane", conv:"CELOS", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2330", paciente:"Olivia Tamanini Lang", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2331", paciente:"Olivia Tamanini Lang", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2332", paciente:"Olivia Tamanini Lang", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2333", paciente:"Pedro Kempes Coraldi Spencer", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2334", paciente:"Rafael Chaves Ronchi", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2335", paciente:"Rafael Chaves Ronchi", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2336", paciente:"Rafael Chaves Ronchi", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2337", paciente:"Sofia Brasil", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2338", paciente:"Sofia Brasil", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2339", paciente:"Ricardo Frantz Viero", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-10-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2340", paciente:"Alice Vieira Vasconcelos", prof:"Emile", conv:"PARTICULAR", valor:500, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2341", paciente:"Amábile Vieira Vasconcelos", prof:"Aline", conv:"PARTICULAR", valor:500, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2342", paciente:"Amábile Vieira Vasconcelos", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2343", paciente:"Ana Arasaki Marcilio", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2344", paciente:"Ana Arasaki Marcilio", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2345", paciente:"Annelize de Oliveira Rodrigues", prof:"Emile", conv:"PARTICULAR", valor:540, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2346", paciente:"Bento Nascimento Oliveira André", prof:"Amanda", conv:"PARTICULAR", valor:580, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2347", paciente:"Bernardo Machado Kessler", prof:"Emile", conv:"PARTICULAR", valor:580, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2348", paciente:"Bernardo Zanelatto Marques", prof:"Ariane", conv:"PARTICULAR", valor:180, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2349", paciente:"Davi Cabral Nascimento", prof:"Aline", conv:"PARTICULAR", valor:600, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2350", paciente:"Deniz Vieira Cruz", prof:"Ariane", conv:"PARTICULAR", valor:680, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2351", paciente:"Deniz Vieira Cruz", prof:"Jhennifer", conv:"PARTICULAR", valor:780, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2352", paciente:"Gabriel da Silva", prof:"Jhennifer", conv:"PARTICULAR", valor:1040, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2353", paciente:"Henrique Batista da Cruz", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2354", paciente:"Isabelly Vitoria da Luz", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2355", paciente:"Isabelly Vitoria da Luz", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2356", paciente:"Jonatas dos Santos Menezes", prof:"Emile", conv:"PARTICULAR", valor:720, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2357", paciente:"Jonatas dos Santos Menezes", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2358", paciente:"Joaquim Martins Machado", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2359", paciente:"Kauan Vieira Cintra", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2360", paciente:"Lara Sanfelice Calone", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2361", paciente:"Lorenzo Silveira da Silva", prof:"Aline", conv:"PARTICULAR", valor:600, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2362", paciente:"Matteo Mautone Gomes", prof:"Aline", conv:"PARTICULAR", valor:180, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2363", paciente:"Miguel Xavier Latzke", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2364", paciente:"Miguel Xavier Latzke", prof:"Ariane", conv:"PARTICULAR", valor:680, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2365", paciente:"Nina Borges", prof:"Aline", conv:"PARTICULAR", valor:720, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2366", paciente:"Pedro Fagundes Paula", prof:"Aline", conv:"PARTICULAR", valor:560, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2367", paciente:"Ravi de Oliveira Matos", prof:"Ana Paula", conv:"PARTICULAR", valor:800, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2368", paciente:"Ravi de Oliveira Matos", prof:"Nathália", conv:"PARTICULAR", valor:720, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2369", paciente:"Luiz Henrique Sutil de Gois", prof:"Ana Paula", conv:"SC_SAUDE", valor:2500, dataPag:"2026-11-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2370", paciente:"Amanda Oliveira da Silva", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2371", paciente:"Ana Clara Goulart Forgerini", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2372", paciente:"Antônio Pires Alberton", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2373", paciente:"Antônio Pires Alberton", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2374", paciente:"Antônio Pires Alberton", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2375", paciente:"Arthur Pelozato", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2376", paciente:"Beatriz Carvalho Pereira", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2377", paciente:"Beatriz Carvalho Pereira", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2378", paciente:"Betina da Cunha Nikolay", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2379", paciente:"Betina da Cunha Nikolay", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2380", paciente:"Betina da Cunha Nikolay", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2381", paciente:"Betina da Cunha Nikolay", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2382", paciente:"Caetano Souto Ribeiro", prof:"Ana Paula", conv:"CELOS", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2383", paciente:"Clara Tristão", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2384", paciente:"Eduardo Peres", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2385", paciente:"Eduardo Peres", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2386", paciente:"Eduardo Ioppi Gomes", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2387", paciente:"Elis Dessaune Vigano", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2388", paciente:"Gael Lorenzi Pretto", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2389", paciente:"Germano Capeletti Larsen", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2390", paciente:"Germano Capeletti Larsen", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2391", paciente:"Guilherme Machado", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2392", paciente:"Guilherme Machado", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2393", paciente:"Guilherme Machado", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2394", paciente:"Icaro Costa Cristóvao", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2395", paciente:"Icaro Costa Cristóvao", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2396", paciente:"Icaro Costa Cristóvao", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2397", paciente:"Jhonny do Nascimento da M. G.", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2398", paciente:"Jhonny do Nascimento da M. G.", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2399", paciente:"Jhonny do Nascimento da M. G.", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2400", paciente:"Julia Prado de Paula", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2401", paciente:"Julia Prado de Paula", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2402", paciente:"Leonardo Junior Teixeira Gomes", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2403", paciente:"Leonardo Junior Teixeira Gomes", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2404", paciente:"Leonardo Junior Teixeira Gomes", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2405", paciente:"Lorenzo Vultolini", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2406", paciente:"Luna Ferreira Alves", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2407", paciente:"Miguel Santos", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2408", paciente:"Miguel Santos", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2409", paciente:"Natalia Cristine da Silva Vieira", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2410", paciente:"Natalia Cristine da Silva Vieira", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2411", paciente:"Nicolas da Silva Brito", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2412", paciente:"Nicolas da Silva Brito", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2413", paciente:"Nicolas da Silva Brito", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2414", paciente:"Nicolas Santos Furniel", prof:"Ariane", conv:"CELOS", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2415", paciente:"Olivia Tamanini Lang", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2416", paciente:"Olivia Tamanini Lang", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2417", paciente:"Olivia Tamanini Lang", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2418", paciente:"Pedro Kempes Coraldi Spencer", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2419", paciente:"Rafael Chaves Ronchi", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2420", paciente:"Rafael Chaves Ronchi", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2421", paciente:"Rafael Chaves Ronchi", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2422", paciente:"Sofia Brasil", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2423", paciente:"Sofia Brasil", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2424", paciente:"Ricardo Frantz Viero", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-11-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2425", paciente:"Alice Vieira Vasconcelos", prof:"Emile", conv:"PARTICULAR", valor:500, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2426", paciente:"Amábile Vieira Vasconcelos", prof:"Aline", conv:"PARTICULAR", valor:500, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2427", paciente:"Amábile Vieira Vasconcelos", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2428", paciente:"Ana Arasaki Marcilio", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2429", paciente:"Ana Arasaki Marcilio", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2430", paciente:"Annelize de Oliveira Rodrigues", prof:"Emile", conv:"PARTICULAR", valor:540, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2431", paciente:"Bento Nascimento Oliveira André", prof:"Amanda", conv:"PARTICULAR", valor:580, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2432", paciente:"Bernardo Machado Kessler", prof:"Emile", conv:"PARTICULAR", valor:580, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2433", paciente:"Bernardo Zanelatto Marques", prof:"Ariane", conv:"PARTICULAR", valor:180, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2434", paciente:"Davi Cabral Nascimento", prof:"Aline", conv:"PARTICULAR", valor:600, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2435", paciente:"Deniz Vieira Cruz", prof:"Ariane", conv:"PARTICULAR", valor:680, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2436", paciente:"Deniz Vieira Cruz", prof:"Jhennifer", conv:"PARTICULAR", valor:780, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2437", paciente:"Gabriel da Silva", prof:"Jhennifer", conv:"PARTICULAR", valor:1040, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2438", paciente:"Henrique Batista da Cruz", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2439", paciente:"Isabelly Vitoria da Luz", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2440", paciente:"Isabelly Vitoria da Luz", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2441", paciente:"Jonatas dos Santos Menezes", prof:"Emile", conv:"PARTICULAR", valor:720, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2442", paciente:"Jonatas dos Santos Menezes", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2443", paciente:"Joaquim Martins Machado", prof:"Ariane", conv:"PARTICULAR", valor:720, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2444", paciente:"Kauan Vieira Cintra", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2445", paciente:"Lara Sanfelice Calone", prof:"Nathália", conv:"PARTICULAR", valor:800, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2446", paciente:"Lorenzo Silveira da Silva", prof:"Aline", conv:"PARTICULAR", valor:600, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2447", paciente:"Matteo Mautone Gomes", prof:"Aline", conv:"PARTICULAR", valor:180, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2448", paciente:"Miguel Xavier Latzke", prof:"Emile", conv:"PARTICULAR", valor:600, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2449", paciente:"Miguel Xavier Latzke", prof:"Ariane", conv:"PARTICULAR", valor:680, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2450", paciente:"Nina Borges", prof:"Aline", conv:"PARTICULAR", valor:720, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2451", paciente:"Pedro Fagundes Paula", prof:"Aline", conv:"PARTICULAR", valor:560, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2452", paciente:"Ravi de Oliveira Matos", prof:"Ana Paula", conv:"PARTICULAR", valor:800, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2453", paciente:"Ravi de Oliveira Matos", prof:"Nathália", conv:"PARTICULAR", valor:720, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2454", paciente:"Luiz Henrique Sutil de Gois", prof:"Ana Paula", conv:"SC_SAUDE", valor:2500, dataPag:"2026-12-15", obs:"pacote · prev.", tipo:"pacote"},
  {id:"2455", paciente:"Amanda Oliveira da Silva", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2456", paciente:"Ana Clara Goulart Forgerini", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2457", paciente:"Antônio Pires Alberton", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2458", paciente:"Antônio Pires Alberton", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2459", paciente:"Antônio Pires Alberton", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2460", paciente:"Arthur Pelozato", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2461", paciente:"Beatriz Carvalho Pereira", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2462", paciente:"Beatriz Carvalho Pereira", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2463", paciente:"Betina da Cunha Nikolay", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2464", paciente:"Betina da Cunha Nikolay", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2465", paciente:"Betina da Cunha Nikolay", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2466", paciente:"Betina da Cunha Nikolay", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2467", paciente:"Caetano Souto Ribeiro", prof:"Ana Paula", conv:"CELOS", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2468", paciente:"Clara Tristão", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2469", paciente:"Eduardo Peres", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2470", paciente:"Eduardo Peres", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2471", paciente:"Eduardo Ioppi Gomes", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2472", paciente:"Elis Dessaune Vigano", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2473", paciente:"Gael Lorenzi Pretto", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2474", paciente:"Germano Capeletti Larsen", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2475", paciente:"Germano Capeletti Larsen", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2476", paciente:"Guilherme Machado", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2477", paciente:"Guilherme Machado", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2478", paciente:"Guilherme Machado", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2479", paciente:"Icaro Costa Cristóvao", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2480", paciente:"Icaro Costa Cristóvao", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2481", paciente:"Icaro Costa Cristóvao", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2482", paciente:"Jhonny do Nascimento da M. G.", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2483", paciente:"Jhonny do Nascimento da M. G.", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2484", paciente:"Jhonny do Nascimento da M. G.", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2485", paciente:"Julia Prado de Paula", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2486", paciente:"Julia Prado de Paula", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2487", paciente:"Leonardo Junior Teixeira Gomes", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2488", paciente:"Leonardo Junior Teixeira Gomes", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2489", paciente:"Leonardo Junior Teixeira Gomes", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2490", paciente:"Lorenzo Vultolini", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2491", paciente:"Luna Ferreira Alves", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2492", paciente:"Miguel Santos", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2493", paciente:"Miguel Santos", prof:"Ana Paula", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2494", paciente:"Natalia Cristine da Silva Vieira", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2495", paciente:"Natalia Cristine da Silva Vieira", prof:"Nathália", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2496", paciente:"Nicolas da Silva Brito", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2497", paciente:"Nicolas da Silva Brito", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2498", paciente:"Nicolas da Silva Brito", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2499", paciente:"Nicolas Santos Furniel", prof:"Ariane", conv:"CELOS", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2500", paciente:"Olivia Tamanini Lang", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2501", paciente:"Olivia Tamanini Lang", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2502", paciente:"Olivia Tamanini Lang", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2503", paciente:"Pedro Kempes Coraldi Spencer", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2504", paciente:"Rafael Chaves Ronchi", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2505", paciente:"Rafael Chaves Ronchi", prof:"Ariane", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2506", paciente:"Rafael Chaves Ronchi", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2507", paciente:"Sofia Brasil", prof:"Aline", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2508", paciente:"Sofia Brasil", prof:"Jhennifer", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  {id:"2509", paciente:"Ricardo Frantz Viero", prof:"Emile", conv:"UNIMED", valor:0, dataPag:"2026-12-26", obs:"a confirmar · prev.", tipo:"sessao"},
  ]);
  const [formC,       setFormC]       = useState(emptyC);
  const [editCId,     setEditCId]     = useState(null);
  const [filtroConv,  setFiltroConv]  = useState("TODOS");
  const [filtroProf,  setFiltroProf]  = useState("TODOS");
  const [buscaC,      setBuscaC]      = useState("");
  const [delC,        setDelC]        = useState(null);

  function salvarC() {
    if (!formC.paciente.trim()||!formC.valor||!formC.dataPag) return;
    const e = {...formC, valor:parseFloat(formC.valor)||0};
    if (editCId!==null) { setConsultas(p=>p.map(c=>c.id===editCId?{...e,id:editCId}:c)); setEditCId(null); }
    else setConsultas(p=>[...p,{...e,id:Date.now()}]);
    setFormC(emptyC);
  }
  function editarC(c)  { setFormC({...c,valor:String(c.valor)}); setEditCId(c.id); }
  function cancelarC() { setFormC(emptyC); setEditCId(null); }
  function deletarC(id){ setConsultas(p=>p.filter(c=>c.id!==id)); setDelC(null); }

  const consultasFilt = consultas.filter(c =>
    (filtroConv==="TODOS"||c.conv===filtroConv) &&
    (filtroProf==="TODOS"||c.prof===filtroProf) &&
    (!buscaC||c.paciente.toLowerCase().includes(buscaC.toLowerCase()))
  );
  const totalCFilt = consultasFilt.reduce((a,c)=>a+c.valor,0);
  const totalCRepFilt = consultasFilt.reduce((a,c)=>{
    const p=PROFS.find(x=>x.nome===c.prof);
    return a+(p?c.valor*(pcts[p.nome]??p.pct):0);
  },0);
  const convTotals = CONVENIOS.map(cv=>({
    ...cv,
    total:consultas.filter(c=>c.conv===cv.id).reduce((a,c)=>a+c.valor,0),
    qtd:consultas.filter(c=>c.conv===cv.id).length,
  }));

  // Contas a pagar
  const emptyP = {desc:"",cat:"FIXO",valor:"",venc:"",status:"esperando",obs:""};
  const [contas,    setContas]    = useState([

    // ── Maio/2026 (dados reais da planilha) ─────────────────────────────
    {id:50, desc:"Aluguel",              cat:"FIXO",     valor:3421.68, venc:"2026-05-05", status:"pago",     obs:"SIM"},
    {id:51, desc:"Condomínio",           cat:"FIXO",     valor:1965.94, venc:"2026-05-05", status:"pago",     obs:"enviado reembolso"},
    {id:52, desc:"Luz",                  cat:"FIXO",     valor:510.32,  venc:"2026-05-20", status:"pago",     obs:"SIM"},
    {id:53, desc:"Internet",             cat:"FIXO",     valor:79.99,   venc:"2026-05-25", status:"pago",     obs:"SIM"},
    {id:54, desc:"Secretária",           cat:"PESSOAL",  valor:1247.49, venc:"2026-05-05", status:"pago",     obs:"SIM"},
    {id:55, desc:"Contador",             cat:"SERVIÇO",  valor:600.00,  venc:"2026-05-05", status:"pago",     obs:"SIM"},
    {id:56, desc:"Sistema",              cat:"FIXO",     valor:385.00,  venc:"2026-05-11", status:"pago",     obs:"SIM"},
    {id:57, desc:"Limpeza",              cat:"SERVIÇO",  valor:760.00,  venc:"2026-05-25", status:"pago",     obs:"SIM"},
    {id:58, desc:"Mídia",                cat:"MARKETING",valor:900.00,  venc:"2026-05-25", status:"pago",     obs:"SIM"},
    {id:59, desc:"Celular",              cat:"FIXO",     valor:39.99,   venc:"2026-05-20", status:"pago",     obs:"SIM"},
    {id:60, desc:"DAS",                  cat:"IMPOSTO",  valor:4476.46, venc:"2026-05-20", status:"pago",     obs:"SIM"},
    {id:61, desc:"ISS Unimed",           cat:"IMPOSTO",  valor:1593.62, venc:"2026-05-01", status:"pago",     obs:"descontado"},
    {id:62, desc:"DARF",                 cat:"IMPOSTO",  valor:595.52,  venc:"2026-05-20", status:"pago",     obs:"SIM"},
    {id:63, desc:"CEF Matriz",           cat:"IMPOSTO",  valor:107.89,  venc:"2026-05-20", status:"pago",     obs:"SIM"},
    {id:64, desc:"Simples Nacional (5/5)",cat:"IMPOSTO", valor:826.17,  venc:"2026-05-20", status:"pago",     obs:"SIM"},
    {id:65, desc:"Resp. Técnica",        cat:"SERVIÇO",  valor:1000.00, venc:"2026-05-26", status:"agendado", obs:"AGENDADO"},
    {id:66, desc:"Mídia extra",          cat:"MARKETING",valor:1200.00, venc:"2026-05-05", status:"pago",     obs:"SIM"},
    {id:67, desc:"Água",                 cat:"FIXO",     valor:51.00,   venc:"2026-05-05", status:"pago",     obs:"SIM"},
    {id:68, desc:"Empréstimo",           cat:"FINANC.",  valor:1388.89, venc:"2026-05-15", status:"pago",     obs:"SIM"},
    {id:69, desc:"Vale Transporte",      cat:"PESSOAL",  valor:211.64,  venc:"2026-05-07", status:"pago",     obs:"SIM"},
    {id:70, desc:"Vale Alimentação",     cat:"PESSOAL",  valor:500.00,  venc:"2026-04-29", status:"pago",     obs:"SIM"},
    {id:71, desc:"Limpeza ar cond.",     cat:"SERVIÇO",  valor:740.00,  venc:"2026-05-08", status:"pago",     obs:"SIM"},
    {id:72, desc:"Décimo/Férias",        cat:"PESSOAL",  valor:225.00,  venc:"2026-05-25", status:"pago",     obs:"SIM"},
    {id:73, desc:"Luciane",              cat:"OUTROS",   valor:1000.00, venc:"2026-05-28", status:"pago",     obs:"1ª parcela"},
    {id:74, desc:"Cartão PF",            cat:"OUTROS",   valor:365.13,  venc:"2026-05-25", status:"pago",     obs:"venc 26/04"},
    {id:75, desc:"Cartão inter empresarial",cat:"OUTROS",valor:2018.13, venc:"2026-05-10", status:"pago",     obs:"SIM"},
    {id:1,  desc:"Aluguel",          cat:"FIXO",     valor:3600.40, venc:"2026-06-05", status:"pago",     obs:""},
    {id:2,  desc:"Condomínio",       cat:"FIXO",     valor:1955.94, venc:"2026-06-05", status:"pago",     obs:""},
    {id:3,  desc:"Luz",              cat:"FIXO",     valor:346.22,  venc:"2026-06-22", status:"pago",     obs:""},
    {id:4,  desc:"Internet",         cat:"FIXO",     valor:79.99,   venc:"2026-06-15", status:"pago",     obs:""},
    {id:5,  desc:"Sistema",          cat:"FIXO",     valor:385.00,  venc:"2026-06-10", status:"pago",     obs:""},
    {id:6,  desc:"Secretária",       cat:"PESSOAL",  valor:1247.15, venc:"2026-06-03", status:"pago",     obs:""},
    {id:7,  desc:"Contabilidade",    cat:"SERVIÇO",  valor:600.00,  venc:"2026-06-05", status:"pago",     obs:""},
    {id:8,  desc:"Marketing",        cat:"MARKETING",valor:900.00,  venc:"2026-06-25", status:"pago",     obs:""},
    {id:9,  desc:"Limpeza",          cat:"SERVIÇO",  valor:760.00,  venc:"2026-06-25", status:"pago",     obs:""},
    {id:10, desc:"Celular",          cat:"FIXO",     valor:39.99,   venc:"2026-06-22", status:"pago",     obs:""},
    {id:11, desc:"DAS",              cat:"IMPOSTO",  valor:4491.02, venc:"2026-06-22", status:"pago",     obs:""},
    {id:12, desc:"ISS Unimed",       cat:"IMPOSTO",  valor:1321.97, venc:"2026-05-29", status:"pago",     obs:"descontado"},
    {id:13, desc:"DARF",             cat:"IMPOSTO",  valor:595.52,  venc:"2026-06-19", status:"pago",     obs:""},
    {id:14, desc:"CEF Matriz",       cat:"IMPOSTO",  valor:107.89,  venc:"2026-06-19", status:"pago",     obs:""},
    {id:15, desc:"Resp. Técnica",    cat:"SERVIÇO",  valor:1000.00, venc:"2026-07-01", status:"esperando",obs:""},
    {id:16, desc:"Empréstimo",       cat:"FINANC.",  valor:1388.89, venc:"2026-06-12", status:"pago",     obs:""},
    {id:17, desc:"Vale Transporte",  cat:"PESSOAL",  valor:308.38,  venc:"2026-06-02", status:"pago",     obs:""},
    {id:18, desc:"Vale Alimentação", cat:"PESSOAL",  valor:500.00,  venc:"2026-05-27", status:"pago",     obs:""},
    {id:19, desc:"Limpeza ar cond.", cat:"SERVIÇO",  valor:370.00,  venc:"2026-06-03", status:"pago",     obs:""},
    {id:20, desc:"Água",             cat:"FIXO",     valor:72.00,   venc:"2026-06-02", status:"pago",     obs:""},
    {id:21, desc:"Décimo/Férias",    cat:"PESSOAL",  valor:225.00,  venc:"2026-06-26", status:"pago",     obs:""},
    {id:22, desc:"Cartão crédito PF",cat:"OUTROS",   valor:372.00,  venc:"2026-06-26", status:"pago",     obs:""},
    {id:23, desc:"Cartão inter",     cat:"OUTROS",   valor:1413.33, venc:"2026-06-10", status:"pago",     obs:""},
    {id:24, desc:"Luciane",          cat:"OUTROS",   valor:1000.00, venc:"2026-06-25", status:"pago",     obs:""},
    {id:25, desc:"Aluguel",          cat:"FIXO",     valor:3600.40, venc:"2026-07-05", status:"agendado", obs:""},
    {id:26, desc:"Condomínio",       cat:"FIXO",     valor:1955.94, venc:"2026-07-05", status:"agendado", obs:""},
    {id:27, desc:"Secretária",       cat:"PESSOAL",  valor:1247.15, venc:"2026-07-03", status:"esperando",obs:""},
    {id:28, desc:"DAS Julho",        cat:"IMPOSTO",  valor:4500.00, venc:"2026-07-22", status:"esperando",obs:"estimado"},
    {id:100, desc:"Aluguel", cat:"FIXO", valor:3600.4, venc:"2026-07-05", status:"esperando", obs:"previsão"},
    {id:101, desc:"Condomínio", cat:"FIXO", valor:1955.94, venc:"2026-07-05", status:"esperando", obs:"previsão"},
    {id:102, desc:"Luz", cat:"FIXO", valor:380.0, venc:"2026-07-22", status:"esperando", obs:"previsão"},
    {id:103, desc:"Internet", cat:"FIXO", valor:79.99, venc:"2026-07-15", status:"esperando", obs:"previsão"},
    {id:104, desc:"Secretária", cat:"PESSOAL", valor:1247.15, venc:"2026-07-03", status:"esperando", obs:"previsão"},
    {id:105, desc:"Contabilidade", cat:"SERVIÇO", valor:600.0, venc:"2026-07-05", status:"esperando", obs:"previsão"},
    {id:106, desc:"Sistema", cat:"FIXO", valor:385.0, venc:"2026-07-10", status:"esperando", obs:"previsão"},
    {id:107, desc:"Limpeza", cat:"SERVIÇO", valor:800.0, venc:"2026-07-25", status:"esperando", obs:"previsão"},
    {id:108, desc:"Marketing", cat:"MARKETING", valor:900.0, venc:"2026-07-25", status:"esperando", obs:"previsão"},
    {id:109, desc:"Celular", cat:"FIXO", valor:39.99, venc:"2026-07-22", status:"esperando", obs:"previsão"},
    {id:120, desc:"Aluguel", cat:"FIXO", valor:3600.4, venc:"2026-08-05", status:"esperando", obs:"previsão"},
    {id:121, desc:"Condomínio", cat:"FIXO", valor:1955.94, venc:"2026-08-05", status:"esperando", obs:"previsão"},
    {id:122, desc:"Luz", cat:"FIXO", valor:380.0, venc:"2026-08-22", status:"esperando", obs:"previsão"},
    {id:123, desc:"Internet", cat:"FIXO", valor:79.99, venc:"2026-08-15", status:"esperando", obs:"previsão"},
    {id:124, desc:"Secretária", cat:"PESSOAL", valor:1247.15, venc:"2026-08-03", status:"esperando", obs:"previsão"},
    {id:125, desc:"Contabilidade", cat:"SERVIÇO", valor:600.0, venc:"2026-08-05", status:"esperando", obs:"previsão"},
    {id:126, desc:"Sistema", cat:"FIXO", valor:385.0, venc:"2026-08-10", status:"esperando", obs:"previsão"},
    {id:127, desc:"Limpeza", cat:"SERVIÇO", valor:800.0, venc:"2026-08-25", status:"esperando", obs:"previsão"},
    {id:128, desc:"Marketing", cat:"MARKETING", valor:900.0, venc:"2026-08-25", status:"esperando", obs:"previsão"},
    {id:129, desc:"Celular", cat:"FIXO", valor:39.99, venc:"2026-08-22", status:"esperando", obs:"previsão"},
    {id:140, desc:"Aluguel", cat:"FIXO", valor:3600.4, venc:"2026-09-05", status:"esperando", obs:"previsão"},
    {id:141, desc:"Condomínio", cat:"FIXO", valor:1955.94, venc:"2026-09-05", status:"esperando", obs:"previsão"},
    {id:142, desc:"Luz", cat:"FIXO", valor:380.0, venc:"2026-09-22", status:"esperando", obs:"previsão"},
    {id:143, desc:"Internet", cat:"FIXO", valor:79.99, venc:"2026-09-15", status:"esperando", obs:"previsão"},
    {id:144, desc:"Secretária", cat:"PESSOAL", valor:1247.15, venc:"2026-09-03", status:"esperando", obs:"previsão"},
    {id:145, desc:"Contabilidade", cat:"SERVIÇO", valor:600.0, venc:"2026-09-05", status:"esperando", obs:"previsão"},
    {id:146, desc:"Sistema", cat:"FIXO", valor:385.0, venc:"2026-09-10", status:"esperando", obs:"previsão"},
    {id:147, desc:"Limpeza", cat:"SERVIÇO", valor:800.0, venc:"2026-09-25", status:"esperando", obs:"previsão"},
    {id:148, desc:"Marketing", cat:"MARKETING", valor:900.0, venc:"2026-09-25", status:"esperando", obs:"previsão"},
    {id:149, desc:"Celular", cat:"FIXO", valor:39.99, venc:"2026-09-22", status:"esperando", obs:"previsão"},
    {id:160, desc:"Aluguel", cat:"FIXO", valor:3600.4, venc:"2026-10-05", status:"esperando", obs:"previsão"},
    {id:161, desc:"Condomínio", cat:"FIXO", valor:1955.94, venc:"2026-10-05", status:"esperando", obs:"previsão"},
    {id:162, desc:"Luz", cat:"FIXO", valor:380.0, venc:"2026-10-22", status:"esperando", obs:"previsão"},
    {id:163, desc:"Internet", cat:"FIXO", valor:79.99, venc:"2026-10-15", status:"esperando", obs:"previsão"},
    {id:164, desc:"Secretária", cat:"PESSOAL", valor:1247.15, venc:"2026-10-03", status:"esperando", obs:"previsão"},
    {id:165, desc:"Contabilidade", cat:"SERVIÇO", valor:600.0, venc:"2026-10-05", status:"esperando", obs:"previsão"},
    {id:166, desc:"Sistema", cat:"FIXO", valor:385.0, venc:"2026-10-10", status:"esperando", obs:"previsão"},
    {id:167, desc:"Limpeza", cat:"SERVIÇO", valor:800.0, venc:"2026-10-25", status:"esperando", obs:"previsão"},
    {id:168, desc:"Marketing", cat:"MARKETING", valor:900.0, venc:"2026-10-25", status:"esperando", obs:"previsão"},
    {id:169, desc:"Celular", cat:"FIXO", valor:39.99, venc:"2026-10-22", status:"esperando", obs:"previsão"},
    {id:180, desc:"Aluguel", cat:"FIXO", valor:3600.4, venc:"2026-11-05", status:"esperando", obs:"previsão"},
    {id:181, desc:"Condomínio", cat:"FIXO", valor:1955.94, venc:"2026-11-05", status:"esperando", obs:"previsão"},
    {id:182, desc:"Luz", cat:"FIXO", valor:380.0, venc:"2026-11-22", status:"esperando", obs:"previsão"},
    {id:183, desc:"Internet", cat:"FIXO", valor:79.99, venc:"2026-11-15", status:"esperando", obs:"previsão"},
    {id:184, desc:"Secretária", cat:"PESSOAL", valor:1247.15, venc:"2026-11-03", status:"esperando", obs:"previsão"},
    {id:185, desc:"Contabilidade", cat:"SERVIÇO", valor:600.0, venc:"2026-11-05", status:"esperando", obs:"previsão"},
    {id:186, desc:"Sistema", cat:"FIXO", valor:385.0, venc:"2026-11-10", status:"esperando", obs:"previsão"},
    {id:187, desc:"Limpeza", cat:"SERVIÇO", valor:800.0, venc:"2026-11-25", status:"esperando", obs:"previsão"},
    {id:188, desc:"Marketing", cat:"MARKETING", valor:900.0, venc:"2026-11-25", status:"esperando", obs:"previsão"},
    {id:189, desc:"Celular", cat:"FIXO", valor:39.99, venc:"2026-11-22", status:"esperando", obs:"previsão"},
    {id:200, desc:"Aluguel", cat:"FIXO", valor:3600.4, venc:"2026-12-05", status:"esperando", obs:"previsão"},
    {id:201, desc:"Condomínio", cat:"FIXO", valor:1955.94, venc:"2026-12-05", status:"esperando", obs:"previsão"},
    {id:202, desc:"Luz", cat:"FIXO", valor:380.0, venc:"2026-12-22", status:"esperando", obs:"previsão"},
    {id:203, desc:"Internet", cat:"FIXO", valor:79.99, venc:"2026-12-15", status:"esperando", obs:"previsão"},
    {id:204, desc:"Secretária", cat:"PESSOAL", valor:1247.15, venc:"2026-12-03", status:"esperando", obs:"previsão"},
    {id:205, desc:"Contabilidade", cat:"SERVIÇO", valor:600.0, venc:"2026-12-05", status:"esperando", obs:"previsão"},
    {id:206, desc:"Sistema", cat:"FIXO", valor:385.0, venc:"2026-12-10", status:"esperando", obs:"previsão"},
    {id:207, desc:"Limpeza", cat:"SERVIÇO", valor:800.0, venc:"2026-12-25", status:"esperando", obs:"previsão"},
    {id:208, desc:"Marketing", cat:"MARKETING", valor:900.0, venc:"2026-12-25", status:"esperando", obs:"previsão"},
    {id:209, desc:"Celular", cat:"FIXO", valor:39.99, venc:"2026-12-22", status:"esperando", obs:"previsão"},
  ]);
  const [formP,       setFormP]      = useState(emptyP);
  const [editPId,     setEditPId]    = useState(null);
  const [delP,        setDelP]       = useState(null);
  const [filtroSt,    setFiltroSt]   = useState("TODOS");
  const [filtroCat,   setFiltroCat]  = useState("TODAS");
  const [buscaP,      setBuscaP]     = useState("");
  const [mesContasSel,setMesContasSel] = useState("todos");

  function salvarP() {
    if (!formP.desc.trim()||!formP.valor||!formP.venc) return;
    const e = {...formP, valor:parseFloat(formP.valor)||0};
    if (editPId!==null) { setContas(p=>p.map(c=>c.id===editPId?{...e,id:editPId}:c)); setEditPId(null); }
    else setContas(p=>[...p,{...e,id:Date.now()}]);
    setFormP(emptyP);
  }
  function editarP(c)   { setFormP({...c,valor:String(c.valor)}); setEditPId(c.id); }
  function cancelarP()  { setFormP(emptyP); setEditPId(null); }
  function deletarP(id) { setContas(p=>p.filter(c=>c.id!==id)); setDelP(null); }
  function toggleSt(id, st) { setContas(p=>p.map(c=>c.id===id?{...c,status:st}:c)); }

  const hoje = new Date().toISOString().split("T")[0];
  const contasFilt = contas.filter(c =>
    (filtroSt==="TODOS"||c.status===filtroSt) &&
    (filtroCat==="TODAS"||c.cat===filtroCat) &&
    (!buscaP||c.desc.toLowerCase().includes(buscaP.toLowerCase()))
  );

  // Agrupamento de contas por mês/ano
  const getMesKey = venc => { if(!venc) return "sem-data"; const p=venc.split("-"); return p[0]+"-"+p[1]; };
  const getMesLabel = key => {
    if(key==="sem-data") return "Sem data";
    const [y,m] = key.split("-");
    const d = new Date(Number(y),Number(m)-1,1);
    return d.toLocaleString("pt-BR",{month:"long",year:"numeric"});
  };
  const mesesContas = ["todos", ...Array.from(new Set(contas.map(c=>getMesKey(c.venc)))).sort()];
  const contasFiltMes = contasFilt.filter(c =>
    mesContasSel==="todos" || getMesKey(c.venc)===mesContasSel
  );
  // Agrupar por mês para exibição
  const contasPorMesGrupo = {};
  contasFiltMes.forEach(c => {
    const k = getMesKey(c.venc);
    if(!contasPorMesGrupo[k]) contasPorMesGrupo[k]=[];
    contasPorMesGrupo[k].push(c);
  });
  const gruposSorted = Object.keys(contasPorMesGrupo).sort();

  // DRE
  const mes        = MESES.find(m=>m.id===mesSel)||MESES[MESES.length-1];
  const totalFixos = mes.fixos.reduce((a,x)=>a+x.v,0);
  const totalVars  = mes.vars.reduce((a,x)=>a+x.v,0);
  const repassesMes= PROFS.map(p=>{
    const fat=mes.fat[p.nome]||0;
    const pct=pcts[p.nome]??p.pct;
    return {...p,fat,pct,rep:fat*pct,cli:fat*(1-pct)};
  }).filter(p=>p.fat>0);
  const totalRep   = repassesMes.reduce((a,p)=>a+p.rep,0);
  const totalCli   = repassesMes.reduce((a,p)=>a+p.cli,0);
  const lucroLiq   = mes.lucro - totalFixos - totalVars;
  const margem     = mes.bruto>0?(lucroLiq/mes.bruto)*100:0;
  const totalGeralBruto = MESES.reduce((a,m)=>a+m.bruto,0);
  const totalGeralLucro = MESES.reduce((a,m)=>a+m.lucro,0);

  const convCor   = id => CONVENIOS.find(c=>c.id===id)?.cor||C.muted;
  const convLabel = id => CONVENIOS.find(c=>c.id===id)?.label||id;

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:C.bg,minHeight:"100vh",color:C.text}}>

      {/* Header */}
      <div style={{background:C.primary,padding:"0 22px",display:"flex",alignItems:"center",gap:12,height:54,boxShadow:"0 2px 8px rgba(0,0,0,.18)"}}>
        <div style={{background:C.accent,borderRadius:9,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#fff",fontSize:16}}>U</div>
        <div>
          <div style={{color:"#fff",fontWeight:800,fontSize:15,lineHeight:1}}>Instituto Up</div>
          <div style={{color:"#a8c5da",fontSize:11}}>Clínica Multidisciplinar</div>
        </div>
        <div style={{flex:1}}/>
        <div style={{color:"#a8c5da",fontSize:12}}>💼 Sistema Financeiro</div>
      </div>

      {/* Tabs */}
      <div style={{background:C.white,borderBottom:"1px solid "+C.border,padding:"0 22px",display:"flex",gap:2,overflowX:"auto"}}>
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            border:"none",background:"none",padding:"11px 13px",cursor:"pointer",whiteSpace:"nowrap",
            fontWeight:tab===t.id?700:500,
            color:tab===t.id?C.primary:C.muted,
            borderBottom:tab===t.id?"3px solid "+C.primary:"3px solid transparent",
            fontSize:13,
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      <div style={{padding:"20px 22px",maxWidth:1200,margin:"0 auto"}}>

        {/* ══ DASHBOARD ══════════════════════════════════════════ */}
        {tab==="dashboard" && (
          <div>
            <h2 style={{fontWeight:800,fontSize:19,marginBottom:16}}>Visão Geral · Dez/2025 – Jun/2026</h2>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:18}}>
              <SCard label="Faturamento Total"   value={fmt(totalGeralBruto)} icon="💰" color={C.accent}  sub="Todos os meses"/>
              <SCard label="Lucro Clínica Total" value={fmt(totalGeralLucro)} icon="📈" color={C.primary} sub="Após repasses"/>
              <SCard label="Consultas Lançadas"  value={consultas.length}     icon="🩺" color={C.teal}    sub={fmt(consultas.reduce((a,c)=>a+c.valor,0))}/>
              <SCard label="Profissionais"        value={PROFS.length}         icon="👩‍⚕️" color={C.purple} sub="No sistema"/>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:18}}>
              {convTotals.map(cv => (
                <div key={cv.id} style={{background:C.white,borderRadius:12,boxShadow:"0 1px 5px rgba(0,0,0,.07)",padding:"12px 16px",flex:1,minWidth:120,borderTop:"3px solid "+cv.cor}}>
                  <div style={{fontSize:11,color:C.muted,fontWeight:600}}>{cv.label}</div>
                  <div style={{fontWeight:800,fontSize:17,color:cv.cor,margin:"4px 0 2px"}}>{fmt(cv.total)}</div>
                  <div style={{fontSize:11,color:C.muted}}>{cv.qtd} consulta{cv.qtd!==1?"s":""}</div>
                </div>
              ))}
            </div>
            <div style={CARD}>
              <div style={{fontWeight:700,marginBottom:14,fontSize:14}}>📅 Faturamento × Lucro Mensal</div>
              <div style={{display:"flex",gap:8,alignItems:"flex-end",height:100}}>
                {MESES.map(m => {
                  const mx=Math.max(...MESES.map(x=>x.bruto));
                  const hb=(m.bruto/mx)*100;
                  const hl=(m.lucro/mx)*100;
                  return (
                    <div key={m.id} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                      <div style={{fontSize:9,color:C.muted,fontWeight:600,textAlign:"center"}}>{fmt(m.bruto).replace("R$","").trim()}</div>
                      <div style={{width:"100%",position:"relative"}}>
                        <div style={{height:hb+"px",background:C.primary+"30",borderRadius:"4px 4px 0 0"}}/>
                        <div style={{position:"absolute",bottom:0,left:0,right:0,height:hl+"px",background:C.accent,borderRadius:"3px 3px 0 0",opacity:.85}}/>
                      </div>
                      <div style={{fontSize:9,color:C.muted,textAlign:"center"}}>{m.label}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{display:"flex",gap:14,marginTop:8,fontSize:11,color:C.muted}}>
                <span><span style={{display:"inline-block",width:10,height:10,background:C.primary+"30",borderRadius:2,marginRight:4}}/>Faturamento</span>
                <span><span style={{display:"inline-block",width:10,height:10,background:C.accent,borderRadius:2,marginRight:4}}/>Lucro</span>
              </div>
            </div>
          </div>
        )}

        {/* ══ CONSULTAS ══════════════════════════════════════════ */}
        {tab==="consultas" && (
          <div>
            <h2 style={{fontWeight:800,fontSize:19,marginBottom:16}}>🩺 Lançamento de Consultas</h2>
            <div style={{...CARD,marginBottom:18,border:editCId?"2px solid "+C.warning:"1px solid "+C.border}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:14,color:editCId?C.warning:C.primary}}>
                {editCId?"✏️ Editando":"➕ Novo Lançamento"}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:12}}>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  Paciente *
                  <input style={INP} value={formC.paciente} onChange={e=>setFormC({...formC,paciente:e.target.value})} placeholder="Nome do paciente"/>
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  Profissional
                  <select style={SEL} value={formC.prof} onChange={e=>setFormC({...formC,prof:e.target.value})}>
                    <option value="">— Selecione —</option>
                    {PROFS.map(p=><option key={p.nome} value={p.nome}>{p.nome} · {p.esp}</option>)}
                  </select>
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  Convênio *
                  <select style={SEL} value={formC.conv} onChange={e=>setFormC({...formC,conv:e.target.value})}>
                    {CONVENIOS.map(cv=><option key={cv.id} value={cv.id}>{cv.label}</option>)}
                  </select>
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  Valor (R$) *
                  <input style={INP} type="number" min="0" step="0.01" value={formC.valor} onChange={e=>setFormC({...formC,valor:e.target.value})} placeholder="0,00"/>
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  Data Pagamento *
                  <input style={INP} type="date" value={formC.dataPag} onChange={e=>setFormC({...formC,dataPag:e.target.value})}/>
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  Tipo de cobrança
                  <select style={SEL} value={formC.tipo||"sessao"} onChange={e=>setFormC({...formC,tipo:e.target.value})}>
                    <option value="sessao">Por sessão</option>
                    <option value="pacote">Pacote mensal</option>
                  </select>
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  Observação
                  <input style={INP} value={formC.obs} onChange={e=>setFormC({...formC,obs:e.target.value})} placeholder="Opcional"/>
                </label>
              </div>
              <div style={{display:"flex",gap:10,marginTop:14}}>
                <button onClick={salvarC} disabled={!formC.paciente.trim()||!formC.valor||!formC.dataPag}
                  style={{...BP,opacity:(!formC.paciente.trim()||!formC.valor||!formC.dataPag)?0.5:1}}>
                  {editCId?"💾 Salvar":"✅ Lançar"}
                </button>
                {editCId && <button onClick={cancelarC} style={BS}>Cancelar</button>}
              </div>
            </div>

            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
              {convTotals.map(cv=>(
                <div key={cv.id} style={{background:C.white,borderRadius:10,boxShadow:"0 1px 4px rgba(0,0,0,.07)",padding:"10px 15px",borderLeft:"3px solid "+cv.cor,minWidth:115}}>
                  <div style={{fontSize:11,color:C.muted}}>{cv.label}</div>
                  <div style={{fontWeight:800,fontSize:16,color:cv.cor}}>{fmt(cv.total)}</div>
                  <div style={{fontSize:11,color:C.muted}}>{cv.qtd} consulta{cv.qtd!==1?"s":""}</div>
                </div>
              ))}
              <div style={{background:C.primary,borderRadius:10,padding:"10px 15px",minWidth:115}}>
                <div style={{fontSize:11,color:"#a8c5da"}}>Total Geral</div>
                <div style={{fontWeight:800,fontSize:16,color:"#fff"}}>{fmt(consultas.reduce((a,c)=>a+c.valor,0))}</div>
                <div style={{fontSize:11,color:"#a8c5da"}}>{consultas.length} lançamentos</div>
              </div>
            </div>

            <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
              <input style={{...INP,maxWidth:210}} placeholder="🔍 Buscar paciente…" value={buscaC} onChange={e=>setBuscaC(e.target.value)}/>
              <select style={{...SEL,maxWidth:155}} value={filtroConv} onChange={e=>setFiltroConv(e.target.value)}>
                <option value="TODOS">Todos convênios</option>
                {CONVENIOS.map(cv=><option key={cv.id} value={cv.id}>{cv.label}</option>)}
              </select>
              <select style={{...SEL,maxWidth:155}} value={filtroProf} onChange={e=>setFiltroProf(e.target.value)}>
                <option value="TODOS">Todos profissionais</option>
                {PROFS.map(p=><option key={p.nome} value={p.nome}>{p.nome}</option>)}
              </select>
              {(filtroConv!=="TODOS"||filtroProf!=="TODOS"||buscaC) && (
                <button onClick={()=>{setFiltroConv("TODOS");setFiltroProf("TODOS");setBuscaC("");}} style={{...BS,padding:"8px 13px",fontSize:12}}>✕ Limpar</button>
              )}
              <div style={{marginLeft:"auto",fontWeight:700,color:C.primary,fontSize:13}}>
                {consultasFilt.length} registros · {fmt(totalCFilt)}
              </div>
            </div>

            <div style={{...CARD,padding:0,overflow:"hidden"}}>
              {consultasFilt.length===0?(
                <div style={{textAlign:"center",padding:48,color:C.muted}}>
                  <div style={{fontSize:36,marginBottom:10}}>🩺</div>
                  <div style={{fontWeight:600}}>{consultas.length>0?"Nenhum resultado para o filtro":"Nenhum lançamento ainda"}</div>
                </div>
              ):(
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                    <thead>
                      <tr style={{background:C.light}}>
                        <th style={TH}>Paciente</th><th style={TH}>Profissional</th><th style={TH}>Convênio</th>
                        <th style={TH}>Valor</th><th style={TH}>Repasse</th><th style={TH}>Data</th>
                        <th style={TH}>Obs.</th><th style={TH}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consultasFilt.map(c=>{
                        const pr=PROFS.find(p=>p.nome===c.prof);
                        const rep=pr?c.valor*(pcts[pr.nome]??pr.pct):0;
                        return (
                          <tr key={c.id} style={{borderBottom:"1px solid "+C.border,background:editCId===c.id?"#fffbeb":"#fff"}}>
                            <td style={{...TD,fontWeight:700}}>{c.paciente}</td>
                            <td style={TD}>{pr?<Badge color={pr.cor}>{pr.nome}</Badge>:<span style={{color:C.muted}}>—</span>}</td>
                            <td style={TD}><Badge color={convCor(c.conv)}>{convLabel(c.conv)}</Badge></td>
                            <td style={{...TD,fontWeight:700,color:C.accent}}>{fmt(c.valor)}</td>
                            <td style={{...TD,color:C.danger}}>{pr?fmt(rep):<span style={{color:C.muted}}>—</span>}</td>
                            <td style={TD}>{fmtDate(c.dataPag)}</td>
                            <td style={{...TD,color:C.muted,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.obs||"—"}</td>
                            <td style={TD}>
                              <div style={{display:"flex",gap:5}}>
                                <button onClick={()=>editarC(c)} style={{padding:"4px 9px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,background:"#EBF8FF",color:"#2B6CB0",border:"1px solid #90CDF4"}}>✏️</button>
                                <button onClick={()=>setDelC(c)} style={{padding:"4px 9px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,background:C.danger+"15",color:C.danger,border:"1px solid "+C.danger}}>🗑</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{background:C.light,fontWeight:800}}>
                        <td style={TD} colSpan={3}>Total</td>
                        <td style={{...TD,color:C.accent}}>{fmt(totalCFilt)}</td>
                        <td style={{...TD,color:C.danger}}>{fmt(totalCRepFilt)}</td>
                        <td style={TD} colSpan={3}/>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ CONTAS A PAGAR ═════════════════════════════════════ */}
        {tab==="contas" && (
          <div>
            <h2 style={{fontWeight:800,fontSize:19,marginBottom:16}}>💳 Contas a Pagar</h2>

            {/* Formulário */}
            <div style={{...CARD,marginBottom:18,border:editPId?"2px solid "+C.warning:"1px solid "+C.border}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:14,color:editPId?C.warning:C.primary}}>
                {editPId?"✏️ Editando Conta":"➕ Nova Conta"}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:12}}>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  Descrição *
                  <input style={INP} value={formP.desc} onChange={e=>setFormP({...formP,desc:e.target.value})} placeholder="Ex: Aluguel, DAS..."/>
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  Categoria
                  <select style={SEL} value={formP.cat} onChange={e=>setFormP({...formP,cat:e.target.value})}>
                    {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  Valor (R$) *
                  <input style={INP} type="number" min="0" step="0.01" value={formP.valor} onChange={e=>setFormP({...formP,valor:e.target.value})} placeholder="0,00"/>
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  Vencimento *
                  <input style={INP} type="date" value={formP.venc} onChange={e=>setFormP({...formP,venc:e.target.value})}/>
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  Status
                  <select style={SEL} value={formP.status} onChange={e=>setFormP({...formP,status:e.target.value})}>
                    {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
                  </select>
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  Observação
                  <input style={INP} value={formP.obs} onChange={e=>setFormP({...formP,obs:e.target.value})} placeholder="Opcional"/>
                </label>
              </div>
              <div style={{display:"flex",gap:10,marginTop:14}}>
                <button onClick={salvarP} disabled={!formP.desc.trim()||!formP.valor||!formP.venc}
                  style={{...BP,opacity:(!formP.desc.trim()||!formP.valor||!formP.venc)?0.5:1}}>
                  {editPId?"💾 Salvar":"➕ Adicionar"}
                </button>
                {editPId && <button onClick={cancelarP} style={BS}>Cancelar</button>}
              </div>
            </div>

            {/* Resumo por status */}
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
              {Object.entries(STATUS).map(([k,v])=>{
                const tot=contas.filter(c=>c.status===k).reduce((a,c)=>a+c.valor,0);
                const qtd=contas.filter(c=>c.status===k).length;
                return (
                  <div key={k} onClick={()=>setFiltroSt(filtroSt===k?"TODOS":k)}
                    style={{background:v.bg,border:"1px solid "+v.cor+"44",borderLeft:"3px solid "+v.cor,
                      borderRadius:10,padding:"10px 15px",minWidth:120,cursor:"pointer",
                      boxShadow:filtroSt===k?"0 0 0 2px "+v.cor:"none",transition:"box-shadow .15s"}}>
                    <div style={{fontSize:11,color:v.cor,fontWeight:700}}>{v.icon} {v.label}</div>
                    <div style={{fontWeight:800,fontSize:16,color:C.text,margin:"3px 0 1px"}}>{fmt(tot)}</div>
                    <div style={{fontSize:11,color:C.muted}}>{qtd} conta{qtd!==1?"s":""}</div>
                  </div>
                );
              })}
              <div style={{background:C.primary,borderRadius:10,padding:"10px 15px",minWidth:120}}>
                <div style={{fontSize:11,color:"#a8c5da",fontWeight:700}}>💰 Total Geral</div>
                <div style={{fontWeight:800,fontSize:16,color:"#fff",margin:"3px 0 1px"}}>{fmt(contas.reduce((a,c)=>a+c.valor,0))}</div>
                <div style={{fontSize:11,color:"#a8c5da"}}>{contas.length} contas</div>
              </div>
            </div>

            {/* Banner de previsão dos próximos meses */}
            {(() => {
              const agora = new Date();
              const mesesFuturos = ["2026-07","2026-08","2026-09","2026-10","2026-11","2026-12"]
                .filter(k => {
                  const [y,m] = k.split("-").map(Number);
                  return y > agora.getFullYear() || (y === agora.getFullYear() && m > agora.getMonth()+1);
                });
              if(mesesFuturos.length===0) return null;
              const totalPrev = contas
                .filter(c => mesesFuturos.includes(getMesKey(c.venc)))
                .reduce((a,c)=>a+c.valor,0);
              const totalProx = contas
                .filter(c => getMesKey(c.venc)===mesesFuturos[0])
                .reduce((a,c)=>a+c.valor,0);
              return (
                <div style={{background:"linear-gradient(135deg,#6C3483,#8E44AD)",borderRadius:14,
                  padding:"16px 20px",marginBottom:16,color:"#fff",
                  boxShadow:"0 4px 14px rgba(108,52,131,.35)"}}>
                  <div style={{fontWeight:800,fontSize:14,marginBottom:10}}>
                    🔮 Previsão de Despesas — Próximos {mesesFuturos.length} meses
                  </div>
                  <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
                    <div>
                      <div style={{fontSize:11,opacity:.75}}>Total previsto (todos os meses)</div>
                      <div style={{fontWeight:900,fontSize:22}}>{fmt(totalPrev)}</div>
                    </div>
                    <div>
                      <div style={{fontSize:11,opacity:.75}}>Próximo mês</div>
                      <div style={{fontWeight:800,fontSize:18}}>{fmt(totalProx)}</div>
                    </div>
                    <div style={{fontSize:12,opacity:.8,marginLeft:"auto",alignSelf:"center",lineHeight:1.6}}>
                      Valores baseados na média de junho/2026.<br/>
                      Altere o status de cada conta conforme o pagamento.
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Seletor de mês */}
            <div style={{...CARD,marginBottom:14,padding:"14px 18px"}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:10,color:C.primary}}>📅 Filtrar por mês</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {mesesContas.map(k => {
                  const label = k==="todos" ? "Todos os meses" : getMesLabel(k);
                  const totalK = k==="todos"
                    ? contasFilt.reduce((a,c)=>a+c.valor,0)
                    : contasFilt.filter(c=>getMesKey(c.venc)===k).reduce((a,c)=>a+c.valor,0);
                  const isActive = mesContasSel===k;
                  return (
                    <button key={k} onClick={()=>setMesContasSel(k)} style={{
                      padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",
                      background:isActive?C.primary:C.light,
                      color:isActive?"#fff":C.muted,
                      fontWeight:isActive?700:500,fontSize:12,
                      boxShadow:isActive?"0 2px 6px rgba(27,79,114,.3)":"none",
                      transition:"all .15s",
                    }}>
                      <span style={{textTransform:"capitalize"}}>{label}</span>
                      {k!=="todos" && <span style={{marginLeft:6,opacity:.75,fontSize:11}}>{fmt(totalK)}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtros adicionais */}
            <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
              <input style={{...INP,maxWidth:200}} placeholder="🔍 Buscar..." value={buscaP} onChange={e=>setBuscaP(e.target.value)}/>
              <select style={{...SEL,maxWidth:155}} value={filtroSt} onChange={e=>setFiltroSt(e.target.value)}>
                <option value="TODOS">Todos os status</option>
                {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
              <select style={{...SEL,maxWidth:145}} value={filtroCat} onChange={e=>setFiltroCat(e.target.value)}>
                <option value="TODAS">Todas categorias</option>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              {(filtroSt!=="TODOS"||filtroCat!=="TODAS"||buscaP)&&(
                <button onClick={()=>{setFiltroSt("TODOS");setFiltroCat("TODAS");setBuscaP("");}} style={{...BS,padding:"8px 13px",fontSize:12}}>✕ Limpar</button>
              )}
              <div style={{marginLeft:"auto",fontWeight:700,color:C.primary,fontSize:13}}>
                {contasFiltMes.length} conta{contasFiltMes.length!==1?"s":""} · {fmt(contasFiltMes.reduce((a,c)=>a+c.valor,0))}
              </div>
            </div>

            {/* Tabelas agrupadas por mês */}
            {gruposSorted.length===0 ? (
              <div style={{...CARD,textAlign:"center",padding:40,color:C.muted}}>
                <div style={{fontSize:36,marginBottom:10}}>💳</div>
                <div style={{fontWeight:600}}>Nenhuma conta encontrada para os filtros selecionados.</div>
              </div>
            ) : gruposSorted.map(mesKey => {
              const lista = contasPorMesGrupo[mesKey];
              const totalMesGrupo = lista.reduce((a,c)=>a+c.valor,0);
              const pagoMes  = lista.filter(c=>c.status==="pago").reduce((a,c)=>a+c.valor,0);
              const pendMes  = totalMesGrupo - pagoMes;
              return (
                <div key={mesKey} style={{marginBottom:20}}>
                  {/* Cabeçalho do mês */}
                  {(() => {
                    const [my, mm] = mesKey.split("-").map(Number);
                    const agora = new Date();
                    const isFuturo = my > agora.getFullYear() || (my === agora.getFullYear() && mm > agora.getMonth() + 1);
                    const isAtual  = my === agora.getFullYear() && mm === agora.getMonth() + 1;
                    const bgColor  = isFuturo ? "#6C3483" : isAtual ? C.primary : "#2C3E50";
                    return (
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                        background:bgColor,borderRadius:"12px 12px 0 0",padding:"12px 18px",color:"#fff"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{fontWeight:800,fontSize:15,textTransform:"capitalize"}}>
                            {isFuturo?"🔮":isAtual?"📌":"📅"} {getMesLabel(mesKey)}
                          </div>
                          {isFuturo && (
                            <span style={{background:"rgba(255,255,255,.2)",borderRadius:20,
                              padding:"2px 10px",fontSize:11,fontWeight:700}}>
                              PREVISÃO
                            </span>
                          )}
                          {isAtual && (
                            <span style={{background:"rgba(255,255,255,.2)",borderRadius:20,
                              padding:"2px 10px",fontSize:11,fontWeight:700}}>
                              MÊS ATUAL
                            </span>
                          )}
                        </div>
                        <div style={{display:"flex",gap:20,fontSize:12}}>
                          <div style={{textAlign:"right"}}>
                            <div style={{opacity:.7}}>Total previsto</div>
                            <div style={{fontWeight:800,fontSize:14}}>{fmt(totalMesGrupo)}</div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{opacity:.7}}>✅ Pago</div>
                            <div style={{fontWeight:800,fontSize:14,color:"#7dffb0"}}>{fmt(pagoMes)}</div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{opacity:.7}}>⏳ Pendente</div>
                            <div style={{fontWeight:800,fontSize:14,color:pendMes>0?"#ffcc66":"#7dffb0"}}>{fmt(pendMes)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  {/* Tabela do mês */}
                  <div style={{background:C.white,borderRadius:"0 0 12px 12px",boxShadow:"0 2px 8px rgba(0,0,0,.08)",overflow:"hidden"}}>
                    <div style={{overflowX:"auto"}}>
                      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                        <thead>
                          <tr style={{background:C.light}}>
                            <th style={TH}>Descrição</th>
                            <th style={TH}>Categoria</th>
                            <th style={TH}>Valor</th>
                            <th style={TH}>Vencimento</th>
                            <th style={TH}>Status</th>
                            <th style={TH}>Alterar</th>
                            <th style={TH}>Obs.</th>
                            <th style={TH}>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lista.sort((a,b)=>a.venc>b.venc?1:-1).map(c => {
                            const st = STATUS[c.status]||STATUS.esperando;
                            const atrasada = c.status!=="pago" && c.venc && c.venc<hoje;
                            return (
                              <tr key={c.id} style={{borderBottom:"1px solid "+C.border,background:atrasada?"#FFF5F5":"#fff"}}>
                                <td style={{...TD,fontWeight:700}}>{c.desc}</td>
                                <td style={TD}>
                                  <span style={{background:C.light,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:600}}>{c.cat}</span>
                                </td>
                                <td style={{...TD,fontWeight:700}}>{fmt(c.valor)}</td>
                                <td style={{...TD,color:atrasada?C.danger:C.text,fontWeight:atrasada?700:400}}>
                                  {fmtDate(c.venc)}{atrasada&&<span style={{marginLeft:4,fontSize:10}}>⚠️</span>}
                                </td>
                                <td style={TD}>
                                  <span style={{background:st.bg,color:st.cor,border:"1px solid "+st.cor+"44",
                                    borderRadius:20,padding:"3px 9px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>
                                    {st.icon} {st.label}
                                  </span>
                                </td>
                                <td style={TD}>
                                  <StatusBtns itemId={c.id} currentStatus={c.status} onToggle={toggleSt}/>
                                </td>
                                <td style={{...TD,color:C.muted,maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.obs||"—"}</td>
                                <td style={TD}>
                                  <div style={{display:"flex",gap:5}}>
                                    <button onClick={()=>editarP(c)} style={{padding:"4px 9px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,background:"#EBF8FF",color:"#2B6CB0",border:"1px solid #90CDF4"}}>✏️</button>
                                    <button onClick={()=>setDelP(c)} style={{padding:"4px 9px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,background:C.danger+"15",color:C.danger,border:"1px solid "+C.danger}}>🗑</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr style={{background:C.light,fontWeight:800}}>
                            <td style={TD} colSpan={2}>Subtotal</td>
                            <td style={{...TD,color:C.primary}}>{fmt(totalMesGrupo)}</td>
                            <td style={TD} colSpan={5}/>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ REPASSE A TERAPEUTAS ════════════════════════════ */}
        {tab==="repTerapeutas" && (
          <div>
            <h2 style={{fontWeight:800,fontSize:19,marginBottom:16}}>💸 Repasse às Terapeutas</h2>

            {/* Configurações de data e filtros */}
            <div style={{...CARD,marginBottom:16,padding:"16px 20px"}}>
              <div style={{fontWeight:700,fontSize:13,color:C.primary,marginBottom:14}}>⚙️ Configurar Pagamentos</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  📅 Mês de referência (atendimento)
                  <select style={SEL} value={repMesSel} onChange={e=>setRepMesSel(e.target.value)}>
                    <option value="">— Selecione o mês —</option>
                    {Array.from(new Set(consultas.map(c=>c.dataPag?c.dataPag.substring(0,7):""))).filter(Boolean).sort().map(m=>{
                      const [y,mo]=m.split("-");
                      const label=new Date(Number(y),Number(mo)-1,1).toLocaleString("pt-BR",{month:"long",year:"numeric"});
                      return <option key={m} value={m} style={{textTransform:"capitalize"}}>{label}</option>;
                    })}
                  </select>
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  👩‍⚕️ Profissional
                  <select style={SEL} value={repProfSel} onChange={e=>setRepProfSel(e.target.value)}>
                    <option value="TODOS">Todas</option>
                    {PROFS.map(p=><option key={p.nome} value={p.nome}>{p.nome}</option>)}
                  </select>
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  🟢 Dia pagto Particular
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <input style={{...INP,maxWidth:70}} type="number" min="1" max="31"
                      value={diaParticular} onChange={e=>setDiaParticular(e.target.value)}/>
                    <span style={{fontSize:12,color:C.muted}}>do mês</span>
                  </div>
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:5,fontSize:12,fontWeight:600}}>
                  🔵 Dia pagto Unimed
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <input style={{...INP,maxWidth:70}} type="number" min="1" max="31"
                      value={diaUnimed} onChange={e=>setDiaUnimed(e.target.value)}/>
                    <span style={{fontSize:12,color:C.muted}}>do mês</span>
                  </div>
                </label>
              </div>
            </div>

            {repMesSel === "" ? (
              <div style={{...CARD,textAlign:"center",padding:48,color:C.muted}}>
                <div style={{fontSize:40,marginBottom:12}}>💸</div>
                <div style={{fontWeight:700,fontSize:15}}>Selecione o mês de referência acima</div>
                <div style={{fontSize:13,marginTop:6}}>Os repasses serão calculados com base nas consultas daquele mês</div>
              </div>
            ) : (
              <div>
                {(() => {
                  const consultasMes = consultas.filter(c => c.dataPag && c.dataPag.startsWith(repMesSel));
                  const [ano, mesN] = repMesSel.split("-");
                  const anoN = Number(ano), mesNn = Number(mesN);

                  const dataPart = `${ano}-${mesN}-${String(diaParticular).padStart(2,"0")}`;
                  const dataUni  = `${ano}-${mesN}-${String(diaUnimed).padStart(2,"0")}`;

                  const profsFiltrados = PROFS.filter(p =>
                    repProfSel==="TODOS" || p.nome===repProfSel
                  );

                  const mesLabel = new Date(anoN, mesNn-1, 1)
                    .toLocaleString("pt-BR",{month:"long",year:"numeric"});

                  // Calcular totais globais
                  const totalPart = consultasMes.filter(c=>c.conv==="PARTICULAR").reduce((a,c)=>{
                    const p=PROFS.find(x=>x.nome===c.prof);
                    return a+(p?c.valor*(pcts[p.nome]??p.pct):0);
                  },0);
                  const totalUni = consultasMes.filter(c=>c.conv==="UNIMED").reduce((a,c)=>{
                    const p=PROFS.find(x=>x.nome===c.prof);
                    return a+(p?c.valor*(pcts[p.nome]??p.pct):0);
                  },0);

                  return (
                    <div>
                      {/* Botão gerar todos os PDFs */}
                      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
                        <button
                          onClick={()=>{
                            profsFiltrados.forEach(p=>{
                              const fat=consultasMes.filter(c=>c.prof===p.nome);
                              const tot=fat.reduce((a,c)=>a+c.valor*(pcts[p.nome]??p.pct),0);
                              if(tot>0) setTimeout(()=>gerarPdfRepasse(p.nome,repMesSel,consultasMes,pcts,diaParticular,diaUnimed),300);
                            });
                          }}
                          style={{
                            background:C.primary,color:"#fff",border:"none",
                            borderRadius:8,padding:"9px 18px",fontWeight:700,
                            cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:6,
                          }}>
                          📄 Gerar PDF de Todas as Terapeutas
                        </button>
                      </div>

                      {/* Resumo geral */}
                      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:18}}>
                        <div style={{background:C.white,borderRadius:12,boxShadow:"0 1px 6px rgba(0,0,0,.08)",
                          padding:"14px 18px",flex:1,minWidth:150,borderLeft:"4px solid #27AE60"}}>
                          <div style={{fontSize:11,color:C.muted,fontWeight:600}}>🟢 Total Particular</div>
                          <div style={{fontWeight:900,fontSize:20,color:"#27AE60",marginTop:4}}>{fmt(totalPart)}</div>
                          <div style={{fontSize:11,color:C.muted,marginTop:2}}>Pagto: dia {diaParticular}/{mesN}</div>
                        </div>
                        <div style={{background:C.white,borderRadius:12,boxShadow:"0 1px 6px rgba(0,0,0,.08)",
                          padding:"14px 18px",flex:1,minWidth:150,borderLeft:"4px solid "+C.primary}}>
                          <div style={{fontSize:11,color:C.muted,fontWeight:600}}>🔵 Total Unimed</div>
                          <div style={{fontWeight:900,fontSize:20,color:C.primary,marginTop:4}}>{fmt(totalUni)}</div>
                          <div style={{fontSize:11,color:C.muted,marginTop:2}}>Pagto: dia {diaUnimed}/{mesN}</div>
                        </div>
                        <div style={{background:C.primary,borderRadius:12,padding:"14px 18px",flex:1,minWidth:150}}>
                          <div style={{fontSize:11,color:"#a8c5da",fontWeight:600}}>💸 Total Geral Repasses</div>
                          <div style={{fontWeight:900,fontSize:20,color:"#fff",marginTop:4}}>{fmt(totalPart+totalUni)}</div>
                          <div style={{fontSize:11,color:"#a8c5da",marginTop:2,textTransform:"capitalize"}}>{mesLabel}</div>
                        </div>
                      </div>

                      {/* Uma seção por profissional */}
                      {profsFiltrados.map(prof => {
                        const cPart = consultasMes.filter(c=>c.prof===prof.nome&&c.conv==="PARTICULAR");
                        const cUni  = consultasMes.filter(c=>c.prof===prof.nome&&c.conv!=="PARTICULAR");
                        const totalP = cPart.reduce((a,c)=>a+c.valor*(pcts[prof.nome]??prof.pct),0);
                        const totalU = cUni.reduce((a,c)=>a+c.valor*(pcts[prof.nome]??prof.pct),0);
                        const total  = totalP + totalU;
                        if(total===0) return null;

                        const keyP = prof.nome+"-PART-"+repMesSel;
                        const keyU = prof.nome+"-UNIM-"+repMesSel;
                        const stP  = repStatusMap[keyP] || "pendente";
                        const stU  = repStatusMap[keyU] || "pendente";

                        const stCfg = {
                          pendente:  {label:"Pendente",  cor:"#95A5A6", bg:"#F2F3F4", icon:"⏳"},
                          agendado:  {label:"Agendado",  cor:"#F39C12", bg:"#FEF9E7", icon:"📅"},
                          pago:      {label:"Pago",      cor:"#27AE60", bg:"#EAFAF1", icon:"✅"},
                        };

                        return (
                          <div key={prof.nome} style={{marginBottom:20}}>
                            {/* Header da profissional */}
                            <div style={{background:prof.cor,borderRadius:"12px 12px 0 0",
                              padding:"12px 18px",color:"#fff",display:"flex",
                              justifyContent:"space-between",alignItems:"center"}}>
                              <div>
                                <div style={{fontWeight:800,fontSize:15}}>{prof.nome}</div>
                                <div style={{fontSize:11,opacity:.8}}>{prof.esp} · {fmtPct(pcts[prof.nome]??prof.pct)} de repasse</div>
                              </div>
                              <div style={{display:"flex",alignItems:"center",gap:12}}>
                                <div style={{fontWeight:900,fontSize:18}}>{fmt(total)}</div>
                                <button
                                  onClick={()=>gerarPdfRepasse(prof.nome, repMesSel, consultasMes, pcts, diaParticular, diaUnimed)}
                                  title="Gerar PDF de repasse"
                                  style={{
                                    background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.5)",
                                    borderRadius:8,padding:"6px 12px",color:"#fff",cursor:"pointer",
                                    fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:5,
                                    transition:"background .15s",
                                  }}>
                                  📄 Gerar PDF
                                </button>
                              </div>
                            </div>

                            <div style={{background:C.white,borderRadius:"0 0 12px 12px",
                              boxShadow:"0 2px 8px rgba(0,0,0,.08)",overflow:"hidden"}}>

                              {/* Bloco PARTICULAR */}
                              {cPart.length > 0 && (
                                <div>
                                  <div style={{background:"#EAFAF1",padding:"10px 18px",
                                    borderBottom:"1px solid #D5F5E3",
                                    display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                                      <span style={{fontWeight:700,fontSize:13,color:"#27AE60"}}>🟢 PARTICULAR</span>
                                      <span style={{fontSize:12,color:C.muted}}>· pagar em {fmtDate(dataPart)}</span>
                                    </div>
                                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                                      <span style={{fontWeight:800,fontSize:14,color:"#27AE60"}}>{fmt(totalP)}</span>
                                      <button onClick={()=>setRepStatusMap(prev=>({...prev,[keyP]:stP==="pago"?"pendente":"pago"}))}
                                        style={{
                                          padding:"5px 14px",borderRadius:20,border:"none",cursor:"pointer",
                                          fontWeight:700,fontSize:12,
                                          background:stP==="pago"?"#27AE60":stP==="agendado"?"#F39C12":"#95A5A6",
                                          color:"#fff",transition:"all .2s",
                                        }}>
                                        {stCfg[stP].icon} {stCfg[stP].label}
                                      </button>
                                      {stP!=="pago" && (
                                        <button onClick={()=>setRepStatusMap(prev=>({...prev,[keyP]:"agendado"}))}
                                          style={{padding:"5px 12px",borderRadius:20,border:"1px solid #F39C12",
                                            cursor:"pointer",fontWeight:600,fontSize:11,
                                            background:stP==="agendado"?"#F39C12":"transparent",
                                            color:stP==="agendado"?"#fff":"#F39C12"}}>
                                          📅 Agendar
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                                    <thead>
                                      <tr style={{background:C.light}}>
                                        <th style={TH}>Paciente</th>
                                        <th style={TH}>Tipo</th>
                                        <th style={TH}>Valor</th>
                                        <th style={TH}>% Repasse</th>
                                        <th style={TH}>Repasse</th>
                                        <th style={TH}>Data Pagto</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {cPart.map((c,i)=>{
                                        const pct = pcts[prof.nome]??prof.pct;
                                        const rep = c.valor*pct;
                                        const isPacote = c.tipo==="pacote";
                                        return (
                                          <tr key={i} style={{borderBottom:"1px solid "+C.border}}>
                                            <td style={{...TD,fontWeight:600}}>{c.paciente}</td>
                                            <td style={TD}>
                                              <span style={{
                                                background:isPacote?"#EAFAF1":"#EBF5FB",
                                                color:isPacote?"#27AE60":C.primary,
                                                borderRadius:20,padding:"2px 9px",
                                                fontSize:11,fontWeight:700,
                                              }}>{isPacote?"📦 Pacote":"🔢 Sessão"}</span>
                                            </td>
                                            <td style={TD}>{fmt(c.valor)}</td>
                                            <td style={TD}><span style={{color:"#27AE60",fontWeight:700}}>{fmtPct(pct)}</span></td>
                                            <td style={{...TD,fontWeight:700,color:"#27AE60"}}>{fmt(rep)}</td>
                                            <td style={TD}>{fmtDate(dataPart)}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                    <tfoot>
                                      <tr style={{background:"#EAFAF1",fontWeight:800}}>
                                        <td style={TD}>Subtotal Particular</td>
                                        <td style={TD}>{fmt(cPart.reduce((a,c)=>a+c.valor,0))}</td>
                                        <td style={TD}/>
                                        <td style={{...TD,color:"#27AE60"}}>{fmt(totalP)}</td>
                                        <td style={TD} colSpan={2}/>
                                      </tr>
                                    </tfoot>
                                  </table>
                                </div>
                              )}

                              {/* Bloco UNIMED */}
                              {cUni.length > 0 && (
                                <div>
                                  <div style={{background:"#EBF5FB",padding:"10px 18px",
                                    borderBottom:"1px solid #AED6F1",borderTop: cPart.length>0?"1px solid "+C.border:"none",
                                    display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                                      <span style={{fontWeight:700,fontSize:13,color:C.primary}}>🔵 UNIMED / CONVÊNIO</span>
                                      <span style={{fontSize:12,color:C.muted}}>· pagar em {fmtDate(dataUni)}</span>
                                    </div>
                                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                                      <span style={{fontWeight:800,fontSize:14,color:C.primary}}>{fmt(totalU)}</span>
                                      <button onClick={()=>setRepStatusMap(prev=>({...prev,[keyU]:stU==="pago"?"pendente":"pago"}))}
                                        style={{
                                          padding:"5px 14px",borderRadius:20,border:"none",cursor:"pointer",
                                          fontWeight:700,fontSize:12,
                                          background:stU==="pago"?"#27AE60":stU==="agendado"?"#F39C12":"#95A5A6",
                                          color:"#fff",transition:"all .2s",
                                        }}>
                                        {stCfg[stU].icon} {stCfg[stU].label}
                                      </button>
                                      {stU!=="pago" && (
                                        <button onClick={()=>setRepStatusMap(prev=>({...prev,[keyU]:"agendado"}))}
                                          style={{padding:"5px 12px",borderRadius:20,border:"1px solid #F39C12",
                                            cursor:"pointer",fontWeight:600,fontSize:11,
                                            background:stU==="agendado"?"#F39C12":"transparent",
                                            color:stU==="agendado"?"#fff":"#F39C12"}}>
                                          📅 Agendar
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                                    <thead>
                                      <tr style={{background:C.light}}>
                                        <th style={TH}>Paciente</th>
                                        <th style={TH}>Convênio</th>
                                        <th style={TH}>Tipo</th>
                                        <th style={TH}>Valor Guia</th>
                                        <th style={TH}>% Repasse</th>
                                        <th style={TH}>Repasse</th>
                                        <th style={TH}>Data Pagto</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {cUni.map((c,i)=>{
                                        const pct = pcts[prof.nome]??prof.pct;
                                        const rep = c.valor*pct;
                                        const isPacote = c.tipo==="pacote";
                                        const aConfirmar = c.valor===0;
                                        const convLabel2 = CONVENIOS.find(x=>x.id===c.conv)?.label||c.conv;
                                        const convCor2   = CONVENIOS.find(x=>x.id===c.conv)?.cor||C.primary;
                                        return (
                                          <tr key={i} style={{borderBottom:"1px solid "+C.border,
                                            background:aConfirmar?"#FFFBF0":"#fff"}}>
                                            <td style={{...TD,fontWeight:600}}>{c.paciente}</td>
                                            <td style={TD}><Badge color={convCor2}>{convLabel2}</Badge></td>
                                            <td style={TD}>
                                              <span style={{
                                                background:isPacote?"#EAFAF1":"#EBF5FB",
                                                color:isPacote?"#27AE60":C.primary,
                                                borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:700,
                                              }}>{isPacote?"📦 Pacote":"🔢 Sessão"}</span>
                                            </td>
                                            <td style={TD}>
                                              {aConfirmar
                                                ? <span style={{color:C.warning,fontWeight:700,fontSize:12}}>⚠️ A confirmar</span>
                                                : fmt(c.valor)
                                              }
                                            </td>
                                            <td style={TD}><span style={{color:C.primary,fontWeight:700}}>{fmtPct(pct)}</span></td>
                                            <td style={{...TD,fontWeight:700,color:aConfirmar?C.warning:C.primary}}>
                                              {aConfirmar ? "—" : fmt(rep)}
                                            </td>
                                            <td style={TD}>{fmtDate(dataUni)}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                    <tfoot>
                                      <tr style={{background:"#EBF5FB",fontWeight:800}}>
                                        <td style={TD} colSpan={2}>Subtotal Convênio</td>
                                        <td style={TD}>{fmt(cUni.reduce((a,c)=>a+c.valor,0))}</td>
                                        <td style={TD}/>
                                        <td style={{...TD,color:C.primary}}>{fmt(totalU)}</td>
                                        <td style={TD}/>
                                      </tr>
                                    </tfoot>
                                  </table>
                                </div>
                              )}

                              {/* Total da profissional */}
                              <div style={{background:prof.cor+"12",padding:"12px 18px",
                                display:"flex",justifyContent:"space-between",alignItems:"center",
                                borderTop:"2px solid "+prof.cor+"33"}}>
                                <span style={{fontWeight:700,fontSize:13,color:prof.cor}}>
                                  Total a repassar para {prof.nome}
                                </span>
                                <span style={{fontWeight:900,fontSize:18,color:prof.cor}}>{fmt(total)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ══ CALENDÁRIO ════════════════════════════════════════ */}
        {tab==="calendario" && (
          <div>
            <h2 style={{fontWeight:800,fontSize:19,marginBottom:16}}>📆 Calendário de Pagamentos</h2>
            <Calendario contas={contas} onToggle={toggleSt}/>
          </div>
        )}

        {/* ══ REPASSES ══════════════════════════════════════════ */}
        {tab==="repasses" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h2 style={{fontWeight:800,fontSize:19,margin:0}}>👩‍⚕️ Repasses às Profissionais</h2>
              <button onClick={()=>{setPctTemp({...pcts});setPctEdit(true);}} style={BP}>⚙️ Editar %</button>
            </div>
            <MesSel val={mesSel} set={setMesSel}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,marginBottom:16}}>
              {PROFS.map(p=>{
                const fat=mes.fat[p.nome]||0;
                const pct=pcts[p.nome]??p.pct;
                const rep=fat*pct;
                return (
                  <div key={p.nome} style={{background:C.white,borderRadius:12,boxShadow:"0 1px 6px rgba(0,0,0,.08)",padding:15,borderTop:"3px solid "+p.cor,opacity:fat===0?.45:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div>
                        <div style={{fontWeight:800,fontSize:14}}>{p.nome}</div>
                        <div style={{fontSize:11,color:C.muted}}>{p.esp}</div>
                      </div>
                      <div style={{background:p.cor+"22",color:p.cor,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:800}}>{fmtPct(pct)}</div>
                    </div>
                    <div style={{fontSize:11,color:C.muted}}>Faturamento</div>
                    <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>{fmt(fat)}</div>
                    <div style={{background:C.light,borderRadius:8,padding:"8px 10px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                        <span style={{color:C.muted}}>Repasse</span>
                        <span style={{fontWeight:700,color:C.danger}}>{fmt(rep)}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginTop:3}}>
                        <span style={{color:C.muted}}>Clínica</span>
                        <span style={{fontWeight:700,color:C.accent}}>{fmt(fat-rep)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{...CARD,background:C.primary,color:"#fff"}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>Resumo · {mes.label}</div>
              <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
                <div><div style={{fontSize:11,opacity:.7}}>Faturado</div><div style={{fontWeight:800,fontSize:18}}>{fmt(mes.bruto)}</div></div>
                <div><div style={{fontSize:11,opacity:.7}}>Repasses</div><div style={{fontWeight:800,fontSize:18,color:"#ff8080"}}>{fmt(totalRep)}</div></div>
                <div><div style={{fontSize:11,opacity:.7}}>Receita Clínica</div><div style={{fontWeight:800,fontSize:18,color:C.accent}}>{fmt(totalCli)}</div></div>
                <div><div style={{fontSize:11,opacity:.7}}>Lucro Líq.</div><div style={{fontWeight:800,fontSize:18,color:lucroLiq>=0?C.accent:"#ff6b6b"}}>{fmt(lucroLiq)}</div></div>
              </div>
            </div>
          </div>
        )}

        {/* ══ DRE ═══════════════════════════════════════════════ */}
        {tab==="dre" && (
          <div>
            <h2 style={{fontWeight:800,fontSize:19,marginBottom:16}}>📈 DRE – Demonstrativo de Resultado</h2>
            <MesSel val={mesSel} set={setMesSel}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div style={CARD}>
                <div style={{fontWeight:700,fontSize:13,color:C.accent,marginBottom:12}}>✅ FATURAMENTO · {mes.label}</div>
                {PROFS.map(p=>{
                  const fat=mes.fat[p.nome]||0;
                  if(!fat) return null;
                  return (
                    <div key={p.nome} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid "+C.border,fontSize:13}}>
                      <span style={{color:C.muted}}>{p.nome} <span style={{fontSize:11}}>({fmtPct(pcts[p.nome]??p.pct)})</span></span>
                      <span style={{fontWeight:600}}>{fmt(fat)}</span>
                    </div>
                  );
                })}
                <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontWeight:800,fontSize:14,color:C.accent,borderTop:"2px solid "+C.accent,marginTop:4}}>
                  <span>TOTAL</span><span>{fmt(mes.bruto)}</span>
                </div>
              </div>
              <div style={CARD}>
                <div style={{fontWeight:700,fontSize:13,color:C.danger,marginBottom:12}}>💸 REPASSES + IMPOSTOS</div>
                <div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:6}}>— Profissionais —</div>
                {repassesMes.map(p=>(
                  <div key={p.nome} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+C.border,fontSize:13}}>
                    <span style={{color:C.muted}}>{p.nome} · {fmtPct(p.pct)}</span>
                    <span style={{fontWeight:600,color:C.danger}}>{fmt(p.rep)}</span>
                  </div>
                ))}
                <div style={{fontSize:11,color:C.muted,fontWeight:700,margin:"10px 0 6px"}}>— Impostos —</div>
                {mes.das>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+C.border,fontSize:13}}><span style={{color:C.muted}}>DAS</span><span style={{fontWeight:600,color:"#C0392B"}}>{fmt(mes.das)}</span></div>}
                {mes.iss>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+C.border,fontSize:13}}><span style={{color:C.muted}}>ISS Unimed</span><span style={{fontWeight:600,color:"#C0392B"}}>{fmt(mes.iss)}</span></div>}
                <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontWeight:800,fontSize:14,color:C.danger,borderTop:"2px solid "+C.danger,marginTop:4}}>
                  <span>TOTAL DEDUÇÕES</span><span>{fmt(totalRep+mes.das+mes.iss)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontWeight:700,fontSize:13,color:C.primary}}>
                  <span>Lucro Bruto</span><span>{fmt(mes.lucro)}</span>
                </div>
              </div>
              <div style={CARD}>
                <div style={{fontWeight:700,fontSize:13,color:C.warning,marginBottom:12}}>🏢 CUSTOS FIXOS</div>
                {mes.fixos.map((x,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid "+C.border,fontSize:13}}>
                    <span style={{color:C.muted}}>{x.d}</span><span style={{fontWeight:600}}>{fmt(x.v)}</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontWeight:800,fontSize:14,color:C.warning,borderTop:"2px solid "+C.warning,marginTop:4}}>
                  <span>TOTAL</span><span>{fmt(totalFixos)}</span>
                </div>
              </div>
              <div style={CARD}>
                <div style={{fontWeight:700,fontSize:13,color:C.purple,marginBottom:12}}>📋 DESPESAS VARIÁVEIS</div>
                {mes.vars.map((x,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid "+C.border,fontSize:13}}>
                    <span style={{color:C.muted}}>{x.d}</span><span style={{fontWeight:600}}>{fmt(x.v)}</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontWeight:800,fontSize:14,color:C.purple,borderTop:"2px solid "+C.purple,marginTop:4}}>
                  <span>TOTAL</span><span>{fmt(totalVars)}</span>
                </div>
              </div>
            </div>
            <div style={{...CARD,padding:0,overflow:"hidden"}}>
              <div style={{background:"#1a3352",color:"#fff",padding:"14px 20px"}}>
                <div style={{fontSize:11,opacity:.7,fontWeight:600,marginBottom:4}}>ETAPA 1 · LUCRO BRUTO</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:13,opacity:.8}}>{fmt(mes.bruto)} − {fmt(totalRep+mes.das+mes.iss)} (repasses + impostos)</div>
                  <div style={{fontWeight:900,fontSize:20}}>{fmt(mes.lucro)}</div>
                </div>
              </div>
              <div style={{background:lucroLiq>=0?"#1a3a26":"#3a1a1a",color:"#fff",padding:"18px 20px"}}>
                <div style={{fontSize:11,opacity:.7,fontWeight:600,marginBottom:12}}>ETAPA 2 · RESULTADO FINAL</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:16}}>
                  <div style={{background:"rgba(255,255,255,.08)",borderRadius:9,padding:"10px 13px"}}>
                    <div style={{fontSize:10,opacity:.7}}>Lucro Bruto</div>
                    <div style={{fontWeight:800,fontSize:15}}>{fmt(mes.lucro)}</div>
                  </div>
                  <div style={{background:"rgba(255,255,255,.08)",borderRadius:9,padding:"10px 13px"}}>
                    <div style={{fontSize:10,opacity:.7}}>(-) Custos Fixos</div>
                    <div style={{fontWeight:800,fontSize:15,color:"#ffe066"}}>{fmt(totalFixos)}</div>
                  </div>
                  <div style={{background:"rgba(255,255,255,.08)",borderRadius:9,padding:"10px 13px"}}>
                    <div style={{fontSize:10,opacity:.7}}>(-) Desp. Variáveis</div>
                    <div style={{fontWeight:800,fontSize:15,color:"#cc99ff"}}>{fmt(totalVars)}</div>
                  </div>
                </div>
                <div style={{borderTop:"1px solid rgba(255,255,255,.15)",paddingTop:14,
                  display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
                  <div>
                    <div style={{fontSize:11,opacity:.7,marginBottom:3}}>RESULTADO LÍQUIDO</div>
                    <div style={{fontWeight:900,fontSize:28}}>{fmt(lucroLiq)}</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:11,opacity:.7,marginBottom:6}}>MARGEM DE LUCRO</div>
                    <div style={{
                      background:margem>=10?"rgba(46,204,113,.25)":margem>=0?"rgba(243,156,18,.25)":"rgba(231,76,60,.25)",
                      border:"3px solid "+(margem>=10?"#2ECC71":margem>=0?"#F39C12":"#E74C3C"),
                      borderRadius:"50%",width:76,height:76,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      flexDirection:"column",margin:"0 auto",
                    }}>
                      <div style={{fontWeight:900,fontSize:17,lineHeight:1}}>{margem.toFixed(1)}%</div>
                    </div>
                  </div>
                  <div style={{background:"rgba(255,255,255,.06)",borderRadius:9,padding:"10px 14px",fontSize:11,lineHeight:1.7}}>
                    <div style={{fontWeight:700,marginBottom:4}}>Referência</div>
                    <div style={{color:margem>=15?"#2ECC71":"rgba(255,255,255,.4)"}}>✅ &gt;15% Excelente</div>
                    <div style={{color:margem>=10&&margem<15?"#F39C12":"rgba(255,255,255,.4)"}}>⚠️ 10–15% Boa</div>
                    <div style={{color:margem>=0&&margem<10?"#F39C12":"rgba(255,255,255,.4)"}}>⚠️ 5–10% Atenção</div>
                    <div style={{color:margem<0?"#E74C3C":"rgba(255,255,255,.4)"}}>🔴 &lt;0% Prejuízo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ CUSTOS FIXOS ══════════════════════════════════════ */}
        {tab==="custos" && (
          <div>
            <h2 style={{fontWeight:800,fontSize:19,marginBottom:16}}>📤 Custos Fixos por Mês</h2>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,background:C.white,borderRadius:14,boxShadow:"0 1px 6px rgba(0,0,0,.08)"}}>
                <thead>
                  <tr style={{background:C.light}}>
                    <th style={TH}>Tipo</th>
                    {MESES.map(m=><th key={m.id} style={TH}>{m.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {LINHAS_FIXOS.map(tipo=>(
                    <tr key={tipo} style={{borderBottom:"1px solid "+C.border}}>
                      <td style={{...TD,fontWeight:600}}>{tipo}</td>
                      {MESES.map(m=>{
                        const it=m.fixos.find(x=>x.d===tipo);
                        return <td key={m.id} style={TD}>{it?fmt(it.v):<span style={{color:C.border}}>—</span>}</td>;
                      })}
                    </tr>
                  ))}
                  <tr style={{background:C.light,fontWeight:800}}>
                    <td style={TD}>TOTAL FIXOS</td>
                    {MESES.map(m=><td key={m.id} style={{...TD,color:C.warning}}>{fmt(m.fixos.reduce((a,x)=>a+x.v,0))}</td>)}
                  </tr>
                  <tr style={{fontWeight:800}}>
                    <td style={TD}>TOTAL VARIÁVEIS</td>
                    {MESES.map(m=><td key={m.id} style={{...TD,color:C.purple}}>{fmt(m.vars.reduce((a,x)=>a+x.v,0))}</td>)}
                  </tr>
                  <tr style={{background:C.primary+"12",fontWeight:800}}>
                    <td style={TD}>LUCRO CLÍNICA</td>
                    {MESES.map(m=><td key={m.id} style={{...TD,color:C.accent}}>{fmt(m.lucro)}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ── MODAL EXCLUIR CONSULTA ────────────────────────────── */}
      {delC && (
        <div style={OV}>
          <div style={{background:"#fff",borderRadius:14,padding:28,width:360,boxShadow:"0 8px 32px rgba(0,0,0,.2)"}}>
            <div style={{fontWeight:800,fontSize:16,marginBottom:10}}>Excluir consulta?</div>
            <p style={{color:C.muted,fontSize:14,margin:"0 0 18px"}}>Deseja excluir <strong>{delC.paciente}</strong> ({fmt(delC.valor)})?</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDelC(null)} style={BS}>Cancelar</button>
              <button onClick={()=>deletarC(delC.id)} style={{...BP,background:C.danger}}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL EXCLUIR CONTA ───────────────────────────────── */}
      {delP && (
        <div style={OV}>
          <div style={{background:"#fff",borderRadius:14,padding:28,width:360,boxShadow:"0 8px 32px rgba(0,0,0,.2)"}}>
            <div style={{fontWeight:800,fontSize:16,marginBottom:10}}>Excluir conta?</div>
            <p style={{color:C.muted,fontSize:14,margin:"0 0 18px"}}>Deseja excluir <strong>{delP.desc}</strong> ({fmt(delP.valor)} · venc. {fmtDate(delP.venc)})?</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDelP(null)} style={BS}>Cancelar</button>
              <button onClick={()=>deletarP(delP.id)} style={{...BP,background:C.danger}}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL PDF REPASSE ───────────────────────────────────── */}
      {pdfModal && pdfData && (
        <PdfPreview data={pdfData} onClose={()=>setPdfModal(false)}/>
      )}

      {/* ── MODAL PORCENTAGENS ────────────────────────────────── */}
      {pctEdit && (
        <div style={OV}>
          <div style={{background:"#fff",borderRadius:16,padding:28,width:460,boxShadow:"0 8px 40px rgba(0,0,0,.2)",maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{fontWeight:800,fontSize:16,marginBottom:14}}>⚙️ Porcentagens de Repasse</div>
            <p style={{fontSize:13,color:C.muted,marginBottom:14}}>Percentual repassado a cada profissional. O restante fica para a clínica.</p>
            {PROFS.map(p=>(
              <div key={p.nome} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid "+C.border}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14}}>{p.nome}</div>
                  <div style={{fontSize:11,color:C.muted}}>{p.esp}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <input type="range" min={30} max={80} step={5}
                    value={Math.round((pctTemp[p.nome]??p.pct)*100)}
                    onChange={e=>setPctTemp(prev=>({...prev,[p.nome]:Number(e.target.value)/100}))}
                    style={{width:100}}/>
                  <div style={{width:42,textAlign:"center",fontWeight:800,fontSize:16,color:p.cor}}>
                    {Math.round((pctTemp[p.nome]??p.pct)*100)}%
                  </div>
                </div>
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:18}}>
              <button onClick={()=>setPctEdit(false)} style={BS}>Cancelar</button>
              <button onClick={()=>{setPcts({...pctTemp});setPctEdit(false);}} style={BP}>Salvar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
