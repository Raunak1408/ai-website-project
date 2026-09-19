// JavaScript to handle interactivity for ToyJoy Land

// Toggle navigation menu
const navToggleBtn = document.getElementById('nav-toggle-btn');
const navLinks = document.getElementById('nav-links');

navToggleBtn?.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

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
    image: 'https://images.unsplash.com/photo-1511191912278-7e90b7844243?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 4,
    name: 'Educational Kit',
    category: 'educational-all',
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

  const filteredProducts = filterCategory === 'all'
    ? products
    : products.filter(p => p.category === filterCategory);

  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = product.category;

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-name">${product.name}</div>
      <div class="product-age">${product.age}</div>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;

    productsGrid.appendChild(card);
  });

  addAddToCartListeners();
}

// Handle filter buttons
function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const category = button.getAttribute('data-category');
      renderProducts(category);
    });
  });
}

// Add event listeners to Add to Cart buttons
function addAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = parseInt(button.getAttribute('data-id'));
      const product = products.find(p => p.id === productId);
      if (product) {
        addToCart(product);
      }
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
  alert(`${product.name} added to cart!`);
}

// Update cart count in header
function updateCartCount() {
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = totalQuantity;
}

// Open cart modal
function openCartModal() {
  cartModal.classList.add('show');
  renderCartItems();
}

// Close cart modal
function closeCartModal() {
  cartModal.classList.remove('show');
}

// Render cart items in modal
function renderCartItems() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <span class="cart-item-name">${item.name} x${item.quantity}</span>
      <button class="remove-from-cart" data-id="${item.id}" aria-label="Remove ${item.name} from cart">&times;</button>
    `;

    cartItemsContainer.appendChild(itemDiv);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;

  // Add remove event listeners
  const removeButtons = document.querySelectorAll('.remove-from-cart');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.getAttribute('data-id'));
      removeFromCart(id);
    });
  });
}

// Remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartCount();
  renderCartItems();
}

// Checkout button handler
checkoutBtn?.addEventListener('click', () => {
  alert('Thank you for your purchase!');
  cart = [];
  updateCartCount();
  renderCartItems();
  closeCartModal();
});

// Close cart modal button
closeCartBtn?.addEventListener('click', closeCartModal);

// Cart button toggles modal
cartButton?.addEventListener('click', () => {
  if (cartModal.classList.contains('show')) {
    closeCartModal();
  } else {
    openCartModal();
  }
});

// Contact form submission handler
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

contactForm?.addEventListener('submit', e => {
  e.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  // Show success message
  formSuccess.classList.remove('hidden');
  contactForm.reset();

  // Hide success message after 5s
  setTimeout(() => {
    formSuccess.classList.add('hidden');
  }, 5000);
});

// Initialize shop page
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('shop-main') || document.title.includes('Shop')) {
    renderProducts();
    setupFilters();
  }
});

// Initialize contact page
// Already handled by form submission listener above
