// Coffee Haven — simple JS for navigation, mobile nav, and contact form validation
(function(){
  const nav = document.getElementById('siteNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav-links a');
  const scrollButtons = document.querySelectorAll('[href^="#"]');
  const contactForm = document.getElementById('contactForm');

  // set year in footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // mobile nav toggle
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

  // smooth scroll for internal links
  function smoothScrollTo(hash){
    if(!hash) return;
    const el = document.querySelector(hash);
    if(!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 72;
    window.scrollTo({top: y, behavior: 'smooth'});
  }

  scrollButtons.forEach(btn=>{
    btn.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        smoothScrollTo(href);
        // close mobile nav after click
        if(window.innerWidth <= 600 && nav){ nav.style.display='none'; }
      }
    });
  });

  // nav links highlight on click (basic)
  navLinks.forEach(a=>{
    a.addEventListener('click', ()=>{
      navLinks.forEach(x=>x.classList.remove('active'));
      a.classList.add('active');
    });
  });

  // contact form validation
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

      if(!name.value.trim()) { nameError.textContent = 'Please enter your name.'; ok=false; }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { emailError.textContent = 'Please enter a valid email.'; ok=false; }
      if(!message.value.trim()) { messageError.textContent = 'Please enter a message.'; ok=false; }

      if(!ok) return;

      // mimic successful submission
      formSuccess.textContent = 'Thanks! Your message has been received.';
      contactForm.reset();
    });
  }
})();
