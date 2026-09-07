// JavaScript for WonderToys website interactivity

// Cart badge counter update
const cartCountElement = document.getElementById('cart-count');
let cartCount = 0;

function updateCartCount(count) {
  cartCount = count;
  if(cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

// Initialize cart count
updateCartCount(cartCount);

// Add to Cart and Quick Buy buttons event listeners
function setupCartButtons() {
  const addToCartButtons = document.querySelectorAll('.btn-primary');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      cartCount++;
      updateCartCount(cartCount);
      alert('Item added to cart!');
    });
  });
}

// Filter functionality mockup (for shop page)
function setupFilters() {
  const filterCheckboxes = document.querySelectorAll('.filter-group input[type=checkbox]');
  const filterRadios = document.querySelectorAll('.filter-group input[type=radio]');

  filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      alert('Filters applied (mockup).');
    });
  });

  filterRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      alert('Filters applied (mockup).');
    });
  });
}

// Mobile navigation toggle
function setupMobileMenu() {
  const toggleButton = document.querySelector('.mobile-menu-toggle');
  const navList = document.querySelector('.nav-list');
  
  if(toggleButton && navList) {
    toggleButton.addEventListener('click', () => {
      navList.classList.toggle('show');
    });
  }
}

// Initialize all interactivity
document.addEventListener('DOMContentLoaded', () => {
  setupCartButtons();
  setupFilters();
  setupMobileMenu();
});
