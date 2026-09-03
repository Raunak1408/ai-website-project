// script.js — core functionality for WonderBox Kids
(function(){
  // helper: safe query
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // storage helpers
  const read = (k, def)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):def }catch(e){return def} };
  const write = (k,v)=>{ localStorage.setItem(k,JSON.stringify(v)); }

  // cart & wishlist API
  const CART_KEY='wb_cart_v1';
  const WISH_KEY='wb_wish_v1';
  function cartGet(){ return read(CART_KEY,[]); }
  function cartSave(c){ write(CART_KEY,c); updateCounts(); }
  function wishGet(){ return read(WISH_KEY,[]); }
  function wishSave(w){ write(WISH_KEY,w); updateCounts(); }

  function updateCounts(){
    const cart = cartGet(); const wish=wishGet();
    $$('#cart-count').forEach(el=>el.textContent=cart.reduce((s,i)=>s+i.qty,0));
    $$('#wish-count').forEach(el=>el.textContent=wish.length);
  }

  // find product by id
  function findProduct(id){ if(!window.WonderBox||!WonderBox.products) return null; return WonderBox.products.find(p=>p.id===id); }

  // Add to cart / wishlist
  function addToCart(id,qty=1){ const p=findProduct(id); if(!p) return; const cart=cartGet(); const existing=cart.find(i=>i.id===id); if(existing){ existing.qty+=qty } else cart.push({id,qty,price:p.price}); cartSave(cart); }
  function removeFromCart(id){ let cart=cartGet(); cart=cart.filter(i=>i.id!==id); cartSave(cart); }
  function setCartQty(id,qty){ const cart=cartGet(); const it=cart.find(i=>i.id===id); if(it){ it.qty=Math.max(0,qty); cartSave(cart); } }
  function addToWish(id){ const w=wishGet(); if(!w.includes(id)){ w.push(id); wishSave(w); } }
  function removeFromWish(id){ const w=wishGet().filter(i=>i!==id); wishSave(w); }

  // render product card helper
  function makeProductCard(p){ const card=document.createElement('div'); card.className='product-card'; card.innerHTML=`
    <a href="product.html?id=${encodeURIComponent(p.id)}"><img src="${p.image}" alt="${p.alt||p.name}"></a>
    <h4><a href="product.html?id=${encodeURIComponent(p.id)}">${p.name}</a></h4>
    <div class="meta">${p.category} • ${p.age}</div>
    <div class="price">$${p.price.toFixed(2)}</div>
    <div class="actions"><button data-id="${p.id}" class="add-cart btn">Add to cart</button> <button data-id="${p.id}" class="add-wish btn">♡</button></div>
  `; return card; }

  // init products page
  window.initProducts = function(){
    const grid = $('#products-grid'); if(!grid) return;
    // populate filters
    const catSel = $('#filter-category'); const ageSel = $('#filter-age');
    if(window.WonderBox && WonderBox.categories){
      WonderBox.categories.forEach(c=>{ const o=document.createElement('option'); o.value=c; o.textContent=c; catSel.appendChild(o); });
    }
    if(window.WonderBox && WonderBox.ages){ WonderBox.ages.forEach(a=>{ const o=document.createElement('option'); o.value=a; o.textContent=a; ageSel.appendChild(o); }); }

    // search & filter logic
    const searchInput = $('#search-input'); const resultCount = $('#result-count'); const sortSel=$('#sort-select'); const priceSel=$('#filter-price');

    function applyFilters(){
      let items = WonderBox.products.slice();
      const q=(searchInput&&searchInput.value||'').trim().toLowerCase();
      const cat=(catSel&&catSel.value)||'All'; const age=(ageSel&&ageSel.value)||'All'; const price=(priceSel&&priceSel.value)||'All';
      if(cat&&cat!=='All') items = items.filter(p=>p.category===cat);
      if(age&&age!=='All') items = items.filter(p=>p.age===age);
      if(price&&price!=='All'){
        const [min,max]=price.split('-').map(Number);
        items = items.filter(p=>p.price >= min && p.price <= (max||9999));
      }
      if(q) items = items.filter(p=> (p.name+ ' '+p.description + ' ' + p.category).toLowerCase().includes(q));
      // sort
      const sortVal = sortSel?sortSel.value:'relevance';
      if(sortVal==='price-asc') items.sort((a,b)=>a.price-b.price);
      if(sortVal==='price-desc') items.sort((a,b)=>b.price-a.price);
      renderList(items);
    }

    function renderList(items){
      grid.innerHTML=''; resultCount.textContent = items.length;
      items.forEach(p=>{ const card = makeProductCard(p); grid.appendChild(card); });
      // attach listeners
      grid.querySelectorAll('.add-cart').forEach(btn=>btn.addEventListener('click',e=>{ addToCart(btn.dataset.id); alert('Added to cart'); updateCounts(); }));
      grid.querySelectorAll('.add-wish').forEach(btn=>btn.addEventListener('click',e=>{ addToWish(btn.dataset.id); alert('Added to wishlist'); updateCounts(); }));
    }

    // initial
    applyFilters();
    // bind controls
    [searchInput, $('#search-btn')].forEach(el=>{ if(!el) return; el.addEventListener('click',()=>applyFilters()); });
    [searchInput].forEach(inp=>{ if(!inp) return; inp.addEventListener('keyup',e=>{ if(e.key==='Enter') applyFilters(); }); });
    [$('#filter-category'), $('#filter-age'), $('#filter-price'), $('#sort-select')].forEach(s=>{ if(!s) return; s.addEventListener('change',applyFilters) });
  };

  // init product detail page
  window.initProductDetail = function(){
    const cont = $('#product-detail'); if(!cont) return;
    const params = new URLSearchParams(location.search); const id = params.get('id'); if(!id){ cont.innerHTML='<p>Product not found</p>'; return; }
    const p = findProduct(id);
    if(!p){ cont.innerHTML='<p>Product not found</p>'; return; }
    cont.innerHTML = `
      <div class="product-detail">
        <div style="display:flex;gap:18px;flex-wrap:wrap">
          <div style="flex:1 1 320px"><img src="${p.image}" alt="${p.alt||p.name}" style="width:100%;border-radius:10px"></div>
          <div style="flex:1 1 320px">
            <h1>${p.name}</h1>
            <div class="meta">${p.category} • ${p.age}</div>
            <p class="price" style="font-size:22px;font-weight:700">$${p.price.toFixed(2)}</p>
            <p>${p.description}</p>
            <div class="actions"><button id="add-cart-btn" class="btn primary">Add to cart</button> <button id="add-wish-btn" class="btn">Add to wishlist</button></div>
          </div>
        </div>
      </div>
    `;
    const addBtn = $('#add-cart-btn'); const wishBtn=$('#add-wish-btn'); if(addBtn) addBtn.addEventListener('click',()=>{ addToCart(p.id); alert('Added to cart'); updateCounts(); }); if(wishBtn) wishBtn.addEventListener('click',()=>{ addToWish(p.id); alert('Added to wishlist'); updateCounts(); });
  };

  // cart page
  window.initCart = function(){
    const list = $('#cart-items'); if(!list) return; renderCart();
    function renderCart(){
      const cart = cartGet(); if(!cart.length){ list.innerHTML='<p>Your cart is empty.</p>'; $('#cart-total').textContent='0.00'; return; }
      list.innerHTML=''; let total=0;
      cart.forEach(item=>{
        const p=findProduct(item.id); if(!p) return;
        total += p.price*item.qty;
        const row = document.createElement('div'); row.className='product-card';
        row.innerHTML = `
          <div style="display:flex;gap:12px;align-items:center">
            <img src="${p.image}" alt="${p.name}" style="width:90px;height:70px;object-fit:cover;border-radius:8px">
            <div style="flex:1">
              <h4>${p.name}</h4>
              <div class="meta">${p.category} • ${p.age}</div>
            </div>
            <div style="text-align:right">
              <div>$${p.price.toFixed(2)}</div>
              <div style="margin-top:8px">Qty: <input data-id="${item.id}" class="cart-qty" type="number" min="0" value="${item.qty}" style="width:60px"></div>
              <div style="margin-top:8px"><button data-id="${item.id}" class="remove-cart btn">Remove</button></div>
            </div>
          </div>
        `;
        list.appendChild(row);
      });
      $('#cart-total').textContent = total.toFixed(2);
      // bind qty changes and remove
      $$('.cart-qty').forEach(inp=>inp.addEventListener('change',e=>{ const id=inp.dataset.id; const q=parseInt(inp.value,10)||0; if(q<=0){ removeFromCart(id); } else setCartQty(id,q); renderCart(); }));
      $$('.remove-cart').forEach(b=>b.addEventListener('click',e=>{ removeFromCart(b.dataset.id); renderCart(); }));
    }
    const checkout = $('#checkout-btn'); if(checkout) checkout.addEventListener('click',()=>{ if(!cartGet().length){ alert('Cart is empty'); return; } alert('Checkout simulated — thank you!'); write(CART_KEY,[]); renderCart(); updateCounts(); });
  };

  // wishlist page
  window.initWishlist = function(){
    const list = $('#wishlist-items'); if(!list) return; renderWish();
    function renderWish(){ const w=wishGet(); if(!w.length){ list.innerHTML='<p>Your wishlist is empty.</p>'; return; } list.innerHTML=''; w.forEach(id=>{ const p=findProduct(id); if(!p) return; const card=makeProductCard(p); // add wishlist actions
        const move = document.createElement('button'); move.textContent='Add to cart'; move.className='btn primary'; move.style.marginLeft='6px'; move.addEventListener('click',()=>{ addToCart(p.id); removeFromWish(p.id); renderWish(); updateCounts(); alert('Moved to cart'); });
        const rem = card.querySelector('.add-wish'); if(rem) rem.textContent='Remove'; rem.addEventListener('click',()=>{ removeFromWish(p.id); renderWish(); updateCounts(); });
        card.querySelector('.actions').appendChild(move); list.appendChild(card);
    }); }
  };

  // contact form
  window.initContact = function(){ const form = $('#contact-form'); if(!form) return; form.addEventListener('submit',e=>{ e.preventDefault(); const name = $('#c-name').value.trim(); const email=$('#c-email').value.trim(); const msg=$('#c-message').value.trim(); if(!name||!email||!msg){ $('#contact-feedback').textContent='Please fill all fields'; return; } // simulate save
    const contacts = read('wb_contacts',[]); contacts.push({name,email,msg,ts:Date.now()}); write('wb_contacts',contacts); form.reset(); $('#contact-feedback').textContent='Thanks! We received your message.'; }); };

  // top-level boot: update counts and attach mobile toggle
  document.addEventListener('DOMContentLoaded',()=>{ updateCounts(); const mt = $('#mobile-toggle'); if(mt){ mt.addEventListener('click',()=>{ const nav = document.querySelector('.main-nav'); if(nav) nav.style.display = nav.style.display==='flex'?'none':'flex'; }); }
  });

})();
