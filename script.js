/* script.js — core interactions for WonderBox Kids */
(function(){
  // Utilities
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // LocalStorage keys are defined in data.js (LS_CART, LS_WISHLIST)
  function readJSON(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) || fallback } catch(e){ return fallback } }
  function writeJSON(key, val){ localStorage.setItem(key, JSON.stringify(val)) }

  // Cart & Wishlist helpers
  function cartGet(){ return readJSON(LS_CART, []) }
  function cartSave(c){ writeJSON(LS_CART, c) }
  function wishGet(){ return readJSON(LS_WISHLIST, []) }
  function wishSave(w){ writeJSON(LS_WISHLIST, w) }

  function findProduct(id){ return PRODUCTS.find(p=>p.id===id) }

  // Counts in header
  function updateCounts(){
    const cartCount = cartGet().reduce((s,i)=>s+i.qty,0);
    const wishCount = wishGet().length;
    $$('#cart-count-2, #cart-count-3, #cart-count-4, #cart-count-5, #cart-count-6, #cart-count-7, #cart-count')
      .forEach(el=>{ if(el) el.textContent = cartCount });
    $$('#wish-count, #wish-count-2, #wish-count-3, #wish-count-4, #wish-count-5, #wish-count-6, #wish-count-7')
      .forEach(el=>{ if(el) el.textContent = wishCount });
  }

  // Render product card
  function productCard(p){
    const div = document.createElement('div'); div.className='product-card';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div class="muted">${p.age} • ${p.category}</div>
      <div class="product-info">
        <div><strong>$${p.price.toFixed(2)}</strong></div>
        <div>
          <button class="btn-ghost" data-action="view" data-id="${p.id}">View</button>
          <button class="btn-primary" data-action="add" data-id="${p.id}">Add</button>
        </div>
      </div>
    `;
    return div;
  }

  // Render grid into element
  function renderGrid(container, list){
    container.innerHTML='';
    if(!list.length){ container.innerHTML='<div class="muted">No products found.</div>'; return }
    list.forEach(p=> container.appendChild(productCard(p)) );
  }

  // Basic search (case-insensitive) and filter
  function matchesQuery(p, q){ if(!q) return true; q=q.toLowerCase(); return (p.name+ ' ' + p.desc + ' ' + p.category).toLowerCase().includes(q) }

  // Page initializers
  function initHome(){
    // Featured: top 4 by rating
    const grid = $('#featured-grid');
    if(!grid) return;
    const featured = PRODUCTS.slice().sort((a,b)=>b.rating-a.rating).slice(0,4);
    renderGrid(grid, featured);

    // search box
    const sb = $('#search-box'); if(sb) sb.addEventListener('keydown', e=>{ if(e.key==='Enter'){ location.href='products.html?q='+encodeURIComponent(sb.value) } })

    // newsletter
    const form = $('#newsletter-form'); if(form){ form.addEventListener('submit', e=>{ e.preventDefault(); const v = $('#newsletter-email').value.trim(); if(!v) return; alert('Thanks! Subscribed: '+v); form.reset() }) }
  }

  function initProducts(){
    const grid = $('#products-grid');
    const catSel = $('#filter-category');
    const ageSel = $('#filter-age');
    const priceSel = $('#filter-price');
    const sortSel = $('#sort-select');
    const searchInline = $('#search-inline');
    const resultCount = $('#result-count');

    // populate categories
    const cats = Array.from(new Set(PRODUCTS.map(p=>p.category)));
    cats.forEach(c=>{ const o = document.createElement('option'); o.value=c; o.textContent=c; catSel.appendChild(o) });

    function getFilters(){
      return { category: catSel.value, age: ageSel.value, price: priceSel.value, sort: sortSel.value, q: (searchInline.value || new URLSearchParams(location.search).get('q')||'') }
    }

    function apply(){
      const f = getFilters();
      let out = PRODUCTS.slice();
      if(f.category && f.category!=='All') out = out.filter(p=>p.category===f.category);
      if(f.age && f.age!=='All') out = out.filter(p=>p.age===f.age);
      if(f.price && f.price!=='All'){ const [min,max] = f.price.split('-').map(Number); out = out.filter(p=>p.price>=min && p.price<=(max||9999)) }
      if(f.q) out = out.filter(p=>matchesQuery(p,f.q));
      if(f.sort==='price-asc') out.sort((a,b)=>a.price-b.price);
      if(f.sort==='price-desc') out.sort((a,b)=>b.price-a.price);
      renderGrid(grid,out);
      resultCount.textContent = out.length;
    }

    // wire events
    [catSel, ageSel, priceSel, sortSel, searchInline].forEach(el=>{ if(el) el.addEventListener('change', apply); if(el) el.addEventListener('input', apply) });
    const clear = $('#clear-filters'); if(clear) clear.addEventListener('click', ()=>{ catSel.value='All'; ageSel.value='All'; priceSel.value='All'; sortSel.value='relevance'; searchInline.value=''; apply() });

    // initial search param
    const q = new URLSearchParams(location.search).get('q'); if(q) searchInline.value = q;
    apply();

    // delegate buttons
    grid.addEventListener('click', e=>{
      const btn = e.target.closest('button'); if(!btn) return; const id = btn.dataset.id; if(btn.dataset.action==='view'){ location.href='product.html?id='+encodeURIComponent(id) }
      if(btn.dataset.action==='add'){ addToCart(id); }
    });
  }

  function initProductDetail(){
    const container = $('#product-detail'); if(!container) return;
    const id = new URLSearchParams(location.search).get('id'); const p = findProduct(id);
    if(!p){ container.innerHTML = '<div class="muted">Product not found.</div>'; return }
    container.innerHTML = `
      <div>
        <img src="${p.img}" alt="${p.name}">
      </div>
      <div>
        <h1>${p.name}</h1>
        <div class="muted">${p.age} • ${p.category}</div>
        <p class="muted">Rating: ${p.rating}</p>
        <p>${p.desc}</p>
        <h3>$${p.price.toFixed(2)}</h3>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button id="add-to-cart" class="btn-primary">Add to cart</button>
          <button id="add-to-wish" class="btn-ghost">Add to wishlist</button>
        </div>
      </div>
    `;

    $('#add-to-cart').addEventListener('click', ()=>{ addToCart(p.id); alert('Added to cart') });
    $('#add-to-wish').addEventListener('click', ()=>{ addToWishlist(p.id); alert('Added to wishlist') });
  }

  // Cart operations
  function addToCart(id, qty=1){
    const cart = cartGet();
    const item = cart.find(i=>i.id===id);
    if(item) item.qty += qty; else cart.push({ id, qty });
    cartSave(cart); updateCounts();
  }
  function removeFromCart(id){ let cart = cartGet(); cart = cart.filter(i=>i.id!==id); cartSave(cart); updateCounts(); renderCart(); }
  function setCartQty(id, qty){ let cart = cartGet(); const it = cart.find(i=>i.id===id); if(it){ it.qty = Math.max(0,qty); if(it.qty===0) cart = cart.filter(i=>i.id!==id); cartSave(cart); updateCounts(); renderCart(); } }

  // Wishlist
  function addToWishlist(id){ const w = wishGet(); if(!w.includes(id)){ w.push(id); wishSave(w); updateCounts(); } }
  function removeFromWishlist(id){ let w=wishGet(); w=w.filter(x=>x!==id); wishSave(w); updateCounts(); renderWishlist(); }

  // Render cart page
  function renderCart(){ const el = $('#cart-items'); const sumEl = $('#cart-summary'); if(!el) return; const cart = cartGet(); el.innerHTML=''; if(!cart.length){ el.innerHTML='<div class="muted">Your cart is empty.</div>'; sumEl.innerHTML=''; return }
    let total = 0; cart.forEach(it=>{ const p = findProduct(it.id); if(!p) return; const row = document.createElement('div'); row.className='product-card'; row.innerHTML = `\
      <div style="display:flex;gap:12px;align-items:center">\
        <img src="${p.img}" style="width:120px;height:80px;object-fit:cover;border-radius:8px">\
        <div style="flex:1">\
          <h4>${p.name}</h4>\
          <div class=\"muted\">$${p.price.toFixed(2)} each</div>\
          <div style=\"margin-top:8px\">Qty: <input type=\"number\" value=\"${it.qty}\" min=1 data-id=\"${it.id}\" style=\"width:70px;padding:6px;border-radius:8px;border:1px solid #eee\"> <button class=\"btn-ghost\" data-action=\"remove\" data-id=\"${it.id}\">Remove</button></div>\
        </div>\
      </div>\
    `; el.appendChild(row); total += p.price * it.qty; });
    sumEl.innerHTML = `<div class="cart-summary">\
      <h3>Order summary</h3>\
      <div>Total: <strong>$${total.toFixed(2)}</strong></div>\
      <div style=\"margin-top:12px\">\
        <button id=\"checkout-btn\" class=\"btn-primary\">Checkout</button>\
        <button id=\"clear-cart\" class=\"btn-ghost\">Clear cart</button>\
      </div>\
    </div>`;

    // events
    el.querySelectorAll('input[type=number]').forEach(inp=> inp.addEventListener('change', e=> setCartQty(inp.dataset.id, parseInt(inp.value||1))));
    el.querySelectorAll('button[data-action="remove"]').forEach(b=> b.addEventListener('click', e=> removeFromCart(b.dataset.id)));
    $('#clear-cart').addEventListener('click', ()=>{ cartSave([]); updateCounts(); renderCart() });
    $('#checkout-btn').addEventListener('click', ()=>{ alert('Checkout simulated — thank you!'); cartSave([]); updateCounts(); renderCart(); });
  }

  // Render wishlist page
  function renderWishlist(){ const el = $('#wishlist-items'); if(!el) return; const w = wishGet(); el.innerHTML=''; if(!w.length){ el.innerHTML='<div class="muted">Your wishlist is empty.</div>'; return }
    w.forEach(id=>{ const p = findProduct(id); if(!p) return; const card = document.createElement('div'); card.className='product-card'; card.innerHTML = `\
      <img src="${p.img}" alt="${p.name}">\
      <h4>${p.name}</h4>\
      <div class=\"muted\">$${p.price.toFixed(2)}</div>\
      <div style=\"margin-top:auto;display:flex;gap:8px\">\
        <button class=\"btn-primary\" data-action=\"add\" data-id=\"${p.id}\">Add to cart</button>\
        <button class=\"btn-ghost\" data-action=\"remove\" data-id=\"${p.id}\">Remove</button>\
      </div>\
    `; el.appendChild(card); });
    el.addEventListener('click', e=>{ const b = e.target.closest('button'); if(!b) return; const id = b.dataset.id; if(b.dataset.action==='add'){ addToCart(id); removeFromWishlist(id); alert('Moved to cart') } if(b.dataset.action==='remove'){ removeFromWishlist(id) } });
  }

  // Generic delegated view/add handlers on lists
  document.addEventListener('click', e=>{
    const btn = e.target.closest('button'); if(!btn) return; const id = btn.dataset.id; if(!id) return;
    if(btn.dataset.action==='view') location.href = 'product.html?id='+encodeURIComponent(id);
    if(btn.dataset.action==='add') { addToCart(id); alert('Added to cart') }
  });

  // Contact form
  function initContact(){ const form = $('#contact-form'); if(!form) return; form.addEventListener('submit', e=>{ e.preventDefault(); const name = $('#c-name').value.trim(); const email = $('#c-email').value.trim(); const msg = $('#c-message').value.trim(); if(!name||!email||!msg){ $('#contact-feedback').textContent='Please complete all fields'; return } $('#contact-feedback').textContent='Thanks — message received!'; form.reset(); }) }

  // Simple shop/category page (categories.html) — redirect to products with category query
  function initCategories(){ const el = document.getElementById('categories-list'); if(!el) return; const cats = Array.from(new Set(PRODUCTS.map(p=>p.category))); el.innerHTML = cats.map(c=>`<a href="products.html?category=${encodeURIComponent(c)}" class="btn-ghost">${c}</a>`).join(' ');
  }

  // Product list/event bootstrapping based on page
  function boot(){ updateCounts(); const page = document.body.dataset.page; if(page==='home') initHome(); if(page==='products') initProducts(); if(page==='product') initProductDetail(); if(page==='cart') renderCart(); if(page==='wishlist') renderWishlist(); if(page==='contact') initContact(); initCategories();

    // wire search across header inputs
    const sb = document.getElementById('search-box') || document.getElementById('search-box-page'); if(sb){ sb.addEventListener('keydown', e=>{ if(e.key==='Enter'){ location.href='products.html?q='+encodeURIComponent(sb.value) } }) }
  }

  // Run when DOM ready
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
