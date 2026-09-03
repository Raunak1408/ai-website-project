// Smooth scroll and form validation for Coffee Haven
document.addEventListener('DOMContentLoaded',function(){
  // Set current year in footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  if(navToggle && siteNav){
    navToggle.addEventListener('click',()=> siteNav.classList.toggle('open'));
    // close nav on link click
    siteNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=> siteNav.classList.remove('open')));
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click',function(e){
      const href = this.getAttribute('href');
      if(!href || href === '#') return;
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 64; // account for header
        window.scrollTo({top,behavior:'smooth'});
      }
    });
  });

  // Contact form validation
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const formSuccess = document.getElementById('formSuccess');

    function validEmail(email){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    contactForm.addEventListener('submit',function(e){
      e.preventDefault();
      let ok = true;
      // reset
      nameError.textContent=''; emailError.textContent=''; messageError.textContent=''; formSuccess.textContent='';

      if(!nameEl.value.trim()){
        nameError.textContent = 'Please enter your name.'; ok=false;
      }
      if(!emailEl.value.trim() || !validEmail(emailEl.value.trim())){
        emailError.textContent = 'Please enter a valid email.'; ok=false;
      }
      if(!messageEl.value.trim() || messageEl.value.trim().length < 5){
        messageError.textContent = 'Please enter a message (at least 5 characters).'; ok=false;
      }

      if(!ok) return;

      // Simulate success (client-side)
      formSuccess.textContent = 'Thanks — your message has been sent.';
      contactForm.reset();
    });
  }
});
