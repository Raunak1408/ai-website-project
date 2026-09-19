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
    image: 'https://images.unsplash.com/photo-1600180758895-37a43c12693b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Wooden Puzzle',
    category: 'puzzles',
    price: 19.99,
    age: 'Ages 3+',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba9365c41e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    name: 'Teddy Bear Plush',
    category: 'plush-toys',
    price: 24.99,
    age: 'Ages 2+',
    image: 'https://images.unsplash.com/photo-1511193311912-7e90b7844243?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 4,
    name: 'Educational Kit',
    category: 'educational-toys',
    price: 39.99,
    age: 'Ages 6+',
    image: 'https://images.unsplash.com/photo-1594561058021-e0e4f2a7ae4b?auto=format&fit=crop&w=400&q=80'
  }
];

// Render products
function renderProducts(filterCategory = 'all') {
  if (!document.getElementById('products-grid')) return;
  const productsGrid = document.getElementById('products-grid');
  productsGrid.innerHTML = '';
  
  const filteredProducts = filterCategory === 'all'
    ? products
    : products.filter(p => p.category === filterCategory);
  
  filteredProducts.forEach(product => {
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
  setUpAddToCartListeners();
}

// Setup filter buttons
function setUpFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      renderProducts(button.getAttribute('data-category'));
    });
  });
}

// Cart state
let cart = [];

// Update cart count in header
function updateCartCount() {
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = totalQuantity;
  }
}

// Render cart items in modal
function renderCartItems() {
  if (!cartItemsContainer) return;
  cartItemsContainer.innerHTML = '';

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span class="item-name">${item.name}</span>
      <span class="item-quantity">x${item.quantity}</span>
      <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
      <button class="remove-from-cart" data-id="${item.id}" aria-label="Remove ${item.name} from cart">&times;</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  if (cartTotalEl) {
    cartTotalEl.textContent = `Total: $${totalAmount.toFixed(2)}`;
  }

  setUpRemoveFromCartListeners();
}

// Add to cart
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({...product, quantity: 1});
  }
  updateCartCount();
  renderCartItems();
  openCartModal();
  alert(`${product.name} added to cart!`);
}

// Setup add to cart button listeners
function setUpAddToCartListeners() {
  const addButtons = document.querySelectorAll('.add-to-cart');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const product = products.find(p => p.id === id);
      if (product) addToCart(product);
    });
  });
}

// Remove item from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartCount();
  renderCartItems();
}

// Setup remove buttons in cart
function setUpRemoveFromCartListeners() {
  const removeButtons = document.querySelectorAll('.remove-from-cart');
  removeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      removeFromCart(id);
    });
  });
}

// Open cart modal
function openCartModal() {
  if (cartModal) {
    cartModal.classList.add('show');
  }
}

// Close cart modal
function closeCartModal() {
  if (cartModal) {
    cartModal.classList.remove('show');
  }
}

// Event listeners for cart buttons
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

// Checkout button
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    alert('Thank you for your purchase!');
    cart = [];
    updateCartCount();
    renderCartItems();
    closeCartModal();
  });
}

// Contact form submission handling
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    formSuccess.classList.remove('hidden');
    contactForm.reset();
  });
}

// Initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  setUpFilters();
});
