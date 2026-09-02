// BrewHaus interactions: mobile nav, smooth scroll, contact form validation, order buttons

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  function setNav(open) {
    if (!navList || !navToggle) return;
    navList.classList.toggle('open', !!open);
    navToggle.setAttribute('aria-expanded', String(!!open));
  }

  // Hamburger toggle
  if (navToggle && navList) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navList.classList.contains('open');
      setNav(!isOpen);
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!navList.classList.contains('open')) return;
      if (!navList.contains(e.target) && e.target !== navToggle && !navToggle.contains(e.target)) {
        setNav(false);
      }
    });

    // Close nav on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setNav(false);
    });
  }

  // Smooth scroll for all anchor links that point to an ID on the page
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav if open
        if (navList && navList.classList.contains('open')) setNav(false);
      }
    });
  });

  // Order buttons in Menu - show confirmation message
  function attachOrderButtons() {
    const orderButtons = document.querySelectorAll('.order-btn');
    orderButtons.forEach((btn) => {
      // Avoid attaching multiple handlers
      if (btn.dataset.orderHandlerAttached) return;
      btn.dataset.orderHandlerAttached = '1';

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Try to find a nearby title for context
        let itemName = '';
        const card = btn.closest('article, .menu-card, .menu-body, .card, .menu-card, .article');
        if (card) {
          const titleEl = card.querySelector('h3, h2, h4, .menu-meta, .menu-title');
          if (titleEl) itemName = titleEl.textContent.trim();
        }

        const message = itemName
          ? `Your order has been selected for: "${itemName}". Please contact us to complete the order.`
          : 'Your order has been selected. Please contact us to complete the order.';

        // Use a non-blocking toast if available, otherwise alert
        if (window.Toastify) {
          Toastify({ text: message, duration: 4000, gravity: 'top', position: 'right', backgroundColor: 'linear-gradient(to right, #6B4226, #8B5E3C)' }).showToast();
        } else {
          // Fallback
          alert(message);
        }
      });
    });
  }
  attachOrderButtons();

  // Contact form validation & submission (frontend only)
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  function showFormMessage(text, isError = false) {
    if (!formMessage) {
      // fallback
      alert(text);
      return;
    }
    formMessage.textContent = text;
    formMessage.className = isError ? 'form-message error' : 'form-message success';
    formMessage.style.display = 'block';
    formMessage.setAttribute('aria-live', 'polite');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const subject = contactForm.querySelector('#subject');
      const message = contactForm.querySelector('#message');

      const errors = [];
      if (!name || !name.value.trim()) errors.push('Please enter your name.');
      if (!email || !email.value.trim() || !validateEmail(email.value)) errors.push('Please enter a valid email address.');
      if (!message || !message.value.trim() || message.value.trim().length < 5) errors.push('Please enter a message (at least 5 characters).');

      if (errors.length) {
        showFormMessage(errors.join(' '), true);
        return;
      }

      // Frontend-only success flow
      showFormMessage('Thanks — your message has been received. We will contact you soon.');
      contactForm.reset();
    });
  }

  // Footer year element update if present
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Accessibility: close nav when any nav link is activated (keyboard/mouse)
  if (navList) {
    navList.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setNav(false));
    });
  }

});
