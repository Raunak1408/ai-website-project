// Core functionality for WonderBox Kids site (products, cart, wishlist, contact)
(function(){
  const $ = s=> document.querySelector(s);
  const qsa = s=> Array.from(document.querySelectorAll(s));

  // Storage helpers
  const read = (k, def)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):def }catch(e){return def} };
  const write = (k,v)=> localStorage.setItem(k,JSON.stringify(v));

  // Defaults
  const CART_KEY = 'wb_cart_v1';
  const WISH_KEY = 'wb_wish_v1';
  const CONTACTS_KEY = 'wb_contacts_v1';

  const products = (window.WonderBox && window.WonderBox.products) || [];

  /* ====== NAV COUNTS ====== */
  function updateCounts(){
    const cart = read(CART_KEY,[]);
    const wish = read(WISH_KEY,[]);
    qsa('#cart-count').forEach(el=>el.textContent = cart.reduce((s,i)=>s+i.qty,0));
    qsa('#wish-count').forEach(el=>el.textContent = wish.length);
  }

  /* ====== RENDER HELPERS ====== */
  function makeCard(p){
    const el = document.createElement('div'); el.className='product-card';
    el.innerHTML = `
      <img src="${p.image}" alt="${p.alt}">
      <h4><a href="product.html?id=${encodeURIComponent(p.id)}">${p.name}</a></h4>
      <div class="meta">${p.category} • ${p.age}</div>
      <div class="price">$${p.price.toFixed(2)} <span class="muted">★ ${p.rating}</span></div>
      <div style="margin-top:8px;display:flex;gap:8px;">
        <button class="btn add-cart" data-id="${p.id}">Add to cart</button>
        <button class="btn" data-id="${p.id}" data-action="wish">♡</button>
      </div>
    `;
    return el;
  }

  /* ====== INDEX: Featured ====== */
  function renderFeatured(){
    const el = $('#featured-grid'); if(!el) return;
    const featured = products.slice(0,4);
    el.innerHTML = '';
    featured.forEach(p=> el.appendChild(makeCard(p)));
  }

  /* ====== PRODUCTS PAGE ====== */
  function initProductsPage(){
    const grid = $('#products-grid'); if(!grid) return;
    const catSel = $('#filter-category');
    const ageSel = $('#filter-age');
    const priceSel = $('#filter-price');
    const sortSel = $('#sort-select');
    const searchInput = $('#search-input');
    const resultsCount = $('#results-count');

    // populate filters
    const cats = Array.from(new Set(products.map(p=>p.category))).sort();
    cats.forEach(c=>{ const o=document.createElement('option'); o.value=c; o.textContent=c; catSel.appendChild(o); });
    const ages = Array.from(new Set(products.map(p=>p.age))).sort();
    ages.forEach(a=>{ const o=document.createElement('option'); o.value=a; o.textContent=a; ageSel.appendChild(o); });

    function applyFilters(){
      const q = (searchInput && searchInput.value||'').trim().toLowerCase();
      const cat = catSel?catSel.value:'All';
      const age = ageSel?ageSel.value:'All';
      const price = priceSel?priceSel.value:'All';
      const sort = sortSel?sortSel.value:'relevance';

      let list = products.slice();
      if(q) list = list.filter(p=> (p.name+p.description).toLowerCase().includes(q));
      if(cat && cat!=='All') list = list.filter(p=>p.category===cat);
      if(age && age!=='All') list = list.filter(p=>p.age===age);
      if(price && price!=='All'){
        const [lo,hi]=price.split('-').map(Number);
        list = list.filter(p=>p.price>=lo && p.price<=hi);
      }
      if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
      if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);
      if(sort==='rating-desc') list.sort((a,b)=>b.rating-b.rating?b.rating-a.rating:0);

      grid.innerHTML='';
      if(!list.length){ grid.innerHTML = '<p>No toys match your search.</p>'; resultsCount.textContent='0 results'; return; }
      list.forEach(p=> grid.appendChild(makeCard(p)));
      resultsCount.textContent = `${list.length} result${list.length>1?'s':''}`;
      attachProductButtons();
    }

    [catSel,ageSel,priceSel,sortSel,searchInput].forEach(el=>{ if(!el) return; el.addEventListener('change',applyFilters); el.addEventListener && el.addEventListener('input',applyFilters); });
    applyFilters();
  }

  /* ====== PRODUCT DETAIL PAGE ====== */
  function initProductDetail(){
    const container = $('#product-detail'); if(!container) return;
    const params = new URLSearchParams(location.search); const id = params.get('id');
    if(!id){ container.innerHTML = '<p>Product not found</p>'; return; }
    const p = products.find(x=>x.id===id);
    if(!p){ container.innerHTML = '<p>Product not found</p>'; return; }
    container.innerHTML = `
      <div class="product-detail">
        <div style="display:flex;gap:18px;flex-wrap:wrap;">
          <img src="${p.image}" alt="${p.alt}" style="width:320px;max-width:100%;height:auto;border-radius:10px;object-fit:cover;">
          <div style="flex:1;min-width:260px;">
            <h1 id="product-title">${p.name}</h1>
            <div class="meta">${p.category} • ${p.age} • ★ ${p.rating}</div>
            <p id="product-price" style="font-weight:700;font-size:20px;margin-top:12px;">$${p.price.toFixed(2)}</p>
            <p id="product-description">${p.description}</p>
            <div style="margin-top:12px;display:flex;gap:8px;align-items:center;">
              <button class="btn primary" id="add-to-cart" data-id="${p.id}">Add to cart</button>
              <button class="btn" id="add-to-wish" data-id="${p.id}">Add to wishlist</button>
            </div>
          </div>
        </div>
      </div>
    `;
    // attach listeners
    $('#add-to-cart') && $('#add-to-cart').addEventListener('click', e=>{ addToCart(p.id); alert('Added to cart'); updateCounts(); });
    $('#add-to-wish') && $('#add-to-wish').addEventListener('click', e=>{ toggleWish(p.id); alert('Updated wishlist'); updateCounts(); });
  }

  /* ====== CART ====== */
  function getCart(){ return read(CART_KEY,[]); }
  function saveCart(c){ write(CART_KEY,c); updateCounts(); }
  function addToCart(id,qty=1){ const cart = getCart(); const prod = products.find(p=>p.id===id); if(!prod) return; const item = cart.find(i=>i.id===id); if(item) item.qty += qty; else cart.push({id:prod.id,qty:qty,price:prod.price,name:prod.name,image:prod.image}); saveCart(cart); }
  function removeFromCart(id){ let cart = getCart(); cart = cart.filter(i=>i.id!==id); saveCart(cart); renderCartPage(); }
  function updateQty(id,qty){ const cart = getCart(); const it=cart.find(i=>i.id===id); if(!it) return; it.qty = Math.max(0,qty); if(it.qty===0) removeFromCart(id); else saveCart(cart); }

  function renderCartPage(){ const el = $('#cart-items'); if(!el) return; const cart = getCart(); el.innerHTML=''; if(!cart.length){ el.innerHTML='<p>Your cart is empty.</p>'; $('#cart-total') && ($('#cart-total').textContent='0.00'); return; }
    let total=0; cart.forEach(item=>{
      const p = products.find(x=>x.id===item.id) || {};
      const div = document.createElement('div'); div.className='cart-item';
      div.innerHTML = `
        <img src="${p.image||item.image}" alt="${item.name}"/>
        <div style="flex:1">
          <div style="font-weight:700">${item.name}</div>
          <div class="muted">$${item.price.toFixed(2)} each</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <input type="number" min="0" value="${item.qty}" data-id="${item.id}" class="qty-input" style="width:60px;padding:6px;border-radius:6px;border:1px solid #ddd">
          <button class="btn remove" data-id="${item.id}">Remove</button>
        </div>
      `;
      el.appendChild(div);
      total += item.price * item.qty;
    });
    $('#cart-total') && ($('#cart-total').textContent = total.toFixed(2));

    qsa('.qty-input').forEach(inp=> inp.addEventListener('change', e=>{ const id=inp.dataset.id; const v=parseInt(inp.value||0,10); updateQty(id,v); renderCartPage(); }));
    qsa('.remove').forEach(b=> b.addEventListener('click', e=>{ removeFromCart(b.dataset.id); }));
  }

  /* ====== WISHLIST ====== */
  function getWish(){ return read(WISH_KEY,[]); }
  function saveWish(w){ write(WISH_KEY,w); updateCounts(); }
  function toggleWish(id){ const w = getWish(); const idx = w.indexOf(id); if(idx>=0) w.splice(idx,1); else w.push(id); saveWish(w); }
  function renderWishPage(){ const el = $('#wishlist-items'); if(!el) return; const w = getWish(); el.innerHTML=''; if(!w.length){ el.innerHTML='<p>Your wishlist is empty.</p>'; return; } w.forEach(id=>{ const p = products.find(x=>x.id===id); if(!p) return; const card = makeCard(p); el.appendChild(card); }); attachProductButtons(); }

  /* ====== ATTACH BUTTONS ON LISTS ====== */
  function attachProductButtons(){ qsa('.add-cart').forEach(b=>{ if(b._bound) return; b._bound=true; b.addEventListener('click',e=>{ addToCart(b.dataset.id,1); updateCounts(); alert('Added to cart'); }); });
    qsa('[data-action="wish"]').forEach(b=>{ if(b._bound) return; b._bound=true; b.addEventListener('click',e=>{ toggleWish(b.dataset.id); updateCounts(); alert('Wishlist updated'); }); });
  }

  /* ====== CONTACT FORM ====== */
  function initContact(){ const form = $('#contact-form'); if(!form) return; form.addEventListener('submit', e=>{ e.preventDefault(); const name = $('#c-name').value.trim(); const email = $('#c-email').value.trim(); const msg = $('#c-message').value.trim(); if(!name||!email||!msg){ $('#contact-feedback').textContent='Please complete all fields.'; return; } const contacts = read(CONTACTS_KEY,[]); contacts.push({name,email,msg,date:new Date().toISOString()}); write(CONTACTS_KEY,contacts); form.reset(); $('#contact-feedback').textContent='Thanks! Your message has been received.'; }); }

  /* ====== GENERAL INIT ====== */
  function init(){ updateCounts(); renderFeatured(); initProductsPage(); initProductDetail(); renderCartPage(); renderWishPage(); initContact();
    // attach checkout demo
    const checkout = $('#checkout-btn'); if(checkout) checkout.addEventListener('click',()=>{ alert('Checkout is a demo — cart will be cleared'); write(CART_KEY,[]); renderCartPage(); updateCounts(); });

    // attach add-to-cart buttons that may exist on pages rendered server-side
    attachProductButtons();
  }

  // run on DOM ready
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
