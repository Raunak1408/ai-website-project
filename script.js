// BrewHub interactivity: mobile nav & simple form handlers
// Clean, minimal, accessible behavior

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('nav-menu');

  function setNav(open) {
    if (!navList || !navToggle) return;
    navList.classList.toggle('open', !!open);
    navToggle.classList.toggle('open', !!open);
    navToggle.setAttribute('aria-expanded', !!open ? 'true' : 'false');
  }

  if (navToggle && navList) {
    // Toggle nav when button clicked
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.contains('open');
      setNav(!isOpen);
    });

    // Close when a navigation link is clicked (mobile)
    navList.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link) setNav(false);
    });

    // Close when user clicks outside the nav
    document.addEventListener('click', (e) => {
      if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
        setNav(false);
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setNav(false);
    });
  }

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile nav after navigation
        setNav(false);
      }
    });
  });

  // Simple contact form handler (client-side only)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simple validation (name & email required by HTML) and UX feedback
      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      if (!name || !email) {
        alert('Please provide your name and email.');
        return;
      }
      // In a real site you'd send this to a server. For now, show a toast/alert.
      alert('Thanks, ' + name + "! Your message has been sent.");
      form.reset();
    });
  }
});
