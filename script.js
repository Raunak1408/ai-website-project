// ToyLand World - Main JS
const PRODUCTS = [
  {id:1,title:'Colorful Building Blocks',category:'Educational',price:24.99,rating:4.6,stock:12,age:'0-3',image:'https://images.unsplash.com/photo-1587654562363-6054a493c3d6?w=600',desc:'Bright wooden blocks that help develop motor skills and creativity.'},
  {id:2,title:'Cuddly Teddy Bear',category:'Plush',price:19.99,rating:4.8,stock:8,age:'0-3',image:'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600',desc:'Soft plush teddy bear perfect for bedtime hugs.'},
  {id:3,title:'Racing Toy Car',category:'Vehicles',price:14.99,rating:4.3,stock:20,age:'4-7',image:'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600',desc:'Fast toy car with pull-back action.'},
  {id:4,title:'Family Board Game',category:'Board Games',price:29.99,rating:4.7,stock:5,age:'8-12',image:'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600',desc:'A fun board game for family nights.'},
  {id:5,title:'Action Robot Figure',category:'Action Figures',price:22.5,rating:4.2,stock:15,age:'8-12',image:'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600',desc:'Poseable robot action figure with accessories.'},
  {id:6,title:'Learning Puzzle Set',category:'Educational',price:17.49,rating:4.4,stock:10,age:'4-7',image:'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600',desc:'Engaging puzzles to boost logic and patience.'},
  {id:7,title:'Mini Plush Puppy',category:'Plush',price:12.99,rating:4.5,stock:25,age:'0-3',image:'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600',desc:'Adorable mini plush puppy for kids on the go.'},
  {id:8,title:'Superhero Action Figure',category:'Action Figures',price:27.0,rating:4.6,stock:7,age:'8-12',image:'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600',desc:'Collectible superhero figure with cape.'}
];

// localStorage keys
const CART_KEY = 'toyland_cart';
const WISH_KEY = 'toyland_wishlist';

function getCart(){return JSON.parse(localStorage.getItem(CART_KEY)||'[]')}
function saveCart(c){localStorage.setItem(CART_KEY,JSON.stringify(c))}
function getWish(){return JSON.parse(localStorage.getItem(WISH_KEY)||'[]')}
function saveWish(w){localStorage.setItem(WISH_KEY,JSON.stringify(w))}

function updateBadges(){
  const cartCount = getCart().reduce((s,i)=>s+i.qty,0);
  const wishCount = getWish().length;
  document.querySelectorAll('.cart-count').forEach(el=>el.textContent=cartCount);
  document.querySelectorAll('.wish-count').forEach(el=>el.textContent=wishCount);
}

function addToCart(productId, qty=1){
  const cart = getCart();
  const found = cart.find(i=>i.id===productId);
  if(found){found.qty += qty}else{cart.push({id:productId,qty:qty})}
  saveCart(cart);
  updateBadges();
}

function removeFromCart(productId){
  let cart = getCart().filter(i=>i.id!==productId);
  saveCart(cart);updateBadges();renderCartTable && renderCartTable();
}

function setCartQty(productId, qty){
  let cart = getCart();
  const item = cart.find(i=>i.id===productId);
  if(item){item.qty = qty; if(item.qty<1) removeFromCart(productId); else saveCart(cart)}
  updateBadges();renderCartTable && renderCartTable();
}

function toggleWish(id){
  let w = getWish();
  const exists = w.includes(id);
  if(exists) w = w.filter(i=>i!==id); else w.push(id);
  saveWish(w); updateBadges(); renderWishlistIcons && renderWishlistIcons();
}

// Utility: find product by id
function getProductById(id){return PRODUCTS.find(p=>p.id===Number(id))}

// Page specific renders
function renderProductsList(container, list){
  container.innerHTML='';
  list.forEach(p=>{
    const card = document.createElement('div');card.className='card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <div class="title">${p.title}</div>
      <div class="small">${p.category} • Age ${p.age}</div>
      <div class="price">$${p.price.toFixed(2)}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
        <div class="controls">
          <button class="btn add" data-id="${p.id}">Add to Cart</button>
          <button class="btn secondary quick" data-id="${p.id}">Quick View</button>
        </div>
        <div style="text-align:right">
          <div class="small">⭐ ${p.rating}</div>
          <div class="heart" data-id="${p.id}">♡</div>
        </div>
      </div>
    `;
    container.appendChild(card);
  })
}

function renderWishlistIcons(){
  const w = getWish();
  document.querySelectorAll('.heart').forEach(el=>{
    const id = Number(el.dataset.id);
    if(w.includes(id)) el.classList.add('active'); else el.classList.remove('active');
    el.textContent = w.includes(id)?'❤':'♡';
    el.onclick = ()=>toggleWish(id);
  })
}

// Search/filter on shop page
function setupShopPage(){
  const listEl = document.getElementById('product-list');
  const search = document.getElementById('search');
  const categoryBtns = document.querySelectorAll('[data-cat]');
  const sortSel = document.getElementById('sort');
  let filtered = [...PRODUCTS];

  function applyFilters(){
    let q = search.value.toLowerCase();
    let cat = document.querySelector('.cat-active')?.dataset.cat || 'All';
    filtered = PRODUCTS.filter(p=> (cat==='All' || p.category===cat) && p.title.toLowerCase().includes(q));
    const sort = sortSel.value;
    if(sort==='low') filtered.sort((a,b)=>a.price-b.price)
    if(sort==='high') filtered.sort((a,b)=>b.price-a.price)
    renderProductsList(listEl,filtered);
    // attach events
    document.querySelectorAll('.add').forEach(b=>b.addEventListener('click',e=>{addToCart(Number(e.target.dataset.id)); alert('Added to cart') }));
    document.querySelectorAll('.quick').forEach(b=>b.addEventListener('click',e=>{window.location.href='product-detail.html?id='+e.target.dataset.id}));
    renderWishlistIcons();
  }

  search.addEventListener('input',applyFilters);
  sortSel.addEventListener('change',applyFilters);
  categoryBtns.forEach(b=>{
    b.addEventListener('click',()=>{
      categoryBtns.forEach(x=>x.classList.remove('cat-active'));
      b.classList.add('cat-active');
      applyFilters();
    })
  })

  // apply query params
  const params = new URLSearchParams(location.search);
  const q = params.get('q'); if(q){search.value=q}
  const catQ = params.get('category'); if(catQ){document.querySelectorAll('[data-cat]').forEach(b=>{if(b.dataset.cat===catQ) b.click()})}
  const ageQ = params.get('age'); if(ageQ){ /* filter by age */ }

  applyFilters();
}

// product detail page
function setupProductDetail(){
  const id = new URLSearchParams(location.search).get('id');
  const p = getProductById(id);
  if(!p) return;
  document.getElementById('pd-title').textContent = p.title;
  document.getElementById('pd-main-img').src = p.image;
  document.getElementById('pd-price').textContent = '$'+p.price.toFixed(2);
  document.getElementById('pd-desc').textContent = p.desc;
  document.getElementById('pd-stock').textContent = p.stock>0? 'In Stock':'Out of Stock';
  // thumbs
  const thumbs = document.getElementById('pd-thumbs');
  const imgs = [p.image, PRODUCTS[0].image, PRODUCTS[2].image];
  thumbs.innerHTML='';
  imgs.forEach((src,idx)=>{
    const im = document.createElement('img');im.src=src; if(idx===0) im.classList.add('active');
    im.addEventListener('click',()=>{document.getElementById('pd-main-img').src=src; document.querySelectorAll('#pd-thumbs img').forEach(i=>i.classList.remove('active'));im.classList.add('active')});
    thumbs.appendChild(im);
  })
  // qty controls
  const qtyInput = document.getElementById('pd-qty');
  document.getElementById('pd-dec').addEventListener('click',()=>{if(qtyInput.value>1) qtyInput.value=Number(qtyInput.value)-1});
  document.getElementById('pd-inc').addEventListener('click',()=>{qtyInput.value=Number(qtyInput.value)+1});
  document.getElementById('pd-add').addEventListener('click',()=>{addToCart(Number(id),Number(qtyInput.value)); alert('Added to cart');});
}

// index page setup (featured, trending, newsletter)
function setupIndexPage(){
  const featured = document.getElementById('featured-cats');
  const cats = [
    {name:'Action Figures',img:PRODUCTS.find(p=>p.category==='Action Figures')?.image||PRODUCTS[4].image},
    {name:'Educational Toys',img:PRODUCTS.find(p=>p.category==='Educational')?.image||PRODUCTS[0].image},
    {name:'Board Games',img:PRODUCTS.find(p=>p.category==='Board Games')?.image||PRODUCTS[3].image},
    {name:'Plush Toys',img:PRODUCTS.find(p=>p.category==='Plush')?.image||PRODUCTS[1].image}
  ];
  featured.innerHTML='';
  cats.forEach(c=>{
    const el = document.createElement('div');el.className='category';
    el.innerHTML = `<img src="${c.img}"><div class="title">${c.name}</div>`;
    el.addEventListener('click',()=>{window.location.href='shop.html?category='+encodeURIComponent(c.name)});
    featured.appendChild(el);
  })
  const trending = document.getElementById('trending');
  renderProductsList(trending, PRODUCTS.slice(0,4));
  document.querySelectorAll('.add').forEach(b=>b.addEventListener('click',e=>{addToCart(Number(e.target.dataset.id));alert('Added to cart')}));
  document.querySelectorAll('.quick').forEach(b=>b.addEventListener('click',e=>{window.location.href='product-detail.html?id='+e.target.dataset.id}));
  renderWishlistIcons();

  // newsletter
  document.getElementById('newsletter-form').addEventListener('submit',e=>{e.preventDefault();const em=document.getElementById('newsletter-email').value; if(!em.includes('@')){alert('Please enter a valid email')} else{alert('Thanks for subscribing!'); document.getElementById('newsletter-email').value=''}})
}

// cart page
function renderCartTable(){
  const tbody = document.getElementById('cart-body'); if(!tbody) return;
  const cart = getCart(); tbody.innerHTML='';
  let subtotal=0;
  cart.forEach(item=>{
    const p = getProductById(item.id);
    const tr = document.createElement('tr');
    const total = p.price*item.qty; subtotal+=total;
    tr.innerHTML = `
      <td><img src="${p.image}"></td>
      <td>${p.title}</td>
      <td>$${p.price.toFixed(2)}</td>
      <td><div class="qty"><button data-id="${p.id}" class="dec">-</button><div style="padding:0 8px">${item.qty}</div><button data-id="${p.id}" class="inc">+</button></div></td>
      <td>$${total.toFixed(2)}</td>
      <td><button class="btn remove" data-id="${p.id}">Remove</button></td>
    `;
    tbody.appendChild(tr);
  })
  document.getElementById('summary-subtotal').textContent = '$'+subtotal.toFixed(2);
  const tax = subtotal*0.07; const shipping = subtotal>50?0:5.99; const grand = subtotal+tax+shipping;
  document.getElementById('summary-tax').textContent = '$'+tax.toFixed(2);
  document.getElementById('summary-ship').textContent = shipping===0?'Free':'$'+shipping.toFixed(2);
  document.getElementById('summary-total').textContent = '$'+grand.toFixed(2);

  // attach events
  document.querySelectorAll('.remove').forEach(b=>b.addEventListener('click',e=>{removeFromCart(Number(e.target.dataset.id))}));
  document.querySelectorAll('.dec').forEach(b=>b.addEventListener('click',e=>{const id=Number(e.target.dataset.id); const cart=getCart(); const it=cart.find(x=>x.id===id); if(it){setCartQty(id, it.qty-1)}}));
  document.querySelectorAll('.inc').forEach(b=>b.addEventListener('click',e=>{const id=Number(e.target.dataset.id); const cart=getCart(); const it=cart.find(x=>x.id===id); if(it){setCartQty(id, it.qty+1)}}));
}

function setupCartPage(){
  renderCartTable();
  document.getElementById('checkout-form').addEventListener('submit',e=>{
    e.preventDefault();
    // basic validation
    const name = document.getElementById('c-name').value.trim();
    const addr = document.getElementById('c-address').value.trim();
    const pay = document.querySelector('input[name="payment"]:checked');
    if(!name||!addr||!pay){alert('Please complete the form');return}
    alert('Order placed! Thank you '+name);
    // clear cart
    saveCart([]); updateBadges(); renderCartTable();
    document.getElementById('checkout-form').reset();
  })
}

// contact page
function setupContactPage(){
  document.getElementById('contact-form').addEventListener('submit',e=>{
    e.preventDefault();
    const name = document.getElementById('ct-name').value.trim();
    const email = document.getElementById('ct-email').value.trim();
    const msg = document.getElementById('ct-message').value.trim();
    if(!name||!email||!msg||!email.includes('@')){alert('Please fill form correctly');return}
    alert('Message sent. We will contact you soon.');
    document.getElementById('contact-form').reset();
  })
  // accordion
  document.querySelectorAll('.accordion button').forEach(btn=>btn.addEventListener('click',()=>{const content=btn.nextElementSibling; content.style.display = content.style.display==='block'?'none':'block'}))
}

// mobile menu
function setupMobileMenu(){
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  toggle && toggle.addEventListener('click',()=>{drawer.classList.toggle('show')});
  document.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click',()=>drawer.classList.remove('show')));
}

// general init
document.addEventListener('DOMContentLoaded',()=>{
  updateBadges(); setupMobileMenu();
  if(document.body.classList.contains('page-shop')) setupShopPage();
  if(document.body.classList.contains('page-index')) setupIndexPage();
  if(document.body.classList.contains('page-detail')) setupProductDetail();
  if(document.body.classList.contains('page-cart')) setupCartPage();
  if(document.body.classList.contains('page-contact')) setupContactPage();
});
