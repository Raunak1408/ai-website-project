// JavaScript to handle interactivity for ToyJoy Land

// Toggle navigation menu
const navToggle = document.getElementById('nav-toggle-btn');
const navLinks = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

// Shopping Cart Implementation
const cartButton = document.getElementById('cart-button');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeCartBtn = document.getElementById('close-cart-btn');

let cart = [];

// Example products data for demonstration
const products = [
  {
    id: 1,
    name: 'Remote Control Car',
    category: 'action-figures',
    price: 29.99,
    age: 'Ages 5+',
    image: 'https://images.unsplash.com/photo-1600181951074-3a7be8cd9bcf?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Wooden Puzzle',
    category: 'puzzles',
    price: 19.99,
    age: 'Ages 3+',
    image: 'https://images.unsplash.com/photo-1509316785288-2c52251b2f9d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    name: 'Teddy Bear Plush',
    category: 'plush-toys',
    price: 24.99,
    age: 'Ages 2+',
    image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 4,
    name: 'Educational Kit',
    category: 'education-al',
    price: 39.99,
    age: 'Ages 6+',
    image: 'https://images.unsplash.com/photo-1590080877777-dc436973ff87?auto=format&fit=crop&w=400&q=80'
  }
];

// Render products to shop page
function renderProducts(filterCategory = 'all') {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return;
  productsGrid.innerHTML = '';

  const filteredProducts = filterCategory === 'all'
    ? products
    : products.filter(p => p.category === filterCategory);

  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-name">${product.name}</div>
      <div class="product-age">${product.age}</div>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;

    productsGrid.appendChild(card);
  });

  addAddToCartListeners();
}

// Add event listeners to 'Add to Cart' buttons
function addAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = parseInt(button.getAttribute('data-id'), 10);
      const product = products.find(p => p.id === productId);
      if (product) addToCart(product);
    });
  });
}

// Add product to cart
function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({...product, quantity: 1});
  }
  updateCartCount();
  openCartModal();
  renderCart();
  alert(`${product.name} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
  const index = cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
  }
  updateCartCount();
  renderCart();
}

// Render cart items and total
function renderCart() {
  if (!cartItemsContainer || !cartTotal) return;
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-name">${item.name} x${item.quantity}</div>
      <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      <button class="cart-close-btn" data-id="${item.id}" aria-label="Remove ${item.name} from cart">&times;</button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;

  // Add event listeners to remove buttons
  document.querySelectorAll('.cart-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'), 10);
      removeFromCart(id);
    });
  });
}

// Update cart count badge
function updateCartCount() {
  if (cartCount) {
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalQuantity;
  }
}

// Open cart modal
function openCartModal() {
  if (cartModal) cartModal.classList.add('show');
}

// Close cart modal
function closeCartModal() {
  if (cartModal) cartModal.classList.remove('show');
}

// Checkout button action
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    alert('Thank you for your purchase!');
    cart = [];
    updateCartCount();
    renderCart();
    closeCartModal();
  });
}

// Close cart button action
if (closeCartBtn) {
  closeCartBtn.addEventListener('click', () => {
    closeCartModal();
  });
}

// Contact Form Submission Handler
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm && formSuccess) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Basic validation handled by HTML5 required
    formSuccess.hidden = false;
    contactForm.reset();
  });
}

// Initial render of products in shop page
if (document.getElementById('products-grid')) {
  // Add filter button listeners
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      renderProducts(button.getAttribute('data-category'));
    });
  });

  renderProducts();
}

// Mobile nav close on link click
const navLinksList = document.querySelectorAll('#nav-links li a');
navLinksList.forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
    }
  });
});
