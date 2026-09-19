// JavaScript to handle interactivity for ToyJoy Land

// Toggle navigation menu
const navToggleBtn = document.getElementById('nav-toggle-btn');
const navLinks = document.getElementById('nav-links');

if (navToggleBtn) {
  navToggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

// Cart related elements
const cartButton = document.getElementById('cart-button');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeCartBtn = document.getElementById('close-cart-btn');

// Product data for the shop page
const products = [
  {
    id: 1,
    name: 'Remote Control Car',
    category: 'action-figures',
    price: 29.99,
    age: 'Ages 3+',
    image: 'https://images.unsplash.com/photo-1600185366056-75ef05baedce?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Wooden Puzzle',
    category: 'puzzles',
    price: 19.99,
    age: 'Ages 3+',
    image: 'https://images.unsplash.com/photo-1505575967455-6a3b6a5f1061?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    name: 'Teddy Bear Plush',
    category: 'plush-toys',
    price: 24.99,
    age: 'Ages 2+',
    image: 'https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 4,
    name: 'Educational Kit',
    category: 'educational-toys',
    price: 39.99,
    age: 'Ages 6+',
    image: 'https://images.unsplash.com/photo-1582095133179-a4537a3eab2a?auto=format&fit=crop&w=400&q=80'
  }
];

// Render products based on filter
function renderProducts(filterCategory = 'all') {
  if (!document.getElementById('products-grid')) return;
  const productsGrid = document.getElementById('products-grid');
  productsGrid.innerHTML = '';
  
  const filteredProducts = filterCategory === 'all' ? products : products.filter(p => p.category === filterCategory);
  
  filteredProducts.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-name">${product.name}</div>
      <div class="product-age">${product.age}</div>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;
    productsGrid.appendChild(card);
  });
  setupAddToCartListeners();
}

// Setup filter buttons
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.getAttribute('data-category'));
    });
  });
}

// Cart functionality
let cart = [];

function updateCartCount() {
  let totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = totalQuantity;
}

function openCartModal() {
  if (cartModal) {
    cartModal.classList.add('show');
  }
}

function closeCartModal() {
  if (cartModal) {
    cartModal.classList.remove('show');
  }
}

function renderCartItems() {
  if (!cartItemsContainer || !cartTotalEl) return;
  cartItemsContainer.innerHTML = '';
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalEl.textContent = '';
    return;
  }
  let total = 0;
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div><strong>${item.name}</strong> (x${item.quantity})</div>
      <div>Price: $${(item.price * item.quantity).toFixed(2)}</div>
      <button class="remove-from-cart" data-id="${item.id}">Remove</button>
    `;
    cartItemsContainer.appendChild(div);
    total += item.price * item.quantity;
  });
  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({...product, quantity: 1});
  }
  updateCartCount();
  renderCartItems();
  openCartModal();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartCount();
  renderCartItems();
}

// Setup event listeners for add to cart buttons
function setupAddToCartListeners() {
  const addButtons = document.querySelectorAll('.add-to-cart');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      addToCart(id);
    });
  });
}

// Setup listeners for remove from cart buttons
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-from-cart')) {
    const id = parseInt(e.target.getAttribute('data-id'));
    removeFromCart(id);
  }
});

// Setup cart open/close buttons
if (cartButton) {
  cartButton.addEventListener('click', () => {
    if (cartModal.classList.contains('show')) {
      closeCartModal();
    } else {
      openCartModal();
    }
  });
}

if (closeCartBtn) {
  closeCartBtn.addEventListener('click', () => {
    closeCartModal();
  });
}

// Contact form submission
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (contactForm.checkValidity()) {
      formSuccess.classList.remove('hidden');
      contactForm.reset();
    } else {
      contactForm.reportValidity();
    }
  });
}

// Initialize all functions on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  setupFilterButtons();
});
