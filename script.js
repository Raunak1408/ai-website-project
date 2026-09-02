// script.js - e-commerce functionality for toy site
// Uses window.PRODUCTS (data.js)

// Utility
function q(sel, ctx=document){ return ctx.querySelector(sel); }
function qAll(sel, ctx=document){ return Array.from((ctx||document).querySelectorAll(sel)); }

const CART_KEY = 'toy_cart_v1';
let cart = {};

function loadCart(){
  try{ cart = JSON.parse(localStorage.getItem(CART_KEY)) || {}; }catch(e){ cart = {}; }
  updateCartCount();
}
function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){ const count = Object.values(cart).reduce((s,i)=>s+(i.qty||0),0); qAll('.cart-count').forEach(el=>el.textContent = count); }

function addToCart(id, qty=1){ id = String(id); cart[id] = cart[id] || { id: id, qty:0, productId: id }; cart[id].qty += Number(qty); saveCart(); flashMessage('Added to cart'); }
function setCartQty(id, qty){ id=String(id); if(!cart[id]) return; cart[id].qty = Number(qty); if(cart[id].qty<=0) delete cart[id]; saveCart(); }
function removeFromCart(id){ id=String(id); delete cart[id]; saveCart(); }

function flashMessage(ms){ const el = document.createElement('div'); el.className='toast'; el.textContent = ms; Object.assign(el.style,{position:'fixed',right:'12px',bottom:'12px',background:'#002e63',color:'#fff',padding:'10px 14px',borderRadius:'10px',zIndex:9999}); document.body.appendChild(el); setTimeout(()=>el.style.opacity=0,1400); setTimeout(()=>el.remove(),2000); }

// Render features
function priceFormat(n){ return '$'+(n/100).toFixed(2); }

function renderFeatured(){ const el = q('#featured-grid'); if(!el) return; // take top rated 6
  const items = (window.PRODUCTS||[]).slice().sort((a,b)=>b.rating-a.rating).slice(0,6);
  el.innerHTML=''; items.forEach(p=>{
    const card = document.createElement('div'); card.className='product-card';
    card.innerHTML = `<a class="prod-link" href="product-detail.html?id=${p.id}"><img src="${p.image}" alt="${p.alt || p.name}"></a><h4>${p.name}</h4><div class="small">${p.category} • ${p.ageGroup}</div><div class="price">${priceFormat(p.price)}</div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn add-cart" data-id="${p.id}">Add to Cart</button><a class="btn" href="product-detail.html?id=${p.id}">View Details</a></div>`;
    el.appendChild(card);
  });
}

// Category buttons (home)
qAll('.cat-btn').forEach(btn=> btn.addEventListener('click', ()=> { const cat = btn.dataset.cat; location.href = `products.html?category=${encodeURIComponent(cat)}`; }));

// Newsletter form
const newsForm = q('#newsletter-form'); if(newsForm){ newsForm.addEventListener('submit', e=>{ e.preventDefault(); const email = q('#newsletter-email').value.trim(); const fb = q('#newsletter-feedback'); if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ fb.textContent='Please enter a valid email.'; fb.style.color='crimson'; return; } fb.textContent='Thanks! You are subscribed.'; fb.style.color='green'; newsForm.reset(); } ); }

// PRODUCTS page rendering, filtering & sorting
function initProductsPage(){
  const grid = q('#products-grid'); if(!grid) return;
  const filters = { category: null, age: null, price: null, q: '', sort: 'featured' };

  const params = new URLSearchParams(location.search);
  if(params.get('category')) filters.category = decodeURIComponent(params.get('category'));
  if(params.get('q')) filters.q = params.get('q');

  function applyFilters(){
    let items = (window.PRODUCTS||[]).slice();
    if(filters.category && filters.category!=='All') items = items.filter(i=>i.category===filters.category);
    if(filters.age && filters.age!=='All'){
      if(filters.age==='0-3') items = items.filter(i=>i.ageGroup.includes('0')||i.ageGroup.includes('1')||i.ageGroup.includes('2')||i.ageGroup.includes('3'));
      if(filters.age==='4-6') items = items.filter(i=>i.ageGroup.includes('4')||i.ageGroup.includes('5')||i.ageGroup.includes('6'));
      if(filters.age==='7-9') items = items.filter(i=>i.ageGroup.includes('7')||i.ageGroup.includes('8')||i.ageGroup.includes('9'));
      if(filters.age==='10+') items = items.filter(i=>i.ageGroup.includes('10')||i.ageGroup.includes('+'));
    }
    if(filters.price){ if(filters.price==='under20') items = items.filter(i=>i.price<=2000); if(filters.price==='20-50') items = items.filter(i=>i.price>2000 && i.price<=5000); if(filters.price==='over50') items = items.filter(i=>i.price>5000); }
    if(filters.q) items = items.filter(i=> (i.name+i.description+i.category).toLowerCase().includes(filters.q.toLowerCase()));

    // sort
    if(filters.sort==='price-asc') items.sort((a,b)=>a.price-b.price);
    if(filters.sort==='price-desc') items.sort((a,b)=>b.price-a.price);
    if(filters.sort==='rating-desc') items.sort((a,b)=>b.rating-b.rating?b.rating-a.rating:0);
    if(filters.sort==='name-asc') items.sort((a,b)=>a.name.localeCompare(b.name));

    grid.innerHTML='';
    if(items.length===0){ grid.innerHTML='<p class="muted">No products match the selected filters.</p>'; return; }
    items.forEach(p=>{
      const card = document.createElement('div'); card.className='product-card';
      card.innerHTML = `<img src="${p.image}" alt="${p.alt || p.name}"><h4>${p.name}</h4><div class="small">${p.category} • ${p.ageGroup}</div><div class="price">${priceFormat(p.price)}</div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn add-cart" data-id="${p.id}">Add to Cart</button><a class="btn" href="product-detail.html?id=${p.id}">View Details</a></div>`;
      grid.appendChild(card);
    });

    // wire add buttons
    qAll('.add-cart').forEach(b=> b.addEventListener('click', e=>{ addToCart(b.dataset.id,1); }));
  }

  // form controls
  const sortSelect = q('#sort-select'); if(sortSelect){ sortSelect.addEventListener('change', e=>{ filters.sort = sortSelect.value; applyFilters(); }); }
  const searchBox = q('#search-box'); if(searchBox){ searchBox.addEventListener('input', e=>{ filters.q = searchBox.value; applyFilters(); }); }

  // build category list
  const catWrap = q('#filter-categories'); if(catWrap){ const cats = Array.from(new Set((window.PRODUCTS||[]).map(p=>p.category))); catWrap.innerHTML = `<label>Category</label>`; cats.unshift('All'); cats.forEach(c=>{ const btn = document.createElement('button'); btn.className='cat-btn'; btn.textContent=c; btn.addEventListener('click', ()=>{ filters.category = c; applyFilters(); }); catWrap.appendChild(btn); }); }

  applyFilters();
}

// Product Detail page
function initProductDetail(){ const id = new URLSearchParams(location.search).get('id'); if(!id) return; const p = (window.PRODUCTS||[]).find(x=>String(x.id)===String(id)); if(!p) return; q('#pd-image-img').src = p.image; q('#pd-image-img').alt = p.alt||p.name; q('#pd-title').textContent = p.name; q('#pd-price').textContent = priceFormat(p.price); q('#pd-desc').textContent = p.description; q('#pd-category').textContent = p.category; q('#pd-age').textContent = p.ageGroup; q('#pd-availability').textContent = 'In stock';
  const qtyInput = q('input#pd-qty'); q('#pd-increase').addEventListener('click', ()=>{ qtyInput.value = Number(qtyInput.value||1)+1; }); q('#pd-decrease').addEventListener('click', ()=>{ qtyInput.value = Math.max(1, Number(qtyInput.value||1)-1); });
  q('#pd-add').addEventListener('click', ()=>{ addToCart(p.id, Number(qtyInput.value||1)); });
  q('#pd-buy').addEventListener('click', ()=>{ addToCart(p.id, Number(qtyInput.value||1)); location.href='cart.html'; });
}

// Cart page rendering
function renderCartPage(){ const wrap = q('#cart-items'); if(!wrap) return; wrap.innerHTML=''; const ids = Object.keys(cart); if(ids.length===0){ wrap.innerHTML = '<p>Your cart is empty.</p>'; q('#subtotal').textContent='Subtotal: $0'; q('#shipping').textContent='Shipping: $0'; q('#total').textContent='Total: $0'; return; }
  let subtotal = 0; ids.forEach(id=>{ const item = cart[id]; const p = (window.PRODUCTS||[]).find(x=>String(x.id)===String(item.id)); if(!p) return; const row = document.createElement('div'); row.className='cart-row'; row.innerHTML = `<img src="${p.image}" alt="${p.alt || p.name}" style="width:72px;height:72px;object-fit:cover;border-radius:8px"><div><strong>${p.name}</strong><div class="small">${p.category}</div></div><div style="margin-left:auto">${priceFormat(p.price)} x <input type="number" min="1" value="${item.qty}" data-id="${id}" style="width:56px"> <div class="small">Subtotal: ${priceFormat(p.price*item.qty)}</div><button class="btn remove" data-id="${id}">Remove</button></div>`;
    wrap.appendChild(row);
    subtotal += p.price * item.qty;
  });
  q('#subtotal').textContent = 'Subtotal: '+priceFormat(subtotal);
  const shipping = subtotal>5000 || subtotal===0 ? 0 : 499; q('#shipping').textContent='Shipping: '+priceFormat(shipping);
  q('#total').textContent = 'Total: '+priceFormat(subtotal+shipping);

  // wire inputs & remove
  qAll('#cart-items input[type="number"]').forEach(inp=> inp.addEventListener('change', ()=>{ setCartQty(inp.dataset.id, Math.max(1, Number(inp.value||1))); renderCartPage(); }));
  qAll('#cart-items .remove').forEach(b=> b.addEventListener('click', ()=>{ removeFromCart(b.dataset.id); renderCartPage(); }));
}

// Checkout demo
function initCheckout(){ const btn = q('#checkout'); if(!btn) return; btn.addEventListener('click', ()=>{ const fb = q('#cart-feedback'); fb.textContent = 'Checkout demo — your order is ready.'; fb.style.color='green'; }); }

// Contact form validate
function initContact(){ const form = q('#contact-form'); if(!form) return; form.addEventListener('submit', e=>{ e.preventDefault(); const name = q('#c-name').value.trim(); const email = q('#c-email').value.trim(); const msg = q('#c-message').value.trim(); const fb = q('#contact-feedback'); if(!name||!email||!msg){ fb.textContent='Please fill all fields.'; fb.style.color='crimson'; return; } if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ fb.textContent='Please enter a valid email.'; fb.style.color='crimson'; return; } fb.textContent='Thanks! Your message has been received.'; fb.style.color='green'; form.reset(); }); }

// Accessible nav toggle
function initNavToggle(){ const toggle = q('.nav-toggle'); const nav = q('#main-navigation'); if(!toggle||!nav) return; const setState = ()=>{
    if(window.innerWidth<=680){ nav.setAttribute('aria-hidden','true'); toggle.setAttribute('aria-expanded','false'); }
    else { nav.setAttribute('aria-hidden','false'); toggle.setAttribute('aria-expanded','true'); }
  };
  toggle.addEventListener('click', ()=>{ const hidden = nav.getAttribute('aria-hidden')==='true'; nav.setAttribute('aria-hidden', hidden? 'false' : 'true'); toggle.setAttribute('aria-expanded', hidden? 'true' : 'false'); });
  window.addEventListener('resize', setState);
  setState();
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', ()=>{
  loadCart();
  renderFeatured();
  initProductsPage();
  initProductDetail();
  renderCartPage();
  initCheckout();
  initContact();
  initNavToggle();
});
