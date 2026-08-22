import type { ArtifactTweaks } from "@/skills/types";

export const DEFAULT_TWEAKS: ArtifactTweaks = {
  accent: "#3B82F6",
  surface: "#ffffff",
  textColor: "#111111",
  pageBg: "#ffffff",
  fontFamily: "system",
  typeScale: 1,
  density: 1,
  radius: 8,
  theme: "light",
  hoverMotion: "subtle",
  chartTooltips: false,
};

export function mergeTweaks(
  t: Partial<ArtifactTweaks> | undefined,
): ArtifactTweaks {
  return { ...DEFAULT_TWEAKS, ...t };
}

export function buildTweakInjection(t: ArtifactTweaks): string {
  return `<style>
:root{
  --ocd-accent:${t.accent};
  --ocd-type-scale:${t.typeScale};
  --ocd-density:${t.density};
  --ocd-theme:${t.theme};
}
html[data-ocd-theme="dark"], body { filter: none; }
</style>
<script>
(function(){
  var t={accent:"${t.accent}",surface:"${t.surface}",textColor:"${t.textColor}",pageBg:"${t.pageBg}",fontFamily:"${t.fontFamily}",typeScale:${t.typeScale},density:${t.density},radius:${t.radius},theme:"${t.theme}"};
  var root=document.documentElement;
  root.style.setProperty("--accent",t.accent);
  root.style.setProperty("--color-accent",t.accent);
  root.style.setProperty("--primary",t.accent);
  root.style.setProperty("--surface",t.surface);
  root.style.setProperty("--color-surface",t.surface);
  root.style.setProperty("--card",t.surface);
  root.style.setProperty("--foreground",t.textColor);
  root.style.setProperty("--color-foreground",t.textColor);
  root.style.setProperty("--background",t.pageBg);
  root.style.setProperty("--color-background",t.pageBg);
  root.style.setProperty("--radius",t.radius+"px");
  if(t.fontFamily && t.fontFamily!=="system"){
    root.style.setProperty("--font-body",t.fontFamily);
    root.style.setProperty("--font-display",t.fontFamily);
    root.style.setProperty("font-family",t.fontFamily);
    var fam=t.fontFamily.split(",")[0].replace(/['"]/g,"").trim();
    if(!document.getElementById("ocd-font-link")){
      var link=document.createElement("link");
      link.id="ocd-font-link";
      link.rel="stylesheet";
      link.href="https://fonts.googleapis.com/css2?family="+fam.replace(/ /g,"+")+"&display=swap";
      document.head.appendChild(link);
    }
  }
  var dark=t.theme==="dark"||(t.theme==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);
  if(dark){
    root.style.setProperty("--background","#0f172a");
    root.style.setProperty("--color-background","#0f172a");
    root.style.setProperty("background-color","#0f172a");
    document.body.style.background="#0f172a";
    root.style.setProperty("--foreground","#f8fafc");
    root.style.setProperty("--color-foreground","#f8fafc");
    root.style.setProperty("color","#f8fafc");
    document.body.style.color="#f8fafc";
    root.style.setProperty("--surface","#1e293b");
    root.style.setProperty("--color-surface","#1e293b");
  }
  var scale=t.typeScale;
  root.style.fontSize=(scale*100)+"%";
  var density=t.density;
  root.style.setProperty("--spacing",(density*24)+"px");
  root.style.setProperty("--ocd-spacing",(density*24)+"px");
})();
</script>
<style>
${t.hoverMotion === "subtle" ? `
@media (hover:hover){
  [class*="card"],[class*="Card"],[class*="kpi"],[class*="KPI"],[class*="tile"],[class*="Tile"],.btn,button:not(:disabled){
    transition:transform .15s ease,box-shadow .15s ease;
  }
  [class*="card"]:hover,[class*="Card"]:hover,[class*="kpi"]:hover,[class*="KPI"]:hover,[class*="tile"]:hover,[class*="Tile"]:hover,.btn:hover,button:not(:disabled):hover{
    transform:translateY(-2px);
    box-shadow:0 4px 14px rgba(0,0,0,.12);
  }
}` : ""}
${t.hoverMotion === "elevated" ? `
@media (hover:hover){
  [class*="card"],[class*="Card"],[class*="kpi"],[class*="KPI"],[class*="tile"],[class*="Tile"],.btn,button:not(:disabled){
    transition:transform .2s ease,box-shadow .2s ease;
  }
  [class*="card"]:hover,[class*="Card"]:hover,[class*="kpi"]:hover,[class*="KPI"]:hover,[class*="tile"]:hover,[class*="Tile"]:hover,.btn:hover,button:not(:disabled):hover{
    transform:translateY(-6px) scale(1.02);
    box-shadow:0 14px 30px rgba(0,0,0,.18);
  }
}` : ""}
${t.hoverMotion === "playful" ? `
@media (hover:hover){
  [class*="card"],[class*="Card"],[class*="kpi"],[class*="KPI"],[class*="tile"],[class*="Tile"],.btn,button:not(:disabled){
    transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s ease;
  }
  [class*="card"]:hover,[class*="Card"]:hover,[class*="kpi"]:hover,[class*="KPI"]:hover,[class*="tile"]:hover,[class*="Tile"]:hover,.btn:hover,button:not(:disabled):hover{
    transform:scale(1.04) rotate(-1deg);
    box-shadow:0 12px 28px rgba(0,0,0,.15);
  }
}` : ""}
@media (prefers-reduced-motion:reduce){
  [class*="card"],[class*="Card"],[class*="kpi"],[class*="KPI"],[class*="tile"],[class*="Tile"],.btn,button{transform:none!important;transition:none!important}
}
</style>
${t.chartTooltips ? `<script>
(function(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  var tip=document.createElement("div");
  tip.style.cssText="position:fixed;z-index:99999;pointer-events:none;background:#111;color:#fff;font:11px/1.4 system-ui,sans-serif;padding:3px 8px;border-radius:6px;display:none;box-shadow:0 2px 8px rgba(0,0,0,.3)";
  document.body.appendChild(tip);
  function show(x,y,text){
    tip.textContent=text;tip.style.display="block";
    var r=tip.getBoundingClientRect();
    tip.style.left=Math.min(x+10,innerWidth-r.width-8)+"px";
    tip.style.top=(y-r.height-10)+"px";
  }
  function val(el){
    var d=el.getAttribute("data-value")||el.getAttribute("data-label")||el.getAttribute("data-tip");
    if(d)return d;
    if(el.getAttribute("height")){
      var hh=el.getAttribute("height");
      return hh.indexOf("%")>-1?hh:parseFloat(hh).toFixed(0);
    }
    var h=el.style&&el.style.height;
    if(h){
      if(h.indexOf("%")>-1)return h;
      var p=parseFloat(h);
      if(!isNaN(p))return p.toFixed(0)+"px";
    }
    return null;
  }
  document.addEventListener("mouseover",function(e){
    var el=e.target;
    if(!el)return;
    if(el.closest&&el.closest("svg")&&(el.tagName==="RECT"||el.tagName==="CIRCLE"||el.tagName==="PATH")){
      var v=val(el);
      show(e.clientX,e.clientY,(el.tagName==="RECT"?(v||"Barre"):"Point")+(v?" : "+v:""));
    }else if(el.closest&&el.closest("[class*='bar' i],[class*='Bar' i]")&&el.closest(":not(svg)")){
      var b=el.closest("[class*='bar' i],[class*='Bar' i]");
      if(b.getAttribute("title"))return;
      var v2=val(b);
      if(v2)show(e.clientX,e.clientY,v2);
    }
  });
  document.addEventListener("mouseout",function(){tip.style.display="none"});
})();
</script>` : ""}`;
}
