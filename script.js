// Coffee Haven — script.js
window.addEventListener('DOMContentLoaded',function(){
  // set year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const body = document.body;
  if(navToggle){
    navToggle.addEventListener('click',function(){
      body.classList.toggle('nav-open');
    });
  }

  // smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
      const href = a.getAttribute('href');
      if(href === '#' || href === '') return;
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 72; // account for header
        window.scrollTo({top,behavior:'smooth'});
        // close mobile nav if open
        if(body.classList.contains('nav-open')) body.classList.remove('nav-open');
      }
    });
  });

  // Contact form validation
  const form = document.getElementById('contactForm');
  if(form){
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const successEl = document.getElementById('formSuccess');

    function validEmail(v){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    form.addEventListener('submit',function(e){
      e.preventDefault();
      let ok=true;
      nameError.textContent=''; emailError.textContent=''; messageError.textContent='';
      successEl.hidden=true; successEl.textContent='';

      if(!nameEl.value.trim()){ nameError.textContent='Please enter your name.'; ok=false; }
      if(!emailEl.value.trim() || !validEmail(emailEl.value.trim())){ emailError.textContent='Please enter a valid email.'; ok=false; }
      if(!messageEl.value.trim() || messageEl.value.trim().length < 5){ messageError.textContent='Please enter a message (5+ chars).'; ok=false; }

      if(!ok) return;

      // Simulate success (client-side only)
      successEl.hidden = false;
      successEl.textContent = 'Thanks — your message has been sent.';
      form.reset();
    });
  }
});
