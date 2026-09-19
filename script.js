// JavaScript to handle interactivity for ToyJoy Land

// Toggle navigation menu
const navToggle = document.getElementById('nav-toggle-btn');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
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
  <button class="cart-close-btn" aria-label="Close cart">&times;</button>
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

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCart();
}

function renderCart() {
  cartItemsContainer.innerHTML = '';
  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';

    cartItem.innerHTML = `
      <span class="cart-item-name">${item.name}</span>
      <span class="cart-item-price">$${item.price.toFixed(2)}</span>
      <button class="cart-close-btn" aria-label="Remove item" data-index="${index}">&times;</button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  // Add remove event listeners
  document.querySelectorAll('.cart-close-btn[data-index]').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      removeFromCart(index);
    });
  });
}

// Example products data for trending and shop pages
const products = [
  {
    id: 1,
    name: 'Action Hero Figure',
    category: 'action-figures',
    price: 29.99,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1600185361043-0d374a706b7a?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 2,
    name: 'Educational Robot',
    category: 'educational',
    price: 39.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1528554714185-faf2b9b824d5?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 3,
    name: 'Soft Plush Bear',
    category: 'plush-toys',
    price: 29.99,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1533144226641-ac591a4bdf28?auto=format&fit=crop&w=400&q=60'
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
    image: 'https://images.unsplash.com/photo-1528554714185-faf2b9b824d5?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 6,
    name: 'Superhero Action Figure',
    category: 'action-figures',
    price: 27.99,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1600185361043-0d374a706b7a?auto=format&fit=crop&w=400&q=60'
  }
];

function renderProducts(productsToRender) {
  const container = document.getElementById('products-grid') || document.getElementById('trending-products-grid');
  if (!container) return;
  container.innerHTML = '';
  productsToRender.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-name">${product.name}</div>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <div class="star-rating">${'★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '')}</div>
      <button class="btn btn-primary" aria-label="Add to cart: ${product.name}">Add to Cart</button>
    `;
    // Add event listener for Add to Cart
    productCard.querySelector('button').addEventListener('click', () => addToCart(product));
    container.appendChild(productCard);
  });
}

// Filtering products by category
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove 'active' class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    // Add 'active' class to this button
    button.classList.add('active');

    const category = button.getAttribute('data-category');
    if (category === 'all') {
      renderProducts(products);
    } else {
      renderProducts(products.filter(p => p.category === category));
    }
  });
});

// Initial rendering
if (document.getElementById('products-grid')) {
  renderProducts(products);
}

if (document.getElementById('trending-products-grid')) {
  renderProducts(products.slice(0,4));
}

// Contact form submission handler
const contactForm = document.getElementById('contact-form');
if(contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you ' + contactForm.name.value + '! Your message has been sent.');
    contactForm.reset();
  });
}
