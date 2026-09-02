// BrewHub interactivity: mobile nav & menu filtering

document.addEventListener('DOMContentLoaded', function(){
  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('nav-menu');

  if(navToggle && navList){
    function setNav(open){
      navList.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    navToggle.addEventListener('click', function(){
      const isOpen = navList.classList.contains('open');
      setNav(!isOpen);
    });

    // Close mobile nav when a link is activated (and link is internal)
    navList.addEventListener('click', function(e){
      if(e.target.tagName === 'A'){
        setNav(false);
      }
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
          target.scrollIntoView({behavior:'smooth', block:'start'});
        }
      }
    });
  });

  // Menu filtering (if filters exist)
  const filters = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.menu-card');
  if(filters.length && cards.length){
    filters.forEach(btn=>{
      btn.addEventListener('click', function(){
        filters.forEach(b=>b.classList.remove('active'));
        this.classList.add('active');
        const cat = this.dataset.filter;
        cards.forEach(card=>{
          if(cat === 'all' || card.dataset.cat === cat){
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Contact form basic submit handling
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      // simple feedback
      alert('Thanks! Your message has been sent.');
      form.reset();
    });
  }
});
