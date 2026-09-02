// BrewHaus interactions: mobile nav, smooth scroll, contact form validation, subtle reveal animations

document.addEventListener('DOMContentLoaded', () => {
  // Nav toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  function setNav(open) {
    if (!navList || !navToggle) return;
    const isOpen = !!open;
    navList.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.classList.toggle('active', isOpen);
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      setNav(!navList.classList.contains('open'));
    });
  }

  // Close nav when a link is clicked (mobile)
  if (navList) {
    navList.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => setNav(false));
    });
  }

  // Smooth scrolling for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile nav after navigating
        setNav(false);
      }
    });
  });

  // Set footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Subtle reveal animations using IntersectionObserver
  const revealItems = document.querySelectorAll('.feature-card, .menu-card, .testimonial, .gallery-grid img, .about-media, .about-copy');
  if ('IntersectionObserver' in window && revealItems.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(el => io.observe(el));
  } else {
    // fallback: reveal all
    revealItems.forEach(el => el.classList.add('reveal'));
  }

  // Contact form handling with client-side validation
  const form = document.getElementById('contactForm');
  if (form) {
    const formMessageWrap = document.getElementById('formMessage');

    function showMessage(message, type = 'success') {
      if (!formMessageWrap) return;
      formMessageWrap.textContent = message;
      formMessageWrap.className = 'form-message ' + (type === 'error' ? 'error' : 'success');
      formMessageWrap.style.opacity = 1;
    }

    function clearMessage() {
      if (!formMessageWrap) return;
      formMessageWrap.textContent = '';
      formMessageWrap.className = 'form-message';
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = form.querySelector('[name="name"]');
      const emailEl = form.querySelector('[name="email"]');
      const subjectEl = form.querySelector('[name="subject"]');
      const messageEl = form.querySelector('[name="message"]');

      const name = nameEl ? nameEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const subject = subjectEl ? subjectEl.value.trim() : '';
      const message = messageEl ? messageEl.value.trim() : '';

      const errors = [];
      if (!name) errors.push('Name is required.');
      if (!email) errors.push('Email is required.');
      // simple email regex
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRx.test(email)) errors.push('Please enter a valid email address.');
      if (!subject) errors.push('Subject is required.');
      if (!message) errors.push('Message is required.');

      if (errors.length) {
        showMessage(errors.join(' '), 'error');
        return;
      }

      // Simulate successful submission (since there's no backend)
      showMessage(`Thanks, ${name}! Your message has been received. We'll get back to you shortly.`, 'success');
      form.reset();

      // Remove message after a while and clear
      setTimeout(() => {
        clearMessage();
      }, 6000);
    });
  }

  // Optional: small keyboard handler to close nav with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setNav(false);
  });
});
