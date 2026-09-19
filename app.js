// JavaScript for PlayfulPaws Toys - Interactive Cart & UI

// Sample products data with age groups
const products = [
    { id: 1, title: "Robot Action Figure", rating: 4.5, price: 29.99, ageGroup: "8+", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "STEM Building Blocks", rating: 4.7, price: 19.99, ageGroup: "4-7", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Plush Teddy Bear", rating: 4.8, price: 24.99, ageGroup: "0-3", image: "https://images.unsplash.com/photo-1503401298103-156b28e1a34b?auto=format&fit=crop&w=600&q=80" },
    { id: 4, title: "Family Board Game", rating: 4.2, price: 34.99, ageGroup: "8+", image: "https://images.unsplash.com/photo-1587825140708-fddb7f7a9f39?auto=format&fit=crop&w=600&q=80" },
    { id: 5, title: "Building Blocks Set", rating: 4.6, price: 19.99, ageGroup: "4-7", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80" },
    { id: 6, title: "Outdoor Ball Game", rating: 4.3, price: 15.49, ageGroup: "8+", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80" },
    { id: 7, title: "Soft Plush Puppy", rating: 4.7, price: 22.99, ageGroup: "0-3", image: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=600&q=80" },
    { id: 8, title: "Puzzle Board Game", rating: 4.4, price: 27.99, ageGroup: "4-7", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80" },
];

// Cart state
let cart = [];

// Select DOM elements
const productGrid = document.querySelector('.product-grid');
const filterTabs = document.querySelectorAll('.filter-tab');
const cartToggleBtn = document.getElementById('cart-toggle');
const cartDrawer = document.getElementById('cart-drawer');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElem = document.getElementById('cart-count');
const cartSubtotalElem = document.getElementById('cart-subtotal');
const checkoutBtn = document.getElementById('checkout-btn');
const closeCartBtn = document.getElementById('close-cart');

// Render products based on filter
function renderProducts(filter = 'all') {
    productGrid.innerHTML = '';
    const filteredProducts = filter === 'all' ? products : products.filter(p => p.ageGroup === filter);

    filteredProducts.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.setAttribute('tabindex', '0');

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" />
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="star-rating" aria-label="Rating: ${product.rating} stars">${renderStars(product.rating)}</div>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="btn-add-cart" aria-label="Add ${product.title} to cart">Add to Cart</button>
            </div>
        `;

        // Add event listener for Add to Cart button
        const addButton = card.querySelector('.btn-add-cart');
        addButton.addEventListener('click', () => addToCart(product.id));

        productGrid.appendChild(card);
    });
}

// Render star rating (full and half stars)
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (halfStar) {
        stars += '½';
    }
    return stars;
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.product.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ product, quantity: 1 });
    }
    updateCartUI();
}

// Update cart UI
function updateCartUI() {
    cartCountElem.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <img src="${item.product.image}" alt="${item.product.title}" />
            <div class="cart-item-info">
                <div class="cart-item-title">${item.product.title}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" aria-label="Decrease quantity" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" aria-label="Increase quantity" data-index="${index}">+</button>
                </div>
                <div class="cart-item-price">$${(item.product.price * item.quantity).toFixed(2)}</div>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    cartSubtotalElem.textContent = subtotal.toFixed(2);

    checkoutBtn.disabled = cart.length === 0;

    attachQtyListeners();
}

// Attach quantity button listeners
function attachQtyListeners() {
    const decreaseBtns = document.querySelectorAll('.qty-btn[aria-label="Decrease quantity"]');
    const increaseBtns = document.querySelectorAll('.qty-btn[aria-label="Increase quantity"]');

    decreaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = Number(btn.getAttribute('data-index'));
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCartUI();
        });
    });

    increaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = Number(btn.getAttribute('data-index'));
            cart[index].quantity++;
            updateCartUI();
        });
    });
}

// Filter tab click handler
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const filter = tab.getAttribute('data-filter');
        renderProducts(filter);
    });
});

// Cart toggle button handler
cartToggleBtn.addEventListener('click', () => {
    cartDrawer.classList.toggle('active');
    let expanded = cartDrawer.classList.contains('active');
    cartDrawer.setAttribute('aria-hidden', expanded ? 'false' : 'true');
});

// Close cart button handler
closeCartBtn.addEventListener('click', () => {
    cartDrawer.classList.remove('active');
    cartDrawer.setAttribute('aria-hidden', 'true');
});

// Newsletter signup form
const newsletterForm = document.getElementById('newsletter-form');
newsletterForm.addEventListener('submit', event => {
    event.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    if (emailInput.value) {
        alert(`Thank you for subscribing, ${emailInput.value}!`);
        newsletterForm.reset();
    }
});

// Contact form submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name && email && message) {
        alert(`Thank you, ${name}, for reaching out. We will get back to you soon.`);
        contactForm.reset();
    }
});

// Initial render
renderProducts();
