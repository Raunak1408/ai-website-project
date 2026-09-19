// JavaScript to handle interactivity for PlayfulPaws Toys website

// Handle Add to Cart button clicks
const addToCartButtons = document.querySelectorAll('.toy-card-button');
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const toyName = button.parentElement.querySelector('h3').textContent;
    alert(`${toyName} has been added to your cart!`);
  });
});

// Handle newsletter signup form submission
const newsletterForm = document.getElementById('newsletterForm');
const subscriptionMessage = document.getElementById('subscriptionMessage');

newsletterForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const emailInput = document.getElementById('emailInput').value;
  subscriptionMessage.textContent = `Thank you for subscribing, ${emailInput}!`;
  subscriptionMessage.style.color = '#4CAF50'; // Green text
  newsletterForm.reset();
});

// Optional: Add smooth scroll behavior for hero buttons
const shopNowBtn = document.getElementById('shopNowBtn');
const learnMoreBtn = document.getElementById('learnMoreBtn');

shopNowBtn.addEventListener('click', () => {
  document.getElementById('toysGrid').scrollIntoView({ behavior: 'smooth' });
});

learnMoreBtn.addEventListener('click', () => {
  document.querySelector('.customer-reviews').scrollIntoView({ behavior: 'smooth' });
});
