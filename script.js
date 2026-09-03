// WonderBox Kids - client script: render products, cart, wishlist, filters
(function(){
  function qs(s){return document.querySelector(s)}
  function qsa(s){return Array.from(document.querySelectorAll(s))}
  function byId(id){return document.getElementById(id)}

  const STORAGE_CART='wb_cart',STORAGE_WISH='wb_wish';
  function load(key){try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return[]}}
  function save(key,val){localStorage.setItem(key,JSON.stringify(val))}

  function findProduct(id){return (window.WB_PRODUCTS||[]).find(p=>p.id===id)}

  // Render product card
  function makeCard(p){
    const div=document.createElement('div');div.className='card';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>${p.category} • ${p.age}</p>
      <p style="font-weight:700">$${p.price.toFixed(2)}</p>
      <div style="display:flex;gap:8px;margin-top:8px">
        <a class="btn" href="product.html?id=${encodeURIComponent(p.id)}">View</a>
        <button class="btn add" data-id="${p.id}">Add to cart</button>
        <button class="icon wish" title="Add to wishlist" data-id="${p.id}">♡</button>
      </div>`;
    return div;
  }

  function renderGrid(products){
    const container=byId('products-grid');
    if(!container) return;
    container.innerHTML='';
    if(!products.length){container.innerHTML='<p>No products found.</p>';return}
    const g=document.createElement('div');g.className='grid';
    products.forEach(p=>g.appendChild(makeCard(p)));
    container.appendChild(g);
    // attach events
    qsa('.add').forEach(btn=>btn.addEventListener('click',e=>{
      const id=e.currentTarget.dataset.id;let cart=load(STORAGE_CART);cart.push(id);save(STORAGE_CART,cart);alert('Added to cart');updateCounts();renderCartSummary();
    }));
    qsa('.wish').forEach(btn=>btn.addEventListener('click',e=>{
      const id=e.currentTarget.dataset.id;let w=load(STORAGE_WISH);if(!w.includes(id)){w.push(id);save(STORAGE_WISH,w);alert('Added to wishlist');updateCounts();}else{alert('Already in wishlist')}
    }));
  }

  function updateCounts(){
    const cart=load(STORAGE_CART),wish=load(STORAGE_WISH);
    qsa('#cart-count').forEach(el=>el.textContent=cart.length);
    qsa('#wish-count').forEach(el=>el.textContent=wish.length);
  }

  // Filters & search
  function applyFilters(){
    const cats=byId('filter-category')?byId('filter-category').value:'';
    const age=byId('filter-age')?byId('filter-age').value:'';
    const sort=byId('sort-select')?byId('sort-select').value:'';
    const query=byId('search-input')?byId('search-input').value.trim().toLowerCase():'';
    let list=(window.WB_PRODUCTS||[]).slice();
    if(cats) list=list.filter(p=>p.category===cats);
    if(age) list=list.filter(p=>p.age===age);
    if(query) list=list.filter(p=>p.name.toLowerCase().includes(query)||p.description.toLowerCase().includes(query));
    if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
    if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);
    renderGrid(list);
  }

  // Product detail
  function renderProductDetail(){
    const container=byId('product-detail'); if(!container) return;
    const params=new URLSearchParams(location.search);const id=params.get('id');
    const p=findProduct(id);
    if(!p){container.innerHTML='<p>Product not found.</p>';return}
    container.innerHTML=`<div class="card" style="display:flex;gap:18px;align-items:flex-start">
      <img src="${p.image}" alt="${p.name}" style="width:320px;height:280px;object-fit:cover">
      <div style="flex:1">
        <h2>${p.name}</h2>
        <p style="color:#666">${p.category} • ${p.age}</p>
        <p style="font-weight:700;font-size:20px;margin-top:8px">$${p.price.toFixed(2)}</p>
        <p style="margin-top:12px;color:#333">${p.description}</p>
        <div style="margin-top:16px;display:flex;gap:8px">
          <button class="btn" id="buy-now">Buy Now</button>
          <button class="btn" id="add-cart">Add to cart</button>
          <button class="icon" id="add-wish">♡ Wishlist</button>
        </div>
      </div>
    </div>`;
    byId('add-cart').addEventListener('click',()=>{let cart=load(STORAGE_CART);cart.push(p.id);save(STORAGE_CART,cart);updateCounts();alert('Added to cart')});
    byId('add-wish').addEventListener('click',()=>{let w=load(STORAGE_WISH);if(!w.includes(p.id)){w.push(p.id);save(STORAGE_WISH,w);updateCounts();alert('Added to wishlist')}else alert('Already in wishlist')});
    byId('buy-now').addEventListener('click',()=>{
      // simple Buy Now: create a single-item order and simulate checkout
      const order={id:'order_'+Date.now(),items:[{id:p.id,qty:1}],total:p.price,date:new Date().toISOString()};
      localStorage.setItem('wb_last_order',JSON.stringify(order));
      // clear cart and navigate to cart for checkout simulation
      save(STORAGE_CART,[p.id]);updateCounts();alert('Proceeding to checkout — simulated');location.href='cart.html';
    });
  }

  // Cart page
  function renderCartPage(){
    const container=byId('cart-items');if(!container) return;
    const cart=load(STORAGE_CART);
    if(!cart.length){container.innerHTML='<p>Your cart is empty.</p>';return}
    const list=document.createElement('div');list.className='grid';
    let total=0;cart.forEach(id=>{const p=findProduct(id); if(!p) return; total+=p.price; const c=makeCard(p); // modify card for cart
      const qtyDiv=document.createElement('div');qtyDiv.innerHTML=`<button class="btn remove" data-id="${p.id}">Remove</button>`; c.appendChild(qtyDiv); list.appendChild(c);
    });
    container.innerHTML='';container.appendChild(list);
    const summary=document.createElement('div');summary.style.marginTop='16px';summary.innerHTML=`<div class="card"><h3>Order summary</h3><p style="font-weight:700">Total: $${total.toFixed(2)}</p><div style="margin-top:8px"><button class="btn" id="checkout">Checkout (simulate)</button></div></div>`;
    container.appendChild(summary);
    qsa('.remove').forEach(b=>b.addEventListener('click',e=>{const id=e.currentTarget.dataset.id;let c=load(STORAGE_CART);c=c.filter(x=>x!==id);save(STORAGE_CART,c);renderCartPage();updateCounts();}));
    const co=byId('checkout'); if(co) co.addEventListener('click',()=>{const order={id:'order_'+Date.now(),items:cart,total:total,date:new Date().toISOString()};localStorage.setItem('wb_last_order',JSON.stringify(order));save(STORAGE_CART,[]);updateCounts();alert('Thank you! Purchase simulated.');renderCartPage();});
  }

  // Wishlist page
  function renderWishPage(){
    const container=byId('wishlist-items');if(!container) return;
    const wish=load(STORAGE_WISH);
    if(!wish.length){container.innerHTML='<p>Your wishlist is empty.</p>';return}
    const list=document.createElement('div');list.className='grid';
    wish.forEach(id=>{const p=findProduct(id); if(!p) return; const c=makeCard(p); const rem=document.createElement('div');rem.innerHTML=`<button class="btn remove-w" data-id="${p.id}">Remove</button>`; c.appendChild(rem); list.appendChild(c);});
    container.innerHTML='';container.appendChild(list);
    qsa('.remove-w').forEach(b=>b.addEventListener('click',e=>{const id=e.currentTarget.dataset.id;let w=load(STORAGE_WISH);w=w.filter(x=>x!==id);save(STORAGE_WISH,w);renderWishPage();updateCounts();}));
  }

  // Init per page
  function init(){
    updateCounts();
    const page=document.body.dataset.page||'';
    if(page==='products'){
      // populate filters
      const cats = Array.from(new Set((window.WB_PRODUCTS||[]).map(p=>p.category))).sort();
      const catSel=byId('filter-category'); if(catSel){catSel.innerHTML='<option value="">All categories</option>'+cats.map(c=>`<option value="${c}">${c}</option>`).join('');}
      const ages = Array.from(new Set((window.WB_PRODUCTS||[]).map(p=>p.age))).sort();
      const ageSel=byId('filter-age'); if(ageSel){ageSel.innerHTML='<option value="">All ages</option>'+ages.map(a=>`<option value="${a}">${a}</option>`).join('');}
      qsa('#filter-category,#filter-age,#sort-select').forEach(el=>el.addEventListener('change',applyFilters));
      const search=byId('search-input'); if(search){search.addEventListener('input',applyFilters)}
      applyFilters();
    }
    if(page==='product') renderProductDetail();
    if(page==='cart') renderCartPage();
    if(page==='wishlist') renderWishPage();
    // header actions
    qsa('[data-nav]').forEach(a=>a.addEventListener('click',()=>{}));
  }
  document.addEventListener('DOMContentLoaded',init);
})();
