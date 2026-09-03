// Main script for WonderBox Kids
(function(){
  const PRODUCTS = window.WB_PRODUCTS || [];
  const KEYS = window.WB_KEYS || { CART: 'wb_cart', WISHLIST: 'wb_wishlist' };
  const qs = s => document.querySelector(s);
  const qsa = s => Array.from(document.querySelectorAll(s));

  function save(key,val){localStorage.setItem(key,JSON.stringify(val));}
  function load(key){try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return []}}

  function updateCounters(){
    const cart = load(KEYS.CART); const wish = load(KEYS.WISHLIST);
    qsa('#cart-count').forEach(el=>el.textContent = cart.length);
    qsa('#wish-count').forEach(el=>el.textContent = wish.length);
  }

  function formatPrice(n){return '$'+n.toFixed(2)}

  function renderCard(p,opts={}){
    const div = document.createElement('div'); div.className='card';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div class="meta">${p.category} · ${p.age} · ${p.rating}⭐</div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:8px">
        <div style="font-weight:700">${formatPrice(p.price)}</div>
        <div class="actions" style="margin-left:auto">
          <button class="btn" data-action="view" data-id="${p.id}">View</button>
          <button class="icon-btn" data-action="wish" data-id="${p.id}">♡</button>
          <button class="icon-btn" data-action="add" data-id="${p.id}">+</button>
        </div>
      </div>
    `;
    // events
    div.addEventListener('click',e=>{
      const btn = e.target.closest('button'); if(!btn) return;
      const id=btn.dataset.id; const act=btn.dataset.action;
      if(act==='view') location.href = 'product.html?id='+encodeURIComponent(id);
      if(act==='add') addToCart(id);
      if(act==='wish') toggleWishlist(id);
    });
    return div;
  }

  function listUnique(arr,key){return Array.from(new Set(arr.map(x=>x[key])))}

  function renderGrid(container,items){
    container.innerHTML=''; items.forEach(p=>container.appendChild(renderCard(p)));
  }

  function addToCart(id,qty=1){
    const cart = load(KEYS.CART);
    const found = cart.find(i=>i.id===id);
    if(found) found.qty+=qty; else cart.push({id,qty});
    save(KEYS.CART,cart); updateCounters();
    alert('Added to cart');
  }

  function toggleWishlist(id){
    const list = load(KEYS.WISHLIST); const i = list.indexOf(id);
    if(i===-1){ list.push(id); alert('Added to wishlist'); } else { list.splice(i,1); alert('Removed from wishlist'); }
    save(KEYS.WISHLIST,list); updateCounters();
  }

  function renderFeatured(){
    const el = qs('#featured'); if(!el) return;
    const featured = PRODUCTS.slice(0,6);
    renderGrid(el,featured);
  }

  function renderCategories(){
    const cats = listUnique(PRODUCTS,'category');
    const el = qs('#categories-grid'); if(el){ el.innerHTML=''; cats.forEach(c=>{
      const d = document.createElement('div'); d.className='card'; d.innerHTML=`<h4>${c}</h4><p class="meta">Browse ${PRODUCTS.filter(p=>p.category===c).length} toys</p><div style="margin-top:8px"><a class="btn" href="products.html">Explore</a></div>`; el.appendChild(d);
    })}
    const cl = qs('#categories-list'); if(cl){ cl.innerHTML=''; cats.forEach(c=>{ const d=document.createElement('div'); d.className='card'; d.innerHTML=`<h4>${c}</h4><p class="meta">${PRODUCTS.filter(p=>p.category===c).length} items</p><div style="margin-top:8px"><a class="btn" href="products.html">View</a></div>`; cl.appendChild(d) }) }
  }

  function pageProducts(){
    const grid = qs('#products-grid'); if(!grid) return;
    const categorySel = qs('#filter-category'); const ageSel = qs('#filter-age'); const search = qs('#search-input'); const sortSel = qs('#sort-select');
    // populate filter options
    const cats = listUnique(PRODUCTS,'category'); categorySel.innerHTML = '<option>All</option>'+cats.map(c=>`<option>${c}</option>`).join('');
    const ages = listUnique(PRODUCTS,'age'); ageSel.innerHTML = '<option>All</option>'+ages.map(a=>`<option>${a}</option>`).join('');

    function apply(){
      let items = PRODUCTS.slice();
      const q = (search && search.value||'').trim().toLowerCase(); if(q){ items = items.filter(p=> (p.name+p.description).toLowerCase().includes(q)); }
      const cat = categorySel.value; if(cat && cat!=='All') items = items.filter(p=>p.category===cat);
      const age = ageSel.value; if(age && age!=='All') items = items.filter(p=>p.age===age);
      const sort = sortSel.value; if(sort==='price-asc') items.sort((a,b)=>a.price-b.price); if(sort==='price-desc') items.sort((a,b)=>b.price-a.price);
      renderGrid(grid,items);
    }

    ['change','input'].forEach(ev=>{ categorySel.addEventListener(ev,apply); ageSel.addEventListener(ev,apply); sortSel.addEventListener(ev,apply); if(search) search.addEventListener('input',apply); });
    qs('#clear-filters')?.addEventListener('click',()=>{ search.value=''; categorySel.value='All'; ageSel.value='All'; sortSel.value='relevance'; apply(); });
    apply();
  }

  function pageProductDetail(){
    const cont = qs('#product-detail'); if(!cont) return;
    const params = new URLSearchParams(location.search); const id = params.get('id'); const p = PRODUCTS.find(x=>x.id===id);
    if(!p){ cont.innerHTML = '<p>Product not found.</p>'; return; }
    cont.innerHTML = `
      <div class="card"><img src="${p.image}" alt="${p.name}"></div>
      <div>
        <h2>${p.name}</h2>
        <div class="meta">${p.category} · ${p.age} · ${p.rating}⭐</div>
        <p style="margin-top:12px">${p.description}</p>
        <div style="margin-top:12px;font-weight:800">${formatPrice(p.price)}</div>
        <div style="margin-top:12px;display:flex;gap:8px"><button id="add-to-cart" class="btn">Add to cart</button><button id="add-to-wish" class="icon-btn">♡ Wishlist</button></div>
      </div>
    `;
    qs('#add-to-cart').addEventListener('click',()=>{ addToCart(p.id); });
    qs('#add-to-wish').addEventListener('click',()=>{ toggleWishlist(p.id); });
  }

  function pageCart(){
    const wrap = qs('#cart-items'); const sum = qs('#cart-summary'); if(!wrap||!sum) return;
    const cart = load(KEYS.CART);
    if(cart.length===0){ wrap.innerHTML='<p>Your cart is empty.</p>'; sum.innerHTML=''; return; }
    wrap.innerHTML=''; let total=0;
    cart.forEach(item=>{
      const p = PRODUCTS.find(x=>x.id===item.id); if(!p) return;
      const row = document.createElement('div'); row.className='card'; row.style.display='flex'; row.style.alignItems='center'; row.style.gap='12px';
      row.innerHTML = `<img src="${p.image}" alt="${p.name}" style="width:110px;height:80px;object-fit:cover;border-radius:8px"><div style="flex:1"><strong>${p.name}</strong><div class="meta">${p.category}</div></div><div style="min-width:140px;display:flex;gap:6px;align-items:center"><button data-id="${p.id}" class="icon-btn dec">-</button><div>${item.qty}</div><button data-id="${p.id}" class="icon-btn inc">+</button><div style="font-weight:700;margin-left:8px">${formatPrice(p.price*item.qty)}</div><button data-id="${p.id}" class="icon-btn remove">Remove</button></div>`;
      wrap.appendChild(row); total += p.price*item.qty;
    });
    sum.innerHTML = `<div style="font-weight:800">Subtotal: ${formatPrice(total)}</div>`;
    // attach events
    qsa('.inc').forEach(b=>b.addEventListener('click',()=>{ changeQty(b.dataset.id,1); }));
    qsa('.dec').forEach(b=>b.addEventListener('click',()=>{ changeQty(b.dataset.id,-1); }));
    qsa('.remove').forEach(b=>b.addEventListener('click',()=>{ removeItem(b.dataset.id); }));
  }

  function changeQty(id,delta){ const cart = load(KEYS.CART); const it = cart.find(i=>i.id===id); if(!it) return; it.qty += delta; if(it.qty<1) { if(confirm('Remove from cart?')){ const idx = cart.indexOf(it); cart.splice(idx,1); } else { it.qty=1; } } save(KEYS.CART,cart); updateCounters(); pageCart(); }
  function removeItem(id){ let cart = load(KEYS.CART); cart = cart.filter(i=>i.id!==id); save(KEYS.CART,cart); updateCounters(); pageCart(); }

  function pageWishlist(){ const wrap = qs('#wishlist-items'); if(!wrap) return; const wish = load(KEYS.WISHLIST); if(wish.length===0){ wrap.innerHTML='<p>Your wishlist is empty.</p>'; return; } wrap.innerHTML=''; wish.forEach(id=>{ const p = PRODUCTS.find(x=>x.id===id); if(!p) return; const d=document.createElement('div'); d.className='card'; d.innerHTML=`<div style="display:flex;gap:12px;align-items:center"><img src="${p.image}" alt="${p.name}" style="width:110px;height:80px;object-fit:cover;border-radius:8px"><div style="flex:1"><strong>${p.name}</strong><div class="meta">${p.category}</div></div><div style="display:flex;flex-direction:column;gap:6px"><button class="btn" data-id="${p.id}" data-act="move">Add to cart</button><button class="icon-btn" data-id="${p.id}" data-act="remove">Remove</button></div></div>`; wrap.appendChild(d); });
    wrap.addEventListener('click',e=>{ const btn = e.target.closest('button'); if(!btn) return; const id = btn.dataset.id; const act = btn.dataset.act; if(act==='move'){ addToCart(id); // remove from wish
      let w = load(KEYS.WISHLIST); w = w.filter(x=>x!==id); save(KEYS.WISHLIST,w); updateCounters(); pageWishlist(); }
      if(act==='remove'){ let w = load(KEYS.WISHLIST); w = w.filter(x=>x!==id); save(KEYS.WISHLIST,w); updateCounters(); pageWishlist(); } });
  }

  function pageContact(){ const form = qs('#contact-form'); if(!form) return; form.addEventListener('submit',e=>{ e.preventDefault(); alert('Thanks — we received your message.'); form.reset(); }); }

  function subscribeForm(){ const f = qs('#subscribe-form'); if(!f) return; f.addEventListener('submit',e=>{ e.preventDefault(); const em = qs('#subscribe-email').value; if(!em){ alert('Enter email'); return; } alert('Subscribed — check your email for a coupon'); f.reset(); }); }

  // init per page
  function init(){ updateCounters(); renderFeatured(); renderCategories(); subscribeForm(); const page = document.body.dataset.page;
    qs('#year')&& (qs('#year').textContent = new Date().getFullYear());
    if(page==='products') pageProducts();
    if(page==='product') pageProductDetail();
    if(page==='cart') pageCart();
    if(page==='wishlist') pageWishlist();
    if(page==='contact') pageContact();
  }

  // expose to window for simple console testing
  window.WB = { init, PRODUCTS };
  document.addEventListener('DOMContentLoaded',init);
})();