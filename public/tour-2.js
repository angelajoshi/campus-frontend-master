'use strict';

/* ══════════════════════════════════════════════════════════
   CANVAS TEXTURE GENERATORS
══════════════════════════════════════════════════════════ */
function makeGroundTexture() {
  const c = document.getElementById('ground-canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1e2535';
  ctx.fillRect(0,0,512,512);
  // Subtle grid
  ctx.strokeStyle = 'rgba(100,130,180,0.07)';
  ctx.lineWidth = 1;
  for(let i=0;i<=512;i+=32){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,512);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(512,i);ctx.stroke();}
  // Noise dots
  for(let i=0;i<3000;i++){ctx.fillStyle=`rgba(${80+Math.random()*40},${100+Math.random()*40},${140+Math.random()*40},${0.05+Math.random()*0.08})`;ctx.fillRect(Math.random()*512,Math.random()*512,1,1);}
  return c;
}

function makeWallTexture(r=42,g=55,b=88) {
  const c = document.getElementById('wall-canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0,0,512,512);
  // Horizontal coursing lines
  ctx.strokeStyle = `rgba(${r-10},${g-10},${b-10},0.4)`;
  ctx.lineWidth = 1;
  for(let y=0;y<512;y+=16){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y);ctx.stroke();}
  // Vertical joints offset per row
  ctx.strokeStyle = `rgba(${r-8},${g-8},${b-8},0.25)`;
  for(let row=0;row<32;row++){const off=row%2===0?0:32;for(let x=off;x<512;x+=64){ctx.beginPath();ctx.moveTo(x,row*16);ctx.lineTo(x,row*16+16);ctx.stroke();}}
  for(let i=0;i<2000;i++){ctx.fillStyle=`rgba(${r+Math.random()*20-10},${g+Math.random()*20-10},${b+Math.random()*20-10},0.06)`;ctx.fillRect(Math.random()*512,Math.random()*512,2,2);}
  return c;
}

function makeGlassTexture() {
  const c = document.getElementById('glass-canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0,0,256,256);
  g.addColorStop(0,'rgba(100,160,220,0.6)');
  g.addColorStop(0.5,'rgba(60,120,180,0.4)');
  g.addColorStop(1,'rgba(80,140,200,0.55)');
  ctx.fillStyle = g; ctx.fillRect(0,0,256,256);
  // Reflection streaks
  ctx.strokeStyle='rgba(255,255,255,0.12)';ctx.lineWidth=8;
  ctx.beginPath();ctx.moveTo(-20,60);ctx.lineTo(100,256);ctx.stroke();
  ctx.beginPath();ctx.moveTo(80,0);ctx.lineTo(200,256);ctx.stroke();
  // Grid lines
  ctx.strokeStyle='rgba(100,160,220,0.25)';ctx.lineWidth=1;
  for(let i=0;i<256;i+=32){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,256);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(256,i);ctx.stroke();}
  return c;
}

function makeRoofTexture() {
  const c = document.getElementById('roof-canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1a2535';
  ctx.fillRect(0,0,256,256);
  ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=1;
  for(let i=0;i<256;i+=24){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,256);ctx.stroke();}
  for(let i=0;i<256;i+=24){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(256,i);ctx.stroke();}
  return c;
}

/* ══════════════════════════════════════════════════════════
   TOUR DATA
══════════════════════════════════════════════════════════ */
const TOUR_STOPS = [
  { id:'entrance',  pos:[0,0,8],    camRotY:180, title:'Main Entrance Gate',  isLibrary:false,
    desc:'The grand entrance to TCET campus. Flanked by twin pillars with the college crest, this gateway opens to tree-lined pathways leading to the heart of campus.',
    stats:[{k:'Est.',v:'1983'},{k:'Area',v:'25 Acres'},{k:'Students',v:'5,000+'}] },
  { id:'fountain',  pos:[0,0,-12],  camRotY:0,   title:'Central Fountain Plaza', isLibrary:false,
    desc:'The iconic fountain at the heart of campus — a popular meeting point for students. Surrounded by manicured gardens and benches.',
    stats:[{k:'Type',v:'Central Hub'},{k:'Gardens',v:'4 zones'}] },
  { id:'academic',  pos:[0,0,-18],  camRotY:0,   title:'Main Academic Block', isLibrary:false,
    desc:'The primary academic building houses 60+ lecture halls, faculty offices, the administrative wing, and the principal\'s office across five floors.',
    stats:[{k:'Floors',v:'5'},{k:'Halls',v:'60+'},{k:'Built',v:'1985'}] },
  { id:'library',   pos:[-20,0,-12],camRotY:90,  title:'Central Library',     isLibrary:true,
    desc:'A four-storey library with 80,000+ volumes, 200+ digital research terminals, e-journal subscriptions, and a serene reading lounge. Browse books directly from here!',
    stats:[{k:'Volumes',v:'80,000+'},{k:'Floors',v:'4'},{k:'Seats',v:'400'}] },
  { id:'auditorium',pos:[18,0,-14], camRotY:-90, title:'Auditorium',          isLibrary:false,
    desc:'A state-of-the-art 1,200-seat auditorium with a signature dome, hosting convocations, TEDx talks, cultural fests, and national seminars.',
    stats:[{k:'Capacity',v:'1,200'},{k:'Screen',v:'4K+'},{k:'AC',v:'Full'}] },
  { id:'labs',      pos:[0,0,-40],  camRotY:0,   title:'Computer Labs',       isLibrary:false,
    desc:'Advanced computing spanning 8 labs with 400+ workstations, VR/AR research bays, GPU clusters for ML/AI, and a 24×7 server room.',
    stats:[{k:'Labs',v:'8'},{k:'Systems',v:'400+'},{k:'GPU Nodes',v:'12'}] },
  { id:'sports',    pos:[-20,0,-36],camRotY:90,  title:'Sports Complex',      isLibrary:false,
    desc:'Multi-sport complex featuring basketball, volleyball, 400m athletic track, and covered spectator stands for 800 fans.',
    stats:[{k:'Courts',v:'4'},{k:'Track',v:'400m'},{k:'Stands',v:'800 seats'}] },
  { id:'canteen',   pos:[16,0,-28], camRotY:-90, title:'Central Canteen',     isLibrary:false,
    desc:'Serving 2,000+ students daily with a diverse menu of Indian cuisines, indoor dining, outdoor seating garden, and quick-service counter.',
    stats:[{k:'Capacity',v:'300'},{k:'Cuisines',v:'6+'},{k:'Daily',v:'2,000+'}] },
];

const WORLD_BOUNDS = { minX:-34, maxX:34, minZ:-54, maxZ:14 };
const LIBRARY_POS  = { x:-20, z:-12 };
const LIB_RADIUS   = 9;

/* ══════════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════════ */
let currentStopIdx = -1, isNight=false, isRain=false, isFog=false;
let isARMode=false, minimapVisible=true, moveSpeed=4, showLabels=true;
let arStream=null, nearLibrary=false;
const Tour = { active:false, paused:false, index:0, timer:null, delay:8000 };
const LibState = { books:[], total:0, page:1, limit:12, search:'', department:'', year:'', loading:false, currentBook:null };

/* ══════════════════════════════════════════════════════════
   SCENE ENTITY HELPER
══════════════════════════════════════════════════════════ */
function el(tag, attrs={}, children=[]) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k, v));
  children.forEach(c => e.appendChild(c));
  return e;
}
function addTo(scene, entity) { scene.appendChild(entity); return entity; }

/* ══════════════════════════════════════════════════════════
   SMOOTH MOVEMENT COMPONENT
══════════════════════════════════════════════════════════ */
AFRAME.registerComponent('smooth-movement', {
  schema: { speed:{ type:'number', default:4 } },
  init() {
    this.keys={}; this.vel=new THREE.Vector3();
    this.camDir=new THREE.Vector3(); this.rightDir=new THREE.Vector3();
    this.UP=new THREE.Vector3(0,1,0);
    this._kd = e=>{this.keys[e.code]=true};
    this._ku = e=>{this.keys[e.code]=false};
    window.addEventListener('keydown',this._kd);
    window.addEventListener('keyup',this._ku);
  },
  tick(_,delta) {
    const dt=Math.min(delta,100)/1000;
    const cam=this.el.querySelector('[camera]');
    if(!cam)return;
    cam.object3D.getWorldDirection(this.camDir);
    this.camDir.y=0; this.camDir.normalize();
    this.rightDir.crossVectors(this.camDir,this.UP).normalize();
    const sprint=(this.keys['ShiftLeft']||this.keys['ShiftRight'])?2.2:1;
    const spd=(this.data.speed||moveSpeed)*sprint*dt;
    this.vel.set(0,0,0);
    const k=this.keys;
    if(k['KeyW']||k['ArrowUp'])   this.vel.addScaledVector(this.camDir,-spd);
    if(k['KeyS']||k['ArrowDown']) this.vel.addScaledVector(this.camDir,spd);
    if(k['KeyA']||k['ArrowLeft']) this.vel.addScaledVector(this.rightDir,spd);
    if(k['KeyD']||k['ArrowRight'])this.vel.addScaledVector(this.rightDir,-spd);
    if(window._joystickVec){
      this.vel.addScaledVector(this.rightDir,window._joystickVec.x*spd*0.9);
      this.vel.addScaledVector(this.camDir,-window._joystickVec.y*spd*0.9);
    }
    if(this.vel.length()>0.001){
      const pos=this.el.getAttribute('position');
      const nx=Math.max(-38,Math.min(38,pos.x+this.vel.x));
      const nz=Math.max(-58,Math.min(14,pos.z+this.vel.z));
      this.el.setAttribute('position',{x:nx,y:pos.y,z:nz});
    }
  },
  remove(){
    window.removeEventListener('keydown',this._kd);
    window.removeEventListener('keyup',this._ku);
  }
});

/* ══════════════════════════════════════════════════════════
   SCENE BUILDER — RUNS ON DOMCONTENTLOADED
══════════════════════════════════════════════════════════ */
let rig,fadeEl,cam,sky,ambientLight,sunLight,fillLight;
let tbLocation,progressBar,infoCard,icTitle,icDesc,icStats,icGotoBtn,icLibBtn;
let narration,narTitle,narDesc,narCount;
let startBtn,pauseBtn,nextBtn,stopBtn,pauseIcon,pauseLabel;
let stopNavEl,minimapCanvas,minimapCtx,compassCanvas,compassCtx,modeBadge,libProximity;

document.addEventListener('DOMContentLoaded', () => {
  // Build textures
  makeGroundTexture();
  makeWallTexture();
  makeGlassTexture();
  makeRoofTexture();

  const scene = document.getElementById('main-scene');

  // Build the entire 3D world
  buildSky(scene);
  buildGround(scene);
  buildPaths(scene);
  buildSceneLights(scene);
  buildEntranceGate(scene);
  buildFountain(scene);
  buildAcademicBlock(scene);
  buildLibrary(scene);
  buildAuditorium(scene);
  buildComputerLabs(scene);
  buildSportsComplex(scene);
  buildCanteen(scene);
  buildTrees(scene);
  buildLamps(scene);
  buildBenches(scene);
  buildNoticeBoard(scene);
  buildBusStop(scene);
  buildParkingArea(scene);
  buildTeleportSpots(scene);
  buildHotspots(scene);

  // DOM refs
  rig          = document.getElementById('rig');
  fadeEl       = document.getElementById('fade');
  cam          = document.getElementById('cam');
  sky          = document.getElementById('sky');
  ambientLight = document.getElementById('ambient-light');
  sunLight     = document.getElementById('sun-light');
  fillLight    = document.getElementById('fill-light');
  tbLocation   = document.getElementById('tb-location');
  progressBar  = document.getElementById('progress-bar');
  infoCard     = document.getElementById('info-card');
  icTitle      = document.getElementById('ic-title');
  icDesc       = document.getElementById('ic-desc');
  icStats      = document.getElementById('ic-stats');
  icGotoBtn    = document.getElementById('ic-goto-btn');
  icLibBtn     = document.getElementById('ic-lib-btn');
  narration    = document.getElementById('narration');
  narTitle     = document.getElementById('nar-title');
  narDesc      = document.getElementById('nar-desc');
  narCount     = document.getElementById('nar-count');
  startBtn     = document.getElementById('start-btn');
  pauseBtn     = document.getElementById('pause-btn');
  nextBtn      = document.getElementById('next-btn');
  stopBtn      = document.getElementById('stop-btn');
  pauseIcon    = document.getElementById('pause-icon');
  pauseLabel   = document.getElementById('pause-label');
  stopNavEl    = document.getElementById('stop-nav');
  minimapCanvas= document.getElementById('minimap-canvas');
  minimapCtx   = minimapCanvas.getContext('2d');
  compassCanvas= document.getElementById('compass-canvas');
  compassCtx   = compassCanvas.getContext('2d');
  modeBadge    = document.getElementById('mode-badge');
  libProximity = document.getElementById('lib-proximity');

  buildStopDots();
  buildARAnnotations();
  initJoystick();
  initKeyboardShortcuts();
  minimapLoop();
  compassLoop();
  hudCoordsLoop();
  proximityLoop();

  showToast('🎓 Welcome to TCET! Press T for tour · L for Library · WASD to move');
});

/* ══════════════════════════════════════════════════════════
   SKY — gradient via shader
══════════════════════════════════════════════════════════ */
function buildSky(scene) {
  const s = el('a-sky',{id:'sky',color:'#b0c8e8',radius:600});
  scene.appendChild(s);
}

/* ══════════════════════════════════════════════════════════
   GROUND — canvas texture
══════════════════════════════════════════════════════════ */
function buildGround(scene) {
  const c = el('a-plane',{
    id:'ground',rotation:'-90 0 0',width:140,height:140,
    material:'src:#ground-canvas;repeat:14 14;roughness:0.95;metalness:0'
  });
  scene.appendChild(c);

  // Grass patches
  [[-30,-20],[-28,-38],[26,-20],[28,-40],[-2,-46],[2,-8]].forEach(([x,z])=>{
    scene.appendChild(el('a-plane',{
      rotation:'-90 0 0',width:8+Math.random()*4,height:6+Math.random()*4,
      position:`${x} 0.01 ${z}`,
      material:`color:#2a4a28;roughness:1;opacity:${0.6+Math.random()*0.3};transparent:true`
    }));
  });
}

/* ══════════════════════════════════════════════════════════
   PATHS — roads and walkways
══════════════════════════════════════════════════════════ */
function buildPaths(scene) {
  const paths = [
    {pos:'0 0.01 -20',   rot:'-90 0 0',w:5,  h:80,  c:'#2a3040'},
    {pos:'0 0.01 -20',   rot:'-90 0 0',w:70, h:5,   c:'#2a3040'},
    {pos:'-10 0.01 -12', rot:'-90 0 0',w:20, h:3,   c:'#2a3040'},
  ];
  paths.forEach(p=>{
    scene.appendChild(el('a-plane',{
      position:p.pos,rotation:p.rot,width:p.w,height:p.h,
      material:`color:${p.c};roughness:1;opacity:0.9;transparent:true`
    }));
    // White edge lines
    scene.appendChild(el('a-plane',{
      position:p.pos.replace(/(\S+)\s/,'$1 ').replace(/0\.01/,'0.015'),
      rotation:p.rot,
      width:p.w+0.2,height:0.12,
      material:'color:#4a5570;roughness:1;opacity:0.5;transparent:true'
    }));
  });

  // Centre-line dashes
  for(let z=10;z>-55;z-=4){
    scene.appendChild(el('a-plane',{
      position:`0 0.016 ${z}`,rotation:'-90 0 0',width:0.1,height:2,
      material:'color:#e8b84b;roughness:1;emissive:#e8b84b;emissiveIntensity:0.3;opacity:0.4;transparent:true'
    }));
  }
}

/* ══════════════════════════════════════════════════════════
   SCENE LIGHTS
══════════════════════════════════════════════════════════ */
function buildSceneLights(scene) {
  scene.appendChild(el('a-light',{id:'ambient-light',type:'ambient',color:'#c8d6e8',intensity:'0.6'}));
  scene.appendChild(el('a-light',{id:'sun-light',    type:'directional',color:'#fff5e0',intensity:'1.4',position:'12 20 8','cast-shadow':true,'shadow-mapSize':'2048 2048','shadow-camera-far':'80'}));
  scene.appendChild(el('a-light',{id:'fill-light',   type:'hemisphere', color:'#c0d8ff','ground-color':'#3d2e10',intensity:'0.5'}));
  scene.appendChild(el('a-light',{                    type:'directional',color:'#d0e0f8',intensity:'0.3',position:'-6 10 -12'}));
}

/* ══════════════════════════════════════════════════════════
   ENTRANCE GATE — enhanced columns, arch, crest
══════════════════════════════════════════════════════════ */
function buildEntranceGate(scene) {
  const g = el('a-entity',{position:'0 0 8'});

  // Columns with detail rings
  [[-4.5,4.5]].forEach(([lx,rx])=>{
    [lx,rx].forEach(cx=>{
      g.appendChild(el('a-cylinder',{position:`${cx} 4 0`,radius:'0.7',height:'8',color:'#c8b88a',material:'roughness:0.7;metalness:0.15;src:#wall-canvas'}));
      // Capital
      g.appendChild(el('a-box',{position:`${cx} 8.1 0`,width:'1.8',height:'0.3',depth:'1.8',color:'#d4c090',material:'roughness:0.6'}));
      // Base
      g.appendChild(el('a-box',{position:`${cx} 0.2 0`,width:'1.8',height:'0.4',depth:'1.8',color:'#d4c090',material:'roughness:0.6'}));
      // Detail rings
      [2,4,6].forEach(ry=>{
        g.appendChild(el('a-torus',{position:`${cx} ${ry} 0`,rotation:'90 0 0',radius:'0.72','radius-tubular':'0.06',color:'#b8a870',material:'roughness:0.5;metalness:0.2'}));
      });
      // Crest sphere on top
      g.appendChild(el('a-sphere',{position:`${cx} 8.6 0`,radius:'0.45',color:'#e8b84b',material:'emissive:#e8b84b;emissiveIntensity:0.8;roughness:0.2;metalness:0.6'}));
      g.appendChild(el('a-light',{type:'point',position:`${cx} 8.6 0`,color:'#ffe8a0',intensity:'0.8',distance:'12'}));
    });
  });

  // Arch beam
  g.appendChild(el('a-box',{position:'0 8.3 0',width:'11.5',height:'0.6',depth:'1.2',color:'#b8a870',material:'roughness:0.65;src:#wall-canvas'}));
  // Arch sign panel
  g.appendChild(el('a-box',{position:'0 7.5 0',width:'9',height:'1.2',depth:'0.3',color:'#0a1628',material:'roughness:0.8'}));
  g.appendChild(el('a-text',{value:'THAKUR COLLEGE OF ENGINEERING & TECHNOLOGY',position:'0 7.5 0.16',align:'center',color:'#e8b84b',width:'7.5',font:'dejavu'}));

  // Sub-text
  g.appendChild(el('a-text',{value:'Est. 1983 · Mumbai',position:'0 6.8 0.16',align:'center',color:'#ffd87a',width:'4.5',font:'dejavu'}));

  // Gates
  [[-2,2]].forEach(([lx,rx])=>{
    [lx,rx].forEach(gx=>{
      g.appendChild(el('a-box',{position:`${gx} 3 0`,width:'1.8',height:'6',depth:'0.12',color:'#2a3550',material:'opacity:0.85;transparent:true;roughness:0.4;metalness:0.7'}));
      // Gate bars
      for(let bi=-0.7;bi<=0.7;bi+=0.35){
        g.appendChild(el('a-cylinder',{position:`${gx+bi} 3 0`,radius:'0.04',height:'5.8',color:'#8899bb',material:'roughness:0.3;metalness:0.8'}));
      }
    });
  });

  // Ground stripes
  g.appendChild(el('a-plane',{position:'0 0.02 0',rotation:'-90 0 0',width:'9',height:'1.8',material:'color:#e8c050;opacity:0.4;transparent:true;roughness:1'}));

  scene.appendChild(g);
}

/* ══════════════════════════════════════════════════════════
   FOUNTAIN — animated, layered
══════════════════════════════════════════════════════════ */
function buildFountain(scene) {
  const g = el('a-entity',{position:'0 0 -12'});

  // Outer basin
  g.appendChild(el('a-cylinder',{position:'0 0.2 0',radius:'4.5',height:'0.55',color:'#8090a8',material:'roughness:0.3;metalness:0.5'}));
  // Inner basin
  g.appendChild(el('a-cylinder',{position:'0 0.38 0',radius:'4.2',height:'0.22',color:'#3a8aaa',material:'opacity:0.65;transparent:true;emissive:#2266aa;emissiveIntensity:0.25;roughness:0.1'}));

  // Water rings (animated)
  [1.5,2.5,3.5].forEach((r,i)=>{
    g.appendChild(el('a-torus',{
      position:`0 0.5 0`,rotation:'-90 0 0',radius:`${r}`,
      'radius-tubular':'0.04',color:'#66ccff',
      material:`opacity:${0.5-i*0.1};transparent:true;emissive:#44aaee;emissiveIntensity:${0.4-i*0.1}`,
      animation:`property:rotation;from:-90 0 0;to:-90 360 0;dur:${4000+i*1500};loop:true;easing:linear`
    }));
  });

  // Central pillar
  g.appendChild(el('a-cylinder',{position:'0 1.8 0',radius:'0.45',height:'3.6',color:'#9aaabb',material:'roughness:0.3;metalness:0.5'}));
  g.appendChild(el('a-cylinder',{position:'0 3.8 0',radius:'1.8',height:'0.25',color:'#8898aa',material:'roughness:0.35'}));
  g.appendChild(el('a-cylinder',{position:'0 4.2 0',radius:'0.32',height:'2',  color:'#9aaabb',material:'roughness:0.3;metalness:0.5'}));
  g.appendChild(el('a-cylinder',{position:'0 5.3 0',radius:'1',  height:'0.2', color:'#8898aa',material:'roughness:0.35'}));
  g.appendChild(el('a-cylinder',{position:'0 5.55 0',radius:'0.22',height:'1.2',color:'#9aaabb',material:'roughness:0.3'}));

  // Top nozzle
  g.appendChild(el('a-sphere',{position:'0 6.4 0',radius:'0.25',color:'#00ccff',
    material:'emissive:#00aaee;emissiveIntensity:0.8;opacity:0.8;transparent:true',
    animation:'property:material.emissiveIntensity;from:0.4;to:1.2;dir:alternate;dur:800;loop:true;easing:easeInOutSine'
  }));

  // Water spray particles (cylinders dropping)
  for(let i=0;i<12;i++){
    const angle = (i/12)*Math.PI*2;
    const r = 1.2, speed = 1000+Math.random()*400;
    const x = Math.sin(angle)*r, z = Math.cos(angle)*r;
    g.appendChild(el('a-cylinder',{
      position:`${x} 5.8 ${z}`,radius:'0.025',height:'0.6',
      color:'#88ddff',material:`opacity:0.6;transparent:true;emissive:#44aadd;emissiveIntensity:0.4`,
      animation:`property:position;from:${x} 5.8 ${z};to:${x*2.5} 0.5 ${z*2.5};dur:${speed};loop:true;easing:easeInQuad`
    }));
  }

  g.appendChild(el('a-light',{type:'point',position:'0 2 0',color:'#44aaff',intensity:'0.9',distance:'12'}));
  scene.appendChild(g);
}

/* ══════════════════════════════════════════════════════════
   ACADEMIC BLOCK — detailed facade
══════════════════════════════════════════════════════════ */
function buildAcademicBlock(scene) {
  const g = el('a-entity',{position:'0 0 -24'});

  // Main body
  g.appendChild(el('a-box',{position:'0 5.5 0',width:'30',height:'11',depth:'10',
    material:'color:#2e3d5c;roughness:0.8;metalness:0.1;src:#wall-canvas'}));

  // Horizontal floor bands
  [2.5,5.5,8.5].forEach(y=>{
    g.appendChild(el('a-box',{position:`0 ${y} -5.1`,width:'30.5',height:'0.2',depth:'0.15',
      color:'#4a5a7a',material:'roughness:0.6;metalness:0.2'}));
  });

  // Roof parapet
  g.appendChild(el('a-box',{position:'0 11.3 0',width:'31',height:'0.6',depth:'10.6',
    color:'#3a4d6c',material:'roughness:0.7;src:#roof-canvas'}));
  // Roof accent stripe
  g.appendChild(el('a-box',{position:'0 11.65 -5.2',width:'28',height:'0.18',depth:'0.2',
    color:'#e8b84b',material:'emissive:#e8b84b;emissiveIntensity:0.4;roughness:0.3'}));

  // Windows — 3 floors × 6 windows
  const winCols=[-11,-6.6,-2.2,2.2,6.6,11];
  [3,6,9].forEach(wy=>{
    winCols.forEach(wx=>{
      // Frame
      g.appendChild(el('a-box',{position:`${wx} ${wy} -5.1`,width:'2.8',height:'1.9',depth:'0.12',
        color:'#1a2a40',material:'roughness:0.5'}));
      // Glass
      g.appendChild(el('a-box',{position:`${wx} ${wy} -5.08`,width:'2.4',height:'1.55',depth:'0.08',
        material:'color:#6699cc;opacity:0.55;transparent:true;emissive:#4477aa;emissiveIntensity:0.3;roughness:0.05;metalness:0.4;src:#glass-canvas'}));
      // Window sill
      g.appendChild(el('a-box',{position:`${wx} ${wy-0.95} -5.02`,width:'2.9',height:'0.1',depth:'0.25',
        color:'#4a5a7a',material:'roughness:0.6'}));
    });
  });

  // Entrance portico columns
  [-5,-2.5,0,2.5,5].forEach(cx=>{
    g.appendChild(el('a-cylinder',{position:`${cx} 2 -5.5`,radius:'0.22',height:'4',
      color:'#c8b88a',material:'roughness:0.7;metalness:0.1'}));
  });
  g.appendChild(el('a-box',{position:'0 4.2 -5.5',width:'13',height:'0.4',depth:'0.5',
    color:'#b8a870',material:'roughness:0.6'}));

  // Sign board
  g.appendChild(el('a-box',{position:'0 10.8 -5.12',width:'16',height:'0.9',depth:'0.12',color:'#0a1628'}));
  g.appendChild(el('a-text',{value:'MAIN ACADEMIC BLOCK',position:'0 10.8 -5.06',align:'center',color:'#e8b84b',width:'8',font:'dejavu'}));

  // Main door
  g.appendChild(el('a-box',{position:'0 1.5 -5.1',width:'3.5',height:'3',depth:'0.15',
    color:'#1a2a3a',material:'roughness:0.4;metalness:0.5'}));
  g.appendChild(el('a-box',{position:'0 1.5 -5.06',width:'3',height:'2.6',depth:'0.06',
    material:'color:#66aacc;opacity:0.45;transparent:true;emissive:#4488aa;emissiveIntensity:0.25;roughness:0.05;src:#glass-canvas'}));

  scene.appendChild(g);
}

/* ══════════════════════════════════════════════════════════
   LIBRARY — glass curtain wall, bookshelves, glow portal
══════════════════════════════════════════════════════════ */
function buildLibrary(scene) {
  const g = el('a-entity',{position:'-20 0 -12',id:'library-entity'});

  // Main structure
  g.appendChild(el('a-box',{position:'0 6 0',width:'17',height:'12',depth:'8',
    material:'color:#1e2e48;roughness:0.75;metalness:0.2;src:#wall-canvas'}));

  // Glass curtain wall facade (south face)
  const gcols = [-6,-3,0,3,6];
  [2,5,8,11].forEach(wy=>{
    gcols.forEach(wx=>{
      g.appendChild(el('a-box',{position:`${wx} ${wy} -4.1`,width:'2.4',height:'2.6',depth:'0.12',
        material:'color:#004466;roughness:0.05;metalness:0.3;opacity:0.6;transparent:true;emissive:#003355;emissiveIntensity:0.4;src:#glass-canvas'}));
      g.appendChild(el('a-box',{position:`${wx} ${wy} -4.15`,width:'2.6',height:'2.8',depth:'0.06',
        color:'#1a2e44',material:'roughness:0.7'}));
    });
  });

  // Facade vertical fins (structural look)
  [-7,-4.5,-2,0,2,4.5,7].forEach(fx=>{
    g.appendChild(el('a-box',{position:`${fx} 6.5 -4.2`,width:'0.2',height:'13',depth:'0.35',
      color:'#344466',material:'roughness:0.5;metalness:0.4'}));
  });

  // Roof — flat with parapet + mechanical
  g.appendChild(el('a-box',{position:'0 12.4 0',width:'17.5',height:'0.6',depth:'8.6',
    color:'#243050',material:'roughness:0.8;src:#roof-canvas'}));
  g.appendChild(el('a-box',{position:'0 12.75 -4.3',width:'15',height:'0.2',depth:'0.3',
    color:'#00d8ff',material:'emissive:#00d8ff;emissiveIntensity:0.7'}));
  // AC units on roof
  [[-5,0],[ 5,0],[ 0,2]].forEach(([rx,rz])=>{
    g.appendChild(el('a-box',{position:`${rx} 12.9 ${rz}`,width:'2',height:'0.8',depth:'1.4',
      color:'#607080',material:'roughness:0.4;metalness:0.6'}));
  });

  // Sign
  g.appendChild(el('a-box',{position:'0 11.9 -4.15',width:'12',height:'1',depth:'0.1',color:'#081420'}));
  g.appendChild(el('a-text',{value:'CENTRAL LIBRARY',position:'0 11.9 -4.1',align:'center',color:'#00d8ff',width:'5.5',font:'dejavu'}));

  // Floating book + glow
  g.appendChild(el('a-text',{value:'📚',position:'0 14 -4',align:'center',width:'4',
    animation:'property:position;from:0 14 -4;to:0 14.6 -4;dir:alternate;dur:1800;loop:true;easing:easeInOutSine'}));

  // Entrance canopy
  g.appendChild(el('a-box',{position:'0 4.5 -5',width:'6',height:'0.2',depth:'3',
    color:'#1a3050',material:'roughness:0.5;opacity:0.9;transparent:true'}));
  g.appendChild(el('a-cylinder',{position:'-2.5 2.5 -5.5',radius:'0.12',height:'5',color:'#607090',material:'roughness:0.3;metalness:0.7'}));
  g.appendChild(el('a-cylinder',{position:' 2.5 2.5 -5.5',radius:'0.12',height:'5',color:'#607090',material:'roughness:0.3;metalness:0.7'}));

  // Entry door
  g.appendChild(el('a-box',{position:'0 2 -4.12',width:'3',height:'4',depth:'0.08',
    material:'color:#001122;opacity:0.8;transparent:true;emissive:#002244;emissiveIntensity:0.3'}));
  g.appendChild(el('a-box',{position:'0 2 -4.08',width:'2.6',height:'3.6',depth:'0.04',
    material:'color:#00aadd;opacity:0.25;transparent:true;emissive:#0088bb;emissiveIntensity:0.4;src:#glass-canvas'}));

  // Interior bookshelves (visible through glass)
  const shelfColors=['#cc3333','#3366cc','#33aa33','#cc9900','#9933cc','#33ccaa','#cc6633','#6666cc'];
  [-5.5,0,5.5].forEach((sx,si)=>{
    g.appendChild(el('a-box',{position:`${sx} 4 2`,width:'1.1',height:'8',depth:'0.25',color:'#5a3a1a',material:'roughness:0.8'}));
    for(let bi=0;bi<8;bi++){
      g.appendChild(el('a-box',{position:`${sx} ${1+bi} 2.15`,width:'0.95',height:'0.7',depth:'0.55',
        color:shelfColors[(bi+si*3)%shelfColors.length],material:'roughness:0.6'}));
    }
    // Shelf boards
    [0,2,4,6,8].forEach(sy=>{
      g.appendChild(el('a-box',{position:`${sx} ${sy+0.4} 2.05`,width:'1.1',height:'0.08',depth:'0.65',color:'#3a2510',material:'roughness:0.7'}));
    });
  });

  // Reading desks inside
  [-3,0,3].forEach(dx=>{
    g.appendChild(el('a-box',{position:`${dx} 1.05 -1`,width:'2.5',height:'0.08',depth:'1',color:'#8b7355',material:'roughness:0.7'}));
    g.appendChild(el('a-box',{position:`${dx} 0.5 -1`,width:'0.08',height:'1',depth:'0.08',color:'#6a5235',material:'roughness:0.8'}));
    // Monitor glow on desk
    g.appendChild(el('a-box',{position:`${dx} 1.5 -1.1`,width:'0.7',height:'0.45',depth:'0.04',
      material:'color:#00ccff;opacity:0.8;transparent:true;emissive:#0088cc;emissiveIntensity:0.8'}));
  });

  // Interior lights
  [-4,0,4].forEach(lx=>{
    g.appendChild(el('a-light',{type:'point',position:`${lx} 6 -1`,color:'#cce8ff',intensity:'0.6',distance:'10'}));
  });

  // Exterior cyan glow light
  g.appendChild(el('a-light',{type:'point',position:'0 5 -5',color:'#00aadd',intensity:'0.8',distance:'16'}));

  // Portal glow ring (clickable)
  g.appendChild(el('a-torus',{
    position:'0 2 -4.5',rotation:'0 0 0',radius:'2.2','radius-tubular':'0.06',
    color:'#00d8ff',material:'emissive:#00d8ff;emissiveIntensity:0.9;opacity:0.85;transparent:true',
    animation:'property:material.emissiveIntensity;from:0.4;to:1.2;dir:alternate;dur:1200;loop:true;easing:easeInOutSine',
    class:'clickable'
  })).addEventListener('click', ()=>openLibraryOverlay());

  // Second smaller ring
  g.appendChild(el('a-torus',{
    position:'0 2 -4.5',rotation:'0 45 90',radius:'1.6','radius-tubular':'0.03',
    color:'#e8b84b',material:'emissive:#e8b84b;emissiveIntensity:0.5;opacity:0.5;transparent:true',
    animation:'property:rotation;from:0 45 90;to:360 45 90;dur:3000;loop:true;easing:linear'
  }));

  scene.appendChild(g);
}

/* ══════════════════════════════════════════════════════════
   AUDITORIUM — dome, curtain walls
══════════════════════════════════════════════════════════ */
function buildAuditorium(scene) {
  const g = el('a-entity',{position:'18 0 -14'});

  g.appendChild(el('a-box',{position:'0 6.5 0',width:'20',height:'13',depth:'18',
    material:'color:#243040;roughness:0.8;metalness:0.1;src:#wall-canvas'}));

  // Dome
  g.appendChild(el('a-sphere',{position:'0 15.5 0',radius:'8.5',
    material:'color:#1c2a3e;roughness:0.7;metalness:0.2','segments-height':'12','segments-width':'16',
    'phi-start':'0','phi-length':'180'}));

  // Dome ribs
  for(let i=0;i<8;i++){
    const angle=i*45;
    g.appendChild(el('a-torus',{
      position:'0 15.5 0',rotation:`0 ${angle} 90`,radius:'8.5','radius-tubular':'0.08',
      color:'#344460',material:'roughness:0.5;metalness:0.3',
      'arc':'180','theta-start':'0'
    }));
  }
  // Dome top light
  g.appendChild(el('a-sphere',{position:'0 24 0',radius:'0.6',
    color:'#ffe8a0',material:'emissive:#ffe8a0;emissiveIntensity:1'}));
  g.appendChild(el('a-light',{type:'point',position:'0 24 0',color:'#ffe8a0',intensity:'1.2',distance:'30'}));

  // Roof ring
  g.appendChild(el('a-cylinder',{position:'0 13.5 0',radius:'9',height:'0.5',
    color:'#2e3f58',material:'roughness:0.7'}));

  // Front marquee
  g.appendChild(el('a-box',{position:'0 12.5 -9.15',width:'14',height:'0.8',depth:'0.15',color:'#0a1628'}));
  g.appendChild(el('a-text',{value:'AUDITORIUM',position:'0 12.5 -9.1',align:'center',color:'#e8b84b',width:'5',font:'dejavu'}));

  // Windows
  [[-7,-3,3,7]].flat().forEach(wx=>{
    g.appendChild(el('a-box',{position:`${wx} 8 -9.12`,width:'2.5',height:'3',depth:'0.12',color:'#1a2a3a'}));
    g.appendChild(el('a-box',{position:`${wx} 8 -9.08`,width:'2.1',height:'2.6',depth:'0.06',
      material:'color:#4488aa;opacity:0.55;transparent:true;emissive:#336688;emissiveIntensity:0.4;src:#glass-canvas'}));
  });

  // Entrance columns
  [-3,0,3].forEach(cx=>{
    g.appendChild(el('a-cylinder',{position:`${cx} 3 -9.5`,radius:'0.3',height:'6',color:'#c0b070',material:'roughness:0.6'}));
  });
  g.appendChild(el('a-box',{position:'0 6.2 -9.5',width:'9',height:'0.4',depth:'0.6',color:'#b0a060',material:'roughness:0.6'}));

  // Doors
  [[-1.2,1.2]].flat().forEach(dx=>{
    g.appendChild(el('a-box',{position:`${dx} 1.8 -9.1`,width:'1.5',height:'3.6',depth:'0.1',
      material:'color:#001122;opacity:0.8;transparent:true'}));
  });

  scene.appendChild(g);
}

/* ══════════════════════════════════════════════════════════
   COMPUTER LABS — modern glass facade
══════════════════════════════════════════════════════════ */
function buildComputerLabs(scene) {
  const g = el('a-entity',{position:'0 0 -40'});

  g.appendChild(el('a-box',{position:'0 5 0',width:'22',height:'10',depth:'10',
    material:'color:#1a2840;roughness:0.75;metalness:0.25;src:#wall-canvas'}));

  // Roof
  g.appendChild(el('a-box',{position:'0 10.3 0',width:'22.5',height:'0.5',depth:'10.5',color:'#253450',material:'roughness:0.7;src:#roof-canvas'}));
  g.appendChild(el('a-box',{position:'0 10.6 -5.15',width:'20',height:'0.18',depth:'0.2',
    color:'#00d8ff',material:'emissive:#00d8ff;emissiveIntensity:0.5'}));

  // Full-width glass panels — 4 wide
  [-7.5,-2.5,2.5,7.5].forEach(wx=>{
    [3,7].forEach(wy=>{
      g.appendChild(el('a-box',{position:`${wx} ${wy} -5.12`,width:'4.2',height:'3.2',depth:'0.1',color:'#1a3048'}));
      g.appendChild(el('a-box',{position:`${wx} ${wy} -5.06`,width:'3.8',height:'2.8',depth:'0.06',
        material:'color:#003355;opacity:0.65;transparent:true;emissive:#00558a;emissiveIntensity:0.4;src:#glass-canvas'}));
    });
  });

  // Vertical dividers
  [-9.5,-5,-0.5,4.5,9.5].forEach(dx=>{
    g.appendChild(el('a-box',{position:`${dx} 5.5 -5.12`,width:'0.3',height:'11',depth:'0.2',color:'#344466',material:'roughness:0.5;metalness:0.4'}));
  });

  // Sign
  g.appendChild(el('a-box',{position:'0 10 -5.13',width:'14',height:'0.8',depth:'0.1',color:'#081428'}));
  g.appendChild(el('a-text',{value:'COMPUTER LABS — GPU CLUSTER',position:'0 10 -5.08',align:'center',color:'#00d8ff',width:'7',font:'dejavu'}));

  // Server room glow
  g.appendChild(el('a-box',{position:'0 5 4.5',width:'6',height:'8',depth:'1',
    material:'color:#001a33;opacity:0.9;transparent:true;emissive:#003366;emissiveIntensity:0.4'}));
  g.appendChild(el('a-light',{type:'point',position:'0 5 4',color:'#0044ff',intensity:'0.6',distance:'8'}));

  // Server rack LEDs
  for(let i=0;i<12;i++){
    const col=i%2===0?'#00ff88':'#0088ff';
    g.appendChild(el('a-box',{position:`${-2.5+i*0.4} 5 4.52`,width:'0.08',height:'0.08',depth:'0.04',
      material:`color:${col};emissive:${col};emissiveIntensity:1`}));
  }

  g.appendChild(el('a-light',{type:'point',position:'0 6 -4',color:'#4488ff',intensity:'0.7',distance:'14'}));

  scene.appendChild(g);
}

/* ══════════════════════════════════════════════════════════
   SPORTS COMPLEX
══════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════
   SPORTS COMPLEX  —  FIXED
   
   BUG FIXED:
   The `target` attribute on <a-light type="spot"> was being set to a
   raw position string like "4.5 0 10" or "-4.5 0 -10".
   A-Frame internally calls document.querySelector(value) on that string,
   which throws:
       SyntaxError: Failed to execute 'querySelector' on 'Document':
       '4.5 0 10' is not a valid selector.
   
   FIX:
   Removed the `target` attribute entirely.
   Instead, we compute the correct `rotation` (rx, ry) angles that aim
   each spotlight from its pole position (fx, 16, fz) toward the field
   centre (0, 0, 0), which achieves the same visual result with zero errors.
══════════════════════════════════════════════════════════ */
function buildSportsComplex(scene) {
  const g = el('a-entity', { position: '-20 0 -36' });

  // Main walls
  g.appendChild(el('a-box', {
    position: '0 4.5 0', width: '20', height: '9', depth: '24',
    material: 'color:#243528;roughness:0.9;src:#wall-canvas'
  }));

  // Roof
  g.appendChild(el('a-box', {
    position: '0 9.2 0', width: '20.5', height: '0.4', depth: '24.5',
    color: '#2e4030', material: 'roughness:0.8;src:#roof-canvas'
  }));

  // Playing field
  g.appendChild(el('a-plane', {
    position: '0 0.02 0', rotation: '-90 0 0', width: '16', height: '20',
    material: 'color:#2a5020;roughness:1'
  }));

  // Field lines
  g.appendChild(el('a-plane', {
    position: '0 0.03 0', rotation: '-90 0 0', width: '16', height: '0.12',
    material: 'color:#fff;roughness:1;opacity:0.7;transparent:true'
  }));
  g.appendChild(el('a-plane', {
    position: '0 0.03 5', rotation: '-90 0 0', width: '16', height: '0.1',
    material: 'color:#fff;roughness:1;opacity:0.5;transparent:true'
  }));
  g.appendChild(el('a-plane', {
    position: '0 0.03 -5', rotation: '-90 0 0', width: '16', height: '0.1',
    material: 'color:#fff;roughness:1;opacity:0.5;transparent:true'
  }));

  // Centre circle
  g.appendChild(el('a-torus', {
    position: '0 0.04 0', rotation: '-90 0 0', radius: '3', 'radius-tubular': '0.06',
    color: '#fff', material: 'opacity:0.6;transparent:true;roughness:1'
  }));

  // ── FLOOD LIGHTS (FIXED) ─────────────────────────────────────────────────
  // OLD (BROKEN): target:`${-fx*0.5} 0 ${fz}`
  //   → A-Frame does document.querySelector("4.5 0 10") → SyntaxError crash
  //
  // NEW (FIXED): compute rotation angles to aim spotlight at field centre (0,0,0)
  //   ry = yaw   — rotates the light horizontally to face the centre
  //   rx = pitch — tilts the light downward toward the ground
  // ────────────────────────────────────────────────────────────────────────
  [[-9, 10], [9, 10], [-9, -10], [9, -10]].forEach(([fx, fz]) => {
    // Pole
    g.appendChild(el('a-cylinder', {
      position: `${fx} 8 ${fz}`, radius: '0.12', height: '16',
      color: '#606070', material: 'roughness:0.4;metalness:0.7'
    }));

    // Light housing bar on top of pole
    g.appendChild(el('a-box', {
      position: `${fx} 16.2 ${fz}`, width: '2', height: '0.4', depth: '0.4',
      color: '#ffeecc', material: 'emissive:#ffeecc;emissiveIntensity:0.8'
    }));

    // ── Compute rotation to aim from (fx, 16, fz) → (0, 0, 0) ──
    // ry: yaw angle so the spotlight faces toward the field centre
    const ry = Math.atan2(-fx, fz) * (180 / Math.PI);
    // rx: pitch angle so the spotlight tilts downward
    const dist = Math.sqrt(fx * fx + 16 * 16 + fz * fz);
    const rx = Math.asin(16 / dist) * (180 / Math.PI);

    // Spotlight — uses rotation instead of invalid `target`
    g.appendChild(el('a-light', {
      type: 'spot',
      position: `${fx} 16 ${fz}`,
      rotation: `${rx.toFixed(1)} ${ry.toFixed(1)} 0`,   // ← THE FIX
      color: '#ffe8a0',
      intensity: '1.5',
      angle: '35',
      penumbra: '0.4'
      // REMOVED: target:`${-fx*0.5} 0 ${fz}`  ← this was the bug
    }));
  });

  // Sign board on the side wall
  g.appendChild(el('a-box', {
    position: '10.15 7 0', width: '0.1', height: '1', depth: '8',
    color: '#0a1628'
  }));
  g.appendChild(el('a-text', {
    value: 'SPORTS COMPLEX', position: '10.2 7 0', rotation: '0 -90 0',
    align: 'center', color: '#e8b84b', width: '4', font: 'dejavu'
  }));

  // Goal posts (4 corners)
  [[-7.8, 8], [7.8, 8], [-7.8, -8], [7.8, -8]].forEach(([gx, gz]) => {
    g.appendChild(el('a-cylinder', {
      position: `${gx} 2 ${gz}`, radius: '0.06', height: '4',
      color: '#fff', material: 'roughness:0.3'
    }));
  });

  scene.appendChild(g);
}

/* ══════════════════════════════════════════════════════════
   CANTEEN
══════════════════════════════════════════════════════════ */
function buildCanteen(scene) {
  const g = el('a-entity',{position:'16 0 -28'});

  g.appendChild(el('a-box',{position:'0 4 0',width:'15',height:'8',depth:'11',
    material:'color:#3a3028;roughness:0.85;src:#wall-canvas'}));

  // Pitched roof
  [[-3.5,3.5]].flat().forEach(rx=>{
    g.appendChild(el('a-cone',{position:`${rx} 10.5 0`,radius:0.1,'radius-bottom':'3.2',height:'4',
      color:'#5a3020',material:'roughness:0.9','open-ended':false}));
  });
  g.appendChild(el('a-box',{position:'0 9 0',width:'15.5',height:'0.4',depth:'11.5',color:'#4a3525',material:'roughness:0.8'}));

  // Outdoor seating
  [[-3,0,3]].flat().forEach(tx=>{
    g.appendChild(el('a-cylinder',{position:`${tx} 0.9 -7.5`,radius:'1.5',height:'0.06',color:'#8b7355',material:'roughness:0.7'}));
    g.appendChild(el('a-cylinder',{position:`${tx} 0 -7.5`,radius:'0.05',height:'1.8',color:'#7a6035',material:'roughness:0.7'}));
    [0,60,120,180,240,300].forEach(angle=>{
      const bx=tx+Math.sin(angle*Math.PI/180)*1.1, bz=-7.5+Math.cos(angle*Math.PI/180)*1.1;
      g.appendChild(el('a-box',{position:`${bx} 0.5 ${bz}`,width:'0.4',height:'0.06',depth:'0.4',color:'#7a6035',material:'roughness:0.7'}));
    });
  });

  // Menu boards
  g.appendChild(el('a-box',{position:'0 6.5 -5.6',width:'8',height:'0.8',depth:'0.1',color:'#0a1420'}));
  g.appendChild(el('a-text',{value:'CENTRAL CANTEEN  🍽',position:'0 6.5 -5.55',align:'center',color:'#e8b84b',width:'5',font:'dejavu'}));

  // Service counter window
  g.appendChild(el('a-box',{position:'0 3 -5.55',width:'6',height:'2',depth:'0.1',color:'#1a2030'}));
  g.appendChild(el('a-box',{position:'0 3 -5.5',width:'5.6',height:'1.6',depth:'0.06',
    material:'color:#66aacc;opacity:0.35;transparent:true;src:#glass-canvas'}));

  // Warm interior light
  g.appendChild(el('a-light',{type:'point',position:'0 5 0',color:'#ffe0a0',intensity:'0.9',distance:'15'}));

  scene.appendChild(g);
}

/* ══════════════════════════════════════════════════════════
   TREES — multi-sphere, varied
══════════════════════════════════════════════════════════ */
function buildTree(scene, x, z, scale=1, hue=1) {
  const g = el('a-entity',{position:`${x} 0 ${z}`});
  const trunkH=2.5*scale, trunkR=0.18*scale;
  const colors=['#2d6a2d','#3a7a2a','#2a5a20','#357030','#306830'];
  const c=colors[Math.floor(hue*colors.length)%colors.length];

  // Trunk (tapered using 2 cylinders)
  g.appendChild(el('a-cylinder',{position:`0 ${trunkH*0.4} 0`,radius:`${trunkR}`,height:`${trunkH*0.8}`,color:'#4a2e12',material:'roughness:0.9'}));
  g.appendChild(el('a-cylinder',{position:`0 ${trunkH*0.9} 0`,radius:`${trunkR*0.7}`,height:`${trunkH*0.3}`,color:'#5a3a1a',material:'roughness:0.9'}));

  // Multi-sphere canopy
  const sr=1.3*scale;
  g.appendChild(el('a-sphere',{position:`0 ${trunkH+sr*0.8} 0`,radius:`${sr}`,color:c,material:'roughness:0.9'}));
  g.appendChild(el('a-sphere',{position:`${sr*0.6} ${trunkH+sr*0.5} ${sr*0.3}`,radius:`${sr*0.65}`,color:colors[(Math.floor(hue*3)+1)%colors.length],material:'roughness:0.9'}));
  g.appendChild(el('a-sphere',{position:`${-sr*0.5} ${trunkH+sr*0.55} ${-sr*0.4}`,radius:`${sr*0.6}`,color:colors[(Math.floor(hue*5)+2)%colors.length],material:'roughness:0.9'}));
  g.appendChild(el('a-sphere',{position:`${sr*0.3} ${trunkH+sr*1.4} ${-sr*0.2}`,radius:`${sr*0.5}`,color:colors[Math.floor(hue*2)%colors.length],material:'roughness:0.9'}));

  scene.appendChild(g);
}

function buildTrees(scene) {
  const positions = [
    [-8,-3,1,0.1],[-6,-18,1.1,0.3],[-10,-22,1.2,0.5],[-7,-34,0.9,0.7],
    [-14,-18,1.1,0.2],[-12,-30,1.2,0.4],[ 8,-4,1,0.6],[ 7,-20,1.05,0.8],
    [ 10,-30,0.95,0.9],[ 12,-40,1.1,0.1],[ 15,-8,0.9,0.3],
    [-4,-36,0.8,0.5],[ 4,-36,0.85,0.7],[-16,-30,1.0,0.2],
    [ 20,-5,0.9,0.4],[-3,-5,0.7,0.6],[ 3,-5,0.75,0.8],
  ];
  positions.forEach(([x,z,s,h])=>buildTree(scene,x,z,s,h));
}

/* ══════════════════════════════════════════════════════════
   LAMP POSTS — ornate with glow
══════════════════════════════════════════════════════════ */
function buildLamp(scene, x, z) {
  const g = el('a-entity',{position:`${x} 0 ${z}`});
  // Pole
  g.appendChild(el('a-cylinder',{position:'0 3 0',radius:'0.07',height:'6',color:'#505868',material:'roughness:0.3;metalness:0.8'}));
  // Arm
  g.appendChild(el('a-box',{position:'0.4 5.9 0',width:'0.9',height:'0.07',depth:'0.07',color:'#505868',material:'roughness:0.3;metalness:0.8'}));
  // Bulb housing
  g.appendChild(el('a-sphere',{position:'0.85 5.7 0',radius:'0.25',color:'#ffe8c0',material:'emissive:#ffe8a0;emissiveIntensity:1.2;roughness:0.1'}));
  // Glow sphere
  g.appendChild(el('a-sphere',{position:'0.85 5.7 0',radius:'0.55',material:'color:#ffe8a0;opacity:0.08;transparent:true;emissive:#ffe8a0;emissiveIntensity:0.3'}));
  // Base
  g.appendChild(el('a-cylinder',{position:'0 0.15 0',radius:'0.22',height:'0.3',color:'#404858',material:'roughness:0.4;metalness:0.7'}));
  // Point light
  g.appendChild(el('a-light',{type:'point',position:'0.85 5.7 0',color:'#ffe8a0',intensity:'0.65',distance:'14'}));
  scene.appendChild(g);
}

function buildLamps(scene) {
  [[-3,-4],[3,-4],[-3,-19],[3,-19],[-3,-34],[3,-34],
   [-12,-6],[12,-6],[-10,-28],[10,-28]].forEach(([x,z])=>buildLamp(scene,x,z));
}

/* ══════════════════════════════════════════════════════════
   BENCHES — detailed
══════════════════════════════════════════════════════════ */
function buildBenches(scene) {
  const benches = [
    [-2.8,-8.5,0],[ 2.8,-8.5,0],[-16,-20,0],[ 16,-20,0],
    [ 0,-16,90],[-10,-30,90],[ 10,-30,90]
  ];
  benches.forEach(([x,z,ry])=>{
    const g = el('a-entity',{position:`${x} 0 ${z}`,rotation:`0 ${ry} 0`});
    // Seat
    g.appendChild(el('a-box',{position:'0 0.52 0',width:'2',height:'0.1',depth:'0.55',color:'#8b7355',material:'roughness:0.75'}));
    // Back
    g.appendChild(el('a-box',{position:'0 0.85 -0.22',width:'2',height:'0.6',depth:'0.08',color:'#7a6244',material:'roughness:0.75'}));
    // Legs
    [[-0.85,0.85]].flat().forEach(lx=>{
      g.appendChild(el('a-cylinder',{position:`${lx} 0.22 0.1`,radius:'0.04',height:'0.45',color:'#555560',material:'roughness:0.4;metalness:0.7'}));
      g.appendChild(el('a-cylinder',{position:`${lx} 0.22 -0.3`,radius:'0.04',height:'0.45',color:'#555560',material:'roughness:0.4;metalness:0.7'}));
    });
    scene.appendChild(g);
  });
}

/* ══════════════════════════════════════════════════════════
   NOTICE BOARD
══════════════════════════════════════════════════════════ */
function buildNoticeBoard(scene) {
  const g = el('a-entity',{position:'5 0 -9'});
  g.appendChild(el('a-box',{position:'0 1.55 0',width:'2.5',height:'1.8',depth:'0.12',color:'#2a3550',material:'roughness:0.7'}));
  g.appendChild(el('a-box',{position:'0 1.55 0.07',width:'2.2',height:'1.4',depth:'0.06',color:'#e8f0f8',material:'opacity:0.85;transparent:true;roughness:0.3'}));
  g.appendChild(el('a-text',{value:'📋 NOTICE BOARD',position:'0 2.52 0.14',align:'center',color:'#e8b84b',width:'2',font:'dejavu'}));
  g.appendChild(el('a-text',{value:'Welcome to TCET\nUpcoming Events | Notices',position:'0 1.55 0.14',align:'center',color:'#2a3550',width:'1.8',font:'dejavu'}));
  g.appendChild(el('a-cylinder',{position:'0 0.55 0',radius:'0.06',height:'1.2',color:'#8896aa',material:'roughness:0.4;metalness:0.6'}));
  scene.appendChild(g);
}

/* ══════════════════════════════════════════════════════════
   BUS STOP
══════════════════════════════════════════════════════════ */
function buildBusStop(scene) {
  const g = el('a-entity',{position:'14 0 6'});
  g.appendChild(el('a-box',{position:'0 2.2 0',width:'6.5',height:'0.15',depth:'2.8',color:'#b0bcc8',material:'roughness:0.4;metalness:0.4'}));
  [[-3,3]].flat().forEach(px=>{
    g.appendChild(el('a-box',{position:`${px} 1.1 0`,width:'0.15',height:'2.3',depth:'2.8',color:'#9ab0c0',material:'roughness:0.4;metalness:0.3'}));
  });
  g.appendChild(el('a-box',{position:'0 1.1 -1.3',width:'6',height:'2.3',depth:'0.08',
    material:'color:#88aacc;opacity:0.4;transparent:true;roughness:0.1;src:#glass-canvas'}));
  g.appendChild(el('a-text',{value:'🚌 BUS STOP',position:'0 2.6 0',align:'center',color:'#e8b84b',width:'2.5',font:'dejavu'}));
  scene.appendChild(g);
}

/* ══════════════════════════════════════════════════════════
   PARKING AREA
══════════════════════════════════════════════════════════ */
function buildParkingArea(scene) {
  const g = el('a-entity',{position:'-16 0 4'});
  g.appendChild(el('a-plane',{rotation:'-90 0 0',width:'22',height:'14',
    material:'color:#505868;roughness:1;opacity:0.85;transparent:true'}));
  // Parking lines
  [-8,-4,0,4,8].forEach(px=>{
    g.appendChild(el('a-plane',{position:`${px} 0.01 0`,rotation:'-90 0 0',width:'0.1',height:'13',
      material:'color:#fff;opacity:0.35;transparent:true;roughness:1'}));
  });
  // Cars
  const carColors=['#3a4a8a','#8a3a3a','#3a7a3a','#5a5a5a','#7a5a2a','#2a5a7a'];
  [[-6,2],[-2,2],[2,2],[6,2],[-6,-2],[-2,-2]].forEach(([cx,cz],i)=>{
    g.appendChild(el('a-box',{position:`${cx} 0.35 ${cz}`,width:'1.8',height:'0.65',depth:'3.5',
      color:carColors[i%carColors.length],material:'roughness:0.25;metalness:0.55'}));
    g.appendChild(el('a-box',{position:`${cx} 0.85 ${cz}`,width:'1.4',height:'0.5',depth:'2',
      color:carColors[i%carColors.length],material:'roughness:0.3;metalness:0.4'}));
    // Headlights
    g.appendChild(el('a-sphere',{position:`${cx-0.5} 0.38 ${cz-1.76}`,radius:'0.1',
      material:'color:#ffffcc;emissive:#ffffcc;emissiveIntensity:0.8'}));
    g.appendChild(el('a-sphere',{position:`${cx+0.5} 0.38 ${cz-1.76}`,radius:'0.1',
      material:'color:#ffffcc;emissive:#ffffcc;emissiveIntensity:0.8'}));
  });
  g.appendChild(el('a-box',{position:'0 2.2 -6',width:'9',height:'1.1',depth:'0.2',color:'#0a1420'}));
  g.appendChild(el('a-text',{value:'🅿 PARKING',position:'0 2.2 -5.94',align:'center',color:'#e8b84b',width:'3.5',font:'dejavu'}));
  scene.appendChild(g);
}

/* ══════════════════════════════════════════════════════════
   TELEPORT SPOTS — holographic ring design
══════════════════════════════════════════════════════════ */
function buildTeleportSpots(scene) {
  TOUR_STOPS.forEach((stop,i)=>{
    const [x,,z]=stop.pos;
    const color=stop.isLibrary?'#00d8ff':'#e8b84b';

    // Outer pulse ring
    const outerRing=el('a-torus',{position:`${x} 0.04 ${z}`,rotation:'-90 0 0',radius:'0.85','radius-tubular':'0.04',
      color,material:`emissive:${color};emissiveIntensity:0.6;opacity:0.7;transparent:true`,
      animation:'property:material.emissiveIntensity;from:0.2;to:0.9;dir:alternate;dur:1600;loop:true;easing:easeInOutSine'
    });
    scene.appendChild(outerRing);

    // Inner fill
    const fill=el('a-circle',{position:`${x} 0.05 ${z}`,rotation:'-90 0 0',radius:'0.6',
      material:`color:${color};opacity:0.12;transparent:true;shader:flat`
    });
    fill.classList.add('clickable');
    fill.addEventListener('click',()=>teleportTo(stop.pos[0],stop.pos[1],stop.pos[2],i,stop.camRotY));
    scene.appendChild(fill);

    // Number
    scene.appendChild(el('a-text',{value:`${i+1}`,position:`${x} 0.1 ${z}`,rotation:'-90 0 0',
      align:'center',color,width:'1.4',font:'dejavu'}));

    // Name label
    const nameLabel=el('a-text',{value:stop.title,position:`${x} 0.7 ${z}`,rotation:'-90 0 0',
      align:'center',color,width:'2.4',font:'dejavu'});
    nameLabel.classList.add('stop-name-label');
    scene.appendChild(nameLabel);

    // Scan ring (rotating)
    scene.appendChild(el('a-torus',{position:`${x} 0.06 ${z}`,rotation:'-90 0 0',radius:'1.1','radius-tubular':'0.02',
      color,material:`emissive:${color};emissiveIntensity:0.4;opacity:0.35;transparent:true`,
      animation:`property:rotation;from:-90 0 0;to:-90 360 0;dur:${4000+i*300};loop:true;easing:linear`
    }));
  });
}

/* ══════════════════════════════════════════════════════════
   HOTSPOT MARKERS — redesigned holographic style
══════════════════════════════════════════════════════════ */
function buildHotspots(scene) {
  TOUR_STOPS.forEach((stop,i)=>{
    const [x,,z]=stop.pos;
    const color=stop.isLibrary?'#00d8ff':'#e8b84b';
    const color2=stop.isLibrary?'#e8b84b':'#00d8ff';

    // Holographic diamond
    const diamond=el('a-octahedron',{position:`${x} 2.2 ${z}`,radius:'0.28',
      material:`color:${color};emissive:${color};emissiveIntensity:0.7;roughness:0.1;metalness:0.5;opacity:0.9;transparent:true`,
      animation__bob:`property:position;dir:alternate;dur:1600;easing:easeInOutSine;loop:true;from:${x} 2.2 ${z};to:${x} 2.65 ${z}`,
      animation__spin:`property:rotation;from:0 0 0;to:0 360 0;dur:4000;loop:true;easing:linear`,
      animation__glow:`property:material.emissiveIntensity;from:0.4;to:1.2;dir:alternate;dur:900;loop:true;easing:easeInOutSine`
    });
    diamond.classList.add('clickable');
    diamond.addEventListener('click',()=>showInfo(stop,i));
    scene.appendChild(diamond);

    // Inner core sphere
    scene.appendChild(el('a-sphere',{position:`${x} 2.2 ${z}`,radius:'0.12',
      material:`color:#fff;emissive:#fff;emissiveIntensity:1.5`,
      animation:`property:position;dir:alternate;dur:1600;easing:easeInOutSine;loop:true;from:${x} 2.2 ${z};to:${x} 2.65 ${z}`
    }));

    // Horizontal orbit ring
    scene.appendChild(el('a-torus',{position:`${x} 2.2 ${z}`,radius:'0.55','radius-tubular':'0.025',
      color:color2,material:`emissive:${color2};emissiveIntensity:0.5;opacity:0.6;transparent:true`,
      animation__bob:`property:position;dir:alternate;dur:1600;easing:easeInOutSine;loop:true;from:${x} 2.2 ${z};to:${x} 2.65 ${z}`,
      animation:`property:rotation;from:0 0 0;to:0 -360 0;dur:3500;loop:true;easing:linear`
    }));

    // Tilted orbit ring
    scene.appendChild(el('a-torus',{position:`${x} 2.2 ${z}`,radius:'0.45','radius-tubular':'0.018',
      color,material:`emissive:${color};emissiveIntensity:0.4;opacity:0.45;transparent:true`,
      animation__bob:`property:position;dir:alternate;dur:1600;easing:easeInOutSine;loop:true;from:${x} 2.2 ${z};to:${x} 2.65 ${z}`,
      animation:`property:rotation;from:60 0 0;to:60 360 0;dur:2800;loop:true;easing:linear`
    }));

    // Vertical beam
    scene.appendChild(el('a-cylinder',{position:`${x} 1.1 ${z}`,radius:'0.04',height:'2.2',
      material:`color:${color};emissive:${color};emissiveIntensity:0.5;opacity:0.25;transparent:true`,
      animation:`property:material.opacity;from:0.05;to:0.4;dir:alternate;dur:1400;loop:true;easing:easeInOutSine`
    }));

    // Ground glow circle
    scene.appendChild(el('a-circle',{position:`${x} 0.03 ${z}`,rotation:'-90 0 0',radius:'0.7',
      material:`color:${color};emissive:${color};emissiveIntensity:0.3;opacity:0.15;transparent:true;shader:flat`,
      animation:`property:material.opacity;from:0.05;to:0.25;dir:alternate;dur:2000;loop:true`
    }));

    // Library extra: floating book
    if(stop.isLibrary){
      const bk=el('a-text',{value:'📚',position:`${x} 3.5 ${z}`,align:'center',width:'3',
        animation:`property:position;from:${x} 3.5 ${z};to:${x} 4 ${z};dir:alternate;dur:1200;loop:true;easing:easeInOutSine`
      });
      bk.classList.add('clickable');
      bk.addEventListener('click',()=>openLibraryOverlay());
      scene.appendChild(bk);
    }

    // Point light at hotspot
    scene.appendChild(el('a-light',{type:'point',position:`${x} 2.5 ${z}`,
      color,intensity:'0.4',distance:'6'}));
  });
}

/* ══════════════════════════════════════════════════════════
   AR ANNOTATIONS
══════════════════════════════════════════════════════════ */
const AR_SCREEN_ANCHORS = [
  {id:'entrance',  x:'50%',y:'60%'},{id:'fountain',   x:'50%',y:'50%'},
  {id:'academic',  x:'50%',y:'42%'},{id:'library',    x:'25%',y:'45%'},
  {id:'auditorium',x:'75%',y:'45%'},{id:'labs',       x:'50%',y:'32%'},
  {id:'sports',    x:'20%',y:'38%'},{id:'canteen',    x:'76%',y:'38%'},
];

function buildARAnnotations() {
  const layer = document.getElementById('ar-annotations-layer');
 
  // Keep a ref to each label's distance <span> so we can update it
  const distSpans = [];
 
  TOUR_STOPS.forEach((stop, i) => {
    const anchor = AR_SCREEN_ANCHORS[i];
 
    const label = document.createElement('div');
    label.style.cssText = `
      position:absolute;
      left:${anchor.x};
      top:${anchor.y};
      transform:translate(-50%,-50%);
      background:rgba(0,216,255,0.12);
      backdrop-filter:blur(8px);
      border:1px solid rgba(0,216,255,0.4);
      border-radius:7px;
      padding:5px 12px;
      font-family:JetBrains Mono,monospace;
      font-size:.6rem;
      color:#00d8ff;
      letter-spacing:.12em;
      white-space:nowrap;
      pointer-events:auto;
      cursor:pointer;
      transition:all .3s
    `;
 
    // Create a <span> we can update in the live loop
    const distSpan = document.createElement('span');
    distSpan.style.cssText = 'display:block;font-size:.53rem;color:rgba(0,216,255,.6);margin-top:2px';
    distSpan.textContent = '-- m away';
 
    label.textContent = stop.title;
    label.appendChild(distSpan);
    label.addEventListener('click', () => showInfo(stop, i));
 
    layer.appendChild(label);
    distSpans.push({ span: distSpan, stop });
  });
 
  // Live distance updater — runs every 800 ms
  setInterval(() => {
    if (!rig) return;
    const pos = rig.getAttribute('position');
    if (!pos) return;
 
    distSpans.forEach(({ span, stop }) => {
      const dx = pos.x - stop.pos[0];
      const dz = pos.z - stop.pos[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      // Convert A-Frame units to approximate metres (1 unit ≈ 1 m)
      span.textContent = `${Math.round(dist)}m away`;
    });
  }, 800);
}
function dismissProximity() {
  // Mark as triggered so the loop won't immediately re-show it
  nearLibrary = true;
  document.getElementById('lib-proximity').classList.remove('show');
}
/* ══════════════════════════════════════════════════════════
   TELEPORTATION
══════════════════════════════════════════════════════════ */
function teleportTo(x,y,z,stopIdx,camRotY) {
  document.getElementById('fade').classList.add('show');
  setTimeout(()=>{
    rig.setAttribute('position',{x,y:1.6,z});
    if(camRotY!==undefined&&cam){
      const rot=cam.getAttribute('rotation')||{x:0,y:0,z:0};
      cam.setAttribute('rotation',{x:rot.x,y:camRotY,z:rot.z});
    }
    document.getElementById('fade').classList.remove('show');
    if(stopIdx!==undefined){
      currentStopIdx=stopIdx;
      updateStopDots(stopIdx);
      const stop=TOUR_STOPS[stopIdx];
      tbLocation.textContent=stop.title;
      tbLocation.classList.add('active');
    }
  },340);
}

/* ══════════════════════════════════════════════════════════
   INFO CARD
══════════════════════════════════════════════════════════ */
function showInfo(stop,idx) {
  icTitle.textContent=stop.title;
  icDesc.textContent=stop.desc;
  icStats.innerHTML='';
  (stop.stats||[]).forEach(s=>{
    icStats.innerHTML+=`<div class="ic-stat"><div class="ic-stat-val">${s.v}</div><div class="ic-stat-key">${s.k}</div></div>`;
  });
  icGotoBtn.onclick=()=>{teleportTo(stop.pos[0],stop.pos[1],stop.pos[2],idx,stop.camRotY);closeInfo();};
  if(icLibBtn)icLibBtn.style.display=stop.isLibrary?'inline-flex':'none';
  infoCard.classList.add('show');
}
function closeInfo(){infoCard.classList.remove('show');}

/* ══════════════════════════════════════════════════════════
   PROXIMITY — LIBRARY
══════════════════════════════════════════════════════════ */
function proximityLoop() {
  const proximityEl = document.getElementById('lib-proximity');
 
  setInterval(() => {
    if (!rig) return;
    const pos = rig.getAttribute('position');
    if (!pos) return;
 
    const dx  = pos.x - LIBRARY_POS.x;
    const dz  = pos.z - LIBRARY_POS.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
 
    const libOpen = document.getElementById('library-overlay').classList.contains('open');
    const pdfOpen = document.getElementById('pdf-reader').classList.contains('open');
 
    // ── If any full-screen overlay is open, always hide the banner ──
    if (libOpen || pdfOpen) {
      proximityEl.classList.remove('show');
      // Keep nearLibrary=true so we don't fire the toast again
      // the moment the overlay closes while player is still nearby.
      return;
    }
 
    if (dist < LIB_RADIUS && !nearLibrary) {
      // Player just entered the library zone
      nearLibrary = true;
      proximityEl.classList.add('show');
      showToast('📚 Near the Library! Press L or click Enter Library.');
 
    } else if (dist >= LIB_RADIUS && nearLibrary) {
      // Player walked away
      nearLibrary = false;
      proximityEl.classList.remove('show');
    }
  }, 500); // slightly faster polling feels more responsive
}
 
 

/* ══════════════════════════════════════════════════════════
   GUIDED TOUR
══════════════════════════════════════════════════════════ */
function startTour(){
  Tour.active=true;Tour.paused=false;Tour.index=0;
  startBtn.classList.add('off');pauseBtn.classList.remove('off');nextBtn.classList.remove('off');stopBtn.classList.remove('off');
  narration.classList.add('show');closeInfo();
  showToast('▶ Guided tour started!');_tourStep();
}
function _tourStep(){
  if(!Tour.active||Tour.index>=TOUR_STOPS.length){stopTour();return;}
  const stop=TOUR_STOPS[Tour.index];
  teleportTo(stop.pos[0],stop.pos[1],stop.pos[2],Tour.index,stop.camRotY);
  narTitle.textContent=stop.title;narDesc.textContent=stop.desc;
  narCount.textContent=`Stop ${Tour.index+1} / ${TOUR_STOPS.length}`;
  progressBar.style.width=`${((Tour.index+1)/TOUR_STOPS.length)*100}%`;
  clearTimeout(Tour.timer);
  Tour.timer=setTimeout(()=>{if(!Tour.paused){Tour.index++;_tourStep();}},Tour.delay);
}
function togglePause(){
  if(Tour.paused){Tour.paused=false;pauseIcon.textContent='⏸';pauseLabel.textContent='Pause';_tourStep();showToast('▶ Tour resumed');}
  else{Tour.paused=true;clearTimeout(Tour.timer);pauseIcon.textContent='▶';pauseLabel.textContent='Resume';showToast('⏸ Tour paused');}
}
function nextStop(){if(!Tour.active)return;clearTimeout(Tour.timer);Tour.index++;_tourStep();}
function stopTour(){
  Tour.active=false;Tour.paused=false;clearTimeout(Tour.timer);
  startBtn.classList.remove('off');pauseBtn.classList.add('off');nextBtn.classList.add('off');stopBtn.classList.add('off');
  narration.classList.remove('show');progressBar.style.width='0%';
  pauseIcon.textContent='⏸';pauseLabel.textContent='Pause';
  showToast('⏹ Tour ended. Thanks for visiting!');
}

/* ══════════════════════════════════════════════════════════
   STOP DOTS
══════════════════════════════════════════════════════════ */
function buildStopDots(){
  TOUR_STOPS.forEach((stop,i)=>{
    const dot=document.createElement('div');
    dot.className='stop-dot';
    dot.innerHTML=`<span class="dot-tip">${stop.title}</span>`;
    dot.addEventListener('click',()=>{teleportTo(stop.pos[0],stop.pos[1],stop.pos[2],i,stop.camRotY);closeInfo();});
    stopNavEl.appendChild(dot);
  });
}
function updateStopDots(idx){document.querySelectorAll('.stop-dot').forEach((d,i)=>d.classList.toggle('active',i===idx));}

/* ══════════════════════════════════════════════════════════
   MINIMAP
══════════════════════════════════════════════════════════ */
function worldToMinimap(wx,wz){
  const W=WORLD_BOUNDS;
  return{x:(wx-W.minX)/(W.maxX-W.minX)*160,y:(1-(wz-W.minZ)/(W.maxZ-W.minZ))*160};
}
function drawMinimap(){
  const ctx=minimapCtx;ctx.clearRect(0,0,160,160);
  ctx.fillStyle='rgba(4,10,28,0.94)';ctx.beginPath();ctx.roundRect(0,0,160,160,14);ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
  for(let i=0;i<160;i+=32){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,160);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(160,i);ctx.stroke();}
  const blds=[
    {x:0,z:-24,w:28,d:9,c:'rgba(180,200,220,0.22)'},{x:-26,z:-12,w:16,d:7,c:'rgba(0,180,255,0.3)'},
    {x:24,z:-14,w:18,d:16,c:'rgba(200,190,215,0.2)'},{x:0,z:-46,w:20,d:9,c:'rgba(0,180,255,0.18)'},
    {x:20,z:-32,w:14,d:10,c:'rgba(200,210,200,0.18)'},{x:-26,z:-36,w:18,d:22,c:'rgba(200,130,50,0.16)'},
  ];
  blds.forEach(b=>{
    const p=worldToMinimap(b.x-b.w/2,b.z-b.d/2),p2=worldToMinimap(b.x+b.w/2,b.z+b.d/2);
    ctx.fillStyle=b.c;ctx.strokeStyle='rgba(150,170,200,0.25)';ctx.lineWidth=0.7;
    ctx.beginPath();ctx.rect(p.x,p.y,p2.x-p.x,p2.y-p.y);ctx.fill();ctx.stroke();
  });
  // Path
  const ptA=worldToMinimap(0,12),ptB=worldToMinimap(0,-50);
  ctx.strokeStyle='rgba(130,150,175,0.28)';ctx.lineWidth=3;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(ptA.x,ptA.y);ctx.lineTo(ptB.x,ptB.y);ctx.stroke();
  // Lib radius
  if(nearLibrary){const lp=worldToMinimap(LIBRARY_POS.x,LIBRARY_POS.z);ctx.beginPath();ctx.arc(lp.x,lp.y,13,0,Math.PI*2);ctx.strokeStyle='rgba(0,216,255,0.45)';ctx.lineWidth=1.2;ctx.stroke();}
  // Stops
  TOUR_STOPS.forEach((stop,i)=>{
    const p=worldToMinimap(stop.pos[0],stop.pos[2]);
    const active=i===currentStopIdx;
    const col=stop.isLibrary?'#00d8ff':'#e8b84b';
    if(active){ctx.beginPath();ctx.arc(p.x,p.y,11,0,Math.PI*2);ctx.fillStyle=stop.isLibrary?'rgba(0,216,255,0.15)':'rgba(232,184,75,0.15)';ctx.fill();}
    ctx.beginPath();ctx.arc(p.x,p.y,active?7:5,0,Math.PI*2);ctx.fillStyle=active?col:col+'88';ctx.fill();
    if(active){ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.stroke();}
    ctx.fillStyle='#111';ctx.font=`bold ${active?9:8}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(i+1,p.x,p.y);
  });
  // Player
  if(rig){const pos=rig.getAttribute('position');if(pos){
    const pp=worldToMinimap(pos.x,pos.z);
    ctx.beginPath();ctx.arc(pp.x+1,pp.y+1,7,0,Math.PI*2);ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fill();
    ctx.beginPath();ctx.arc(pp.x,pp.y,7,0,Math.PI*2);
    const g=ctx.createRadialGradient(pp.x-1,pp.y-1,1,pp.x,pp.y,7);
    g.addColorStop(0,'#80c8ff');g.addColorStop(1,'#1565c0');ctx.fillStyle=g;ctx.fill();
    ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();
    if(cam){const r=cam.getAttribute('rotation');if(r){
      const a=(-r.y)*Math.PI/180;
      ctx.beginPath();ctx.moveTo(pp.x,pp.y);ctx.lineTo(pp.x+Math.sin(a)*12,pp.y-Math.cos(a)*12);
      ctx.strokeStyle='#80c8ff';ctx.lineWidth=1.5;ctx.stroke();
    }}
  }}
  ctx.strokeStyle='rgba(255,255,255,0.07)';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(0,0,160,160,14);ctx.stroke();
}
function minimapLoop(){if(minimapVisible)drawMinimap();requestAnimationFrame(minimapLoop);}
function toggleMinimap(){minimapVisible=!minimapVisible;document.getElementById('minimap-wrap').style.opacity=minimapVisible?'1':'0.2';showToast(minimapVisible?'🗺 Minimap on':'🗺 Minimap off');}

/* ══════════════════════════════════════════════════════════
   COMPASS
══════════════════════════════════════════════════════════ */
function drawCompass(yaw){
  const cx=26,cy=26,r=22,ctx=compassCtx;
  ctx.clearRect(0,0,52,52);
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
  ctx.fillStyle='rgba(4,10,28,0.9)';ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.12)';ctx.lineWidth=1;ctx.stroke();
  const rad=-yaw*Math.PI/180;
  [{l:'N',a:0,c:'#ff4466'},{l:'E',a:90,c:'#e8b84b'},{l:'S',a:180,c:'#e8b84b'},{l:'W',a:270,c:'#e8b84b'}].forEach(({l,a,c})=>{
    const angle=(a*Math.PI/180)+rad;
    ctx.font='bold 7px sans-serif';ctx.fillStyle=c;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(l,cx+Math.sin(angle)*(r-8),cy-Math.cos(angle)*(r-8));
  });
  const nl=r-5,tl=r-17;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(rad);
  ctx.beginPath();ctx.moveTo(0,-nl);ctx.lineTo(3,4);ctx.lineTo(-3,4);ctx.closePath();ctx.fillStyle='#ff4466';ctx.fill();
  ctx.beginPath();ctx.moveTo(0,tl);ctx.lineTo(2.5,-4);ctx.lineTo(-2.5,-4);ctx.closePath();ctx.fillStyle='rgba(232,184,75,0.6)';ctx.fill();
  ctx.restore();
  ctx.beginPath();ctx.arc(cx,cy,3,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
}
function compassLoop(){let y=0;if(cam){const r=cam.getAttribute('rotation');if(r)y=r.y;}drawCompass(y);requestAnimationFrame(compassLoop);}

/* ══════════════════════════════════════════════════════════
   HUD
══════════════════════════════════════════════════════════ */
function hudCoordsLoop(){
  if(rig){const p=rig.getAttribute('position');if(p){
    document.getElementById('coord-x').textContent=`X: ${p.x.toFixed(1)}`;
    document.getElementById('coord-z').textContent=`Z: ${p.z.toFixed(1)}`;
    document.getElementById('coord-spd').textContent=`SPD: ${moveSpeed}×`;
  }}
  requestAnimationFrame(hudCoordsLoop);
}

/* ══════════════════════════════════════════════════════════
   DAY / NIGHT
══════════════════════════════════════════════════════════ */
function toggleDayNight(){
  isNight=!isNight;const btn=document.getElementById('day-btn');
  const s=document.getElementById('sky');
  if(isNight){
    s.setAttribute('color','#050d1e');
    ambientLight.setAttribute('color','#2a3a60');ambientLight.setAttribute('intensity','0.18');
    sunLight.setAttribute('intensity','0.08');sunLight.setAttribute('color','#3050a0');
    fillLight.setAttribute('intensity','0.08');
    document.querySelectorAll('a-light[type="point"]').forEach(l=>l.setAttribute('intensity',(parseFloat(l.getAttribute('intensity')||0.5)*2.8).toString()));
    btn.textContent='☀ Day Mode';btn.classList.add('active');
    showToast('🌙 Night mode — campus lights glowing!');
    // Add stars
    buildStars(document.getElementById('main-scene'));
  }else{
    s.setAttribute('color','#b0c8e8');
    ambientLight.setAttribute('color','#c8d6e8');ambientLight.setAttribute('intensity','0.6');
    sunLight.setAttribute('intensity','1.4');sunLight.setAttribute('color','#fff5e0');
    fillLight.setAttribute('intensity','0.5');
    document.querySelectorAll('a-light[type="point"]').forEach(l=>l.setAttribute('intensity',(parseFloat(l.getAttribute('intensity')||1)/2.8).toString()));
    btn.textContent='🌙 Night Mode';btn.classList.remove('active');
    document.querySelectorAll('.star-entity').forEach(s=>s.remove());
    showToast('☀ Day mode restored');
  }
}

function buildStars(scene){
  for(let i=0;i<200;i++){
    const s=el('a-sphere',{radius:'0.12',position:`${(Math.random()-0.5)*300} ${80+Math.random()*120} ${(Math.random()-0.5)*300}`,
      material:`color:#fff;emissive:#fff;emissiveIntensity:${0.5+Math.random()}`});
    s.classList.add('star-entity');
    scene.appendChild(s);
  }
}

/* ══════════════════════════════════════════════════════════
   RAIN
══════════════════════════════════════════════════════════ */
let rainEntities=[];
function toggleRain(){
  isRain=!isRain;const btn=document.getElementById('rain-btn');const scene=document.getElementById('main-scene');
  if(isRain){
    btn.classList.add('active-cyan');
    for(let i=0;i<180;i++){
      const d=el('a-cylinder');const x=(Math.random()-0.5)*90,z=(Math.random()-0.5)*90,y=Math.random()*16+5;
      d.setAttribute('position',`${x} ${y} ${z}`);d.setAttribute('radius','0.018');d.setAttribute('height','0.4');
      d.setAttribute('color','#aaccff');d.setAttribute('material','opacity:0.5;transparent:true;emissive:#aaccff;emissiveIntensity:0.2');
      d.setAttribute('animation',`property:position;from:${x} ${y} ${z};to:${x-0.5} 0 ${z};dur:${700+Math.random()*500};loop:true;easing:linear`);
      scene.appendChild(d);rainEntities.push(d);
    }
    showToast('🌧 Rainy weather on');
  }else{
    btn.classList.remove('active-cyan');
    rainEntities.forEach(d=>d.parentNode&&d.parentNode.removeChild(d));
    rainEntities=[];
    showToast('⛅ Rain stopped');
  }
}

/* ══════════════════════════════════════════════════════════
   FOG
══════════════════════════════════════════════════════════ */
function toggleFog(){
  isFog=!isFog;const sc=document.getElementById('main-scene');const btn=document.getElementById('fog-btn');
  sc.setAttribute('fog',isFog?'type:exponential;color:#0a1020;density:0.035':'type:exponential;color:#0a1020;density:0.006');
  btn.classList.toggle('active',isFog);showToast(isFog?'🌫 Dense fog':'👁 Fog cleared');
}

/* ══════════════════════════════════════════════════════════
   AR MODE
══════════════════════════════════════════════════════════ */
async function toggleMode(mode){if(mode==='ar')isARMode?exitARMode():await enterARMode();}
async function enterARMode() {
  try {
    const scene = document.getElementById('main-scene');
 
    // Try native WebXR AR first
    if (navigator.xr) {
      const ok = await navigator.xr.isSessionSupported('immersive-ar').catch(() => false);
      if (ok) { scene.enterAR(); return; }
    }
 
    // Fallback: camera feed overlay
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }, audio: false,
    });
    arStream = stream;
 
    const feed = document.getElementById('ar-feed');
    feed.srcObject = stream;
    feed.style.display = 'block';
    feed.classList.add('active');
 
    document.body.classList.add('ar-mode');
    document.getElementById('sky').setAttribute('material', 'opacity:0;transparent:true');
 
    // ── Show the annotations layer in AR mode ──
    // (CSS: body.ar-mode #ar-annotations-layer { opacity:1; visibility:visible })
    // body.ar-mode already handles it via CSS, but we also
    // remove the manual 'labels-visible' class so the button
    // state stays in sync if the user had it off.
    const layer = document.getElementById('ar-annotations-layer');
    layer.classList.remove('labels-visible'); // CSS rule takes over
 
    isARMode = true;
    modeBadge.textContent  = 'AR MODE';
    modeBadge.className    = 'tb-badge mode-ar';
 
    // Sync the Labels button to off (AR CSS handles visibility)
    const btn = document.getElementById('labels-ann-btn');
    if (btn) btn.classList.remove('active');
 
    showToast('📷 AR Mode — camera active. Labels shown automatically.');
  } catch {
    showToast('⚠ Camera access denied or AR not supported');
  }
}
 
function exitARMode() {
  if (arStream) { arStream.getTracks().forEach(t => t.stop()); arStream = null; }
 
  const feed = document.getElementById('ar-feed');
  feed.classList.remove('active');
  feed.srcObject = null;
 
  document.body.classList.remove('ar-mode');
  document.getElementById('sky').removeAttribute('material');
 
  // ── Hide annotations when leaving AR ──
  // Remove 'labels-visible' so they go back to hidden
  // (user can re-enable with the Labels button if they want)
  const layer = document.getElementById('ar-annotations-layer');
  layer.classList.remove('labels-visible');
 
  const btn = document.getElementById('labels-ann-btn');
  if (btn) btn.classList.remove('active');
 
  isARMode = false;
  modeBadge.textContent = '3D MODE';
  modeBadge.className   = 'tb-badge mode-3d';
 
  showToast('👁 3D Mode restored — labels hidden');
}
function enterVRMode(){document.getElementById('main-scene').enterVR();modeBadge.textContent='VR MODE';modeBadge.className='tb-badge mode-vr';showToast('🥽 Entering VR…');}

/* ══════════════════════════════════════════════════════════
   JOYSTICK
══════════════════════════════════════════════════════════ */
window._joystickVec=null;
function initJoystick(){
  const base=document.getElementById('joystick-base'),stick=document.getElementById('joystick-stick');
  if(!base||!stick)return;
  const maxR=26;let active=false,sx=0,sy=0;
  const start=e=>{e.preventDefault();active=true;const t=e.touches?e.touches[0]:e;sx=t.clientX;sy=t.clientY;window._joystickVec={x:0,y:0};};
  const move=e=>{if(!active)return;e.preventDefault();const t=e.touches?e.touches[0]:e;let dx=t.clientX-sx,dy=t.clientY-sy;const d=Math.sqrt(dx*dx+dy*dy);if(d>maxR){dx=dx/d*maxR;dy=dy/d*maxR;}stick.style.transform=`translate(${dx}px,${dy}px)`;window._joystickVec={x:dx/maxR,y:dy/maxR};};
  const end=()=>{active=false;stick.style.transform='translate(0,0)';window._joystickVec=null;};
  base.addEventListener('touchstart',start,{passive:false});base.addEventListener('touchmove',move,{passive:false});base.addEventListener('touchend',end);
  base.addEventListener('mousedown',start);window.addEventListener('mousemove',move);window.addEventListener('mouseup',end);
}

/* ══════════════════════════════════════════════════════════
   KEYBOARD SHORTCUTS
══════════════════════════════════════════════════════════ */
function initKeyboardShortcuts(){
  window.addEventListener('keydown',e=>{
    const tag=(e.target.tagName||'').toLowerCase();
    if(tag==='input'||tag==='textarea')return;
    switch(e.code){
      case 'KeyT':Tour.active?stopTour():startTour();break;
      case 'KeyN':if(Tour.active)nextStop();break;
      case 'KeyG':toggleDayNight();break;
      case 'KeyR':toggleRain();break;
      case 'KeyM':toggleMinimap();break;
      case 'KeyP':takeScreenshot();break;
      case 'KeyF':toggleFog();break;
      case 'KeyL':toggleLibraryOverlay();break;
      case 'Escape':
        closeInfo();
        document.getElementById('settings-panel').classList.remove('open');
        document.getElementById('help-panel').classList.remove('open');
        if(isARMode)exitARMode();
        if(document.getElementById('pdf-reader').classList.contains('open'))closePdfReader();
        else if(document.getElementById('library-overlay').classList.contains('open'))closeLibraryOverlay();
        break;
      case 'Digit1':teleportTo(...TOUR_STOPS[0].pos,0,TOUR_STOPS[0].camRotY);break;
      case 'Digit2':teleportTo(...TOUR_STOPS[1].pos,1,TOUR_STOPS[1].camRotY);break;
      case 'Digit3':teleportTo(...TOUR_STOPS[2].pos,2,TOUR_STOPS[2].camRotY);break;
      case 'Digit4':teleportTo(...TOUR_STOPS[3].pos,3,TOUR_STOPS[3].camRotY);break;
      case 'Digit5':teleportTo(...TOUR_STOPS[4].pos,4,TOUR_STOPS[4].camRotY);break;
    }
  });
}

/* ══════════════════════════════════════════════════════════
   SCREENSHOT
══════════════════════════════════════════════════════════ */
function takeScreenshot(){
  const flash=document.getElementById('flash');flash.classList.add('show');
  setTimeout(()=>flash.classList.remove('show'),300);
  const sc=document.querySelector('a-scene canvas');if(!sc){showToast('⚠ Screenshot failed');return;}
  try{const a=document.createElement('a');a.download=`TCET-${Date.now()}.png`;a.href=sc.toDataURL('image/png');a.click();showToast('📸 Screenshot saved!');}
  catch{showToast('⚠ Run via http server for screenshots');}
}

/* ══════════════════════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════════════════════ */
function toggleSettings(){document.getElementById('settings-panel').classList.toggle('open');}
function toggleHelp(){document.getElementById('help-panel').classList.toggle('open');}
function updateSpeed(val){moveSpeed=parseFloat(val);document.getElementById('speed-val').textContent=val;if(rig)rig.setAttribute('smooth-movement',`speed:${moveSpeed}`);}
function updateDelay(val){Tour.delay=parseInt(val)*1000;document.getElementById('delay-val').textContent=val+'s';}
let pointerLockOn=true;
function togglePointerLock(){pointerLockOn=!pointerLockOn;document.getElementById('plock-toggle').classList.toggle('on',pointerLockOn);if(cam)cam.setAttribute('look-controls',`pointerLockEnabled:${pointerLockOn}`);}
function toggleLabels(){showLabels=!showLabels;document.getElementById('labels-toggle').classList.toggle('on',showLabels);document.querySelectorAll('.stop-name-label').forEach(l=>l.setAttribute('visible',showLabels?'true':'false'));showToast(showLabels?'🏷 Labels on':'🏷 Labels off');}
function toggleAnnotationLabels() {
  const layer = document.getElementById('ar-annotations-layer');
  const btn   = document.getElementById('labels-ann-btn');
 
  const isOn = layer.classList.toggle('labels-visible');
  btn.classList.toggle('active', isOn);
  showToast(isOn ? '🏷 Location labels on' : '🏷 Location labels off');
}
/* ══════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════ */
let _toastTimer=null;
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(_toastTimer);_toastTimer=setTimeout(()=>t.classList.remove('show'),3000);}

/* ══════════════════════════════════════════════════════════
   LIBRARY PORTAL
══════════════════════════════════════════════════════════ */
function openLibraryOverlay() {
  // Reset proximity state — clears the banner and prevents
  // it from immediately re-appearing when overlay closes
  nearLibrary = false;
  document.getElementById('lib-proximity').classList.remove('show');
 
  // Open the overlay
  document.getElementById('library-overlay').classList.add('open');
 
  // Close info card if it was open (e.g. user clicked Browse Library from it)
  closeInfo();
 
  // Release pointer lock so user can interact with the overlay UI
  if (document.pointerLockElement) document.exitPointerLock();
 
  fetchBooks();
  showToast('📚 Central Library — Browse & Read');
}
 
function closeLibraryOverlay() {
  document.getElementById('library-overlay').classList.remove('open');
  // Reset so proximityLoop can re-evaluate on next tick
  nearLibrary = false;
}
function toggleLibraryOverlay(){const o=document.getElementById('library-overlay');o.classList.contains('open')?closeLibraryOverlay():openLibraryOverlay();}

let _searchDebounce=null;
function onLibSearch(val){LibState.search=val;LibState.page=1;clearTimeout(_searchDebounce);_searchDebounce=setTimeout(fetchBooks,400);}

function getApiBase(){return(typeof LIBRARY_API!=='undefined'?LIBRARY_API:null)||localStorage.getItem('tcet_api_url')||'/api';}
function getToken(){return localStorage.getItem('tcet_token')||'';}
async function apiFetch(path,opts={}){
  const h={'Content-Type':'application/json',...(opts.headers||{})};const tok=getToken();if(tok)h['Authorization']=`Bearer ${tok}`;
  const res=await fetch(`${getApiBase()}${path}`,{...opts,headers:h});if(!res.ok)throw new Error(`${res.status}`);return res.json();
}

async function fetchBooks(){
  if(LibState.loading)return;LibState.loading=true;
  LibState.department=document.getElementById('lib-dept-filter')?.value||'';
  LibState.year=document.getElementById('lib-year-filter')?.value||'';
  showLibLoading(true);hideLibEmpty();
  const p=new URLSearchParams({page:LibState.page,limit:LibState.limit});
  if(LibState.search)p.set('search',LibState.search);
  if(LibState.department)p.set('department',LibState.department);
  if(LibState.year)p.set('year',LibState.year);
  try{
    const data=await apiFetch(`/books?${p}`);
    LibState.books=data.books||[];LibState.total=data.total||0;
    renderBooks();renderLibPagination();
    document.getElementById('lib-count').textContent=`${LibState.total} book${LibState.total!==1?'s':''}`;
  }catch{showLibEmpty('⚠ Could not load books. Check connection or login.');}
  finally{LibState.loading=false;showLibLoading(false);}
}

function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function renderBooks(){
  const grid=document.getElementById('lib-book-grid');grid.innerHTML='';
  if(LibState.books.length===0){showLibEmpty('No books found.');return;}
  hideLibEmpty();
  LibState.books.forEach(book=>{
    const card=document.createElement('div');card.className='lib-book-card';
    card.innerHTML=`
      <div class="lib-book-cover">
        ${book.coverUrl?`<img src="${esc(book.coverUrl)}" alt="${esc(book.title)}" loading="lazy">`:`<div class="cover-fallback"><span>📖</span><p>${esc(book.title)}</p></div>`}
        <div class="lib-book-hover"><span>Read Now</span></div>
      </div>
      <div class="lib-book-info">
        <div class="lib-book-title">${esc(book.title)}</div>
        <div class="lib-book-author">${esc(book.author)}</div>
        <div class="lib-book-tags">
          <span class="lib-tag subject">${esc(book.subject)}</span>
          ${book.year?`<span class="lib-tag year">Yr ${book.year}</span>`:''}
        </div>
        <div class="lib-book-footer">
          <span class="lib-book-stat">👁 ${book.viewCount||0}</span>
          <span class="lib-book-stat">↓ ${book.downloadCount||0}</span>
          ${book.pages?`<span class="lib-book-stat" style="margin-left:auto">${book.pages}p</span>`:''}
        </div>
      </div>`;
    card.addEventListener('click',()=>openPdfReader(book));
    grid.appendChild(card);
  });
}

function showLibLoading(show){const e=document.getElementById('lib-loading');if(show){e.classList.add('show');document.getElementById('lib-book-grid').innerHTML='';}else e.classList.remove('show');}
function showLibEmpty(msg){const e=document.getElementById('lib-empty');e.classList.add('show');e.innerHTML=`<span style="font-size:2rem">📭</span><p style="font-size:.8rem">${msg}</p>`;}
function hideLibEmpty(){document.getElementById('lib-empty').classList.remove('show');}
function renderLibPagination(){
  const tp=Math.ceil(LibState.total/LibState.limit)||1;
  document.getElementById('lib-page-info').textContent=`Page ${LibState.page} of ${tp}`;
  document.getElementById('lib-prev').disabled=LibState.page<=1;
  document.getElementById('lib-next').disabled=LibState.page>=tp;
}
function libChangePage(d){LibState.page=Math.max(1,LibState.page+d);fetchBooks();document.querySelector('.lib-grid-wrap').scrollTop=0;}

async function openPdfReader(book) {
  LibState.currentBook = book;
  apiFetch(`/books/${book._id}`).catch(() => {});

  document.getElementById('pdf-title').textContent  = book.title;
  document.getElementById('pdf-author').textContent = book.author;

  const apiBase   = getApiBase();
  const token     = getToken();
  const qs        = token ? `?token=${encodeURIComponent(token)}` : '';
  const streamUrl = `${apiBase}/books/${book._id}/stream${qs}`;

  document.getElementById('pdf-open-tab').href   = streamUrl;
  document.getElementById('pdf-open-tab').target = '_blank';
  document.getElementById('pdf-download-btn').onclick = () => downloadBook(book);

  const frame = document.getElementById('pdf-frame');
  frame.src = '';
  // Note: NO #toolbar=1&navpanes=0 — that hash causes redirect confusion
  setTimeout(() => { frame.src = streamUrl; }, 60);

  document.getElementById('pdf-reader').classList.add('open');
  showToast(`📖 Reading: ${book.title}`);
}
function closePdfReader() {
  document.getElementById('pdf-reader').classList.remove('open');
  LibState.currentBook = null;
  // Delay clear so closing animation finishes before blank flashes
  setTimeout(() => { document.getElementById('pdf-frame').src = ''; }, 300);
}
 

async function downloadBook(book) {
  const btn  = document.getElementById('pdf-download-btn');
  const orig = btn.textContent;
  btn.textContent = '⏳ Downloading…';
  btn.disabled    = true;
  try {
    const apiBase = getApiBase();
    const token   = getToken();
    const qs      = token ? `?token=${encodeURIComponent(token)}` : '';
    const dlUrl   = `${apiBase}/books/${book._id}/download-file${qs}`;

    // Same-origin URL → browser respects the <a download> attribute
    const a = document.createElement('a');
    a.href     = dlUrl;
    a.download = `${book.title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('✅ Download started!');
  } catch {
    window.open(book.pdfUrl, '_blank');
    showToast('📥 Opening PDF in new tab…');
  } finally {
    btn.textContent = orig;
    btn.disabled    = false;
  }
}







