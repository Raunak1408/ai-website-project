// Coffee Haven — simple JS for navigation, mobile nav, and contact form validation
(function(){
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollButtons = document.querySelectorAll('[data-scroll-to]');
  const contactForm = document.getElementById('contactForm');

  // Year in footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  if(navToggle){
    navToggle.addEventListener('click', ()=>{
      if(nav.style.display === 'flex'){
        nav.style.display = 'none';
      } else {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
      }
    });
  }

  // Smooth scroll helper
  function smoothScrollTo(selector){
    const el = document.querySelector(selector);
    if(!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 72;
    window.scrollTo({top:y,behavior:'smooth'});
  }

  scrollButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const target = btn.getAttribute('data-scroll-to');
      smoothScrollTo(target);
    });
  });

  navLinks.forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')) smoothScrollTo(href);
      if(window.innerWidth <= 600 && nav){ nav.style.display='none'; }
    });
  });

  // Contact form validation
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
      if(!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){ emailError.textContent = 'Please enter a valid email.'; ok=false; }
      if(!message.value.trim()){ messageError.textContent = 'Please enter a message.'; ok=false; }

      if(!ok) return;

      formSuccess.textContent = "Thanks! Your message has been received.";
      contactForm.reset();
    });
  }
})();
