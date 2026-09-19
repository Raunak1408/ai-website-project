// JavaScript to handle interactivity for ToyJoy Land

// Toggle navigation menu
const navToggleBtn = document.getElementById('nav-toggle-btn');
const navLinks = document.getElementById('nav-links');

if(navToggleBtn) {
  navToggleBtn.addEventListener('click', () => {
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
    age: 'Ages 3+',
    image: 'https://images.unsplash.com/photo-1600180758896-2f3fd8457689?auto=format&fit=crop&w=400&q=80'
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
    image: 'https://images.unsplash.com/photo-151119191191278-7e90b7844243?auto=format&fit=crop&w=400&q=80'
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

// Render products to shop page
function renderProducts(filterCategory = 'all') {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return;

  productsGrid.innerHTML = '';

  const filteredProducts = filterCategory === 'all' ? products : products.filter(p => p.category === filterCategory);

  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = product.category;

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
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
function setUpFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      renderProducts(button.dataset.category);
    });
  });
}

// Setup add to cart button listeners
function setupAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = parseInt(button.dataset.id);
      const product = products.find(p => p.id === productId);
      if (product) {
        addToCart(product);
      }
    });
  });
}

// Add product to cart or increase quantity
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({...product, quantity: 1});
  }
  updateCartCount();
  openCartModal();
  alert(`${product.name} added to cart!`);
}

// Update cart item count in header
function updateCartCount() {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = count;
  }
}

// Open cart modal
function openCartModal() {
  if(cartModal) {
    cartModal.classList.add('show');
    renderCartItems();
  }
}

// Close cart modal
if (closeCartBtn) {
  closeCartBtn.addEventListener('click', () => {
    if(cartModal) cartModal.classList.remove('show');
  });
}

// Render cart items in modal
function renderCartItems() {
  if(!cartItemsContainer || !cartTotal) return;

  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <span class="item-name">${item.name}</span>
      <span class="item-qty">x${item.quantity}</span>
      <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
      <button class="remove-from-cart" data-id="${item.id}" aria-label="Remove ${item.name} from cart">&times;</button>
    `;
    cartItemsContainer.appendChild(itemDiv);
  
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;

  // Add remove button listeners
  const removeButtons = document.querySelectorAll('.remove-from-cart');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const removeId = parseInt(button.dataset.id);
      cart = cart.filter(item => item.id !== removeId);
      updateCartCount();
      renderCartItems();
      if(cart.length === 0 && cartModal) {
        cartModal.classList.remove('show');
      }
    });
  });
}

// Checkout button
if(checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
    } else {
      alert('Thank you for your purchase!');
      cart = [];
      updateCartCount();
      renderCartItems();
      if(cartModal) cartModal.classList.remove('show');
    }
  });
}

// Contact form submission handling
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if(contactForm) {
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

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  setUpFilters();
  renderProducts();
});
