// Shared site script: products, cart, wishlist, routing
(function(){
  const STORAGE = { CART:'wb_cart_v1', WISH:'wb_wish_v1' };
  const products = window.WB_PRODUCTS || [];

  // helpers
  function qs(sel){return document.querySelector(sel)}
  function qsa(sel){return Array.from(document.querySelectorAll(sel))}
  function save(key,val){localStorage.setItem(key,JSON.stringify(val))}
  function load(key){try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return []}}

  // header counts
  function updateCounts(){qs('#cart-count')&&(qs('#cart-count').textContent=load(STORAGE.CART).length);qs('#wish-count')&&(qs('#wish-count').textContent=load(STORAGE.WISH).length)}

  // render helpers
  function productCard(p){
    const div = document.createElement('div');div.className='product';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div class="meta">${p.category} · ${p.age}</div>
      <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center">
        <div><strong>$${p.price.toFixed(2)}</strong></div>
        <div>
          <button class="btn" data-action="view" data-id="${p.id}">View</button>
          <button class="icon" data-action="wish" data-id="${p.id}">❤</button>
          <button class="icon" data-action="add" data-id="${p.id}">🛒</button>
        </div>
      </div>
    `;
    return div;
  }

  // render lists
  function renderFeatured(){const el=qs('#featured');if(!el) return;el.innerHTML='';products.slice(0,4).forEach(p=>el.appendChild(productCard(p)))}
  function renderProducts(list){const grid=qs('#products-grid');if(!grid) return;grid.innerHTML='';list.forEach(p=>grid.appendChild(productCard(p)))}
  function renderCategories(){const el=qs('#categories-list');if(!el) return;el.innerHTML='';
    const cats = Array.from(new Set(products.map(p=>p.category)));
    cats.forEach(c=>{const d=document.createElement('div');d.className='card';d.innerHTML=`<h4>${c}</h4><p><a class="btn" href="products.html?category=${encodeURIComponent(c)}">Explore</a></p>`;el.appendChild(d)})
  }

  // product detail page
  function renderProductDetail(){const el=qs('#product-detail');if(!el) return;const params=new URLSearchParams(location.search);const id=params.get('id');const p=products.find(x=>x.id===id);if(!p){el.innerHTML='<p>Product not found.</p>';return}
    el.innerHTML = `
      <div class="card" style="display:flex;gap:16px;align-items:flex-start">
        <img src="${p.image}" alt="${p.name}" style="width:260px;height:260px;object-fit:cover">
        <div>
          <h2>${p.name}</h2>
          <div class="meta">${p.category} · ${p.age} · ⭐ ${p.rating}</div>
          <p style="margin-top:12px">${p.description}</p>
          <p style="font-weight:700;margin-top:8px">$${p.price.toFixed(2)}</p>
          <p>
            <button id="add-to-cart" class="btn">Add to Cart</button>
            <button id="add-to-wish" class="btn" style="background:#eee;color:#333;margin-left:8px">Add to Wishlist</button>
          </p>
        </div>
      </div>
    `;
    qs('#add-to-cart').addEventListener('click',()=>{addToCart(p.id);alert('Added to cart')});
    qs('#add-to-wish').addEventListener('click',()=>{toggleWish(p.id);alert('Wishlist updated')});
  }

  // cart / wishlist logic
  function addToCart(id){const cart=load(STORAGE.CART);const found=cart.find(i=>i.id===id);if(found){found.qty=found.qty+1}else{cart.push({id,qty:1})}save(STORAGE.CART,cart);updateCounts()}
  function removeFromCart(id){let cart=load(STORAGE.CART);cart=cart.filter(i=>i.id!==id);save(STORAGE.CART,cart);updateCounts();renderCart()}
  function toggleWish(id){let w=load(STORAGE.WISH);if(w.includes(id)){w=w.filter(x=>x!==id)}else{w.push(id)}save(STORAGE.WISH,w);updateCounts();renderWishlist()}

  // render cart page
  function renderCart(){const el=qs('#cart-items');if(!el) return;const cart=load(STORAGE.CART);if(!cart.length){el.innerHTML='<p>Your cart is empty.</p>';qs('#cart-summary')&&(qs('#cart-summary').innerHTML='');return}
    el.innerHTML='';let total=0;cart.forEach(item=>{const p=products.find(x=>x.id===item.id);if(!p) return;total+=p.price*item.qty;const row=document.createElement('div');row.className='card';row.style.display='flex';row.style.gap='12px';row.innerHTML=`<img src="${p.image}" alt="${p.name}" style="width:120px;height:100px;object-fit:cover"><div style="flex:1"><h4>${p.name}</h4><div class="meta">${p.category} · ${p.age}</div><div>Qty: ${item.qty}</div><div style="margin-top:8px"><button class="btn remove" data-id="${item.id}">Remove</button></div></div><div style="font-weight:700">$${(p.price*item.qty).toFixed(2)}</div>`;el.appendChild(row)})
    qs('#cart-summary')&&(qs('#cart-summary').innerHTML=`<div class="card"><h3>Summary</h3><p>Total: <strong>$${total.toFixed(2)}</strong></p><p><button id="checkout" class="btn">Checkout (placeholder)</button></p></div>`);
    qsa('.remove').forEach(b=>b.addEventListener('click',e=>removeFromCart(e.currentTarget.dataset.id)));
    qs('#checkout')&&qs('#checkout').addEventListener('click',()=>alert('Checkout placeholder — integrate real payment in production'))
  }

  // render wishlist page
  function renderWishlist(){const el=qs('#wishlist-items');if(!el) return;const wish=load(STORAGE.WISH);if(!wish.length){el.innerHTML='<p>Your wishlist is empty.</p>';return}el.innerHTML='';wish.forEach(id=>{const p=products.find(x=>x.id===id);if(!p) return;const d=document.createElement('div');d.className='card';d.innerHTML=`<img src="${p.image}" alt="${p.name}" style="width:120px;height:100px;object-fit:cover"><h4>${p.name}</h4><div class="meta">$${p.price.toFixed(2)}</div><p><button class="btn add-wish-cart" data-id="${p.id}">Add to Cart</button> <button class="btn remove-wish" data-id="${p.id}" style="background:#eee;color:#333">Remove</button></p>`;el.appendChild(d)});
    qsa('.add-wish-cart').forEach(b=>b.addEventListener('click',e=>{addToCart(e.currentTarget.dataset.id);alert('Added to cart')}));
    qsa('.remove-wish').forEach(b=>b.addEventListener('click',e=>{toggleWish(e.currentTarget.dataset.id)}));
  }

  // products page filters and search
  function applyFiltersFromUI(){let list = products.slice();const params=new URLSearchParams(location.search);const category=params.get('category')||'';const q=params.get('q')||'';const age=params.get('age')||''; if(category) list=list.filter(p=>p.category===category); if(age) list=list.filter(p=>p.age===age); if(q) list=list.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())||p.description.toLowerCase().includes(q.toLowerCase()));
    // sorting
    const sort = params.get('sort')||'relevance'; if(sort==='price-asc') list.sort((a,b)=>a.price-b.price); if(sort==='price-desc') list.sort((a,b)=>b.price-a.price); if(sort==='rating-desc') list.sort((a,b)=>b.rating-b.rating);
    renderProducts(list);
  }

  function initProductsPage(){
    // populate filters
    const catSel = qs('#filter-category'); const ages = Array.from(new Set(products.map(p=>p.age))).sort(); ages.forEach(a=>{const o=document.createElement('option');o.value=a;o.textContent=a;catSel.parentNode&&catSel.appendChild(o)});
    const ageSel = qs('#filter-age'); ages.forEach(a=>{const o=document.createElement('option');o.value=a;o.textContent=a;ageSel.appendChild(o)});
    const catList = Array.from(new Set(products.map(p=>p.category))).sort(); catList.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;qs('#filter-category').appendChild(o)});

    // initial render
    applyFiltersFromUI();

    // UI events
    qs('#search-input')&&qs('#search-input').addEventListener('input',e=>{const q=e.target.value;const params=new URLSearchParams(location.search); if(q) params.set('q',q); else params.delete('q'); history.replaceState(null,'',location.pathname+'?'+params.toString()); applyFiltersFromUI()});
    qsa('#filter-category,#filter-age,#sort-select').forEach(el=>el&&el.addEventListener('change',()=>{const params=new URLSearchParams(location.search); if(qs('#filter-category').value) params.set('category',qs('#filter-category').value); else params.delete('category'); if(qs('#filter-age').value) params.set('age',qs('#filter-age').value); else params.delete('age'); if(qs('#sort-select')){ if(qs('#sort-select').value) params.set('sort',qs('#sort-select').value); else params.delete('sort')} history.replaceState(null,'',location.pathname+'?'+params.toString()); applyFiltersFromUI()}));
    qs('#clear-filters')&&qs('#clear-filters').addEventListener('click',()=>{history.replaceState(null,'',location.pathname); qs('#search-input').value=''; qs('#filter-category').value=''; qs('#filter-age').value=''; qs('#sort-select').value='relevance'; applyFiltersFromUI()});
  }

  // header action delegation (view/add/wish)
  document.addEventListener('click',function(e){const btn=e.target.closest('[data-action]');if(!btn) return;const act=btn.dataset.action;const id=btn.dataset.id; if(act==='view'){location.href='product.html?id='+encodeURIComponent(id)} if(act==='add'){addToCart(id);alert('Added to cart')} if(act==='wish'){toggleWish(id);alert('Wishlist updated')}});

  // newsletter
  qs('#newsletter-form')&&qs('#newsletter-form').addEventListener('submit',function(e){e.preventDefault();const em=qs('#newsletter-email').value;qs('#newsletter-msg').textContent='Thanks — subscribed: '+em;qs('#newsletter-form').reset()});

  // contact form
  qs('#contact-form')&&qs('#contact-form').addEventListener('submit',function(e){e.preventDefault();qs('#contact-msg').textContent='Thanks — we received your message.';qs('#contact-form').reset()});

  // initialize pages
  function init(){updateCounts();renderFeatured();renderCategories();
    const page=document.body.dataset.page;
    if(page==='products'){initProductsPage();}
    if(page==='product'){renderProductDetail();}
    if(page==='cart'){renderCart();}
    if(page==='wishlist'){renderWishlist();}
    // attach wishlist/cart renders when storage changes
    window.addEventListener('storage',updateCounts);
  }

  // small utility to render featured/cards when DOM ready
  document.addEventListener('DOMContentLoaded',init);
})();
