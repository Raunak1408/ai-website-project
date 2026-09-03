// Core site JS: product rendering, cart & wishlist (localStorage)
(function(){
  const LS_CART='wb_cart',LS_WISH='wb_wish';
  const products = window.WB_PRODUCTS || [];

  function byId(id){return document.getElementById(id)}
  function save(key,val){localStorage.setItem(key,JSON.stringify(val))}
  function load(key){try{return JSON.parse(localStorage.getItem(key))||[]}catch(e){return []}}

  function updateCounts(){const cart=load(LS_CART),wish=load(LS_WISH);[...document.querySelectorAll('#cart-count')].forEach(el=>el.textContent=cart.length);[...document.querySelectorAll('#wish-count')].forEach(el=>el.textContent=wish.length)}

  // Render helpers
  function productCard(p,actions=true){
    const div=document.createElement('div');div.className='card product';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div class="meta">${p.category} • ${p.age}</div>
      <div class="meta">$${p.price.toFixed(2)} • ★ ${p.rating}</div>
      <div style="margin-top:8px">
        <a class="btn" href="product.html?id=${encodeURIComponent(p.id)}">View</a>
        ${actions?`<button data-action="add" data-id="${p.id}" class="btn">Add to cart</button>
        <button data-action="wish" data-id="${p.id}" class="icon">♡</button>`:''}
      </div>`
    return div;
  }

  function renderGrid(target,items){const t=byId(target);if(!t) return; t.innerHTML='';items.forEach(p=>t.appendChild(productCard(p,true)))}

  // Page renderers
  function renderHome(){const featured = products.slice(0,4);renderGrid('featured-grid',featured)}

  function unique(arr,key){return [...new Set(arr.map(x=>x[key]))]}

  function populateFilters(){const cats=unique(products,'category');const catSel=byId('filter-category');if(catSel){cats.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;catSel.appendChild(o)})}
    const ages=unique(products,'age');const ageSel=byId('filter-age');if(ageSel){ages.forEach(a=>{const o=document.createElement('option');o.value=a;o.textContent=a;ageSel.appendChild(o)})}
  }

  function applyFiltersAndRender(){let list=products.slice();const q=byId('search-input')?byId('search-input').value.trim().toLowerCase():'',cat=byId('filter-category')?byId('filter-category').value:'',age=byId('filter-age')?byId('filter-age').value:'',sort=byId('sort-select')?byId('sort-select').value:'';
    if(q){list=list.filter(p=>p.name.toLowerCase().includes(q)||p.description.toLowerCase().includes(q))}
    if(cat){list=list.filter(p=>p.category===cat)}
    if(age){list=list.filter(p=>p.age===age)}
    if(sort==='price-asc')list.sort((a,b)=>a.price-b.price);if(sort==='price-desc')list.sort((a,b)=>b.price-a.price);if(sort==='rating-desc')list.sort((a,b)=>b.rating-b.rating);
    renderGrid('products-grid',list)
  }

  function renderProductsPage(){populateFilters();applyFiltersAndRender();
    // events
    const clear=byId('clear-filters');if(clear) clear.addEventListener('click',()=>{byId('filter-category').value='';byId('filter-age').value='';byId('search-input').value='';byId('sort-select').value='relevance';applyFiltersAndRender()});
    const search=byId('search-input');if(search) search.addEventListener('input',applyFiltersAndRender);
    const sort=byId('sort-select');if(sort) sort.addEventListener('change',applyFiltersAndRender);
  }

  function renderProductDetail(){const container=byId('product-detail');if(!container) return;const params=new URLSearchParams(location.search);const id=params.get('id');const p=products.find(x=>x.id===id);if(!p){container.innerHTML='<p class="card">Product not found.</p>';return}
    container.innerHTML='';const card=document.createElement('div');card.className='card';card.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px"><img src="${p.image}" alt="${p.name}" style="width:100%;height:320px;object-fit:cover;border-radius:8px"><div><h2>${p.name}</h2><div class="meta">${p.category} • ${p.age}</div><p class="muted">${p.description}</p><h3>$${p.price.toFixed(2)}</h3><div style="display:flex;gap:8px;margin-top:12px"><button data-action="add" data-id="${p.id}" class="btn">Add to cart</button><button data-action="wish" data-id="${p.id}" class="btn">Add to wishlist</button></div></div></div>`
    container.appendChild(card);
  }

  function renderCartPage(){const container=byId('cart-items');const summary=byId('cart-summary');if(!container) return;const cart=load(LS_CART);container.innerHTML='';if(!cart.length){container.innerHTML='<p class="muted">Your cart is empty. Browse <a href="products.html">products</a>.</p>';summary.innerHTML='';return}
    let total=0;cart.forEach(id=>{const p=products.find(x=>x.id===id);if(!p) return;total+=p.price;const row=document.createElement('div');row.className='card';row.innerHTML=`<div style="display:flex;gap:12px;align-items:center"><img src="${p.image}" alt="${p.name}" style="width:100px;height:70px;object-fit:cover;border-radius:6px"><div style="flex:1"><strong>${p.name}</strong><div class="meta">$${p.price.toFixed(2)}</div></div><div><button data-action="remove" data-id="${p.id}" class="btn">Remove</button></div></div>`;container.appendChild(row)})
    summary.innerHTML=`<div class="card"><h3>Order summary</h3><p class="muted">Items: ${cart.length}</p><p><strong>Total: $${total.toFixed(2)}</strong></p><p><button class="btn" id="checkout">Checkout</button></p></div>`
  }

  function renderWishlistPage(){const container=byId('wishlist-items');if(!container) return;const wish=load(LS_WISH);container.innerHTML='';if(!wish.length){container.innerHTML='<p class="muted">Your wishlist is empty. Add favorites from the <a href="products.html">shop</a>.</p>';return}
    wish.forEach(id=>{const p=products.find(x=>x.id===id);if(!p) return;const row=document.createElement('div');row.className='card';row.innerHTML=`<div style="display:flex;gap:12px;align-items:center"><img src="${p.image}" alt="${p.name}" style="width:100px;height:70px;object-fit:cover;border-radius:6px"><div style="flex:1"><strong>${p.name}</strong><div class="meta">$${p.price.toFixed(2)}</div></div><div><button data-action="remove-wish" data-id="${p.id}" class="btn">Remove</button></div></div>`;container.appendChild(row)})
  }

  // Actions
  document.addEventListener('click',function(e){const btn=e.target.closest('button');if(!btn) return;const action=btn.dataset.action;const id=btn.dataset.id; if(!action||!id) return;
    if(action==='add'){const cart=load(LS_CART);cart.push(id);save(LS_CART,cart);updateCounts();if(location.pathname.endsWith('cart.html')) renderCartPage();alert('Added to cart')}
    if(action==='wish'){let w=load(LS_WISH);if(!w.includes(id)){w.push(id);save(LS_WISH,w);updateCounts();alert('Added to wishlist')}else{alert('Already in wishlist')}}
    if(action==='remove'){let c=load(LS_CART);c=c.filter(x=>x!==id);save(LS_CART,c);updateCounts();renderCartPage()}
    if(action==='remove-wish'){let w=load(LS_WISH);w=w.filter(x=>x!==id);save(LS_WISH,w);updateCounts();renderWishlistPage()}
  })

  // Other UI handlers: checkout, newsletter, contact
  document.addEventListener('click',function(e){if(e.target && e.target.id==='checkout'){alert('Checkout flow placeholder — implement payment integration') }});

  const newsForm = byId('newsletter-form'); if(newsForm) newsForm.addEventListener('submit',e=>{e.preventDefault();const email=byId('newsletter-email').value;byId('newsletter-msg').textContent='Thanks — subscribed: '+email;newsForm.reset()})
  const contactForm = byId('contact-form'); if(contactForm) contactForm.addEventListener('submit',e=>{e.preventDefault();const name=byId('c-name').value;const msg=byId('c-message').value;byId('contact-msg').textContent='Thanks '+name+' — we received your message.';contactForm.reset()})

  // Initialize pages
  function init(){updateCounts();byId('year')&& (byId('year').textContent=new Date().getFullYear()); const page=document.body.dataset.page; if(page==='home')renderHome(); if(page==='products')renderProductsPage(); if(page==='product')renderProductDetail(); if(page==='cart')renderCartPage(); if(page==='wishlist')renderWishlistPage(); if(page==='categories'){
    const cats= [...new Set(products.map(p=>p.category))]; const list=byId('categories-list'); if(list){list.innerHTML='';cats.forEach(c=>{const div=document.createElement('div');div.className='card';div.innerHTML=`<h4>${c}</h4><p class="muted">Browse items in ${c}</p><p><a class="btn" href="products.html?category=${encodeURIComponent(c)}">Explore</a></p>`;list.appendChild(div)})}
  }

  // support query params on products page
  if(location.pathname.endsWith('products.html')&& location.search){const params=new URLSearchParams(location.search);const c=params.get('category');const q=params.get('q');if(c&&byId('filter-category'))byId('filter-category').value=c; if(q&&byId('search-input'))byId('search-input').value=q}

  // When product list is available, render with filters
  document.addEventListener('DOMContentLoaded',()=>{
    // small delay to ensure DOM created
    populateFilters(); if(document.body.dataset.page==='products') applyFiltersAndRender();
  })

  init();
})();
