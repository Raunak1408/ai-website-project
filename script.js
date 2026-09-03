// Coffee Haven — simple JS for navigation, mobile nav, and contact form validation
(function(){
  const siteNav = document.getElementById('siteNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav-links a');
  const smoothHash = function(hash){
    if(!hash) return;
    const el = document.querySelector(hash);
    if(!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 64;
    window.scrollTo({top, behavior:'smooth'});
  };

  // mobile nav toggle
  if(navToggle){
    navToggle.addEventListener('click', function(){
      siteNav.classList.toggle('open');
    });
  }

  // smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        smoothHash(href);
        // close mobile nav after clicking
        if(siteNav.classList.contains('open')) siteNav.classList.remove('open');
      }
    });
  });

  // fill year in footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // contact form validation
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      const nameError = document.getElementById('nameError');
      const emailError = document.getElementById('emailError');
      const messageError = document.getElementById('messageError');
      const formSuccess = document.getElementById('formSuccess');

      let ok = true;
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';
      formSuccess.textContent = '';

      if(!name.value.trim()){ nameError.textContent = 'Please enter your name.'; ok=false; }
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)){ emailError.textContent = 'Please enter a valid email.'; ok=false; }
      if(!message.value.trim()){ messageError.textContent = 'Please enter a message.'; ok=false; }

      if(!ok) return;

      // simulate success
      formSuccess.textContent = 'Thanks! Your message has been received.';
      contactForm.reset();
    });
  }
})();
