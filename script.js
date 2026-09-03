// Coffee Haven — simple JS for interactions: scrolling, mobile nav, contact validation
(function(){
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollButtons = document.querySelectorAll('[data-scroll-to]');
  const yearEl = document.getElementById('year');
  const contactForm = document.getElementById('contactForm');

  // Set year
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  navToggle.addEventListener('click', ()=>{
    if(nav.style.display === 'flex'){
      nav.style.display = '';
    } else {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.background = 'rgba(255,255,255,0.98)';
      nav.style.padding = '12px';
      nav.style.borderRadius = '8px';
      nav.style.position = 'absolute';
      nav.style.right = '24px';
      nav.style.top = '64px';
      nav.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
    }
  });

  // Smooth scroll helper
  function smoothScrollTo(selector){
    const el = document.querySelector(selector);
    if(!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 72;
    window.scrollTo({top:y,behavior:'smooth'});
  }

  // Nav links
  navLinks.forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const href = a.getAttribute('href');
      smoothScrollTo(href);
      if(window.innerWidth <= 600) nav.style.display = '';
    });
  });

  // Hero buttons
  scrollButtons.forEach(b=>{
    b.addEventListener('click', ()=>{
      const target = b.getAttribute('data-scroll-to');
      smoothScrollTo(target);
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
      const success = document.getElementById('formSuccess');
      let ok = true;
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';
      success.textContent = '';

      if(!name.value.trim()){ nameError.textContent = 'Please enter your name.'; ok=false }
      if(!email.value.trim()){ emailError.textContent = 'Please enter your email.'; ok=false }
      else if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)){ emailError.textContent = 'Please enter a valid email.'; ok=false }
      if(!message.value.trim()){ messageError.textContent = 'Please enter a message.'; ok=false }

      if(!ok) return;

      // Simulate successful submission
      success.textContent = 'Thanks! Your message has been received.';
      contactForm.reset();
    });
  }

})();
