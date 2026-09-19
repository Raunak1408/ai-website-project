// JavaScript for PlayfulPaws Toys - Interactive Cart & UI

// Store sample products with age groups
const products = [
  { id: 1, title: "Robot Action Figure", rating: 4.5, price: 29.99, ageGroup: "8+", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80" },
  { id: 2, title: "STEM Building Blocks", rating: 4.7, price: 19.99, ageGroup: "4-7", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80" },
  { id: 3, title: "Plush Teddy Bear", rating: 4.8, price: 24.99, ageGroup: "0-3", image: "https://images.unsplash.com/photo-1503401298103-156b28e1a34b?auto=format&fit=crop&w=600&q=80" },
  { id: 4, title: "Family Board Game", rating: 4.2, price: 34.99, ageGroup: "8+", image: "https://images.unsplash.com/photo-1587825140708-fddb7f7a9f39?auto=format&fit=crop&w=600&q=80" },
  { id: 5, title: "Building Blocks Set", rating: 4.6, price: 19.99, ageGroup: "4-7", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80" },
  { id: 6, title: "Outdoor Ball Game", rating: 4.3, price: 15.49, ageGroup: "8+", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80" },
  { id: 7, title: "Soft Plush Puppy", rating: 4.7, price: 22.99, ageGroup: "0-3", image: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=600&q=80" },
  { id: 8, title: "Puzzle Board Game", rating: 4.4, price: 27.99, ageGroup: "4-7", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80" },
];

// Cart state
let cart = [];

// Select DOM elements
const productGrid = document.querySelector('.product-grid');
const filterTabs = document.querySelectorAll('.filter-tab');
const cartToggleBtn = document.getElementById('cart-toggle');
const cartDrawer = document.getElementById('cart-drawer');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElem = document.getElementById('cart-count');
const cartSubtotalElem = document.getElementById('cart-subtotal');
const checkoutBtn = document.getElementById('checkout-btn');
const closeCartBtn = document.getElementById('close-cart');

// Render products based on filter
function renderProducts(filter = 'all') {
  productGrid.innerHTML = '';
  const filteredProducts = filter === 'all' ? products : products.filter(p => {
    if (filter === '0-3') return p.ageGroup === '0-3';
    if (filter === '4-7') return p.ageGroup === '4-7';
    if (filter === '8+') return p.ageGroup === '8+';
    return true;
  });

  filteredProducts.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('tabindex', '0');

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <div class="star-rating" aria-label="Rating: ${product.rating} stars">${renderStars(product.rating)}</div>
        <p class="price">$${product.price.toFixed(2)}</p>
        <button class="btn btn-add-to-cart" aria-label="Add ${product.title} to cart">Add to Cart</button>
      </div>
    `;

    // Add event listener for Add to Cart button
    const addToCartBtn = card.querySelector('.btn-add-to-cart');
    addToCartBtn.addEventListener('click', () => addToCart(product.id));

    productGrid.appendChild(card);
  });
}

// Render star rating with partial stars
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? true : false;
  let starsHTML = '';
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '★';
  }
  if (halfStar) starsHTML += '☆';
  while (starsHTML.length < 5) {
    starsHTML += '☆';
  }
  return starsHTML;
}

// Add product to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.product.id === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ product, quantity: 1 });
  }
  updateCartUI();
}

// Update cart UI
function updateCartUI() {
  cartCountElem.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartItemsContainer.innerHTML = '';

  cart.forEach((item, index) => {
    const cartItemElem = document.createElement('div');
    cartItemElem.className = 'cart-item';
    cartItemElem.innerHTML = `
      <img src="${item.product.image}" alt="${item.product.title}" />
      <div class="cart-item-info">
        <div class="cart-item-title">${item.product.title}</div>
        <div class="cart-item-quantity">
          <button aria-label="Decrease quantity" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button aria-label="Increase quantity" data-index="${index}">+</button>
        </div>
      </div>
    `;

    // Attach quantity buttons listeners
    const decreaseBtn = cartItemElem.querySelector('button[aria-label="Decrease quantity"]');
    const increaseBtn = cartItemElem.querySelector('button[aria-label="Increase quantity"]');

    decreaseBtn.addEventListener('click', () => {
      changeQuantity(index, -1);
    });

    increaseBtn.addEventListener('click', () => {
      changeQuantity(index, 1);
    });

    cartItemsContainer.appendChild(cartItemElem);
  });

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  cartSubtotalElem.textContent = subtotal.toFixed(2);

  checkoutBtn.disabled = cart.length === 0;
}

// Change quantity of cart item
function changeQuantity(index, delta) {
  if (cart[index]) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    updateCartUI();
  }
}

// Filter tab click handler
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    renderProducts(tab.getAttribute('data-filter'));
  });
});

// Cart drawer toggle
cartToggleBtn.addEventListener('click', () => {
  cartDrawer.classList.add('active');
  cartDrawer.setAttribute('aria-hidden', 'false');
});

// Close cart drawer
closeCartBtn.addEventListener('click', () => {
  cartDrawer.classList.remove('active');
  cartDrawer.setAttribute('aria-hidden', 'true');
});

// Newsletter form submission
const newsletterForm = document.getElementById('newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = newsletterForm.email.value.trim();
  if (email) {
    alert(`Thank you for subscribing, ${email}!`);
    newsletterForm.reset();
  }
});

// Contact form submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (name && email && message) {
    alert(`Thank you for reaching out, ${name}! We will get back to you soon.`);
    contactForm.reset();
  }
});

// Initial render
renderProducts();
