// BrewHaus interactions: mobile nav, smooth scroll, contact form validation, order buttons

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  function setNav(open) {
    if (!navList || !navToggle) return;
    const isOpen = !!open;
    navList.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  // Mobile hamburger toggle
  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navList && navList.classList.contains('open');
      setNav(!isOpen);
    });
  }

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!navList || !navToggle) return;
    if (!navList.classList.contains('open')) return;
    if (!navList.contains(e.target) && e.target !== navToggle) {
      setNav(false);
    }
  });

  // Close nav with Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setNav(false);
  });

  // Smooth scroll for all internal anchor links (and close mobile nav)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      // If it's just a hash with no target, prevent default but do nothing
      if (!href || href === '#') {
        e.preventDefault();
        return;
      }

      // Find target element
      try {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // close mobile nav if open
          setNav(false);
        }
      } catch (err) {
        // invalid selector or no target - do nothing but prevent default
        e.preventDefault();
      }
    });
  });

  // Order buttons - show a clear confirmation message
  function showToast(message = 'Done', duration = 4200) {
    const toast = document.createElement('div');
    toast.className = 'site-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      right: '1rem',
      bottom: '1rem',
      background: 'rgba(0,0,0,0.85)',
      color: '#fff',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      zIndex: '9999',
      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
      fontSize: '0.95rem',
      maxWidth: 'min(380px, 90%)',
      lineHeight: '1.3',
      opacity: '1',
    });

    document.body.appendChild(toast);

    // fade out after duration
    setTimeout(() => {
      toast.style.transition = 'opacity 300ms ease, transform 300ms ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
    }, duration - 300);

    setTimeout(() => {
      toast.remove();
    }, duration + 100);
  }

  document.querySelectorAll('.order-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Your order has been selected. Please contact us to complete the order.');
    });
  });

  // Contact form validation & submission (frontend-only)
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  function showFormMessage(text, isError = false) {
    if (!formMessage) {
      // fallback to alert if message element not present
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

      const nameEl = contactForm.querySelector('#name');
      const emailEl = contactForm.querySelector('#email');
      const subjectEl = contactForm.querySelector('#subject');
      const messageEl = contactForm.querySelector('#message');

      const name = nameEl ? nameEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const subject = subjectEl ? subjectEl.value.trim() : '';
      const message = messageEl ? messageEl.value.trim() : '';

      const errors = [];
      if (!name) errors.push('Please enter your name.');
      if (!email || !validateEmail(email)) errors.push('Please enter a valid email address.');
      if (!subject) errors.push('Please enter a subject.');
      if (!message || message.length < 5) errors.push('Please enter a message (at least 5 characters).');

      if (errors.length) {
        showFormMessage(errors.join(' '), true);
        return;
      }

      // Frontend-only: show success message and reset form
      showFormMessage('Thanks! Your message has been received. We will contact you soon.');
      contactForm.reset();
    });
  }

  // Accessibility: ensure nav links toggle nav when clicked (for any anchor in nav)
  if (navList) {
    navList.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setNav(false));
    });
  }
});
