// script.js - e-commerce functionality for toys site
// Uses window.PRODUCTS (defined in data.js)

// Utility
function q(sel, ctx=document) { return ctx.querySelector(sel); }
function qAll(sel, ctx=document) { return Array.from((ctx||document).querySelectorAll(sel)); }

// Cart storage
const CART_KEY = 'toy_cart_v1';
let cart = {}; // {productId: qty}

function loadCart(){
  try{
    cart = JSON.parse(localStorage.getItem(CART_KEY)) || {};
  }catch(e){ cart = {}; }
  updateCartCount();
}
function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){
  const count = Object.values(cart).reduce((s,n)=>s+Number(n||0),0);
  qAll('.cart-count').forEach(el=> el.textContent = count);
}

function addToCart(id, qty=1){
  id = String(id);
  cart[id] = (cart[id] ? Number(cart[id]) : 0) + Number(qty);
  saveCart();
  flashMessage('Added to cart');
}
function setCartQty(id, qty){ id=String(id); if(qty<=0){ delete cart[id]; } else cart[id]=Number(qty); saveCart(); }
function removeFromCart(id){ id=String(id); delete cart[id]; saveCart(); }

function flashMessage(msg){
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  Object.assign(el.style,{position:'fixed',right:'20px',bottom:'20px',background:'#ffd54f',color:'#002e63',padding:'10px 14px',borderRadius:'6px',boxShadow:'0 4px 12px rgba(0,0,0,0.15)',zIndex:9999});
  document.body.appendChild(el);
  setTimeout(()=> el.style.opacity='0',1400);
  setTimeout(()=> el.remove(),2000);
}

// Rendering helpers
function priceFormat(n){ return '₹' + Number(n).toLocaleString(); }

// Render featured on index.html
function renderFeatured(){
  const grid = q('#featured-grid');
  if(!grid || !window.PRODUCTS) return;
  grid.innerHTML = '';
  const items = window.PRODUCTS.slice(0,8);
  items.forEach(p=>{
    const card = document.createElement('div'); card.className='feature-card';
    card.innerHTML = `
      <a href="product-detail.html?id=${p.id}" class="card-link">
        <img src="${p.image}" alt="${p.name}" />
        <h4>${p.name}</h4>
      </a>
      <div class="card-bottom">
        <div class="price">${priceFormat(p.price)}</div>
        <button class="btn add-cart" data-id="${p.id}">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Generic product card generator
function createProductCard(p){
  const el = document.createElement('div'); el.className='product-card';
  el.innerHTML = `
    <a href="product-detail.html?id=${p.id}" class="prod-link">
      <img src="${p.image}" alt="${p.name}" />
      <h4>${p.name}</h4>
    </a>
    <div class="prod-meta">
      <div class="price">${priceFormat(p.price)}</div>
      <div class="rating">⭐ ${p.rating}</div>
    </div>
    <div class="prod-actions">
      <button class="btn add-cart" data-id="${p.id}">Add to Cart</button>
    </div>
  `;
  return el;
}

// Products page rendering with filters & sort
function initProductsPage(){
  const container = q('#products-grid');
  if(!container) return;
  // Populate filters
  const categories = Array.from(new Set(window.PRODUCTS.map(p=>p.category)));
  const catWrap = q('#filter-categories');
  categories.forEach(cat=>{
    const id = 'cat-'+cat.replace(/\s+/g,'-');
    const item = document.createElement('label'); item.className='filter-item';
    item.innerHTML = `<input type="checkbox" value="${cat}" /> ${cat}`;
    catWrap.appendChild(item);
  });
  // Price range default
  const prices = window.PRODUCTS.map(p=>p.price);
  const maxPrice = Math.max(...prices);
  const priceRange = q('#price-range');
  const priceVal = q('#price-value');
  priceRange.max = Math.ceil(maxPrice);
  priceRange.value = priceRange.max;
  priceVal.textContent = priceFormat(priceRange.value);
  priceRange.addEventListener('input', ()=>{ priceVal.textContent = priceFormat(priceRange.value); renderProducts(); });

  // Age groups
  const ageSet = Array.from(new Set(window.PRODUCTS.map(p=>p.ageGroup)));
  const ageSelect = q('#age-select');
  ageSelect.innerHTML = '<option value="all">All ages</option>' + ageSet.map(a=>`<option value="${a}">${a}</option>`).join('');
  ageSelect.addEventListener('change', renderProducts);

  // Sort
  q('#sort-select').addEventListener('change', renderProducts);

  // Category checkboxes change
  catWrap.querySelectorAll('input[type=checkbox]').forEach(cb=> cb.addEventListener('change', renderProducts));

  renderProducts();

  // delegate add to cart
  container.addEventListener('click', (e)=>{
    if(e.target.closest('.add-cart')){
      const id = e.target.closest('.add-cart').dataset.id; addToCart(Number(id),1);
    }
  });
}

function renderProducts(){
  const container = q('#products-grid');
  if(!container) return;
  let items = window.PRODUCTS.slice();
  // filters
  const checkedCats = qAll('#filter-categories input:checked').map(i=>i.value);
  if(checkedCats.length) items = items.filter(p=> checkedCats.includes(p.category));
  const maxPrice = Number(q('#price-range').value || Infinity);
  items = items.filter(p=> p.price <= maxPrice);
  const age = q('#age-select').value;
  if(age && age!=='all') items = items.filter(p=> p.ageGroup === age);

  // sort
  const sort = q('#sort-select').value;
  if(sort==='price-asc') items.sort((a,b)=>a.price-b.price);
  if(sort==='price-desc') items.sort((a,b)=>b.price-a.price);
  if(sort==='popularity') items.sort((a,b)=>b.rating-b.rating ? b.rating-a.rating : b.price-a.price);

  container.innerHTML = '';
  if(items.length===0){ container.innerHTML = '<p class="muted">No products match the selected filters.</p>'; return; }
  items.forEach(p=> container.appendChild(createProductCard(p)));
}

// Product detail page
function initProductDetail(){
  const wrap = q('#product-detail');
  if(!wrap) return;
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id')) || null;
  const product = window.PRODUCTS.find(p=>p.id===id);
  if(!product){ wrap.innerHTML = '<p>Product not found.</p>'; return; }

  q('#pd-image').src = product.image;
  q('#pd-title').textContent = product.name;
  q('#pd-price').textContent = priceFormat(product.price);
  q('#pd-desc').textContent = product.description;
  q('#pd-age').textContent = product.ageGroup;
  q('#pd-availability').textContent = 'In stock';

  // thumbnails
  const thumbs = q('#pd-thumbs');
  thumbs.innerHTML = '';
  const images = [product.image].concat(product.relatedImages || []);
  images.slice(0,4).forEach(src=>{
    const im = document.createElement('img'); im.src=src; im.alt='thumb'; im.className='thumb';
    im.addEventListener('click', ()=> q('#pd-image').src = src);
    thumbs.appendChild(im);
  });

  // related
  const rel = q('#related-list');
  rel.innerHTML = '';
  const related = window.PRODUCTS.filter(p=> p.category===product.category && p.id!==product.id).slice(0,4);
  related.forEach(r=> rel.appendChild(createProductCard(r)));

  // quantity and buttons
  q('#pd-add').addEventListener('click', ()=>{ const qty = Number(q('#pd-qty').value||1); addToCart(product.id, qty); });
  q('#pd-buy').addEventListener('click', ()=>{ const qty = Number(q('#pd-qty').value||1); addToCart(product.id, qty); location.href='cart.html'; });
}

// Cart page
function renderCartPage(){
  const wrap = q('#cart-items');
  if(!wrap) return;
  wrap.innerHTML = '';
  const ids = Object.keys(cart);
  if(ids.length===0){ wrap.innerHTML = '<p class="muted">Your cart is empty.</p>'; q('#cart-summary').style.display='none'; return; }
  q('#cart-summary').style.display='block';
  let subtotal=0;
  ids.forEach(id=>{
    const p = window.PRODUCTS.find(x=>String(x.id)===String(id));
    const qty = Number(cart[id]);
    if(!p) return;
    subtotal += p.price * qty;
    const row = document.createElement('div'); row.className='cart-row';
    row.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <div class="cart-info">
        <a href="product-detail.html?id=${p.id}"><h4>${p.name}</h4></a>
        <div>${priceFormat(p.price)}</div>
      </div>
      <div class="cart-qty">
        <button class="qty-btn" data-id="${p.id}" data-op="dec">-</button>
        <input type="number" min="1" value="${qty}" data-id="${p.id}" class="qty-input" />
        <button class="qty-btn" data-id="${p.id}" data-op="inc">+</button>
      </div>
      <div class="cart-line">${priceFormat(p.price * qty)}</div>
      <button class="btn remove" data-id="${p.id}">Remove</button>
    `;
    wrap.appendChild(row);
  });
  q('#subtotal').textContent = priceFormat(subtotal);
  const shipping = subtotal>2000 ? 0 : 49; // simple rule
  q('#shipping').textContent = shipping===0 ? 'Free' : priceFormat(shipping);
  q('#total').textContent = priceFormat(subtotal + (shipping||0));

  // events: qty buttons, inputs, remove
  wrap.querySelectorAll('.qty-btn').forEach(btn=> btn.addEventListener('click', (e)=>{
    const id = e.target.dataset.id; const op = e.target.dataset.op;
    const cur = Number(cart[id]||0);
    if(op==='inc') setCartQty(id, cur+1);
    if(op==='dec') setCartQty(id, Math.max(0, cur-1));
    renderCartPage();
  }));
  wrap.querySelectorAll('.qty-input').forEach(inp=> inp.addEventListener('change', (e)=>{
    const id = e.target.dataset.id; const val = Math.max(0, Number(e.target.value||0));
    if(val===0) removeFromCart(id); else setCartQty(id, val);
    renderCartPage();
  }));
  wrap.querySelectorAll('.remove').forEach(btn=> btn.addEventListener('click', (e)=>{
    removeFromCart(e.target.dataset.id); renderCartPage();
  }));
}

// Contact form
function initContact(){
  const form = q('#contact-form');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = q('#c-name').value.trim();
    const email = q('#c-email').value.trim();
    const msg = q('#c-message').value.trim();
    if(!name || !email || !msg){ alert('Please fill all fields.'); return; }
    if(!/^\S+@\S+\.\S+$/.test(email)){ alert('Please enter a valid email.'); return; }
    // fake submit
    alert('Thanks ' + name + '! Your message has been received.');
    form.reset();
  });
}

// Navbar cart links live update and add-to-cart delegation
function initGlobalBindings(){
  document.body.addEventListener('click', (e)=>{
    const btn = e.target.closest('.add-cart');
    if(btn){ const id = btn.dataset.id; addToCart(Number(id),1); }
  });
}

// Init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', ()=>{
  loadCart();
  initGlobalBindings();
  renderFeatured();
  initProductsPage();
  initProductDetail();
  renderCartPage();
  initContact();
});
