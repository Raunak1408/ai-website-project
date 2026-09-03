// WonderBox Kids - site script (handles multiple pages)
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

function formatPrice(n){return '$' + n.toFixed(2)}

// storage keys
const CART_KEY = 'wb_cart';
const WISH_KEY = 'wb_wishlist';

function getCart(){return JSON.parse(localStorage.getItem(CART_KEY) || '[]')}
function saveCart(c){localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCounters()}
function getWish(){return JSON.parse(localStorage.getItem(WISH_KEY) || '[]')}
function saveWish(w){localStorage.setItem(WISH_KEY, JSON.stringify(w)); updateCounters()}

function updateCounters(){
  const cart = getCart(); const wish = getWish();
  $all('#cart-count, #cart-count-2, #cart-count')?.forEach?.(el=>{});
  const cc = document.querySelectorAll('#cart-count');
  cc.forEach(el=>el.textContent = cart.reduce((s,i)=>s+i.qty,0));
  const wc = document.querySelectorAll('#wish-count');
  wc.forEach(el=>el.textContent = wish.length);
}

// helper to select multiple safely for older pages
function $all(sel){try{return $$(sel)}catch(e){return []}}

function findProductById(id){return (window.WB_PRODUCTS||[]).find(p=>p.id===id)}

// render helpers
function renderProductsList(containerId, list){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('div'); card.className='product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div class="meta">${p.category} • ${p.age} • ⭐ ${p.rating}</div>
      <p>${p.description}</p>
      <div class="card-actions">
        <div class="price">${formatPrice(p.price)}</div>
        <div style="margin-left:auto">
          <a class="btn outline" href="product.html?id=${encodeURIComponent(p.id)}">View</a>
          <button class="btn add-cart" data-id="${p.id}">Add</button>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

// index featured
function initIndex(){
  document.getElementById('year').textContent = new Date().getFullYear();
  const featured = (window.WB_PRODUCTS||[]).slice(0,4);
  renderProductsList('featured-grid', featured);
}

// products page behavior
function initProducts(){
  document.getElementById('year').textContent = new Date().getFullYear();
  const products = window.WB_PRODUCTS || [];
  // populate categories
  const cats = Array.from(new Set(products.map(p=>p.category)));
  const catSel = $('#filter-category');
  cats.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;catSel.appendChild(o)});

  const state = {list:products.slice(), filtered:products.slice()};

  function applyFilters(){
    const q = ($('#search-input').value||'').trim().toLowerCase();
    const cat = $('#filter-category').value;
    const age = $('#filter-age').value;
    const price = $('#filter-price').value;
    const sort = $('#sort-select').value;
    let list = products.slice();
    if(q) list = list.filter(p=> (p.name+p.description).toLowerCase().includes(q));
    if(cat && cat!=='All') list = list.filter(p=>p.category===cat);
    if(age && age!=='All') list = list.filter(p=>p.age===age);
    if(price && price!=='All'){ const [min,max]=price.split('-').map(Number); list=list.filter(p=>p.price>=min && p.price<=(max||9999)); }
    if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
    if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);
    if(sort==='rating-desc') list.sort((a,b)=>b.rating-b.rating);
    state.filtered = list;
    $('#results-count').textContent = `${list.length} results`;
    renderProductsList('products-grid', list);
  }

  // events
  ['change','input'].forEach(evt=>{
    $('#search-input').addEventListener('input', applyFilters);
    $('#filter-category').addEventListener('change', applyFilters);
    $('#filter-age').addEventListener('change', applyFilters);
    $('#filter-price').addEventListener('change', applyFilters);
    $('#sort-select').addEventListener('change', applyFilters);
  });
  $('#clear-filters').addEventListener('click', ()=>{ $('#search-input').value=''; $('#filter-category').value='All'; $('#filter-age').value='All'; $('#filter-price').value='All'; $('#sort-select').value='relevance'; applyFilters(); });

  applyFilters();
}

// product detail
function initProduct(){
  document.getElementById('year').textContent = new Date().getFullYear();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const p = findProductById(id);
  const container = $('#product-detail');
  if(!p){ container.innerHTML = '<p>Product not found.</p>'; return; }
  container.innerHTML = `
    <div class="product-card" style="box-shadow:none">
      <img src="${p.image}" alt="${p.name}" style="height:320px;object-fit:cover">
      <h2>${p.name}</h2>
      <div class="meta">${p.category} • ${p.age} • ⭐ ${p.rating}</div>
      <p>${p.description}</p>
      <div style="display:flex;gap:12px;align-items:center;margin-top:12px">
        <div class="price" style="font-size:20px">${formatPrice(p.price)}</div>
        <div style="margin-left:auto">
          <button class="btn" id="add-to-cart" data-id="${p.id}">Add to cart</button>
          <button class="btn outline" id="add-to-wish" data-id="${p.id}">Add to wishlist</button>
        </div>
      </div>
    </div>`;

  $('#add-to-cart').addEventListener('click', ()=>{ addToCart(p.id); alert('Added to cart') });
  $('#add-to-wish').addEventListener('click', ()=>{ addToWish(p.id); alert('Added to wishlist') });
}

// cart page
function renderCartPage(){
  document.getElementById('year').textContent = new Date().getFullYear();
  const container = $('#cart-items');
  const cart = getCart();
  container.innerHTML = '';
  if(cart.length===0){ container.innerHTML = '<p>Your cart is empty.</p>'; $('#cart-total').textContent = 'Total: $0.00'; return; }
  let total = 0;
  cart.forEach(item=>{
    const p = findProductById(item.id); if(!p) return;
    total += p.price * item.qty;
    const div = document.createElement('div'); div.className='cart-item';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div style="flex:1">
        <strong>${p.name}</strong>
        <div class="meta">${p.category} • ${p.age}</div>
        <div>${formatPrice(p.price)} x <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="qty" style="width:60px"></div>
      </div>
      <div>
        <div>${formatPrice(p.price * item.qty)}</div>
        <button class="btn outline remove" data-id="${item.id}">Remove</button>
      </div>`;
    container.appendChild(div);
  });
  $('#cart-total').textContent = 'Total: ' + formatPrice(total);

  // qty and remove handlers
  container.querySelectorAll('.qty').forEach(inp=>{
    inp.addEventListener('change', e=>{
      const id = e.target.dataset.id; const q = Math.max(1,parseInt(e.target.value)||1);
      const cart = getCart(); const idx = cart.findIndex(i=>i.id===id); if(idx>-1){ cart[idx].qty=q; saveCart(cart); renderCartPage(); }
    });
  });
  container.querySelectorAll('.remove').forEach(btn=>btn.addEventListener('click', e=>{
    const id = e.target.dataset.id; let cart = getCart(); cart = cart.filter(i=>i.id!==id); saveCart(cart); renderCartPage();
  }));
}

function checkout(){ if(confirm('Proceed to checkout?')){ localStorage.removeItem(CART_KEY); updateCounters(); renderCartPage(); alert('Thank you! This demo clears the cart.'); }}

// wishlist page
function renderWishPage(){
  document.getElementById('year').textContent = new Date().getFullYear();
  const container = $('#wish-items');
  const wish = getWish();
  container.innerHTML = '';
  if(wish.length===0){ container.innerHTML = '<p>Your wishlist is empty.</p>'; return; }
  wish.forEach(id=>{
    const p = findProductById(id); if(!p) return;
    const div = document.createElement('div'); div.className='product-card';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div class="meta">${p.category} • ${p.age}</div>
      <div class="card-actions">
        <div class="price">${formatPrice(p.price)}</div>
        <div style="margin-left:auto">
          <button class="btn" data-id="${p.id}" data-action="move">Add to cart</button>
          <button class="btn outline" data-id="${p.id}" data-action="remove">Remove</button>
        </div>
      </div>`;
    container.appendChild(div);
  });

  container.querySelectorAll('button[data-action]').forEach(btn=>btn.addEventListener('click', e=>{
    const id=e.target.dataset.id; const action=e.target.dataset.action;
    if(action==='move'){ addToCart(id); let w=getWish(); w=w.filter(x=>x!==id); saveWish(w); renderWishPage(); alert('Moved to cart'); }
    if(action==='remove'){ let w=getWish(); w=w.filter(x=>x!==id); saveWish(w); renderWishPage(); }
  }));
}

// categories
function initCategories(){ document.getElementById('year').textContent = new Date().getFullYear(); const cats = Array.from(new Set((window.WB_PRODUCTS||[]).map(p=>p.category))); const container = $('#categories-list'); cats.forEach(c=>{ const d=document.createElement('div'); d.className='category-card'; d.innerHTML=`<h4>${c}</h4><p><a href="products.html?cat=${encodeURIComponent(c)}" class="btn outline">View</a></p>`; container.appendChild(d); }); }

// contact form
function initContact(){ document.getElementById('year').textContent = new Date().getFullYear(); const form = $('#contact-form'); if(!form) return; form.addEventListener('submit', e=>{ e.preventDefault(); const name = $('#c-name').value.trim(); const email = $('#c-email').value.trim(); const msg = $('#c-message').value.trim(); if(!name||!email||!msg){ $('#contact-feedback').textContent='Please fill all fields.'; return; } const list = JSON.parse(localStorage.getItem('wb_contacts')||'[]'); list.push({name,email,msg,when:new Date().toISOString()}); localStorage.setItem('wb_contacts', JSON.stringify(list)); form.reset(); $('#contact-feedback').textContent='Thanks — we received your message.'; }); }

// add helpers
function addToCart(id, qty=1){ const cart = getCart(); const idx = cart.findIndex(i=>i.id===id); if(idx>-1){ cart[idx].qty += qty; } else cart.push({id, qty}); saveCart(cart); }
function addToWish(id){ const w = getWish(); if(!w.includes(id)){ w.push(id); saveWish(w); } }

// wire add buttons present on product lists
function attachListHandlers(){ document.body.addEventListener('click', e=>{
  const t = e.target;
  if(t.matches('.add-cart')){ addToCart(t.dataset.id); alert('Added to cart'); }
}); }

// initial router
function routeInit(){ updateCounters(); attachListHandlers(); const page = document.body.dataset.page; if(page==='index') initIndex(); if(page==='products') initProducts(); if(page==='product') initProduct(); if(page==='cart') { renderCartPage(); $('#checkout').addEventListener('click', checkout); } if(page==='wishlist') renderWishPage(); if(page==='categories') initCategories(); if(page==='contact') initContact(); }

// run
document.addEventListener('DOMContentLoaded', routeInit);
