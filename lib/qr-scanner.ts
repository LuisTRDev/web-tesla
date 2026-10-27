import { SCENES_JS, type QrAnimation } from "@/lib/qr-splash";

/**
 * "Escáner Tesla": página con la cámara que detecta un QR y dibuja el efecto elegido (átomo, rayos…) sobre el propio
 * código, en el momento de escanear. Es lo más cercano a "realidad aumentada" sin instalar nada: funciona en el navegador
 * del celular. Solo abre sola una dirección de esta misma web; cualquier otra se muestra para que la persona decida.
 */
const SCRIPT = `(function(){
var C=__CFG__;
var cv=document.getElementById("c"),g=cv.getContext("2d"),W=0,H=0;
function size(){var d=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;g.setTransform(d,0,0,d,0,0);}
size();addEventListener("resize",size);
var logo=new Image();logo.src=C.logo;
${SCENES_JS}
var scene=SC[C.anim]||SC.atomo;
var video=document.getElementById("v"),msg=document.getElementById("msg"),res=document.getElementById("res");
var off=document.createElement("canvas"),og=off.getContext("2d",{willReadFrequently:true});
var locked=null,t0=0,lastScan=0,finished=false;
function say(t){msg.textContent=t;msg.hidden=!t;}
var LS="tesla-entradas";
function loadT(){try{return JSON.parse(localStorage.getItem(LS)||"{}");}catch(e){return {};}}
function saveT(o){try{localStorage.setItem(LS,JSON.stringify(o));}catch(e){}}
function hhmm(ts){var d=new Date(ts);return d.toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit"});}
function ticket(text){
  finished=true;
  var p=text.split("|"),ev=p[1]||"",name=p[2]||"",id=p[3]||p[2]||"",key=ev+"|"+id,all=loadT(),dup=!!all[key],n;
  if(!dup){all[key]={name:name,event:ev,ts:Date.now()};saveT(all);}
  n=Object.keys(all).filter(function(k){return all[k].event===ev;}).length;
  document.getElementById("rt").textContent=dup?"⚠ Esta entrada ya ingresó a las "+hhmm(all[key].ts):"✓ Entrada válida";
  res.className=dup?"bad":"ok";
  document.getElementById("txt").textContent=name+" · "+ev+" — ya entraron "+n+" en este celular";
  document.getElementById("open").hidden=true;
  document.getElementById("csv").hidden=false;
  res.hidden=false;
  if(navigator.vibrate)navigator.vibrate(dup?[200,100,200]:80);
}
function exportCsv(){
  var all=loadT(),rows=["evento,nombre,hora"];
  Object.keys(all).forEach(function(k){var e=all[k];rows.push([e.event,e.name,new Date(e.ts).toLocaleString("es-PE")].map(function(c){return '"'+String(c).replace(/"/g,'""')+'"';}).join(","));});
  var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([rows.join("\\n")],{type:"text/csv"}));a.download="ingresos.csv";a.click();
}
function finish(text){
  if(finished)return;finished=true;
  var u=null;try{u=new URL(text);}catch(e){}
  if(u&&(u.protocol==="https:"||u.protocol==="http:")&&u.host===location.host){location.href=u.href;return;}
  var a=document.getElementById("open"),t=document.getElementById("txt");
  document.getElementById("rt").textContent="Código leído";document.getElementById("csv").hidden=true;res.className="";
  t.textContent=text;
  if(u&&(u.protocol==="https:"||u.protocol==="http:")){a.href=u.href;a.textContent="Abrir "+u.host;a.hidden=false;}else a.hidden=true;
  res.hidden=false;
}
function scan(now){
  if(locked||video.readyState<2||now-lastScan<140)return;
  lastScan=now;
  var vw=video.videoWidth,vh=video.videoHeight;if(!vw)return;
  var k=Math.min(1,480/Math.max(vw,vh));off.width=Math.round(vw*k);off.height=Math.round(vh*k);
  og.drawImage(video,0,0,off.width,off.height);
  var d=og.getImageData(0,0,off.width,off.height),r=jsQR(d.data,off.width,off.height,{inversionAttempts:"dontInvert"});
  if(!r||!r.data)return;
  if(r.data.indexOf("TESLA-TICKET|")===0){ticket(r.data);return;}
  var s=Math.max(W/vw,H/vh),ox=(W-vw*s)/2,oy=(H-vh*s)/2,L=r.location,pts=[L.topLeftCorner,L.topRightCorner,L.bottomRightCorner,L.bottomLeftCorner];
  var xs=pts.map(function(p){return ox+p.x/k*s;}),ys=pts.map(function(p){return oy+p.y/k*s;});
  var cx=(xs[0]+xs[1]+xs[2]+xs[3])/4,cy=(ys[0]+ys[1]+ys[2]+ys[3])/4;
  var side=(Math.hypot(xs[1]-xs[0],ys[1]-ys[0])+Math.hypot(xs[2]-xs[1],ys[2]-ys[1]))/2;
  locked={text:r.data,cx:cx,cy:cy,R:Math.max(120,Math.min(side*1.15,Math.min(W,H)*0.46))};
  t0=0;say("");
}
function frame(now){
  g.clearRect(0,0,W,H);
  scan(now);
  if(locked){
    if(!t0)t0=now;
    var t=now-t0,p=Math.min(1,t/C.ms);
    g.fillStyle="rgba(13,18,48,"+(0.45*Math.min(1,t/400))+")";g.fillRect(0,0,W,H);
    scene(t,p,locked.cx,locked.cy,locked.R);
    if(t>=C.ms)finish(locked.text);
  }
  if(!finished)requestAnimationFrame(frame);
}
if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){say("Este navegador no permite usar la cámara. Abre esta página en Chrome o Safari.");}
else navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false}).then(function(s){
  video.srcObject=s;video.play().then(function(){say("Apunta al código QR");requestAnimationFrame(frame);});
}).catch(function(){say("No pudimos usar la cámara. Revisa el permiso en tu navegador y vuelve a intentarlo.");});
document.getElementById("again").addEventListener("click",function(){finished=false;locked=null;t0=0;res.hidden=true;say("Apunta al código QR");requestAnimationFrame(frame);});
document.getElementById("csv").addEventListener("click",exportCsv);
})();`;

export function qrScannerResponse({ anim, name, seconds, logo }: { anim: QrAnimation; name: string; seconds: number; logo: string }) {
  const ms = Math.round(Math.min(5, Math.max(1.5, seconds)) * 1000);
  const cfg = JSON.stringify({ anim: anim === "ninguna" ? "atomo" : anim, ms, logo }).replace(/</g, "\u003c");
  const safeName = name.replace(/[&<>"']/g, "");
  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Escáner ${safeName}</title>
<style>
html,body{margin:0;height:100%;background:#0D1230;overflow:hidden;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#fff}
video,canvas{position:fixed;inset:0;width:100%;height:100%;display:block}
video{object-fit:cover}
#top{position:fixed;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:14px;z-index:3}
#top a{color:#fff;text-decoration:none;background:rgba(13,18,48,.6);border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:8px 16px;font-weight:600;font-size:14px}
#msg{position:fixed;left:16px;right:16px;bottom:12%;text-align:center;font-size:18px;font-weight:600;background:rgba(13,18,48,.7);padding:14px 18px;border-radius:16px;z-index:3}
#res{position:fixed;inset:0;background:rgba(13,18,48,.94);display:flex;flex-direction:column;gap:14px;align-items:center;justify-content:center;padding:24px;text-align:center;z-index:4}
#res[hidden],#msg[hidden],#open[hidden]{display:none}
#res.ok{background:rgba(10,90,50,.96)}#res.bad{background:rgba(130,30,20,.96)}#res strong{font-size:26px}#csv[hidden]{display:none}
#txt{word-break:break-all;color:#A9ADFF;max-width:90vw}
.b{background:#FFB627;color:#0D1230;border:0;border-radius:999px;padding:12px 24px;font-weight:700;font-size:16px;text-decoration:none;cursor:pointer}
</style></head><body>
<video id="v" playsinline muted></video><canvas id="c"></canvas>
<div id="top"><a href="/">‹ Volver</a><span>${safeName}</span></div>
<div id="msg">Abriendo la cámara…</div>
<div id="res" hidden><strong id="rt">Código leído</strong><div id="txt"></div><a id="open" class="b" rel="noopener" hidden></a><button id="csv" class="b" type="button" hidden>Descargar lista de ingresos (CSV)</button><button id="again" class="b" type="button">Escanear siguiente</button></div>
<script src="/admin/vendor/jsQR.js"></script>
<script>${SCRIPT.replace("__CFG__", () => cfg)}</script>
</body></html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "permissions-policy": "camera=(self)" } });
}
