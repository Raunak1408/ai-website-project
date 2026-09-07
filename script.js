const watchImages = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=600&q=80"
];

const fallbackWatchImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";


const products = [
  { brand: "Rolex", model: "Submariner Date", price: 13500, img: watchImages[0] },
  { brand: "Rolex", model: "Daytona Cosmograph", price: 22000, img: watchImages[1] },
  { brand: "Rolex", model: "Datejust 41", price: 10500, img: watchImages[2] },

  { brand: "Omega", model: "Speedmaster Professional", price: 5500, img: watchImages[3] },
  { brand: "Omega", model: "Seamaster Diver 300M", price: 4800, img: watchImages[4] },
  { brand: "Omega", model: "Constellation Co-Axial", price: 6200, img: watchImages[5] },

  { brand: "Seiko", model: "Prospex Diver", price: 800, img: watchImages[6] },
  { brand: "Seiko", model: "Presage Cocktail Time", price: 650, img: watchImages[7] },
  { brand: "Seiko", model: "5 Sports Automatic", price: 450, img: watchImages[8] },

  { brand: "Casio", model: "G-Shock GA-2100", price: 130, img: watchImages[9] },
  { brand: "Casio", model: "Edifice Chronograph", price: 220, img: watchImages[0] },
  { brand: "Casio", model: "Vintage Digital A168", price: 50, img: watchImages[1] },

  { brand: "TAG Heuer", model: "Carrera Automatic", price: 4100, img: watchImages[2] },
  { brand: "TAG Heuer", model: "Monaco Calibre 11", price: 6500, img: watchImages[3] },
  { brand: "TAG Heuer", model: "Aquaracer Professional", price: 2750, img: watchImages[4] },

  { brand: "Tissot", model: "PRX Automatic", price: 800, img: watchImages[5] },
  { brand: "Tissot", model: "Seastar 1000", price: 950, img: watchImages[6] },
  { brand: "Tissot", model: "Le Locle Powermatic", price: 850, img: watchImages[7] },

  { brand: "Patek Philippe", model: "Nautilus 5711", price: 32000, img: watchImages[8] },
  { brand: "Patek Philippe", model: "Calatrava Automatic", price: 23000, img: watchImages[9] },
  { brand: "Patek Philippe", model: "Aquanaut Travel Time", price: 25000, img: watchImages[0] },

  { brand: "Audemars Piguet", model: "Royal Oak Selfwinding", price: 41000, img: watchImages[1] },
  { brand: "Audemars Piguet", model: "Royal Oak Offshore", price: 28000, img: watchImages[2] },
  { brand: "Audemars Piguet", model: "CODE 11.59", price: 35000, img: watchImages[3] },

  { brand: "Cartier", model: "Santos de Cartier", price: 9000, img: watchImages[4] },
  { brand: "Cartier", model: "Tank Must", price: 7500, img: watchImages[5] },
  { brand: "Cartier", model: "Ballon Bleu", price: 11000, img: watchImages[6] },

  { brand: "Tudor", model: "Black Bay 58", price: 3700, img: watchImages[7] },
  { brand: "Tudor", model: "Pelagos Titanium", price: 4600, img: watchImages[8] },
  { brand: "Tudor", model: "Heritage Chrono", price: 3500, img: watchImages[9] }
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

        const img = document.createElement('img');
        img.src = item.img;
        img.alt = `${item.brand} ${item.model}`;
        img.className = 'cart-image';
        img.setAttribute('onerror', `this.onerror=null; this.src='${fallbackWatchImage}';`);
        div.appendChild(img);

        const details = document.createElement('div');
        details.className = 'cart-item-details';
        details.textContent = `${item.brand} ${item.model} x ${item.qty} = $${lineTotal.toFixed(2)}`;
        div.appendChild(details);

        cartItemsContainer.appendChild(div);
    }
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    saveCart();
}

function renderProducts() {
    const filtered = products.filter(p => {
        const matchesBrand = currentBrandFilter === 'all' || p.brand === currentBrandFilter;
        const matchesSearch = p.model.toLowerCase().includes(currentSearchTerm) || p.brand.toLowerCase().includes(currentSearchTerm);
        return matchesBrand && matchesSearch;
    });

    if (currentSort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'brand') {
        filtered.sort((a, b) => a.brand.localeCompare(b.brand));
    }

    productsContainer.innerHTML = '';

    filtered.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-card';

        const img = document.createElement('img');
        img.src = p.img;
        img.alt = `${p.brand} ${p.model}`;
        img.className = 'product-image';
        img.setAttribute('onerror', `this.onerror=null; this.src='${fallbackWatchImage}';`);
        div.appendChild(img);

        const brandDiv = document.createElement('div');
        brandDiv.className = 'product-brand';
        brandDiv.textContent = p.brand;
        div.appendChild(brandDiv);

        const modelDiv = document.createElement('div');
        modelDiv.className = 'product-model';
        modelDiv.textContent = p.model;
        div.appendChild(modelDiv);

        const priceDiv = document.createElement('div');
        priceDiv.className = 'product-price';
        priceDiv.textContent = `$${p.price.toFixed(2)}`;
        div.appendChild(priceDiv);

        const addToCartBtn = document.createElement('button');
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.className = 'add-to-cart-btn';
        addToCartBtn.addEventListener('click', () => {
            addToCart(p.brand, p.model, p.price);
        });
        div.appendChild(addToCartBtn);

        productsContainer.appendChild(div);
    });
}

const cart = JSON.parse(localStorage.getItem('cart')) || {};

function addToCart(brand, model, price) {
    const key = `${brand}__${model}`;
    if (cart[key]) {
        cart[key].qty++;
    } else {
        cart[key] = { brand, model, price, qty: 1, qty, img: '' };
    }
    saveCart();
    updateCartUI();
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

        const img = document.createElement('img');
        img.src = item.img || fallbackWatchImage;
        img.alt = `${item.brand} ${item.model}`;
        img.className = 'cart-image';
        img.setAttribute('onerror', `this.onerror=null; this.src='${fallbackWatchImage}';`);
        div.appendChild(img);

        const details = document.createElement('div');
        details.className = 'cart-item-details';
        details.textContent = `${item.brand} ${item.model} x ${item.qty} = $${lineTotal.toFixed(2)}`;
        div.appendChild(details);

        cartItemsContainer.appendChild(div);
    }
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    saveCart();
}

// Initialize render
renderProducts();
updateCartUI();

// Event listeners for filters and sorting
searchInput.addEventListener('input', e => {
    currentSearchTerm = e.target.value.toLowerCase();
    renderProducts();
});
brandButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentBrandFilter = button.dataset.brand || 'all';
        renderProducts();
    });
});
sortSelect.addEventListener('change', e => {
    currentSort = e.target.value;
    renderProducts();
});

clearCartBtn.addEventListener('click', () => {
    for (const key in cart) {
        delete cart[key];
    }
    updateCartUI();
});

// No changes needed to HTML except ensuring <img> tags in products and cart have the onerror attribute as set in JS
