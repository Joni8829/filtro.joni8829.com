// ─── FILTER DEFINITIONS ───────────────────────────────────────────────────────
const FILTERS = [
  // ORIGINAL
  { id:'original', name:'Original', cat:null, fn: (d)=>d },

  // ─── RETRO ────────────────────────────────────────────
  { id:'r_chrome', name:'Chrome', cat:'Retro',
    fn: (d,w,h)=>apply(d,w,h,{brightness:5,contrast:35,saturation:25,warmth:-5,fade:2}) },

  { id:'r_polaroid', name:'Polaroid 600', cat:null,
    fn: (d,w,h)=>{ 
      const out = apply(d,w,h,{brightness:15,contrast:-5,saturation:-10,warmth:15,fade:35});
      for(let i=0; i<out.length; i+=4) {
        out[i] += 10; // Pinkish tint to the film base
        out[i+2] -= 5;
      }
      return out;
    },
    params:{ vignette:25, grain:10 } },

  { id:'nostalgia', name:'Nostalgia', cat:null,
    fn: (d,w,h)=>apply(d,w,h,{brightness:10,contrast:-8,saturation:6,warmth:40,fade:28}),
    params:{ vignette:10, grain:12 } },

  { id:'r_aura', name:'Aura 35mm', cat:null,
    fn: (d,w,h) => {
      const out = apply(d,w,h,{brightness:5, contrast:15, saturation:10, warmth:15, fade:12});
      for(let i=0; i<out.length; i+=4) {
        out[i+1] += 8; // Boost greens for that Fujifilm look
        out[i+2] -= 5; // Drop blues for vintage warmth
      }
      return out;
    },
    params:{ vignette:20, grain:15 }
  },

  // ─── VINTAGE ─────────────────────────────────────────
  { id:'v_golden_era', name:'Golden Era', cat:'Vintage', 
    fn: (d, w, h) => { 
      const out = apply(d, w, h, { brightness: 0, contrast: 10, saturation: 10, warmth: 30, fade: 15 }); 
      for (let i = 0; i < out.length; i += 4) { 
        const tint = ((out[i]+out[i+1]+out[i+2])/3) / 255; 
        out[i] += tint * 25; out[i+1] += tint * 15; out[i+2] -= tint * 10;
      } 
      return out; 
    }, 
    params: { vignette: 25, grain: 20 } },

  { id:'fuji_pastel', name:'Fuji Pastel', cat:null, 
    fn:(d,w,h)=>apply(d,w,h,{brightness:15,contrast:-20,saturation:-25,warmth:10,fade:30}), 
    params:{ vignette:10, grain:5 } },

  { id:'brown_cin', name:'Coffee & Oak', cat:null, 
      fn:(d,w,h)=>{ 
        const out=apply(d,w,h,{brightness:-13,contrast:17,saturation:-23,warmth:27,fade:17}); 
        for(let i=0;i<out.length;i+=4){ 
          const shadow=Math.max(0,(120-((out[i]+out[i+1]+out[i+2])/3))/120); 
          out[i]+=shadow*28; out[i+1]+=shadow*10; out[i+2]-=shadow*30;
        } return out; 
      }, 
      params:{ vignette:50, grain:8 } },

  // ─── FILM ────────────────────────────────────────────
  { id:'f_velvia', name:'Velvia Vivid', cat:'Film',
    fn: (d,w,h)=>apply(d,w,h,{saturation:55,contrast:30,brightness:-5,warmth:5}),
    params:{ vignette:25 } },

  { id:'f_tri_x', name:'Kodak Tri-X', cat:null,
    fn: (d,w,h)=>apply(d,w,h,{saturation:-100,brightness:5,contrast:40,fade:5}),
    params:{ grain:35, vignette:30 } },

  { id:'f_hp5_matte', name:'Ilford HP5', cat:null,
    fn: (d,w,h)=>apply(d,w,h,{saturation:-100,contrast:15,brightness:10,fade:25}),
    params:{ grain:15 } },
  
  { id:'f_portra', name:'Portra 400', cat:null,
    fn: (d,w,h) => {
      const out = apply(d,w,h,{brightness:8, contrast:-5, saturation:5, warmth:10, fade:5});
      for(let i=0; i<out.length; i+=4) {
        const lum = (out[i]+out[i+1]+out[i+2])/3;
        if(lum > 180) { // Highlight tint
          out[i] += 10;
          out[i+1] += 5;
        }
      }
      return out;
    },
    params:{ grain:8 }
  },

  // ─── CINEMATIC ───────────────────────────────────────
  { id:'c_teal_orange_pro', name:'Cinematic Pro', cat:'Cinema', 
      fn: (d, w, h) => { 
        const out = apply(d, w, h, { brightness: -2, contrast: 30, saturation: 10, warmth: 10, fade: 8 }); 
        for (let i = 0; i < out.length; i += 4) { 
          const lum = (out[i] + out[i+1] + out[i+2]) / 3; 
          if (lum < 120) { // Deep Teal Shadows
            out[i] -= ((120-lum)/120)*20; out[i+2] += ((120-lum)/120)*25;
          } else { // Golden Highlights
            out[i] += ((lum-120)/135)*30; out[i+2] -= ((lum-120)/135)*15;
          }
        } 
        return out; 
      }, 
      params: { vignette: 35, grain: 4 } },

  { id:'c_bleach_bypass', name:'Bleach Bypass', cat:null,
    fn: (d,w,h)=>apply(d,w,h,{saturation:-45,contrast:45,brightness:5,fade:10}),
    params:{ vignette:40, grain:10 } },

  { id:'c_moody_blue', name:'Midnight Noir', cat:null,
    fn: (d,w,h)=>{
      const out = apply(d,w,h,{brightness:-15,contrast:25,saturation:-20,warmth:-25,fade:15});
      for(let i=0; i<out.length; i+=4) {
        out[i+2] += 15; // Push extra blue into everything
      }
      return out;
    },
    params:{ vignette:55 } },

  { id:'dark', name:'Dark Cine', cat:null,
    fn: (d,w,h)=>apply(d,w,h,{brightness:-25,contrast:20,saturation:-10,warmth:-10,fade:10}),
    params:{ vignette:10, grain:12 } },

{ id:'d_ethereal', name:'Ethereal', cat:null,
    fn: (d,w,h) => {
      // We increase fade and drop contrast further for that 'misty' base
      const out = apply(d,w,h,{brightness:18, contrast:-30, saturation:-20, fade:50, warmth:-5});
      
      for(let i=0; i<out.length; i+=4) {
        // 1. Create a "Lavender" shadow lift
        // We target darker pixels and add red/blue to make shadows feel 'airy'
        const lum = (out[i] + out[i+1] + out[i+2]) / 3;
        if (lum < 100) {
          out[i] += (100 - lum) * 0.15;   // Soft Red lift
          out[i+2] += (100 - lum) * 0.25; // Stronger Blue lift
        }

        // 2. Simulate "Bloom" (The Glow)
        // We slightly boost the brightness of pixels that are already bright
        if (lum > 150) {
          const glow = (lum - 150) * 0.2;
          out[i] += glow;
          out[i+1] += glow;
          out[i+2] += glow;
        }
      }
      return out;
    },
    params:{ vignette:15, grain:0 }
  },

  { id:'c_neonoir', name:'Neo-Noir', cat:null,
    fn: (d,w,h) => {
      const out = apply(d,w,h,{brightness:-10, contrast:50, saturation:-30, warmth:-40});
      for(let i=0; i<out.length; i+=4) {
        const lum = (out[i]+out[i+1]+out[i+2])/3;
        // Crushing blacks even harder manually
        if(lum < 60) {
          out[i] *= 0.8; out[i+1] *= 0.8; out[i+2] *= 1.2; 
        }
      }
      return out;
    },
    params:{ vignette:60, grain:5 }
  },
  ];

// ─── APPLY FUNCTION ───────────────────────────────────────────────────────────
// Replace your entire apply() function with this much cleaner version:
function apply(imgData, w, h, opts={}) {
  const {
    brightness=0, contrast=0, saturation=0,
    warmth=0, fade=0, vignette=0, grain=0
  } = opts;

  const d = new Uint8ClampedArray(imgData.data);
  const bv = brightness / 100 * 255;
  const cv = contrast / 100;
  const sv = 1 + saturation / 100;
  const wv = warmth / 100;
  const fv = fade / 100;

  for (let i=0; i<d.length; i+=4) {
    let r=d[i], g=d[i+1], b=d[i+2];

    // Brightness
    r+=bv; g+=bv; b+=bv;

    // Contrast
    if (cv!==0) {
      r=((r/255-.5)*(1+cv)+.5)*255;
      g=((g/255-.5)*(1+cv)+.5)*255;
      b=((b/255-.5)*(1+cv)+.5)*255;
    }

    // Saturation
    if (sv!==1) {
      const lum=.299*r+.587*g+.114*b;
      r=lum+(r-lum)*sv; g=lum+(g-lum)*sv; b=lum+(b-lum)*sv;
    }

    // Warmth
    if (wv>0) { r+=wv*60; b-=wv*40; }
    else if (wv<0) { b-=wv*60; r+=wv*40; }

    // Fade
    if (fv>0) {
      r=r+(128-r)*fv*.7;
      g=g+(128-g)*fv*.5;
      b=b+(128-b)*fv*.6;
    }

    d[i]=Math.max(0,Math.min(255,r));
    d[i+1]=Math.max(0,Math.min(255,g));
    d[i+2]=Math.max(0,Math.min(255,b));
  }
  return d;
}

// ─── SAVE CUSTOM FILTERS ──────────────────────────────────────────────────────
// Creates a filter object from a set of adjustment values
function createCustomFilter(id, name, settings) {
  return {
    id: id,
    name: name,
    cat: null, // Change this to null
    fn: (d, w, h) => apply(d, w, h, settings),
    params: { vignette: settings.vignette, grain: settings.grain },
    isCustom: true 
  };
}

function saveCurrentPreset() {
  const name = prompt("Name your custom filter:", "My Preset");
  if (!name) return;

  const id = 'custom_' + Date.now();
  const settings = { ...manualAdj }; 

  // Save to localStorage
  const saved = JSON.parse(localStorage.getItem('filtro_user_presets') || '[]');
  saved.push({ id, name, settings });
  localStorage.setItem('filtro_user_presets', JSON.stringify(saved));

  // Update logic: Add to the active list and refresh UI without reload
  const newFilter = createCustomFilter(id, name, settings);
  FILTERS.push(newFilter);
  
  buildFilterStrip(); // Re-draw the bottom bar
  showBadge("Saved!");
}

function deleteCustomPreset(id) {
  // 1. Get the current list
  const saved = JSON.parse(localStorage.getItem('filtro_user_presets') || '[]');
  
  // 2. Find the name for the confirmation message
  const presetToDelete = saved.find(p => p.id === id);
  if (!presetToDelete) return;

  if (confirm(`Delete custom preset "${presetToDelete.name}"?`)) {
    // 3. Filter out the one we don't want
    const updated = saved.filter(p => p.id !== id);
    
    // 4. Save back to storage
    localStorage.setItem('filtro_user_presets', JSON.stringify(updated));
    
    // 5. Reload to update the UI
    location.reload();
  }
}

// ─── STATE ────────────────────────────────────────────────────────────────────
let originalImage = null;
let activeFilterId = 'original';
let manualAdj = { brightness:0, contrast:0, saturation:0, warmth:0, fade:0, vignette:0, grain:0 };

const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

// ─── RENDER ───────────────────────────────────────────────────────────────────
function render() {
  if (!originalImage) return;
  const w=canvas.width, h=canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.drawImage(originalImage,0,0,w,h);

  // Get base imageData and apply preset filter
  let imgData = ctx.getImageData(0,0,w,h);
  const filter = FILTERS.find(f=>f.id===activeFilterId);
  if (filter && filter.id!=='original') {
    const processed = filter.fn(imgData, w, h);
    for (let i=0; i<imgData.data.length; i++) imgData.data[i] = processed[i];
  }

  // Apply manual adjustments on top
  const ma = manualAdj;
  if (Object.values(ma).some(v=>v!==0)) {
    const extra = apply(imgData, w, h, ma);
    for (let i=0; i<imgData.data.length; i++) imgData.data[i] = extra[i];
  }

  ctx.putImageData(imgData, 0, 0);

  // Grain overlay
  const totalGrain = (manualAdj.grain || 0) + getPresetParam(activeFilterId, 'grain');
  if (totalGrain > 0) {
    const amount = Math.min(100, totalGrain) / 100;
    const offCtx = document.createElement('canvas');
    offCtx.width=w; offCtx.height=h;
    const gCtx = offCtx.getContext('2d');
    const gd = gCtx.createImageData(w,h);
    for (let i=0; i<gd.data.length; i+=4) {
      const n=(Math.random()-.5)*255*amount*.9;
      gd.data[i]=gd.data[i+1]=gd.data[i+2]=128+n;
      gd.data[i+3]=55*amount;
    }
    gCtx.putImageData(gd,0,0);
    ctx.globalCompositeOperation='overlay';
    ctx.drawImage(offCtx,0,0);
    ctx.globalCompositeOperation='source-over';
  }

  // Vignette
  const totalVig = (manualAdj.vignette || 0) + getPresetParam(activeFilterId, 'vignette');
  if (totalVig > 0) {
    const v = Math.min(100, totalVig) / 100;
    const grad = ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.25,w/2,h/2,Math.max(w,h)*.75);
    grad.addColorStop(0,'rgba(0,0,0,0)');
    grad.addColorStop(1,`rgba(0,0,0,${v*.85})`);
    ctx.fillStyle=grad;
    ctx.fillRect(0,0,w,h);
  }
}

function getPresetParam(filterId, param) {
  const filter = FILTERS.find(f=>f.id===filterId);
  return (filter && filter.params && filter.params[param]) || 0;
}

// ─── THUMBNAIL RENDERING ──────────────────────────────────────────────────────
function renderThumbnail(filter, thumbCanvas) {
  if (!originalImage) {
    const tc = thumbCanvas.getContext('2d');
    tc.fillStyle = '#242323';
    tc.fillRect(0,0,thumbCanvas.width,thumbCanvas.height);
    return;
  }
  const tw=thumbCanvas.width, th=thumbCanvas.height;
  const tc = thumbCanvas.getContext('2d', {willReadFrequently:true});

  // Draw image scaled to fit square thumb
  const aspect = originalImage.width/originalImage.height;
  let sx=0,sy=0,sw=originalImage.width,sh=originalImage.height;
  if (aspect>1) { sw=originalImage.height; sx=(originalImage.width-sw)/2; }
  else { sh=originalImage.width; sy=(originalImage.height-sh)/2; }
  tc.drawImage(originalImage,sx,sy,sw,sh,0,0,tw,th);

  if (filter.id==='original') return;

  let imgData = tc.getImageData(0,0,tw,th);
  const processed = filter.fn(imgData,tw,th);
  for (let i=0; i<imgData.data.length; i++) imgData.data[i]=processed[i];
  tc.putImageData(imgData,0,0);

  // Vignette from params or default subtle
  const vigAmount = (filter.params && filter.params.vignette) ? filter.params.vignette/100*.7 : .28;
  const grad=tc.createRadialGradient(tw/2,th/2,tw*.2,tw/2,th/2,tw*.78);
  grad.addColorStop(0,'rgba(0,0,0,0)');
  grad.addColorStop(1,`rgba(0,0,0,${vigAmount})`);
  tc.fillStyle=grad; tc.fillRect(0,0,tw,th);
}

function refreshAllThumbnails() {
  document.querySelectorAll('.f-item').forEach(item=>{
    const id=item.dataset.id;
    const filter=FILTERS.find(f=>f.id===id);
    const tc=item.querySelector('canvas');
    if (filter && tc) renderThumbnail(filter, tc);
  });
}

// ─── BUILD FILTER STRIP ───────────────────────────────────────────────────────
function buildFilterStrip() {
  const strip = document.getElementById('filterStrip');
  strip.innerHTML = '';
  
  let customPillAdded = false;

  FILTERS.forEach(filter => {
    // 1. Create Category Pill (if it has a cat OR if it's the first Custom item)
    if (filter.cat || (filter.id.startsWith('custom_') && !customPillAdded)) {
      const categoryName = filter.cat || 'Custom';
      const pill = document.createElement('div');
      pill.className = 'cat-pill';
      pill.innerHTML = `
        <div class="cat-line"></div>
        <div class="cat-name-wrapper">
          <div class="cat-name">${categoryName}</div>
        </div>
      `;
      strip.appendChild(pill);
      if (!filter.cat) customPillAdded = true;
    }

    // 2. Create the Filter Item
    const item = document.createElement('div');
    item.className = 'f-item' + (filter.id === activeFilterId ? ' active' : '');
    item.dataset.id = filter.id;

    // 3. Add Delete Button for Custom
    if (filter.id.startsWith('custom_')) {
      const delBtn = document.createElement('div');
      delBtn.innerHTML = '×';
      delBtn.className = 'del-btn';
      delBtn.onclick = (e) => {
        e.stopPropagation();
        deleteCustomPreset(filter.id);
      };
      item.appendChild(delBtn);
    }

    // 4. Create Thumbnail and Label
    const thumb = document.createElement('div');
    thumb.className = 'f-thumb';
    const tc = document.createElement('canvas');
    tc.width = 64; 
    tc.height = 64;
    thumb.appendChild(tc);

    const lbl = document.createElement('div');
    lbl.className = 'f-label';
    lbl.textContent = filter.name;

    item.appendChild(thumb);
    item.appendChild(lbl);
    strip.appendChild(item);

    // 5. Click Event
    item.addEventListener('click', () => {
      document.querySelectorAll('.f-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      activeFilterId = filter.id;
      render();
      showBadge(filter.name);
    });
    
    renderThumbnail(filter, tc);
  });
}

// ─── BUILD ADJUSTMENTS ────────────────────────────────────────────────────────
const ADJ_DEFS = [
  {key:'brightness', label:'Light',    min:-100, max:100},
  {key:'contrast',   label:'Contrast', min:-100, max:100},
  {key:'saturation', label:'Color',    min:-100, max:100},
  {key:'warmth',     label:'Warmth',   min:-100, max:100},
  {key:'fade',       label:'Fade',     min:0,    max:100},
  {key:'vignette',   label:'Vignette', min:0,    max:100},
  {key:'grain',      label:'Grain',    min:0,    max:100},
];

function buildAdjPanel() {
  const panel=document.getElementById('adjPanel');
  ADJ_DEFS.forEach(({key,label,min,max})=>{
    const row=document.createElement('div');
    row.className='adj-row';
    row.innerHTML=`
      <div class="adj-label">${label}</div>
      <input type="range" id="adj-${key}" min="${min}" max="${max}" value="0">
      <div class="adj-val" id="adjval-${key}">0</div>
    `;
    panel.appendChild(row);
    row.querySelector('input').addEventListener('input', e=>{
      manualAdj[key]=parseInt(e.target.value);
      const v=manualAdj[key];
      document.getElementById(`adjval-${key}`).textContent=v>0?'+'+v:v;
      render();
    });
  });
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
let badgeTimer;
function showBadge(name) {
  const b=document.getElementById('filterBadge');
  b.textContent=name;
  b.classList.add('show');
  clearTimeout(badgeTimer);
  badgeTimer=setTimeout(()=>b.classList.remove('show'),1800);
}

// ─── IMAGE LOAD ───────────────────────────────────────────────────────────────
function loadFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader=new FileReader();
  reader.onload=e=>{
    const img=new Image();
    img.onload=()=>{
      originalImage=img;
      // Size canvas to image (cap at 2048 for perf)
      const maxDim=2048;
      let cw=img.width, ch=img.height;
      if (cw>maxDim||ch>maxDim) {
        const r=Math.min(maxDim/cw,maxDim/ch);
        cw=Math.round(cw*r); ch=Math.round(ch*r);
      }
      canvas.width=cw; canvas.height=ch;
      canvas.style.display='block';
      const dz2=document.getElementById('dropZone');
      dz2.classList.add('loaded');
      dz2.style.cursor='default';
      document.getElementById('downloadBtn').disabled=false;
      render();
      refreshAllThumbnails();
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────
document.getElementById('fileInput').addEventListener('change', e=>{
  if (e.target.files[0]) loadFile(e.target.files[0]);
});

function triggerUpload() {
  document.getElementById('fileInput').click();
}

document.getElementById('uploadBtn').addEventListener('click', triggerUpload);
document.getElementById('dropZone').addEventListener('click', ()=>{ if(!originalImage) triggerUpload(); });

// Drag & drop (desktop)
const dz=document.getElementById('dropZone');
dz.addEventListener('dragover',e=>{e.preventDefault();});
dz.addEventListener('drop',e=>{e.preventDefault();if(e.dataTransfer.files[0])loadFile(e.dataTransfer.files[0]);});

// Tabs
document.querySelectorAll('.tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-'+tab.dataset.tab).classList.add('active');
  });
});

// Download
document.getElementById('downloadBtn').addEventListener('click',()=>{
  if (!originalImage) return;
  const link=document.createElement('a');
  link.download='filtro_photo.jpg';
  link.href=canvas.toDataURL('image/jpeg', .95);
  link.click();
});

// Reset
document.getElementById('resetBtn').addEventListener('click',()=>{
  manualAdj={brightness:0,contrast:0,saturation:0,warmth:0,fade:0,vignette:0,grain:0};
  ADJ_DEFS.forEach(({key})=>{
    const sl=document.getElementById(`adj-${key}`);
    if(sl){sl.value=0; document.getElementById(`adjval-${key}`).textContent='0';}
  });
  activeFilterId='original';
  document.querySelectorAll('.f-item').forEach(i=>i.classList.remove('active'));
  document.querySelector('.f-item[data-id="original"]')?.classList.add('active');
  render();
  showBadge('Original');
});

// ─── HOLD TO COMPARE ─────────────────────────────────────────────────────────
let holdPrevFilter = null;
let isHolding = false;
let holdTimer = null;
const compareOverlay = document.getElementById('compareOverlay');

const imageWrap = document.getElementById('imageWrap');

function startHold() {
  if (!originalImage || activeFilterId === 'original') return;
  // Small delay so taps don't flicker
  holdTimer = setTimeout(() => {
    isHolding = true;
    holdPrevFilter = activeFilterId;
    activeFilterId = 'original';
    render();
    compareOverlay.classList.add('show');
  }, 120);
}

function endHold() {
  clearTimeout(holdTimer);
  if (!isHolding) return;
  isHolding = false;
  activeFilterId = holdPrevFilter || 'original';
  holdPrevFilter = null;
  render();
  compareOverlay.classList.remove('show');
}

imageWrap.addEventListener('pointerdown', startHold);
imageWrap.addEventListener('pointerup', endHold);
imageWrap.addEventListener('pointerleave', endHold);
imageWrap.addEventListener('pointercancel', endHold);
// Prevent context menu on long press (mobile)
imageWrap.addEventListener('contextmenu', e => e.preventDefault());

// ─── INITIALIZATION & PERSISTENCE ─────────────────────────────────────────────

function loadSavedPresets() {
  const savedData = localStorage.getItem('filtro_user_presets');
  if (savedData) {
    const userPresets = JSON.parse(savedData);
    userPresets.forEach(p => {
      // Prevent duplicates by checking if ID already exists in FILTERS
      if (!FILTERS.find(f => f.id === p.id)) {
        const filterObj = createCustomFilter(p.id, p.name, p.settings);
        FILTERS.push(filterObj);
      }
    });
  }
}

function initApp() {
  // 1. Load data from storage first
  loadSavedPresets();
  
  // 2. Build the UI components
  buildFilterStrip();
  buildAdjPanel();

  // 3. Handle Service Worker (Optional cleanup)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
}

// Run the app
initApp();