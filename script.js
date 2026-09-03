// Core site script for WonderBox Kids (products, cart, wishlist, contact)
(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  const CART_KEY = 'wb_cart_v1';
  const WISH_KEY = 'wb_wish_v1';
  const CONTACTS_KEY = 'wb_contacts_v1';

  const products = (window.WonderBox && window.WonderBox.products) || [];

  function read(key){ try{ return JSON.parse(localStorage.getItem(key)) || []; }catch(e){return []} }
  function write(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

  let cart = read(CART_KEY); // array of {id, qty, qtyType?}
  let wish = read(WISH_KEY);

  function saveCart(){ write(CART_KEY, cart); updateCounts(); }
  function saveWish(){ write(WISH_KEY, wish); updateCounts(); }

  function updateCounts(){
    const cartCount = cart.reduce((s,i)=>s+(i.qty||1),0);
    const wishCount = wish.length;
    $$('#cart-count').forEach(el=>el.textContent = cartCount);
    $$('#wish-count').forEach(el=>el.textContent = wishCount);
  }

  function formatPrice(n){ return '$'+(n||0).toFixed(2); }

  function makeCard(p){
    const el = document.createElement('div'); el.className='product-card';
    el.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div class="meta">${p.category} • ${p.age}</div>
      <div class="price">${formatPrice(p.price)}</div>
      <div class="card-actions">
        <a class="btn" href="product.html?id=${encodeURIComponent(p.id)}">View</a>
        <button class="btn" data-add="cart" data-id="${p.id}">Add to cart</button>
        <button class="btn" data-add="wish" data-id="${p.id}">♡ Wish</button>
      </div>`;
    return el;
  }

  function renderFeatured(){
    const grid = $('#featured-grid'); if(!grid) return;
    grid.innerHTML=''; products.slice(0,4).forEach(p=>grid.appendChild(makeCard(p)));
  }

  // Products page
  function initProductsPage(){
    const grid = $('#products-grid'); if(!grid) return;
    const search = $('#search-input'); const cat = $('#filter-category'); const age = $('#filter-age'); const price = $('#filter-price'); const sort = $('#sort-select'); const results = $('#results-count');

    // populate category & age selects
    const cats = Array.from(new Set(products.map(p=>p.category))).sort();
    cats.forEach(c=>{ const o=document.createElement('option'); o.value=c; o.textContent=c; cat.appendChild(o); });
    const ages = Array.from(new Set(products.map(p=>p.age))).sort();
    ages.forEach(a=>{ const o=document.createElement('option'); o.value=a; o.textContent=a; age.appendChild(o); });

    function apply(){
      const q = (search && search.value || '').trim().toLowerCase();
      const cval = (cat && cat.value) || 'All';
      const aval = (age && age.value) || 'All';
      const pval = (price && price.value) || 'All';
      const sval = (sort && sort.value) || 'relevance';

      let list = products.slice();
      if(q) list = list.filter(p=> (p.name+p.description).toLowerCase().includes(q));
      if(cval && cval!=='All') list = list.filter(p=>p.category===cval);
      if(aval && aval!=='All') list = list.filter(p=>p.age===aval);
      if(pval && pval!=='All'){
        const [min,max] = pval.split('-').map(Number);
        list = list.filter(p=>p.price>=min && p.price<=max);
      }
      if(sval==='price-asc') list.sort((a,b)=>a.price-b.price);
      if(sval==='price-desc') list.sort((a,b)=>b.price-a.price);
      if(sval==='rating-desc') list.sort((a,b)=>b.rating-b.rating?b.rating-a.rating:0);

      grid.innerHTML=''; list.forEach(p=>grid.appendChild(makeCard(p)));
      results.textContent = list.length + ' result' + (list.length===1?'':'s');
    }

    [search,cat,age,price,sort].forEach(el=> el && el.addEventListener('input', apply));
    apply();
  }

  // Product detail
  function initProductDetail(){
    const container = $('#product-detail'); if(!container) return;
    const params = new URLSearchParams(location.search); const id = params.get('id');
    if(!id){ container.innerHTML = '<p>Product not found.</p>'; return; }
    const p = products.find(x=>x.id===id);
    if(!p){ container.innerHTML = '<p>Product not found.</p>'; return; }

    container.innerHTML = `
      <div class="product-card" style="flex-direction:row;gap:18px">
        <img src="${p.image}" alt="${p.name}" style="height:260px;width:320px;object-fit:cover">
        <div style="flex:1">
          <h2>${p.name}</h2>
          <div class="meta">${p.category} • ${p.age}</div>
          <p class="muted">${p.description}</p>
          <div class="price" style="font-size:20px;margin-top:8px">${formatPrice(p.price)}</div>
          <div style="margin-top:12px;display:flex;gap:10px">
            <button class="btn primary" data-add="cart" data-id="${p.id}">Add to cart</button>
            <button class="btn" data-add="wish" data-id="${p.id}">Add to wishlist</button>
          </div>
        </div>
      </div>`;
  }

  // Cart page
  function renderCartPage(){
    const container = $('#cart-items'); if(!container) return;
    container.innerHTML=''; if(!cart.length){ container.innerHTML='<p>Your cart is empty.</p>'; $('#cart-total').textContent = formatPrice(0); return; }
    let total = 0;
    cart.forEach(item=>{
      const p = products.find(x=>x.id===item.id); if(!p) return;
      const qty = item.qty||1; total += p.price * qty;
      const div = document.createElement('div'); div.className='cart-item';
      div.innerHTML = `
        <img src="${p.image}" alt="${p.name}" style="width:110px;height:80px;object-fit:cover;border-radius:8px">
        <div style="flex:1">
          <div><strong>${p.name}</strong></div>
          <div class="muted">${p.category} • ${p.age}</div>
          <div style="margin-top:8px">${formatPrice(p.price)} x <span class="mut">${qty}</span></div>
        </div>
        <div class="qty">
          <button class="btn small" data-qty="dec" data-id="${p.id}">-</button>
          <div>${qty}</div>
          <button class="btn small" data-qty="inc" data-id="${p.id}">+</button>
          <button class="btn" data-remove="cart" data-id="${p.id}">Remove</button>
        </div>`;
      container.appendChild(div);
    });
    $('#cart-total').textContent = formatPrice(total);
  }

  function initCartPage(){
    if(!$('#cart-items')) return;
    renderCartPage();
    document.body.addEventListener('click', e=>{
      const t = e.target;
      if(t.dataset.qty){ const id = t.dataset.id; const op = t.dataset.qty; const it = cart.find(i=>i.id===id); if(!it) return; if(op==='inc') it.qty = (it.qty||1)+1; if(op==='dec') it.qty = Math.max(1,(it.qty||1)-1); saveCart(); renderCartPage(); }
      if(t.dataset.remove==='cart'){ const id=t.dataset.id; cart = cart.filter(i=>i.id!==id); saveCart(); renderCartPage(); }
      if(t.id==='checkout'){ if(!cart.length){ alert('Cart is empty'); return; } alert('Thank you for your order! (Demo checkout)'); cart = []; saveCart(); renderCartPage(); }
    });
  }

  // Wishlist
  function renderWishPage(){
    const container = $('#wish-items'); if(!container) return;
    container.innerHTML=''; if(!wish.length){ container.innerHTML='<p>Your wishlist is empty.</p>'; return; }
    wish.forEach(id=>{
      const p = products.find(x=>x.id===id); if(!p) return;
      const div = document.createElement('div'); div.className='cart-item';
      div.innerHTML = `
        <img src="${p.image}" alt="${p.name}" style="width:110px;height:80px;object-fit:cover;border-radius:8px">
        <div style="flex:1">
          <div><strong>${p.name}</strong></div>
          <div class="muted">${p.category} • ${p.age}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="btn" data-add="cart" data-id="${p.id}">Add to cart</button>
          <button class="btn" data-remove="wish" data-id="${p.id}">Remove</button>
        </div>`;
      container.appendChild(div);
    });
  }

  function initWishPage(){
    if(!$('#wish-items')) return;
    renderWishPage();
    document.body.addEventListener('click', e=>{
      const t = e.target;
      if(t.dataset.remove==='wish'){ wish = wish.filter(x=>x!==t.dataset.id); saveWish(); renderWishPage(); }
      if(t.dataset.add==='cart'){ const id = t.dataset.id; const it = cart.find(i=>i.id===id); if(it) it.qty = (it.qty||1)+1; else cart.push({id,qty:1}); saveCart(); // also remove from wish
        wish = wish.filter(x=>x!==id); saveWish(); renderWishPage(); }
    });
  }

  // Universal add to cart / wish handlers
  document.body.addEventListener('click', e=>{
    const t = e.target;
    if(t.dataset.add==='cart'){
      const id = t.dataset.id; const it = cart.find(i=>i.id===id);
      if(it) it.qty = (it.qty||1)+1; else cart.push({id,qty:1}); saveCart(); alert('Added to cart');
    }
    if(t.dataset.add==='wish'){
      const id = t.dataset.id; if(!wish.includes(id)){ wish.push(id); saveWish(); alert('Added to wishlist'); } else { alert('Already in wishlist'); }
    }
    if(t.dataset.remove==='wish'){
      const id = t.dataset.id; wish = wish.filter(x=>x!==id); saveWish(); renderWishPage();
    }
  });

  // Contact form
  function initContact(){
    const form = $('#contact-form'); if(!form) return;
    const feedback = $('#contact-feedback');
    form.addEventListener('submit', e=>{
      e.preventDefault(); const name = $('#c-name').value.trim(); const email = $('#c-email').value.trim(); const msg = $('#c-message').value.trim();
      if(!name || !email || !msg){ feedback.textContent = 'Please complete all fields.'; return; }
      const contacts = read(CONTACTS_KEY);
      contacts.push({name,email,msg,date:new Date().toISOString()}); write(CONTACTS_KEY,contacts);
      feedback.textContent = 'Thanks — your message has been sent (demo).'; form.reset();
    });
  }

  // Attach product buttons on pages that list products
  function attachProductButtons(){
    // handled via delegation in document.body click above
  }

  // Init routine
  function init(){
    // set years
    $$('#year,#year2,#year3,#year4,#year5,#year6').forEach(el=>el && (el.textContent = new Date().getFullYear()));
    updateCounts(); renderFeatured(); initProductsPage(); initProductDetail(); initCartPage(); initWishPage(); initContact();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
