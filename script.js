// JavaScript to handle interactivity for CodeCraft AI landing page

// Handle Add to Cart button clicks
const addToCartButtons = document.querySelectorAll('.pricing-card button');
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const planName = button.parentElement.querySelector('h3').textContent;
    alert(`You have selected the ${planName} plan!`);
  });
});

// Smooth scroll for hero buttons
const getStartedBtn = document.getElementById('getStartedBtn');
const learnMoreBtn = document.getElementById('learnMoreBtn');

getStartedBtn.addEventListener('click', () => {
  document.getElementById('featuresGrid').scrollIntoView({ behavior: 'smooth' });
});
learnMoreBtn.addEventListener('click', () => {
  document.getElementById('faqContainer').scrollIntoView({ behavior: 'smooth' });
});

// Handle pricing toggle
const billingToggle = document.getElementById('billingToggle');
const billingCycleLabel = document.getElementById('billingCycleLabel');
const prices = document.querySelectorAll('.price');

billingToggle.addEventListener('change', () => {
  if (billingToggle.checked) {
    billingCycleLabel.textContent = 'Yearly Billing';
    prices.forEach(price => {
      price.textContent = `$${price.getAttribute('data-yearly')}`;
    });
  } else {
    billingCycleLabel.textContent = 'Monthly Billing';
    prices.forEach(price => {
      price.textContent = `$${price.getAttribute('data-monthly')}`;
    });
  }
});

// Handle FAQ toggles
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    question.classList.toggle('active');
    const answer = question.nextElementSibling;
    answer.classList.toggle('show');
  });
});
// Initial price set
prices.forEach(price => {
  price.textContent = `$${price.getAttribute('data-monthly')}`;
});
