// BrewHaus interactions: mobile nav, smooth scroll, contact form validation, subtle reveal animations

document.addEventListener('DOMContentLoaded', () => {
  // Nav toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  function setNav(open){
    if(!navList || !navToggle) return;
    navToggle.classList.toggle('active', open);
    navList.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(Boolean(open)));
  }

  if(navToggle){
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.contains('open');
      setNav(!isOpen);
    });
  }

  // Close nav when clicking a link (mobile)
  document.querySelectorAll('.nav-list a').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      // Smooth scroll
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        setNav(false);
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Smooth scroll for other CTA buttons (if any)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    // handled above for nav links, but keep for other CTAs
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Reveal on scroll simple
  const revealEls = document.querySelectorAll('.feature-card, .menu-card, .testimonial, .stat, .hero-copy');
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('reveal');
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:0.12});
  revealEls.forEach(el=>{el.style.opacity = 0; el.style.transform = 'translateY(12px)'; el.style.transition = 'opacity 680ms cubic-bezier(.2,.9,.25,1), transform 680ms cubic-bezier(.2,.9,.25,1)'; revealObserver.observe(el);});

  // Contact form validation & submit handling
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  function showFormMessage(text, isError=false){
    if(!formMessage) return;
    formMessage.textContent = text;
    formMessage.style.display = 'block';
    formMessage.className = 'form-message ' + (isError ? 'error' : 'success');
    formMessage.style.opacity = '1';
    // hide after a delay
    setTimeout(()=>{ formMessage.style.opacity = '0'; setTimeout(()=> formMessage.style.display='none', 300); }, 4500);
  }

  function validateEmail(email){
    // simple regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const subject = contactForm.querySelector('#subject');
      const message = contactForm.querySelector('#message');

      const errors = [];
      if(!name || !name.value.trim()) errors.push('Please enter your name.');
      if(!email || !email.value.trim() || !validateEmail(email.value.trim())) errors.push('Please enter a valid email.');
      if(!subject || !subject.value.trim()) errors.push('Please enter a subject.');
      if(!message || !message.value.trim() || message.value.trim().length < 10) errors.push('Message must be at least 10 characters.');

      if(errors.length){
        showFormMessage(errors.join(' '), true);
        // mark invalid fields for accessibility
        [name,email,subject,message].forEach(field=>{ if(field && (!field.value || !field.value.trim())) field.setAttribute('aria-invalid','true'); else if(field) field.removeAttribute('aria-invalid'); });
        return;
      }

      // Simulated successful submit — prevent refresh and show message
      showFormMessage('Thanks — your message has been sent. We\'ll get back to you soon.');
      contactForm.reset();

    });
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Keyboard accessibility: close nav with Escape
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') setNav(false);
  });

  // Close nav on outside click (mobile)
  document.addEventListener('click', (e)=>{
    if(!navList || !navToggle) return;
    if(navList.classList.contains('open')){
      const isClickInside = navList.contains(e.target) || navToggle.contains(e.target);
      if(!isClickInside) setNav(false);
    }
  });

});
