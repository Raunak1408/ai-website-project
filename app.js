// JavaScript for WonderToys E-Commerce Toy Store

// Cart badge counter update mockup
const cartCountElem = document.getElementById('cart-count');
let cartCount = 0;

// Attach event listeners for Add to Cart buttons
function setupAddToCartButtons() {
  const buttons = document.querySelectorAll('.add-to-cart');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      cartCount += 1;
      cartCountElem.textContent = cartCount;
      alert('Item added to cart!');
    });
  });
}

// Search bar mockup (filtering not implemented, just informative)
const searchInput = document.getElementById('search-input');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    // Could implement search filter
    console.log('Searching toys for:', searchInput.value);
  });
}

// Mobile navigation toggle for future enhancement
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav');
if (mobileMenuToggle && navMenu) {
  mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupAddToCartButtons();
});
