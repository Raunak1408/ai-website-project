// script.js — core interactions for WonderSprout
(function(){
  const DS = window.WONDERSPROUT || {};
  const games = DS.games || [];
  const activities = DS.activities || [];
  const kits = DS.kits || [];

  // Utilities
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  function byId(id){ return document.getElementById(id); }

  // Local storage helpers
  const LS_FAV = 'ws_favorites';
  const LS_CART = 'ws_cart';
  function loadFavs(){ try{return JSON.parse(localStorage.getItem(LS_FAV))||[];}catch(e){return[]} }
  function saveFavs(list){ localStorage.setItem(LS_FAV,JSON.stringify(list)); updateCounts(); }
  function loadCart(){ try{return JSON.parse(localStorage.getItem(LS_CART))||[];}catch(e){return[]} }
  function saveCart(list){ localStorage.setItem(LS_CART,JSON.stringify(list)); updateCounts(); }

  function updateCounts(){ const favs = loadFavs(); const cart = loadCart(); Array.from(document.querySelectorAll('#fav-count')).forEach(el=>el.textContent=favs.length); Array.from(document.querySelectorAll('#cart-count')).forEach(el=>el.textContent=cart.reduce((s,i)=>s+i.qty,0)||0); }

  // Render helpers
  function makeGameCard(g){
    const div = document.createElement('div'); div.className='card product-card';
    div.innerHTML = `
      <img src="${g.image}" alt="${g.alt}">
      <h3>${g.name}</h3>
      <div class="meta">Age: ${g.age} · Difficulty: ${g.difficulty} · Rating: ${g.rating}</div>
      <p class="desc">${g.description}</p>
      <div style="margin-top:auto;display:flex;gap:8px;align-items:center">
        <a class="btn" href="game-detail.html?id=${encodeURIComponent(g.id)}">View Details</a>
        <button class="btn add-fav" data-id="${g.id}">♡</button>
      </div>
    `;
    return div;
  }

  function renderFeatured(){ const el = $('#featured-grid'); if(!el) return; el.innerHTML=''; const featured = games.slice(0,6); featured.forEach(g=>el.appendChild(makeGameCard(g))); }

  function renderActivitiesHome(){ const el = $('#activities-grid'); if(!el) return; el.innerHTML=''; activities.slice(0,6).forEach(a=>{ const d = document.createElement('div'); d.className='card'; d.innerHTML=`<img src="${a.image}" alt="${a.alt}"><h3>${a.title}</h3><div class="meta">Age: ${a.age} · ${a.duration} · ${a.difficulty}</div><p>${a.instructions.substring(0,80)}...</p><div style="margin-top:auto"><button class="btn" data-act="${a.id}">Start Activity</button></div>`; el.appendChild(d); }); }

  function initHome(){ renderFeatured(); renderActivitiesHome(); }

  // Games page: search, filters, sort
  function filterAndSort(list,{q,category,age,difficulty,sort}){
    let out = list.filter(g=>{
      if(q){ const s=(g.name+' '+g.description+' '+g.category).toLowerCase(); if(!s.includes(q.toLowerCase())) return false; }
      if(category && category!=='All' && g.category!==category) return false;
      if(age && age!=='All' && g.age!==age) return false;
      if(difficulty && difficulty!=='All' && g.difficulty!==difficulty) return false;
      return true;
    });
    switch(sort){
      case 'name': out.sort((a,b)=>a.name.localeCompare(b.name)); break;
      case 'rating': out.sort((a,b)=>b.rating-a.rating); break;
      case 'difficulty': out.sort((a,b)=>a.difficulty.localeCompare(b.difficulty)); break;
      default: break;
    }
    return out;
  }

  function renderGamesGrid(list){ const root = $('#games-grid'); if(!root) return; root.innerHTML=''; if(!list.length){ $('#no-results').style.display='block'; return;} $('#no-results').style.display='none'; list.forEach(g=>root.appendChild(makeGameCard(g))); }

  function initGames(){ const search = $('#search-box'); const cat = $('#filter-category'); const age = $('#filter-age'); const diff = $('#filter-difficulty'); const sort = $('#sort-select'); function update(){ const q = search?search.value.trim():''; const settings={q,category:cat?cat.value:'All',age:age?age.value:'All',difficulty:diff?diff.value:'All',sort:sort?sort.value:'featured'}; const out = filterAndSort(games,settings); renderGamesGrid(out); }
    ['change','input'].forEach(ev=>{ if(search)search.addEventListener('input',update); if(cat)cat.addEventListener('change',update); if(age)age.addEventListener('change',update); if(diff)diff.addEventListener('change',update); if(sort)sort.addEventListener('change',update); }); update();
  }

  // Detail page
  function getParam(name){ const u=new URL(location.href); return u.searchParams.get(name); }
  function initGameDetail(){ const root = $('#game-detail-root'); if(!root) return; const id = getParam('id'); const g = games.find(x=>x.id===id); if(!g){ root.innerHTML='<div class="empty">Game not found.</div>'; return; }
    root.innerHTML = `<div class="card" style="display:flex;gap:20px;align-items:flex-start"><img src="${g.image}" alt="${g.alt}" style="width:380px;height:auto;border-radius:12px"><div style="flex:1"><h1>${g.name}</h1><div class="meta">Age: ${g.age} · ${g.category} · Difficulty: ${g.difficulty} · Rating: ${g.rating}</div><p>${g.description}</p><h4>Learning objectives</h4><ul>${g.objectives.map(o=>`<li>${o}</li>`).join('')}</ul><h4>Instructions</h4><p>${g.instructions}</p><div style="margin-top:12px"><button id="start-game" class="btn primary">Start Game</button> <button id="add-fav-detail" class="btn">Add to Favorites</button></div></div></div>`;
    $('#start-game').addEventListener('click',()=>{ alert('Start Game — demo: ' + g.name); });
    $('#add-fav-detail').addEventListener('click',()=>{ const favs=loadFavs(); if(!favs.includes(g.id)){ favs.push(g.id); saveFavs(favs); alert('Added to favorites'); } else { alert('Already in favorites'); } });
  }

  // Favorites page
  function initFavorites(){ const root = $('#favorites-grid'); if(!root) return; const favs = loadFavs(); root.innerHTML=''; if(!favs.length){ $('#no-favs').style.display='block'; return;} $('#no-favs').style.display='none'; favs.forEach(id=>{ const g = games.find(x=>x.id===id); if(!g) return; const card = makeGameCard(g); const btn = card.querySelector('.add-fav'); btn.textContent='Remove'; btn.addEventListener('click',()=>{ let list=loadFavs(); list=list.filter(i=>i!==g.id); saveFavs(list); initFavorites(); }); root.appendChild(card); }); }

  // Activities
  function makeActivityCard(a){ const d=document.createElement('div'); d.className='card'; d.innerHTML=`<img src="${a.image}" alt="${a.alt}"><h3>${a.title}</h3><div class="meta">Age: ${a.age} · ${a.duration} · ${a.difficulty}</div><p>${a.instructions.substring(0,80)}...</p><div style="margin-top:auto"><button class="btn start-activity" data-id="${a.id}">Start Activity</button></div>`; return d; }
  function initActivities(){ const root = $('#activities-list'); if(!root) return; root.innerHTML=''; activities.forEach(a=>{ const c = makeActivityCard(a); root.appendChild(c); }); document.body.addEventListener('click',e=>{ const t = e.target.closest('[data-id]'); if(!t) return; if(t.classList.contains('start-activity')){ const id=t.dataset.id; const act = activities.find(x=>x.id===id); if(!act) return; const modal = $('#activity-detail'); modal.innerHTML = `<div class="card"><button id="close-act" class="btn">Close</button><h2>${act.title}</h2><img src="${act.image}" alt="${act.alt}" style="width:100%;height:220px;object-fit:cover;border-radius:10px"><p class="meta">Age: ${act.age} · Duration: ${act.duration} · Difficulty: ${act.difficulty}</p><h4>Materials</h4><ul>${act.materials.map(m=>`<li>${m}</li>`).join('')}</ul><h4>Instructions</h4><p>${act.instructions}</p></div>`; modal.style.display='flex'; $('#close-act').addEventListener('click',()=>modal.style.display='none'); } }); }

  // Cart functions
  function addToCart(kitId, qty=1){ const cart = loadCart(); const item = cart.find(i=>i.id===kitId); if(item) item.qty += qty; else cart.push({id:kitId,qty}); saveCart(cart); }
  function removeFromCart(kitId){ let cart = loadCart(); cart = cart.filter(i=>i.id!==kitId); saveCart(cart); }
  function updateQty(kitId, qty){ const cart = loadCart(); const item = cart.find(i=>i.id===kitId); if(!item) return; item.qty = Math.max(0,qty); if(item.qty===0) removeFromCart(kitId); else saveCart(cart); }

  function renderCart(){ const root = $('#cart-items'); if(!root) return; const cart = loadCart(); if(!cart.length){ $('#cart-empty').style.display='block'; $('#cart-summary').style.display='none'; root.innerHTML=''; return; } $('#cart-empty').style.display='none'; $('#cart-summary').style.display='block'; root.innerHTML=''; let subtotal=0; cart.forEach(ci=>{ const kit = kits.find(k=>k.id===ci.id); if(!kit) return; const row = document.createElement('div'); row.className='card'; row.innerHTML=`<div style="display:flex;gap:12px;align-items:center"><img src="${kit.image}" alt="${kit.name}" style="width:120px;height:80px;object-fit:cover;border-radius:8px"><div style="flex:1"><h3>${kit.name}</h3><div class="meta">${kit.description}</div><div style="margin-top:8px">Quantity: <button class="btn qty-dec" data-id="${kit.id}">-</button> <span class="qty">${ci.qty}</span> <button class="btn qty-inc" data-id="${kit.id}">+</button> <button class="btn remove" data-id="${kit.id}" style="margin-left:8px">Remove</button></div></div><div style="font-weight:700">$${(kit.price*ci.qty).toFixed(2)}</div></div>`; root.appendChild(row); subtotal += kit.price*ci.qty; }); const shipping = subtotal>50?0:5; const total = subtotal + shipping; $('#subtotal').textContent = subtotal.toFixed(2); $('#shipping').textContent = shipping.toFixed(2); $('#total').textContent = total.toFixed(2);
    // attach events
    root.querySelectorAll('.qty-inc').forEach(b=>b.addEventListener('click',e=>{ addToCart(b.dataset.id,1); renderCart(); }));
    root.querySelectorAll('.qty-dec').forEach(b=>b.addEventListener('click',e=>{ const id=b.dataset.id; const cart=loadCart(); const it=cart.find(i=>i.id===id); if(it){ updateQty(id,it.qty-1); renderCart(); }}));
    root.querySelectorAll('.remove').forEach(b=>b.addEventListener('click',e=>{ removeFromCart(b.dataset.id); renderCart(); }));
  }

  function initCartPage(){ const root = $('#cart-items'); if(!root) return; renderCart(); $('#checkout').addEventListener('click',()=>{ $('#checkout-feedback').textContent='Checkout demo — your order is ready.'; localStorage.removeItem(LS_CART); updateCounts(); renderCart(); }); }

  // Newsletter
  function initNewsletter(){ const form = $('#newsletter-form'); if(!form) return; const email = $('#newsletter-email'); const feedback = $('#newsletter-feedback'); form.addEventListener('submit',e=>{ e.preventDefault(); feedback.textContent=''; const v = email.value.trim(); if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){ feedback.textContent='Please enter a valid email address.'; feedback.style.color='crimson'; return; } feedback.textContent='Thanks — you have been subscribed.'; feedback.style.color='green'; email.value=''; }); }

  // Contact form
  function initContact(){ const form = $('#contact-form'); if(!form) return; const fb = $('#contact-feedback'); form.addEventListener('submit',e=>{ e.preventDefault(); fb.textContent=''; const name = $('#c-name').value.trim(); const email = $('#c-email').value.trim(); const subject = $('#c-subject').value.trim(); const msg = $('#c-message').value.trim(); if(!name||!email||!subject||!msg){ fb.textContent='Please fill all fields.'; fb.style.color='crimson'; return; } if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ fb.textContent='Please enter a valid email.'; fb.style.color='crimson'; return; } fb.textContent='Thanks! Your message has been received.'; fb.style.color='green'; form.reset(); }); }

  // Generic bindings for header counts and page-specific inits
  function initHeaderCounts(){ updateCounts(); }

  // Wire up favorite add buttons site-wide
  document.addEventListener('click',e=>{
    const btn = e.target.closest('.add-fav'); if(!btn) return; const id = btn.dataset.id; let favs = loadFavs(); if(favs.includes(id)){ favs = favs.filter(x=>x!==id); btn.textContent='♡'; } else { favs.push(id); btn.textContent='♥'; }
    saveFavs(favs); updateCounts(); e.preventDefault();
  });

  // Add to cart buttons from kits or global
  document.addEventListener('click',e=>{
    const b = e.target.closest('[data-cart-id]'); if(!b) return; addToCart(b.dataset.cartId,1); alert('Added to cart');
  });

  // Initialize based on page
  function init(){ initHeaderCounts(); initNewsletter(); initContact(); const page = document.body.dataset.page || '';
    if(page==='home'){ initHome(); }
    if(page==='games'){ initGames(); }
    if(page==='game-detail'){ initGameDetail(); }
    if(page==='favorites'){ initFavorites(); }
    if(page==='activities'){ initActivities(); }
    if(page==='cart'){ initCartPage(); }
  }

  document.addEventListener('DOMContentLoaded',init);
})();
