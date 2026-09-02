// BrewHub interactivity: menu filter and mobile nav
document.addEventListener('DOMContentLoaded', function(){
  // Update footer year
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = y;

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-menu');
  if(navToggle && navList){
    navToggle.addEventListener('click', function(){
      const open = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close nav when clicking a link
    navList.addEventListener('click', function(e){
      if(e.target.tagName === 'A'){
        navList.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Menu filtering
  const filters = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.menu-card');
  filters.forEach(btn => {
    btn.addEventListener('click', function(){
      filters.forEach(b=>b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      cards.forEach(card => {
        if(filter === 'all'){
          card.style.display = '';
        } else {
          const cat = card.dataset.category;
          card.style.display = (cat === filter) ? '' : 'none';
        }
      });
      // smooth focus to grid
      document.getElementById('menu-grid').scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Smooth scrolling for header links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth'});
      }
    });
  });
});
