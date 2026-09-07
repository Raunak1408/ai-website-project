const products = [
    { brand: "Rolex", model: "Submariner Date", price: 13500, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
    { brand: "Rolex", model: "Daytona Cosmograph", price: 22000, img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=600&q=80" },
    { brand: "Rolex", model: "Datejust 41", price: 10500, img: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=600&q=80" },

    { brand: "Omega", model: "Speedmaster Professional", price: 5500, img: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80" },
    { brand: "Omega", model: "Seamaster Diver 300M", price: 4800, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80" },
    { brand: "Omega", model: "Constellation Co-Axial", price: 6200, img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80" },

    { brand: "Seiko", model: "Prospex Diver", price: 800, img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=600&q=80" },
    { brand: "Seiko", model: "Presage Cocktail Time", price: 650, img: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80" },
    { brand: "Seiko", model: "5 Sports Automatic", price: 450, img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80" },

    { brand: "Casio", model: "G-Shock GA-2100", price: 130, img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80" },
    { brand: "Casio", model: "Edifice Chronograph", price: 220, img: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=600&q=80" },
    { brand: "Casio", model: "Vintage Digital A168", price: 50, img: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=600&q=80" },

    { brand: "TAG Heuer", model: "Carrera Automatic", price: 4100, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
    { brand: "TAG Heuer", model: "Monaco Calibre 11", price: 6500, img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=600&q=80" },
    { brand: "TAG Heuer", model: "Aquaracer Professional", price: 2750, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80" },

    { brand: "Tissot", model: "PRX Automatic", price: 800, img: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=600&q=80" },
    { brand: "Tissot", model: "Seastar 1000", price: 950, img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=600&q=80" },
    { brand: "Tissot", model: "Le Locle Powermatic", price: 850, img: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80" },

    { brand: "Patek Philippe", model: "Nautilus 5711", price: 32000, img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80" },
    { brand: "Patek Philippe", model: "Calatrava Automatic", price: 23000, img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80" },
    { brand: "Patek Philippe", model: "Aquanaut Travel Time", price: 25000, img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80" },

    { brand: "Audemars Piguet", model: "Royal Oak Selfwinding", price: 41000, img: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80" },
    { brand: "Audemars Piguet", model: "Royal Oak Offshore", price: 28000, img: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=600&q=80" },
    { brand: "Audemars Piguet", model: "CODE 11.59", price: 35000, img: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=600&q=80" },

    { brand: "Cartier", model: "Santos de Cartier", price: 9000, img: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=600&q=80" },
    { brand: "Cartier", model: "Tank Must", price: 7500, img: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80" },
    { brand: "Cartier", model: "Ballon Bleu", price: 11000, img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80" },

    { brand: "Tudor", model: "Black Bay 58", price: 3700, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80" },
    { brand: "Tudor", model: "Pelagos Titanium", price: 4600, img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=600&q=80" },
    { brand: "Tudor", model: "Heritage Chrono", price: 3500, img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=600&q=80" }
];

const productsContainer = document.getElementById('products');
const searchInput = document.getElementById('search');
const brandButtons = document.querySelectorAll('.brand-btn');
const sortSelect = document.getElementById('sort');
const cartPanel = document.getElementById('cart-panel');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart');

let currentBrandFilter = 'all';
let currentSearchTerm = '';
let currentSort = 'default';

let cart = JSON.parse(localStorage.getItem('cart')) || {};

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    for (const key in cart) {
        const item = cart[key];
        const lineTotal = item.price * item.qty;
        total += lineTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'cart-item-info';
        infoDiv.innerHTML = `<div class="cart-item-brand">${item.brand}</div><div class="cart-item-model">${item.model}</div>`;

        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.min = '1';
        qtyInput.value = item.qty;
        qtyInput.className = 'cart-item-qty';
        qtyInput.addEventListener('change', e => {
            const newQty = parseInt(e.target.value);
            if (newQty > 0) {
                cart[key].qty = newQty;
                saveCart();
                updateCartUI();
                renderProducts();
            } else {
                e.target.value = item.qty;
            }
        });

        const priceDiv = document.createElement('div');
        priceDiv.textContent = `$${lineTotal.toFixed(2)}`;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.title = 'Remove Item';
        removeBtn.addEventListener('click', () => {
            delete cart[key];
            saveCart();
            updateCartUI();
            renderProducts();
        });

        div.appendChild(infoDiv);
        div.appendChild(qtyInput);
        div.appendChild(priceDiv);
        div.appendChild(removeBtn);

        cartItemsContainer.appendChild(div);
    }
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;

    if (Object.keys(cart).length > 0) {
        openCart();
    } else {
        closeCart();
    }
}

function openCart() {
    cartPanel.classList.add('open');
}

function closeCart() {
    cartPanel.classList.remove('open');
}

function addToCart(brand, model, price) {
    const key = `${brand}__${model}`;
    if (cart[key]) {
        cart[key].qty++;
    } else {
        cart[key] = { brand, model, price, qty: 1 };
    }
    saveCart();
    updateCartUI();
}

function renderProducts() {
    let filtered = products.filter(p => {
        const matchesBrand = currentBrandFilter === 'all' || p.brand === currentBrandFilter;
        const matchesSearch = p.brand.toLowerCase().includes(currentSearchTerm) || p.model.toLowerCase().includes(currentSearchTerm);
        return matchesBrand && matchesSearch;
    });

    if (currentSort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'brand') {
        filtered.sort((a, b) => a.brand.localeCompare(b.brand));
    } else if (currentSort === 'model') {
        filtered.sort((a, b) => a.model.localeCompare(b.model));
    }

    productsContainer.innerHTML = '';

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const img = document.createElement('img');
        img.src = p.img;
        img.alt = `${p.brand} ${p.model}`;
        img.className = 'product-image';
        img.setAttribute('onerror', "this.onerror=null; this.src='https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80';");

        const info = document.createElement('div');
        info.className = 'product-info';

        const brandEl = document.createElement('div');
        brandEl.className = 'product-brand';
        brandEl.textContent = p.brand;

        const modelEl = document.createElement('div');
        modelEl.className = 'product-model';
        modelEl.textContent = p.model;

        const priceEl = document.createElement('div');
        priceEl.className = 'product-price';
        priceEl.textContent = `$${p.price.toLocaleString()}`;

        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'add-to-cart-btn';
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.addEventListener('click', () => {
            addToCart(p.brand, p.model, p.price);
        });

        info.appendChild(brandEl);
        info.appendChild(modelEl);
        info.appendChild(priceEl);
        card.appendChild(img);
        card.appendChild(info);
        card.appendChild(addToCartBtn);

        productsContainer.appendChild(card);
    });
}

searchInput.addEventListener('input', e => {
    currentSearchTerm = e.target.value.toLowerCase();
    renderProducts();
});

brandButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        brandButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentBrandFilter = btn.getAttribute('data-brand');
        renderProducts();
    });
});

sortSelect.addEventListener('change', e => {
    currentSort = e.target.value;
    renderProducts();
});

clearCartBtn.addEventListener('click', () => {
    cart = {};
    saveCart();
    updateCartUI();
    renderProducts();
});

// Initial render
renderProducts();
updateCartUI();

// Accessibility: Close cart on outside click
cartPanel.addEventListener('click', e => {
    if (e.target === cartPanel) {
        closeCart();
    }
});

// Keyboard accessibility for cart panel close
window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && cartPanel.classList.contains('open')) {
        closeCart();
    }
});

