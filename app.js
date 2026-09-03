// ToyLand World - app.js
const PRODUCTS = [
  {id:1,title:'Educational Blocks Set',category:'Educational',price:29.99,stock:15,rating:4.7,img:'https://images.unsplash.com/photo-1587654562363-6054a493c3d6?w=600',desc:'Colorful wooden blocks to build creativity and motor skills.'},
  {id:2,title:'Plush Teddy Bear',category:'Plush',price:24.99,stock:20,rating:4.8,img:'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600',desc:'Soft and huggable teddy bear perfect for nap time.'},
  {id:3,title:'Racing Toy Car',category:'Action Figures',price:19.99,stock:12,rating:4.4,img:'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600',desc:'Fast and durable toy car for racing adventures.'},
  {id:4,title:'Family Board Puzzle',category:'Board Games',price:34.99,stock:8,rating:4.6,img:'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600',desc:'Challenging board puzzle for family game nights.'},
  {id:5,title:'Action Robot Figure',category:'Action Figures',price:39.99,stock:5,rating:4.5,img:'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600',desc:'Posable robot action figure with accessories.'},
  {id:6,title:'Eco Building Set',category:'Educational',price:49.99,stock:6,rating:4.9,img:'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600',desc:'Sustainable building set to inspire engineering.'},
  {id:7,title:'Plush Bunny Friend',category:'Plush',price:21.99,stock:18,rating:4.4,img:'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600&ixlib=rb-1.2.1',desc:'Cute plush bunny perfect for all ages.'},
  {id:8,title:'Kids Strategy Game',category:'Board Games',price:27.99,stock:10,rating:4.3,img:'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600&ixlib=rb-1.2.1',desc:'A strategy board game that sharpens thinking skills.'}
];

// Keys
const CART_KEY = 'toyland_cart_v1';
const WISH_KEY = 'toyland_wish_v1';

function readStorage(key){try{return JSON.parse(localStorage.getItem(key))||[]}catch(e){return []}}
function writeStorage(key,val){localStorage.setItem(key,JSON.stringify(val))}

function findProduct(id){return PRODUCTS.find(p=>p.id==id)}

function renderHeaderCounts(){const cart=readStorage(CART_KEY);const wish=readStorage(WISH_KEY);
  document.querySelectorAll('.cart-count').forEach(n=>n.textContent=cart.reduce((s,i)=>s+i.qty,0));
  document.querySelectorAll('.wish-count').forEach(n=>n.textContent=wish.length);
}

function addToCart(id,qty=1){let cart=readStorage(CART_KEY); const existing=cart.find(i=>i.id==id);
  if(existing){existing.qty=Math.min(findProduct(id).stock, existing.qty+qty)}else{cart.push({id,qty})}
  writeStorage(CART_KEY,cart); renderHeaderCounts(); if(window.location.pathname.includes('cart.html')) renderCart();}

function addToWish(id){let wish=readStorage(WISH_KEY); if(!wish.includes(id)){wish.push(id)} writeStorage(WISH_KEY,wish); renderHeaderCounts();}
function removeFromWish(id){let wish=readStorage(WISH_KEY); wish=wish.filter(i=>i!=id); writeStorage(WISH_KEY,wish); renderHeaderCounts();}

// ----------------------------------
// Index page render
function initIndex(){renderHeaderCounts();
  // hero image
  document.querySelector('.hero-right').style.backgroundImage = "url('https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200')";
  // categories click
  document.querySelectorAll('.cat-card').forEach(el=>el.addEventListener('click',()=>{const cat=el.dataset.cat; location.href='shop.html?category='+encodeURIComponent(cat)}));
  // Trending
  const container=document.getElementById('trendingGrid'); const trending=PRODUCTS.slice(0,4);
  trending.forEach(p=>{const card=document.createElement('div');card.className='product-card';card.innerHTML=`<img src="${p.img}" alt>${'<div class="meta"><h3>'+p.title+'</h3><div class="price">$'+p.price.toFixed(2)+'</div></div>'}<div class="actions"><button class="btn btn-add" data-id="${p.id}">Add to Cart</button><button class="btn btn-quick" data-id="${p.id}">Quick View</button></div>`;container.appendChild(card)});
  // attach actions
  document.getElementById('trendingGrid').addEventListener('click',e=>{const id=e.target.closest('[data-id]')?.dataset.id; if(!id) return; if(e.target.classList.contains('btn-add')){addToCart(Number(id)); alert('Added to cart')} if(e.target.classList.contains('btn-quick')){location.href='product-detail.html?id='+id}});
  // age filters
  document.querySelectorAll('.age').forEach(btn=>btn.addEventListener('click',()=>{location.href='shop.html?age='+btn.dataset.age}))
  // newsletter
  document.getElementById('subscribeBtn').addEventListener('click',()=>{const em=document.getElementById('newsEmail').value.trim(); if(!em||!em.includes('@')){alert('Please enter a valid email')}else{alert('Thanks for subscribing!');document.getElementById('newsEmail').value=''}})
}

// ----------------------------------
// Shop page
function initShop(){renderHeaderCounts(); const params=new URLSearchParams(location.search); const searchInput=document.getElementById('searchInput'); const catSelect=document.getElementById('categoryFilter'); const sortSelect=document.getElementById('sortSelect');
  function renderList(list){const grid=document.getElementById('productsGrid');grid.innerHTML=''; list.forEach(p=>{const d=document.createElement('div');d.className='product-card';d.innerHTML=`<img src="${p.img}" alt><div class="meta"><h3>${p.title}</h3><div class="price">$${p.price.toFixed(2)}</div></div><div class="card-actions"><div><span class="rating">⭐ ${p.rating}</span></div><div><button class="btn btn-add" data-id="${p.id}">Add</button><button class="wishlist" data-id="${p.id}">♡</button><a class="nav" href="product-detail.html?id=${p.id}">View</a></div></div>`;grid.appendChild(d)})}
  function applyFilters(){let results=PRODUCTS.slice(); const q=searchInput.value.trim().toLowerCase(); if(q) results=results.filter(p=>p.title.toLowerCase().includes(q)); const cat=catSelect.value; if(cat&&cat!=='All') results=results.filter(p=>p.category===cat); const sort=sortSelect.value; if(sort==='low') results.sort((a,b)=>a.price-b.price); if(sort==='high') results.sort((a,b)=>b.price-a.price); renderList(results)}
  // initialize controls
  searchInput.addEventListener('input',applyFilters); catSelect.addEventListener('change',applyFilters); sortSelect.addEventListener('change',applyFilters);
  // preset from URL
  if(params.get('category')) catSelect.value=params.get('category'); if(params.get('age')) searchInput.value=''; applyFilters();
  document.getElementById('productsGrid').addEventListener('click',e=>{const id=e.target.closest('[data-id]')?.dataset.id; if(!id) return; if(e.target.classList.contains('btn-add')){addToCart(Number(id)); alert('Added to cart')} if(e.target.classList.contains('wishlist')){addToWish(Number(id)); alert('Added to wishlist')}})
}

// ----------------------------------
// Product detail
function initProductDetail(){renderHeaderCounts(); const params=new URLSearchParams(location.search); const id=Number(params.get('id'))||1; const p=findProduct(id); if(!p) return; document.getElementById('pdTitle').textContent=p.title; document.getElementById('pdImg').src=p.img; document.getElementById('pdDesc').textContent=p.desc; document.getElementById('pdPrice').textContent='$'+p.price.toFixed(2); document.getElementById('pdStock').textContent=p.stock>0? 'In stock':'Out of stock';
  document.getElementById('addToCartBtn').addEventListener('click',()=>{const q=Number(document.getElementById('qtyInput').value)||1; addToCart(p.id,q); alert('Added to cart')})
  document.getElementById('qtyInc').addEventListener('click',()=>{const el=document.getElementById('qtyInput'); el.value=Math.min(p.stock,Number(el.value)+1)})
  document.getElementById('qtyDec').addEventListener('click',()=>{const el=document.getElementById('qtyInput'); el.value=Math.max(1,Number(el.value)-1)})
}

// ----------------------------------
// Cart page
function renderCart(){renderHeaderCounts(); const cart=readStorage(CART_KEY); const tbody=document.getElementById('cartBody'); tbody.innerHTML=''; let subtotal=0; cart.forEach(item=>{const p=findProduct(item.id); const tr=document.createElement('tr'); tr.innerHTML=`<td><img src="${p.img}" style="width:80px;height:60px;object-fit:cover;border-radius:8px"></td><td>${p.title}</td><td>$${p.price.toFixed(2)}</td><td><div class="qty"><button class="dec" data-id="${p.id}">-</button><input value="${item.qty}" data-id="${p.id}"><button class="inc" data-id="${p.id}">+</button></div></td><td>$${(p.price*item.qty).toFixed(2)}</td><td><button class="btn" data-id="${p.id}">Remove</button></td>`; tbody.appendChild(tr); subtotal+=p.price*item.qty});
  document.getElementById('subTotal').textContent='$'+subtotal.toFixed(2); const tax=subtotal*0.07; document.getElementById('taxAmt').textContent='$'+tax.toFixed(2); const shipping = subtotal>50?0:5.99; document.getElementById('shipAmt').textContent=shipping? '$'+shipping.toFixed(2):'Free'; document.getElementById('totalAmt').textContent='$'+(subtotal+tax+shipping).toFixed(2);
  // attach events
  tbody.querySelectorAll('.inc').forEach(b=>b.addEventListener('click',()=>{let cart=readStorage(CART_KEY); let it=cart.find(i=>i.id==b.dataset.id); const p=findProduct(Number(b.dataset.id)); if(it){it.qty=Math.min(p.stock,it.qty+1); writeStorage(CART_KEY,cart); renderCart()}}));
  tbody.querySelectorAll('.dec').forEach(b=>b.addEventListener('click',()=>{let cart=readStorage(CART_KEY); let it=cart.find(i=>i.id==b.dataset.id); if(it){it.qty=Math.max(1,it.qty-1); writeStorage(CART_KEY,cart); renderCart()}}));
  tbody.querySelectorAll('input').forEach(inp=>inp.addEventListener('change',()=>{let cart=readStorage(CART_KEY); let it=cart.find(i=>i.id==inp.dataset.id); let v=Math.max(1,Math.min(findProduct(Number(inp.dataset.id)).stock,Number(inp.value)||1)); if(it){it.qty=v; writeStorage(CART_KEY,cart); renderCart()}}));
  tbody.querySelectorAll('button').forEach(b=>{if(b.textContent==='Remove') b.addEventListener('click',()=>{let cart=readStorage(CART_KEY); cart=cart.filter(i=>i.id!=b.dataset.id); writeStorage(CART_KEY,cart); renderCart()})});
}

function initCart(){renderCart(); document.getElementById('checkoutForm').addEventListener('submit',e=>{e.preventDefault(); const name=document.getElementById('cName').value.trim(); const addr=document.getElementById('cAddress').value.trim(); const pay=document.getElementById('cPay').value; if(!name||!addr){alert('Please fill name and address');return} // simple
  // success
  localStorage.removeItem(CART_KEY); renderCart(); alert('Order placed! Thank you, '+name); document.getElementById('checkoutForm').reset();})}

// ----------------------------------
// Contact page
function initContact(){renderHeaderCounts(); document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault(); const name=document.getElementById('conName').value.trim(); const email=document.getElementById('conEmail').value.trim(); const msg=document.getElementById('conMsg').value.trim(); if(!name||!email||!msg||!email.includes('@')){alert('Please complete the form with a valid email');return} alert('Thanks '+name+' — we received your message.'); e.target.reset();})
  document.querySelectorAll('.faq-q').forEach(q=>q.addEventListener('click',()=>{q.nextElementSibling.classList.toggle('open')}))}

// -------------------------------
// Init on DOM
window.addEventListener('DOMContentLoaded',()=>{
  const path=location.pathname.split('/').pop(); renderHeaderCounts(); if(path==''||path=='index.html'){initIndex()} if(path=='shop.html'){initShop()} if(path=='product-detail.html'){initProductDetail()} if(path=='cart.html'){initCart()} if(path=='contact.html'){initContact()}
  // mobile toggle
  const mt=document.getElementById('mobileToggle'); if(mt) mt.addEventListener('click',()=>{document.querySelector('.nav').classList.toggle('open')})
});
