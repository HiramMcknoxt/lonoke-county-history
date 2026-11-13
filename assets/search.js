
(function () {
  const $ = (id) => document.getElementById(id);
  const status = $('status'), results = $('results');
  let data = null;
  function esc(s){return s.replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function hl(s, terms){ let o = esc(s); for (const t of terms){ try{ o = o.replace(new RegExp('('+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark>$1</mark>'); }catch(e){} } return o; }
  async function init(){ data = await fetch('data/search-index.json').then(r=>r.json()); status.textContent = data.length + ' entries ready.'; const q = new URLSearchParams(location.search).get('q'); if (q){ $('q').value = q; run(); } }
  function run(){ const raw = $('q').value.trim().toLowerCase(); results.innerHTML=''; if(!raw){ status.textContent='Type a search term to begin.'; return; } const terms = raw.split(/\s+/).filter(Boolean);
    const hits = data.filter(d => { const hay = (d.title+' '+d.text+' '+d.place+' '+d.type).toLowerCase(); return terms.every(t=>hay.includes(t)); });
    status.textContent = hits.length + (hits.length===1?' result':' results') + ' for "' + $('q').value.trim() + '"';
    results.innerHTML = hits.slice(0,120).map(d=>'<div class="result"><h3><a href="'+esc(d.url)+'">'+hl(d.title,terms)+'</a></h3><p class="meta"><span class="tag">'+esc(d.type)+'</span>'+esc(d.place)+'</p><p>'+hl(d.text.slice(0,240),terms)+'…</p></div>').join(''); }
  $('searchform').addEventListener('submit', function(e){ e.preventDefault(); run(); });
  init();
})();
