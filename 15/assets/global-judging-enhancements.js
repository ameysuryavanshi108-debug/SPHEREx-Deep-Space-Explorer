const ROOT=document.getElementById("root");
let catalog=null,manifest=null,observer=null,busy=false,loading=false;
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num=v=>v===null||v===undefined||String(v).trim()===""?null:Number(v);
const fmt=n=>n!==null&&n!==undefined&&n!==""&&Number.isFinite(Number(n))?Number(n).toFixed(3):"—";
const fmtMag=n=>n!==null&&n!==undefined&&n!==""&&Number.isFinite(Number(n))?Number(n).toFixed(3):"—";
const route=()=>location.pathname.replace(/\/+$/,"")||"/";
const chosen=()=>new URLSearchParams(location.search).get("catalogSource");
const archiveUrl="https://irsa.ipac.caltech.edu/data/SPHEREx/SPLICES/index.html";
const tapProxy="/archive/irsa/TAP/sync";
const adql="SELECT TOP 50 source_id, designation, ra, dec, J, H, K, W1, W1err, W2, W2err, W3, W3err, W4, W4err, SEL_TYPE, CLASS_1, STYPE_ML, NAME FROM splices WHERE ra IS NOT NULL AND dec IS NOT NULL AND W1 IS NOT NULL AND W2 IS NOT NULL ORDER BY source_id";

function parseCsvLine(line){
  const out=[];let value="",quoted=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'&&quoted&&line[i+1]==='"'){value+='"';i++}
    else if(ch==='"')quoted=!quoted;
    else if(ch===","&&!quoted){out.push(value);value=""}
    else value+=ch;
  }
  out.push(value);return out;
}
function parseSplicesCsv(raw){
  const lines=raw.replace(/^\uFEFF/,"").split(/\r?\n/).filter(line=>line.trim()&&!line.trimStart().startsWith("#"));
  if(lines.length<2)throw Error("IRSA returned no SPLICES rows.");
  const headers=parseCsvLine(lines[0]).map(v=>v.trim().toLowerCase());
  const col=name=>headers.indexOf(name.toLowerCase());
  const value=(row,name)=>{const i=col(name);return i<0?"":row[i]};
  const records=[];
  for(const line of lines.slice(1)){
    const row=parseCsvLine(line);
    const sourceId=String(value(row,"source_id")).trim();
    const ra=num(value(row,"ra")),dec=num(value(row,"dec"));
    if(!sourceId||!Number.isFinite(ra)||!Number.isFinite(dec))continue;
    const designation=String(value(row,"designation")||("SPLICES-"+sourceId)).trim();
    const class1=String(value(row,"class_1")||"").trim();
    const mlClass=String(value(row,"stype_ml")||"").trim();
    const selection=String(value(row,"sel_type")||"").trim();
    records.push({
      id:sourceId,source_id:sourceId,designation,proper_name:String(value(row,"name")||"").trim(),
      ra_deg:ra,dec_deg:dec,
      j_mag:num(value(row,"j")),h_mag:num(value(row,"h")),k_mag:num(value(row,"k")),
      w1_mag:num(value(row,"w1")),w1_err:num(value(row,"w1err")),
      w2_mag:num(value(row,"w2")),w2_err:num(value(row,"w2err")),
      w3_mag:num(value(row,"w3")),w3_err:num(value(row,"w3err")),
      w4_mag:num(value(row,"w4")),w4_err:num(value(row,"w4err")),
      selection_type:selection,source_class:class1,machine_class:mlClass,
      category:class1||mlClass||selection||"SPLICES target",
      origin:"NASA/IPAC IRSA SPLICES Target Catalog"
    });
  }
  if(records.length!==50)throw Error("Expected 50 SPLICES targets, received "+records.length+".");
  return records;
}
async function loadSplices(){
  const params=new URLSearchParams({REQUEST:"doQuery",LANG:"ADQL",FORMAT:"csv",QUERY:adql});
  const response=await fetch(tapProxy+"?"+params.toString(),{headers:{Accept:"text/csv"},cache:"no-store"});
  if(!response.ok)throw Error("IRSA TAP request failed (HTTP "+response.status+").");
  const raw=await response.text();
  if(/(^|\n)\s*(ERROR|QUERY_STATUS\s*=\s*ERROR)/i.test(raw))throw Error("IRSA TAP returned a query error: "+raw.slice(0,300));
  return {sources:parseSplicesCsv(raw),sourceCatalog:"SPLICES",sourceArchive:"NASA/IPAC IRSA",sourceUrl:archiveUrl,query:adql};
}
function selectedSource(){
  const key=chosen();
  return key?catalog?.sources.find(x=>x.id===key||x.designation===key):null;
}
function stats(){
  const classes=new Set(catalog.sources.map(x=>x.category).filter(Boolean));
  return {objects:catalog.sources.length,pairs:manifest?.pairs?.length??0,categories:classes.size,bands:7};
}
function statGrid(){
  const s=stats();
  return '<div class="gj-stats"><div class="gj-stat"><span>Target objects</span><strong>'+s.objects+'</strong><small>Live SPLICES catalog sample</small></div><div class="gj-stat"><span>Epoch pairs</span><strong>'+s.pairs+'</strong><small>Prepared SPHEREx comparison fields</small></div><div class="gj-stat"><span>Target categories</span><strong>'+s.categories+'</strong><small>Catalog classification / selection labels</small></div><div class="gj-stat"><span>Ancillary bands</span><strong>'+s.bands+'</strong><small>2MASS J/H/K · WISE W1–W4</small></div></div>';
}
function disclosure(){
  return '<p class="gj-disclaimer">Provenance: NASA/IPAC IRSA <a href="'+archiveUrl+'" target="_blank" rel="noopener">SPLICES Target Catalog</a> (SPHEREx List of Ice Sources; DOI <a href="https://doi.org/10.26131/IRSA554" target="_blank" rel="noopener">10.26131/IRSA554</a>). SPLICES is a target list of infrared-bright sources selected using broadband catalog data; its 2MASS/WISE magnitudes are not SPHEREx spectral measurements. These entries are not all confirmed SPHEREx detections, and no Planet X detection or source-to-image match is claimed.</p>';
}
function detail(x){
  if(!x)return '<p class="gj-empty">Select a SPLICES target to inspect its coordinates and catalog measurements.</p>';
  const field=(label,value)=>'<div><dt>'+label+'</dt><dd>'+value+'</dd></div>';
  const mag=(label,value,error)=>field(label,fmtMag(value)+(Number.isFinite(error)?" ± "+fmtMag(error):""));
  const classification=x.source_class||x.machine_class||"Not classified in displayed field";
  return '<div class="gj-selected"><span class="gj-origin">'+esc(x.origin)+'</span><h3>'+esc(x.designation)+'</h3><dl>'+
    field("SPLICES source ID",esc(x.source_id))+
    (x.proper_name?field("Proper name",esc(x.proper_name)):"")+
    field("Right ascension (J2000)",fmt(x.ra_deg)+"°")+
    field("Declination (J2000)",fmt(x.dec_deg)+"°")+
    mag("WISE W1 magnitude",x.w1_mag,x.w1_err)+
    mag("WISE W2 magnitude",x.w2_mag,x.w2_err)+
    mag("WISE W3 magnitude",x.w3_mag,x.w3_err)+
    mag("WISE W4 magnitude",x.w4_mag,x.w4_err)+
    mag("2MASS J magnitude",x.j_mag,null)+
    mag("2MASS H magnitude",x.h_mag,null)+
    mag("2MASS Ks magnitude",x.k_mag,null)+
    field("Selection type",esc(x.selection_type||"Not reported"))+
    field("Catalog class",esc(classification))+
    '</dl><div class="gj-actions"><a class="gj-button" href="/sky-map?catalogSource='+encodeURIComponent(x.id)+'">View target positions ↗</a><a class="gj-button gj-button-secondary" href="/blink?source=real&catalogSource='+encodeURIComponent(x.id)+'">Open comparator ↗</a><a class="gj-button gj-button-secondary" href="'+archiveUrl+'" target="_blank" rel="noopener">Open IRSA catalog ↗</a></div></div>';
}
function plot(rows,selected){
  const ras=rows.map(x=>x.ra_deg),decs=rows.map(x=>x.dec_deg),r0=Math.min(...ras),r1=Math.max(...ras),d0=Math.min(...decs),d1=Math.max(...decs),rp=Math.max((r1-r0)*.08,.002),dp=Math.max((d1-d0)*.08,.002);
  return '<div class="gj-plot-wrap"><div class="gj-plot" role="group" aria-label="SPLICES target positions in right ascension and declination">'+rows.map(x=>'<button class="gj-dot '+(x.id===selected?'is-selected':'')+'" style="left:'+((x.ra_deg-r0+rp)/(r1-r0+2*rp)*100)+'%;top:'+((d1+dp-x.dec_deg)/(d1-d0+2*dp)*100)+'%" data-source-id="'+esc(x.id)+'" title="'+esc(x.designation)+' · RA '+fmt(x.ra_deg)+'°, Dec '+fmt(x.dec_deg)+'°" aria-label="Select '+esc(x.designation)+'"></button>').join('')+'<span class="gj-axis gj-axis-top">North · higher Dec</span><span class="gj-axis gj-axis-bottom">South · lower Dec</span><span class="gj-axis gj-axis-left">RA '+fmt(r0)+'°</span><span class="gj-axis gj-axis-right">RA '+fmt(r1)+'°</span></div><p class="gj-plot-caption">Coordinate view of 50 SPLICES target-list entries returned live by NASA/IPAC IRSA. This is not a physical distance map or a claim that every target has a corresponding SPHEREx image in this application.</p></div>';
}
function loadingPanel(){
  const page=$(".page-container");
  if(route()==="/candidates"&&page&&!$(".gj-loading",page)){
    const panel=document.createElement("section");panel.className="gj-panel gj-loading";panel.textContent="Connecting to the NASA/IPAC IRSA SPLICES catalog…";page.append(panel);
  }
}
function errorPanel(error){
  const page=$(".page-container");
  if(page){
    $(".gj-loading",page)?.remove();
    const panel=document.createElement("section");panel.className="gj-panel gj-load-error";
    panel.innerHTML='<span class="gj-eyebrow">ARCHIVE CONNECTION</span><h2>Could not load the SPLICES catalog</h2><p>'+esc(error.message||String(error))+'</p><p>The archive may be temporarily unavailable. The application will not substitute made-up or unrelated catalog entries.</p><div class="gj-actions"><button class="gj-button" id="gj-retry">Retry archive query</button><a class="gj-button gj-button-secondary" href="'+archiveUrl+'" target="_blank" rel="noopener">Open NASA/IPAC IRSA ↗</a></div>';
    page.append(panel);$("#gj-retry",panel)?.addEventListener("click",start);
  }
}
function home(){
  const el=$(".home-page");if(!el||$(".gj-home",el)||!catalog)return;
  const sec=document.createElement("section");sec.className="gj-home page-container";
  sec.innerHTML='<div class="gj-heading"><span class="gj-eyebrow">INTERSTELLAR CONSORTIUM · OBSERVATORY</span><h2>Explore the Observatory</h2><p>Navigate prepared SPHEREx observation fields and separately identified SPLICES target-list sources.</p></div><div class="gj-cards"><a class="gj-feature" href="/sky-map"><img class="gj-art" src="/assets/hero-indigo-veil.png" alt=""><span class="gj-icon">✧</span><span class="gj-card-kicker">CELESTIAL DIRECTIONS</span><h3>Explore the Sky</h3><p>Open the interactive 3D celestial map and inspect prepared SPHEREx observation fields.</p><span class="gj-representative">Representative imagery · illustrative sky visualization</span><b>Open sky map ↗</b></a><a class="gj-feature" href="/candidates"><img class="gj-art" src="/assets/nebula.png" alt=""><span class="gj-icon">⌕</span><span class="gj-card-kicker">SPHEREx TARGET LIST</span><h3>Discover Candidates</h3><p>Browse 50 targets sampled live from NASA/IPAC IRSA’s SPLICES catalog and inspect their catalog metadata.</p><span class="gj-representative">Representative imagery · SPLICES target positions</span><b>Open target explorer ↗</b></a></div><div class="gj-heading gj-telemetry-heading"><span class="gj-eyebrow">CATALOG TELEMETRY</span><h2>Observatory at a glance</h2></div>'+statGrid()+disclosure();
  el.append(sec);
}
function explorer(){
  if(route()!=="/candidates"||!catalog||$(".gj-explorer"))return;
  const page=$(".page-container");if(!page)return;
  $(".gj-loading",page)?.remove();
  const h=$(".page-heading",page);
  if(h){const t=$("h1",h),p=$("p",h);if(t)t.textContent="SPLICES Target Explorer";if(p)p.textContent="50 target-list records · live from NASA/IPAC IRSA · transparent provenance";}
  $(".observation-status",page)?.remove();
  const first=catalog.sources[0],selected=selectedSource()||first,section=document.createElement("section");section.className="gj-explorer";
  section.innerHTML='<div class="gj-explorer-grid"><div class="gj-panel"><div class="gj-panel-heading"><div><span class="gj-eyebrow">NASA/IPAC IRSA · SPLICES</span><h2>Target-list positions</h2></div><span class="gj-count">50 TARGETS</span></div>'+plot(catalog.sources,selected.id)+disclosure()+'</div><div class="gj-panel gj-detail-panel" id="gj-detail">'+detail(selected)+'</div></div><div class="gj-panel gj-table-panel"><div class="gj-panel-heading"><div><span class="gj-eyebrow">LIVE CATALOG SAMPLE</span><h2>SPLICES target list</h2></div><label class="gj-search"><span class="sr-only">Search catalog</span><input id="gj-search" type="search" placeholder="Search designation, ID or class…"></label></div><div class="gj-table-scroll"><table class="gj-table"><thead><tr><th>Designation</th><th>Source ID</th><th>RA (J2000)</th><th>Dec (J2000)</th><th>WISE W1</th><th>WISE W2</th><th>Selection / class</th></tr></thead><tbody id="gj-rows"></tbody></table></div><p class="gj-table-note">WISE magnitudes are ancillary catalog photometry, not SPHEREx measurements. A SPLICES target-list entry is not proof of a SPHEREx detection or an association with the displayed image fields.</p></div>';
  page.append(section);
  function rows(q){
    const list=catalog.sources.filter(x=>(x.designation+" "+x.source_id+" "+x.selection_type+" "+x.source_class+" "+x.machine_class).toLowerCase().includes(q.toLowerCase()));
    $("#gj-rows",section).innerHTML=list.map(x=>'<tr class="'+(x.id===selected.id?"is-active":"")+'"><td><button class="gj-row-select" data-source-id="'+esc(x.id)+'">'+esc(x.designation)+'</button></td><td>'+esc(x.source_id)+'</td><td>'+fmt(x.ra_deg)+'</td><td>'+fmt(x.dec_deg)+'</td><td>'+fmtMag(x.w1_mag)+'</td><td>'+fmtMag(x.w2_mag)+'</td><td><span class="gj-origin gj-origin-small">'+esc(x.category)+'</span></td></tr>').join("")||'<tr><td colspan="7">No matching SPLICES targets.</td></tr>';
  }
  rows("");
  $("#gj-search",section).addEventListener("input",e=>rows(e.target.value));
  section.addEventListener("click",e=>{
    const b=e.target.closest("[data-source-id]");if(!b)return;
    const x=catalog.sources.find(r=>r.id===b.dataset.sourceId);if(!x)return;
    $("#gj-detail",section).innerHTML=detail(x);
    section.querySelectorAll("[data-source-id]").forEach(n=>n.classList.toggle("is-selected",n.dataset.sourceId===x.id));
    section.querySelectorAll("tbody tr").forEach(n=>n.classList.toggle("is-active",n.querySelector("[data-source-id]")?.dataset.sourceId===x.id));
  });
}
function mapLayer(){
  const page=$(".observation-map");if(!page||!catalog||$(".gj-map-catalog",page))return;
  const x=selectedSource(),panel=document.createElement("section");panel.className="gj-panel gj-map-catalog";
  panel.innerHTML='<div class="gj-panel-heading"><div><span class="gj-eyebrow">SEPARATE TARGET REFERENCE LAYER</span><h2>SPLICES target positions</h2><p>50 NASA/IPAC IRSA SPLICES target-list positions, shown separately from the prepared SPHEREx image fields.</p></div><a class="gj-button" href="/candidates">Open target explorer ↗</a></div>'+plot(catalog.sources,x?.id)+'<div id="gj-map-detail">'+detail(x)+'</div>'+disclosure();
  const workspace=$(".om-workspace",page);(workspace||page).after(panel);
  panel.addEventListener("click",e=>{
    const b=e.target.closest("[data-source-id]");if(!b)return;
    const row=catalog.sources.find(r=>r.id===b.dataset.sourceId);if(!row)return;
    $("#gj-map-detail",panel).innerHTML=detail(row);
    panel.querySelectorAll("[data-source-id]").forEach(n=>n.classList.toggle("is-selected",n.dataset.sourceId===row.id));
  });
}
function comparator(){
  const page=$(".comparison-page"),x=selectedSource();
  if(!page||!catalog||!x||$(".gj-comparator-context",page))return;
  const panel=document.createElement("section");panel.className="gj-panel gj-comparator-context";
  panel.innerHTML='<span class="gj-eyebrow">SELECTED SPLICES TARGET CONTEXT · NOT AN IMAGE MATCH</span><h2>SPLICES target: '+esc(x.designation)+'</h2>'+detail(x)+'<p class="gj-disclaimer">This SPLICES target is not asserted to be the object visible in either SPHEREx image. The comparator displays the selected prepared SPHEREx observation field independently. A positional cross-match and source identification have not been established.</p><a href="/candidates">Browse all 50 SPLICES targets ↗</a>';
  page.append(panel);
}
function run(){if(!catalog)return;home();explorer();mapLayer();comparator()}
function schedule(){if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;run()})}
async function start(){
  if(loading)return;loading=true;
  try{
    loadingPanel();
    const loaded=await loadSplices();catalog=loaded;
    const m=await fetch("/observations/manifest.json");manifest=m.ok?await m.json():null;
    $(".gj-load-error")?.remove();run();
    if(ROOT){if(!observer){observer=new MutationObserver(schedule);observer.observe(ROOT,{childList:true,subtree:true})}}
    window.removeEventListener("popstate",schedule);window.addEventListener("popstate",schedule);
    window.removeEventListener("pageshow",schedule);window.addEventListener("pageshow",schedule);
  }catch(e){console.error("SPLICES catalog enhancement:",e);errorPanel(e)}
  finally{loading=false}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();