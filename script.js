// Core site script for ToyNest
// Handles products, filters, product detail, cart persistence, forms and UI

// Small helpers
const q = (s, ctx=document) => ctx.querySelector(s);
const qAll = (s, ctx=document) => Array.from((ctx||document).querySelectorAll(s));
const formatPrice = p => `$${Number(p).toFixed(2)}`;
const toNumber = v => Number(String(v).replace(/[^0-9.-]+/g, '')) || 0;

const CART_KEY = 'toy_cart_v1';
let CART = {};

// Load / Save Cart
function loadCart(){
  try{ CART = JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch(e){ CART = {}; }
  updateCartCount();
}
function saveCart(){
  localStorage.setItem(CART_KEY, JSON.stringify(CART));
  updateCartCount();
}
function updateCartCount(){
  const count = Object.values(CART).reduce((s,i)=>s + (i.qty||0), 0);
  qAll('.cart-count').forEach(el=>el.textContent = count);
}

function flashMessage(msg, timeout=1800){
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  Object.assign(el.style, {position:'fixed',right:'16px',bottom:'16px',background:'#002e63',color:'#fff',padding:'10px 14px',borderRadius:'8px',boxShadow:'0 6px 18px rgba(0,0,0,0.15)',zIndex:9999});
  document.body.appendChild(el);
  setTimeout(()=>{ el.style.opacity=0; setTimeout(()=>el.remove(),400); }, timeout);
}

function addToCart(id, qty=1){
  if(id===undefined || id===null) return;
  id = String(id);
  qty = Number(qty) || 1;
  if(!CART[id]) CART[id] = { id: id, qty:0 };
  CART[id].qty += qty;
  saveCart();
  flashMessage('Added to cart');
}
function setCartQty(id, qty){
  id = String(id);
  qty = Number(qty);
  if(!CART[id]) return;
  if(qty<=0){ delete CART[id]; } else { CART[id].qty = qty; }
  saveCart();
}
function removeFromCart(id){
  id = String(id);
  delete CART[id];
  saveCart();
}

function getCartEntries(){
  // return array with product info merged
  const prods = (window.PRODUCTS||[]);
  return Object.values(CART).map(ci=>{
    const prod = prods.find(p=>String(p.id)===String(ci.id));
    return { ...ci, product: prod };
  }).filter(x=>x.product);
}

// Render featured products on home
function renderFeatured(){
  const grid = document.getElementById('featured-grid');
  if(!grid || !(window.PRODUCTS && PRODUCTS.length)) return;
  grid.innerHTML = '';
  const featured = PRODUCTS.slice(0,6);
  featured.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.alt||p.name}" loading="lazy">
      <h4>${p.name}</h4>
      <div class="muted">${p.category} • ${p.ageGroup}</div>
      <div class="price">${formatPrice(p.price)}</div>
      <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
        <button class="btn add-cart" data-id="${p.id}">Add to Cart</button>
        <a class="btn" href="product-detail.html?id=${encodeURIComponent(p.id)}">View Details</a>
      </div>
    `;
    grid.appendChild(card);
  });
  // wire add to cart
  grid.querySelectorAll('.add-cart').forEach(btn=> btn.addEventListener('click', e=>{ addToCart(btn.dataset.id,1); }));
}

// PRODUCTS page: filtering / sorting / rendering
function initProductsPage(){
  const grid = q('#products-grid');
  if(!grid) return;
  let items = (window.PRODUCTS||[]).slice();

  // controls
  const catWrap = q('#filter-categories');
  const ageWrap = q('#age-select');
  const priceWrap = q('#price-range');
  const sortSelect = q('#sort-select');
  const searchBox = q('#search-box');

  function renderGrid(list){
    grid.innerHTML = '';
    if(!list.length){ grid.innerHTML = '<p class="muted">No products match the selected filters.</p>'; return; }
    list.forEach(p=>{
      const article = document.createElement('article'); article.className='product-card';
      article.innerHTML = `
        <img src="${p.image}" alt="${p.alt||p.name}" loading="lazy">
        <h4>${p.name}</h4>
        <div class="muted">${p.category} • ${p.ageGroup}</div>
        <p class="small">${p.description}</p>
        <div class="price">${formatPrice(p.price)}</div>
        <div style="display:flex;gap:8px;margin-top:8px;align-items:center">
          <button class="btn add-cart" data-id="${p.id}">Add to Cart</button>
          <a class="btn" href="product-detail.html?id=${encodeURIComponent(p.id)}">View Details</a>
        </div>
      `;
      grid.appendChild(article);
    });
    // wire add-cart
    grid.querySelectorAll('.add-cart').forEach(b=>b.addEventListener('click', e=> addToCart(b.dataset.id,1)));
  }

  function applyFilters(){
    let filtered = (window.PRODUCTS||[]).slice();
    // category filter from URL or UI
    const url = new URLSearchParams(location.search);
    const category = url.get('category') || (catWrap && catWrap.querySelector('.active') && catWrap.querySelector('.active').dataset.cat) || 'All';
    if(category && category!=='All') filtered = filtered.filter(i=>i.category===category);
    // age selection
    const age = ageWrap ? (ageWrap.value || '') : '';
    if(age){
      if(age==='0-3') filtered = filtered.filter(i=>i.ageGroup && /0-3|0–3/.test(i.ageGroup));
      if(age==='4-6') filtered = filtered.filter(i=>/4-6|4–6|4–6/.test(i.ageGroup)||/4\+/.test(i.ageGroup));
      if(age==='7-9') filtered = filtered.filter(i=>/7-9|7–9/.test(i.ageGroup));
      if(age==='10+') filtered = filtered.filter(i=>/10\+|10\+/.test(i.ageGroup));
    }
    // price
    const price = priceWrap ? priceWrap.value : '';
    if(price){
      if(price==='under20') filtered = filtered.filter(i => Number(i.price) < 20);
      if(price==='20-50') filtered = filtered.filter(i => Number(i.price) >= 20 && Number(i.price) <= 50);
      if(price==='over50') filtered = filtered.filter(i => Number(i.price) > 50);
    }
    // search
    const qText = searchBox ? (searchBox.value||'').trim().toLowerCase() : '';
    if(qText){ filtered = filtered.filter(i=> (i.name||'').toLowerCase().includes(qText) || (i.description||'').toLowerCase().includes(qText)); }
    // sorting
    const s = sortSelect ? sortSelect.value : 'featured';
    if(s==='price-asc') filtered.sort((a,b)=>Number(a.price)-Number(b.price));
    if(s==='price-desc') filtered.sort((a,b)=>Number(b.price)-Number(a.price));
    if(s==='rating-desc') filtered.sort((a,b)=>Number(b.rating) - Number(a.rating));
    if(s==='name-asc') filtered.sort((a,b)=>String(a.name).localeCompare(String(b.name)));

    renderGrid(filtered);
  }

  // wire controls
  if(sortSelect) sortSelect.addEventListener('change', applyFilters);
  if(searchBox) searchBox.addEventListener('input', debounce(applyFilters, 250));
  if(qAll('.cat-btn').length){
    qAll('.cat-btn').forEach(b=> b.addEventListener('click', ()=>{
      // set URL param and reload apply
      const cat = b.dataset.cat;
      const url = new URL(location.href);
      if(cat==='All') url.searchParams.delete('category'); else url.searchParams.set('category', cat);
      location.href = url.pathname + url.search; // navigate to products (stays if already on page)
    }));
  }

  // initial render
  applyFilters();
}

// debounce helper
function debounce(fn, wait){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; }

// Product detail page
function initProductDetail(){
  const title = q('#pd-title');
  if(!title) return;
  const id = new URLSearchParams(location.search).get('id');
  if(!id) return;
  const p = (window.PRODUCTS||[]).find(x=>String(x.id)===String(id));
  if(!p) return;
  const img = q('#pd-image-img'); if(img) { img.src = p.image; img.alt = p.alt||p.name; }
  q('#pd-title').textContent = p.name;
  q('#pd-price').textContent = formatPrice(p.price);
  q('#pd-rating').textContent = p.rating? `★ ${p.rating}` : '';
  q('#pd-desc').textContent = p.description || '';
  q('#pd-category').textContent = p.category || '';
  q('#pd-age').textContent = p.ageGroup || '';
  q('#pd-availability').textContent = p.availability || 'In stock';

  const qtyInput = q('#pd-qty');
  if(qtyInput){ qtyInput.value = 1; }
  qAll('#pd-increase, #pd-decrease').forEach(btn=> btn.addEventListener('click', e=>{
    if(!qtyInput) return; let v = Number(qtyInput.value)||1; if(btn.id==='pd-increase') v++; else v = Math.max(1, v-1); qtyInput.value = v;
  }));

  const addBtn = q('#pd-add'); if(addBtn) addBtn.addEventListener('click', ()=>{ const qv = Number(q('#pd-qty').value)||1; addToCart(p.id, qv); });
  const buyBtn = q('#pd-buy'); if(buyBtn) buyBtn.addEventListener('click', ()=>{ const qv = Number(q('#pd-qty').value)||1; addToCart(p.id, qv); location.href = 'cart.html'; });
}

// Cart page rendering and handlers
function renderCartPage(){
  const wrap = q('#cart-items');
  if(!wrap) return;
  wrap.innerHTML = '';
  const entries = getCartEntries();
  const subtotalEl = q('#subtotal');
  const shippingEl = q('#shipping');
  const totalEl = q('#total');
  if(entries.length===0){ wrap.innerHTML = '<p class="muted">Your cart is empty.</p>'; if(subtotalEl) subtotalEl.textContent = '$0.00'; if(shippingEl) shippingEl.textContent='$0.00'; if(totalEl) totalEl.textContent='$0.00'; return; }

  let subtotal = 0;
  entries.forEach(e=>{
    const p = e.product; const qty = e.qty; const line = document.createElement('div'); line.className='cart-row';
    line.innerHTML = `
      <img src="${p.image}" alt="${p.alt||p.name}" style="width:80px;height:80px;object-fit:cover;border-radius:8px">
      <div style="flex:1;margin-left:12px">
        <strong>${p.name}</strong>
        <div class="muted">${p.category} • ${p.ageGroup}</div>
        <div class="small">${formatPrice(p.price)} each</div>
      </div>
      <div style="min-width:140px;display:flex;gap:6px;align-items:center;justify-content:flex-end">
        <button class="btn qty-dec" data-id="${e.id}">-</button>
        <input class="cart-qty" data-id="${e.id}" type="number" min="1" value="${qty}" style="width:54px;text-align:center;padding:6px;border-radius:6px;border:1px solid #ddd">
        <button class="btn qty-inc" data-id="${e.id}">+</button>
        <div style="width:80px;text-align:right">${formatPrice(p.price * qty)}</div>
        <button class="btn remove" data-id="${e.id}">Remove</button>
      </div>
    `;
    wrap.appendChild(line);
    subtotal += Number(p.price) * Number(qty);
  });
  const shipping = subtotal>50 || subtotal===0 ? 0 : 5.99;
  const total = subtotal + shipping;
  if(subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if(shippingEl) shippingEl.textContent = formatPrice(shipping);
  if(totalEl) totalEl.textContent = formatPrice(total);

  // wire qty and remove
  wrap.querySelectorAll('.qty-inc').forEach(b=>b.addEventListener('click', ()=>{ const id=b.dataset.id; const input=q(`input.cart-qty[data-id="${id}"]`); const v = Number(input.value)||1; setCartQty(id, v+1); renderCartPage(); }));
  wrap.querySelectorAll('.qty-dec').forEach(b=>b.addEventListener('click', ()=>{ const id=b.dataset.id; const input=q(`input.cart-qty[data-id="${id}"]`); const v = Number(input.value)||1; setCartQty(id, Math.max(0, v-1)); renderCartPage(); }));
  wrap.querySelectorAll('.cart-qty').forEach(input=> input.addEventListener('change', ()=>{ const id=input.dataset.id; const v = Number(input.value)||1; setCartQty(id, v); renderCartPage(); }));
  wrap.querySelectorAll('.remove').forEach(b=> b.addEventListener('click', ()=>{ removeFromCart(b.dataset.id); renderCartPage(); }));
}

// Checkout demo handler
function initCheckout(){
  const btn = q('#checkout'); if(!btn) return;
  btn.addEventListener('click', ()=>{ alert('Checkout demo — your order is ready.'); CART = {}; saveCart(); renderCartPage(); });
}

// Newsletter / contact
function initNewsletter(){
  const form = q('#newsletter-form'); if(!form) return;
  const email = q('#newsletter-email'); const feedback = q('#newsletter-feedback');
  form.addEventListener('submit', e=>{
    e.preventDefault(); if(!email) return;
    const v = (email.value||'').trim(); if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){ if(feedback) { feedback.textContent='Please enter a valid email.'; feedback.style.color='crimson'; } return; }
    if(feedback) { feedback.textContent='Thanks — you are subscribed!'; feedback.style.color='green'; }
    email.value = '';
  });
}

function initContact(){
  const form = q('#contact-form'); if(!form) return;
  const name = q('#c-name'); const em = q('#c-email'); const subj = q('#c-subject'); const msg = q('#c-message'); const feedback = q('#contact-feedback');
  form.addEventListener('submit', e=>{
    e.preventDefault(); let ok=true; let errs=[];
    if(!name.value.trim()){ ok=false; errs.push('Please enter your name.'); }
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value||'')){ ok=false; errs.push('Please enter a valid email.'); }
    if(!subj.value.trim()){ ok=false; errs.push('Please enter a subject.'); }
    if(!msg.value.trim()){ ok=false; errs.push('Please enter a message.'); }
    if(!ok){ if(feedback){ feedback.textContent = errs.join(' '); feedback.style.color='crimson'; } return; }
    if(feedback){ feedback.textContent = 'Thanks! Your message has been received.'; feedback.style.color='green'; }
    form.reset();
  });
}

// Small nav toggle for mobile
function initNavToggle(){
  const t = q('.nav-toggle'); if(!t) return; t.addEventListener('click', ()=>{ const nav = q('#main-navigation'); if(!nav) return; nav.classList.toggle('open'); });
}

// Wire category buttons site-wide (home categories etc.)
function initCategoryButtons(){
  qAll('.cat-btn').forEach(b=> b.addEventListener('click', ()=>{
    const cat = b.dataset.cat; const url = new URL('products.html', location.origin);
    if(cat && cat!=='All') url.searchParams.set('category', cat);
    location.href = url.pathname + url.search;
  }));
}

// Safe init: call only when DOM and PRODUCTS ready
function safeInit(){
  loadCart();
  renderFeatured();
  initProductsPage();
  initProductDetail();
  renderCartPage();
  initCheckout();
  initContact();
  initNewsletter();
  initNavToggle();
  initCategoryButtons();
}

// Wait for PRODUCTS to be available (data.js should be included before script.js)
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', ()=>{
    // allow PRODUCTS to exist
    if(typeof PRODUCTS==='undefined'){
      // small delay to ensure external data.js loaded before script (defensive)
      setTimeout(safeInit, 20);
    } else safeInit();
  });
} else {
  if(typeof PRODUCTS==='undefined') setTimeout(safeInit,20); else safeInit();
}
