// JavaScript for WonderToys website interactivity

// Cart badge counter update
const cartCountElement = document.getElementById('cart-count');
let cartCount = 0;

function updateCartCount(count) {
  cartCount = count;
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

// Initialize cart count
updateCartCount(cartCount);

// Add to Cart and Quick Buy buttons event listeners
function setupCartButtons() {
  const addToCartButtons = document.querySelectorAll('.btn-add-cart');
  const quickBuyButtons = document.querySelectorAll('.btn-quick-buy');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      cartCount++;
      updateCartCount(cartCount);
      alert('Item added to cart!');
    });
  });

  quickBuyButtons.forEach(button => {
    button.addEventListener('click', () => {
      cartCount++;
      updateCartCount(cartCount);
      alert('Item added to cart!');
    });
  });
}

// Filter functionality setup for Shop page
function setupFilters() {
  const filterForm = document.getElementById('filter-form');
  const productGrid = document.querySelector('.product-grid');

  if (!filterForm || !productGrid) return;

  const applyFiltersButton = document.getElementById('apply-filters');

  applyFiltersButton.addEventListener('click', () => {
    const category = filterForm.elements['category'].value;
    const ageGroup = filterForm.elements['age-group'].value;
    const priceRange = filterForm.elements['price-range'].value;

    const products = productGrid.querySelectorAll('.product-card');

    products.forEach(product => {
      const productCategory = product.getAttribute('data-category');
      const productAge = product.getAttribute('data-age');
      const productPrice = parseFloat(product.getAttribute('data-price'));

      let matchesCategory = category === 'all' || productCategory === category;
      let matchesAge =
        ageGroup === 'all' ||
        (ageGroup === '0-3' && productAge === '0-3') ||
        (ageGroup === '4-7' && productAge === '4-7') ||
        (ageGroup === '8+' && productAge === '8+');

      let matchesPrice = false;
      if (priceRange === 'all') {
        matchesPrice = true;
      } else if (priceRange === '0-20') {
        matchesPrice = productPrice >= 0 && productPrice <= 20;
      } else if (priceRange === '21-50') {
        matchesPrice = productPrice >= 21 && productPrice <= 50;
      } else if (priceRange === '51+') {
        matchesPrice = productPrice >= 51;
      }

      if (matchesCategory && matchesAge && matchesPrice) {
        product.style.display = '';
      } else {
        product.style.display = 'none';
      }
    });
    alert('Filters applied (mockup)');
  });
}

// Mobile navigation toggle
function setupMobileMenu() {
  const toggleButton = document.querySelector('.mobile-menu-toggle');
  const navList = document.querySelector('.nav-list');
  if (!toggleButton || !navList) return;

  toggleButton.addEventListener('click', () => {
    navList.classList.toggle('show');
  });
}

// Initialize all interactive elements
document.addEventListener('DOMContentLoaded', () => {
  setupCartButtons();
  setupFilters();
  setupMobileMenu();
});
