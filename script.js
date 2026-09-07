// Data for Coleus varieties
const coleusPlants = [
    {
        id: 1,
        name: 'Wizard Scarlet',
        scientificName: 'Coleus scutellarioides',
        price: 15.99,
        sunRequirement: 'sun',
        imgUrl: 'https://images.unsplash.com/photo-1599598425947-2313627d32e9?auto=format&fit=crop&w=600&q=80',
        fallbackUrl: 'https://images.unsplash.com/photo-1596728325492-b485ff7430ad?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 2,
        name: 'China Rose',
        scientificName: 'Coleus scutellarioides',
        price: 12.49,
        sunRequirement: 'shade',
        imgUrl: 'https://images.unsplash.com/photo-1628186221443-4f3879a8e9e4?auto=format&fit=crop&w=600&q=80',
        fallbackUrl: 'https://images.unsplash.com/photo-1596728325492-b485ff7430ad?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 3,
        name: 'Black Dragon',
        scientificName: 'Coleus scutellarioides',
        price: 18.99,
        sunRequirement: 'shade',
        imgUrl: 'https://images.unsplash.com/photo-1618214227092-261578a1fa18?auto=format&fit=crop&w=600&q=80',
        fallbackUrl: 'https://images.unsplash.com/photo-1596728325492-b485ff7430ad?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 4,
        name: 'Kong Rose',
        scientificName: 'Coleus scutellarioides',
        price: 14.50,
        sunRequirement: 'sun',
        imgUrl: 'https://images.unsplash.com/photo-1599598425947-2313627d32e9?auto=format&fit=crop&w=600&q=80',
        fallbackUrl: 'https://images.unsplash.com/photo-1596728325492-b485ff7430ad?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 5,
        name: 'Lime Shrimp',
        scientificName: 'Coleus scutellarioides',
        price: 13.75,
        sunRequirement: 'sun',
        imgUrl: 'https://images.unsplash.com/photo-1628186221443-4f3879a8e9e4?auto=format&fit=crop&w=600&q=80',
        fallbackUrl: 'https://images.unsplash.com/photo-1596728325492-b485ff7430ad?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 6,
        name: 'Henna',
        scientificName: 'Coleus scutellarioides',
        price: 11.99,
        sunRequirement: 'shade',
        imgUrl: 'https://images.unsplash.com/photo-1618214227092-261578a1fa18?auto=format&fit=crop&w=600&q=80',
        fallbackUrl: 'https://images.unsplash.com/photo-1596728325492-b485ff7430ad?auto=format&fit=crop&w=600&q=80'
    }
];

// DOM elements
const plantGrid = document.getElementById('plantGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const priceSort = document.getElementById('priceSort');
const cartToggle = document.getElementById('cartToggle');
const cartDrawer = document.getElementById('cartDrawer');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const careGuideBtn = document.getElementById('careGuideBtn');
const catalogSection = document.getElementById('catalog-section');
const careGuideSection = document.getElementById('care-guide-section');

// Cart data
let cart = JSON.parse(localStorage.getItem('coleusCart')) || [];

// Render plants based on filters and search
function renderPlants() {
    let filteredPlants = coleusPlants;

    // Filter by category
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    if (activeFilter === 'sun') {
        filteredPlants = filteredPlants.filter(p => p.sunRequirement === 'sun');
    } else if (activeFilter === 'shade') {
        filteredPlants = filteredPlants.filter(p => p.sunRequirement === 'shade');
    }

    // Filter by search
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
        filteredPlants = filteredPlants.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    // Sort by price
    const sortValue = priceSort.value;
    if (sortValue === 'low-high') {
        filteredPlants.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'high-low') {
        filteredPlants.sort((a, b) => b.price - a.price);
    }

    plantGrid.innerHTML = '';

    filteredPlants.forEach(plant => {
        const card = document.createElement('div');
        card.className = 'plant-card';

        card.innerHTML = `
            <img src="${plant.imgUrl}" alt="${plant.name}" onerror="this.onerror=null;this.src='${plant.fallbackUrl}'" />
            <div class="plant-info">
                <h3>${plant.name}</h3>
                <div class="scientific-name">${plant.scientificName}</div>
                <div class="price">$${plant.price.toFixed(2)}</div>
                <div class="${plant.sunRequirement === 'sun' ? 'sun-tag' : 'shade-tag'}">
                    ${plant.sunRequirement === 'sun' ? 'Full Sun' : 'Part Shade'}
                </div>
                <button class="add-cart-btn" data-id="${plant.id}">Add to Cart</button>
            </div>
        `;

        plantGrid.appendChild(card);
    });

    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        });
    });
}

// Add item to cart
function addToCart(id) {
    const plant = coleusPlants.find(p => p.id === id);
    if (!plant) return;

    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...plant, quantity: 1 });
    }
    saveCart();
    renderCart();
    alert(`${plant.name} added to cart.`);
}

// Render cart contents
function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartCount.textContent = '0';
        cartTotal.textContent = '0.00';
        return;
    }

    cart.forEach(item => {
        total += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <img src="${item.imgUrl}" alt="${item.name}" onerror="this.onerror=null;this.src='${item.fallbackUrl}'" />
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="price">$${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="qty-decrement" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-increment" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item-btn" data-id="${item.id}" aria-label="Remove item">&times;</button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartTotal.textContent = total.toFixed(2);

    // Attach quantity controls
    document.querySelectorAll('.qty-increment').forEach(btn => {
        btn.addEventListener('click', () => {
            changeQuantity(parseInt(btn.dataset.id), 1);
        });
    });

    document.querySelectorAll('.qty-decrement').forEach(btn => {
        btn.addEventListener('click', () => {
            changeQuantity(parseInt(btn.dataset.id), -1);
        });
    });

    // Attach remove item buttons
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            removeItem(parseInt(btn.dataset.id));
        });
    });
}

function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity < 1) {
        removeItem(id);
    } else {
        saveCart();
        renderCart();
    }
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem('coleusCart', JSON.stringify(cart));
}

// Accordion for Care Guide
const accordionHeaders = document.querySelectorAll('.accordion-header');
accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const isActive = header.classList.contains('active');

        accordionHeaders.forEach(h => {
            h.classList.remove('active');
            h.nextElementSibling.style.maxHeight = null;
            h.nextElementSibling.style.opacity = 0;
        });

        if (!isActive) {
            header.classList.add('active');
            const content = header.nextElementSibling;
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = 1;
        }
    });
});

// Cart drawer toggle
cartToggle.addEventListener('click', () => {
    cartDrawer.classList.toggle('open');
});

closeCartBtn.addEventListener('click', () => {
    cartDrawer.classList.remove('open');
});

// Filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        renderPlants();
    });
});

// Search input
searchInput.addEventListener('input', () => {
    renderPlants();
});

// Price sort
priceSort.addEventListener('change', () => {
    renderPlants();
});

// Scroll to sections for hero buttons
careGuideBtn.addEventListener('click', () => {
    careGuideSection.scrollIntoView({ behavior: 'smooth' });
});

const exploreCatalogBtn = document.getElementById('exploreCatalogBtn');
exploreCatalogBtn.addEventListener('click', () => {
    catalogSection.scrollIntoView({ behavior: 'smooth' });
});

// Contact form validation and feedback
const contactForm = document.getElementById('contactForm');
const contactFeedback = document.getElementById('contactFeedback');
contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (name && email && message) {
        contactFeedback.textContent = 'Thank you for your message! We will get back to you soon.';
        contactForm.reset();
    } else {
        contactFeedback.textContent = 'Please fill in all fields correctly.';
    }

    setTimeout(() => {
        contactFeedback.textContent = '';
    }, 4000);
});

// Newsletter subscription feedback
const newsletterForm = document.getElementById('newsletterForm');
const newsletterFeedback = document.getElementById('newsletterFeedback');
newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = newsletterForm.newsletterEmail.value.trim();
    if (email) {
        newsletterFeedback.textContent = 'Subscription successful! Thank you!';
        newsletterForm.reset();
    } else {
        newsletterFeedback.textContent = 'Please enter a valid email address.';
    }

    setTimeout(() => {
        newsletterFeedback.textContent = '';
    }, 4000);
});

// Initial render
renderPlants();
renderCart();
