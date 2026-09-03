// Coffee Haven — script.js
document.addEventListener('DOMContentLoaded',function(){
  // year in footer
  const yearEl = document.getElementById('year'); if(yearEl) yearEl.textContent = new Date().getFullYear();

  // mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  navToggle && navToggle.addEventListener('click',function(){
    siteNav.classList.toggle('open');
    const open = siteNav.classList.contains('open');
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });

  // close mobile nav when a link is clicked
  siteNav && siteNav.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click',()=>{
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-label','Open navigation');
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
    const success = document.getElementById('formSuccess');

    function validEmail(v){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    form.addEventListener('submit',function(e){
      e.preventDefault();
      let ok = true;
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';
      success.hidden = true;

      if(!name.value.trim() || name.value.trim().length < 2){
        nameError.textContent = 'Please enter your name.'; ok = false;
      }
      if(!email.value.trim() || !validEmail(email.value.trim())){
        emailError.textContent = 'Please enter a valid email.'; ok = false;
      }
      if(!message.value.trim() || message.value.trim().length < 5){
        messageError.textContent = 'Message must be at least 5 characters.'; ok = false;
      }

      if(!ok) return;

      // simulate successful client-side submission
      success.hidden = false;
      form.reset();

      // visually hide errors if any lingering
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';
    });
  }
});
