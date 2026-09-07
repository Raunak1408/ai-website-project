// JavaScript for WonderToys

// Cart counter functionality
let cartCount = 0;

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = cartCount;
    }
}

// Event listener for adding to cart
function addToCart() {
    cartCount++;
    updateCartCount();
}

// Mobile navigation toggle functionality
const mobileNavToggle = document.getElementById('mobile-nav-toggle');
if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', function() {
        const navMenu = document.querySelector('.nav');
        navMenu.classList.toggle('active');
    });
}