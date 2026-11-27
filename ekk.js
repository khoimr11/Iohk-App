/* IOHK Film Lab — thư viện dùng chung cho Ảnh và Video Pro (bản "Edit Không Khó", 27/11).
   Trời (tách trời + chấm trời / thay trời), giữ một màu, đơn sắc, mặt nước, gương, chuyển cảnh mực / sương / mưa,
   khử nhiễu theo thời gian, phụ đề (Whisper chạy trên máy), dải phim 35mm. Mọi thứ chạy trên máy người dùng. */
(function(){
"use strict";
const EKK={};
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const sstep=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
EKK.clamp=clamp;EKK.sstep=sstep;

/* ================= WebGL nhỏ: một context riêng, chạy shader trên ảnh, trả về canvas ================= */
const GL={g:null,cv:null,progs:new Map(),fail:false};
const VS="attribute vec2 p;varying vec2 v;void main(){v=p*0.5+0.5;gl_Position=vec4(p,0.0,1.0);}";
const HDR="#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v;\n"+
 "float lum(vec3 c){return dot(c,vec3(0.2126,0.7152,0.0722));}\n"+
 "float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}\n"+
 "float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(h21(i),h21(i+vec2(1.0,0.0)),f.x),mix(h21(i+vec2(0.0,1.0)),h21(i+vec2(1.0,1.0)),f.x),f.y);}\n"+
 "float fbm(vec2 p){float a=0.5,s=0.0;for(int i=0;i<6;i++){s+=a*vn(p);p=p*2.02+vec2(1.7,9.2);a*=0.5;}return s;}\n"+
 "vec3 hsv(vec3 c){vec4 K=vec4(0.0,-1.0/3.0,2.0/3.0,-1.0);vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));float d=q.x-min(q.w,q.y);return vec3(abs(q.z+(q.w-q.y)/(6.0*d+1.0e-10)),d/(q.x+1.0e-10),q.x);}\n";
function glInit(){if(GL.g||GL.fail)return GL.g;try{const cv=document.createElement("canvas");cv.width=cv.height=4;
  const g=cv.getContext("webgl",{alpha:true,premultipliedAlpha:false,preserveDrawingBuffer:true,antialias:false});if(!g){GL.fail=true;return null;}
  const b=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,b);g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),g.STATIC_DRAW);
  g.pixelStorei(g.UNPACK_ALIGNMENT,1);GL.g=g;GL.cv=cv;GL.pool=[];GL.buf=b;}catch(e){GL.fail=true;}return GL.g;}
function glProg(name,fs){let p=GL.progs.get(name);if(p)return p;const g=GL.g;const sh=(t,s)=>{const o=g.createShader(t);g.shaderSource(o,s);g.compileShader(o);if(!g.getShaderParameter(o,g.COMPILE_STATUS))throw new Error("shader "+name+": "+g.getShaderInfoLog(o));return o;};
  const pr=g.createProgram();g.attachShader(pr,sh(g.VERTEX_SHADER,VS));g.attachShader(pr,sh(g.FRAGMENT_SHADER,HDR+fs));g.bindAttribLocation(pr,0,"p");g.linkProgram(pr);
  if(!g.getProgramParameter(pr,g.LINK_STATUS))throw new Error("link "+name);p={pr,u:new Map()};GL.progs.set(name,p);return p;}
function glTex(i){const g=GL.g;let t=GL.pool[i];if(!t){t=g.createTexture();g.bindTexture(g.TEXTURE_2D,t);[g.TEXTURE_MIN_FILTER,g.TEXTURE_MAG_FILTER].forEach(k=>g.texParameteri(g.TEXTURE_2D,k,g.LINEAR));
  [g.TEXTURE_WRAP_S,g.TEXTURE_WRAP_T].forEach(k=>g.texParameteri(g.TEXTURE_2D,k,g.CLAMP_TO_EDGE));GL.pool[i]=t;}return t;}
/* src: canvas / image / video / VideoFrame, hoặc {w,h,data:Uint8Array(RGBA)} */
function glUpload(i,src){const g=GL.g;g.activeTexture(g.TEXTURE0+i);g.bindTexture(g.TEXTURE_2D,glTex(i));g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,true);
  if(src&&src.data&&src.w)g.texImage2D(g.TEXTURE_2D,0,g.RGBA,src.w,src.h,0,g.RGBA,g.UNSIGNED_BYTE,src.data);else g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,src);
  g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,false);}
/* chạy shader: texs = [[tên uniform, nguồn], …]; uni = {tên: số | mảng}; trả về canvas dùng chung (vẽ ngay, đừng giữ) */
function glRun(name,fs,W,H,texs,uni){if(!glInit())return null;const g=GL.g,p=glProg(name,fs);W=Math.max(1,W|0);H=Math.max(1,H|0);
  if(GL.cv.width!==W||GL.cv.height!==H){GL.cv.width=W;GL.cv.height=H;}g.viewport(0,0,W,H);g.useProgram(p.pr);
  const U=k=>{if(!p.u.has(k))p.u.set(k,g.getUniformLocation(p.pr,k));return p.u.get(k);};
  (texs||[]).forEach(([k,src],i)=>{glUpload(i,src);g.uniform1i(U(k),i);});
  for(const k in uni||{}){const v=uni[k],l=U(k);if(l==null)continue;if(typeof v==="number")g.uniform1f(l,v);else if(v.length===2)g.uniform2fv(l,v);else if(v.length===3)g.uniform3fv(l,v);else if(v.length===4)g.uniform4fv(l,v);}
  g.uniform2fv(U("u_res"),[W,H]);g.bindBuffer(g.ARRAY_BUFFER,GL.buf);g.enableVertexAttribArray(0);g.vertexAttribPointer(0,2,g.FLOAT,false,0,0);
  g.clearColor(0,0,0,0);g.clear(g.COLOR_BUFFER_BIT);g.drawArrays(g.TRIANGLE_STRIP,0,4);g.activeTexture(g.TEXTURE0);return GL.cv;}
EKK.gl={init:glInit,run:glRun,ok:()=>!!glInit()};
function mk(w,h){const c=document.createElement("canvas");c.width=Math.max(1,w|0);c.height=Math.max(1,h|0);return c;}
function copyCv(src,o){const [w,h]=dimsOf(src);o=o||mk(w,h);if(o.width!==w||o.height!==h){o.width=w;o.height=h;}const x=o.getContext("2d");x.globalCompositeOperation="copy";x.drawImage(src,0,0);x.globalCompositeOperation="source-over";return o;}
EKK.mk=mk;EKK.copyCv=copyCv;
function dimsOf(s){return [s.displayWidth||s.videoWidth||s.naturalWidth||s.width,s.displayHeight||s.videoHeight||s.naturalHeight||s.height];}
EKK.dimsOf=dimsOf;

/* ================= TRỜI: tách vùng trời ================= */
/* phân tích ở độ phân giải thấp: vùng sáng, ít vân, nối liền với mép trên, màu gần màu trời ở mép trên.
   Trả về {w,h,m (0..1), found, hz, sky:[r,g,b], L} — m là mask thô, phần mép tinh chỉnh trên GPU ở độ phân giải đầy đủ. */
const AN={c:null,x:null};
function anCanvas(w,h){if(!AN.c){AN.c=mk(w,h);AN.x=AN.c.getContext("2d",{willReadFrequently:true});}if(AN.c.width!==w||AN.c.height!==h){AN.c.width=w;AN.c.height=h;}return AN.x;}
function boxBlur(a,w,h,r,out){out=out||new Float32Array(a.length);const tmp=new Float32Array(a.length);r=Math.max(1,r|0);
  for(let y=0;y<h;y++){let s=0;const o=y*w;for(let x=-r;x<=r;x++)s+=a[o+clamp(x,0,w-1)];for(let x=0;x<w;x++){tmp[o+x]=s/(2*r+1);s+=a[o+clamp(x+r+1,0,w-1)]-a[o+clamp(x-r,0,w-1)];}}
  for(let x=0;x<w;x++){let s=0;for(let y=-r;y<=r;y++)s+=tmp[clamp(y,0,h-1)*w+x];for(let y=0;y<h;y++){out[y*w+x]=s/(2*r+1);s+=tmp[clamp(y+r+1,0,h-1)*w+x]-tmp[clamp(y-r,0,h-1)*w+x];}}return out;}
EKK.boxBlur=boxBlur;
function skyAnalyze(src,opt){opt=opt||{};const [sw,sh]=dimsOf(src);if(!sw||!sh)return null;const S=opt.size||240,k=S/Math.max(sw,sh),w=Math.max(16,Math.round(sw*k)),h=Math.max(16,Math.round(sh*k)),n=w*h;
  const x=anCanvas(w,h);x.imageSmoothingQuality="high";x.drawImage(src,0,0,w,h);const d=x.getImageData(0,0,w,h).data;
  const R=new Float32Array(n),G=new Float32Array(n),B=new Float32Array(n),L=new Float32Array(n),Tx=new Float32Array(n);
  for(let i=0,j=0;i<n;i++,j+=4){R[i]=d[j]/255;G[i]=d[j+1]/255;B[i]=d[j+2]/255;L[i]=.2126*R[i]+.7152*G[i]+.0722*B[i];}
  for(let y=0;y<h;y++)for(let xx=0;xx<w;xx++){const i=y*w+xx,l=L[y*w+Math.max(0,xx-1)],r=L[y*w+Math.min(w-1,xx+1)],u=L[Math.max(0,y-1)*w+xx],dn=L[Math.min(h-1,y+1)*w+xx];Tx[i]=Math.abs(r-l)+Math.abs(dn-u);}
  const T=boxBlur(Tx,w,h,1);
  /* hạt giống: vài hàng trên cùng, sáng và ít vân */
  const rows=Math.max(2,Math.round(h*.05)),cand=[];for(let y=0;y<rows;y++)for(let xx=0;xx<w;xx++){const i=y*w+xx;if(L[i]>.3&&T[i]<.07)cand.push(i);}
  const res={w,h,m:new Float32Array(n),found:false,hz:0,sky:[.8,.82,.85],L:.8,R,G,B,Lum:L};
  /* thêm hạt giống từ các mảng lớn, sáng, ít vân chạm vào phần tư trên (trời bị dây điện, tán cây che mép trên) */
  {const Ls=Array.from(L).sort((a,b)=>a-b),p90=Ls[Math.floor(n*.9)],lab=new Int32Array(n).fill(-1),yl=Math.round(h*.6),st=[];let id=0;
    for(let s0=0;s0<w*yl;s0++){if(lab[s0]>=0||!(L[s0]>.3&&T[s0]<.07))continue;const comp=[];lab[s0]=id;st.push(s0);let minY=h,sl=0;
      while(st.length){const i=st.pop(),xx=i%w,y=(i/w)|0;comp.push(i);sl+=L[i];if(y<minY)minY=y;for(const j of [xx>0?i-1:-1,xx<w-1?i+1:-1,y>0?i-w:-1,y<yl-1?i+w:-1]){if(j<0||lab[j]>=0||!(L[j]>.3&&T[j]<.07))continue;lab[j]=id;st.push(j);}}
      id++;if(minY<h*.25&&comp.length>=n*.012&&sl/comp.length>=Math.max(.45,p90*.85))comp.forEach(i=>{if(i<w*Math.round(h*.35))cand.push(i);});}}
  if(cand.length<rows*w*.1){res.why='seeds '+cand.length;return res;}
  const med=a=>{const s=cand.map(i=>a[i]).sort((p,q)=>p-q);return s[s.length>>1];};const mr=med(R),mg=med(G),mb=med(B),ml=med(L);
  const msat=(Math.max(mr,mg,mb)-Math.min(mr,mg,mb))/(Math.max(mr,mg,mb)+1e-3);
  if(mb<mr*.95&&msat>.07){res.why='warm';return res;}            /* trần nhà ấm, đèn vàng: không phải trời */
  let lsum=0;for(let i=0;i<n;i++)lsum+=L[i];if(!opt.force){if(ml<lsum/n+.04||ml<.45){res.why='dim';return res;}const ls=Array.from(L).sort((a,b)=>a-b);if(ml<ls[Math.floor(n*.9)]*.9){res.why='p90';return res;}}
  const sky=new Uint8Array(n),q=new Int32Array(n);let qn=0;
  const okPx=i=>T[i]<.085&&L[i]>ml*.55&&Math.abs((R[i]-G[i])-(mr-mg))+Math.abs((B[i]-G[i])-(mb-mg))<.3;
  const ok=new Uint8Array(n);for(let i=0;i<n;i++)ok[i]=okPx(i)?1:0;
  /* cầu qua vật mảnh (dây điện, cành nhỏ): ô không đạt nhưng hai bên đối diện đều là trời giống nhau */
  const br=new Uint8Array(n);for(let y=4;y<h-4;y++)for(let xx=4;xx<w-4;xx++){const i=y*w+xx;if(ok[i])continue;
    for(const [dx,dy] of [[1,0],[0,1],[1,1],[1,-1]]){let hit=false;for(let r=2;r<=4&&!hit;r++){const a=i-(dx+dy*w)*r,b=i+(dx+dy*w)*r;if(ok[a]&&ok[b]&&Math.abs(L[a]-L[b])<.06)hit=true;}if(hit){br[i]=1;break;}}}
  cand.forEach(i=>{if(ok[i]&&!sky[i]){sky[i]=1;q[qn++]=i;}});
  while(qn){const i=q[--qn],xx=i%w,y=(i/w)|0;const nb=[xx>0?i-1:-1,xx<w-1?i+1:-1,y>0?i-w:-1,y<h-1?i+w:-1];
    for(const j of nb){if(j<0||sky[j])continue;if(br[j]){if(!br[i]||ok[i]){sky[j]=3;q[qn++]=j;}continue;}if(!ok[j])continue;
      if(!br[i]){if(Math.abs(L[j]-L[i])>.05)continue;if(Math.abs(R[j]-R[i])+Math.abs(G[j]-G[i])+Math.abs(B[j]-B[i])>.09)continue;}sky[j]=1;q[qn++]=j;}}
  /* trong mỗi cột: dưới một dải không phải trời dày hơn 4% chiều cao thì không còn là trời (chặn tràn xuống mặt nước) */
  const gap=Math.max(3,Math.round(h*.04));for(let xx=0;xx<w;xx++){let run=0,cut=false;for(let y=0;y<h;y++){const i=y*w+xx;if(cut){sky[i]=0;continue;}if(sky[i])run=0;else if(++run>=gap&&y-run>h*.3)cut=true;}}
  /* lấp lỗ nhỏ trong trời (chim, dây điện, mây có vân) */
  const seen=new Uint8Array(n);const lim=n*.012;
  for(let s=0;s<n;s++){if(sky[s]||seen[s])continue;const comp=[s];seen[s]=1;let edge=false,hd=0;const st=[s];while(st.length){const i=st.pop(),xx=i%w,y=(i/w)|0;if(y>=h-1||xx===0||xx===w-1)edge=true;
      for(const j of [xx>0?i-1:-1,xx<w-1?i+1:-1,y>0?i-w:-1,y<h-1?i+w:-1]){if(j<0||sky[j]||seen[j])continue;seen[j]=1;comp.push(j);st.push(j);}if(comp.length>n*.06)hd=1;}
    let ml2=0,mt=0;comp.forEach(i=>{ml2+=L[i];mt+=T[i];});ml2/=comp.length;mt/=comp.length;const bright=ml2>ml*.72&&mt<.06;
    if(!edge&&(bright?comp.length<=n*.06:(!hd&&comp.length<=lim)))comp.forEach(i=>{sky[i]=2;});}
  let cnt=0;for(let i=0;i<n;i++){if(sky[i])cnt++;}
  if(cnt<n*.025){res.why='small '+cnt;return res;}{let tp=0;for(let i=0;i<w*2;i++)if(sky[i])tp++;if(tp<w*2*.05){res.why='top';return res;}}
  const m=res.m;for(let i=0;i<n;i++)m[i]=sky[i]?1:0;
  /* đường chân trời: phân vị 85 đáy trời theo từng cột */
  const bots=[];for(let xx=0;xx<w;xx++){let b=-1;for(let y=0;y<h;y++)if(sky[y*w+xx])b=y;if(b>=0)bots.push((b+1)/h);}bots.sort((a,b)=>a-b);
  res.hz=bots.length?bots[Math.floor(bots.length*.85)]:.3;let sr=0,sg=0,sb=0,sl=0;for(let i=0;i<n;i++)if(sky[i]===1){sr+=R[i];sg+=G[i];sb+=B[i];sl+=L[i];}
  const c1=Math.max(1,cnt);res.sky=[sr/c1,sg/c1,sb/c1];res.L=sl/c1;res.found=true;res.cover=cnt/n;return res;}
/* gói thông tin cho shader: R = mask thô (làm mượt), G = độ sáng trời cục bộ, B = độ sáng cảnh cục bộ, A = dải mép (vùng cần tinh chỉnh) */
function skyAux(an,feather){const {w,h,m,Lum}=an,n=w*h,r=Math.max(2,Math.round(Math.max(w,h)*.022*(0.6+feather)));
  const ms=boxBlur(m,w,h,1),num=new Float32Array(n),num2=new Float32Array(n),inv=new Float32Array(n);
  for(let i=0;i<n;i++){num[i]=Lum[i]*m[i];inv[i]=1-m[i];num2[i]=Lum[i]*inv[i];}
  const bm=boxBlur(m,w,h,r),bL=boxBlur(num,w,h,r),bi=boxBlur(inv,w,h,r),bF=boxBlur(num2,w,h,r);
  const bw=boxBlur(m,w,h,Math.max(1,Math.round(r*.7)));
  const out=new Uint8Array(n*4);const skyL=an.L;
  for(let i=0;i<n;i++){const ls=bm[i]>.02?bL[i]/bm[i]:skyL,lf=bi[i]>.02?bF[i]/bi[i]:Math.min(skyL*.6,.5);const band=clamp(1-Math.abs(bw[i]*2-1)*1.05,0,1);
    out[i*4]=Math.round(ms[i]*255);out[i*4+1]=Math.round(clamp(ls,0,1)*255);out[i*4+2]=Math.round(clamp(lf,0,1)*255);out[i*4+3]=Math.round(Math.sqrt(band)*255);}
  return {w,h,data:out};}
EKK.skyAnalyze=skyAnalyze;EKK.skyAux=skyAux;
/* trung bình theo thời gian (video): trộn mask thô với các mask lân cận đã có */
EKK.skyBlend=function(cur,neigh){if(!neigh.length)return cur;const n=cur.m.length,m=new Float32Array(n);let wsum=1;for(let i=0;i<n;i++)m[i]=cur.m[i];
  neigh.forEach(o=>{if(!o||o.w!==cur.w||o.h!==cur.h)return;const wt=o.wt||.5;wsum+=wt;for(let i=0;i<n;i++)m[i]+=o.m[i]*wt;});for(let i=0;i<n;i++)m[i]/=wsum;
  return Object.assign({},cur,{m});};

const SKY_FS=`uniform sampler2D u_I,u_A;uniform vec2 u_res;uniform float u_mode,u_amt,u_fea,u_match,u_hz,u_seed,u_time,u_show,u_skyL;uniform vec3 u_sky;
float cloud(vec2 q){vec2 w=vec2(fbm(q+vec2(0.0,u_time*0.02)),fbm(q+vec2(5.2,1.3)));return fbm(q+1.6*w);}
void main(){vec2 uv=vec2(v.x,1.0-v.y);vec4 I4=texture2D(u_I,v);vec3 c=I4.rgb;vec4 A=texture2D(u_A,v);float Lp=lum(c);
 float key=clamp((Lp-A.b)/max(A.g-A.b,0.035),0.0,1.0);float lo=0.18+0.12*(1.0-u_fea),hi=0.82-0.1*(1.0-u_fea);key=smoothstep(lo,hi,key);
 vec3 cn=c/max(Lp,0.02),sn=u_sky/max(u_skyL,0.02);float cs=1.0-smoothstep(0.14,0.34,length(cn-sn));
 float a=mix(A.r,A.r*0.25+key*cs*0.75+key*cs*0.25*A.r,A.a);a=clamp(a,0.0,1.0);
 if(u_show>0.5){gl_FragColor=vec4(vec3(a),1.0);return;}
 float asp=u_res.x/u_res.y,hz=max(u_hz,0.12);float g=clamp(uv.y/hz,0.0,1.0);
 vec3 sky=c;vec3 fg=c;
 if(u_mode<1.5){/* làm đậm trời: lấy lại vân mây, nén vùng sáng, lọc ND chuyển sắc */
  float base=A.g;float det=Lp-base;float nl=u_skyL*0.86+(base-u_skyL)*1.35+det*2.1;nl*=1.0-0.28*pow(1.0-g,1.25);
  vec3 tint=u_mode<0.5?vec3(0.93,0.97,1.05):mix(vec3(0.95,0.9,1.04),vec3(1.1,0.93,0.8),pow(g,1.6));
  vec3 ch=mix(cn,vec3(1.0),0.35)*tint;sky=ch*nl;sky=sky/(1.0+max(sky-0.9,0.0)*2.0);
  sky=mix(c,sky,u_amt);
  if(u_mode>0.5)fg=c*mix(vec3(1.0),vec3(1.02,0.98,0.94),u_match*u_amt*0.6);}
 else{/* thay trời: mây mềm hoặc chạng vạng, tự vẽ */
  float y=g;vec2 q=vec2((uv.x-0.5)*asp/(0.35+0.65*(1.0-y)+0.25),uv.y/(0.18+hz))*2.2+vec2(u_seed,u_seed*0.37);
  vec3 top,hor,cl;float k;
  if(u_mode<2.5){top=vec3(0.5,0.6,0.71);hor=vec3(0.85,0.87,0.88);sky=mix(top,hor,pow(y,1.3));
   vec2 cq=q*vec2(0.55,1.1);float f=cloud(cq);k=smoothstep(0.3,0.62,f)*(0.6+0.4*(1.0-y));float f2=cloud(cq+vec2(0.0,0.09));float lit=clamp((f-f2)*4.0+0.6,0.0,1.0);
   cl=mix(vec3(0.7,0.72,0.76),vec3(0.95,0.95,0.94),lit);sky=mix(sky,cl,k*0.8);}
  else{top=vec3(0.27,0.3,0.41);vec3 mid=vec3(0.6,0.53,0.6);hor=vec3(0.93,0.77,0.63);sky=y<0.62?mix(top,mid,pow(y/0.62,1.15)):mix(mid,hor,pow((y-0.62)/0.38,0.95));
   float f=fbm(q*vec2(0.5,2.6));k=smoothstep(0.5,0.76,f)*(0.3+0.7*y);cl=mix(vec3(0.38,0.33,0.4),vec3(0.9,0.67,0.56),pow(y,1.8));sky=mix(sky,cl,k*0.55);
   sky+=vec3(1.0,0.78,0.55)*exp(-pow((uv.x-0.64)*asp*1.4,2.0)-pow((1.0-y)*3.2,2.0))*0.12;}
  sky+=(Lp-A.g)*0.22;sky+=(h21(uv*u_res+u_seed)-0.5)*0.012;
  float haze=smoothstep(0.55,1.0,y);sky=mix(sky,mix(sky,vec3(u_skyL)*mix(vec3(1.0),hor/max(lum(hor),0.1),0.5),0.5),haze*0.45);
  sky=mix(c,sky,u_amt);
  vec3 sm=u_mode<2.5?vec3(0.82,0.86,0.9):vec3(0.95,0.72,0.6);vec3 rat=(sm/max(lum(sm),0.1))/max(sn,vec3(0.1));
  fg=c*mix(vec3(1.0),rat,0.18*u_match*u_amt);if(u_mode>2.5)fg*=(1.0-0.2*u_match*u_amt)*mix(vec3(1.0),vec3(1.04,0.97,0.9),u_match*u_amt);
  float wrap=A.a*(1.0-a)*0.22*u_match*u_amt;fg=mix(fg,sky,wrap);}
 gl_FragColor=vec4(clamp(mix(fg,sky,a),0.0,1.0),I4.a);}`;
const SKY_MODES={deepen:0,dusktint:1,clouds:2,dusk:3};EKK.SKY_MODES=SKY_MODES;
/* áp trời lên một khung: src (canvas/frame), an (kết quả skyAnalyze, có thể đã trộn theo thời gian), o={mode,amt,feather,match,seed,time,show} → canvas dùng chung */
EKK.skyRender=function(src,an,o,W,H){if(!an||!an.found)return null;const [sw,sh]=dimsOf(src);W=W||sw;H=H||sh;const aux=skyAux(an,o.feather==null?.5:o.feather);
  return glRun("sky",SKY_FS,W,H,[["u_I",src],["u_A",aux]],{u_mode:SKY_MODES[o.mode]!=null?SKY_MODES[o.mode]:+o.mode||0,u_amt:o.amt==null?.8:o.amt,u_fea:o.feather==null?.5:o.feather,u_match:o.match==null?.6:o.match,
    u_hz:an.hz,u_seed:(o.seed||7)%13*1.37,u_time:o.time||0,u_show:o.show?1:0,u_sky:an.sky,u_skyL:an.L});};
/* chỉ lấy mask (để kiểm tra): mảng 0..255 ở W×H */
EKK.skyMaskPixels=function(src,W,H,o){const an=skyAnalyze(src,o);if(!an.found)return {found:false};const cv=EKK.skyRender(src,an,Object.assign({mode:"deepen",show:1},o||{}),W,H);
  const t=mk(W,H),x=t.getContext("2d",{willReadFrequently:true});x.drawImage(cv,0,0);const d=x.getImageData(0,0,W,H).data,a=new Uint8Array(W*H);for(let i=0;i<a.length;i++)a[i]=d[i*4];return {found:true,a,an};};

/* ================= Giữ một màu, đơn sắc, mặt nước, gương (một shader cho cả nhóm) ================= */
const LOOK_FS=`uniform sampler2D u_I;uniform vec2 u_res;uniform float u_sp,u_hue,u_hw,u_soft,u_ssat,u_mono,u_mamt,u_rf,u_ry,u_rr,u_rd,u_time,u_mir,u_mfea;uniform vec3 u_ink,u_mid,u_paper;
vec3 monoMap(float l){l=clamp(l,0.0,1.0);return l<0.5?mix(u_ink,u_mid,l*2.0):mix(u_mid,u_paper,(l-0.5)*2.0);}
void main(){vec2 uv=vec2(v.x,1.0-v.y);vec2 st=uv;float asp=u_res.x/u_res.y;
 if(u_mir>0.5){float f=max(u_mfea,0.0001);if(u_mir<1.5){st.x=uv.x<0.5?uv.x:1.0-uv.x;}else if(u_mir<2.5){st.y=uv.y<0.5?uv.y:1.0-uv.y;}else{st.x=uv.x<0.5?uv.x:1.0-uv.x;st.y=uv.y<0.5?uv.y:1.0-uv.y;}}
 float refl=0.0;vec2 ss=st;
 if(u_rf>0.5&&st.y>u_ry){float dy=st.y-u_ry;float amp=u_rr*(0.002+dy*0.03);float w1=sin(dy*260.0/(0.3+dy*4.0)-u_time*2.2+fbm(vec2(st.x*6.0,dy*30.0))*4.0);
  vec2 off=vec2(w1*amp*0.6+(fbm(vec2(st.x*3.0*asp,dy*40.0-u_time*0.6))-0.5)*amp*1.6,w1*amp*0.35);ss=vec2(st.x,2.0*u_ry-st.y)+off;ss.y=clamp(ss.y,0.0,u_ry-0.001);refl=1.0;}
 vec3 c=texture2D(u_I,vec2(ss.x,1.0-ss.y)).rgb;
 if(refl>0.5){float dy=st.y-u_ry;vec3 wt=vec3(0.16,0.21,0.22);c=mix(c*(1.0-u_rd*0.55),wt,clamp(u_rd*0.25+dy*0.6*u_rd,0.0,0.75));
  float edge=smoothstep(0.0,0.004,dy);vec3 o=texture2D(u_I,vec2(st.x,1.0-st.y)).rgb;c=mix(o,c,edge);}
 if(u_sp>0.5){vec3 h=hsv(c);float d=abs(fract(h.x-u_hue+0.5)-0.5);float keep=1.0-smoothstep(u_hw,u_hw+u_soft+0.0001,d);keep*=smoothstep(u_ssat*0.5,u_ssat+0.06,h.y)*smoothstep(0.04,0.12,h.z);
  float l=lum(c);vec3 g=vec3(clamp((l-0.5)*1.06+0.5,0.0,1.0));c=mix(g,c,keep);}
 if(u_mono>0.5){float l=lum(c);c=mix(c,monoMap(l),u_mamt);}
 gl_FragColor=vec4(clamp(c,0.0,1.0),1.0);}`;
EKK.MONO={paper:{n:"Giấy kem",ink:"#1C1A17",mid:"#7d7469",paper:"#F3EEE6"},sepia:{n:"Sepia nhạt",ink:"#2a1f17",mid:"#8a6f55",paper:"#efe2cf"},moss:{n:"Xanh rêu",ink:"#1d221b",mid:"#5f6b58",paper:"#e9eadf"},
  indigo:{n:"Chàm",ink:"#141a2a",mid:"#4c5a78",paper:"#e8ebef"},wine:{n:"Đỏ rượu",ink:"#24100f",mid:"#7a3d38",paper:"#f1e4dc"},silver:{n:"Bạc",ink:"#111111",mid:"#77777a",paper:"#ececea"}};
const hex=h=>{h=String(h||"#000").replace("#","");const n=parseInt(h.length===3?h.split("").map(x=>x+x).join(""):h,16);return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];};EKK.hex=hex;
EKK.lookActive=o=>!!o&&!!((o.splash&&o.splash.on)||(o.mono&&o.mono.on)||(o.reflect&&o.reflect.on)||(o.mirror&&o.mirror.on&&o.mirror.on!=="off"));
/* o = {splash:{on,hue(0..1),width(0..1),soft,sat}, mono:{on,tone,amt}, reflect:{on,y,ripple,dark}, mirror:{on:"v"|"h"|"q"}} */
EKK.lookRender=function(src,o,W,H,time){const [sw,sh]=dimsOf(src);W=W||sw;H=H||sh;const sp=o.splash||{},mo=o.mono||{},rf=o.reflect||{},mi=o.mirror||{};const t=EKK.MONO[mo.tone]||EKK.MONO.paper;
  return glRun("look",LOOK_FS,W,H,[["u_I",src]],{u_sp:sp.on?1:0,u_hue:sp.hue||0,u_hw:(sp.width==null?.06:sp.width),u_soft:(sp.soft==null?.05:sp.soft),u_ssat:sp.sat==null?.16:sp.sat,
    u_mono:mo.on?1:0,u_mamt:mo.amt==null?1:mo.amt,u_ink:hex(t.ink),u_mid:hex(t.mid),u_paper:hex(t.paper),u_rf:rf.on?1:0,u_ry:rf.y==null?.55:rf.y,u_rr:rf.ripple==null?.5:rf.ripple,u_rd:rf.dark==null?.45:rf.dark,u_time:time||0,
    u_mir:mi.on==="v"?1:mi.on==="h"?2:mi.on==="q"?3:0,u_mfea:0});};
EKK.hueOf=(r,g,b)=>{r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;if(d<1e-6)return {h:0,s:0,v:mx};let h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h/=6;if(h<0)h+=1;return {h,s:d/(mx+1e-6),v:mx};};

/* ================= Khử nhiễu theo thời gian (trung bình khung, ngưỡng chuyển động) + làm nét ================= */
const DN_FS=`uniform sampler2D u_C,u_P;uniform vec2 u_res;uniform float u_k,u_thr,u_sh,u_has;
void main(){vec2 tx=1.0/u_res;vec3 c=texture2D(u_C,v).rgb;vec3 o=c;
 if(u_has>0.5){vec3 p=texture2D(u_P,v).rgb;vec3 cb=vec3(0.0),pb=vec3(0.0);for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec2 o2=v+vec2(float(i),float(j))*tx*1.5;cb+=texture2D(u_C,o2).rgb;pb+=texture2D(u_P,o2).rgb;}cb/=9.0;pb/=9.0;
  float d=length(cb-pb);float w=u_k*(1.0-smoothstep(u_thr*0.5,u_thr,d));o=mix(c,p,w);}
 if(u_sh>0.001){vec3 b=(texture2D(u_C,v+vec2(tx.x,tx.y)).rgb+texture2D(u_C,v+vec2(-tx.x,tx.y)).rgb+texture2D(u_C,v+vec2(tx.x,-tx.y)).rgb+texture2D(u_C,v-tx).rgb)*0.25;
  vec3 hf=c-b;hf*=smoothstep(0.012,0.04,length(hf));o+=hf*u_sh*1.6;}
 gl_FragColor=vec4(clamp(o,0.0,1.0),1.0);}`;
/* state: {acc:canvas, t} — trả về canvas đã xử lý (được chép vào state.acc) */
EKK.denoise=function(src,state,o,W,H){const [sw,sh]=dimsOf(src);W=W||sw;H=H||sh;const has=state.acc&&state.acc.width===W&&state.acc.height===H&&state.ok;
  const cv=glRun("dn",DN_FS,W,H,[["u_C",src],["u_P",has?state.acc:src]],{u_k:o.amt==null?.6:o.amt*.82,u_thr:o.thr==null?.07:o.thr,u_sh:o.sharp||0,u_has:has?1:0});
  state.acc=copyCv(cv,state.acc);state.ok=true;return state.acc;};

/* ================= Chuyển cảnh: mực tàu loang, sương mờ, giọt mưa loang (GPU) ================= */
const TR_FS=`uniform sampler2D u_A,u_B;uniform vec2 u_res;uniform float u_p,u_kind,u_seed,u_soft;uniform vec3 u_ink,u_fog;
void main(){vec2 uv=vec2(v.x,1.0-v.y);float asp=u_res.x/u_res.y;vec2 q=vec2(uv.x*asp,uv.y);vec3 a=texture2D(u_A,v).rgb,b=texture2D(u_B,v).rgb;vec3 o;
 if(u_kind<0.5){/* mực tàu: các vệt mực loang theo nhiễu, viền mực đậm mảnh */
  vec2 c1=vec2(0.32*asp+h21(vec2(u_seed,1.0))*0.3,0.42+h21(vec2(u_seed,2.0))*0.2),c2=vec2(0.72*asp,0.62);
  float d=min(length(q-c1),length(q-c2)*1.15)/max(asp,1.0);float n=fbm(q*3.2+u_seed)*0.55+fbm(q*11.0-u_seed)*0.18;float f=d*1.25+n*0.75;
  float th=mix(-0.15,1.75,u_p);float s=0.025+u_soft*0.06;float m=1.0-smoothstep(th-s,th,f);float fr=smoothstep(th-s-0.07,th-s*0.5,f)*(1.0-smoothstep(th-s*0.2,th+0.012,f));
  float feather=fbm(q*28.0+u_seed)*0.5;o=mix(a,b,m);o=mix(o,u_ink,clamp(fr*(0.75+feather*0.5),0.0,0.92)*(1.0-smoothstep(0.85,1.0,u_p)));}
 else if(u_kind<1.5){/* sương mờ: một màn sương trôi ngang, dày nhất ở giữa, tan để lộ cảnh mới */
  float drift=u_p*0.6;float n=fbm(vec2(q.x*1.6-drift*3.0,q.y*2.4)+u_seed)*0.7+fbm(vec2(q.x*5.0-drift*6.0,q.y*6.0))*0.3;
  float edge=uv.x*0.6+n*0.8;float th=mix(-0.2,1.6,u_p);float m=smoothstep(th-0.35-u_soft*0.2,th,edge);m=1.0-m;
  float dens=sin(u_p*3.14159);float fogA=clamp(dens*(0.55+n*0.6),0.0,0.92);vec3 base=mix(a,b,m);o=mix(base,mix(u_fog,u_fog*(0.92+n*0.12),0.5),fogA*(0.6+0.4*(1.0-abs(m-0.5)*2.0)));}
 else{/* giọt mưa loang trên kính: giọt nở dần, nhìn qua giọt thấy cảnh mới (khúc xạ nhẹ) */
  float cov=0.0;vec2 off=vec2(0.0);for(int i=0;i<26;i++){float fi=float(i);vec2 pc=vec2(h21(vec2(fi,u_seed))*asp,h21(vec2(u_seed,fi*1.7)));float st=h21(vec2(fi*3.1,u_seed+5.0))*0.55;
   float r=max(0.0,(u_p-st)/(1.0-st));r=r*r*(0.07+h21(vec2(fi,9.0))*0.12)*2.6;vec2 dd=(q-pc)*vec2(1.0,1.08);float dl=length(dd);float m=1.0-smoothstep(r*0.86,r,dl);
   if(m>cov){cov=m;off=dd/max(r,0.001)*(1.0-dl/max(r,0.001))*0.018;}}
  float g=smoothstep(0.82,1.0,u_p);cov=max(cov,g);vec3 bb=texture2D(u_B,v-vec2(off.x/asp,-off.y)).rgb;vec3 ab=a*0.96+vec3(0.01);o=mix(ab,bb,cov);
  float rim=(1.0-g)*smoothstep(0.0,0.4,cov)*(1.0-smoothstep(0.4,0.95,cov));o+=rim*0.06;}
 gl_FragColor=vec4(o,1.0);}`;
EKK.TR_GPU={ink:0,fog:1,rain:2};
EKK.transRender=function(kind,A,B,p,o,W,H){o=o||{};return glRun("tr",TR_FS,W,H,[["u_A",A],["u_B",B]],{u_p:p,u_kind:EKK.TR_GPU[kind],u_seed:(o.seed||3)*1.13,u_soft:o.soft==null?.5:o.soft,u_ink:hex(o.ink||"#16130f"),u_fog:hex(o.fog||"#e9e6df")});};

/* ---- chuyển cảnh vẽ bằng canvas 2D: lật trang, mặt nạ tròn mở lớp, xé giấy ---- */
/* lật trang: trang A lật từ mép phải sang trái, mặt sau là giấy kem, bóng mềm trên trang B */
EKK.pageTurn=function(ctx,W,H,p,A,B,o){o=o||{};const e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;const paper=o.paper||"#F3EEE6";ctx.drawImage(B,0,0);if(e>=.999)return;
  const ang=(o.angle==null?-8:o.angle)*Math.PI/180,D=Math.hypot(W,H);const fx=W*(1-e*1.08)+H*Math.tan(ang)*.5;
  const nx=Math.cos(ang),ny=Math.sin(ang);/* đường gấp: điểm (fx, H/2), pháp tuyến (nx,ny) */
  const fold=(x,y)=>(x-fx)*nx+(y-H/2)*ny;
  ctx.save();ctx.beginPath();const L=[[0,0],[W,0],[W,H],[0,H]];poly(ctx,clipHalf(L,fold,-1));ctx.clip();ctx.drawImage(A,0,0);
  /* bóng trang đang nhấc lên đổ xuống trang A (phía còn lại) */
  ctx.restore();
  const flapW=Math.max(0,W-fx)*.5;
  /* bóng trên B dọc mép gấp */
  ctx.save();ctx.beginPath();poly(ctx,clipHalf(L,fold,1));ctx.clip();const sg=ctx.createLinearGradient(fx,H/2,fx+nx*Math.max(20,flapW*.9),H/2+ny*Math.max(20,flapW*.9));
  sg.addColorStop(0,"rgba(20,16,12,"+(.34*(1-e*.6))+")");sg.addColorStop(1,"rgba(20,16,12,0)");ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);ctx.restore();
  /* nắp trang: phần A bên phải đường gấp phản chiếu qua đường gấp → mặt sau giấy */
  ctx.save();ctx.beginPath();const fl=clipHalf(L,fold,1).map(([x,y])=>{const d=fold(x,y);return [x-2*d*nx,y-2*d*ny];});poly(ctx,fl);ctx.clip();
  ctx.fillStyle=paper;ctx.fillRect(-W,-H,W*3,H*3);
  const g=ctx.createLinearGradient(fx,H/2,fx-nx*Math.max(10,flapW),H/2-ny*Math.max(10,flapW));g.addColorStop(0,"rgba(255,255,255,.0)");g.addColorStop(.35,"rgba(255,252,246,.25)");g.addColorStop(.7,"rgba(60,50,40,.10)");g.addColorStop(1,"rgba(40,32,24,.22)");
  ctx.fillStyle=g;ctx.fillRect(-W,-H,W*3,H*3);ctx.restore();
  /* viền mảnh ở mép gấp */
  ctx.save();ctx.strokeStyle="rgba(28,26,23,.18)";ctx.lineWidth=Math.max(1,Math.min(W,H)/1080);ctx.beginPath();ctx.moveTo(fx-ny*D,H/2+nx*D);ctx.lineTo(fx+ny*D,H/2-nx*D);ctx.stroke();ctx.restore();};
function clipHalf(pts,f,side){const out=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],fa=f(a[0],a[1])*side,fb=f(b[0],b[1])*side;if(fa>=0)out.push(a);
  if(fa*fb<0){const t=fa/(fa-fb);out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}}return out;}
function poly(ctx,P){P.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();}
/* mặt nạ tròn mở lớp: các vòng tròn đồng tâm mở so le, mỗi vòng có đường kẻ kem mảnh */
EKK.irisRings=function(ctx,W,H,p,A,B,o){o=o||{};const N=o.rings||4,R=Math.hypot(W,H)/2,cx=W*(o.cx==null?.5:o.cx),cy=H*(o.cy==null?.5:o.cy),line=o.line||"rgba(243,238,230,.85)",lw=Math.max(1,Math.min(W,H)/900);
  ctx.drawImage(A,0,0);const ez=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  for(let i=N-1;i>=0;i--){const st=i/N*.45,q=ez(clamp((p-st)/.55,0,1));if(q<=0)continue;const r0=R*(i/N),r1=R*((i+1)/N)*1.02;/* vòng i: từ r0 tới r1, mở theo góc */
    const a=q*Math.PI*2;ctx.save();ctx.beginPath();ctx.moveTo(cx+Math.cos(-Math.PI/2)*r0,cy+Math.sin(-Math.PI/2)*r0);ctx.arc(cx,cy,r1,-Math.PI/2,-Math.PI/2+a);ctx.arc(cx,cy,r0,-Math.PI/2+a,-Math.PI/2,true);ctx.closePath();ctx.clip();ctx.drawImage(B,0,0);ctx.restore();
    if(q<1){ctx.save();ctx.globalAlpha=(1-q)*.9;ctx.strokeStyle=line;ctx.lineWidth=lw;ctx.beginPath();ctx.arc(cx,cy,r1,-Math.PI/2,-Math.PI/2+a);ctx.stroke();ctx.restore();}}};
/* xé giấy: khung A đứng hình, xé ngang theo đường răng cưa, hai mảnh trượt ra, mép xé màu giấy kem */
EKK.paperTear=function(ctx,W,H,p,A,B,o){o=o||{};const seed=o.seed||5;const e=p<.12?0:(p-.12)/.88,q=e<.5?2*e*e:1-Math.pow(-2*e+2,2)/2;ctx.drawImage(B,0,0);
  const S=Math.min(W,H),N=64,yb=H*(o.y==null?.52:o.y),pts=[];let r=seed*9301+49297;const rnd=()=>{r=(r*16807)%2147483647;return r/2147483647;};
  for(let i=0;i<=N;i++){const x=W*i/N;pts.push([x,yb+(rnd()-.5)*S*.035+Math.sin(i*.7+seed)*S*.012]);}
  const edge=S*.012,shadow=`rgba(20,16,12,${.35*(1-q)+.15})`;
  const piece=(top)=>{const dy=(top?-1:1)*q*H*.62,rot=(top?-1:1)*q*.06;ctx.save();ctx.translate(W/2,yb);ctx.rotate(rot);ctx.translate(-W/2,-yb+dy);
    ctx.shadowColor=shadow;ctx.shadowBlur=S*.03;ctx.shadowOffsetY=top?-S*.004:S*.006;
    ctx.beginPath();if(top){ctx.moveTo(0,0);ctx.lineTo(W,0);for(let i=N;i>=0;i--)ctx.lineTo(pts[i][0],pts[i][1]+(i%2?edge*.6:edge*.2));}else{ctx.moveTo(0,H);ctx.lineTo(W,H);for(let i=N;i>=0;i--)ctx.lineTo(pts[i][0],pts[i][1]-(i%3?edge*.5:edge*.15));}
    ctx.closePath();ctx.fillStyle=o.paper||"#F3EEE6";ctx.fill();ctx.shadowColor="transparent";
    ctx.beginPath();if(top){ctx.moveTo(0,0);ctx.lineTo(W,0);for(let i=N;i>=0;i--)ctx.lineTo(pts[i][0],pts[i][1]-edge*.35);}else{ctx.moveTo(0,H);ctx.lineTo(W,H);for(let i=N;i>=0;i--)ctx.lineTo(pts[i][0],pts[i][1]+edge*.35);}
    ctx.closePath();ctx.clip();ctx.drawImage(A,0,0);ctx.restore();};
  if(q<1){piece(true);piece(false);}};

/* ================= Tìm chủ thể (dự phòng khi chưa có AI): vùng da + độ tương phản ================= */
EKK.saliency=function(src){const [sw,sh]=dimsOf(src);const S=96,k=S/Math.max(sw,sh),w=Math.max(8,Math.round(sw*k)),h=Math.max(8,Math.round(sh*k));const x=anCanvas(w,h);x.drawImage(src,0,0,w,h);
  const d=x.getImageData(0,0,w,h).data;let sx=0,sy=0,sw2=0,top=h;for(let y=0;y<h;y++)for(let xx=0;xx<w;xx++){const i=(y*w+xx)*4,r=d[i],g=d[i+1],b=d[i+2];
    const skin=r>95&&g>40&&b>20&&r>g&&r>b&&r-Math.min(g,b)>15&&Math.abs(r-g)>12?1:0;const cx=Math.abs(xx/w-.5),wt=skin*(1.2-cx);if(wt>0){sx+=xx*wt;sy+=y*wt;sw2+=wt;if(y<top)top=y;}}
  if(sw2<w*h*.004)return null;return {x:(sx/sw2+.5)/w,y:Math.min((sy/sw2+.5)/h,(top+h*.08)/h+.06),w:sw2};};
/* làm mượt quỹ đạo khung: lấp chỗ trống, vùng chết, Gaussian, giới hạn tốc độ */
EKK.smoothPath=function(a,fps,o){o=o||{};const n=a.length;if(!n)return a;const out=new Array(n);let last=null;for(let i=0;i<n;i++){if(a[i]==null)out[i]=last;else{out[i]=a[i];last=a[i];}}
  let first=out.find(v=>v!=null);if(first==null)first=.5;for(let i=0;i<n&&out[i]==null;i++)out[i]=first;
  const dz=o.dead==null?.04:o.dead;const hold=[];let cur=out[0];for(let i=0;i<n;i++){if(Math.abs(out[i]-cur)>dz)cur=out[i]-Math.sign(out[i]-cur)*dz*.5;hold.push(cur);}
  const sig=Math.max(1,(o.sigma==null?.6:o.sigma)*fps),R=Math.ceil(sig*2.5),res=new Array(n);
  for(let i=0;i<n;i++){let s=0,ws=0;for(let j=-R;j<=R;j++){const k=clamp(i+j,0,n-1),w=Math.exp(-j*j/(2*sig*sig));s+=hold[k]*w;ws+=w;}res[i]=s/ws;}
  const vmax=(o.vmax==null?.35:o.vmax)/fps;for(let i=1;i<n;i++){const d=res[i]-res[i-1];if(Math.abs(d)>vmax)res[i]=res[i-1]+Math.sign(d)*vmax;}return res;};

/* ================= Dải phim 35mm ================= */
/* vẽ dải phim: frames = [canvas…]; o = {dir:"h"|"v", p (0..1 cuộn), zoom (0..1), zi (khung phóng vào), base, edge, label, num0} */
EKK.filmStrip=function(ctx,W,H,frames,o){o=o||{};const vert=o.dir==="v",S=Math.min(W,H),L=vert?H:W;const n=Math.max(1,frames.length);
  const fh=vert?W*.56:H*.5,fw=fh*1.5,gap=fh*.08,bh=fh*.2,stripW=fh+bh*2;/* fw: khung 3:2 dọc theo dải */
  const total=n*(fw+gap);const p=o.p||0,zoom=o.zoom||0,zi=clamp(o.zi==null?n-1:o.zi,0,n-1);
  const startOff=L*1.02,endOff=-total+L*.15;let off=startOff+(endOff-startOff)*p;
  /* khi phóng: căn khung zi vào giữa màn hình rồi phóng để khung lấp đầy */
  const zc=zi*(fw+gap)+fw/2;const offZ=L/2-zc;if(zoom>0)off=off+(offZ-off)*Math.min(1,zoom*1.6);
  const fillK=Math.max(W/(vert?fh:fw),H/(vert?fw:fh))*1.001,zs=1+(fillK-1)*Math.pow(zoom,2.2);
  ctx.save();ctx.fillStyle=o.bg||"#14110e";ctx.fillRect(0,0,W,H);ctx.translate(W/2,H/2);ctx.scale(zs,zs);if(vert)ctx.rotate(Math.PI/2);ctx.translate(-L/2,0);
  const base=o.base||"#2b2520",hole=o.bg||"#14110e",edge=o.edge||"rgba(217,164,92,.78)";
  ctx.fillStyle=base;ctx.fillRect(off-gap-fw,-stripW/2,total+gap+fw*2,stripW);
  /* lỗ răng: 8 lỗ mỗi khung (chuẩn 35mm) */
  const ph=bh*.34,pw=ph*1.35,pitch=(fw+gap)/8,rr=ph*.22;ctx.fillStyle=hole;
  const k0=Math.floor(-off/pitch)-2,k1=Math.ceil((L-off)/pitch)+2;for(let k=k0;k<=k1;k++){const x=off+k*pitch+pitch*.3;[-1,1].forEach(sd=>{const y=sd*(stripW/2-bh*.5)-ph/2;rrect(ctx,x,y,pw,ph,rr);ctx.fill();});}
  /* mã viền và số khung (IBM Plex Mono) */
  const mono='"IBM Plex Mono","JetBrains Mono",ui-monospace,Menlo,monospace';ctx.fillStyle=edge;ctx.font="400 "+Math.max(8,bh*.25).toFixed(1)+"px "+mono;ctx.textBaseline="middle";
  for(let i=0;i<n;i++){const x=off+i*(fw+gap);if(x>L+fw||x+fw<-fw)continue;const num=(o.num0||12)+i;
    ctx.textAlign="left";ctx.fillText(String(num)+(i%2?"A":""),x+fw*.04,stripW/2-bh*.12);ctx.fillText("▸ "+num,x+fw*.55,-stripW/2+bh*.13);
    if(i%3===0){ctx.textAlign="left";ctx.globalAlpha=.8;ctx.fillText(o.label||"IOHK 400  ·  NINH BÌNH  ·  11.2026",x+fw*.18,stripW/2-bh*.12);ctx.globalAlpha=1;}
    const f=frames[i%frames.length];ctx.save();ctx.beginPath();rrect(ctx,x,-fh/2,fw,fh,fh*.025);ctx.clip();ctx.fillStyle="#0c0b0a";ctx.fillRect(x,-fh/2,fw,fh);
    if(f){const [iw,ih]=dimsOf(f);if(vert){ctx.translate(x+fw/2,0);ctx.rotate(-Math.PI/2);const k=Math.max(fh/iw,fw/ih);ctx.drawImage(f,-iw*k/2,-ih*k/2,iw*k,ih*k);}
      else{const k=Math.max(fw/iw,fh/ih);ctx.drawImage(f,x+fw/2-iw*k/2,-ih*k/2,iw*k,ih*k);}}
    ctx.restore();}
  /* ánh sáng nhẹ trên lớp phim, vignette */
  ctx.restore();const vg=ctx.createRadialGradient(W/2,H/2,S*.3,W/2,H/2,Math.hypot(W,H)*.62);vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(0,0,0,"+(.35*(1-zoom))+")");ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  return {zs,frameRect:null};};
function rrect(c,x,y,w,h,r){c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);}

/* ================= Phụ đề: Whisper trên máy, tách dòng dài, khớp lệch theo âm thanh ================= */
const SUB={tr:null,loading:null,model:"onnx-community/whisper-base",url:"https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1",mock:null};
EKK.sub={
  setModel(m){SUB.model=m;SUB.tr=null;SUB.loading=null;},model:()=>SUB.model,
  setMock(fn){SUB.mock=fn;},
  /* tải bộ nhận giọng nói từ kho mô hình (lần đầu ~80–150 MB, trình duyệt giữ lại) */
  async load(onP){if(SUB.mock)return SUB.mock;if(SUB.tr)return SUB.tr;if(SUB.loading)return SUB.loading;
    SUB.loading=(async()=>{const T=await import(SUB.url);const dev=navigator.gpu?"webgpu":"wasm";
      const p=await T.pipeline("automatic-speech-recognition",SUB.model,{device:dev,dtype:dev==="webgpu"?{encoder_model:"fp32",decoder_model_merged:"q4"}:"q8",progress_callback:x=>{if(onP&&x&&x.status==="progress"&&x.total)onP(x.loaded/x.total,x.file);}});
      SUB.tr=p;return p;})().catch(e=>{SUB.loading=null;throw e;});return SUB.loading;},
  /* AudioBuffer → Float32Array 16 kHz mono */
  async to16k(buf){const sr=16000,n=Math.max(1,Math.ceil(buf.duration*sr));const oc=new OfflineAudioContext(1,n,sr);const s=oc.createBufferSource();s.buffer=buf;s.connect(oc.destination);s.start();const r=await oc.startRendering();return r.getChannelData(0);},
  /* chạy nhận giọng nói: trả về [{s,e,text}] */
  async transcribe(pcm,onP){const tr=await EKK.sub.load(onP);const out=await tr(pcm,{language:"vietnamese",task:"transcribe",return_timestamps:true,chunk_length_s:30,stride_length_s:5});
    const ch=(out&&out.chunks)||[];const L=[];ch.forEach(c=>{const ts=c.timestamp||[0,0];const s=+ts[0]||0,e=ts[1]==null?s+2:+ts[1];const t=String(c.text||"").trim();if(t)L.push({s,e:Math.max(e,s+.3),text:t});});
    if(!L.length&&out&&out.text)L.push({s:0,e:pcm.length/16000,text:String(out.text).trim()});return L;},
  /* tách câu dài: tối đa 2 dòng, mỗi dòng ≤ max ký tự; câu quá dài chia thành nhiều phụ đề theo tỉ lệ ký tự */
  split(list,max){max=max||42;const out=[];list.forEach(c=>{const words=String(c.text).replace(/\s+/g," ").trim().split(" ");const lines=[];let cur="";
      words.forEach(w=>{if((cur+" "+w).trim().length>max&&cur){lines.push(cur);cur=w;}else cur=(cur+" "+w).trim();});if(cur)lines.push(cur);
      let groups=[];if(lines.length<=2)groups=[lines];else{/* chia đều số chữ cho các phụ đề, mỗi phụ đề ≤ 2 dòng */const g=Math.ceil(lines.length/2),all=words.join(" ").length,per=all/g;let cur2=[],len=0;
        words.forEach(w=>{if(len+w.length>per&&cur2.length&&groups.length<g-1){groups.push(cur2.join(" "));cur2=[];len=0;}cur2.push(w);len+=w.length+1;});if(cur2.length)groups.push(cur2.join(" "));
        groups=groups.map(t=>{const L=[];let cu="";t.split(" ").forEach(w=>{if((cu+" "+w).trim().length>max&&cu){L.push(cu);cu=w;}else cu=(cu+" "+w).trim();});if(cu)L.push(cu);return L;});}
      const tot=groups.map(g=>g.join("")).join("").length||1;let t=c.s;
      groups.forEach(g=>{const len=g.join("").length,d=(c.e-c.s)*len/tot;out.push({s:t,e:t+d,text:g.join("\n")});t+=d;});});return out;},
  /* nhận biết có giọng nói (năng lượng), 100 khung / giây */
  vad(pcm,sr){const hop=Math.round(sr/100),n=Math.floor(pcm.length/hop),e=new Float32Array(n);for(let i=0;i<n;i++){let s=0;for(let j=0;j<hop;j++){const v=pcm[i*hop+j];s+=v*v;}e[i]=Math.sqrt(s/hop);}
    const srt=Array.from(e).sort((a,b)=>a-b),noise=srt[Math.floor(n*.2)]||0,peak=srt[Math.floor(n*.98)]||0,th=noise+(peak-noise)*.18;const v=new Uint8Array(n);
    for(let i=0;i<n;i++)v[i]=e[i]>th?1:0;/* lấp khoảng ngắt nhỏ */for(let i=1;i<n-1;i++){if(!v[i]){let j=i;while(j<n&&!v[j]&&j-i<15)j++;if(j<n&&v[j]&&i>0&&v[i-1])for(let k=i;k<j;k++)v[k]=1;}}return v;},
  /* tìm độ lệch + co giãn tốt nhất giữa phụ đề và giọng nói */
  align(subs,vad,o){o=o||{};const fps=100,n=vad.length;if(!subs.length||!n)return {shift:0,scale:1,score:0};const t0=subs[0].s;
    const score=(sh,sc)=>{let s=0,cov=0;subs.forEach(c=>{const a=Math.round(((c.s-t0)*sc+t0+sh)*fps),b=Math.round(((c.e-t0)*sc+t0+sh)*fps);for(let i=Math.max(0,a);i<Math.min(n,b);i++){s+=vad[i]?1:-.6;}cov+=b-a;});return s/Math.max(1,cov);};
    let best={shift:0,scale:1,score:score(0,1)};const R=o.range==null?3:o.range;const scales=o.stretch===false?[1]:[.96,.97,.98,.99,1,1.01,1.02,1.03,1.04];
    for(const sc of scales)for(let sh=-R;sh<=R+1e-9;sh+=.02){const s=score(sh,sc);if(s>best.score+1e-9||(Math.abs(s-best.score)<1e-9&&Math.abs(sh)+Math.abs(sc-1)<Math.abs(best.shift)+Math.abs(best.scale-1)))best={shift:Math.round(sh*100)/100,scale:sc,score:s};}
    return best;},
  /* áp độ lệch: t' = (t - t0) * scale + t0 + shift */
  apply(list,shift,scale,t0){scale=scale||1;t0=t0==null?(list[0]?list[0].s:0):t0;return list.map(c=>Object.assign({},c,{s:(c.s-t0)*scale+t0+shift,e:(c.e-t0)*scale+t0+shift}));}
};

window.EKK=EKK;
})();
