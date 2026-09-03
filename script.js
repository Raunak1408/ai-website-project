(function(){
  // Mobile nav toggle
  const siteNav = document.getElementById('siteNav');
  const navToggle = document.getElementById('navToggle');
  const siteHeader = document.querySelector('.site-header');

  navToggle && navToggle.addEventListener('click', ()=>{
    siteNav.classList.toggle('open');
    siteNav.classList.contains('open') ? navToggle.setAttribute('aria-expanded','true') : navToggle.setAttribute('aria-expanded','false');
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(!href || href === '#') return;
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - (siteHeader.offsetHeight || 0) - 8;
        window.scrollTo({top, behavior: 'smooth'});
        // close mobile nav if open
        if(siteNav.classList.contains('open')) siteNav.classList.remove('open');
      }
    });
  });

  // Set year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form validation
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    const nameIn = document.getElementById('name');
    const emailIn = document.getElementById('email');
    const messageIn = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const formSuccess = document.getElementById('formSuccess');

    function validateEmail(email){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      let ok = true;
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';
      formSuccess.textContent = '';

      if(!nameIn.value.trim()){ nameError.textContent = 'Please enter your name.'; ok = false; }
      if(!validateEmail(emailIn.value.trim())){ emailError.textContent = 'Please enter a valid email.'; ok = false; }
      if(!messageIn.value.trim()){ messageError.textContent = 'Please enter a message.'; ok = false; }

      if(!ok) return;

      // Simulate success
      formSuccess.textContent = "Thanks! Your message has been received.";
      contactForm.reset();
    });
  }
})();
