// PlayPocket - script.js - core interactions, cart, wishlist, search, filters, product detail
(function(){
  const CART_KEY = 'playpocket_cart_v1';
  const WISH_KEY = 'playpocket_wish_v1';

  // Utility
  const q = sel => document.querySelector(sel);
  const qa = sel => Array.from(document.querySelectorAll(sel));
  const fmt = v => '$' + v.toFixed(2);
  const params = new URLSearchParams(location.search);

  // Storage helpers
  function loadCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCounts(); }
  function loadWish(){ return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); }
  function saveWish(w){ localStorage.setItem(WISH_KEY, JSON.stringify(w)); updateCounts(); }

  function updateCounts(){
    const cart = loadCart(); const wish = loadWish();
    qa('#cart-count').forEach(el=>el.textContent = cart.reduce((s,i)=>s+i.qty,0));
    qa('#wish-count').forEach(el=>el.textContent = wish.length);
  }

  // Render helpers
  function makeCard(p){
    const el = document.createElement('div'); el.className='card product-card';
    el.innerHTML = `
      <img src="${p.image}" alt="${p.alt}">
      <div class="name">${p.name}</div>
      <div class="desc">${p.description.substring(0,80)}...</div>
      <div class="meta"><div class="price">${fmt(p.price)}</div><div class="rating">⭐ ${p.rating}</div></div>
      <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
        <button class="btn add-cart" data-id="${p.id}">Add to Cart</button>
        <button class="btn add-wish" data-id="${p.id}">♡ Wishlist</button>
        <a class="btn" href="product.html?id=${encodeURIComponent(p.id)}">View Details</a>
      </div>
    `;
    return el;
  }

  // Shop page logic
  function initShop(){
    const grid = q('#products-grid');
    const noRes = q('#no-results');
    if(!grid) return;

    const products = window.PLAYPOCKET_PRODUCTS || [];

    function readControls(){
      return {
        q: q('#search-box') && q('#search-box').value.trim().toLowerCase(),
        category: q('#filter-category') && q('#filter-category').value,
        age: q('#filter-age') && q('#filter-age').value,
        price: q('#filter-price') && q('#filter-price').value,
        sort: q('#sort-select') && q('#sort-select').value
      };
    }

    function matches(p, controls){
      if(controls.q){
        const s = (p.name+' '+p.description+' '+p.category).toLowerCase();
        if(!s.includes(controls.q)) return false;
      }
      if(controls.category && controls.category!=='All' && p.category !== controls.category) return false;
      if(controls.age && controls.age!=='All' && p.age !== controls.age) return false;
      if(controls.price && controls.price!=='All'){
        const pr = p.price;
        if(controls.price==='under-20' && !(pr<20)) return false;
        if(controls.price==='20-40' && !(pr>=20 && pr<=40)) return false;
        if(controls.price==='40-70' && !(pr>=40 && pr<=70)) return false;
        if(controls.price==='over-70' && !(pr>70)) return false;
      }
      return true;
    }

    function sortList(list, mode){
      switch(mode){
        case 'price-asc': return list.sort((a,b)=>a.price-b.price);
        case 'price-desc': return list.sort((a,b)=>b.price-a.price);
        case 'rating-desc': return list.sort((a,b)=>b.rating-a.rating);
        case 'name-asc': return list.sort((a,b)=>a.name.localeCompare(b.name));
        default: return list; // featured keeps original order
      }
    }

    function render(){
      const controls = readControls();
      let list = products.filter(p=>matches(p,controls));
      if(!list.length){ grid.innerHTML=''; noRes.style.display='block'; return; }
      noRes.style.display='none';
      list = sortList(list, controls.sort || 'featured');
      grid.innerHTML = '';
      list.forEach(p=> grid.appendChild(makeCard(p)));
    }

    // initial filters from url
    const ageParam = params.get('age'); if(ageParam && q('#filter-age')) q('#filter-age').value = ageParam;
    const catParam = params.get('category'); if(catParam && q('#filter-category')) q('#filter-category').value = catParam;

    // events
    ['#search-box','#filter-category','#filter-age','#filter-price','#sort-select'].forEach(sel=>{
      const e = q(sel); if(e) e.addEventListener('input', render);
    });

    // delegate add to cart / wish
    grid.addEventListener('click', e=>{
      if(e.target.matches('.add-cart')){ const id=e.target.dataset.id; addToCart(id,1); }
      if(e.target.matches('.add-wish')){ const id=e.target.dataset.id; addToWish(id); }
    });

    render();
  }

  // product detail page
  function initProduct(){
    const el = q('#product-detail'); if(!el) return;
    const id = params.get('id');
    const p = (window.PLAYPOCKET_PRODUCTS||[]).find(x=>x.id===id);
    if(!p){ el.innerHTML='<div class="card">Product not found.</div>'; return; }
    el.innerHTML = `
      <div class="product-detail card" style="display:flex;gap:18px;flex-wrap:wrap">
        <div style="flex:1;min-width:280px"><img src="${p.image}" alt="${p.alt}" style="width:100%;height:auto;border-radius:8px"></div>
        <div style="flex:1;min-width:280px">
          <h2>${p.name}</h2>
          <div class="desc">${p.description}</div>
          <div style="margin-top:8px">Category: <strong>${p.category}</strong></div>
          <div>Age: <strong>${p.age}</strong></div>
          <div>Availability: <strong>${p.availability}</strong></div>
          <div>Rating: <strong>⭐ ${p.rating}</strong></div>
          <div>Product ID: <strong>${p.id}</strong></div>
          <div style="margin-top:12px">Learning benefits: <em>${p.benefits}</em></div>

          <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
            <input id="qty" type="number" min="1" value="1" style="width:70px;padding:8px;border-radius:8px;border:1px solid #ddd">
            <button id="add-cart" class="btn btn-primary">Add to Cart</button>
            <button id="add-wish" class="btn">Add to Wishlist</button>
            <button id="buy-now" class="btn">Buy Now</button>
          </div>
        </div>
      </div>
    `;

    q('#add-cart').addEventListener('click', ()=>{ addToCart(p.id, parseInt(q('#qty').value||1)); });
    q('#add-wish').addEventListener('click', ()=>{ addToWish(p.id); });
    q('#buy-now').addEventListener('click', ()=>{ addToCart(p.id, parseInt(q('#qty').value||1)); location.href='cart.html'; });
  }

  // wishlist
  function addToWish(id){ const wish = loadWish(); if(!wish.includes(id)){ wish.push(id); saveWish(wish); flash('Added to wishlist'); } }
  function removeWish(id){ let wish = loadWish(); wish = wish.filter(x=>x!==id); saveWish(wish); }

  function initWishlist(){
    const grid = q('#wishlist-grid'); if(!grid) return;
    const products = window.PLAYPOCKET_PRODUCTS||[];
    function render(){
      const wish = loadWish(); grid.innerHTML='';
      if(!wish.length){ q('#wish-empty').style.display='block'; return; }
      q('#wish-empty').style.display='none';
      wish.forEach(id=>{
        const p = products.find(x=>x.id===id); if(!p) return;
        const el = document.createElement('div'); el.className='card';
        el.innerHTML = `<img src="${p.image}" alt="${p.alt}"><div class="name">${p.name}</div><div class="desc">${p.description.substring(0,80)}</div><div style="display:flex;gap:8px;margin-top:8px"><button class='btn move-to-cart' data-id='${p.id}'>Move to Cart</button><button class='btn remove-wish' data-id='${p.id}'>Remove</button><a class='btn' href='product.html?id=${p.id}'>View</a></div>`;
        grid.appendChild(el);
      });
    }
    grid.addEventListener('click', e=>{
      if(e.target.matches('.remove-wish')){ removeWish(e.target.dataset.id); render(); }
      if(e.target.matches('.move-to-cart')){ addToCart(e.target.dataset.id,1); removeWish(e.target.dataset.id); render(); }
    });
    render();
  }

  // cart
  function addToCart(id, qty=1){
    const prods = window.PLAYPOCKET_PRODUCTS||[]; if(!prods.find(x=>x.id===id)) return;
    const cart = loadCart(); const item = cart.find(i=>i.id===id);
    if(item) item.qty = Math.min(99, item.qty + qty); else cart.push({id, qty});
    saveCart(cart); flash('Added to cart'); renderCartPage();
  }
  function removeFromCart(id){ let cart = loadCart(); cart = cart.filter(i=>i.id!==id); saveCart(cart); renderCartPage(); }
  function setCartQty(id,qty){ let cart = loadCart(); const it = cart.find(i=>i.id===id); if(it){ it.qty = Math.max(1, qty); saveCart(cart); } renderCartPage(); }

  function renderCartPage(){
    const el = q('#cart-items'); if(!el) return;
    const products = window.PLAYPOCKET_PRODUCTS||[]; const cart = loadCart();
    if(!cart.length){ q('#cart-empty').style.display='block'; el.innerHTML=''; updateSummary([]); return; }
    q('#cart-empty').style.display='none';
    el.innerHTML='';
    cart.forEach(ci=>{
      const p = products.find(x=>x.id===ci.id); if(!p) return;
      const row = document.createElement('div'); row.className='card';
      row.innerHTML = `
        <div style="display:flex;gap:12px;align-items:center">
          <img src="${p.image}" alt="${p.alt}" style="width:120px;height:80px;object-fit:cover;border-radius:8px">
          <div style="flex:1">
            <div class="name">${p.name}</div>
            <div class="desc">${p.description.substring(0,80)}</div>
            <div style="margin-top:8px">Price: <strong>${fmt(p.price)}</strong></div>
            <div style="margin-top:8px;display:flex;gap:8px;align-items:center">Qty: <button class="btn qty-minus" data-id="${p.id}">-</button><input class="qty-input" data-id="${p.id}" type="number" value="${ci.qty}" min="1" style="width:56px;padding:6px;border-radius:6px;border:1px solid #ddd"> <button class="btn qty-plus" data-id="${p.id}">+</button> <button class="btn remove-item" data-id="${p.id}">Remove</button></div>
          </div>
          <div style="text-align:right">Subtotal: <strong>${fmt(p.price*ci.qty)}</strong></div>
        </div>
      `;
      el.appendChild(row);
    });

    // attach events
    el.querySelectorAll('.qty-plus').forEach(b=>b.addEventListener('click', ()=>{ const id=b.dataset.id; const cart=loadCart(); const it=cart.find(x=>x.id===id); if(it){ it.qty++; saveCart(cart);} }));
    el.querySelectorAll('.qty-minus').forEach(b=>b.addEventListener('click', ()=>{ const id=b.dataset.id; const cart=loadCart(); const it=cart.find(x=>x.id===id); if(it){ it.qty = Math.max(1,it.qty-1); saveCart(cart);} }));
    el.querySelectorAll('.qty-input').forEach(inp=>inp.addEventListener('change', ()=>{ setCartQty(inp.dataset.id, parseInt(inp.value||1)); }));
    el.querySelectorAll('.remove-item').forEach(b=>b.addEventListener('click', ()=>{ removeFromCart(b.dataset.id); }));

    // update totals
    const productsMap = Object.fromEntries((window.PLAYPOCKET_PRODUCTS||[]).map(p=>[p.id,p]));
    updateSummary(cart.map(it=>({price:productsMap[it.id].price, qty:it.qty})));
  }

  function updateSummary(items){
    const subtotal = items.reduce((s,i)=>s + i.price*i.qty,0);
    const shipping = subtotal>75 || subtotal===0 ? 0 : 7;
    const grand = subtotal + shipping;
    q('#subtotal') && (q('#subtotal').textContent = fmt(subtotal));
    q('#shipping') && (q('#shipping').textContent = fmt(shipping));
    q('#grandtotal') && (q('#grandtotal').textContent = fmt(grand));
  }

  function initCartPage(){
    const checkout = q('#checkout-btn'); if(checkout) checkout.addEventListener('click', ()=>{ alert('Checkout demo — your order is ready.'); });
    renderCartPage();
  }

  // categories
  function initCategories(){
    const grid = q('#categories-grid'); if(!grid) return;
    const cats = window.PLAYPOCKET_CATEGORIES || [];
    grid.innerHTML='';
    cats.forEach(c=>{
      const el = document.createElement('div'); el.className='card';
      el.innerHTML = `<img src="${c.image}" alt="${c.name}"><h4>${c.name}</h4><p class="desc">${c.desc}</p><a class="btn" href="shop.html?category=${encodeURIComponent(c.name)}">Browse</a>`;
      grid.appendChild(el);
    });
  }

  // home page pieces
  function initHome(){
    // featured categories
    const fc = q('#featured-cats-grid'); if(fc){ (window.PLAYPOCKET_CATEGORIES||[]).forEach(c=>{ const el=document.createElement('div'); el.className='card'; el.innerHTML=`<img src="${c.image}" alt="${c.name}"><h4>${c.name}</h4><div class="desc">${c.desc}</div><a class="btn" href="shop.html?category=${encodeURIComponent(c.name)}">Browse</a>`; fc.appendChild(el); }); }
    // best sellers (first 6)
    const bs = q('#best-sellers-grid'); if(bs){ (window.PLAYPOCKET_PRODUCTS||[]).slice(0,6).forEach(p=> bs.appendChild(makeCard(p))); }

    // newsletter
    const form = q('#newsletter-form'); if(form){ form.addEventListener('submit', e=>{ e.preventDefault(); const em = q('#newsletter-email').value.trim(); const fb = q('#newsletter-feedback'); if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){ fb.textContent='Please enter a valid email.'; fb.style.color='crimson'; return; } fb.textContent='Thanks! You are subscribed.'; fb.style.color='green'; form.reset(); } ); }
  }

  // activities
  function initActivities(){
    const grid = q('#activities-grid'); if(!grid) return;
    (window.PLAYPOCKET_ACTIVITIES||[]).forEach(a=>{
      const el = document.createElement('div'); el.className='card';
      el.innerHTML = `<img src="${a.image}" alt="${a.title}"><h4>${a.title}</h4><div class="desc">${a.difficulty} • Ages ${a.age}</div><p>${a.instructions.substring(0,90)}...</p><div style="display:flex;gap:8px;margin-top:8px"><button class="btn view-activity" data-id="${a.id}">View Activity</button></div>`;
      grid.appendChild(el);
    });

    grid.addEventListener('click', e=>{
      if(e.target.matches('.view-activity')){ const id=e.target.dataset.id; showActivity(id); }
    });
  }

  function showActivity(id){ const a = (window.PLAYPOCKET_ACTIVITIES||[]).find(x=>x.id===id); if(!a) return; const detail = q('#activity-detail'); detail.style.display='block'; detail.innerHTML = `<div class="card"><h3>${a.title}</h3><img src="${a.image}" alt="${a.title}" style="width:100%;height:auto;border-radius:8px;margin-top:8px"><p>Age group: <strong>${a.age}</strong></p><p>Difficulty: <strong>${a.difficulty}</strong></p><h4>Materials</h4><ul>${a.materials.map(m=>`<li>${m}</li>`).join('')}</ul><h4>Instructions</h4><p>${a.instructions}</p><button class="btn" id="close-activity">Close</button></div>`; q('#close-activity').addEventListener('click', ()=>{ q('#activity-detail').style.display='none'; }); }

  // utilities
  function flash(msg){ console.log(msg); }

  // contact form
  function initContact(){ const form = q('#contact-form'); if(!form) return; form.addEventListener('submit', e=>{ e.preventDefault(); const name=q('#c-name').value.trim(); const email=q('#c-email').value.trim(); const subject=q('#c-subject').value.trim(); const message=q('#c-message').value.trim(); const fb=q('#contact-feedback'); if(!name||!email||!subject||!message){ fb.textContent='Please complete all fields.'; fb.style.color='crimson'; return; } if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ fb.textContent='Please enter a valid email.'; fb.style.color='crimson'; return; } fb.textContent='Thanks! Your message has been received.'; fb.style.color='green'; form.reset(); }); }

  // init header actions across pages
  function bindHeader(){ qa('#wish-btn').forEach(b=>b.addEventListener('click', ()=> location.href='wishlist.html')); qa('#cart-btn').forEach(b=>b.addEventListener('click', ()=> location.href='cart.html')); }

  // bootstrap
  function init(){ updateCounts(); bindHeader(); initHome(); initShop(); initProduct(); initWishlist(); initCartPage(); initCategories(); initActivities(); initContact(); }
  document.addEventListener('DOMContentLoaded', init);
})();
