// Coffee Haven script.js
document.addEventListener('DOMContentLoaded', function(){
  // set year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  if(navToggle && siteNav){
    navToggle.addEventListener('click', ()=> siteNav.classList.toggle('open'));
  }

  // smooth scroll for in-page links
  document.querySelectorAll('[data-scroll]').forEach(el=>{
    el.addEventListener('click', function(e){
      e.preventDefault();
      const href = this.getAttribute('href');
      const target = document.querySelector(href);
      if(target){
        target.scrollIntoView({behavior:'smooth',block:'start'});
        // close mobile nav if open
        if(siteNav && siteNav.classList.contains('open')) siteNav.classList.remove('open');
      }
    });
  });

  // contact form validation
  const form = document.getElementById('contactForm');
  if(form){
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const formSuccess = document.getElementById('formSuccess');

    function validEmail(v){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      let ok = true;
      // reset
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';
      formSuccess.textContent = '';

      if(!name.value.trim() || name.value.trim().length < 2){
        nameError.textContent = 'Please enter your name.';
        ok = false;
      }
      if(!email.value.trim() || !validEmail(email.value.trim())){
        emailError.textContent = 'Please enter a valid email.';
        ok = false;
      }
      if(!message.value.trim() || message.value.trim().length < 5){
        messageError.textContent = 'Message must be at least 5 characters.';
        ok = false;
      }

      if(!ok) return;

      // simulate success
      formSuccess.textContent = 'Thanks — your message has been sent!';
      form.reset();
    });
  }
});
