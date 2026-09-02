// BrewHaus interactivity: mobile nav & simple form handlers
// Clean, minimal, accessible behavior

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  function setNav(open) {
    if (!navList || !navToggle) return;
    navList.classList.toggle('open', !!open);
    navToggle.setAttribute('aria-expanded', !!open);
  }

  function toggleNav(open) {
    if (!navList || !navToggle) return;
    const isOpen = navList.classList.contains('open');
    setNav(open === undefined ? !isOpen : open);
  }

  // Attach toggle if present
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => toggleNav());

    // Close when a nav link is clicked (mobile)
    navList.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) {
        // close mobile nav
        setNav(false);
      }
    });
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setNav(false);
  });

  // Smooth scrolling for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Click-to-scroll helpers inside hero/CTAs (if used)
  document.querySelectorAll('[data-scroll-to]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const sel = el.getAttribute('data-scroll-to');
      const tgt = document.querySelector(sel);
      if (tgt) {
        e.preventDefault();
        tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Contact form behavior: client-side validation and inline success message
  const form = document.getElementById('contactForm') || document.querySelector('form#contactForm');
  if (form) {
    // create message container if missing
    let msgDiv = form.querySelector('#formMessage');
    if (!msgDiv) {
      msgDiv = document.createElement('div');
      msgDiv.id = 'formMessage';
      msgDiv.className = 'form-message sr-only';
      msgDiv.setAttribute('role', 'status');
      msgDiv.setAttribute('aria-live', 'polite');
      form.appendChild(msgDiv);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      msgDiv.classList.remove('error', 'success', 'sr-only');
      msgDiv.innerHTML = '';

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
      else if (!/^\S+@\S+\.\S+$/.test(email)) errors.push('Please enter a valid email address.');
      if (!message) errors.push('Message cannot be empty.');

      if (errors.length) {
        msgDiv.classList.add('error');
        msgDiv.innerHTML = '<ul class="error-list"><li>' + errors.join('</li><li>') + '</li></ul>';
        msgDiv.focus();
        return;
      }

      // Simulate a successful submission (would send to server in real app)
      msgDiv.classList.add('success');
      msgDiv.textContent = `Thanks, ${name}! Your message has been received. We'll get back to you shortly.`;
      form.reset();

      // Remove success message after a short delay
      setTimeout(() => {
        msgDiv.classList.add('sr-only');
        msgDiv.classList.remove('success');
        msgDiv.textContent = '';
      }, 7000);
    });
  }

  // Simple reveal-on-scroll for elements with .reveal class
  const revealElems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElems.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('revealed');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });

    revealElems.forEach((el) => io.observe(el));
  } else {
    // fallback: reveal all
    revealElems.forEach((el) => el.classList.add('revealed'));
  }
});
