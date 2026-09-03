// TinyTrove main script
// Depends on data.js (window.PRODUCTS)

const STORAGE_CART = 'tiny_cart_v1';
const STORAGE_WISH = 'tiny_wish_v1';

const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));
const fmt = n => `$${n.toFixed(2)}`;

function getCart(){ try{ return JSON.parse(localStorage.getItem(STORAGE_CART))||[] }catch(e){return[]} }
function saveCart(c){ localStorage.setItem(STORAGE_CART, JSON.stringify(c)); updateCounts(); }
function getWish(){ try{ return JSON.parse(localStorage.getItem(STORAGE_WISH))||[] }catch(e){return[]} }
function saveWish(w){ localStorage.setItem(STORAGE_WISH, JSON.stringify(w)); updateCounts(); }

function updateCounts(){
  const cart = getCart(); const wish = getWish();
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  const wishCount = wish.length;
  qsa('#cart-count, #cart-count').forEach(el=>el.textContent=cartCount);
  qsa('#wish-count, #wish-count').forEach(el=>el.textContent=wishCount);
}

function findProduct(id){ return window.PRODUCTS.find(p=>p.id===id); }

function addToCart(id, qty=1){ const cart=getCart(); const idx=cart.findIndex(i=>i.id===id); if(idx>-1){cart[idx].qty += qty} else {cart.push({id,qty})} saveCart(cart); flashMessage('Added to cart'); }
function removeFromCart(id){ let cart=getCart(); cart = cart.filter(i=>i.id!==id); saveCart(cart); }
function updateQty(id, qty){ const cart=getCart(); const idx=cart.findIndex(i=>i.id===id); if(idx>-1){ cart[idx].qty = Math.max(1,qty); saveCart(cart); } }

function addToWish(id){ const w=getWish(); if(!w.includes(id)){ w.push(id); saveWish(w); flashMessage('Added to wishlist') } }
function removeFromWish(id){ let w=getWish(); w = w.filter(i=>i!==id); saveWish(w); }
function moveWishToCart(id){ removeFromWish(id); addToCart(id,1); }

function flashMessage(msg, duration=1200){ const el = document.createElement('div'); el.style.position='fixed'; el.style.right='18px'; el.style.bottom='18px'; el.style.padding='12px 18px'; el.style.background='rgba(13,27,42,0.9)'; el.style.color='white'; el.style.borderRadius='10px'; el.style.zIndex=9999; el.textContent=msg; document.body.appendChild(el); setTimeout(()=>{ el.style.opacity=0; setTimeout(()=>el.remove(),300)}, duration); }

// Header buttons
function initHeaderButtons(){ qsa('#cart-btn, #wishlist-btn').forEach(btn=>{ btn.addEventListener('click', (e)=>{ const id = e.currentTarget.id; if(id.includes('cart')) window.location.href='cart.html'; else window.location.href='wishlist.html'; }) })
}

// Home page init
function initHome(){
  // featured categories
  const cats = [
    'Learning & STEM','Building & Blocks','Pretend Play','Arts & Creativity','Outdoor Fun','Puzzles & Games'
  ];
  const fc = qs('#featured-cats'); cats.forEach(c=>{
    const div = document.createElement('div'); div.className='card cat-card';
    div.innerHTML = `<img src="https://images.unsplash.com/photo-150 Kids?auto=format&q=60&w=800" onerror="this.style.display='none'"><strong>${c}</strong><div class='small'>Browse ${c}</div><div style='margin-top:8px'><a class='btn secondary' href='shop.html?category=${encodeURIComponent(c)}'>Browse</a></div>`;
    // replace broken inline image with simple colored block
    fc.appendChild(div);
  });

  // Ages
  const ages = ['2-3','4-5','6-7','8-10'];
  const ag = qs('#shop-by-age'); ages.forEach(a=>{
    const b = document.createElement('a'); b.className='age-pill'; b.href = 'shop.html?age='+encodeURIComponent(a); b.textContent = 'Ages '+a; ag.appendChild(b);
  });

  // Best sellers - first 6
  const best = window.PRODUCTS.slice(0,6);
  const grid = qs('#best-grid'); best.forEach(p=>{
    const card = document.createElement('div'); card.className='card product-card';
    card.innerHTML = `<img src="${p.image}" alt="${p.alt}"><div class='p-body'><div style='display:flex;justify-content:space-between;align-items:center'><strong>${p.name}</strong><div class='small'>${fmt(p.price)}</div></div><div class='p-meta'>${p.category} • Ages ${p.age}</div><div class='p-actions'><button class='btn' data-add='${p.id}'>Add to Cart</button><button class='btn secondary' data-wish='${p.id}'>♥</button><a class='btn secondary' href='product.html?id=${p.id}'>View Details</a></div></div>`;
    grid.appendChild(card);
  });

  // newsletter form
  const nf = qs('#newsletter-form'); if(nf){ nf.addEventListener('submit', (e)=>{ e.preventDefault(); const em=qs('#newsletter-email').value.trim(); const feedback=qs('#newsletter-feedback'); if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){ feedback.textContent='Please enter a valid email.'; feedback.className='bad'; return } feedback.textContent='Thanks for subscribing!'; feedback.className='small'; qs('#newsletter-email').value=''; } ) }

  // attach add / wish handlers
  qs('#best-grid').addEventListener('click', (e)=>{
    if(e.target.dataset.add){ addToCart(e.target.dataset.add); renderMini(); }
    if(e.target.dataset.wish){ addToWish(e.target.dataset.wish); renderMini(); }
  });
}

// Shop page
function initShop(){
  const searchBox = qs('#search-box'); const catSel=qs('#filter-category'); const ageSel=qs('#filter-age'); const priceSel=qs('#filter-price'); const sortSel=qs('#sort-select');
  const grid = qs('#products-grid'); const resultCount = qs('#result-count'); const noResults = qs('#no-results');

  function render(list){ grid.innerHTML=''; if(!list.length){ noResults.style.display='block'; resultCount.textContent='0'; return } noResults.style.display='none'; resultCount.textContent=list.length; list.forEach(p=>{
    const div=document.createElement('div'); div.className='product-card card'; div.innerHTML = `<img src="${p.image}" alt="${p.alt}"><div class='p-body'><h4 style='margin:0'>${p.name}</h4><div class='p-meta'>${p.category} • Ages ${p.age}</div><div class='small'>${p.description}</div><div style='display:flex;justify-content:space-between;align-items:center;margin-top:8px'><div class='small'>${fmt(p.price)} • ⭐ ${p.rating}</div><div class='p-actions'><button class='btn' data-add='${p.id}'>Add to Cart</button><button class='btn secondary' data-wish='${p.id}'>♥</button><a class='btn secondary' href='product.html?id=${p.id}'>View Details</a></div></div></div>`;
    grid.appendChild(div);
  }) }

  function applyFilters(){ let list = window.PRODUCTS.slice(); const q = searchBox.value.trim().toLowerCase(); if(q){ list = list.filter(p=> p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) }
    const c = catSel.value; if(c && c!=='All'){ list = list.filter(p=>p.category===c) }
    const a = ageSel.value; if(a){ list = list.filter(p=>p.age===a) }
    const pr = priceSel.value; if(pr && pr!=='any'){ if(pr==='under20') list=list.filter(p=>p.price<20); if(pr==='20-40') list=list.filter(p=>p.price>=20 && p.price<=40); if(pr==='40-70') list=list.filter(p=>p.price>40 && p.price<=70); if(pr==='70plus') list=list.filter(p=>p.price>70); }
    const s = sortSel.value; if(s==='price-asc') list.sort((a,b)=>a.price-b.price); if(s==='price-desc') list.sort((a,b)=>b.price-a.price); if(s==='rating-desc') list.sort((a,b)=>b.rating-b.rating?b.rating-a.rating:0); if(s==='name-asc') list.sort((a,b)=>a.name.localeCompare(b.name));
    render(list);
  }

  // wire events
  [searchBox, catSel, ageSel, priceSel, sortSel].forEach(el=>el.addEventListener('input', applyFilters));

  // handle add/wish clicks
  grid.addEventListener('click', (e)=>{ if(e.target.dataset.add){ addToCart(e.target.dataset.add); } if(e.target.dataset.wish){ addToWish(e.target.dataset.wish); } renderMini(); })

  // apply URL params
  const params = new URLSearchParams(location.search);
  if(params.get('category')) catSel.value = params.get('category');
  if(params.get('age')) ageSel.value = params.get('age');
  if(params.get('q')) searchBox.value = params.get('q');

  applyFilters();
}

// Product detail page
function initProduct(){ const main = qs('#product-main'); const params = new URLSearchParams(location.search); const id = params.get('id'); const p = findProduct(id); if(!p){ main.innerHTML='<div class="card">Product not found.</div>'; return }
  main.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
    <div><img src="${p.image}" alt="${p.alt}" style="width:100%;border-radius:12px;object-fit:cover;max-height:420px"></div>
    <div class="card" style="display:flex;flex-direction:column;gap:12px"><h2>${p.name}</h2><div class='small'>${p.category} • Ages ${p.age}</div><div class='small'>${p.description}</div><div><strong>${fmt(p.price)}</strong> • ⭐ ${p.rating}</div>
      <div style="display:flex;gap:8px;align-items:center"><button id="qty-minus" class="btn secondary">-</button><input id="qty" value="1" style="width:56px;text-align:center;border-radius:8px;border:1px solid rgba(13,27,42,0.06);padding:8px"><button id="qty-plus" class="btn secondary">+</button></div>
      <div style="display:flex;gap:8px"><button id="add-cart" class="btn">Add to Cart</button><button id="add-wish" class="btn secondary">Add to Wishlist</button><button id="buy-now" class="btn">Buy Now</button></div>
      <div class='small'>Product ID: ${p.id} • Availability: ${p.availability}</div>
    </div>
  </div>`;

  const qtyEl = qs('#qty'); qs('#qty-plus').addEventListener('click', ()=>{ qtyEl.value = parseInt(qtyEl.value||1)+1 }); qs('#qty-minus').addEventListener('click', ()=>{ qtyEl.value = Math.max(1, parseInt(qtyEl.value||1)-1) });
  qs('#add-cart').addEventListener('click', ()=>{ addToCart(p.id, parseInt(qtyEl.value||1)); });
  qs('#add-wish').addEventListener('click', ()=>{ addToWish(p.id); });
  qs('#buy-now').addEventListener('click', ()=>{ addToCart(p.id, parseInt(qtyEl.value||1)); window.location.href='cart.html'; });
}

// Wishlist page
function initWishlist(){ const grid = qs('#wishlist-grid'); const empty = qs('#wishlist-empty'); function render(){ const w = getWish(); grid.innerHTML=''; if(!w.length){ empty.style.display='block'; return } empty.style.display='none'; w.forEach(id=>{ const p=findProduct(id); if(!p) return; const card=document.createElement('div'); card.className='card product-card'; card.innerHTML = `<img src="${p.image}" alt="${p.alt}"><div class='p-body'><h4>${p.name}</h4><div class='p-meta'>${p.category}</div><div style='display:flex;gap:8px'><button class='btn' data-add='${p.id}'>Move to Cart</button><button class='btn secondary' data-remove='${p.id}'>Remove</button><a class='btn secondary' href='product.html?id=${p.id}'>View</a></div></div>`; grid.appendChild(card); }) }
  grid.addEventListener('click', (e)=>{ if(e.target.dataset.remove){ removeFromWish(e.target.dataset.remove); render(); } if(e.target.dataset.add){ moveWishToCart(e.target.dataset.add); render(); } updateCounts(); }); render(); }

// Cart page
function initCart(){ const grid = qs('#cart-grid'); const subtotalEl = qs('#subtotal'); const shippingEl = qs('#shipping'); const totalEl = qs('#total'); const empty = qs('#cart-empty'); function render(){ const cart = getCart(); grid.innerHTML=''; if(!cart.length){ empty.style.display='block'; subtotalEl.textContent = '$0.00'; shippingEl.textContent='$0.00'; totalEl.textContent='$0.00'; return } empty.style.display='none'; let subtotal=0; cart.forEach(item=>{ const p=findProduct(item.id); if(!p) return; subtotal += p.price*item.qty; const row = document.createElement('div'); row.className='card'; row.style.display='flex'; row.style.alignItems='center'; row.style.justifyContent='space-between'; row.innerHTML = `<div style="display:flex;gap:12px;align-items:center"><img src="${p.image}" alt="${p.alt}" style="width:90px;height:60px;object-fit:cover;border-radius:8px"><div><strong>${p.name}</strong><div class='small'>${fmt(p.price)}</div></div></div><div style='display:flex;align-items:center;gap:8px'><button class='btn secondary' data-dec='${p.id}'>-</button><div class='small'>${item.qty}</div><button class='btn secondary' data-inc='${p.id}'>+</button><button class='btn secondary' data-remove='${p.id}'>Remove</button></div>`; grid.appendChild(row); })
    const shipping = subtotal>60 ? 0 : 6; subtotalEl.textContent = fmt(subtotal); shippingEl.textContent = fmt(shipping); totalEl.textContent = fmt(subtotal+shipping); }

  grid.addEventListener('click', (e)=>{ if(e.target.dataset.inc){ const id=e.target.dataset.inc; const cart=getCart(); const idx=cart.find(i=>i.id===id); if(idx) { updateQty(id, idx.qty+1); } render(); } if(e.target.dataset.dec){ const id=e.target.dataset.dec; const cart=getCart(); const it=cart.find(i=>i.id===id); if(it){ updateQty(id, it.qty-1); } render(); } if(e.target.dataset.remove){ removeFromCart(e.target.dataset.remove); render(); } });

  qs('#checkout-btn').addEventListener('click', ()=>{ alert('Checkout demo — your order is ready.'); localStorage.removeItem(STORAGE_CART); render(); updateCounts(); });
  render(); updateCounts(); }

// Categories page
function initCategories(){ const grid = qs('#categories-grid'); const cats = [
  {name:'Learning & STEM',desc:'Science and discovery kits',img:'https://images.unsplash.com/photo-1587620931302-7b2f0f3f0b98?q=80&w=800'},
  {name:'Building & Blocks',desc:'Blocks, tiles and builders',img:'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=800'},
  {name:'Pretend Play',desc:'Dollhouses, kitchens & role-play',img:'https://images.unsplash.com/photo-1545239351-36d6d3c05a2b?q=80&w=800'},
  {name:'Arts & Creativity',desc:'Craft and art sets',img:'https://images.unsplash.com/photo-1527259675004-3e21f5ddf8d3?q=80&w=800'},
  {name:'Outdoor Fun',desc:'Active outdoor toys',img:'https://images.unsplash.com/photo-1526403224743-3b2f542d7c6f?q=80&w=800'},
  {name:'Puzzles & Games',desc:'Puzzles, matching and board games',img:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800'}
];
  cats.forEach(c=>{ const card = document.createElement('div'); card.className='card'; card.innerHTML = `<img src='${c.img}' alt='${c.name}' style='width:100%;height:160px;object-fit:cover;border-radius:10px'><h4>${c.name}</h4><div class='small'>${c.desc}</div><div style='margin-top:8px'><a class='btn secondary' href='shop.html?category=${encodeURIComponent(c.name)}'>Browse</a></div>`; grid.appendChild(card); }) }

// Contact form
function initContact(){ const form = qs('#contact-form'); form.addEventListener('submit', (e)=>{ e.preventDefault(); const name=qs('#c-name').value.trim(); const email=qs('#c-email').value.trim(); const subject=qs('#c-subject').value.trim(); const msg=qs('#c-message').value.trim(); const fb = qs('#contact-feedback'); if(!name||!email||!subject||!msg){ fb.textContent='Please complete all fields.'; fb.className='bad'; return } if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ fb.textContent='Please enter a valid email.'; fb.className='bad'; return } fb.textContent='Thanks! Your message has been received.'; fb.className='small'; form.reset(); }) }

// Init router
function init(){ updateCounts(); initHeaderButtons(); const page = document.body.dataset.page; if(page==='home') initHome(); if(page==='shop') initShop(); if(page==='product') initProduct(); if(page==='wishlist') initWishlist(); if(page==='cart') initCart(); if(page==='categories') initCategories(); if(page==='contact') initContact();
  // generic click delegation for inline Add/Wish in pages
  document.body.addEventListener('click', (e)=>{
    if(e.target.matches('[data-add]')){ addToCart(e.target.dataset.add); }
    if(e.target.matches('[data-wish]')){ addToWish(e.target.dataset.wish); }
  });
}

window.addEventListener('DOMContentLoaded', init);
