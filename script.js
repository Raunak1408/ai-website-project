// script.js — core interactions for WonderBox Kids
// Assumes data.js loaded first and exposes WonderBox namespace

(function(){
  const W = window.WonderBox || {};
  const products = W.products || [];
  const activities = W.activities || [];
  const categories = W.categories || [];
  const ages = W.ages || [];
  const site = W.site || {currency:'$'};

  // Helpers
  const $ = sel => document.querySelector(sel);
  const $all = sel => Array.from(document.querySelectorAll(sel));
  const byId = id => document.getElementById(id);
  const format = n => site.currency + n.toFixed(2);

  // Local storage keys
  const LS_WISH = 'wb_wishlist';
  const LS_CART = 'wb_cart';

  function loadJSON(key){ try{ return JSON.parse(localStorage.getItem(key))||[] }catch(e){return[]}}
  function saveJSON(key,val){ localStorage.setItem(key,JSON.stringify(val)) }

  // Cart & wishlist utilities
  function addToWishlist(id){ const list=loadJSON(LS_WISH); if(!list.includes(id)){ list.push(id); saveJSON(LS_WISH,list); updateCounts(); } }
  function removeFromWishlist(id){ let list=loadJSON(LS_WISH); list=list.filter(x=>x!==id); saveJSON(LS_WISH,list); updateCounts(); }
  function wishlistItems(){ return loadJSON(LS_WISH) }

  function addToCart(id,qty=1){ const cart=loadJSON(LS_CART); const found=cart.find(i=>i.id===id); if(found){ found.qty=found.qty+qty } else { cart.push({id,qty}) } saveJSON(LS_CART,cart); updateCounts(); }
  function removeFromCart(id){ let cart=loadJSON(LS_CART); cart=cart.filter(i=>i.id!==id); saveJSON(LS_CART,cart); updateCounts(); }
  function updateCartQty(id,qty){ const cart=loadJSON(LS_CART); const it=cart.find(i=>i.id===id); if(it){ it.qty=qty; if(it.qty<=0) removeFromCart(id); saveJSON(LS_CART,cart); updateCounts(); } }
  function cartItems(){ return loadJSON(LS_CART) }

  function updateCounts(){ const w=wishlistItems().length; const c=cartItems().reduce((s,i)=>s+i.qty,0); $all('#wish-count').forEach(el=>el.textContent=w); $all('#cart-count').forEach(el=>el.textContent=c); }

  // Render functions
  function renderFeatured(){ const el=byId('featured-cats'); if(!el) return; el.innerHTML=''; const featured=[
    {title:'STEM & Science',desc:'Explore science kits and experiments',img:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=aa'},
    {title:'Building & Construction',desc:'Tiles, blocks and engineering toys',img:'https://images.unsplash.com/photo-1580657018722-3b9d00d8e3c9?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=bb'},
    {title:'Arts & Creativity',desc:'Paints, clay and craft kits',img:'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=cc'},
    {title:'Pretend Play',desc:'Kitchens, dress-up and role play',img:'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=dd'},
    {title:'Puzzles & Games',desc:'Puzzles, memory and board games',img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=ee'},
    {title:'Outdoor Fun',desc:'Active outdoor toys and games',img:'https://images.unsplash.com/photo-1526403224731-7e6e5a6f4c2b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=ff'}
  ];
  featured.forEach(c=>{ const d=document.createElement('div'); d.className='card'; d.innerHTML=`<img src="${c.img}" alt="${c.title}"><h3>${c.title}</h3><p>${c.desc}</p><div style="margin-top:10px"><a class="btn-ghost" href="shop.html?category=${encodeURIComponent(c.title)}">Browse</a></div>`; el.appendChild(d) }) }

  function renderBestSellers(){ const el=byId('best-sellers'); if(!el) return; el.innerHTML=''; const list=products.slice(0,6); list.forEach(p=>{ const d=document.createElement('div'); d.className='product-card'; d.innerHTML=`<img src="${p.image}" alt="${p.alt}"><div class="product-info"><h3>${p.name}</h3><p class="desc">${p.description}</p><div class="product-row"><div><strong>${format(p.price)}</strong><div class="badge">${p.age}</div></div><div style="margin-left:auto;display:flex;gap:8px"><button class="btn-ghost" data-action="view" data-id="${p.id}">View Details</button><button class="btn-primary" data-action="addcart" data-id="${p.id}">Add to Cart</button></div></div></div>`; el.appendChild(d) }) }

  function renderAgeButtons(){ const el=byId('age-buttons'); if(!el) return; el.innerHTML=''; ages.slice(1).forEach(a=>{ const b=document.createElement('button'); b.className='btn-ghost'; b.textContent=`Ages ${a}`; b.dataset.age=a; b.addEventListener('click',()=>{ location.href=`shop.html?age=${encodeURIComponent(a)}` }) ; el.appendChild(b) }) }

  function renderShopFilters(){ const catSel=byId('filter-category'); const ageSel=byId('filter-age'); if(catSel){ catSel.innerHTML=''; categories.forEach(c=>{ const o=document.createElement('option'); o.value=c; o.textContent=c; catSel.appendChild(o) }) } if(ageSel){ ageSel.innerHTML=''; ages.forEach(a=>{ const o=document.createElement('option'); o.value=a; o.textContent=a; ageSel.appendChild(o) }) } }

  function productCardHTML(p){ return `<div class="card"><img src="${p.image}" alt="${p.alt}"><h3>${p.name}</h3><p>${p.description}</p><div style="display:flex;align-items:center;gap:10px"><div><strong>${format(p.price)}</strong><div style="font-size:13px;color:var(--muted)">Rating: ${p.rating} · ${p.availability}</div></div><div style="margin-left:auto;display:flex;gap:8px"><button class="btn-ghost" data-action="view" data-id="${p.id}">View Details</button><button class="btn-primary" data-action="addcart" data-id="${p.id}">Add to Cart</button><button class="action-link" data-action="wish" data-id="${p.id}">♡</button></div></div></div>` }

  function applyFiltersSort(list,{category,age,price,search,sort}){
    let out=list.slice();
    if(category && category!=='All') out=out.filter(p=>p.category===category);
    if(age && age!=='All') out=out.filter(p=>p.age===age);
    if(price && price!=='All'){
      out=out.filter(p=>{
        if(price==='under-20') return p.price<20;
        if(price==='20-40') return p.price>=20 && p.price<=40;
        if(price==='40-70') return p.price>40 && p.price<=70;
        if(price==='over-70') return p.price>70;
        return true;
      })
    }
    if(search) { const q=search.toLowerCase(); out=out.filter(p=> (p.name+p.description+p.category).toLowerCase().includes(q)) }
    switch(sort){
      case 'price-asc': out.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': out.sort((a,b)=>b.price-a.price); break;
      case 'rating-desc': out.sort((a,b)=>b.rating-b.rating?b.rating-a.rating:0); break;
      case 'name-asc': out.sort((a,b)=>a.name.localeCompare(b.name)); break;
      default: break;
    }
    return out;
  }

  function initShopPage(){ const grid=byId('products-grid'); const noRes=byId('no-results'); if(!grid) return; renderShopFilters();
    const params=new URLSearchParams(location.search);
    const initial={ category:params.get('category')||'All', age:params.get('age')||'All', price:params.get('price')||'All', search:params.get('q')||'', sort:params.get('sort')||'featured'};
    function render(){ const cat=byId('filter-category').value; const age=byId('filter-age').value; const price=byId('filter-price').value; const sort=byId('sort-select').value; const search=byId('search-box').value; const out=applyFiltersSort(products,{category:cat,age,price,search,sort}); grid.innerHTML=''; if(!out.length){ noRes.style.display='block'; grid.style.display='none'; return } noRes.style.display='none'; grid.style.display='grid'; out.forEach(p=>{ const d=document.createElement('div'); d.innerHTML=productCardHTML(p); d.className='product-card'; grid.appendChild(d) }) }
    // initial values
    byId('filter-category').value=initial.category; byId('filter-age').value=initial.age; byId('filter-price').value=initial.price; byId('sort-select').value=initial.sort; byId('search-box').value=initial.search;
    render();
    // listeners
    ['filter-category','filter-age','filter-price','sort-select'].forEach(id=> byId(id).addEventListener('change',render));
    byId('search-box').addEventListener('input',render);

    // delegate buttons
    document.body.addEventListener('click',e=>{
      const btn=e.target.closest('button, a'); if(!btn) return; const action=btn.dataset.action; const id=btn.dataset.id;
      if(action==='view'){ location.href=`product.html?id=${encodeURIComponent(id)}` }
      if(action==='addcart'){ addToCart(id,1); alert('Added to cart') }
      if(action==='wish'){ addToWishlist(id); alert('Added to wishlist') }
    })
  }

  // Product detail page
  function initProductDetail(){ const root=byId('product-detail'); if(!root) return; const params=new URLSearchParams(location.search); const id=params.get('id'); if(!id){ root.innerHTML='<div class="card">Product not found</div>'; return } const p=products.find(x=>x.id===id); if(!p){ root.innerHTML='<div class="card">Product not found</div>'; return } root.innerHTML=`<div class="card" style="display:flex;gap:18px;align-items:flex-start"><img src="${p.image}" alt="${p.alt}" style="width:380px;height:300px;object-fit:cover"><div style="flex:1"><h1>${p.name}</h1><p>${p.description}</p><p><strong>${format(p.price)}</strong> · Rating ${p.rating} · ${p.age} · ${p.availability}</p><p>Product ID: ${p.id}</p><p><strong>Learning:</strong> ${p.learning}</p><label>Quantity <input id="qty" type="number" value="1" min="1" style="width:70px;margin-left:8px"></label><div style="margin-top:12px;display:flex;gap:8px"><button id="addcart" class="btn-primary">Add to Cart</button><button id="addwish" class="btn-ghost">Add to Wishlist</button><button id="buynow" class="action-btn">Buy Now</button></div></div></div>`;
    byId('addcart').addEventListener('click',()=>{ const q=parseInt(byId('qty').value)||1; addToCart(p.id,q); alert('Added to cart') });
    byId('addwish').addEventListener('click',()=>{ addToWishlist(p.id); alert('Added to wishlist') });
    byId('buynow').addEventListener('click',()=>{ addToCart(p.id,parseInt(byId('qty').value)||1); location.href='cart.html' })
  }

  // Wishlist page
  function initWishlistPage(){ const grid=byId('wishlist-grid'); const empty=byId('wishlist-empty'); if(!grid) return; function render(){ const ids=wishlistItems(); grid.innerHTML=''; if(!ids.length){ empty.style.display='block'; return } empty.style.display='none'; ids.forEach(id=>{ const p=products.find(x=>x.id===id); if(!p) return; const d=document.createElement('div'); d.className='card'; d.innerHTML=`<img src="${p.image}" alt="${p.alt}"><h3>${p.name}</h3><p>${format(p.price)}</p><div style="display:flex;gap:8px"><button class="btn-primary" data-action="movecart" data-id="${p.id}">Move to Cart</button><button class="btn-ghost" data-action="removewish" data-id="${p.id}">Remove</button><button class="btn-ghost" data-action="view" data-id="${p.id}">View</button></div>`; grid.appendChild(d) }) }
    render(); document.body.addEventListener('click',e=>{ const btn=e.target.closest('button'); if(!btn) return; const act=btn.dataset.action; const id=btn.dataset.id; if(act==='movecart'){ addToCart(id,1); removeFromWishlist(id); render(); updateCounts(); } if(act==='removewish'){ removeFromWishlist(id); render(); updateCounts(); } if(act==='view'){ location.href=`product.html?id=${encodeURIComponent(id)}` } })
  }

  // Cart page
  function initCartPage(){ const root=byId('cart-items'); if(!root) return; const empty=byId('cart-empty'); const summary=byId('cart-summary'); function render(){ const cart=cartItems(); root.innerHTML=''; if(!cart.length){ empty.style.display='block'; summary.style.display='none'; return } empty.style.display='none'; summary.style.display='block'; let subtotal=0; cart.forEach(i=>{ const p=products.find(x=>x.id===i.id); if(!p) return; subtotal+=p.price*i.qty; const row=document.createElement('div'); row.className='card'; row.style.display='flex'; row.style.alignItems='center'; row.innerHTML=`<img src="${p.image}" alt="${p.alt}" style="width:120px;height:90px;object-fit:cover"><div style="flex:1;margin-left:12px"><h4>${p.name}</h4><div>Price: ${format(p.price)}</div><div style="display:flex;gap:8px;align-items:center;margin-top:6px"><button class="btn-ghost" data-action="dec" data-id="${p.id}">-</button><span id="qty-${p.id}">${i.qty}</span><button class="btn-ghost" data-action="inc" data-id="${p.id}">+</button><button class="btn-ghost" data-action="remove" data-id="${p.id}">Remove</button></div></div><div><strong>${format(p.price*i.qty)}</strong></div>`; root.appendChild(row) })
      const shipping = subtotal>site.freeShippingThreshold?0:site.shippingFee; byId('subtotal').textContent=format(subtotal); byId('shipping').textContent=format(shipping); byId('total').textContent=format(subtotal+shipping);
    }
    render(); document.body.addEventListener('click',e=>{ const btn=e.target.closest('button'); if(!btn) return; const act=btn.dataset.action; const id=btn.dataset.id; if(act==='inc'){ const cart=cartItems(); const it=cart.find(x=>x.id===id); if(it){ updateCartQty(id,it.qty+1); render(); } } if(act==='dec'){ const cart=cartItems(); const it=cart.find(x=>x.id===id); if(it){ updateCartQty(id,it.qty-1); render(); } } if(act==='remove'){ removeFromCart(id); render(); } });
    // checkout
    const checkout = byId('checkout-btn'); if(checkout) checkout.addEventListener('click',()=>{ alert('Checkout demo — your order is ready.'); localStorage.removeItem(LS_CART); updateCounts(); render(); });
  }

  // Categories page
  function initCategoriesPage(){ const grid=byId('categories-grid'); if(!grid) return; grid.innerHTML=''; const thumbs={ 'STEM & Science':'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800','Building & Construction':'https://images.unsplash.com/photo-1580657018722-3b9d00d8e3c9?q=80&w=800','Arts & Creativity':'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?q=80&w=800','Pretend Play':'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=800','Puzzles & Games':'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800','Outdoor Fun':'https://images.unsplash.com/photo-1526403224731-7e6e5a6f4c2b?q=80&w=800' };
    categories.forEach(c=>{ if(c==='All') return; const d=document.createElement('div'); d.className='card'; d.innerHTML=`<img src="${thumbs[c]}" alt="${c}"><h3>${c}</h3><p>${c} toys and kits</p><div style="margin-top:10px"><a class="btn-primary" href="shop.html?category=${encodeURIComponent(c)}">Browse</a></div>`; grid.appendChild(d) }) }

  // Activities
  function initActivitiesPage(){ const grid=byId('activities-grid'); if(!grid) return; grid.innerHTML=''; activities.forEach(a=>{ const d=document.createElement('div'); d.className='card'; d.innerHTML=`<img src="${a.image}" alt="${a.title}"><h3>${a.title}</h3><p>${a.description}</p><p><strong>Age:</strong> ${a.age} · <strong>Duration:</strong> ${a.duration} · <strong>Difficulty:</strong> ${a.difficulty}</p><div style="margin-top:8px"><button class="btn-primary" data-action="start" data-id="${a.id}">Start Activity</button></div>`; grid.appendChild(d) });
    document.body.addEventListener('click',e=>{ const btn=e.target.closest('button'); if(!btn) return; const act=btn.dataset.action; const id=btn.dataset.id; if(act==='start'){ const a=activities.find(x=>x.id===id); if(!a) return; alert(a.title + "\n\nMaterials: " + a.materials.join(', ') + "\n\nInstructions:\n" + a.instructions); } }) }

  // Newsletter and contact forms
  function initForms(){ const newsletter=document.getElementById('newsletter-form'); if(newsletter){ newsletter.addEventListener('submit',e=>{ e.preventDefault(); const em=byId('newsletter-email').value.trim(); const fb=byId('newsletter-feedback'); const re=/^[^@\s]+@[^@\s]+\.[^@\s]+$/; if(!re.test(em)){ fb.textContent='Please enter a valid email address.'; fb.style.color='red'; return } fb.textContent="You're subscribed!"; fb.style.color='green'; byId('newsletter-email').value=''; }) }
    const contact=document.getElementById('contact-form'); if(contact){ contact.addEventListener('submit',e=>{ e.preventDefault(); const name=byId('c-name').value.trim(); const email=byId('c-email').value.trim(); const subject=byId('c-subject').value.trim(); const msg=byId('c-message').value.trim(); const fb=byId('contact-feedback'); if(!name||!email||!subject||!msg){ fb.textContent='Please fill all required fields.'; fb.style.color='red'; return } const re=/^[^@\s]+@[^@\s]+\.[^@\s]+$/; if(!re.test(email)){ fb.textContent='Please enter a valid email address.'; fb.style.color='red'; return } fb.textContent='Thanks! Your message has been received.'; fb.style.color='green'; contact.reset(); }) }
  }

  // Init routines per page
  function init(){ updateCounts(); renderFeatured(); renderBestSellers(); renderAgeButtons(); initForms(); renderShopFilters();
    const page=document.body.dataset.page;
    if(page==='shop') initShopPage();
    if(page==='product') initProductDetail();
    if(page==='wishlist') initWishlistPage();
    if(page==='cart') initCartPage();
    if(page==='categories') initCategoriesPage();
    if(page==='activities') initActivitiesPage();

    // global delegates for header links
    document.addEventListener('click',e=>{ const a=e.target.closest('a'); if(!a) return; if(a.getAttribute('href')&&a.getAttribute('href').startsWith('#')) e.preventDefault(); })
  }

  document.addEventListener('DOMContentLoaded',init);
})();
