// script.js
// Recommendation engine logic for Movie/Book single-page app

// Cache DOM elements
const btnMovies = document.getElementById('btn-movies');
const btnBooks = document.getElementById('btn-books');
const genreSelect = document.getElementById('genre-select');
const moodSelect = document.getElementById('mood-select');
const ratingRange = document.getElementById('rating-range');
const ratingValue = document.getElementById('rating-value');
const btnGet = document.getElementById('btn-get');
const btnReset = document.getElementById('btn-reset');
const resultsEl = document.getElementById('results');
const loadingEl = document.getElementById('loading');
const emptyEl = document.getElementById('empty');

// Application state
let activeMode = 'movie'; // 'movie' or 'book'
const DEFAULT_MIN_RATING = Number(ratingRange.value) || 6;

// Helper: show/hide utility
function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

// Populate genre and mood selects using DATA_GENRES and DATA_MOODS from data.js
function populateFilters() {
  // Clear existing (except "All")
  genreSelect.innerHTML = '';
  moodSelect.innerHTML = '';

  const allOpt = document.createElement('option');
  allOpt.value = 'all';
  allOpt.textContent = 'All';
  genreSelect.appendChild(allOpt.cloneNode(true));
  moodSelect.appendChild(allOpt.cloneNode(true));

  // Use global arrays prepared in data.js
  if (window.DATA_GENRES && window.DATA_GENRES.length) {
    window.DATA_GENRES.forEach(g => {
      const o = document.createElement('option');
      o.value = g;
      o.textContent = g;
      genreSelect.appendChild(o);
    });
  }

  if (window.DATA_MOODS && window.DATA_MOODS.length) {
    window.DATA_MOODS.forEach(m => {
      const o = document.createElement('option');
      o.value = m;
      o.textContent = m;
      moodSelect.appendChild(o);
    });
  }
}

// Update toggle UI for Movies / Books
function setMode(mode) {
  activeMode = mode;
  if (mode === 'movie') {
    btnMovies.classList.add('active');
    btnMovies.setAttribute('aria-pressed', 'true');
    btnBooks.classList.remove('active');
    btnBooks.setAttribute('aria-pressed', 'false');
  } else {
    btnBooks.classList.add('active');
    btnBooks.setAttribute('aria-pressed', 'true');
    btnMovies.classList.remove('active');
    btnMovies.setAttribute('aria-pressed', 'false');
  }
  // When mode changes, clear results and empty state
  clearResults();
}

// Convert rating (0-10) to 5-star display using Unicode stars
function starsFromRating(rating) {
  const outOfFive = Math.round((rating / 10) * 5);
  let s = '';
  for (let i = 0; i < 5; i++) {
    s += i < outOfFive ? '★' : '☆';
  }
  return s;
}

// Render an array of items into the results area
function renderResults(items) {
  clearResults();
  if (!items || items.length === 0) {
    show(emptyEl);
    return;
  }
  hide(emptyEl);

  const fragment = document.createDocumentFragment();

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'feature-card';
    card.innerHTML = `
      <div class="feature-card-inner">
        <div class="feature-meta">
          <span class="badge type">${item.type === 'movie' ? '🎬 Movie' : '📚 Book'}</span>
          <span class="badge genre">${item.genre}</span>
          <span class="badge mood">${item.mood}</span>
          <span class="rating" aria-label="Rating: ${item.rating} out of 10">${starsFromRating(item.rating)} <small>${item.rating.toFixed(1)}</small></span>
        </div>
        <h3 class="title">${item.title} <span class="year">(${item.year})</span></h3>
        <p class="desc">${item.description}</p>
      </div>
    `;

    // Add hover/fade-in classes handled by CSS
    fragment.appendChild(card);
  });

  resultsEl.appendChild(fragment);
}

// Clear results area and hide status messages
function clearResults() {
  resultsEl.innerHTML = '';
  hide(loadingEl);
  hide(emptyEl);
}

// Core filter logic: apply genre, mood, and min rating (AND logic)
function filterData({ genre, mood, minRating }) {
  const min = Number(minRating) || 0;
  return window.DATA.filter(item => {
    if (item.type !== activeMode) return false;
    if (genre && genre !== 'all' && item.genre !== genre) return false;
    if (mood && mood !== 'all' && item.mood !== mood) return false;
    if (Number(item.rating) < min) return false;
    return true;
  });
}

// Handler for Get Recommendations button
function handleGetRecommendations() {
  // Read current filter values
  const genre = genreSelect.value;
  const mood = moodSelect.value;
  const minRating = Number(ratingRange.value);

  // Determine whether user has actively selected filters
  const isDefaultSelection = (genre === 'all' && mood === 'all');

  // Show loading state (simulate brief delay)
  show(loadingEl);
  hide(emptyEl);
  clearResults(); // clear while loading

  setTimeout(() => {
    // If no filters selected (both All), return top 8 items for the active mode
    let results = [];
    if (isDefaultSelection && minRating === DEFAULT_MIN_RATING) {
      results = window.DATA
        .filter(i => i.type === activeMode)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
    } else {
      results = filterData({ genre, mood, minRating });
    }

    hide(loadingEl);
    renderResults(results);
  }, 350);
}

// Reset filters to defaults and clear results
function resetFilters() {
  genreSelect.value = 'all';
  moodSelect.value = 'all';
  ratingRange.value = DEFAULT_MIN_RATING;
  ratingValue.textContent = DEFAULT_MIN_RATING;
  clearResults();
}

// Event listeners setup
function bindEvents() {
  btnMovies.addEventListener('click', () => setMode('movie'));
  btnBooks.addEventListener('click', () => setMode('book'));

  ratingRange.addEventListener('input', (e) => {
    ratingValue.textContent = Number(e.target.value).toFixed(1);
  });

  btnGet.addEventListener('click', handleGetRecommendations);
  btnReset.addEventListener('click', resetFilters);
}

// Initialize app
function init() {
  populateFilters();
  bindEvents();
  setMode(activeMode);
  ratingValue.textContent = Number(ratingRange.value).toFixed(1);
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
