// Core site script for LittleLearners
// Handles products, filters, product detail, cart persistence, forms and UI

// small helpers
const q = (s, ctx=document) => ctx.querySelector(s);
const qAll = (s, ctx=document) => Array.from((ctx||document).querySelectorAll(s));
const formatPrice = p => `$${Number(p).toFixed(2)}`;

const CART_KEY = 'litlearners_cart_v1';
let CART = {};

// Load / Save Cart
function loadCart(){
  try{ CART = JSON.parse(localStorage.getItem(CART_KEY)) || {}; }catch(e){ CART = {}; }
  updateCartCount();
}
function saveCart(){
  localStorage.setItem(CART_KEY, JSON.stringify(CART));
  updateCartCount();
}
function updateCartCount(){
  const count = Object.values(CART).reduce((s,i)=>s+(i.qty||0),0);
  qAll('.cart-count').forEach(el=>el.textContent = count);
}

function flashMessage(msg, timeout=1800){
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  Object.assign(el.style, {position:'fixed',right:'16px',bottom:'16px',background:'#003e63',color:'#fff',padding:'10px 14px',borderRadius:'8px',boxShadow:'0 6px 18px rgba(0,0,0,0.15)',zIndex:9999});
  document.body.appendChild(el);
  setTimeout(()=>{ el.style.opacity=0; setTimeout(()=>el.remove(),400); }, timeout);
}

// Add to cart
function addToCart(id, qty=1){
  if(id===undefined || id===null) return;
  id = String(id);
  qty = Number(qty) || 1;
  if(!CART[id]) CART[id] = { id, qty: 0 };
  CART[id].qty += qty;
  saveCart();
  flashMessage('Added to cart');
}
function setCartQty(id, qty){
  id = String(id);
  qty = Number(qty)||0;
  if(qty<=0) delete CART[id];
  else CART[id].qty = qty;
  saveCart();
}
function removeFromCart(id){
  id = String(id);
  delete CART[id];
  saveCart();
}

// Get product entries
function getProductEntries(){
  const prods = (window.PRODUCTS||[]);
  return prods.map(p=>({ ...p, id: String(p.id) }));
}

// Render featured products on home
function renderFeatured(){
  const grid = q('#featured-grid');
  if(!grid) return;
  const featured = (getProductEntries().slice(0,6));
  grid.innerHTML = '';
  featured.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.alt||p.name}" loading="lazy">
      <h4>${p.name}</h4>
      <div class="meta">${p.category} • ${p.ageGroup}</div>
      <div class="price">${formatPrice(p.price)}</div>
      <div class="actions">
        <button class="btn" data-id="${p.id}" data-action="add">Add to Cart</button>
        <a class="btn btn-outline" href="product.html?id=${encodeURIComponent(p.id)}">View Details</a>
      </div>
    `;
    grid.appendChild(card);
  });
  // attach add buttons
  grid.querySelectorAll('[data-action="add"]').forEach(b=>b.addEventListener('click',()=>{ addToCart(b.dataset.id,1); }));
}

// Render categories on home
function renderCategories(){
  const list = q('#categories-list');
  if(!list) return;
  const cats = ['STEM & Science','Math & Numbers','Reading & Language','Arts & Creativity','Puzzles','Pretend Play'];
  list.innerHTML = '';
  cats.forEach(c=>{
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.textContent = c;
    btn.dataset.cat = c;
    btn.addEventListener('click',()=>{ location.href = `shop.html?cat=${encodeURIComponent(c)}`; });
    list.appendChild(btn);
  });
}

// Products page init: search, filters, sorting, render grid
function initProductsPage(){
  const grid = q('#products-grid');
  if(!grid) return;

  const catWrap = q('#filter-categories');
  const ageWrap = q('#age-select');
  const priceWrap = q('#price-range');
  const sortSelect = q('#sort-select');
  const searchBox = q('#search-box');

  function renderGrid(list){
    grid.innerHTML = '';
    if(!list.length){ grid.innerHTML = '<p class="muted">No products match your search or filters.</p>'; return; }
    list.forEach(p=>{
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.alt||p.name}" loading="lazy">
        <h4>${p.name}</h4>
        <div class="meta">${p.category} • ${p.ageGroup}</div>
        <p class="desc small">${p.description}</p>
        <div class="price">${formatPrice(p.price)}</div>
        <div class="actions">
          <button class="btn" data-id="${p.id}" data-action="add">Add to Cart</button>
          <a class="btn btn-outline" href="product.html?id=${encodeURIComponent(p.id)}">View Details</a>
        </div>
      `;
      grid.appendChild(card);
    });
    grid.querySelectorAll('[data-action="add"]').forEach(b=>b.addEventListener('click',()=>{ addToCart(b.dataset.id,1); }));
  }

  let items = getProductEntries();

  // Build category buttons
  if(catWrap){
    const cats = ['All','STEM & Science','Math & Numbers','Reading & Language','Arts & Creativity','Puzzles','Pretend Play'];
    catWrap.innerHTML = '';
    cats.forEach(c=>{
      const btn = document.createElement('button'); btn.className='cat-btn'; btn.textContent=c; btn.dataset.cat=c; catWrap.appendChild(btn);
      btn.addEventListener('click',()=>{ location.search = `?cat=${encodeURIComponent(c)}`; });
    });
  }

  function applyFilters(){
    let list = getProductEntries();
    const params = new URLSearchParams(location.search);

    // Category filter via query param
    const selCat = params.get('cat') || '';
    if(selCat && selCat !== 'All') list = list.filter(i=>i.category.toLowerCase().includes(selCat.toLowerCase()));

    // Age filter
    const age = ageWrap ? ageWrap.value : '';
    if(age){
      if(age==='3-4') list = list.filter(i=>i.ageGroup.startsWith('3'));
      if(age==='5-6') list = list.filter(i=>i.ageGroup.startsWith('5'));
      if(age==='7-8') list = list.filter(i=>i.ageGroup.startsWith('7'));
      if(age==='9-10') list = list.filter(i=>i.ageGroup.startsWith('9'));
    }

    // Price filter
    const price = priceWrap ? priceWrap.value : '';
    if(price){
      if(price==='under20') list = list.filter(i=>i.price < 20);
      if(price==='20-40') list = list.filter(i=>i.price >=20 && i.price <= 40);
      if(price==='40-70') list = list.filter(i=>i.price >40 && i.price <=70);
      if(price==='70+') list = list.filter(i=>i.price > 70);
    }

    // Search
    const qtxt = searchBox ? searchBox.value.trim().toLowerCase() : '';
    if(qtxt){ list = list.filter(i=> (i.name||'').toLowerCase().includes(qtxt) || (i.category||'').toLowerCase().includes(qtxt) || (i.description||'').toLowerCase().includes(qtxt)); }

    // Sorting
    const sort = sortSelect ? sortSelect.value : 'featured';
    if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
    if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);
    if(sort==='rating') list.sort((a,b)=>b.rating - a.rating);
    if(sort==='name') list.sort((a,b)=>a.name.localeCompare(b.name));

    renderGrid(list);
  }

  // Wire controls
  if(sortSelect) sortSelect.addEventListener('change', applyFilters);
  if(priceWrap) priceWrap.addEventListener('change', applyFilters);
  if(ageWrap) ageWrap.addEventListener('change', applyFilters);
  if(searchBox) searchBox.addEventListener('input', debounce(()=>applyFilters(),250));

  // initial render
  // If URL provides age or price, set controls
  const paramsInit = new URLSearchParams(location.search);
  const ageParam = paramsInit.get('age'); if(ageParam && ageWrap) ageWrap.value = ageParam;
  const priceParam = paramsInit.get('price'); if(priceParam && priceWrap) priceWrap.value = priceParam;
  const qParam = paramsInit.get('q'); if(qParam && searchBox) searchBox.value = qParam;

  applyFilters();
}

// Debounce helper
function debounce(fn, wait=250){ let t; return (...a)=>{ clearTimeout(t); t = setTimeout(()=>fn(...a), wait); }; }

// Product detail page
function initProductDetail(){
  const pd = q('#pd-title'); if(!pd) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id'); if(!id) return;
  const p = getProductEntries().find(i=>i.id===String(id)); if(!p) return;

  q('#pd-image-img').src = p.image; q('#pd-image-img').alt = p.alt||p.name;
  q('#pd-title').textContent = p.name;
  q('#pd-price').textContent = formatPrice(p.price);
  q('#pd-rating').textContent = p.rating;
  q('#pd-desc').textContent = p.description;
  q('#pd-category').textContent = p.category;
  q('#pd-age').textContent = p.ageGroup;
  q('#pd-availability').textContent = p.availability || 'In stock';
  q('#pd-learning').textContent = p.learningBenefits || '';

  const qty = q('#pd-qty'); if(qty){ qty.value = 1; }
  const add = q('#pd-add'); if(add) add.addEventListener('click', ()=>{ addToCart(p.id, Number(qty.value||1)); });
  const buy = q('#pd-buy'); if(buy) buy.addEventListener('click', ()=>{ addToCart(p.id, Number(qty.value||1)); location.href='cart.html'; });
}

// Cart page rendering
function renderCartPage(){
  const wrap = q('#cart-items'); if(!wrap) return;
  const entries = getProductEntries();
  wrap.innerHTML = '';
  const ids = Object.keys(CART);
  if(ids.length===0){ wrap.innerHTML = '<p class="muted">Your cart is empty. <a href="shop.html">Shop educational toys</a></p>'; q('#subtotal').textContent='$0.00'; q('#shipping').textContent='$0.00'; q('#total').textContent='$0.00'; return; }

  let subtotal = 0;
  ids.forEach(id=>{
    const item = entries.find(e=>e.id===id);
    if(!item) return;
    const qty = CART[id].qty;
    const row = document.createElement('div'); row.className='cart-row';
    const lineTotal = item.price * qty; subtotal += lineTotal;
    row.innerHTML = `
      <div class="left"><img src="${item.image}" alt="${item.alt||item.name}" loading="lazy"></div>
      <div class="info">
        <h4>${item.name}</h4>
        <div class="meta">${item.category} • ${item.ageGroup}</div>
        <div class="controls">
          <button class="qty-btn" data-id="${id}" data-op="dec">-</button>
          <input class="qty-input" data-id="${id}" type="number" min="1" value="${qty}">
          <button class="qty-btn" data-id="${id}" data-op="inc">+</button>
          <button class="remove" data-id="${id}">Remove</button>
        </div>
      </div>
      <div class="price">${formatPrice(item.price)}</div>
      <div class="subtotal">${formatPrice(lineTotal)}</div>
    `;
    wrap.appendChild(row);
  });

  const shipping = subtotal>50 ? 0 : 5.99;
  const total = subtotal + shipping;
  q('#subtotal').textContent = formatPrice(subtotal);
  q('#shipping').textContent = formatPrice(shipping);
  q('#total').textContent = formatPrice(total);

  // wire quantity and remove
  wrap.querySelectorAll('.qty-btn').forEach(b=>b.addEventListener('click',()=>{
    const id = b.dataset.id; const op = b.dataset.op; const current = CART[id] ? CART[id].qty : 0;
    if(op==='inc') setCartQty(id, current+1);
    else setCartQty(id, Math.max(0,current-1));
    renderCartPage();
  }));
  wrap.querySelectorAll('.qty-input').forEach(inp=>inp.addEventListener('change',()=>{ setCartQty(inp.dataset.id, Number(inp.value)||0); renderCartPage(); }));
  wrap.querySelectorAll('.remove').forEach(b=>b.addEventListener('click',()=>{ removeFromCart(b.dataset.id); renderCartPage(); }));
}

// Activities page simple dynamic show
function initActivities(){
  const grid = q('#activities-grid'); if(!grid) return;
  const activities = [
    { id:'a1', title:'Build a Paper Rocket', age:'6-10', difficulty:'Easy', img:'https://images.unsplash.com/photo-1500544121755-1a3f8e6e5bfb?auto=format&fit=crop&w=800&q=80', instructions:'Fold, tape and decorate a paper rocket. Launch with a straw or balloon to explore thrust.' },
    { id:'a2', title:'Count and Sort Challenge', age:'3-6', difficulty:'Easy', img:'https://images.unsplash.com/photo-1585238342020-1f5f09b6d4d1?auto=format&fit=crop&w=800&q=80', instructions:'Use buttons or counters to sort by color and count into groups.' },
    { id:'a3', title:'DIY Solar System', age:'7-10', difficulty:'Medium', img:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80', instructions:'Create planets from foam balls, paint them and arrange by size and distance.' },
    { id:'a4', title:'Color Mixing Experiment', age:'4-8', difficulty:'Easy', img:'https://images.unsplash.com/photo-1517638851339-4aa32003fdf7?auto=format&fit=crop&w=800&q=80', instructions:'Use food coloring and milk or water to watch colors mix and learn primary/secondary colors.' },
    { id:'a5', title:'Animal Memory Game', age:'3-6', difficulty:'Easy', img:'https://images.unsplash.com/photo-1517817748495-3eb7d4d1f0b6?auto=format&fit=crop&w=800&q=80', instructions:'Create matching animal cards and play memory to build concentration and vocabulary.' },
    { id:'a6', title:'Beginner Coding Challenge', age:'6-10', difficulty:'Medium', img:'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80', instructions:'Use sequence cards to plan a route for a toy to follow. Test and improve the sequence.' }
  ];
  activities.forEach(a=>{
    const card = document.createElement('article'); card.className='activity-card';
    card.innerHTML = `
      <img src="${a.img}" alt="${a.title}">
      <h4>${a.title}</h4>
      <div class="meta">Age ${a.age} • ${a.difficulty}</div>
      <p class="small">${a.instructions.substring(0,90)}${a.instructions.length>90?'...':''}</p>
      <div class="actions"><button class="btn view-act" data-id="${a.id}">View Activity</button></div>
      <div class="act-detail" id="detail-${a.id}" style="display:none;padding:12px;border-radius:8px;background:#fff;margin-top:8px;box-shadow:0 4px 12px rgba(0,0,0,0.06)">${a.instructions}</div>
    `;
    grid.appendChild(card);
  });
  grid.querySelectorAll('.view-act').forEach(b=>b.addEventListener('click',()=>{
    const id = b.dataset.id; const d = q(`#detail-${id}`); if(!d) return; d.style.display = d.style.display==='none'?'block':'none';
    d.scrollIntoView({behavior:'smooth',block:'center'});
  }));
}

// Contact form
function initContact(){
  const form = q('#contact-form'); if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = q('#c-name').value.trim();
    const email = q('#c-email').value.trim();
    const subj = q('#c-subject').value.trim();
    const msg = q('#c-message').value.trim();
    const feedback = q('#contact-feedback');
    feedback.textContent='';
    feedback.style.color='red';
    if(!name){ feedback.textContent='Please enter your name.'; return; }
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ feedback.textContent='Please enter a valid email address.'; return; }
    if(!msg){ feedback.textContent='Please enter a message.'; return; }
    // success
    feedback.style.color = 'green'; feedback.textContent = 'Thanks! Your message has been received.';
    form.reset();
  });
}

// Newsletter
function initNewsletter(){
  const form = q('#newsletter-form'); if(!form) return;
  const input = q('#newsletter-email'); const fb = q('#newsletter-feedback');
  form.addEventListener('submit', e=>{ e.preventDefault(); fb.textContent=''; const em = (input.value||'').trim(); if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){ fb.textContent='Please enter a valid email address.'; fb.style.color='red'; return; } fb.style.color='green'; fb.textContent = "You're subscribed!"; input.value=''; });
}

// Contact form init wrapper
function initAll(){
  loadCart();
  renderFeatured();
  renderCategories();
  initProductsPage();
  initProductDetail();
  renderCartPage();
  initActivities();
  initContact();
  initNewsletter();
}

// DOM ready
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', initAll);
}else initAll();
