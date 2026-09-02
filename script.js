// BrewHaus interactions: mobile nav, smooth scroll, contact form validation, subtle reveal animations

document.addEventListener('DOMContentLoaded', () => {
  // Nav toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  function setNav(open) {
    if (!navList || !navToggle) return;
    navList.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(!!open));
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList && navList.classList.contains('open');
      setNav(!isOpen);
    });
  }

  // Close nav when clicking a link (mobile)
  document.querySelectorAll('.nav-list a').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setNav(false);
      }
    });
  });

  // Smooth scroll for any in-page links (CTA etc.)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    // Skip links that are just '#' with no target
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Reveal animation for cards and hero copy.
  // We assign an initial hidden style and then reveal either via IntersectionObserver
  // or with a graceful fallback so content never stays invisible.
  const revealEls = Array.from(document.querySelectorAll('.feature-card, .menu-card, .testimonial, .stat, .hero-copy'));
  const transition = 'opacity 680ms cubic-bezier(.2,.9,.25,1), transform 680ms cubic-bezier(.2,.9,.25,1)';

  function hideInitial(el) {
    // Only set these if not already styled to avoid overwriting author inline styles
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = transition;
  }
  function revealNow(el) {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }

  if (revealEls.length) {
    revealEls.forEach(hideInitial);

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            revealNow(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      revealEls.forEach(el => observer.observe(el));

      // Fallback: if IntersectionObserver doesn't fire for some reason,
      // ensure elements become visible after a short delay
      setTimeout(() => {
        revealEls.forEach(el => {
          if (getComputedStyle(el).opacity === '0') {
            revealNow(el);
          }
        });
      }, 1200);
    } else {
      // No IntersectionObserver support: reveal everything immediately
      revealEls.forEach(revealNow);
    }
  }

  // Contact form validation & submit handling
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  function showFormMessage(text, isError = false) {
    if (!formMessage) return;
    formMessage.textContent = text;
    formMessage.className = isError ? 'form-message error' : 'form-message success';
    formMessage.style.display = 'block';
    // hide after a bit
    setTimeout(() => { formMessage.style.display = 'none'; }, 4500);
  }

  function validateEmail(email) {
    // simple regex
    return /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const subject = contactForm.querySelector('#subject');
      const message = contactForm.querySelector('#message');

      const errors = [];
      if (!name || !name.value.trim()) errors.push('Please enter your name.');
      if (!email || !email.value.trim() || !validateEmail(email.value)) errors.push('Please enter a valid email.');
      if (!subject || !subject.value.trim()) errors.push('Please enter a subject.');
      if (!message || !message.value.trim() || message.value.trim().length < 10) errors.push('Message must be at least 10 characters.');

      if (errors.length) {
        showFormMessage(errors.join(' '), true);
        // mark invalid fields for accessibility
        [name, email, subject, message].forEach(f => {
          if (f && (!f.value || !f.value.trim())) f.setAttribute('aria-invalid', 'true');
          else if (f) f.removeAttribute('aria-invalid');
        });
        return;
      }

      // Simulate successful submit
      showFormMessage("Thanks — your message has been sent. We'll get back to you soon.");
      contactForm.reset();
    });
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Keyboard shortcut: Escape closes nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setNav(false);
  });

  // Close nav on outside click (mobile behavior)
  document.addEventListener('click', (e) => {
    if (!navList || !navToggle) return;
    // if nav isn't open, nothing to do
    if (!navList.classList.contains('open')) return;
    // if the click is inside nav or on the toggle, ignore
    if (navList.contains(e.target) || navToggle.contains(e.target)) return;
    setNav(false);
  });
});
