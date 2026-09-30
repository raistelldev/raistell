/** Mount the approved film in a React-owned island. No external services or storage.
 * @param {HTMLElement} root
 */
export function mountProjectFilm(root) {
  const canvas=root.querySelector('canvas'), g=canvas.getContext('2d');
  if(!g)return;
  const stage=root.querySelector('.rm-stage'), play=root.querySelector('.rm-play'), reset=root.querySelector('.rm-reset');
  const loopInput=root.querySelector('input'), timer=root.querySelector('.rm-timer'), status=root.querySelector('.rm-status');
  const copy=root.querySelector('.rm-copy'), kicker=root.querySelector('.rm-kicker'), headline=root.querySelector('.rm-headline');
  const caption=root.querySelector('.rm-caption'), output=root.querySelector('.rm-output'), sideLabel=root.querySelector('.rm-frame-label'),channels=root.querySelector('.rm-channels');
  const chapters=[...root.querySelectorAll('[data-scene]')];
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const design={tempo:1,closeups:true,life:1};
  const controller=new AbortController();
  const on=(element,event,handler)=>element.addEventListener(event,handler,{signal:controller.signal});
  let disposed=false;
  const TAU=Math.PI*2;
  const rotorAngle=time=>time*TAU/4.5;
  const C={ink:'#173042',deep:'#102b34',paper:'#f7f5ef',teal:'#137a72',mint:'#b5dace',olive:'#b6c4a9',sand:'#e7e9dc',warm:'#e8b877'};
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,p)=>a+(b-a)*p;
  const ease=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10);};
  const interval=(t,a,b)=>ease((t-a)/(b-a));
  const out=x=>1-Math.pow(1-clamp(x),4);
  const spring=x=>{x=clamp(x);return x===1?1:1-Math.exp(-7*x)*Math.cos(9*x);};
  const lerpColor=(a,b,p)=>{const n=s=>s.match(/[a-f0-9]{2}/gi).map(v=>parseInt(v,16));const aa=n(a),bb=n(b);return '#'+aa.map((v,i)=>Math.round(mix(v,bb[i],clamp(p))).toString(16).padStart(2,'0')).join('');};
  const DURATION=24;
  let t=media.matches?18.3:0, playing=false, raf=0, last=0, dpr=1, visible=true, sceneIndex=-1, loopCount=0;
  let pointer={x:0,y:0}, drift={x:0,y:0};
  const shots=[];
  const cameras={
    macro:{yaw:-.44,pitch:.95,scale:505,target:[.72,2.46,.4],cx:463,cy:341},
    whole:{yaw:-.57,pitch:.52,scale:82,target:[0,1.25,0],cx:397,cy:331},
    fan:{yaw:-.12,pitch:.13,scale:247,target:[-1.85,.69,1.58],cx:445,cy:318},
    home:{yaw:-.13,pitch:.17,scale:174,target:[.25,1.12,1.15],cx:442,cy:326},
    roof:{yaw:-.57,pitch:1.08,scale:119,target:[0,2.1,0],cx:360,cy:298}
  };
  function cameraMix(a,b,p){return {yaw:mix(a.yaw,b.yaw,p),pitch:mix(a.pitch,b.pitch,p),scale:mix(a.scale,b.scale,p),target:a.target.map((v,i)=>mix(v,b.target[i],p)),cx:mix(a.cx,b.cx,p),cy:mix(a.cy,b.cy,p)};}
  function path(ctx,pts){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();}
  function rounded(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
  function renderProject(ctx,cam,time,options={}){
    const warm=options.warm||0, assembly=options.assembly??1;
    const breeze=Math.sin(time*TAU/6),light=Math.sin(time*TAU/24),life=design.life;
    const yaw=cam.yaw, pitch=cam.pitch, cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),s=cam.scale;
    const proj=p=>{let x=p[0]-cam.target[0], y=p[1]-cam.target[1],z=p[2]-cam.target[2];let rx=x*cy+z*sy,rz=-x*sy+z*cy;return [cam.cx+rx*s,cam.cy+(-y*cp+rz*sp)*s,y*sp+rz*cp];};
    const faces=[];let layer=0;
    const poly=(pts,color,stroke=null,width=.5,alpha=1,bias=0)=>{const pp=pts.map(proj);faces.push({pts:pp,color,stroke,width,alpha,layer,depth:pp.reduce((a,p)=>a+p[2],0)/pp.length+bias});};
    function box(x,y,z,w,h,d,colors){
      const a=[x,y,z],b=[x+w,y,z],c=[x+w,y+h,z],dd=[x,y+h,z],e=[x,y,z+d],f=[x+w,y,z+d],gg=[x+w,y+h,z+d],hh=[x,y+h,z+d];
      poly([a,b,c,dd],colors[2]||colors[0]);poly([b,f,gg,c],colors[1]);poly([e,a,dd,hh],colors[1]);poly([f,e,hh,gg],colors[0]);poly([dd,c,gg,hh],colors[2]||colors[0]);
    }
    function circle3(x,y,z,r,color){poly(Array.from({length:48},(_,i)=>{let a=i/48*Math.PI*2;return[x+Math.cos(a)*r,y+Math.sin(a)*r,z];}),color,null,.5,1,.01);}
    // The geometric roof, pump and window are one continuous three-dimensional set.
    if(!options.onlyRoof){
      poly([[-4.2,-.13,-3.1],[4.2,-.13,-3.1],[4.2,-.13,3.1],[-4.2,-.13,3.1]],lerpColor('#cdd9c6','#c7c6ab',warm));
      const shadowShift=light*.28*life;
      poly([[-2.3,-.12,-1.8],[2.8,-.12,-1.6],[3.8+shadowShift,-.12,2.5],[-1.7+shadowShift,-.12,2.7]],'#aebfa9',null,0,.35);
      box(-2.16,-.06,-1.55,4.32,.13,3.1,['#b7c6b1','#9daf99','#d7dfcd']);
      box(-2.02,.07,-1.41,4.04,2.04,2.82,[lerpColor('#f7f3e9','#ebd4ae',warm),'#bccdc3','#e8e9d9']);
      box(-2.14,2.08,-1.54,4.28,.17,3.08,['#d4ddce','#9daf9f','#e5e9dc']);
      // Framed glazing with curtains, an interior pendant and a small plant.
      box(-.82,.39,1.416,2.32,1.35,.045,['#214955','#254953','#355c61']);
      poly([[-.76,.45,1.468],[1.44,.45,1.468],[1.44,1.68,1.468],[-.76,1.68,1.468]],lerpColor('#709996','#efbc79',warm));
      const curtain=breeze*.035*life;
      poly([[-.76,1.25+light*.1*life,1.474],[1.44,1.61+light*.03*life,1.474],[1.44,1.68,1.474],[-.76,1.68,1.474]],lerpColor('#a8c3b7','#f4d5a0',warm));
      poly([[-.76,.45,1.479],[-.42+curtain,.45,1.479],[-.48+curtain*.4,1.01,1.479],[-.53,1.68,1.479],[-.76,1.68,1.479]],lerpColor('#bdd1c2','#f6e0bb',warm));
      poly([[1.19-curtain*.7,.45,1.479],[1.44,.45,1.479],[1.44,1.68,1.479],[1.27,1.68,1.479],[1.22-curtain*.3,1.05,1.479]],lerpColor('#bdd1c2','#f6e0bb',warm));
      box(.56,.43,1.487,.12,1.29,.023,['#315258','#315258','#456765']);
      box(-.1,.43,1.487,.055,1.29,.024,['#315258','#315258','#456765']);
      poly([[.76,1.45,1.482],[1.12,1.45,1.482],[1.03,1.6,1.482],[.85,1.6,1.482]],lerpColor('#c8d3b8','#ffdfa1',warm));
      poly([[.93,1.6,1.483],[.945,1.6,1.483],[.945,1.68,1.483],[.93,1.68,1.483]],'#546663');
      box(.7,.46,1.488,.58,.09,.018,[lerpColor('#547970','#8c7556',warm),'#45645b','#718e77']);
      // The left window is the same architectural motif at a smaller scale.
      poly([[-2.024,.87,-.91],[-2.024,.87,.54],[-2.024,1.65,.54],[-2.024,1.65,-.91]],'#375e60');
      poly([[-2.03,.94,-.84],[-2.03,.94,.46],[-2.03,1.58,.46],[-2.03,1.58,-.84]],'#97b5a4');
      box(-1.45,.075,1.6,3.5,.06,.61,['#b8c5ae','#a4b69d','#e0e4cf']);
      // Separate physical layers keep large roof/wall faces from occluding nearby details.
      layer=2;
      // Heat pump as a crafted object, with a real rotating impeller behind its grille.
      box(-2.65,.06,1.47,1.27,1.24,.55,['#e0e5d9','#aebead','#eef0e5']);
      box(-2.67,1.3,1.45,1.31,.065,.59,['#bbc9b9','#b1c1b0','#f5f4e9']);
      // Fixed paint layers: rotor geometry never sorts behind its own housing.
      layer=3;
      circle3(-2.02,.69,2.033,.492,'#173a42');
      circle3(-2.02,.69,2.041,.443,'#274f51');
      layer=4;
      for(let i=0;i<5;i++){
        const a=i/5*TAU+rotorAngle(time);
        const pts=Array.from({length:24},(_,j)=>{const q=j/23;const an=a+q*1.04;const r=.08+Math.sin(q*Math.PI)*.32;return[-2.02+Math.cos(an)*r,.69+Math.sin(an)*r,2.051];});
        poly(pts,'#719b91',null,0,1,.02);
      }
      layer=5;
      for(let j=0;j<11;j++){
        const yy=.69+(j-5)*.075;const half=Math.sqrt(Math.max(0,.443*.443-Math.pow(yy-.69,2)));
        poly([[-2.02-half,yy-.008,2.059],[-2.02+half,yy-.008,2.059],[-2.02+half,yy+.008,2.059],[-2.02-half,yy+.008,2.059]],'#517870');
      }
      layer=6;circle3(-2.02,.69,2.068,.08,'#c6d7c5');
      layer=2;
      box(-2.49,.025,1.58,.12,.07,.32,['#8caa98','#829d8b','#a1b4a3']);box(-1.67,.025,1.58,.12,.07,.32,['#8caa98','#829d8b','#a1b4a3']);
      // Raised planters give the small set a recognisable human scale.
      box(1.83,.02,1.73,.7,.23,.46,['#b4bca4','#9faf98','#cbd0b9']);
      for(let i=0;i<7;i++){
        let xx=1.92+i*.075,zz=1.81+(i%2)*.11;const h=.3+(i%3)*.075;
        const lean=Math.sin(time*TAU/6+i*.32)*.085*life;
        poly([[xx,.25,zz],[xx-.045+lean*.65,.25+h*.8,zz],[xx+.018+lean,.25+h,zz],[xx+.04,.25,zz]],'#638979');
        poly([[xx,.25,zz],[xx+.075+lean*.6,.25+h*.7,zz+.02],[xx+.09+lean,.25+h*.9,zz+.02],[xx+.015,.25,zz]],'#809d82');
        poly([[xx,.25+h*.33,zz+.03],[xx-.105+lean*.4,.25+h*.62,zz+.03],[xx-.055+lean*.55,.25+h*.71,zz+.03],[xx+.01,.25+h*.42,zz+.03]],'#557d6c');
      }
    }
    layer=1;
    // Solar cells are authored as surfaces, so the macro resolves into the roof itself.
    for(let row=0;row<3;row++)for(let col=0;col<5;col++){
      const order=(col+row)/6, p=out(clamp(assembly*1.4-order*.35));
      const x=-1.8+col*.733,z=-1.2+row*.83,y=2.29+(1-p)*.8;
      box(x,y,z,.66,.055,.735,['#244750','#27484d','#173a46']);
      poly([[x+.022,y+.057,z+.022],[x+.638,y+.057,z+.022],[x+.638,y+.057,z+.713],[x+.022,y+.057,z+.713]],'#234955');
      for(let i=1;i<5;i++) poly([[x+i*.128,y+.058,z+.024],[x+i*.128+.006,y+.058,z+.024],[x+i*.128+.006,y+.058,z+.711],[x+i*.128,y+.058,z+.711]],'#6a9293');
      for(let j=1;j<4;j++)poly([[x+.022,y+.059,z+j*.177],[x+.638,y+.059,z+j*.177],[x+.638,y+.059,z+j*.177+.007],[x+.022,y+.059,z+j*.177+.007]],'#537e82');
      const reflection=.5+.5*Math.sin(time*TAU/8+col*.5+row*.32);
      poly([[x+.024,y+.061,z+.025],[x+.32,y+.061,z+.025],[x+.637,y+.061,z+.3],[x+.637,y+.061,z+.59]],'#b1d7cb',null,0,.055+reflection*.12);
      const glint=Math.pow(Math.max(0,Math.sin(time*TAU/6-col*.29-row*.17)),8)*life;
      poly([[x+.024,y+.062,z+.025],[x+.32,y+.062,z+.025],[x+.637,y+.062,z+.3],[x+.637,y+.062,z+.39],[x+.28,y+.062,z+.11],[x+.024,y+.062,z+.11]],'#ebedcd',null,0,glint*.19);
    }
    faces.sort((a,b)=>a.layer-b.layer||a.depth-b.depth);
    ctx.lineJoin='round';
    for(const f of faces){ctx.globalAlpha=f.alpha;path(ctx,f.pts);ctx.fillStyle=f.color;ctx.fill();if(f.stroke){ctx.strokeStyle=f.stroke;ctx.lineWidth=f.width;ctx.stroke();}}
    ctx.globalAlpha=1;
  }
  function background(ctx,warm=0,dark=0,time=0){
    const a=lerpColor(lerpColor('#edf1eb','#eddbc0',warm),C.deep,dark),b=lerpColor(lerpColor('#bddbd3','#d9bf98',warm),'#15494a',dark);
    let grad=ctx.createLinearGradient(0,0,690,540);grad.addColorStop(0,a);grad.addColorStop(1,b);ctx.fillStyle=grad;ctx.fillRect(0,0,720,540);
    // Broad painted light; no particles, shimmer filters or synthetic bloom.
    const sweep=Math.sin(time*TAU/24)*55*design.life;
    ctx.save();ctx.globalAlpha=.2*(1-dark);ctx.fillStyle='#fcf6d8';path(ctx,[[455+sweep,-50],[700+sweep,-50],[400+sweep,540],[100+sweep,540]]);ctx.fill();ctx.restore();
  }
  function makeShots(){
    for(let i=0;i<4;i++){const cv=document.createElement('canvas');cv.width=720;cv.height=540;shots.push({canvas:cv,ctx:cv.getContext('2d')});}
  }
  function updateShots(time){
    const cs=[{...cameras.whole,cx:360,cy:310,scale:94},{...cameras.macro,cx:360,cy:270,scale:285},{...cameras.fan,cx:360,cy:286,scale:205},{...cameras.home,cx:360,cy:275,scale:173}];
    cs.forEach((cam,i)=>{const c=shots[i].ctx;if(i===3){renderInterior(c,time,design.life);return;}background(c,0,0,time);renderProject(c,cam,time,{onlyRoof:i===1});});
  }
  function imageCard(img,x,y,w,h,angle=0,alpha=1,flip=1){
    g.save();g.globalAlpha=alpha;g.translate(x+w/2,y+h/2);g.rotate(angle);g.scale(flip,1);
    g.shadowColor='#081e2948';g.shadowBlur=24;g.shadowOffsetY=16;rounded(g,-w/2,-h/2,w,h,4);g.fillStyle=C.paper;g.fill();g.shadowColor='transparent';
    rounded(g,-w/2+3,-h/2+3,w-6,h-6,2);g.clip();
    const ar=w/h;let sx=0,sy=0,sw=720,sh=540;if(ar>4/3){sh=720/ar;sy=(540-sh)/2;}else{sw=540*ar;sx=(720-sw)/2;}
    g.drawImage(img,sx,sy,sw,sh,-w/2,-h/2,w,h);g.restore();
  }
function renderInterior(ctx, time, strength = 1) {
  // Original architectural illustration. Coordinates are 720 × 540.
  // All motion closes over 24 seconds; strength is warmth / motion, not opacity.
  const TAU = Math.PI * 2;
  const t = Number.isFinite(time) ? time : 0;
  const life = Math.max(0, Math.min(1, strength));
  const phase = TAU * t / 24;
  const drift = Math.sin(phase * 2) * life;
  const warm = 0.8 + life * 0.2;
  const path = (build, fill, stroke, width = 1) => {
    ctx.beginPath(); build();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
  };
  const round = (x, y, w, h, r, fill) => {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
  };
  const ellipse = (x, y, rx, ry, fill, rotate = 0) => {
    path(() => ctx.ellipse(x, y, rx, ry, rotate, 0, TAU), fill);
  };
  const line = (x1, y1, x2, y2, color, width = 1) => {
    path(() => { ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); }, null, color, width);
  };
  const linear = (x1, y1, x2, y2, stops) => {
    const g = ctx.createLinearGradient(x1, y1, x2, y2);
    stops.forEach(([at, color]) => g.addColorStop(at, color)); return g;
  };
  const glow = (x, y, r, color) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color); g.addColorStop(1, 'rgba(226,176,99,0)');
    ctx.fillStyle = g; ctx.fillRect(x-r, y-r, r*2, r*2);
  };
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.fillStyle = '#f7f5ef'; ctx.fillRect(0, 0, 720, 540);

  // Quiet plaster wall leaves room for the editorial title at upper left.
  ctx.fillStyle = linear(0, 0, 690, 500, [
    [0, '#f9f7f1'], [.56, '#f3eee4'], [1, '#ddcdb6']
  ]);
  ctx.fillRect(0, 0, 720, 371);
  glow(532 + drift*3, 228, 345, `rgba(236,181,100,${0.13*warm})`);
  path(() => { ctx.moveTo(687, 0); ctx.lineTo(720, 0); ctx.lineTo(720, 389); ctx.lineTo(687, 371); }, '#ddd7cc');
  line(686.5, 0, 686.5, 371, 'rgba(115,105,89,.15)');

  // Oak floor and a fine skirting: depth without a busy grid.
  ctx.fillStyle = linear(0, 364, 350, 540, [[0, '#d7c4a8'], [1, '#c9ac86']]);
  ctx.fillRect(0, 370, 720, 170);
  ctx.fillStyle = '#ece5d9'; ctx.fillRect(0, 363, 688, 7);
  line(0, 371, 690, 371, 'rgba(106,89,63,.19)');
  [65, 208, 352, 496, 640].forEach(x => line(x, 371, x - 117, 540, 'rgba(122,94,62,.14)', 1));
  line(0, 420, 720, 420, 'rgba(155,119,77,.10)');
  line(0, 490, 720, 490, 'rgba(155,119,77,.10)');

  // Recessed right-hand picture window with a softly distant garden.
  round(439, 24, 225, 308, 5, '#d2cbbd');
  ctx.save();
  ctx.beginPath(); ctx.roundRect(449, 32, 205, 287, 1); ctx.clip();
  ctx.fillStyle = linear(449, 32, 550, 319, [[0,'#f1dfbb'], [.42,'#deeee5'], [1,'#b1c7b5']]);
  ctx.fillRect(447, 30, 210, 292);
  glow(625, 93, 111, 'rgba(255,242,205,.85)');
  path(() => { ctx.moveTo(438, 231); ctx.bezierCurveTo(510, 185, 551, 244, 669, 194); ctx.lineTo(669, 324); ctx.lineTo(438,324); }, '#adbcaa');
  path(() => { ctx.moveTo(438, 279); ctx.bezierCurveTo(525, 208, 581, 250, 669, 239); ctx.lineTo(669, 324); ctx.lineTo(438,324); }, '#819d88');
  // The garden tree moves almost imperceptibly behind the glass.
  const sway = Math.sin(phase) * 2.1 * life;
  path(() => { ctx.moveTo(618, 326); ctx.bezierCurveTo(620,263,610+sway,222,612+sway,179); }, null, '#7a8970', 3);
  ellipse(604+sway, 213, 23, 53, 'rgba(135,158,115,.44)', -.28);
  ellipse(633+sway*.5, 233, 24, 49, 'rgba(113,147,113,.36)', .44);
  ctx.fillStyle = linear(449, 32, 654, 319, [[0,'rgba(255,255,255,.07)'], [.53,'rgba(255,255,255,.24)'], [1,'rgba(255,255,255,0)']]);
  ctx.fillRect(449, 32, 205, 287);
  ctx.restore();
  // Deep sill and thin anodised frame.
  ctx.fillStyle = '#71887c'; ctx.fillRect(449, 32, 5, 287); ctx.fillRect(649, 32, 5, 287);
  ctx.fillRect(448, 31, 207, 5); ctx.fillRect(449, 314, 205, 5); ctx.fillRect(550, 33, 4, 282);
  path(() => { ctx.moveTo(441,319);ctx.lineTo(664,319);ctx.lineTo(682,332);ctx.lineTo(425,332); }, '#f7f2e8');
  ctx.fillStyle = '#c8bcaa'; ctx.fillRect(425,332,257,4);

  // Warm light physically crosses the wall and floor, not a UI glow.
  ctx.save();
  ctx.globalAlpha *= warm;
  const lightShift = Math.sin(phase) * 6 * life;
  path(() => {
    ctx.moveTo(456,194); ctx.lineTo(649,247); ctx.lineTo(543+lightShift,370);
    ctx.lineTo(241+lightShift,501); ctx.lineTo(67+lightShift,445); ctx.lineTo(355+lightShift,370);
  }, linear(470, 225, 192, 498, [[0,'rgba(255,235,187,.02)'], [.4,'rgba(255,230,169,.17)'], [1,'rgba(255,235,193,.59)']]));
  path(() => { ctx.moveTo(490,331);ctx.lineTo(483,331);ctx.lineTo(225+lightShift,500);ctx.lineTo(239+lightShift,505); }, 'rgba(124,108,79,.06)');
  ctx.restore();

  // Sheer linen curtains: broad fabric silhouette with restrained folds.
  const curtain = (x, w, dir) => {
    const bend = drift * 4.3 * dir;
    path(() => {
      ctx.moveTo(x, 14); ctx.lineTo(x+w,14);
      ctx.bezierCurveTo(x+w-3,135,x+w+bend,270,x+w+10+bend,368);
      ctx.quadraticCurveTo(x+w*.5,377,x-7+bend,368);
      ctx.bezierCurveTo(x+2+bend,274,x-2,132,x,14);
    }, linear(x,0,x+w,0,[[0,'rgba(247,244,229,.86)'],[.34,'rgba(255,252,240,.70)'],[.65,'rgba(212,207,188,.41)'],[1,'rgba(253,247,231,.86)']]));
    for (let k=0;k<3;k++) {
      const xx=x+8+k*(w-10)/3;
      path(() => {ctx.moveTo(xx,18);ctx.bezierCurveTo(xx-3,143,xx+bend*1.2,263,xx+bend+3,367);}, null, 'rgba(160,156,137,.13)', 1);
    }
  };
  curtain(414, 32, -1); curtain(653, 36, 1);
  line(408, 12, 696, 12, '#8f8c77', 2);

  // Soft woven rug, with a rounded shape echoing the chair.
  ellipse(410, 452, 218, 67, 'rgba(73,65,52,.07)');
  ellipse(407, 446, 220, 64, '#e9dfcc', -.045);
  ctx.save();
  ctx.beginPath(); ctx.ellipse(407,446,216,60,-.045,0,TAU); ctx.clip();
  for (let y=392;y<508;y+=5) line(179,y,640,y,'rgba(131,115,91,.055)',.8);
  ctx.restore();

  // Sculptural armchair: deep back, plush rolled arms, seat and feet.
  ellipse(492, 434, 120, 25, 'rgba(72,61,44,.15)');
  line(427,408,420,443,'#786650',7); line(552,406,567,432,'#786650',7);
  path(() => {
    ctx.moveTo(394,354);ctx.lineTo(405,280);
    ctx.bezierCurveTo(412,234,457,224,485,225);
    ctx.bezierCurveTo(530,226,561,245,572,293);
    ctx.lineTo(584,361);ctx.bezierCurveTo(540,390,439,391,394,354);
  },linear(406,235,583,394,[[0,'#ead7ba'],[.36,'#e5caa5'],[1,'#b99972']]));
  path(() => {
    ctx.moveTo(419,339);ctx.lineTo(426,284);
    ctx.bezierCurveTo(431,253,459,248,482,249);
    ctx.bezierCurveTo(513,250,538,264,546,293);
    ctx.lineTo(559,344);ctx.bezierCurveTo(518,362,459,365,419,339);
  },linear(442,250,500,364,[[0,'#f0dfc5'],[1,'#d5b78f']]));
  path(() => {ctx.moveTo(432,292);ctx.bezierCurveTo(456,288,506,290,541,307);},null,'rgba(170,128,83,.12)',1);
  // Curved base and long seat pad.
  path(() => {
    ctx.moveTo(398,356);ctx.bezierCurveTo(440,332,550,335,585,360);
    ctx.lineTo(579,403);ctx.bezierCurveTo(545,425,439,432,398,407);ctx.closePath();
  },linear(400,352,501,427,[[0,'#d8b990'],[1,'#b99b76']]));
  path(() => {
    ctx.moveTo(410,354);ctx.bezierCurveTo(451,332,549,336,576,356);
    ctx.lineTo(570,378);ctx.bezierCurveTo(528,397,453,403,413,379);ctx.closePath();
  },linear(418,344,462,397,[[0,'#f1dfc6'],[1,'#d2b189']]));
  path(() => {ctx.moveTo(411,378);ctx.bezierCurveTo(453,403,528,397,569,378);},null,'rgba(136,102,65,.21)',1.2);
  // Chunky crescent arms give the chair its modern silhouette.
  path(() => {
    ctx.moveTo(393,313);ctx.bezierCurveTo(371,313,373,349,382,382);
    ctx.bezierCurveTo(387,406,400,419,415,410);
    ctx.bezierCurveTo(426,404,421,387,414,371);ctx.lineTo(408,328);
    ctx.bezierCurveTo(406,316,400,311,393,313);
  },linear(378,320,421,385,[[0,'#f1dfc5'],[.54,'#e1c39d'],[1,'#c5a078']]));
  path(() => {
    ctx.moveTo(565,318);ctx.bezierCurveTo(584,307,601,327,604,350);
    ctx.lineTo(599,381);ctx.bezierCurveTo(595,403,580,414,568,404);
    ctx.bezierCurveTo(556,394,564,378,566,363);ctx.lineTo(562,332);
    ctx.bezierCurveTo(561,326,561,321,565,318);
  },linear(562,320,602,387,[[0,'#f1dfc4'],[.48,'#dfc29a'],[1,'#ba956c']]));
  // One pillow: soft sage textile instead of an ornamental pile of objects.
  ctx.save(); ctx.translate(492,318); ctx.rotate(-.13);
  path(() => {ctx.moveTo(-41,-31);ctx.quadraticCurveTo(0,-37,38,-27);ctx.quadraticCurveTo(46,-4,37,30);ctx.quadraticCurveTo(0,37,-39,29);ctx.quadraticCurveTo(-46,2,-41,-31);}, linear(-30,-30,40,30,[[0,'#acb4a0'],[1,'#839782']]));
  path(() => {ctx.moveTo(-34,-25);ctx.quadraticCurveTo(0,-28,32,-23);},null,'rgba(240,242,216,.34)',1);
  ctx.restore();

  // Folded wool throw drapes across the near arm and catches warm light.
  path(() => {
    ctx.moveTo(383,327);ctx.bezierCurveTo(395,321,410,326,421,340);
    ctx.bezierCurveTo(426,351,416,366,418,382);ctx.lineTo(426,417);
    ctx.bezierCurveTo(414,426,401,426,392,422);ctx.lineTo(389,375);
    ctx.bezierCurveTo(385,357,378,347,383,327);
  },linear(380,327,432,424,[[0,'#326e65'],[.37,'#477f71'],[.7,'#245e56'],[1,'#356d60']]));
  for(let i=0;i<4;i++){
    path(() => {ctx.moveTo(387+i*7,330);ctx.bezierCurveTo(381+i*8,352,397+i*4,373,398+i*7,422);},null,'rgba(228,227,196,.11)',1.1);
  }
  for(let i=0;i<8;i++) line(393+i*4,421,394+i*4,427+(i%3),'rgba(41,89,74,.8)',1);

  // Low round oak side table and ceramic cup: a warm human-scale detail.
  ellipse(320,447,70,16,'rgba(79,64,41,.13)');
  path(() => {ctx.moveTo(300,385);ctx.lineTo(338,384);ctx.lineTo(346,445);ctx.quadraticCurveTo(320,456,294,443);ctx.closePath();},linear(294,386,346,445,[[0,'#b08d66'],[.6,'#947555'],[1,'#bd9d76']]));
  ellipse(320,382,73,21,'#a58763');
  ellipse(320,377,73,21,'#cbb08a');
  path(() => {ctx.ellipse(320,376,65,16,0,Math.PI+.2,TAU-.2);},null,'rgba(245,229,200,.32)',1);
  ellipse(323,372,23,6,'rgba(104,78,47,.15)');
  ellipse(323,371,20,5,'#eee5d4');
  // Cup handle sits behind its unglazed body.
  path(() => {ctx.ellipse(340,355,9,10,.12,0,TAU);},null,'#c4ab87',4.4);
  path(() => {ctx.moveTo(308,343);ctx.lineTo(337,343);ctx.lineTo(335,365);ctx.quadraticCurveTo(323,375,311,365);ctx.closePath();},linear(307,347,340,366,[[0,'#eee5ce'],[.6,'#dfcdae'],[1,'#ba9e78']]));
  ellipse(322.5,343,14.5,4,'#bfa17c');
  ellipse(322.5,343,11.5,2.6,'#796044');
  // Three slow steam ribbons rise, narrow and dissolve, without pulsing the cup.
  ctx.save();
  for(let i=0;i<3;i++){
    const u = ((t/6+i/3)%1+1)%1;
    const opacity = Math.sin(Math.PI*u)*.40*life;
    const yy=336-u*56;
    const xx=316+i*6+Math.sin(phase*4+i)*3*life;
    path(() => {ctx.moveTo(xx,yy+20);ctx.bezierCurveTo(xx-8,yy+7,xx+8,yy+5,xx+2,yy-10);},null,`rgba(255,252,241,${opacity})`,2.6-u*1.2);
  }
  ctx.restore();

  // Tall olive branch anchors the right foreground. No arbitrary particles.
  const plantX=654, plantY=441;
  ellipse(plantX,plantY+11,34,9,'rgba(80,67,46,.13)');
  path(() => {ctx.moveTo(628,399);ctx.lineTo(679,399);ctx.lineTo(673,445);ctx.quadraticCurveTo(653,454,634,444);ctx.closePath();},linear(628,400,679,450,[[0,'#eee5d5'],[.56,'#cfc1a8'],[1,'#b2a58e']]));
  ellipse(653.5,399,25.5,7,'#cec0a8');ellipse(653.5,399,21,4,'#8d8168');
  const trunkDrift=Math.sin(phase*2+.6)*1.3*life;
  path(() => {ctx.moveTo(653,400);ctx.bezierCurveTo(653,350,650+trunkDrift,311,663+trunkDrift,269);},null,'#76816a',2.2);
  const leaves=[
    [653,359,-1,-.42,25],[658,340,1,.36,28],[656,321,-1,-.52,28],
    [660,303,1,.43,23],[663,281,-1,-.37,21],[648,377,-1,-.62,26]
  ];
  leaves.forEach(([x,y,dir,angle,len],i)=>{
    const swayLeaf=Math.sin(phase*2+i*.5)*.04*life;
    ctx.save();ctx.translate(x+trunkDrift*(400-y)/130,y);ctx.rotate(angle+swayLeaf);
    line(0,0,dir*len*.8,-len*.63,'#728269',1.3);
    path(() => {ctx.moveTo(dir*6,-5);ctx.bezierCurveTo(dir*(len*.4),-len*1.05,dir*(len*1.15),-len*.95,dir*(len*1.25),-len*.78);ctx.bezierCurveTo(dir*len,-len*.14,dir*len*.56,2,dir*6,-5);},i%2?'#739477':'#8aa080');
    line(dir*8,-7,dir*len*1.1,-len*.71,'rgba(211,216,173,.28)',.8);
    ctx.restore();
  });

  // A delicate warm edge binds all materials into the same afternoon light.
  const finish=ctx.createLinearGradient(720,0,0,540);
  finish.addColorStop(0,'rgba(255,216,143,.025)');finish.addColorStop(1,'rgba(255,222,173,.07)');
  ctx.fillStyle=finish;ctx.fillRect(0,0,720,540);
  ctx.restore();
}

  function coverImage(ctx,img,x,y,w,h){
    const ar=w/h;let sx=0,sy=0,sw=720,sh=540;
    if(ar>4/3){sh=720/ar;sy=(540-sh)/2;}else{sw=540*ar;sx=(720-sw)/2;}
    ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);
  }
  function applicationFrames(p){
    if(p<=0)return;
    g.save();g.globalAlpha=p;g.shadowColor='#061e2a60';g.shadowBlur=25;g.shadowOffsetY=15;
    rounded(g,43,223,370,240,9);g.fillStyle='#f2f2e9';g.fill();
    rounded(g,484,204,150,262,20);g.fillStyle='#0b2029';g.fill();g.shadowColor='transparent';
    g.fillStyle='#d4dfd9';rounded(g,43,223,370,29,[9,9,0,0]);g.fill();
    g.fillStyle='#859d96';for(let i=0;i<3;i++){g.beginPath();g.arc(57+i*10,237,2,0,TAU);g.fill();}
    g.fillStyle='#eaf0e9';rounded(g,153,230,149,14,4);g.fill();
    g.restore();
  }
  function filmSet(time){
    updateShots(time);
    const reveal=interval(time,10.3,12),application=interval(time,14.8,16.3);
    background(g,0,reveal,time);
    const first=interval(time,10.3,12.4),f=spring(first);
    applicationFrames(application);
    const mainX=mix(mix(0,43,f),56,application),mainY=mix(mix(0,227,f),263,application);
    const mainW=mix(mix(720,316,f),344,application),mainH=mix(mix(540,178,f),193.5,application);
    imageCard(shots[0].canvas,mainX,mainY,mainW,mainH,mix(0,-.035,Math.sin(first*Math.PI)),1);
    for(let i=0;i<3;i++){
      const q=clamp((time-10.85-i*.28)/1.65),p=spring(q),rot=mix([-.27,.19,-.14][i],0,p)*(1-application);
      const x=mix(mix(775+i*66,387+i*98,p),492,application),y=mix(mix(115+i*27,245+(i===1?-18:0),p),216,application);
      const alpha=clamp(q*4)*(i===2?1:1-application);
      imageCard(shots[i+1].canvas,x,y,mix(90,134,application),mix(160,238,application),rot,alpha,mix(.72,1,p));
    }
    if(application>0){g.save();g.globalAlpha=application;g.fillStyle='#0b2029';rounded(g,536,209,47,9,5);g.fill();g.restore();}
    if(time>19.2){
      // Return through the main film to the whole house, never through a short-format tile.
      const back=interval(time,19.2,20.6);
      const x=mix(59,0,back),y=mix(266,0,back),w=mix(338,720,back),h=mix(187.5,540,back);
      g.save();rounded(g,x,y,w,h,3*(1-back));g.clip();coverImage(g,shots[0].canvas,x,y,w,h);g.restore();
    }
  }
  const words=[
    ['01 / DIE ENTDECKUNG','Hier steckt<br><em>mehr drin.</em>','Aus einem Detail wird eine Geschichte.'],
    ['02 / DAS GEFÜHL','Wärme, die<br><em>man spürt.</em>','Ankommen. Durchatmen. Zuhause sein.'],
    ['03 / DIE VERWANDLUNG','Ein Projekt.<br><em>Vier Perspektiven.</em>','Die richtigen Momente. Präzise auf den Punkt.'],
    ['04 / DIE ANWENDUNG','Dort, wo<br><em>Kunden schauen.</em>','']
  ];
  function render(time){
    g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,720,540);
    const enterWhole=interval(time,.55,3.2),enterFan=interval(time,4.05,5.2),enterHome=interval(time,5.4,6.4);
    if(time<10.3){
      let cam=cameraMix(cameras.macro,cameras.whole,enterWhole);
      if(time>3.2&&time<4.05)cam={...cam,yaw:cam.yaw-(time-3.2)*.13};
      if(time>=4.05)cam=cameraMix({...cameras.whole,yaw:-.68},design.closeups?cameras.fan:cameras.whole,enterFan);
      if(time>=5.4)cam=cameraMix(design.closeups?cameras.fan:cameras.whole,design.closeups?cameras.home:{...cameras.whole,yaw:-.25},enterHome);
      const returnWhole=interval(time,9,10.3);
      if(time>=9)cam=cameraMix(design.closeups?cameras.home:cameras.whole,{...cameras.whole,cx:360,cy:310,scale:94},returnWhole);
      const warmth=interval(time,5.6,6.5)*(1-returnWhole);
      background(g,warmth,0,time);
      if(time>1.3&&time<4.5){
        const sun=interval(time,1.3,2.8)*(1-interval(time,4.05,4.5));
        g.save();g.globalAlpha=sun*.7;g.fillStyle='#e8b978';g.beginPath();g.arc(522+Math.sin(time*TAU/24)*14*design.life,240-Math.sin(time*TAU/24)*9*design.life,77,0,TAU);g.fill();g.restore();
      }
      const parallax=interval(time,.55,1.3)*(1-interval(time,5.4,6.4));
      g.save();g.translate(drift.x*parallax,drift.y*parallax);renderProject(g,cam,time,{warm:warmth,onlyRoof:time<1.2,assembly:1});g.restore();
      const roomIn=interval(time,5.8,7),roomOut=interval(time,9,10.3),room=roomIn*(1-roomOut);
      if(room>0){
        // The architectural window opens into a crafted, inhabited-feeling interior.
        g.save();rounded(g,mix(405,0,room),mix(260,0,room),mix(100,720,room),mix(90,540,room),mix(4,0,room));g.clip();
        const interior=shots[3];renderInterior(interior.ctx,time,design.life);
        g.globalAlpha=clamp(room*3);g.drawImage(interior.canvas,0,0,720,540);g.restore();
      }
    }else if(time<20.6){filmSet(time);}else{
      // A visible flight over the whole roof closes the loop.
      const rise=interval(time,20.6,21.9),close=interval(time,22.2,24);
      let cam=cameraMix({...cameras.whole,cx:360,cy:310,scale:94},cameras.roof,rise);
      if(time>=22.2)cam=cameraMix(cameras.roof,cameras.macro,close);
      background(g,0,0,time);renderProject(g,cam,time,{onlyRoof:time>23.2});
    }
    const vignette=(1-interval(time,.85,2.1))+interval(time,22.5,24);
    if(vignette>0){g.save();g.globalAlpha=vignette;const shade=g.createLinearGradient(0,0,630,330);shade.addColorStop(0,'#102b34c4');shade.addColorStop(.68,'#102b3430');shade.addColorStop(1,'#102b3400');g.fillStyle=shade;g.fillRect(0,0,720,540);g.restore();}
    sync(time);
  }
  function sync(time){
    const phase=time<4.15?0:time<10.3?1:time<14.8?2:3;
    if(phase!==sceneIndex){sceneIndex=phase;chapters.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===phase)));}
    const wordIndex=time>23.2?0:phase;
    if(kicker.textContent!==words[wordIndex][0])kicker.textContent=words[wordIndex][0];
    if(headline.innerHTML!==words[wordIndex][1])headline.innerHTML=words[wordIndex][1];
    if(caption.textContent!==words[wordIndex][2])caption.textContent=words[wordIndex][2];
    const intro=1-interval(time,3.7,4.05);
    let textAlpha=1;
    if(time<4.15)textAlpha=intro;
    else if(time<4.55)textAlpha=interval(time,4.15,4.55);
    else if(time>9.3&&time<10.3)textAlpha=1-interval(time,9.3,10.3);
    else if(time>=10.3&&time<11.2)textAlpha=interval(time,10.5,11.2);
    else if(time>14.2&&time<14.8)textAlpha=1-interval(time,14.2,14.8);
    else if(time>=14.8&&time<15.5)textAlpha=interval(time,14.8,15.5);
    if(time>19.1)textAlpha=1-interval(time,19.1,19.9);
    if(time>23.2)textAlpha=interval(time,23.2,24);
    copy.style.opacity=textAlpha;copy.style.transform='translateY('+((1-textAlpha)*9)+'px)';
    const dark=interval(time,10.3,12)*(1-interval(time,19.4,20.6));
    const macroLight=1-interval(time,1,2.1),returnLight=interval(time,22.4,23.4);
    stage.style.setProperty('--stage-ink',lerpColor(C.ink,C.paper,Math.max(dark,macroLight,returnLight)));
    stage.style.setProperty('--stage-accent',lerpColor(C.teal,C.mint,Math.max(dark,macroLight,returnLight)));
    output.style.opacity=interval(time,12.8,13.2)*(1-interval(time,14.5,15));
    channels.style.opacity=interval(time,16,16.5)*(1-interval(time,19,19.6));
    sideLabel.style.opacity=.7*interval(time,1.8,2.6)*(1-interval(time,4.8,5.5));
    caption.style.opacity=time>19.1&&time<23.2?1-interval(time,19.1,19.9):1;
    const bounds=[0,4.15,10.3,14.8,DURATION];chapters.forEach((b,i)=>b.style.setProperty('--progress',clamp((time-bounds[i])/(bounds[i+1]-bounds[i]))*100+'%'));
    const clockText='00:'+String(Math.floor(time)).padStart(2,'0')+' / 00:24';
    if(timer.textContent!==clockText)timer.textContent=clockText;
    const playText=playing?'Pausieren <span aria-hidden="true">Ⅱ</span>':time>=DURATION?'Noch einmal <span aria-hidden="true">↗</span>':time>0?'Fortsetzen <span aria-hidden="true">↗</span>':'Film starten <span aria-hidden="true">↗</span>';
    if(play.innerHTML!==playText)play.innerHTML=playText;
    const statusText=playing?(loopInput.checked?'LOOP LÄUFT':'FILM LÄUFT'):(time===0?'BEREIT':time>=DURATION?'ENDE':'PAUSIERT');
    if(status.textContent!==statusText)status.textContent=statusText;
    root.dataset.time=time.toFixed(2);root.dataset.loopCount=String(loopCount);
  }
  function schedule(){
    if(!disposed&&playing&&visible&&!document.hidden&&!raf)raf=requestAnimationFrame(tick);
  }
  function tick(now){
    raf=0;
    if(disposed||!playing||!visible||document.hidden){last=0;return;}
    const dt=last?Math.max(0,(now-last)/1000):0;last=now;t+=dt*design.tempo;
    drift.x=mix(drift.x,pointer.x,.05);drift.y=mix(drift.y,pointer.y,.05);
    if(t>=DURATION){if(loopInput.checked){loopCount+=Math.floor(t/DURATION);t=t%DURATION;}else{t=DURATION;playing=false;last=0;}}
    render(t);schedule();
  }
  function setPlaying(value){playing=value;last=0;cancelAnimationFrame(raf);raf=0;sync(t);schedule();}
  on(play,'click',()=>{if(t>=DURATION)t=0;setPlaying(!playing);});
  on(reset,'click',()=>{t=0;loopCount=0;render(t);setPlaying(true);});
  on(loopInput,'change',()=>sync(t));
  chapters.forEach((b,i)=>on(b,'click',()=>{t=[3.35,8.2,13.6,18.3][i];setPlaying(false);render(t);}));
  on(stage,'pointermove',e=>{if(e.pointerType!=='mouse'||media.matches)return;const r=stage.getBoundingClientRect();pointer={x:(e.clientX-r.left-r.width/2)/r.width*8,y:(e.clientY-r.top-r.height/2)/r.height*5};});
  on(stage,'pointerleave',()=>{pointer={x:0,y:0};});
  function resize(){dpr=Math.min(2,devicePixelRatio||1);canvas.width=720*dpr;canvas.height=540*dpr;render(t);}
  const resizeObserver=new ResizeObserver(resize);
  resizeObserver.observe(stage);
  const visibilityObserver=new IntersectionObserver(entries=>{
    const next=entries[0].isIntersecting;
    if(next!==visible){last=0;cancelAnimationFrame(raf);raf=0;}
    visible=next;schedule();
  },{threshold:.15});
  visibilityObserver.observe(stage);
  on(document,'visibilitychange',()=>{last=0;cancelAnimationFrame(raf);raf=0;schedule();});
  on(media,'change',e=>{if(e.matches){t=18.3;setPlaying(false);render(t);}});
  loopInput.checked=true;
  makeShots();resize();
  root.querySelectorAll('button,input').forEach(control=>{control.disabled=false;});
  root.dataset.ready='true';
  return ()=>{
    disposed=true;playing=false;cancelAnimationFrame(raf);raf=0;
    controller.abort();resizeObserver.disconnect();visibilityObserver.disconnect();
    root.querySelectorAll('button,input').forEach(control=>{control.disabled=true;});
    delete root.dataset.ready;
  };
}

