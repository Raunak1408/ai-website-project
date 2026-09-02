// BrewHub interactivity: mobile nav & menu filtering
// Clean, small helper functions and accessible toggles

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('nav-menu');

  function setNav(open) {
    if (!navList || !navToggle) return;
    // control a clear "open" state on the list and the toggle button
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

    // Close nav when a link inside nav is clicked (mobile behavior)
    navList.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      setNav(false);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setNav(false);
    });

    // Close when focus moves outside the nav (basic)
    document.addEventListener('click', (e) => {
      if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
        setNav(false);
      }
    });
  }

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return; // ignore empty anchors
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile nav after navigating
        if (navList) setNav(false);
      }
    });
  });

  // Menu filtering / smooth behaviour for gallery links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      // already handled above for smooth scroll
    });
  });

  // Contact form handler (basic client-side feedback)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thanks! Your message has been sent.');
      form.reset();
    });
  }
});
