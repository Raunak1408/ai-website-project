// Core product data and shared site logic
const PRODUCTS = [
  {id:1,title:'Nova Mechanical Keyboard',category:'Keyboards',price:109.99,img:'https://images.unsplash.com/photo-1559628233-8aa9b5b4c0d1?q=80&w=1200&auto=format&fit=crop',q:1},
  {id:2,title:'RGB Sensor Gaming Mouse',category:'Mouse',price:59.99,img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',q:1},
  {id:3,title:'Pulse Wireless Headset',category:'Headsets',price:129.99,img:'https://images.unsplash.com/photo-1585386959984-a415522e34f6?q=80&w=1200&auto=format&fit=crop',q:1},
  {id:4,title:'Titan Controller',category:'Controllers',price:79.99,img:'https://images.unsplash.com/photo-1606813902864-7c3d9a3d9cd6?q=80&w=1200&auto=format&fit=crop',q:1},
  {id:5,title:'Glide Pro Mouse',category:'Mouse',price:49.99,img:'https://images.unsplash.com/photo-1526178619460-3c88a6b19d27?q=80&w=1200&auto=format&fit=crop',q:1},
  {id:6,title:'Stealth Silent Keyboard',category:'Keyboards',price:139.99,img:'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop',q:1},
  {id:7,title:'Echo Gaming Headset',category:'Headsets',price:89.99,img:'https://images.unsplash.com/photo-1592503252860-3f4d9f4f3f0f?q=80&w=1200&auto=format&fit=crop',q:1},
  {id:8,title:'Arcade Wired Controller',category:'Controllers',price:59.99,img:'https://images.unsplash.com/photo-1581368519081-4b3b6f6b8b27?q=80&w=1200&auto=format&fit=crop',q:1},
  {id:9,title:'Pro Gamer Mousepad',category:'Accessories',price:19.99,img:'https://images.unsplash.com/photo-1602524207179-8be6f9b9c8b2?q=80&w=1200&auto=format&fit=crop',q:1}
];

const STORAGE_CART = 'gg_cart';
const STORAGE_WISH = 'gg_wishlist';

function readStorage(key){try{return JSON.parse(localStorage.getItem(key))||[];}catch(e){return []}}
function writeStorage(key,val){localStorage.setItem(key,JSON.stringify(val))}

function updateBadges(){const cart = readStorage(STORAGE_CART); const wish = readStorage(STORAGE_WISH);
  const cartCount = cart.reduce((s,i)=>s+i.qty,0); const wishCount = wish.length;
  const elCart = document.getElementById('cartCount'); const elWish = document.getElementById('wishCount');
  if(elCart) elCart.textContent = cartCount;
  if(elWish) elWish.textContent = wishCount;
}

// Mobile nav toggle
function initNavToggle(){const btn = document.getElementById('navToggle'); const nav = document.getElementById('siteNav');
  if(!btn||!nav) return; btn.addEventListener('click',()=>nav.classList.toggle('open'));
}

// Add to cart
function addToCart(id, qty=1){const cart = readStorage(STORAGE_CART); const prod = PRODUCTS.find(p=>p.id==id); if(!prod) return;
  const existing = cart.find(i=>i.id==id);
  if(existing){existing.qty = Math.max(1, existing.qty + qty)}else{cart.push({id:prod.id,title:prod.title,price:prod.price,img:prod.img,qty:qty})}
  writeStorage(STORAGE_CART,cart); updateBadges();}

// Add to wishlist
function addToWish(id){const wish = readStorage(STORAGE_WISH); if(wish.find(i=>i==id)) return; wish.push(id); writeStorage(STORAGE_WISH,wish); updateBadges();}

// Remove from wishlist
function removeWish(id){let wish = readStorage(STORAGE_WISH); wish = wish.filter(i=>i!=id); writeStorage(STORAGE_WISH,wish); updateBadges();}

// Render products into a container
function renderProducts(list,containerId){const container = document.getElementById(containerId); if(!container) return; container.innerHTML='';
  list.forEach(p=>{
    const card = document.createElement('article'); card.className='product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <div class="meta">${p.category} • $${p.price.toFixed(2)}</div>
      <div class="actions">
        <button class="btn add-to-cart" data-id="${p.id}">Add to Cart</button>
        <button class="btn add-to-wish" data-id="${p.id}">Wishlist</button>
      </div>
    `;
    container.appendChild(card);
  })
}

// Shop: filter/sort/search
function getShopFilters(){const q = new URLSearchParams(location.search); const presetCat = q.get('category')||'all';
  const search = (document.getElementById('searchInput')||{}).value||'';
  const cat = (document.getElementById('categoryFilter')||{}).value||presetCat;
  const sort = (document.getElementById('sortSelect')||{}).value||'default';
  return {search,cat,sort}
}
function applyShop(){let results = PRODUCTS.slice(); const f = getShopFilters();
  if(f.search) results = results.filter(p=>p.title.toLowerCase().includes(f.search.toLowerCase()));
  if(f.cat && f.cat!=='all') results = results.filter(p=>p.category===f.cat);
  if(f.sort==='price-asc') results.sort((a,b)=>a.price-b.price);
  if(f.sort==='price-desc') results.sort((a,b)=>b.price-a.price);
  renderProducts(results,'productsGrid');
}

// Featured on home uses first 4 products
function initHomeFeatured(){const featured = PRODUCTS.slice(0,4); renderProducts(featured,'featuredProducts');}

// Cart rendering
function renderCart(){const tbody = document.getElementById('cartTableBody'); if(!tbody) return; const cart = readStorage(STORAGE_CART);
  tbody.innerHTML=''; if(cart.length===0){tbody.innerHTML='<tr><td colspan="5">Your cart is empty.</td></tr>'; updateTotals(); return}
  cart.forEach(item=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><div style="display:flex;gap:10px;align-items:center"><img src="${item.img}" style="width:64px;height:48px;object-fit:cover;border-radius:6px"><div><strong>${item.title}</strong></div></div></td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <div class="qty-controls" data-id="${item.id}">
          <button class="qty-decrease" data-id="${item.id}">-</button>
          <span class="qty">${item.qty}</span>
          <button class="qty-increase" data-id="${item.id}">+</button>
        </div>
      </td>
      <td>$${(item.price*item.qty).toFixed(2)}</td>
      <td><button class="btn remove-item" data-id="${item.id}">Remove</button></td>
    `;
    tbody.appendChild(tr);
  })
  attachCartListeners(); updateTotals();}

function updateTotals(){const cart = readStorage(STORAGE_CART); const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0); const tax = subtotal*0.07; const total = subtotal+tax;
  const elSub = document.getElementById('subtotal'); const elTax = document.getElementById('tax'); const elTotal = document.getElementById('total');
  if(elSub) elSub.textContent = `$${subtotal.toFixed(2)}`; if(elTax) elTax.textContent = `$${tax.toFixed(2)}`; if(elTotal) elTotal.textContent = `$${total.toFixed(2)}`;
}

function attachCartListeners(){const tbody = document.getElementById('cartTableBody'); if(!tbody) return;
  tbody.querySelectorAll('.qty-decrease').forEach(btn=>btn.addEventListener('click',e=>{
    const id = +e.currentTarget.dataset.id; changeQty(id,-1);
  }));
  tbody.querySelectorAll('.qty-increase').forEach(btn=>btn.addEventListener('click',e=>{
    const id = +e.currentTarget.dataset.id; changeQty(id,1);
  }));
  tbody.querySelectorAll('.remove-item').forEach(btn=>btn.addEventListener('click',e=>{
    const id = +e.currentTarget.dataset.id; removeFromCart(id);
  }));
}

function changeQty(id,delta){const cart = readStorage(STORAGE_CART); const it = cart.find(i=>i.id==id); if(!it) return; it.qty = Math.max(1,it.qty+delta); writeStorage(STORAGE_CART,cart); renderCart(); updateBadges();}
function removeFromCart(id){let cart = readStorage(STORAGE_CART); cart = cart.filter(i=>i.id!=id); writeStorage(STORAGE_CART,cart); renderCart(); updateBadges();}

// Attach product grid listeners (delegation)
function attachProductListeners(containerId='productsGrid'){const container = document.getElementById(containerId); if(!container) return;
  container.addEventListener('click',e=>{
    const atc = e.target.closest('.add-to-cart'); const aw = e.target.closest('.add-to-wish');
    if(atc){const id = +atc.dataset.id; addToCart(id,1); const old = atc.textContent; atc.textContent = 'Added'; setTimeout(()=>atc.textContent=old,900);}
    if(aw){const id = +aw.dataset.id; addToWish(id); aw.textContent='♥'; setTimeout(()=>aw.textContent='Wishlist',900);}
  })
}

// Newsletter
function initNewsletter(){const form = document.getElementById('newsletterForm'); if(!form) return; form.addEventListener('submit',e=>{e.preventDefault(); const em = document.getElementById('newsletterEmail'); const msg = document.getElementById('newsletterMsg'); if(!em.value) return; msg.textContent = 'Thanks — check your inbox!'; em.value=''; })}

// Checkout form validation
function initCheckout(){const form = document.getElementById('checkoutForm'); if(!form) return; form.addEventListener('submit',e=>{e.preventDefault(); const name = document.getElementById('chkName'); const email = document.getElementById('chkEmail'); const addr = document.getElementById('chkAddress'); const msg = document.getElementById('checkoutMsg'); if(!name.value||!email.value||!addr.value){msg.textContent='Please fill all fields.'; return;} // simple success
  localStorage.removeItem(STORAGE_CART); updateBadges(); renderCart(); msg.textContent='Order placed — thanks!'; setTimeout(()=>msg.textContent='',4000);
})}

// Generic init on DOM ready
document.addEventListener('DOMContentLoaded',()=>{
  initNavToggle(); updateBadges(); attachProductListeners('productsGrid'); attachProductListeners('featuredProducts'); initNewsletter(); initCheckout();
  // page-specific
  if(document.getElementById('featuredProducts')) initHomeFeatured();
  if(document.getElementById('productsGrid')){
    // prefill filters from URL
    const q = new URLSearchParams(location.search); const cat = q.get('category'); if(cat && document.getElementById('categoryFilter')) document.getElementById('categoryFilter').value = cat;
    // attach controls
    const search = document.getElementById('searchInput'); const catSel = document.getElementById('categoryFilter'); const sort = document.getElementById('sortSelect');
    [search,catSel,sort].forEach(el=>{ if(!el) return; el.addEventListener('input',applyShop); el.addEventListener('change',applyShop)});
    applyShop();
  }
  if(document.getElementById('cartTableBody')) renderCart();
});
