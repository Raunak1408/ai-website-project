// script.js - Recommendation Engine logic
// All DOM queries and event wiring
const btnMovies = document.getElementById('btn-movies');
const btnBooks = document.getElementById('btn-books');
const genreSelect = document.getElementById('genre');
const moodSelect = document.getElementById('mood');
const minRating = document.getElementById('minRating');
const ratingValue = document.getElementById('ratingValue');
const getBtn = document.getElementById('getBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsContainer = document.getElementById('results');
const emptyState = document.getElementById('emptyState');
const statusArea = document.getElementById('statusArea');
const resultsCount = document.getElementById('resultsCount');

// Application state
let activeType = 'movie'; // 'movie' or 'book'
let items = ITEMS; // from data.js

// Populate select options for genre and mood from data.js arrays
function populateSelects(){
  // Genre
  GENRES.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    genreSelect.appendChild(opt);
  });
  // Mood
  MOODS.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    moodSelect.appendChild(opt);
  });
}

// Update rating display
minRating.addEventListener('input', ()=>{
  ratingValue.textContent = parseFloat(minRating.value).toFixed(1);
});

// Toggle active mode and styling
function setActiveMode(type){
  activeType = type;
  if(type === 'movie'){
    btnMovies.classList.add('active');
    btnMovies.setAttribute('aria-pressed','true');
    btnBooks.classList.remove('active');
    btnBooks.setAttribute('aria-pressed','false');
  } else {
    btnBooks.classList.add('active');
    btnBooks.setAttribute('aria-pressed','true');
    btnMovies.classList.remove('active');
    btnMovies.setAttribute('aria-pressed','false');
  }
  // clear previous results when switching type
  clearResults();
}

btnMovies.addEventListener('click', ()=>setActiveMode('movie'));
btnBooks.addEventListener('click', ()=>setActiveMode('book'));

// Clear results and hide states
function clearResults(){
  resultsContainer.innerHTML = '';
  emptyState.hidden = true;
  resultsCount.textContent = '';
  statusArea.innerHTML = '';
}

// Render spinner in status area
function showLoading(){
  statusArea.innerHTML = '';
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  spinner.setAttribute('role','status');
  spinner.setAttribute('aria-label','Loading');
  statusArea.appendChild(spinner);
}

// Show results count
function updateResultsCount(n){
  resultsCount.textContent = `${n} result${n===1?'':'s'}`;
}

// Create card DOM for an item
function createCard(item){
  const card = document.createElement('article');
  card.className = 'card';

  const meta = document.createElement('div');
  meta.className = 'meta';

  const typeBadge = document.createElement('div');
  typeBadge.className = 'badge type-badge';
  typeBadge.textContent = item.type === 'movie' ? 'MOVIE' : 'BOOK';

  const rightMeta = document.createElement('div');
  rightMeta.style.display = 'flex';
  rightMeta.style.gap = '8px';

  const genreTag = document.createElement('div');
  genreTag.className = 'genre-tag';
  genreTag.textContent = item.genre;

  const moodTag = document.createElement('div');
  moodTag.className = 'mood-tag';
  moodTag.textContent = item.mood;

  rightMeta.appendChild(genreTag);
  rightMeta.appendChild(moodTag);

  meta.appendChild(typeBadge);
  meta.appendChild(rightMeta);

  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = `${item.title} (${item.year})`;

  const desc = document.createElement('div');
  desc.className = 'desc';
  desc.textContent = item.description;

  const rating = document.createElement('div');
  rating.className = 'rating';
  // show stars (rounded to nearest 0.5)
  const stars = document.createElement('div');
  const fullStars = Math.floor(item.rating/2); // out of 5
  const half = (item.rating/2) - fullStars >= 0.5;
  for(let i=0;i<fullStars;i++){
    const s = document.createElement('span'); s.className='star'; s.textContent='★'; stars.appendChild(s);
  }
  if(half){ const s = document.createElement('span'); s.className='star'; s.textContent='☆'; stars.appendChild(s); }
  const num = document.createElement('div'); num.textContent = item.rating.toFixed(1); num.style.marginLeft='8px'; num.style.color='var(--muted)';

  rating.appendChild(stars);
  rating.appendChild(num);

  card.appendChild(meta);
  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(rating);

  return card;
}

// Render list of items
function renderResults(list){
  clearResults();
  if(!list || list.length===0){
    emptyState.hidden = false;
    updateResultsCount(0);
    return;
  }
  const frag = document.createDocumentFragment();
  list.forEach((it, idx) => {
    const c = createCard(it);
    frag.appendChild(c);
    // slight stagger for animation
    setTimeout(()=> c.classList.add('show'), 50 + idx*60);
  });
  resultsContainer.appendChild(frag);
  updateResultsCount(list.length);
}

// Filtering logic: genre AND mood AND rating >= min
function getFiltered(){
  const genre = genreSelect.value;
  const mood = moodSelect.value;
  const minR = parseFloat(minRating.value) || 0;

  // choose dataset by activeType
  const dataset = items.filter(i=> i.type === activeType);

  const filtered = dataset.filter(i=>{
    if(genre && genre!=='All' && i.genre !== genre) return false;
    if(mood && mood!=='All' && i.mood !== mood) return false;
    if(i.rating < minR) return false;
    return true;
  });
  return filtered;
}

// Get Recommendations button handler
getBtn.addEventListener('click', ()=>{
  // show loading for about 350ms
  clearResults();
  showLoading();
  getBtn.disabled = true;
  setTimeout(()=>{
    const results = getFiltered();
    statusArea.innerHTML = '';
    renderResults(results);
    getBtn.disabled = false;
  }, 350);
});

// Reset filters
resetBtn.addEventListener('click', ()=>{
  genreSelect.value = 'All';
  moodSelect.value = 'All';
  minRating.value = 0;
  ratingValue.textContent = '0';
  clearResults();
  // show a subtle message
  statusArea.textContent = 'Filters reset.';
  setTimeout(()=>{ statusArea.textContent = ''; }, 1200);
});

// Edge-case handling: no filters selected should show top-rated defaults
function showDefaultIfNoFilters(){
  const noGenre = !genreSelect.value || genreSelect.value === 'All';
  const noMood = !moodSelect.value || moodSelect.value === 'All';
  const noRating = !minRating.value || Number(minRating.value) === 0;
  if(noGenre && noMood && noRating){
    // show top 8 items of active type by rating
    const top = items.filter(i=>i.type===activeType).sort((a,b)=>b.rating-a.rating).slice(0,8);
    renderResults(top);
  }
}

// Initialize app
function init(){
  populateSelects();
  setActiveMode('movie');
  // default placeholder state: show defaults
  showDefaultIfNoFilters();
}

// Run init on DOM ready
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

// Comments provided above functions explain behavior
