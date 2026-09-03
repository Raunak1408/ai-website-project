// app.js - handles products, cart, wishlist, and UI across pages
const PRODUCTS = [
  {id:1,title:'Nova Mechanical Keyboard',category:'Keyboards',price:109.99,img:'https://images.unsplash.com/photo-1605792657667-7f0f9dd7f6f6?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=6a9d1c0e2b6e4a0a'},
  {id:2,title:'Specter RGB Mouse',category:'Mice',price:59.99,img:'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2b5b6b3d8a1e'},
  {id:3,title:'Pulse Wireless Headset',category:'Headsets',price:129.99,img:'https://images.unsplash.com/photo-1611599535870-5a3b4c3b7c6a?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3d4c4b5e6f7a'},
  {id:4,title:'Titan Controller',category:'Controllers',price:79.99,img:'https://images.unsplash.com/photo-1587202372775-90d2b8e3a4b5?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=5b6c7d8e9f0a'},
  {id:5,title:'Glide Gaming Mouse',category:'Mice',price:49.99,img:'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=abc123'},
  {id:6,title:'Arcade Wrist Rest',category:'Accessories',price:19.99,img:'https://images.unsplash.com/photo-1551854838-0c12d6f5a5b3?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=123abc'},
  {id:7,title:'Stealth Silent Keyboard',category:'Keyboards',price:139.99,img:'https://images.unsplash.com/photo-1584270354949-7d5d4b6f2a3f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=456def'},
  {id:8,title:'Echo Gaming Headset',category:'Headsets',price:89.99,img:'https://images.unsplash.com/photo-1599943976841-4f3d2a4f6a5b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=789ghi'}
];

// Storage helpers
function loadCart(){
  try{ return JSON.parse(localStorage.getItem('gg_cart')||'[]'); }catch(e){return []}
}
function saveCart(cart){ localStorage.setItem('gg_cart',JSON.stringify(cart)); updateCounters(); }
function loadWishlist(){ try{return JSON.parse(localStorage.getItem('gg_wishlist')||'[]')}catch(e){return[]} }
function saveWishlist(wl){ localStorage.setItem('gg_wishlist',JSON.stringify(wl)); updateCounters(); }

// counters in header
function updateCounters(){
  const cart = loadCart(); const wish = loadWishlist();
  const c = document.getElementById('cartCount'); const w = document.getElementById('wishCount');
  if(c) c.textContent = cart.reduce((s,it)=>s+it.qty,0);
  if(w) w.textContent = wish.length;
}

// Add to cart
function addToCart(id){
  const cart = loadCart(); const prod = PRODUCTS.find(p=>p.id===id);
  if(!prod) return;
  const existing = cart.find(i=>i.id===id);
  if(existing){ existing.qty +=1; } else { cart.push({id:prod.id,title:prod.title,price:prod.price,img:prod.img,qty:1}); }
  saveCart(cart);
}

// Add to wishlist
function toggleWishlist(id){
  let wl = loadWishlist();
  const exists = wl.find(i=>i.id===id);
  if(exists){ wl = wl.filter(i=>i.id!==id); } else { const p=PRODUCTS.find(x=>x.id===id); if(p) wl.push({id:p.id,title:p.title,img:p.img}); }
  saveWishlist(wl);
}

// Render products grid (used on home featured and shop)
function renderProducts(targetId,products){
  const container = document.getElementById(targetId);
  if(!container) return;
  container.innerHTML='';
  products.forEach(p=>{
    const card = document.createElement('article');
    card.className='product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="product-info">
        <h3>${p.title}</h3>
        <div class="meta">${p.category}</div>
        <div class="price">$${p.price.toFixed(2)}</div>
        <div class="actions">
          <button class="btn btn-primary add-cart" data-id="${p.id}">Add to Cart</button>
          <button class="btn add-wish" data-id="${p.id}">Wishlist</button>
        </div>
      </div>`;
    container.appendChild(card);
  });
  // attach listeners
  container.querySelectorAll('.add-cart').forEach(b=>b.addEventListener('click',e=>{ addToCart(Number(e.currentTarget.dataset.id)); }));
  container.querySelectorAll('.add-wish').forEach(b=>b.addEventListener('click',e=>{ toggleWishlist(Number(e.currentTarget.dataset.id)); }));
}

// Shop page behaviors: search, filter, sort
function initShop(){
  const grid = document.getElementById('productsGrid');
  if(!grid) return;
  let results = PRODUCTS.slice();
  const search = document.getElementById('searchInput');
  const cat = document.getElementById('categoryFilter');
  const sort = document.getElementById('sortSelect');

  function apply(){
    let out = PRODUCTS.slice();
    const q = search?.value.trim().toLowerCase()||'';
    if(q) out = out.filter(p=>p.title.toLowerCase().includes(q)||p.category.toLowerCase().includes(q));
    const c = cat?.value||'all'; if(c!=='all') out = out.filter(p=>p.category===c);
    const s = sort?.value||'default'; if(s==='price-asc') out.sort((a,b)=>a.price-b.price); if(s==='price-desc') out.sort((a,b)=>b.price-a.price);
    renderProducts('productsGrid',out);
    updateCounters();
  }
  [search,cat,sort].forEach(el=>el&&el.addEventListener('input',apply));
  apply();
}

// Home page init: show featured (first 4 products)
function initHome(){ renderProducts('featuredProducts',PRODUCTS.slice(0,4)); updateCounters(); }

// Cart page render and controls
function renderCart(){
  const container = document.getElementById('cartContainer'); if(!container) return;
  const cart = loadCart();
  if(cart.length===0){ container.innerHTML='<p>Your cart is empty.</p>'; updateCounters(); return; }
  const table = document.createElement('table'); table.className='cart-table';
  table.innerHTML = `<thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Line</th><th></th></tr></thead>`;
  const tbody = document.createElement('tbody');
  cart.forEach(item=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="cart-product"><img src="${item.img}" alt="${item.title}"><span>${item.title}</span></td>
      <td>$${item.price.toFixed(2)}</td>
      <td><button class="qty-decrease" data-id="${item.id}">-</button><span class="qty">${item.qty}</span><button class="qty-increase" data-id="${item.id}">+</button></td>
      <td>$${(item.price*item.qty).toFixed(2)}</td>
      <td><button class="remove-item" data-id="${item.id}">Remove</button></td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  // totals
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const tax = subtotal*0.07; const total = subtotal+tax;
  const footer = document.createElement('div'); footer.className='cart-totals'; footer.innerHTML = `<p>Subtotal: $${subtotal.toFixed(2)}</p><p>Tax: $${tax.toFixed(2)}</p><p>Total: $${total.toFixed(2)}</p>`;
  container.innerHTML=''; container.appendChild(table); container.appendChild(footer);
  // attach controls
  container.querySelectorAll('.qty-increase').forEach(b=>b.addEventListener('click',e=>{ changeQty(Number(e.currentTarget.dataset.id),1); }));
  container.querySelectorAll('.qty-decrease').forEach(b=>b.addEventListener('click',e=>{ changeQty(Number(e.currentTarget.dataset.id),-1); }));
  container.querySelectorAll('.remove-item').forEach(b=>b.addEventListener('click',e=>{ removeItem(Number(e.currentTarget.dataset.id)); }));
  updateCounters();
}
function changeQty(id,delta){ const cart=loadCart(); const it=cart.find(i=>i.id===id); if(!it) return; it.qty+=delta; if(it.qty<1) it.qty=1; saveCart(cart); renderCart(); }
function removeItem(id){ let cart=loadCart(); cart = cart.filter(i=>i.id!==id); saveCart(cart); renderCart(); }

// Checkout handling
function initCheckout(){ const form=document.getElementById('checkoutForm'); if(!form) return; form.addEventListener('submit',e=>{ e.preventDefault(); const name=document.getElementById('chkName').value.trim(); const email=document.getElementById('chkEmail').value.trim(); const addr=document.getElementById('chkAddress').value.trim(); const card=document.getElementById('chkCard').value.trim(); const msg=document.getElementById('checkoutMsg'); if(name.length<2||!email.includes('@')||addr.length<5||card.length<12){ msg.textContent='Please fill valid checkout details.'; msg.style.color='salmon'; return; } // simulate success
 localStorage.removeItem('gg_cart'); msg.textContent='Order placed — thank you!'; msg.style.color='lightgreen'; updateCounters(); renderCart(); }); }

// Mobile nav toggle
function initNav(){ const btn=document.getElementById('navToggle'); const nav=document.getElementById('siteNav'); if(!btn||!nav) return; btn.addEventListener('click',()=>{ nav.classList.toggle('open'); }); }

// Generic init runner
document.addEventListener('DOMContentLoaded',()=>{
  updateCounters(); initNav(); initShop(); initHome(); renderCart(); initCheckout();
  // newsletter form on home
  const nf = document.getElementById('newsletterForm'); if(nf){ nf.addEventListener('submit',e=>{ e.preventDefault(); const em=document.getElementById('newsletterEmail'); const msg=document.getElementById('newsletterMsg'); if(!em.value.includes('@')){ msg.textContent='Enter a valid email'; msg.style.color='salmon'; return; } msg.textContent='Thanks for subscribing!'; msg.style.color='lightgreen'; em.value=''; }); }
});
