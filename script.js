// BrewHub interactivity: mobile nav & menu filtering

document.addEventListener('DOMContentLoaded', function(){
  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('nav-menu');

  function setNav(open){
    if(!navList) return;
    navList.classList.toggle('open', !!open);
    navToggle.setAttribute('aria-expanded', !!open);
  }

  if(navToggle && navList){
    navToggle.addEventListener('click', function(){
      const isOpen = navList.classList.contains('open');
      setNav(!isOpen);
    });

    // Close nav when clicking a link
    navList.addEventListener('click', function(e){
      if(e.target.tagName === 'A') setNav(false);
    });

    // close when focus moves away (accessibility)
    document.addEventListener('click', function(e){
      if(!navList.contains(e.target) && !navToggle.contains(e.target)){
        setNav(false);
      }
    });

    // close on ESC
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') setNav(false);
    });
  }

  // Smooth scroll for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href.length > 1){
        const target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth',block:'start'});
        }
      }
    });
  });

  // Contact form basic handler
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      // basic feedback — in a real site you'd send data via fetch
      alert('Thanks! Your message has been sent.');
      form.reset();
    });
  }

});
