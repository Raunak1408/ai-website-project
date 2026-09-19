// JavaScript to handle interactivity for ToyJoy Land

// Toggle navigation menu
const navToggle = document.getElementById('nav-toggle-btn');
const navLinks = document.getElementById('nav-links');

if(navToggle && navLinks) {
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

// Example products data for demonstration (normally from backend or API)
const products = [
  {
    id: 1,
    name: 'Remote Control Car',
    category: 'action-figures',
    price: 29.99,
    age: 'Ages 3+',
    image: 'https://images.unsplash.com/photo-1600185367349-6a7745e5aec8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Wooden Puzzle',
    category: 'puzzles',
    price: 19.99,
    age: 'Ages 3+',
    image: 'https://images.unsplash.com/photo-1509475826633-fed577a2c71b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    name: 'Teddy Bear Plush',
    category: 'plush-toys',
    price: 24.99,
    age: 'Ages 2+',
    image: 'https://images.unsplash.com/photo-1511910849309-0b1a6f7d1b1e?auto=format&fit=crop&w=400&q=80'
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

  const filteredProducts = filterCategory === 'all' ? products : products.filter(p => p.category === filterCategory);

  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);

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

// Update the cart count in header
function updateCartCount() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQuantity;
}

// Render cart items in cart modal
function renderCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';

    itemDiv.innerHTML = `
      <span class="cart-item-name">${item.name} x${item.quantity}</span>
      <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
      <button class="remove-from-cart" data-id="${item.id}" aria-label="Remove ${item.name} from cart">&times;</button>
    `;

    cartItemsContainer.appendChild(itemDiv);
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;

  // Add event listeners to remove buttons
  const removeButtons = cartItemsContainer.querySelectorAll('.remove-from-cart');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.getAttribute('data-id'), 10);
      removeFromCart(id);
    });
  });
}

// Remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartCount();
  renderCart();
}

// Open cart modal
function openCartModal() {
  cartModal.classList.add('show');
}

// Close cart modal
function closeCartModal() {
  cartModal.classList.remove('show');
}

// Event listeners for cart modal buttons
checkoutBtn?.addEventListener('click', () => {
  alert('Thank you for your purchase!');
  cart = [];
  updateCartCount();
  renderCart();
  closeCartModal();
});

closeCartBtn?.addEventListener('click', () => {
  closeCartModal();
});

// Category filter buttons
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const category = button.getAttribute('data-category');
    renderProducts(category);
  });
});

// Initial render
renderProducts();

// Contact form submission handling
const contactForm = document.getElementById('contact-form');
const formSuccessMessage = document.getElementById('form-success');

if(contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    // Simple validation and showing success message
    if(contactForm.checkValidity()) {
      contactForm.reset();
      if (formSuccessMessage) {
        formSuccessMessage.classList.remove('hidden');
        setTimeout(() => {
          formSuccessMessage.classList.add('hidden');
        }, 5000);
      }
    }
  });
}

// Responsive nav hide on link click (mobile)
const navLinksList = document.querySelectorAll('#nav-links li a');
navLinksList.forEach(link => {
  link.addEventListener('click', () => {
    if(navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
    }
  });
});
