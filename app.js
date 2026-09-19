// JavaScript for PlayfulPaws Toys - Interactive Cart & UI

// Sample products data with age groups
const products = [
    { id: 1, title: "Robot Action Figure", rating: 4.5, price: 29.99, ageGroup: "8+", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "STEM Building Blocks", rating: 4.7, price: 19.99, ageGroup: "4-7", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Plush Teddy Bear", rating: 4.8, price: 24.99, ageGroup: "0-3", image: "https://images.unsplash.com/photo-150340129298103-156b28e1a34b?auto=format&fit=crop&w=600&q=80" },
    { id: 4, title: "Family Board Game", rating: 4.2, price: 34.99, ageGroup: "8+", image: "https://images.unsplash.com/photo-1587825140708-fddb7f7a9f396?auto=format&fit=crop&w=600&q=80" },
    { id: 5, title: "Building Blocks Set", rating: 4.6, price: 19.99, ageGroup: "4-7", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80" },
    { id: 6, title: "Outdoor Ball Game", rating: 4.3, price: 15.49, ageGroup: "8+", image: "https://images.unsplash.com/photo-1517649763962-0c6230606013b?auto=format&fit=crop&w=600&q=80" },
    { id: 7, title: "Soft Plush Puppy", rating: 4.7, price: 22.99, ageGroup: "0-3", image: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=600&q=80" },
    { id: 8, title: "Puzzle Board Game", rating: 4.4, price: 27.99, ageGroup: "4-7", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80" },
];

// Cart state
let cart = [];

// Select DOM elements
const productGrid = document.querySelector('.product-items');

// Render products
function renderProducts() {
  productGrid.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <div class="product-title">${product.title}</div>
      <div class="star-rating" aria-label="Rating: ${product.rating} stars">${renderStars(product.rating)}</div>
      <p class="price">$${product.price.toFixed(2)}</p>
      <button class="btn-add-cart" aria-label="Add ${product.title} to cart">Add to Cart</button>
    `;

    const addButton = card.querySelector('.btn-add-cart');
    addButton.addEventListener('click', () => addToCart(product.id));

    productGrid.appendChild(card);
  });
}

// Render star rating
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = (rating % 1) >= 0.5 ? true : false;
  let starsHTML = '';
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '⭐';
  }
  if (halfStar) starsHTML += '✮';
  return starsHTML;
}

// Add to cart
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

// Initial render
renderProducts();
