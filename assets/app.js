/* Sadler Family Archive — shared behaviour for every page. */

/* ---------- avatars & photo support ---------- */
function initialsOf(p){
  const parts=p.name.replace(/\(.*?\)/g,'').trim().split(/\s+/);
  return (parts[0][0]+(parts.length>1?parts[parts.length-1][0]:'')).toUpperCase();
}
function avatarHTML(p,size){
  const b=BRANCH[p.branch];
  return `<span class="avatar" style="width:${size}px;height:${size}px;background:${b.hex};font-size:${Math.round(size*0.36)}px" aria-hidden="true">`+
    `<span>${initialsOf(p)}</span>`+
    `<img src="photos/${p.id}.jpg" alt="" loading="lazy" onerror="this.remove()">`+
  `</span>`;
}

/* ---------- profile panel ---------- */
document.body.insertAdjacentHTML('beforeend',
  '<div id="scrim" onclick="closePanel()"></div>'+
  '<aside id="panel" aria-label="Person record"><div class="pan-head" id="panHead"></div><div class="pan-body" id="panBody"></div></aside>');

let selected=null;
function openPerson(id){
  const p=P[id]; selected=id;
  const b=BRANCH[p.branch];
  $('#panel').style.borderLeftColor=b.hex;
  $('#panHead').innerHTML=`
    <span class="branch" style="color:${b.hex}">${b.name}${p.surnameUncertain?' · surname inferred':''}</span>
    <div class="headtop" style="margin-top:6px">${avatarHTML(p,64)}<div>
      <h3 style="margin-top:0">${p.name}</h3>
      ${p.maiden?`<div class="nick">${p.maiden}</div>`:''}
      ${p.variant?`<div class="nick" style="font-size:.82rem">${p.variant}</div>`:''}
      ${p.nicknames.length?`<div class="nick">\u201C${p.nicknames.join('\u201D, \u201C')}\u201D</div>`:''}
    </div></div>
    <button class="pan-close" onclick="closePanel()" aria-label="Close">✕</button>`;

  const rows=[];
  rows.push(['Born', p.birth ? [(p.birth.date||p.birth.year||'—'), p.birth.place?((p.birth.date||p.birth.year?' · ':'')+p.birth.place):''].join('') : '<span class="emptynote">not yet recorded</span>']);
  if(p.death) rows.push(['Died', (p.death.approx?'about ':'')+(p.death.date||p.death.year)+(p.death.detail?' · '+p.death.detail:'')]);
  const ls=lifespan(p); if(ls) rows.push(['Lifespan', ls]);
  if(p.motherNote) rows.push(['Mother', p.motherNote]);
  if(p.marriage) rows.push(['Married', (p.marriage.date?p.marriage.date+' · ':'')+'to '+(P[p.marriage.to]?P[p.marriage.to].name:p.marriage.to)]);
  if(p.marriedName) rows.push(['Marriage', p.marriedName]);
  if(p.places.length) rows.push(['Places', p.places.join(' · ')]);
  if(p.roles.length) rows.push(['Life\u2019s work', p.roles.join(' · ')]);
  rows.push(['Generation', genLabel(p)]);

  const chips = arr => arr.length
    ? `<div class="chips">${arr.map(i=>`<button class="chip" onclick="openPerson('${i}')">${shortChip(P[i])}</button>`).join('')}</div>`
    : `<p class="emptynote">None recorded.</p>`;
  const others = all.filter(x=>x.id!==id).sort((a,b2)=>a.name.localeCompare(b2.name));
  const siblings = p.parents.length ? P[p.parents[0]].children.filter(c=>c!==id) : [];
  const onTree = !!$('#treeSVG');
  const treeBtn = (p.frag==='unplaced')
    ? ''
    : onTree
      ? `<button class="btn ghost" style="width:100%" onclick="closePanel();jumpToTree('${id}')">Show on the tree</button>`
      : `<a class="btn ghost" style="width:100%" href="tree.html?focus=${id}">Show on the tree</a>`;

  const srcTags = p.srcs.map(s=>`<span class="srctag">${SRC[s]}</span>`).join('');
  const flagsHtml = p.flags.length ? `<div class="flaglist">${p.flags.map(f=>`<div class="flagline">⚑ ${f}</div>`).join('')}</div>` : '';
  const extraHtml = p.extra.length ? p.extra.map(x=>`<p class="xnote">${x}</p>`).join('') : '';
  const notesDetails = `
    <details class="xnotes" ${p.flags.length?'open':''}>
      <summary>Notes, sources &amp; flags</summary>
      <div class="xnotes-body">
        <div class="srctags">${srcTags}</div>
        ${flagsHtml}
        ${extraHtml || (p.flags.length?'':'<p class="emptynote">No additional notes yet — corrections and memories welcome.</p>')}
      </div>
    </details>`;

  $('#panBody').innerHTML=`
    ${rows.map(([k,v])=>`<div class="frow"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('')}
    <h4>Parents</h4>${chips(p.parents)}
    <h4>Partner${p.spouses.length>1?'s':''}</h4>${chips(p.spouses)}
    <h4>Siblings</h4>${chips(siblings)}
    <h4>Children</h4>${chips(p.children)}
    <h4>Story</h4>
    ${p.notes?`<div class="notebox">${p.notes}</div>`:`<p class="emptynote">No stories recorded yet — perhaps you can add one.</p>`}
    ${notesDetails}
    <h4>How is ${firstName(p)} related to…</h4>
    <div class="pathfind">
      <select id="pathSel" onchange="tracePath('${id}',this.value)">
        <option value="">Choose a family member…</option>
        ${others.map(o=>`<option value="${o.id}">${o.name}${o.desc&&o.name.startsWith('Unnamed')?' — '+o.desc.slice(0,40):''}</option>`).join('')}
      </select>
      <div class="pathout" id="pathOut"></div>
    </div>
    <div style="margin-top:26px">${treeBtn}</div>`;

  $('#panel').classList.add('open');
  $('#scrim').classList.add('open');
  if(typeof treeBuilt!=='undefined' && treeBuilt) highlight(id);
}
function jumpToTree(id){
  const a=document.getElementById('view-tree-anchor');
  if(a) a.scrollIntoView({behavior:'smooth'});
  centerOn(id);
}
function firstName(p){ return p.name.split(' ')[0]; }
function shortChip(p){ let n=p.name; if(n.length>26)n=n.slice(0,25)+'…'; return n; }
function closePanel(){ $('#panel').classList.remove('open'); $('#scrim').classList.remove('open'); if(typeof clearHighlight==='function' && $('#treeSVG')) clearHighlight(); }
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closePanel(); });

function tracePath(fromId,toId){
  const out=$('#pathOut');
  if(!toId){ out.innerHTML=''; return; }
  const prev={}; const rel={}; const q=[fromId]; const seen=new Set([fromId]);
  while(q.length){
    const cur=q.shift();
    if(cur===toId) break;
    const nb=[];
    P[cur].parents.forEach(p=>nb.push([p,'parent']));
    P[cur].children.forEach(c=>nb.push([c,'child']));
    P[cur].spouses.forEach(s=>nb.push([s,'spouse']));
    nb.forEach(([n,r])=>{ if(!seen.has(n)){ seen.add(n); prev[n]=cur; rel[n]=r; q.push(n); } });
  }
  if(!seen.has(toId)){ out.innerHTML='<p class="emptynote">No recorded connection between these two — they sit in family groups that are not yet linked.</p>'; return; }
  const chain=[]; let c=toId;
  while(c!==fromId){ chain.unshift(c); c=prev[c]; }
  let html2=`<div class="pathstep"><span class="rel">Start</span><strong>${P[fromId].name}</strong></div>`;
  let prevId=fromId;
  chain.forEach(idc=>{
    const r=rel[idc];
    const label = r==='parent'?'parent of '+firstName(P[prevId]) : r==='child'?'child of '+firstName(P[prevId]) : 'partner of '+firstName(P[prevId]);
    html2+=`<div class="pathstep"><span class="rel">${label}</span><button class="chip" onclick="openPerson('${idc}')">${P[idc].name}</button></div>`;
    prevId=idc;
  });
  html2+=`<p style="margin-top:8px;font-size:.8rem;color:var(--ink-soft)">${chain.length} step${chain.length>1?'s':''} apart in the recorded tree.</p>`;
  out.innerHTML=html2;
}

/* ---------- search ---------- */
(function(){
  const sIn=$('#search'), sRes=$('#sresults');
  if(!sIn) return;
  sIn.addEventListener('input', ()=>{
    const q=sIn.value.trim().toLowerCase();
    if(!q){ sRes.classList.remove('open'); sRes.innerHTML=''; return; }
    const hits=all.filter(p=>p.name.toLowerCase().includes(q)||p.nicknames.some(n=>n.toLowerCase().includes(q))||(p.variant||'').toLowerCase().includes(q)).slice(0,9);
    sRes.innerHTML = hits.length
      ? hits.map(p=>`<button onclick="openPerson('${p.id}');searchDone()">${displayName(p)}${p.nicknames.length?' <em>('+p.nicknames.join(', ')+')</em>':''}<span class="meta">${yearsOf(p)} · ${BRANCH[p.branch].name}</span></button>`).join('')
      : `<button disabled>No one found — try another spelling</button>`;
    sRes.classList.add('open');
  });
  window.searchDone=function(){ sIn.value=''; sRes.classList.remove('open'); };
  document.addEventListener('click', e=>{ if(!e.target.closest('.searchbox')) sRes.classList.remove('open'); });
})();

/* ================================================================
   TREE — generic recursive layout with fragments and ghost nodes
================================================================ */
const NW=168, NH=58, GX=16, GY=150;
let treeBuilt=false;
let placements=[], treeEdges=[], marriageBars=[], sectionLabels=[];
const solidPos={}; // person id -> {x,y} of their solid card

function spouseList(p){ const hide=(p.hideSpouses||[]).concat(p.spouseGhosts||[]); return p.spouses.filter(s=>!hide.includes(s)); }

function widthOf(pid){
  const p=P[pid];
  if(p._w!==undefined) return p._w;
  const unitCount = 1 + spouseList(p).length + (p.spouseGhosts||[]).length;
  const unitW = unitCount*(NW+GX)-GX;
  let kidsW=0;
  p.children.forEach(c=>{ kidsW += (P[c].childGhost? NW : widthOf(c)) + GX; });
  kidsW = Math.max(0,kidsW-GX);
  p._w = Math.max(unitW,kidsW);
  return p._w;
}

function place(pid, x, row){
  const p=P[pid]; const w=widthOf(pid);
  const y = row*GY;
  // children first
  let kidsW=0;
  p.children.forEach(c=>{ kidsW += (P[c].childGhost? NW : widthOf(c)) + GX; });
  kidsW=Math.max(0,kidsW-GX);
  let kx = x+(w-kidsW)/2;
  const childPos={};
  p.children.forEach(c=>{
    const cw = P[c].childGhost? NW : widthOf(c);
    if(P[c].childGhost){
      placements.push({id:c,x:kx,y:(row+1)*GY,ghost:true});
      childPos[c]={x:kx,y:(row+1)*GY};
    } else {
      place(c,kx,row+1);
      childPos[c]=solidPos[c];
    }
    kx += cw+GX;
  });
  // unit
  const unitIds=[pid,...spouseList(p)];
  const ghostIds=(p.spouseGhosts||[]);
  const unitCount=unitIds.length+ghostIds.length;
  const unitW=unitCount*(NW+GX)-GX;
  let ux=x+(w-unitW)/2;
  const unitPos={};
  unitIds.forEach(u=>{
    placements.push({id:u,x:ux,y:y,ghost:false});
    unitPos[u]={x:ux,y:y};
    if(!solidPos[u]) solidPos[u]={x:ux,y:y};
    ux+=NW+GX;
  });
  ghostIds.forEach(gi=>{
    placements.push({id:gi,x:ux,y:y,ghost:true});
    unitPos[gi]={x:ux,y:y};
    ux+=NW+GX;
  });
  // marriage bars between consecutive unit members
  const ordered=[...unitIds,...ghostIds];
  for(let i=0;i<ordered.length-1;i++){
    const a=unitPos[ordered[i]], b=unitPos[ordered[i+1]];
    marriageBars.push(`M ${a.x+NW} ${a.y+NH/2} H ${b.x}`);
  }
  // parent->child edges, grouped by the other parent
  const groups={};
  p.children.forEach(c=>{
    const other=P[c].parents.find(pp=>pp!==pid)||'';
    (groups[other]=groups[other]||[]).push(c);
  });
  let gi2=0;
  Object.keys(groups).forEach(other=>{
    const kidsArr=groups[other];
    let midX;
    if(other && unitPos[other]) midX=(unitPos[pid].x+NW/2 + unitPos[other].x+NW/2)/2;
    else midX=unitPos[pid].x+NW/2;
    const topY=y+NH;
    const busY=topY+(GY-NH)/2+10+gi2*14;
    let d='';
    kidsArr.forEach(c=>{ const kp=childPos[c]; d+=`M ${midX} ${topY+4} V ${busY} H ${kp.x+NW/2} V ${kp.y} `; });
    treeEdges.push(d);
    gi2++;
  });
}

function layoutAll(){
  placements=[]; treeEdges=[]; marriageBars=[]; sectionLabels=[];
  Object.values(P).forEach(p=>delete p._w);

  /* ---- main trunk ---- */
  const ROW0=0.4; // rows: 0.4 malcolm-gf, 1.4 ancestors, 2.4 D&E, 3.4 children...
  place('daniel', 0, 2); // daniel unit (with elizabeth) + all descendants, rows 2..7
  // shift everything so far by +ROW margin later via fitCam; add ancestors manually
  const dp=solidPos['daniel'], ep=solidPos['elizabeth'];
  // Anne, Daniel's sister, to his left
  const annX=dp.x-(NW+GX)*1.35;
  placements.push({id:'anne',x:annX,y:dp.y,ghost:false}); solidPos['anne']={x:annX,y:dp.y};
  // Bullarkie parents above, centred between Anne and Daniel
  const bC=(annX+NW/2+dp.x+NW/2)/2;
  const bf={x:bC-NW-GX/2,y:dp.y-GY}, bm={x:bC+GX/2,y:dp.y-GY};
  placements.push({id:'bull-father',...bf,ghost:false}); solidPos['bull-father']=bf;
  placements.push({id:'bull-mother',...bm,ghost:false}); solidPos['bull-mother']=bm;
  marriageBars.push(`M ${bf.x+NW} ${bf.y+NH/2} H ${bm.x}`);
  treeEdges.push(`M ${(bf.x+NW+ (bm.x-(bf.x+NW))/2)} ${bf.y+NH+4} V ${bf.y+NH+40} H ${dp.x+NW/2} V ${dp.y} M ${(bf.x+NW+(bm.x-(bf.x+NW))/2)} ${bf.y+NH+4} V ${bf.y+NH+40} H ${annX+NW/2} V ${dp.y}`);
  // Malcolm parents above Elizabeth (offset right to clear the Bullarkie couple)
  const mf={x:ep.x+70,y:ep.y-GY}, em={x:ep.x+70+NW+GX,y:ep.y-GY};
  placements.push({id:'malcolm-father',...mf,ghost:false}); solidPos['malcolm-father']=mf;
  placements.push({id:'eliz-mother',...em,ghost:false}); solidPos['eliz-mother']=em;
  marriageBars.push(`M ${mf.x+NW} ${mf.y+NH/2} H ${em.x}`);
  treeEdges.push(`M ${(mf.x+NW+(em.x-(mf.x+NW))/2)} ${mf.y+NH+4} V ${mf.y+NH+40} H ${ep.x+NW/2} V ${ep.y}`);
  // Malcolm grandfather above Malcolm father
  const mg={x:mf.x,y:mf.y-GY};
  placements.push({id:'malcolm-gf',...mg,ghost:false}); solidPos['malcolm-gf']=mg;
  treeEdges.push(`M ${mg.x+NW/2} ${mg.y+NH+4} V ${mf.y}`);

  const trunkW=widthOf('daniel');
  let bottom=Math.max(...placements.map(pl=>pl.y))+NH;

  /* ---- fragments row ---- */
  const fragY0=bottom+180;
  sectionLabels.push({x:0,y:fragY0-60,text:'NOT YET LINKED TO THE MAIN TRUNK — SEPARATE FAMILY GROUPS FROM THE MASTER DATABASE'});
  const fragRoots=['martel','brissit0','glenb','scotsman'];
  const baseRow=Math.round(fragY0/GY)+1;
  let fx=0;
  fragRoots.forEach(r=>{
    const w=widthOf(r);
    const before=placements.length;
    place(r, fx, baseRow);
    sectionLabels.push({x:fx,y:baseRow*GY-30,text:FRAG_NAMES[P[r].frag].toUpperCase(),small:true});
    fx+=w+260;
  });
  bottom=Math.max(...placements.map(pl=>pl.y))+NH;

  /* ---- unplaced singles ---- */
  const singles=all.filter(p=>p.frag==='unplaced');
  const sy=bottom+160;
  sectionLabels.push({x:0,y:sy-40,text:'NO RECORDED FAMILY LINKS YET'});
  let sx=0;
  singles.forEach(p=>{ placements.push({id:p.id,x:sx,y:sy,ghost:false}); solidPos[p.id]={x:sx,y:sy}; sx+=NW+GX; });

  const minX=Math.min(...placements.map(pl=>pl.x));
  const maxX=Math.max(...placements.map(pl=>pl.x))+NW;
  const minY=Math.min(...placements.map(pl=>pl.y));
  const maxY=Math.max(...placements.map(pl=>pl.y))+NH;
  return {minX,maxX,minY,maxY,w:maxX-minX,h:maxY-minY};
}

function shortName(p){
  let n=p.name;
  if(n.length>21){ const parts=n.split(' '); if(parts.length>2) n=parts[0]+' '+parts[parts.length-1]; }
  if(n.length>21) n=n.slice(0,20)+'…';
  return n + (p.surnameUncertain?' *':'');
}

function buildTree(){
  treeBuilt=true;
  const dims=layoutAll();
  const svg=$('#treeSVG');
  const NS='http://www.w3.org/2000/svg';
  svg.innerHTML='';
  const g=document.createElementNS(NS,'g'); g.id='camera'; svg.appendChild(g);

  sectionLabels.forEach(l=>{
    const t=document.createElementNS(NS,'text');
    t.setAttribute('x',l.x); t.setAttribute('y',l.y);
    t.setAttribute('class','genlabel'+(l.small?' small':''));
    t.textContent=l.text; g.appendChild(t);
  });
  treeEdges.forEach(d=>{ const p=document.createElementNS(NS,'path'); p.setAttribute('d',d); p.setAttribute('class','edge'); g.appendChild(p); });
  marriageBars.forEach(d=>{ const p=document.createElementNS(NS,'path'); p.setAttribute('d',d); p.setAttribute('class','medge'); g.appendChild(p); });

  placements.forEach(pl=>{
    const p=P[pl.id];
    const grp=document.createElementNS(NS,'g');
    grp.setAttribute('class','pnode'+(pl.ghost?' ghostnode':''));
    grp.setAttribute('data-id',pl.id);
    grp.setAttribute('transform',`translate(${pl.x},${pl.y})`);
    grp.setAttribute('tabindex','0'); grp.setAttribute('role','button');
    grp.setAttribute('aria-label',p.name+(pl.ghost?' (also shown elsewhere on the tree)':''));
    const r=document.createElementNS(NS,'rect');
    r.setAttribute('width',NW); r.setAttribute('height',NH); r.setAttribute('rx',8);
    grp.appendChild(r);
    const bar=document.createElementNS(NS,'rect');
    bar.setAttribute('width',5); bar.setAttribute('height',NH); bar.setAttribute('rx',2.5);
    bar.setAttribute('fill',BRANCH[p.branch].hex);
    grp.appendChild(bar);
    const t1=document.createElementNS(NS,'text');
    t1.setAttribute('x',14); t1.setAttribute('y',24); t1.setAttribute('class','pname');
    t1.textContent=shortName(p)+(pl.ghost?' ↗':'');
    grp.appendChild(t1);
    const t2=document.createElementNS(NS,'text');
    t2.setAttribute('x',14); t2.setAttribute('y',42); t2.setAttribute('class','pyears');
    t2.textContent=yearsOf(p);
    grp.appendChild(t2);
    grp.addEventListener('click',()=>openPerson(pl.id));
    grp.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPerson(pl.id);}});
    g.appendChild(grp);
  });
  initCamera(dims);
}

let cam={x:0,y:0,k:1}, dims2=null;
function applyCam(){ $('#camera').setAttribute('transform',`translate(${cam.x},${cam.y}) scale(${cam.k})`); }
function initCamera(dims){
  dims2=dims;
  fitTrunk();
  const svg=$('#treeSVG'); const wrap=$('#treeWrap');
  let drag=null;
  svg.addEventListener('pointerdown',e=>{ drag={x:e.clientX,y:e.clientY,cx:cam.x,cy:cam.y}; svg.classList.add('dragging'); svg.setPointerCapture(e.pointerId); });
  svg.addEventListener('pointermove',e=>{ if(!drag)return; cam.x=drag.cx+(e.clientX-drag.x); cam.y=drag.cy+(e.clientY-drag.y); applyCam(); });
  svg.addEventListener('pointerup',()=>{ drag=null; svg.classList.remove('dragging'); });
  svg.addEventListener('wheel',e=>{ e.preventDefault(); zoomAt(e.offsetX,e.offsetY, e.deltaY<0?1.12:0.89); },{passive:false});
  $('#zin').onclick=()=>zoomAt(wrap.clientWidth/2,wrap.clientHeight/2,1.25);
  $('#zout').onclick=()=>zoomAt(wrap.clientWidth/2,wrap.clientHeight/2,0.8);
  $('#zfit').onclick=fitAll;
  const zt=$('#ztrunk'); if(zt) zt.onclick=fitTrunk;
}
function fitAll(){
  const wrap=$('#treeWrap');
  const pad=80;
  const k=Math.max(0.03,Math.min(wrap.clientWidth/(dims2.w+2*pad), wrap.clientHeight/(dims2.h+2*pad), 1.2));
  cam={k:k, x:-(dims2.minX-pad)*k + (wrap.clientWidth-(dims2.w+2*pad)*k)/2, y:-(dims2.minY-pad)*k+10};
  applyCam();
}
function fitTrunk(){
  // open on Daniel & Elizabeth with their children readable
  const wrap=$('#treeWrap');
  const d=solidPos['daniel'];
  cam.k=0.55;
  cam.x=wrap.clientWidth/2-(d.x+NW)*cam.k;
  cam.y=60-(d.y-GY)*cam.k;
  applyCam();
}
function zoomAt(px,py,f){
  const nk=Math.min(2.4,Math.max(0.03,cam.k*f));
  cam.x=px-(px-cam.x)*(nk/cam.k);
  cam.y=py-(py-cam.y)*(nk/cam.k);
  cam.k=nk; applyCam();
}
function centerOn(id){
  const wrap=$('#treeWrap'); const p=solidPos[id]; if(!p)return;
  cam.k=Math.max(cam.k,0.7);
  cam.x=wrap.clientWidth/2-(p.x+NW/2)*cam.k;
  cam.y=wrap.clientHeight/2-(p.y+NH/2)*cam.k;
  applyCam();
  if(typeof highlight==='function') highlight(id);
}
function highlight(id){
  const keep=new Set([id]);
  (function up(i){ P[i].parents.forEach(p=>{ keep.add(p); up(p); }); })(id);
  (function down(i){ P[i].children.forEach(c=>{ keep.add(c); down(c); }); })(id);
  P[id].spouses.forEach(s=>keep.add(s));
  document.querySelectorAll('.pnode').forEach(n=>{
    n.classList.toggle('dim', !keep.has(n.dataset.id));
    n.classList.toggle('selected', n.dataset.id===id);
  });
}
function clearHighlight(){ document.querySelectorAll('.pnode').forEach(n=>{n.classList.remove('dim','selected');}); }

/* ---------- people directory ---------- */
let filter='all';
const FILTERS=[['all','Everyone'],['sadler','Sadler line'],['gordon','Gordon–Richards'],['bucknor','Bucknor'],['bigby','Bigby'],['patterson','Patterson'],['aiken','Aiken'],['bullarkie','Bullarkie'],['malcolm','Malcolm'],['other','Married in'],['flagged','⚑ Flagged']];
function setupPeople(){
  const param=new URLSearchParams(location.search).get('branch');
  if(param && FILTERS.some(f=>f[0]===param)) filter=param;
  $('#filters').innerHTML=FILTERS.map(([k,l])=>`<button data-f="${k}" class="${k===filter?'active':''}">${l}</button>`).join('');
  document.querySelectorAll('#filters button').forEach(b=>b.addEventListener('click',()=>{
    filter=b.dataset.f;
    document.querySelectorAll('#filters button').forEach(x=>x.classList.toggle('active',x===b));
    renderPeople();
  }));
  renderPeople();
}
function renderPeople(){
  const list = all.filter(p=>{
    if(filter==='all') return true;
    if(filter==='flagged') return p.flags.length>0;
    return p.branch===filter;
  }).sort((a,b)=>(a.frag==='trunk'?0:1)-(b.frag==='trunk'?0:1) || a.depth-b.depth || (a.birth&&a.birth.year?a.birth.year:9999)-(b.birth&&b.birth.year?b.birth.year:9999) || a.name.localeCompare(b.name));
  $('#peopleCount').textContent=list.length+' people';
  $('#peopleGrid').innerHTML=list.map(p=>`
    <div class="pcard card" style="border-top-color:${BRANCH[p.branch].hex}" role="button" tabindex="0"
      onclick="openPerson('${p.id}')" onkeydown="if(event.key==='Enter')openPerson('${p.id}')">
      <div class="cardtop">${avatarHTML(p,48)}<div>
        <h3>${displayName(p)}${p.flags.length?' <span class="flagmark" title="Flagged in Data review">⚑</span>':''}</h3>
        ${p.nicknames.length?`<div class="nick">\u201C${p.nicknames.join('\u201D, \u201C')}\u201D</div>`:''}
      </div></div>
      <div class="yrs">${yearsOf(p)}</div>
      <div class="desc">${p.desc||''}</div>
      <div class="gen">${genLabel(p)}</div>
    </div>`).join('');
}

/* ---------- timeline ---------- */
function lnk(id,label){ return `<button onclick="openPerson('${id}')">${label}</button>`; }
const EVENTS=[
  {y:'1846', kind:'journey', text:()=>`Daniel\u2019s parents leave <strong>Rajasthan, India</strong> for Jamaica. His father takes up work as an indentured bookkeeper on the Kew Estates, Hanover — the estate of the Sadler family, whose name the family would carry.`},
  {y:'1878', kind:'birth', pid:'daniel'},
  {y:'1879', kind:'birth', pid:'elizabeth'},
  {y:'1903', kind:'marriage', text:()=>`<b>9 August</b> — ${lnk('daniel','Daniel Sadler')} marries ${lnk('elizabeth','Elizabeth Malcolm')} in Hanover.`},
  {y:'1903', kind:'birth', text:()=>`<b>21 June</b> — ${lnk('michael','Michael Sadler')} (written \u201CMicah\u201D in the family document) is born in Jericho, Hanover.`},
  {y:'1904', kind:'birth', pid:'herga'},
  {y:'1906', kind:'birth', pid:'lester'},
  {y:'1908', kind:'birth', pid:'jonah'},
  {y:'1924', approx:true, kind:'death', text:()=>`${lnk('lester','Lester Sadler')} dies at just 18 years old. (Year estimated from his 1906 birth.)`},
  {y:'1924', kind:'birth', pid:'monte'},
  {y:'1940', kind:'birth', text:()=>`<b>6 January</b> — ${lnk('louis','Louis Sadler')} (Oswald Louis in the family document) is born, the first of Jonah\u2019s children.`},
  {y:'1941', kind:'birth', pid:'clifford'},
  {y:'1941', kind:'birth', pid:'canute'},
  {y:'1942', kind:'birth', pid:'kingsley'},
  {y:'1944', kind:'marriage', text:()=>`<b>17 February</b> — ${lnk('jonah','Jonah \u201CMass Jonah\u201D Sadler')} marries ${lnk('gertrude','Gertrude Bucknor')}.`},
  {y:'1944', kind:'birth', pid:'owen'},
  {y:'1947', kind:'birth', pid:'trevor'},
  {y:'1948', kind:'birth', pid:'romel'},
  {y:'1951', kind:'birth', pid:'carmen'},
  {y:'1953', kind:'death', text:()=>`${lnk('daniel','Daniel Sadler')} — Pupa — dies, leaving 12 acres of land at Jericho. The surveyor, philosopher, astrologer and teacher was 74\u201375 by his recorded birth year.`},
  {y:'1968', kind:'birth', pid:'shaun'},
  {y:'1973', kind:'birth', pid:'mark'},
  {y:'1976', kind:'death', text:()=>`<b>23 August</b> — ${lnk('elizabeth','Elizabeth Sadler')} — Muma, Queenie, Mother Dan — dies aged 97, having outlived Daniel by 23 years.`},
  {y:'1981', kind:'death', text:()=>`<b>14 November</b> — ${lnk('jonah','Jonah Oliver Sadler')} dies aged 73.`},
  {y:'1991', kind:'birth', pid:'tashan'},
  {y:'1997', kind:'birth', pid:'aaliyah'},
  {y:'2002', kind:'birth', text:()=>`<b>13 October</b> — ${lnk('marie-m','Marie Sadler')} is born.`},
  {y:'2009', approx:true, kind:'birth', text:()=>`${lnk('april','April Sadler')}, daughter of Louis Sadler, is born in the UK \u2014 the youngest member of the tree. (Year estimated from her age.)`},
  {y:'2009', kind:'death', text:()=>`${lnk('clifford','Clifford Sadler')} dies.`},
  {y:'2023', kind:'death', text:()=>`<b>7 December</b> — ${lnk('trevor','Trevor Sadler')} dies, the most recent passing in the record.`},
];
function birthLine(pid){
  const p=P[pid];
  const d=p.birth.date?('<b>'+p.birth.date+'</b> — '):'';
  const pl=p.birth.place?(' in '+p.birth.place):'';
  return `${d}${lnk(pid,displayName(p))} is born${pl}.`;
}
function renderTimeline(){
  $('#timeline').innerHTML=EVENTS.map(e=>{
    const text = e.pid ? birthLine(e.pid) : e.text();
    return `<div class="tlitem ${e.kind}">
      <div class="tlkind">${e.kind}</div>
      <div class="tlyear">${e.y}${e.approx?'<span class="approxmark">~</span>':''}</div>
      <div class="tltext">${text}</div>
    </div>`;
  }).join('');
}

/* ---------- branches ---------- */
const BR_DESC={
  sadler:'The name both origin lines flowed into — and the whole main trunk that grew from Daniel and Elizabeth: their fifteen recorded children and every descendant, from Jamaica to London.',
  bullarkie:'Daniel\u2019s birth family — Indian parents who crossed from Rajasthan in 1846 under indenture. The name Bullarkie was set aside for Sadler, taken from the estate where his father kept the books.',
  malcolm:'Elizabeth\u2019s people: a Scottish landowner, an overseer of Hopewell, and an African mother who was enslaved on the Sadler estate. The Malcolms once owned the land where Knockalva stands.',
  bigby:'Herga Sadler married Lester Bigby, and their eight children — Vivian, Ted, Michael, Beryl, Hugh (Tat), Rollin, Vonnie and Antonio — form the Bigby branch of the family.',
  patterson:'Lilian Sadler married Reginol Patterson. Their children — Avis (who keeps the Sadler name), Lauris, Epsi, Grace, and possibly Elaine — come from the oral-history notes.',
  gordon:'The large in-law network — Brissit, Gordon, Richards, Jordan, Greenaway, Phillips, Samual and Grant families — which enters the tree through Beverley Richards, who married Owen Sadler.',
  bucknor:'Gertrude Bucknor married Mass Jonah. A separate Bucknor family (Glen & Wilfrid\u2019s) and six unplaced Bucknors are recorded — how they all connect to Gertrude is an open question.',
  aiken:'Martel and Mildred Aiken\u2019s family, connected to the Gordon network by Griselda Aiken\u2019s marriage to Norman Gordon — but not yet linked to the main trunk.',
  other:'Husbands and wives who married into the recorded lines — from Mary and Hazel to Rupert Morling and Linda Berg — each a doorway to a family of their own, not yet traced.',
};
function renderBranches(){
  $('#branchCards').innerHTML=Object.keys(BRANCH).map(k=>{
    const count=all.filter(p=>p.branch===k).length;
    return `<div class="branchcard card" style="border-top-color:${BRANCH[k].hex}">
      <h3>${BRANCH[k].name}</h3>
      <p>${BR_DESC[k]}</p>
      <span class="count" style="color:${BRANCH[k].hex}">${count} recorded ${count===1?'person':'people'}</span>
      <div style="margin-top:14px"><a class="btn ghost" href="people.html?branch=${k}" data-branchlink="${k}">See members</a></div>
    </div>`;
  }).join('');
  // one-page mode: turn links into filter jumps
  if(!document.body.dataset.multipage){
    document.querySelectorAll('[data-branchlink]').forEach(a=>{
      a.addEventListener('click',e=>{
        e.preventDefault();
        filter=a.dataset.branchlink;
        document.querySelectorAll('#filters button').forEach(x=>x.classList.toggle('active',x.dataset.f===filter));
        renderPeople();
        const anch=document.getElementById('view-people-anchor');
        if(anch) anch.scrollIntoView({behavior:'smooth'});
      });
    });
  }
}

/* ---------- stories ---------- */
const STORIES=[
  {t:'How Bullarkie became Sadler', body:[
    'Daniel Sadler was born Bullarkie. His father arrived in Jamaica in 1846 as an indentured servant from Rajasthan, India, and worked as a bookkeeper on the Kew Estates in Hanover — an estate owned by a family called Sadler. It is from that estate, and that family, that the surname was taken.',
    'There is a hard symmetry in the record: the same Sadler estate that gave the family its name is also where Elizabeth\u2019s mother, an African woman, was held in slavery. Two lines of the family met the name Sadler from opposite sides of the estate ledger — and made it their own.'
  ]},
  {t:'Daniel, the surveyor-philosopher', body:[
    'Daniel — Pupa — worked as a land surveyor for Public Works, and among the lands he surveyed was the Sadler family\u2019s own. The record remembers him as more than a surveyor: a philosopher, an astrologer, and a teacher, who passed the 3rd Jamaica Local Exam.',
    'At his death in 1953 he owned twelve acres of land at Jericho — a man whose parents arrived with nothing but an indenture contract, ending his life a landowner.'
  ]},
  {t:'Queenie of Castle Heights', body:[
    'Elizabeth — Muma, Queenie, Mother Dan — was born in 1879 at Castle Heights, Hanover, the last of eleven children on her father\u2019s side. Her father was an overseer at Hopewell whose own father was a landowner from Scotland; her mother was an African woman enslaved on the Sadler estate.',
    'She married Daniel on 9 August 1903 and raised a houseful of children — twelve by the family document\u2019s count, fifteen names across all the records. She lived to 97, dying on 23 August 1976, the longest life in the record.'
  ]},
  {t:'The Malcolms and Knockalva', body:[
    'The Malcolm family once owned the area where Knockalva now sits, including the great house that still stands on the property. In time the family donated the great house to the government, which later gave it to the school.',
    'It means a piece of the family\u2019s story is still standing — a building the wider community learned in.'
  ]},
  {t:'Mass Jonah\u2019s house of ten', body:[
    'Jonah Oliver Sadler — Mass Jonah — was born in Brownsville on 1 October 1908. He married Gertrude Bucknor on 17 February 1944, and his ten recorded children — from Louis in 1940 to Carmen in 1951, plus a child whose name was never written down — form the best-documented branch of the family.',
    'Two of his sons, Trevor and Clifford, had mothers other than Gertrude — and the family is currently unsure who those mothers were. It is one of the open questions on the Data review page.',
    'Jonah died on 14 November 1981, aged 73. His son Trevor, who died on 7 December 2023, is the most recent passing in the family record.'
  ]},
  {t:'Cascade, Retrieve, and Bath', body:[
    'The oral history places the family in real, specific corners of Jamaica. Glen Sadler, one of Hesra\u2019s children, was water commissioner for Cascade and Retrieve in Hanover Parish. Monte Sadler is remembered in connection with Bath, in St Thomas Parish, clear across the island.',
    'These place-memories are some of the strongest threads for future research — parish records in Hanover and St Thomas may hold the documents behind the stories.'
  ]},
  {t:'London and Miami', body:[
    'The tree now reaches well beyond Jamaica. Michelle Sadler, Clifford and Hazel\u2019s daughter, was born at North Middlesex Hospital in London. Trevor\u2019s daughter — not yet named in the record — works in medicine in Miami, Florida, described in the oral history as \u201Chigh profile\u201D.',
    'Two branches, two continents, one family.'
  ]},
  {t:'The network through Beverley', body:[
    'When Beverley Richards married Owen Sadler, she brought a whole world with her: the Brissit, Gordon, Richards, Jordan, Greenaway, Phillips, Samual and Grant families, more than fifty people recorded in the master database.',
    'Beverley appears twice on the tree — beside Owen in the main trunk, and (dashed) under her mother Cleopatra Gordon — but she is one person, and the bridge between the two halves of this archive.'
  ]},
  {t:'Anne, who lived close by', body:[
    'Daniel had many siblings, but the record singles out one: his sister Anne — Christiana Bullarkie, who married a Meggoe — because she was the one who lived close to him. Sometimes what a family remembers is not a date, but a distance.'
  ]},
];
function renderStories(){
  $('#storyList').innerHTML=STORIES.map(s=>`
    <div class="story card">
      <h3>${s.t}</h3>
      ${s.body.map(p=>`<p>${p}</p>`).join('')}
      <span class="src">Source · Sadler family records</span>
    </div>`).join('');
}

/* ---------- data review ---------- */
const REVIEWS=[
  {open:true, t:'Who were Trevor\u2019s and Clifford\u2019s mothers?', d:'Confirmed (August 2026): both were Jonah\u2019s sons, and neither\u2019s mother was Gertrude. The family first said the two had different mothers from each other, and now notes it is unsure who either mother was — so both the names and whether they were one woman or two remain open. The tree shows both men descending from Jonah alone.'},
  {open:true, t:'Are the two Amos Gordons one man?', d:'Amos Gordon who married Adlyn Brissit, and Amos Gordon the grandson of Scotsman Gordon, are separate records. If they are the same man, the Scotsman line becomes direct ancestry for the whole Gordon\u2013Richards network — a significant extension. Unconfirmed either way.'},
  {open:true, t:'Cleopatra\u2019s three husbands', d:'Lucal, Lucas and Ruphas Richards are all recorded as Cleopatra Gordon\u2019s husbands. These may be three men, or spelling variants of fewer. Faye is recorded under Lucal; Anne Marie, Dossy and Beverley under Ruphas.'},
  {open:true, t:'Name-variant merges between the two sources', d:'The master database and the family document name Daniel & Elizabeth\u2019s children differently. Merged as likely the same person, pending confirmation: Michael = Micah (b. 21 June 1903) · Hesra = Ezra · Harboury = Arbrey · Lilian = Lilieth \u201CLilly\u201D · Monte = Montaque \u201CMonty\u201D (b. 1924) · Louis = Oswald Louis. Each carries a flag on their record.'},
  {open:true, t:'Berte vs. Herbert (Bertie)', d:'The master database records Berte Sadler (married Mary); the oral history separately records a Herbert Sadler; the family document lists \u201CHerbert (Bertie) Saddler\u201D. Berte and Bertie may be the same person recorded twice. Kept as two separate entries until the family confirms.'},
  {open:true, t:'Winnie and Lester — family document only', d:'Winnie Sadler and Lester Sadler (b. July 1906, died at 18) appear among Daniel & Elizabeth\u2019s children only in the family document, not in the master database. Included with source flags.'},
  {open:true, t:'How many children did Daniel & Elizabeth have?', d:'The family document says twelve. With the five name-variant questions now settled, fifteen names remain recorded — so the count still turns on the Berte/Herbert question and on Winnie, Lester, Hortence, Herbert and Enid, who each appear in only one source.'},
  {open:true, t:'Children born before Jonah and Gertrude\u2019s 1944 marriage', d:'Louis (1940), Canute (1941) and Kingsley (1942) were born before the recorded February 1944 marriage and are listed under Gertrude. Given Trevor and Clifford turned out to have other mothers, worth confirming Gertrude is the mother of these three.'},
  {open:true, t:'Gertrude and the Bucknor family', d:'Gertrude was born a Bucknor. A separate Glen & Wilfrid Bucknor family and six unplaced Bucknors (Adele, Bell, Grey, Helen, Madere, Manman) are in the master data with no recorded link to her. This is the most likely connection point between those fragments and the main trunk.'},
  {open:true, t:'Elaine Patterson\u2019s placement', d:'The notes set Elaine apart from Avis, Lauris, Epsi and Grace — she may be their sister or a niece. Shown as a sibling, flagged as uncertain.'},
  {open:true, t:'Possible duplicate — Adlyn Brissit', d:'A likely duplicate Adlyn Brissit record was spotted in the master data during earlier review sessions and is still being checked.'},
  {open:true, t:'Unconnected family fragments', d:'Four groups have no recorded link to the main trunk: the Aiken family, the Brissit\u2013Gordon\u2013Richards network (which connects in practice through Beverley\u2019s marriage to Owen, though the master data never recorded her line-of-descent link explicitly), the Glen & Wilfrid Bucknor family, and the Scotsman Gordon fragment.'},
  {open:true, t:'Unnamed individuals awaiting names', d:'Berte\u2019s daughter and granddaughter · Erskine\u2019s three daughters · Jonah\u2019s unnamed child (#155) · Trevor\u2019s daughter (the Miami doctor) · Harboury\u2019s wife · Lisa and Ken\u2019s child · the Brissit, Scotsman-Gordon and Samual unnamed entries · Daniel\u2019s parents and Elizabeth\u2019s parents and grandfather · plus \u201CPalty\u201D and \u201CNanny\u201D, possibly nicknames.'},
  {open:true, t:'Daniel\u2019s age at death', d:'The document says Daniel died in 1953 \u201Cin his sixties\u201D, but with a birth year of 1878 he would have been 74 or 75.'},
  {open:true, t:'Elizabeth\u2019s age at marriage', d:'Recorded as 22 at her 1903 wedding, but a birth year of 1879 makes her 24.'},
  {open:true, t:'Michael/Micah\u2019s birth and the wedding', d:'The 21 June 1903 birth date (from the Micah record) falls about seven weeks before Daniel and Elizabeth\u2019s wedding on 9 August 1903. Recorded as given.'},
  {open:true, t:'Lester\u2019s death year', d:'Recorded only as \u201Cdied at 18 years\u201D; estimated as about 1924 from his July 1906 birth and marked approximate.'},
  {open:true, t:'Sadler vs. Saddler', d:'The family document spells the surname both ways, sometimes in the same table. This site standardises on \u201CSadler\u201D, matching the estate-name origin story.'},
  {open:true, t:'Surnames of Herga\u2019s children', d:'Vivian, Ted, Michael, Beryl, Hugh (Tat), Rollin, Vonnie and Antonio are listed by first name only; Bigby is inferred from their father and marked with *.'},
  {open:false, t:'Tevin and Troy — resolved', d:'Tevin Topias Sadler and Troy Henrick Sadler are confirmed (August 2026) as sons of Stephen Sadler and Linda Berg. They are not in the July 2026 export and are included on the family\u2019s word.'},
  {open:false, t:'Kingsley\u2019s birth date — resolved', d:'The family confirmed (August 2026) Kingsley was born in 1942 \u2014 4 September 1942 per the family document \u2014 settling the master database\u2019s 23 September 1943.'},
  {open:false, t:'Name variants — resolved', d:'The family confirmed (August 2026) the five variant-name questions between the two sources: Michael is correct (the document\u2019s \u201CMicah\u201D), Hesra (\u201CEzra\u201D), Harboury (\u201CArbrey\u201D), Lilian (\u201CLilieth/Lilly\u201D), and Montaque — with \u201CMonte\u201D believed to be his nickname.'},
  {open:false, t:'Enid Sadler — resolved', d:'The master database recorded Enid as Michael\u2019s daughter; the oral history said sister. The family confirmed: sister — she is now shown as a child of Daniel and Elizabeth.'},
  {open:false, t:'Jenny Bucknor — resolved', d:'The oral history called her \u201CPalmer\u2019s sister\u201D. The family confirmed she is Palma\u2019s sister, and she is now placed as a child of Glen and Wilfrid Bucknor.'},
  {open:false, t:'Duplicate Clifford Sadler — resolved', d:'Two Clifford Sadler records in the master data were confirmed to be one person: Jonah\u2019s son, married to Hazel, father of Mark and Michelle.'},
  {open:false, t:'Duplicate Kingsley Sadler — resolved', d:'Two Kingsley Sadler records were confirmed to be one person: Jonah\u2019s son, married to Leila. (Harboury\u2019s son Kingsley is a different, real person and remains on the tree.)'},
];
function renderReviews(){
  const openItems=REVIEWS.filter(r=>r.open), closed=REVIEWS.filter(r=>!r.open);
  $('#reviewList').innerHTML=
    `<p class="eyebrow" style="margin-bottom:14px">${openItems.length} open questions</p>`+
    openItems.map(r=>`<div class="review card"><h3>${r.t}</h3><p>${r.d}</p></div>`).join('')+
    `<p class="eyebrow" style="margin:30px 0 14px">${closed.length} resolved by the family</p>`+
    closed.map(r=>`<div class="review card resolved"><h3>${r.t}</h3><p>${r.d}</p></div>`).join('');
}

/* ---------- home stats ---------- */
function renderStats(){
  const n = all.length;
  const flagged = all.filter(p=>p.flags.length).length;
  $('#stats').innerHTML = [
    [n,'People across all records'],
    ['7','Recorded generations in the main trunk'],
    ['1846–2023','Span of recorded events'],
    ['3','Countries — Jamaica, the UK, the USA'],
    ['97','Elizabeth\u2019s years — the longest recorded life'],
  ].map(([a,b])=>`<div class="stat card"><div class="n">${a}</div><div class="l">${b}</div></div>`).join('');
}

/* ---------- page dispatch ---------- */
(function(){
  if($('#stats')) renderStats();
  if($('#peopleGrid')) setupPeople();
  if($('#timeline')) renderTimeline();
  if($('#branchCards')) renderBranches();
  if($('#storyList')) renderStories();
  if($('#reviewList')) renderReviews();
  if($('#treeSVG')){
    buildTree();
    const f=new URLSearchParams(location.search).get('focus');
    if(f && P[f]){ centerOn(f); openPerson(f); }
  }
})();
