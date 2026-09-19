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
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    return;
  }
  cart.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <span class="cart-item-name">${item.name}</span>
      <span class="cart-item-price">$${item.price.toFixed(2)}</span>
      <button class="cart-close-btn" aria-label="Remove item" data-index="${index}">&times;</button>
    `;
    const removeBtn = itemDiv.querySelector('button');
    removeBtn.addEventListener('click', () => {
      removeFromCart(index);
    });
    cartItemsContainer.appendChild(itemDiv);
  });
}

// Example products data for trending and shop pages
const products = [
  {
    id: 1,
    name: 'Espresso',
    category: 'hot',
    price: 3.00,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1600185361043-0d374a706b7a?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 2,
    name: 'Cappuccino',
    category: 'hot',
    price: 4.50,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1528554714149-faf2b9b824d5?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 3,
    name: 'Iced Latte',
    category: 'cold',
    price: 4.00,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1533144226610-ac591a4bdf28?auto=format&fit=crop&w=400&q=60'
  },
  {
    id: 4,
    name: 'Pastry Selection',
    category: 'bakery',
    price: 0.00, // price varies
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1590080877777-525772b9e748?auto=format&fit=crop&w=400&q=60'
  }
];

function renderProducts(productsToRender) {
  const container = document.getElementById('products-grid');
  container.innerHTML = '';
  productsToRender.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-name">${product.name}</div>
      <div class="product-price">${product.price > 0 ? `\$${product.price.toFixed(2)}` : 'Varies'}</div>
      <button class="btn add-to-cart" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
    `;
    container.appendChild(productCard);
  });
  addCartListeners();
}

function addCartListeners() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const product = {
        name: button.getAttribute('data-name'),
        price: parseFloat(button.getAttribute('data-price'))
      };
      addToCart(product);
    });
  });
}

const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    button.classList.add('active');
    const filter = button.getAttribute('data-filter');
    if (filter === 'all') {
      renderProducts(products);
    } else {
      renderProducts(products.filter(p => p.category === filter));
    }
  });
});

// Initial render
if (document.getElementById('products-grid')) {
  renderProducts(products);
}

// Contact form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(`Thank you ${contactForm.name.value}! Your message has been sent.`);
    contactForm.reset();
  });
}
