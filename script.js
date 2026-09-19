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
const checkoutBtn = document.getElementById('checkout-btn');
const closeCartBtn = document.getElementById('close-cart-btn');

let cart = [];

// Example products data for demo purposes
const products = [
  {
    id: 1,
    name: 'Remote Control Car',
    category: 'action-figures',
    price: 29.99,
    age: 'Ages 5+',
    image: 'https://images.unsplash.com/photo-1600180758891-3aa14f66a5a8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Wooden Puzzle',
    category: 'puzzles',
    price: 19.99,
    age: 'Ages 3+',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
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
    category: 'educational',
    price: 39.99,
    age: 'Ages 6+',
    image: 'https://images.unsplash.com/photo-1590080877777-dc436973ff87?auto=format&fit=crop&w=400&q=80'
  }
];

// Render products to shop page
function renderProducts(productsToRender) {
  const productsGrid = document.getElementById('products-grid');
  productsGrid.innerHTML = '';
  productsToRender.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);

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

// Add 'Add to Cart' button event listeners
function addAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = parseInt(button.getAttribute('data-id'), 10);
      const product = products.find(p => p.id === productId);
      if (product) {
        addToCart(product);
      }
    });
  });
}

// Add product to cart
function addToCart(product) {
  cart.push(product);
  updateCartCount();
  openCartModal();
  renderCart();
  alert(`${product.name} added to cart!`);
}

// Remove product from cart by index
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCart();
}

// Render cart items in modal
function renderCart() {
  cartItemsContainer.innerHTML = '';
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('cart-total').textContent = '';
    return;
  }
  let total = 0;
  cart.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <span>${item.name} - $${item.price.toFixed(2)}</span>
      <button class="cart-close-btn" data-index="${index}" aria-label="Remove item from cart">&times;</button>
    `;
    cartItemsContainer.appendChild(itemDiv);
    total += item.price;
  });
  document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
}

// Update cart count badge
function updateCartCount() {
  cartCount.textContent = cart.length;
}

// Open and show cart modal
function openCartModal() {
  cartModal.classList.add('show');
}

// Close cart modal
function closeCartModal() {
  cartModal.classList.remove('show');
}

// Event listeners
if (cartButton) {
  cartButton.addEventListener('click', () => {
    openCartModal();
  });
}

if (closeCartBtn) {
  closeCartBtn.addEventListener('click', () => {
    closeCartModal();
  });
}

// Handle remove item buttons in cart
cartItemsContainer.addEventListener('click', event => {
  if (event.target.classList.contains('cart-close-btn')) {
    const index = parseInt(event.target.getAttribute('data-index'), 10);
    removeFromCart(index);
  }
});

// Filter products by category buttons
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const category = button.getAttribute('data-category');
    if (category === 'all') {
      renderProducts(products);
    } else {
      renderProducts(products.filter(p => p.category === category));
    }
  });
});

// Initial render
if (document.getElementById('products-grid')) {
  renderProducts(products);
}

// Contact form submission handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(`Thank you ${contactForm.name.value}! Your message has been sent.`);
    contactForm.reset();
    const successMessage = document.getElementById('form-success');
    if (successMessage) {
      successMessage.hidden = false;
    }
  });
}
