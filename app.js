// JavaScript for PlayfulPaws Toys - Interactive Cart & UI

// Sample products data with age groups
const products = [
  { id: 1, title: "Robot Action Figure", rating: 4.5, price: 29.99, ageGroup: "8+", image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=600&q=80" },
  { id: 2, title: "STEM Building Blocks", rating: 4.7, price: 19.99, ageGroup: "4-7", image: "https://images.unsplash.com/photo-1582719478147-0e4b0ddc2ae1?auto=format&fit=crop&w=600&q=80" },
  { id: 3, title: "Plush Teddy Bear", rating: 4.8, price: 24.99, ageGroup: "0-3", image: "https://images.unsplash.com/photo-1503541494684-d496560345e9?auto=format&fit=crop&w=600&q=80" },
  { id: 4, title: "Family Board Game", rating: 4.2, price: 34.99, ageGroup: "8+", image: "https://images.unsplash.com/photo-1580910051076-f48e8628d0de?auto=format&fit=crop&w=600&q=80" },
  { id: 5, title: "Building Blocks Set", rating: 4.6, price: 19.99, ageGroup: "4-7", image: "https://images.unsplash.com/photo-1501744428575-659c52205ee4?auto=format&fit=crop&w=600&q=80" },
  { id: 6, title: "Outdoor Ball Game", rating: 4.3, price: 15.49, ageGroup: "8+", image: "https://images.unsplash.com/photo-1542556067-19a40f8b2b28?auto=format&fit=crop&w=600&q=80" },
  { id: 7, title: "Soft Plush Puppy", rating: 4.7, price: 22.99, ageGroup: "0-3", image: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=600&q=80" },
  { id: 8, title: "Puzzle Board Game", rating: 4.4, price: 27.99, ageGroup: "4-7", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80" },
];

// Select DOM elements
const productGrid = document.getElementById('products');

// Render products
function renderProducts() {
  productGrid.innerHTML = '<h2>Featured Toys</h2><div class="product-items"></div>';
  const itemsContainer = productGrid.querySelector('.product-items');

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="product-title">${product.title}</div>
      <div class="star-rating" aria-label="Rating: ${product.rating} stars">
        ${renderStars(product.rating)}
      </div>
      <p class="price">$${product.price.toFixed(2)}</p>
      <button class="btn-add-cart" aria-label="Add ${product.title} to cart" data-id="${product.id}">Add to Cart</button>
    `;

    itemsContainer.appendChild(card);
  });

  const addButtons = productGrid.querySelectorAll('.btn-add-cart');
  addButtons.forEach(button => {
    button.addEventListener('click', () => {
      addToCart(parseInt(button.getAttribute('data-id')));
    });
  });
}

// Render star rating (full and half stars)
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = (rating % 1) >= 0.5;
  let starsHtml = '';

  for (let i = 0; i < fullStars; i++) {
    starsHtml += '★';
  }
  if (halfStar) {
    starsHtml += '½';
  }
  return starsHtml;
}

// Add to cart function
function addToCart(productId) {
  alert(`Added ${products.find(p => p.id === productId).title} to cart.`);
}

// Newsletter form submission
const newsletterForm = document.getElementById('newsletter-form');
newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailInput = document.getElementById('newsletter-email');
  if (emailInput.value) {
    alert(`Thank you for subscribing, ${emailInput.value}!`);
    newsletterForm.reset();
  }
});

// Initialize
renderProducts();
