// TinyTrove - main script (script.js)
(function(){
  // Utilities
  const q = sel => document.querySelector(sel);
  const qa = sel => Array.from(document.querySelectorAll(sel));
  const formatPrice = v => '$' + v.toFixed(2);

  // localStorage keys
  const CART_KEY = 'tinytrove_cart_v1';
  const WISH_KEY = 'tinytrove_wish_v1';

  function loadData(){ return window.TINY_PRODUCTS || []; }

  // Cart & Wishlist helpers
  function readCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  function writeCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCounts(); }
  function readWish(){ return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); }
  function writeWish(w){ localStorage.setItem(WISH_KEY, JSON.stringify(w)); updateCounts(); }

  function updateCounts(){
    const cart = readCart();
    const wish = readWish();
    const cartCount = cart.reduce((s,i)=>s+i.qty,0);
    q('#cart-count') && (q('#cart-count').textContent = cartCount);
    q('#wish-count') && (q('#wish-count').textContent = wish.length);
  }

  // Add to cart
  function addToCart(id, qty=1){
    const products = loadData();
    const p = products.find(x=>x.id===id);
    if(!p) return;
    const cart = readCart();
    const item = cart.find(i=>i.id===id);
    if(item) item.qty = Math.min(99, item.qty + qty);
    else cart.push({id:p.id, qty:qty});
    writeCart(cart);
    flashMessage('Added to cart');
  }

  function removeFromCart(id){
    let cart = readCart();
    cart = cart.filter(i=>i.id!==id);
    writeCart(cart);
  }

  function setCartQty(id, qty){
    const cart = readCart();
    const it = cart.find(i=>i.id===id);
    if(!it) return; it.qty = Math.max(1, qty); writeCart(cart);
  }

  // Wishlist
  function addToWish(id){
    const wish = readWish();
    if(!wish.includes(id)) wish.push(id);
    writeWish(wish);
    flashMessage('Added to wishlist');
  }
  function removeFromWish(id){
    let wish = readWish(); wish = wish.filter(x=>x!==id); writeWish(wish);
  }
  function moveWishToCart(id){ removeFromWish(id); addToCart(id,1); }

  // Messaging
  function flashMessage(msg, duration=1800){
    const el = document.createElement('div'); el.className='toast'; el.textContent=msg; document.body.appendChild(el);
    setTimeout(()=>{ el.style.opacity=0; setTimeout(()=>el.remove(),300) }, duration);
  }

  // Rendering product card
  function productCard(p){
    const el = document.createElement('div'); el.className='product-card card';
    el.innerHTML = `
      <img src="${p.image}" alt="${p.alt}">
      <div class="name">${p.name}</div>
      <div class="meta">${p.description.substring(0,80)}...</div>
      <div class="price">${formatPrice(p.price)}</div>
      <div class="actions">
        <button class="btn add-cart" data-id="${p.id}">Add to Cart</button>
        <button class="btn add-wish" data-id="${p.id}">❤</button>
        <a class="btn" href="product.html?id=${encodeURIComponent(p.id)}">View Details</a>
      </div>
    `;
    return el;
  }

  // Shop page logic
  function initShop(){
    const products = loadData();
    const grid = q('#products-grid');
    const noResults = q('#no-results');

    const searchBox = q('#search-box');
    const catSel = q('#filter-category');
    const ageSel = q('#filter-age');
    const priceSel = q('#filter-price');
    const sortSel = q('#sort-select');

    function getQueryParam(name){
      const url = new URL(location.href);
      return url.searchParams.get(name);
    }

    // Apply initial filters from URL
    const qcat = getQueryParam('category') || getQueryParam('cat');
    const qage = getQueryParam('age') || getQueryParam('age');
    const qsearch = getQueryParam('q') || getQueryParam('search');
    if(qcat) catSel.value = decodeURIComponent(qcat);
    if(qage) ageSel.value = decodeURIComponent(qage);
    if(qsearch) searchBox.value = decodeURIComponent(qsearch);

    function matchesFilter(p){
      const s = (searchBox.value||'').toLowerCase().trim();
      if(s){ const hay = (p.name+' '+p.category+' '+p.description).toLowerCase(); if(!hay.includes(s)) return false }
      if(catSel.value && catSel.value!=='All' && p.category!==catSel.value) return false;
      if(ageSel.value && ageSel.value!=='All' && p.age!==ageSel.value) return false;
      const price = p.price;
      const pr = priceSel.value;
      if(pr==='under-20' && !(price<20)) return false;
      if(pr==='20-40' && !(price>=20 && price<=40)) return false;
      if(pr==='40-70' && !(price>40 && price<=70)) return false;
      if(pr==='70+' && !(price>70)) return false;
      return true;
    }

    function sortList(list){
      const s = sortSel.value;
      if(s==='price-asc') list.sort((a,b)=>a.price-b.price);
      else if(s==='price-desc') list.sort((a,b)=>b.price-a.price);
      else if(s==='rating-desc') list.sort((a,b)=>b.rating-b.rating? b.rating-a.rating:0);
      else if(s==='name-asc') list.sort((a,b)=>a.name.localeCompare(b.name));
      else { /* featured: keep original */ }
    }

    function render(){
      let list = products.filter(matchesFilter);
      if(list.length===0){ grid.innerHTML=''; noResults.style.display='block'; return; } else noResults.style.display='none';
      sortList(list);
      grid.innerHTML=''; list.forEach(p=> grid.appendChild(productCard(p)));
    }

    ['change','input'].forEach(e => [searchBox, catSel, ageSel, priceSel, sortSel].forEach(el=> el && el.addEventListener(e, render)));

    // Delegation
    grid.addEventListener('click', function(ev){
      const a = ev.target.closest('.add-cart'); if(a){ addToCart(a.dataset.id); return }
      const w = ev.target.closest('.add-wish'); if(w){ addToWish(w.dataset.id); return }
    });

    render();
  }

  // Product detail page
  function initProduct(){
    const products = loadData();
    const detail = q('#product-detail');
    const url = new URL(location.href);
    const id = url.searchParams.get('id');
    const p = products.find(x=>x.id===id);
    if(!p){ detail.innerHTML = '<div class="no-results">Product not found.</div>'; return; }
    detail.innerHTML = `
      <div class="pd-left"><img src="${p.image}" alt="${p.alt}"></div>
      <div class="pd-right product-meta">
        <h2 id="pd-title">${p.name}</h2>
        <div class="meta">Category: <span id="pd-category">${p.category}</span> • Age: <span id="pd-age">${p.age}</span></div>
        <div class="price" id="pd-price">${formatPrice(p.price)}</div>
        <p id="pd-desc">${p.description}</p>
        <div id="pd-id" style="margin:8px 0;color:var(--muted);font-size:13px">Product ID: ${p.id}</div>
        <div class="qnty">
          <button class="qbtn" id="qty-dec">-</button>
          <input id="pd-q" type="number" value="1" min="1" style="width:60px;padding:8px;border-radius:8px;border:1px solid #eee">
          <button class="qbtn" id="qty-inc">+</button>
        </div>
        <div class="actions" style="margin-top:12px">
          <button id="pd-add" class="btn">Add to Cart</button>
          <button id="pd-wish" class="btn">Add to Wishlist</button>
          <button id="pd-buy" class="btn btn-primary">Buy Now</button>
        </div>
      </div>
    `;

    q('#qty-inc').addEventListener('click', ()=> { q('#pd-q').value = parseInt(q('#pd-q').value||1)+1 });
    q('#qty-dec').addEventListener('click', ()=> { q('#pd-q').value = Math.max(1, parseInt(q('#pd-q').value||1)-1) });
    q('#pd-add').addEventListener('click', ()=>{ addToCart(p.id, parseInt(q('#pd-q').value||1)); });
    q('#pd-wish').addEventListener('click', ()=>{ addToWish(p.id); });
    q('#pd-buy').addEventListener('click', ()=>{ addToCart(p.id, parseInt(q('#pd-q').value||1)); location.href='cart.html'; });
  }

  // Wishlist page
  function initWishlist(){
    const products = loadData();
    const grid = q('#wishlist-grid');
    const empty = q('#wishlist-empty');
    function render(){
      const wish = readWish();
      if(wish.length===0){ grid.innerHTML=''; empty.style.display='block'; return } else empty.style.display='none';
      grid.innerHTML='';
      wish.forEach(id=>{
        const p = products.find(x=>x.id===id); if(!p) return;
        const el = document.createElement('div'); el.className='card';
        el.innerHTML = `
          <div style="display:flex;gap:12px;align-items:center">
            <img src="${p.image}" alt="${p.alt}" style="width:110px;height:80px;object-fit:cover;border-radius:8px">
            <div>
              <div style="font-weight:700">${p.name}</div>
              <div style="color:var(--muted)">${p.category} • ${p.age}</div>
              <div style="margin-top:8px">
                <button class="btn move-to-cart" data-id="${p.id}">Move to Cart</button>
                <button class="btn remove-wish" data-id="${p.id}">Remove</button>
                <a class="btn" href="product.html?id=${p.id}">View</a>
              </div>
            </div>
          </div>
        `;
        grid.appendChild(el);
      });
    }
    grid.addEventListener('click', function(e){ const mv = e.target.closest('.move-to-cart'); if(mv){ moveWishToCart(mv.dataset.id); render(); return } const rm = e.target.closest('.remove-wish'); if(rm){ removeFromWish(rm.dataset.id); render(); return } });
    render();
  }

  // Cart page
  function initCart(){
    const products = loadData();
    const itemsEl = q('#cart-items');
    const empty = q('#cart-empty');
    const subtotalEl = q('#subtotal');
    const shippingEl = q('#shipping');
    const totalEl = q('#total');

    function calc(){
      const cart = readCart();
      const rows = cart.map(i=>{
        const p = products.find(x=>x.id===i.id); return {p, qty:i.qty};
      });
      const subtotal = rows.reduce((s,r)=>s + (r.p?r.p.price* r.qty:0),0);
      const shipping = subtotal>60 || subtotal===0 ? 0 : 6;
      const total = subtotal + shipping;
      subtotalEl.textContent = formatPrice(subtotal);
      shippingEl.textContent = formatPrice(shipping);
      totalEl.textContent = formatPrice(total);
      return rows;
    }

    function render(){
      const rows = calc();
      if(rows.length===0){ itemsEl.innerHTML=''; empty.style.display='block'; return } else empty.style.display='none';
      itemsEl.innerHTML='';
      rows.forEach(r=>{
        const p = r.p; const qty = r.qty;
        const el = document.createElement('div'); el.className='cart-item';
        el.innerHTML = `
          <img src="${p.image}" alt="${p.alt}">
          <div style="flex:1">
            <div style="font-weight:700">${p.name}</div>
            <div style="color:var(--muted)">${p.category} • ${p.age}</div>
            <div style="margin-top:8px">${formatPrice(p.price)} x <input class="cart-qty" data-id="${p.id}" value="${qty}" style="width:56px;padding:6px;border-radius:8px;border:1px solid #eee"> = <strong>${formatPrice(p.price*qty)}</strong></div>
            <div style="margin-top:8px">
              <button class="btn remove-cart" data-id="${p.id}">Remove</button>
            </div>
          </div>
        `;
        itemsEl.appendChild(el);
      });
    }

    itemsEl.addEventListener('change', function(e){ const inp = e.target.closest('.cart-qty'); if(inp){ const id=inp.dataset.id; setCartQty(id, parseInt(inp.value||1)); render(); } });
    itemsEl.addEventListener('click', function(e){ const rm = e.target.closest('.remove-cart'); if(rm){ removeFromCart(rm.dataset.id); render(); } });

    q('#checkout-btn').addEventListener('click', function(){ // demo checkout
      q('#checkout-feedback').textContent = 'Checkout demo — your order is ready.'; localStorage.removeItem(CART_KEY); updateCounts(); render(); });

    render();
  }

  // Categories page
  function initCategories(){
    const cats = [
      {name:'Learning & STEM', desc:'Science and discovery kits', img:'https://images.unsplash.com/photo-1520975666930-0c21bcb09e34?q=80&w=1200'},
      {name:'Building & Blocks', desc:'Blocks and building sets', img:'https://images.unsplash.com/photo-1590092901603-1b3f4efb8b36?q=80&w=1200'},
      {name:'Pretend Play', desc:'Role play and imaginative toys', img:'https://images.unsplash.com/photo-1541534401786-2f9e2f7b6c8f?q=80&w=1200'},
      {name:'Arts & Creativity', desc:'Kits for painting and crafting', img:'https://images.unsplash.com/photo-1526318472351-c75fcf070dd7?q=80&w=1200'},
      {name:'Outdoor Fun', desc:'Active outdoor toys', img:'https://images.unsplash.com/photo-1501700493788-fa1a160b63f5?q=80&w=1200'},
      {name:'Puzzles & Games', desc:'Puzzles and family games', img:'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200'}
    ];
    const grid = q('#categories-grid');
    grid.innerHTML='';
    cats.forEach(c=>{
      const el = document.createElement('a'); el.className='card'; el.href = 'shop.html?category='+encodeURIComponent(c.name);
      el.innerHTML = `<img src="${c.img}" alt="${c.name}" style="width:100%;height:160px;object-fit:cover;border-radius:8px"><h4>${c.name}</h4><p style="color:var(--muted)">${c.desc}</p><div class="btn">Browse</div>`;
      grid.appendChild(el);
    });
  }

  // Home page small initializers
  function initHome(){
    // featured categories
    const cats = ['Learning & STEM','Building & Blocks','Pretend Play','Arts & Creativity','Outdoor Fun','Puzzles & Games'];
    const fc = q('#featured-cats');
    fc.innerHTML='';
    cats.forEach(c=>{ const a=document.createElement('a'); a.href='shop.html?category='+encodeURIComponent(c); a.className='card'; a.innerHTML=`<h4>${c}</h4>`; fc.appendChild(a)});

    // best sellers: first 6 products
    const products = loadData();
    const bs = q('#best-sellers-grid'); bs.innerHTML=''; products.slice(0,6).forEach(p=> bs.appendChild(productCard(p)));

    // newsletter
    const nf = q('#newsletter-form');
    nf.addEventListener('submit', function(e){ e.preventDefault(); const em = q('#newsletter-email').value.trim(); const fb = q('#newsletter-feedback'); if(!em || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){ fb.textContent='Please enter a valid email.'; fb.style.color='crimson'; return } fb.textContent='Thanks — you are subscribed!'; fb.style.color='green'; nf.reset(); });
  }

  // Contact form
  function initContact(){
    const f = q('#contact-form');
    const fb = q('#contact-feedback');
    f && f.addEventListener('submit', function(e){ e.preventDefault(); const name=q('#c-name').value.trim(); const email=q('#c-email').value.trim(); const subj=q('#c-subject').value.trim(); const msg=q('#c-message').value.trim(); if(!name||!email||!subj||!msg){ fb.textContent='Please fill all fields.'; fb.style.color='crimson'; return } if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ fb.textContent='Please enter a valid email.'; fb.style.color='crimson'; return } fb.textContent='Thanks! Your message has been received.'; fb.style.color='green'; f.reset(); });
  }

  // Page router
  function init(){
    updateCounts();
    // header actions
    q('#cart-btn') && q('#cart-btn').addEventListener('click', ()=> location.href='cart.html');
    q('#wishlist-btn') && q('#wishlist-btn').addEventListener('click', ()=> location.href='wishlist.html');

    const page = document.body.dataset.page;
    if(page==='shop') initShop();
    if(page==='product') initProduct();
    if(page==='categories') initCategories();
    if(page==='wishlist') initWishlist();
    if(page==='cart') initCart();
    if(page==='home') initHome();
    if(page==='about') {/* nothing extra */}
    if(page==='contact') initContact();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
