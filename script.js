// LittleLearners site script.js — unified initializer
// Requires data.js (window.PRODUCTS)

const q = (s, ctx = document) => ctx.querySelector(s);
const qAll = (s, ctx = document) => Array.from((ctx || document).querySelectorAll(s));
const formatPrice = p => `$${Number(p).toFixed(2)}`;

// --- Cart (localStorage) ---
const CART_KEY = 'littlelearners_cart_v1';
function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch(e){ return []; }
}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function getCartCount(){ return loadCart().reduce((s,i)=>s+Number(i.qty||0),0); }
function updateCartCount(){ qAll('.cart-count').forEach(el=>el.textContent = getCartCount()); }

function addToCart(id, qty=1){
  const cart = loadCart();
  const existing = cart.find(it=>it.id==id);
  if(existing){ existing.qty = Number(existing.qty)+Number(qty); }
  else{ cart.push({id, qty: Number(qty)}); }
  saveCart(cart);
}
function setCartQty(id, qty){
  const cart = loadCart();
  const idx = cart.findIndex(i=>i.id==id);
  if(idx>-1){ if(qty<=0) cart.splice(idx,1); else cart[idx].qty = Number(qty); }
  saveCart(cart);
}
function removeFromCart(id){ const cart = loadCart().filter(i=>i.id!=id); saveCart(cart); }

function getProductById(id){ if(!window.PRODUCTS) return null; return PRODUCTS.find(p=>String(p.id)===String(id)); }

// --- Header / Nav ---
function initHeader(){
  // Wire mobile nav toggle if present
  qAll('a[href="index.html"]').forEach(a=>a.addEventListener('click', ()=>{}));
  updateCartCount();
}

// --- Shop: render product cards ---
function createProductCard(p){
  const div = document.createElement('div'); div.className = 'product-card';
  div.innerHTML = `
    <img src="${p.image}" alt="${p.alt||p.name}" loading="lazy">
    <h4 class="p-name">${p.name}</h4>
    <div class="p-meta">${p.category} · ${p.ageGroup || ''}</div>
    <p class="p-desc">${p.description}</p>
    <div class="p-bottom">
      <div class="p-price">${formatPrice(p.price)}</div>
      <div class="p-actions">
        <button class="btn btn-sm btn-add" data-id="${p.id}">Add to Cart</button>
        <a class="btn btn-sm" href="product.html?id=${encodeURIComponent(p.id)}">View Details</a>
      </div>
    </div>
  `;
  return div;
}

function renderProductsGrid(list){
  const grid = q('#products-grid');
  if(!grid) return;
  grid.innerHTML='';
  if(!list || list.length===0){ grid.innerHTML = '<p class="muted">No products found matching your search or filters.</p>'; return; }
  list.forEach(p=> grid.appendChild(createProductCard(p)) );
  // wire add buttons
  qAll('.btn-add', grid).forEach(b=> b.addEventListener('click', e=>{ addToCart(b.dataset.id,1); flashMessage('Added to cart'); }))
}

// --- Search / Filters / Sort ---
function getShopControls(){
  return {
    search: q('#search-box') ? q('#search-box').value.trim().toLowerCase() : '',
    category: q('#filter-category') ? q('#filter-category').value : 'All',
    age: q('#filter-age') ? q('#filter-age').value : '',
    price: q('#filter-price') ? q('#filter-price').value : '',
    sort: q('#sort-select') ? q('#sort-select').value : 'featured'
  }
}

function applyShopFilters(){
  if(!window.PRODUCTS) return renderProductsGrid([]);
  const controls = getShopControls();
  let list = PRODUCTS.slice();
  // search
  if(controls.search){
    const s = controls.search;
    list = list.filter(p=>((p.name||'').toLowerCase().includes(s) || (p.description||'').toLowerCase().includes(s) || (p.category||'').toLowerCase().includes(s)));
  }
  // category
  if(controls.category && controls.category!=='All'){
    list = list.filter(p=> (p.category||'').toLowerCase().includes(controls.category.toLowerCase()));
  }
  // age
  if(controls.age){
    // age format examples: "3-4", "5-6", etc
    list = list.filter(p=>{ if(!p.ageGroup) return false; return p.ageGroup.includes(controls.age.split('-')[0]); });
  }
  // price
  if(controls.price){
    const pr = controls.price;
    if(pr==='under20') list = list.filter(p=>p.price<20);
    if(pr==='20-40') list = list.filter(p=>p.price>=20 && p.price<=40);
    if(pr==='40-70') list = list.filter(p=>p.price>40 && p.price<=70);
    if(pr==='70+') list = list.filter(p=>p.price>70);
  }
  // sort
  if(controls.sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(controls.sort==='price-desc') list.sort((a,b)=>b.price-a.price);
  if(controls.sort==='rating') list.sort((a,b)=>b.rating-b.rating?b.rating-a.rating:0);
  if(controls.sort==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
  // featured (default) - keep original order
  renderProductsGrid(list);
}

function initShopControls(){
  const search = q('#search-box'); if(search) search.addEventListener('input', debounce(applyShopFilters,200));
  qAll('#filter-category, #filter-age, #filter-price, #sort-select').forEach(el=>{ if(el) el.addEventListener('change', applyShopFilters); });
  applyShopFilters();
}

// --- Product detail page ---
function initProductPage(){
  const el = q('#pd-title'); if(!el) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id'); if(!id) return;
  const p = getProductById(id); if(!p) return;
  q('#pd-image-img').src = p.image; q('#pd-image-img').alt = p.alt || p.name;
  q('#pd-title').textContent = p.name;
  q('#pd-category').textContent = p.category || '';
  q('#pd-age').textContent = p.ageGroup || '';
  q('#pd-price').textContent = formatPrice(p.price);
  q('#pd-desc').textContent = p.description;
  q('#pd-rating').textContent = p.rating ? p.rating + '/5' : '';
  q('#pd-availability').textContent = p.availability || 'In stock';
  q('#pd-learning').textContent = p.learningBenefits || '';
  // quantity selector
  const qtyIn = q('#pd-qty'); if(qtyIn) qtyIn.value = 1;
  q('#pd-add') && q('#pd-add').addEventListener('click', ()=>{ const qty = Number(q('#pd-qty').value||1); addToCart(p.id, qty); flashMessage('Added to cart'); });
  q('#pd-buy') && q('#pd-buy').addEventListener('click', ()=>{ const qty = Number(q('#pd-qty').value||1); addToCart(p.id, qty); location.href='cart.html'; });
}

// --- Cart page ---
function renderCartPage(){
  const wrap = q('#cart-items'); if(!wrap) return;
  const cart = loadCart();
  wrap.innerHTML='';
  if(cart.length===0){ wrap.innerHTML = '<p class="muted">Your cart is empty. <a href="shop.html">Shop educational toys</a></p>'; q('#subtotal') && (q('#subtotal').textContent = '$0.00'); q('#shipping') && (q('#shipping').textContent = '$0.00'); q('#grandtotal') && (q('#grandtotal').textContent = '$0.00'); return; }
  let subtotal = 0;
  cart.forEach(item=>{
    const p = getProductById(item.id);
    if(!p) return;
    const row = document.createElement('div'); row.className='cart-row';
    row.innerHTML = `
      <img src="${p.image}" alt="${p.alt||p.name}">
      <div class="cart-info">
        <div class="cart-name">${p.name}</div>
        <div class="cart-price">${formatPrice(p.price)}</div>
      </div>
      <div class="cart-qty">
        <button class="qty-btn" data-op="dec" data-id="${p.id}">-</button>
        <input class="qty-input" data-id="${p.id}" value="${item.qty}" />
        <button class="qty-btn" data-op="inc" data-id="${p.id}">+</button>
      </div>
      <div class="cart-sub">${formatPrice(p.price * item.qty)}</div>
      <button class="cart-remove" data-id="${p.id}">Remove</button>
    `;
    wrap.appendChild(row);
    subtotal += p.price * item.qty;
  });
  const shipping = subtotal>50 ? 0 : 5;
  const grand = subtotal + shipping;
  q('#subtotal').textContent = formatPrice(subtotal);
  q('#shipping').textContent = formatPrice(shipping);
  q('#grandtotal').textContent = formatPrice(grand);
  // wire qty buttons
  qAll('.qty-btn').forEach(b=> b.addEventListener('click', ()=>{
    const id = b.dataset.id; const op = b.dataset.op; const cart = loadCart(); const it = cart.find(i=>i.id==id); if(!it) return; if(op==='inc') it.qty = Number(it.qty)+1; else it.qty = Number(it.qty)-1; if(it.qty<=0) { removeFromCart(id); } else saveCart(cart); renderCartPage(); }))
  qAll('.qty-input').forEach(inp=> inp.addEventListener('change', ()=>{ const id = inp.dataset.id; const v = Number(inp.value||0); setCartQty(id, v); renderCartPage(); }));
  qAll('.cart-remove').forEach(b=> b.addEventListener('click', ()=>{ removeFromCart(b.dataset.id); renderCartPage(); }));
}

// --- Activities ---
const ACTIVITIES = [
  { id:'a1', title:'Build a Paper Rocket', age:'5-10', difficulty:'Easy', img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800', instructions:'Fold paper into a cone, attach fins, decorate and launch with a straw.' },
  { id:'a2', title:'Count and Sort Challenge', age:'3-6', difficulty:'Easy', img:'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800', instructions:'Collect small toys or buttons and sort them by color and size.' },
  { id:'a3', title:'DIY Solar System', age:'7-10', difficulty:'Medium', img:'https://images.unsplash.com/photo-1542736667-069246bdbc6d?q=80&w=800', instructions:'Paint foam balls to make planets and hang them to create a model solar system.' },
  { id:'a4', title:'Color Mixing Experiment', age:'3-8', difficulty:'Easy', img:'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800', instructions:'Mix primary colors using water and food coloring to discover secondary colors.' },
  { id:'a5', title:'Animal Memory Game', age:'3-6', difficulty:'Easy', img:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800', instructions:'Create pairs of animal cards and play memory match.' },
  { id:'a6', title:'Beginner Coding Challenge', age:'7-10', difficulty:'Medium', img:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800', instructions:'Use a block-coding app or simple cards to make a character follow a path.' }
];

function renderActivities(){
  const grid = q('#activities-grid'); if(!grid) return;
  grid.innerHTML = '';
  ACTIVITIES.forEach(a=>{
    const card = document.createElement('div'); card.className='activity-card';
    card.innerHTML = `
      <img src="${a.img}" alt="${a.title}">
      <h4>${a.title}</h4>
      <div class="meta">${a.age} · ${a.difficulty}</div>
      <p>${a.instructions.substring(0,120)}${a.instructions.length>120?'...':''}</p>
      <div class="actions"><button class="btn" data-id="${a.id}">View Activity</button></div>
    `;
    grid.appendChild(card);
  });
  qAll('.activity-card .btn').forEach(b=> b.addEventListener('click', ()=>{
    const a = ACTIVITIES.find(x=>x.id===b.dataset.id); if(!a) return;
    // show modal-like detail below grid
    const detail = q('#activity-detail'); if(detail){ detail.innerHTML = `<h3>${a.title}</h3><img src="${a.img}" alt="${a.title}"><p><strong>Age:</strong> ${a.age}</p><p><strong>Difficulty:</strong> ${a.difficulty}</p><p>${a.instructions}</p>`; detail.scrollIntoView({behavior:'smooth'}); }
  }));
}

// --- Contact form & Newsletter ---
function initContactForm(){
  const form = q('#contact-form'); if(!form) return;
  const feedback = q('#contact-feedback');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = q('#c-name').value.trim();
    const email = q('#c-email').value.trim();
    const msg = q('#c-message').value.trim();
    if(!name){ feedback.textContent='Please enter your name.'; feedback.style.color='red'; return; }
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ feedback.textContent='Please enter a valid email address.'; feedback.style.color='red'; return; }
    if(!msg){ feedback.textContent='Please enter a message.'; feedback.style.color='red'; return; }
    feedback.style.color='green'; feedback.textContent='Thanks! Your message has been received.';
    form.reset();
  });
}

function initNewsletter(){
  const form = q('#newsletter-form'); if(!form) return;
  const email = q('#newsletter-email'); const fb = q('#newsletter-feedback');
  form.addEventListener('submit', e=>{ e.preventDefault(); const v = email.value.trim(); if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){ fb.textContent='Please enter a valid email address.'; fb.style.color='red'; return;} fb.textContent="You're subscribed!"; fb.style.color='green'; email.value=''; });
}

// --- Misc helpers ---
function flashMessage(msg, timeout=1500){
  const el = document.createElement('div'); el.className='toast'; el.textContent = msg; document.body.appendChild(el);
  setTimeout(()=> el.style.opacity=1, 20);
  setTimeout(()=>{ el.style.opacity=0; setTimeout(()=>el.remove(),400); }, timeout);
}

function debounce(fn, wait=200){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; }

// --- Initialization ---
function initAll(){
  initHeader();
  // safe: many pages do not include data.js; only run shop/product rendering when PRODUCTS is present
  if(window.PRODUCTS){
    // shop controls and product grid
    initShopControls();
  }
  // product detail page
  initProductPage();
  // cart page
  renderCartPage();
  // activities
  renderActivities();
  // contact
  initContactForm();
  // newsletter
  initNewsletter();
  // header cart wiring is global
  updateCartCount();
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initAll); else initAll();
