/**
 * Animación que se ve un instante al escanear un QR, antes de entrar a la web.
 * Es una sola página HTML con su propio canvas (sin React ni descargas extra) para que cargue de inmediato
 * en un celular con poca señal. Pasado el tiempo —o al tocar “Saltar”— lleva al destino.
 */
export const QR_ANIMATIONS = ["ninguna", "atomo", "rayos", "bobina", "energia", "chispas"] as const;
export type QrAnimation = (typeof QR_ANIMATIONS)[number];

type SplashOptions = {
  anim: QrAnimation;
  dest: string;
  name: string;
  line: string;
  seconds: number;
  logo: string;
};

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

const SCRIPT = `(function(){
var C=__CFG__;
var fz=-1;
if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)C.ms=900;
var cv=document.getElementById("c"),g=cv.getContext("2d"),W=0,H=0;
function size(){var d=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;g.setTransform(d,0,0,d,0,0);}
size();addEventListener("resize",function(){size();if(fz>=0)frame(0);});
var logo=new Image();logo.src=C.logo;
var done=false;
function go(){if(done)return;done=true;location.replace(C.dest);}
document.getElementById("skip").addEventListener("click",go);
var fm=/[?&]freeze=([0-9]+)/.exec(location.search);fz=fm?+fm[1]:-1;
if(fz<0)setTimeout(go,C.ms+2500);
logo.onload=function(){if(fz>=0)frame(0);};
var seed=1;function rnd(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646;}
function ease(x){x=Math.max(0,Math.min(1,x));return 1-Math.pow(1-x,3);}
var GOLD="#FFB627",ARC="#A9ADFF",RED="#E03C26";
function glow(x,y,r,col,a){var k=g.createRadialGradient(x,y,0,x,y,r);k.addColorStop(0,col);k.addColorStop(1,"rgba(0,0,0,0)");g.globalAlpha=a;g.fillStyle=k;g.beginPath();g.arc(x,y,r,0,7);g.fill();g.globalAlpha=1;}
function drawLogo(cx,cy,r,a){
  glow(cx,cy,r*2.2,GOLD,0.25*a);
  if(logo.complete&&logo.naturalWidth){var ra=logo.naturalWidth/logo.naturalHeight,w=ra>=1?r*2:r*2*ra,h=ra>=1?r*2/ra:r*2;g.globalAlpha=a;g.shadowColor=GOLD;g.shadowBlur=r*0.5;g.drawImage(logo,cx-w/2,cy-h/2,w,h);g.shadowBlur=0;g.globalAlpha=1;}
}
function jag(x0,y0,x1,y1,disp){var p=[[x0,y0],[x1,y1]];for(var i=0;i<5;i++){var q=[p[0]];for(var j=1;j<p.length;j++){var a=p[j-1],b=p[j],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.sqrt(dx*dx+dy*dy)||1;q.push([(a[0]+b[0])/2-dy/l*(rnd()-0.5)*disp,(a[1]+b[1])/2+dx/l*(rnd()-0.5)*disp]);q.push(b);}p=q;disp*=0.55;}return p;}
function bolt(x0,y0,x1,y1,disp,col,w,a){var p=jag(x0,y0,x1,y1,disp);g.lineJoin="round";g.lineCap="round";g.shadowColor=col;g.shadowBlur=18;g.strokeStyle=col;g.globalAlpha=a;g.lineWidth=w;g.beginPath();for(var i=0;i<p.length;i++){if(i)g.lineTo(p[i][0],p[i][1]);else g.moveTo(p[i][0],p[i][1]);}g.stroke();g.shadowBlur=0;g.strokeStyle="#fff";g.lineWidth=Math.max(1,w*0.4);g.globalAlpha=a*0.9;g.stroke();g.globalAlpha=1;}
var SC={};
SC.atomo=function(t,p,cx,cy,R){
  var a=ease(p*3);
  for(var k=0;k<3;k++){
    var ang=k*Math.PI/3+t*0.0004,rx=R,ry=R*0.36;
    g.save();g.translate(cx,cy);g.rotate(ang);
    g.strokeStyle=ARC;g.globalAlpha=0.4*a;g.lineWidth=2;g.beginPath();g.ellipse(0,0,rx,ry,0,0,7);g.stroke();
    for(var s=0;s<4;s++){var ph=t*0.005*(1+k*0.25)+k*2.1-s*0.16,ex=Math.cos(ph)*rx,ey=Math.sin(ph)*ry;glow(ex,ey,(s?9:20)-s*2,s?ARC:GOLD,(1-s*0.22)*a);if(!s){g.globalAlpha=a;g.fillStyle="#fff";g.beginPath();g.arc(ex,ey,5,0,7);g.fill();}}
    g.restore();
  }
  g.globalAlpha=1;
  drawLogo(cx,cy,R*0.34*ease(p*2.2),ease(p*2.2));
};
SC.rayos=function(t,p,cx,cy,R){
  var fl=[0.1,0.28,0.46,0.62],on=-1;
  for(var i=0;i<fl.length;i++){if(p>=fl[i]&&p<fl[i]+0.07)on=i;}
  if(on>=0){
    var k=1-(p-fl[on])/0.07;
    g.fillStyle="rgba(200,205,255,"+(0.35*k)+")";g.fillRect(0,0,W,H);
    seed=on*977+13;
    for(var n=0;n<3;n++){var x0=W*(0.15+rnd()*0.7);bolt(x0,-10,cx+(rnd()-0.5)*R*0.8,cy-R*0.2,H*0.12,n?ARC:GOLD,n?3:5,k);}
  }
  if(p>0.18)drawLogo(cx,cy,R*0.38*ease((p-0.18)*2.4),ease((p-0.18)*2.4));
  if(p>0.7){seed=Math.floor(t/90)*31+7;for(var m=0;m<4;m++){var a=rnd()*6.28;bolt(cx+Math.cos(a)*R*0.4,cy+Math.sin(a)*R*0.4,cx+Math.cos(a)*R*(0.7+rnd()*0.3),cy+Math.sin(a)*R*(0.7+rnd()*0.3),R*0.15,ARC,2,0.8);}}
};
SC.bobina=function(t,p,cx,cy,R){
  var a=ease(p*2.5),f=Math.floor(t/70),N=9;
  glow(cx,cy,R*1.3,ARC,0.18*a);
  for(var i=0;i<N;i++){
    seed=f*13+i*101+5;
    var ang=i*6.283/N+t*0.0006+rnd()*0.3,len=R*(0.75+rnd()*0.4)*a;
    var x1=cx+Math.cos(ang)*len,y1=cy+Math.sin(ang)*len;
    bolt(cx,cy,x1,y1,R*0.22,i%3?ARC:GOLD,2.5,0.9*a);
    if(rnd()>0.5){var mx=(cx+x1)/2,my=(cy+y1)/2,ba=ang+(rnd()-0.5)*1.6;bolt(mx,my,mx+Math.cos(ba)*len*0.35,my+Math.sin(ba)*len*0.35,R*0.1,ARC,1.5,0.7*a);}
  }
  drawLogo(cx,cy,R*0.3*ease(p*2.2),ease(p*2.2));
};
SC.energia=function(t,p,cx,cy,R){
  var a=ease(p*2.5);
  for(var i=0;i<9;i++){var q=i/8,base=H*0.16+(H*0.68)*q;g.beginPath();for(var x=-10;x<=W+10;x+=10){var y=base+Math.sin(x/W*4.2+i*0.55+t*0.0012)*(14+q*24)+Math.sin(x/W*9.5-i*1.2-t*0.0008)*5;if(x===-10)g.moveTo(x,y);else g.lineTo(x,y);}g.strokeStyle="rgba(169,173,255,"+(0.1+q*0.16)*a+")";g.lineWidth=1.5;g.stroke();}
  var amp=26*a;g.beginPath();for(var x2=-10;x2<=W+10;x2+=6){var y2=cy+Math.sin(x2/W*4.2+t*0.002)*amp+Math.sin(x2/W*9.5-t*0.003)*amp*0.25;if(x2===-10)g.moveTo(x2,y2);else g.lineTo(x2,y2);}
  g.save();g.shadowColor=GOLD;g.shadowBlur=24;g.strokeStyle=GOLD;g.lineWidth=4;g.globalAlpha=a;g.stroke();g.restore();
  var px=((t*0.0006)%1)*W;glow(px,cy+Math.sin(px/W*4.2+t*0.002)*amp+Math.sin(px/W*9.5-t*0.003)*amp*0.25,26,"#fff",a);
  drawLogo(cx,cy-R*0.62,R*0.3*ease(p*2.2),ease(p*2.2));
};
var PARTS=null;
SC.chispas=function(t,p,cx,cy,R){
  if(!PARTS){seed=21;PARTS=[];for(var i=0;i<110;i++){PARTS.push({a:rnd()*6.283,v:0.25+rnd()*0.85,s:1.5+rnd()*3.5,d:rnd()*0.22,c:[GOLD,ARC,RED,"#fff"][i%4]});}}
  var ring=ease(p*2.4);glow(cx,cy,R*(0.5+ring*0.8),GOLD,0.18*(1-p*0.5));
  for(var i2=0;i2<PARTS.length;i2++){var q=PARTS[i2],age=Math.max(0,p-0.08-q.d)/0.62;if(age<=0||age>=1)continue;var dist=ease(age)*R*1.9*q.v,x=cx+Math.cos(q.a)*dist,y=cy+Math.sin(q.a)*dist+age*age*R*0.35;glow(x,y,q.s*5,q.c,1-age);}
  drawLogo(cx,cy,R*0.38*ease((p-0.05)*2.2),ease((p-0.05)*2.2));
};
var scene=SC[C.anim]||SC.atomo,t0=0;
var cover=document.getElementById("cover");
function frame(now){
  if(!t0)t0=now;
  var t=fz>=0?fz:now-t0,p=Math.min(1,t/C.ms);
  var bg=g.createLinearGradient(0,0,W,H);bg.addColorStop(0,"#0D1230");bg.addColorStop(1,"#141A42");g.fillStyle=bg;g.fillRect(0,0,W,H);
  var cx=W/2,cy=H*0.43,R=Math.min(W*0.36,H*0.3);
  scene(t,p,cx,cy,R);
  if(t>C.ms-250)cover.style.opacity=String(Math.min(1,(t-(C.ms-250))/250));
  if(fz>=0)return;
  if(t>=C.ms)go();else requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();`;

export function qrSplashResponse({ anim, dest, name, line, seconds, logo }: SplashOptions) {
  const ms = Math.round(Math.min(6, Math.max(1.5, seconds)) * 1000);
  const cfg = JSON.stringify({ anim, dest, logo, ms }).replace(/</g, "\\u003c");
  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${esc(name)}</title>
<noscript><meta http-equiv="refresh" content="1;url=${esc(dest)}"></noscript>
<style>
html,body{margin:0;height:100%;background:#0D1230;overflow:hidden;font-family:"Bricolage Grotesque",system-ui,-apple-system,"Segoe UI",sans-serif;color:#fff}
canvas{position:fixed;inset:0;width:100%;height:100%;display:block}
.txt{position:fixed;left:0;right:0;bottom:13%;text-align:center;padding:0 24px;animation:in .9s .5s both}
h1{margin:0;font-size:clamp(26px,7vw,44px);letter-spacing:.04em;text-transform:uppercase;font-weight:800}
p{margin:8px 0 0;color:#FFB627;font-size:clamp(16px,4.4vw,22px);font-weight:600}
.bar{position:fixed;left:0;bottom:0;height:4px;background:#FFB627;box-shadow:0 0 12px #FFB627;width:0;animation:bar ${ms}ms linear forwards}
#skip{position:fixed;top:14px;right:14px;background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:8px 16px;font:600 14px system-ui,sans-serif;cursor:pointer}
#cover{position:fixed;inset:0;background:#0D1230;opacity:0;pointer-events:none}
@keyframes in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes bar{to{width:100%}}
@media (prefers-reduced-motion:reduce){.txt,.bar{animation:none}.txt{opacity:1}}
</style></head><body>
<canvas id="c"></canvas>
<div class="txt"><h1>${esc(name)}</h1><p>${esc(line)}</p></div>
<div class="bar"></div><button id="skip" type="button">Saltar ›</button><div id="cover"></div>
<script>${SCRIPT.replace("__CFG__", () => cfg)}</script>
</body></html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}
