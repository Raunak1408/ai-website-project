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

// Initialize cart count (for demo purposes, start with 0)
updateCartCount(0);

// Add event listeners for all "Add to Cart" and "Quick Buy" buttons
function setupAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll('.btn-add-cart, .btn-quick-buy');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      cartCount++;
      updateCartCount(cartCount);
      alert('Item added to cart!');
    });
  });
}

// Call setup after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setupAddToCartButtons();

  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navList = document.querySelector('.nav-list');
  if (mobileToggle && navList) {
    mobileToggle.addEventListener('click', () => {
      navList.classList.toggle('show');
    });
  }

  // Filter application mockup on shop page
  const applyFiltersBtn = document.getElementById('apply-filters');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      alert('Filters applied (mockup). This would filter products.');
    });
  }

  // Thumbnail image gallery on product page
  const thumbnails = document.querySelectorAll('.thumbnail');
  const mainImage = document.querySelector('.main-image');
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      if (mainImage && thumb.src) {
        mainImage.src = thumb.src;
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      }
    });
  });
});
