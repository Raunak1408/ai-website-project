// JavaScript to handle interactivity for ToyJoy Land

// Toggle navigation menu
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Shopping Cart Implementation
let cart = [];

const cartButton = document.getElementById('cart-button');
const cartCount = document.getElementById('cart-count');

// Create cart modal element
const cartModal = document.createElement('div');
cartModal.id = 'cart-modal';
cartModal.innerHTML = `
  <h2>Your Cart</h2>
  <button class="cart-close-btn" aria-label="Close Cart">&times;</button>
  <div id="cart-items"></div>
`;
document.body.appendChild(cartModal);

const cartItemsContainer = document.getElementById('cart-items');
const cartCloseBtn = cartModal.querySelector('.cart-close-btn');

cartCloseBtn.addEventListener('click', () => {
  cartModal.classList.remove('show');
});

cartButton.addEventListener('click', () => {
  cartModal.classList.toggle('show');
});

function updateCartCount() {
  cartCount.textContent = cart.length;
}

function addToCart(product) {
  cart.push(product);
  updateCartCount();
  alert(`${product.name} added to cart!`);
  renderCart();
}

function renderCart() {
  cartItemsContainer.innerHTML = '';
  cart.forEach((product, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${product.name}</div>
        <div class="cart-item-price">$${product.price.toFixed(2)}</div>
      </div>
      <button class="cart-remove-btn" data-index="${index}" aria-label="Remove item">&times;</button>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  // Add remove event listeners
  const removeButtons = cartItemsContainer.querySelectorAll('.cart-remove-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      cart.splice(index, 1);
      updateCartCount();
      renderCart();
    });
  });
}

// Example products data for the shop page
const products = [
  {
    id: 1,
    name: 'Action Hero Figure',
    category: 'action-figures',
    price: 24.99,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1600185361043-0d374a706b7a?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 2,
    name: 'Educational Robot',
    category: 'educational',
    price: 39.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1528552744054-faf2b9b824d5?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 3,
    name: 'Soft Plush Bear',
    category: 'plush-toys',
    price: 29.99,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1533142266415-ac591a4bdf28?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 4,
    name: 'Family Board Game',
    category: 'board-games',
    price: 34.99,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1590080877777-525772b9e748?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 5,
    name: 'Building Blocks Set',
    category: 'educational',
    price: 19.99,
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1531428135170-1e5d4d35a97a?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 6,
    name: 'Superhero Action Figure',
    category: 'action-figures',
    price: 27.99,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1590080877702-691d63e2be17?auto=format&fit=crop&w=400&q=60'
  }
];

function renderProducts(productsToRender) {
  const container = document.getElementById('products-grid');
  if (!container) return;
  container.innerHTML = '';
  productsToRender.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">$${product.price.toFixed(2)}</p>
      <p class="rating">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 !== 0 ? '☆' : ''}</p>
      <button>Add to Cart</button>
    `;
    productCard.querySelector('button').addEventListener('click', () => {
      addToCart(product);
    });
    container.appendChild(productCard);
  });
}

function filterProducts(category) {
  if (category === 'all') {
    renderProducts(products);
  } else {
    const filtered = products.filter(p => p.category === category);
    renderProducts(filtered);
  }
}

// Initial render for shop page products
if (document.getElementById('products-grid')) {
  renderProducts(products);
}

// Initialize cart count
updateCartCount();

// Render cart initially
renderCart();

// Category filter buttons handling
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.filter-btn.active')?.classList.remove('active');
    button.classList.add('active');
    const category = button.getAttribute('data-category');
    filterProducts(category);
  });
});

