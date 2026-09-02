// script.js
// Recommendation engine logic for Movies/Books single-page app

// Get DOM elements (IDs are defined in index.html)
const btnMovies = document.getElementById('btn-movies');
const btnBooks = document.getElementById('btn-books');
const genreSelect = document.getElementById('genre');
const moodSelect = document.getElementById('mood');
const ratingRange = document.getElementById('minRating');
const ratingValueLabel = document.getElementById('ratingValue');
const btnGet = document.getElementById('getBtn');
const btnReset = document.getElementById('resetBtn');
const resultsEl = document.getElementById('results');
const loadingEl = document.getElementById('loading');
const emptyStateEl = document.getElementById('emptyState');
const resultsCountEl = document.getElementById('resultsCount');
const statusArea = document.getElementById('statusArea');

// Active mode: 'movie' or 'book'
let activeMode = 'movie';

// Default minimal rating considered when deciding "no filters"
const DEFAULT_MIN_RATING = Number(ratingRange ? ratingRange.value : 0) || 0;

// Utility show/hide
function show(el) { if (!el) return; el.hidden = false; el.classList.remove('hidden'); }
function hide(el) { if (!el) return; el.hidden = true; el.classList.add('hidden'); }

// Populate Genre and Mood selects from data.js (generated lists)
function populateFilters() {
  // Clear existing options
  genreSelect.innerHTML = '';
  moodSelect.innerHTML = '';

  // Add "All" option first
  const allGenre = document.createElement('option');
  allGenre.value = 'all';
  allGenre.textContent = 'All';
  genreSelect.appendChild(allGenre);

  const allMood = document.createElement('option');
  allMood.value = 'all';
  allMood.textContent = 'All';
  moodSelect.appendChild(allMood);

  // Use precomputed genre/mood lists from data.js when available
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

// Set active mode UI and behavior
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
  // When mode changes, clear previous results and helpful status
  clearResultsArea();
}

// Convert 0-10 rating to a 0-5 star string (rounded to half stars)
function starsFromRating(r) {
  const outOfFive = Math.round((Number(r) / 2) * 2) / 2; // half-star precision
  const full = Math.floor(outOfFive);
  const half = outOfFive % 1 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '☆' : '') + '✩'.repeat(empty);
}

// Core filtering logic: AND of genre, mood, and minRating
function filterData({ genre, mood, minRating }) {
  const min = Number(minRating) || 0;
  return window.DATA.filter(item => {
    if (item.type !== activeMode) return false; // mode filter
    if (genre && genre !== 'all' && item.genre !== genre) return false;
    if (mood && mood !== 'all' && item.mood !== mood) return false;
    if (Number(item.rating) < min) return false;
    return true;
  });
}

// Render results cards into the DOM
function renderResults(items) {
  // Clear
  resultsEl.innerHTML = '';
  hide(emptyStateEl);

  if (!items || items.length === 0) {
    // Show empty state
    show(emptyStateEl);
    resultsCountEl.textContent = '';
    return;
  }

  // Fade-in container: create fragment
  const frag = document.createDocumentFragment();

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'feature-card';

    // Badge row
    const meta = document.createElement('div');
    meta.className = 'feature-meta';

    const typeSpan = document.createElement('span');
    typeSpan.className = 'badge type';
    typeSpan.textContent = item.type === 'movie' ? '🎬 Movie' : '📚 Book';
    meta.appendChild(typeSpan);

    const genreSpan = document.createElement('span');
    genreSpan.className = 'badge genre';
    genreSpan.textContent = item.genre;
    meta.appendChild(genreSpan);

    const moodSpan = document.createElement('span');
    moodSpan.className = 'badge mood';
    moodSpan.textContent = item.mood;
    meta.appendChild(moodSpan);

    // Title
    const h3 = document.createElement('h3');
    h3.className = 'title';
    h3.textContent = item.title + (item.year ? ` (${item.year})` : '');

    // Rating
    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'rating';
    ratingDiv.setAttribute('aria-label', `Rating ${item.rating} out of 10`);
    ratingDiv.innerHTML = `<span class="stars">${starsFromRating(item.rating)}</span> <span class="num">${Number(item.rating).toFixed(1)}/10</span>`;

    // Description
    const p = document.createElement('p');
    p.className = 'desc';
    p.textContent = item.description;

    // Assemble
    card.appendChild(meta);
    card.appendChild(h3);
    card.appendChild(ratingDiv);
    card.appendChild(p);

    // Hover/fade animation class
    card.style.animation = 'fadeIn .35s ease both';

    frag.appendChild(card);
  });

  resultsEl.appendChild(frag);
  resultsCountEl.textContent = `${items.length} recommendation${items.length>1?'s':''}`;
}

// Clear results area and status
function clearResultsArea() {
  resultsEl.innerHTML = '';
  resultsCountEl.textContent = '';
  hide(loadingEl);
  hide(emptyStateEl);
  statusArea.textContent = '';
}

// Reset filters to defaults and clear results
function resetFilters() {
  genreSelect.value = 'all';
  moodSelect.value = 'all';
  ratingRange.value = DEFAULT_MIN_RATING;
  if (ratingValueLabel) ratingValueLabel.textContent = ratingRange.value;
  clearResultsArea();
}

// Handle Get Recommendations click
function handleGetRecommendations() {
  const genre = genreSelect.value;
  const mood = moodSelect.value;
  const minRating = Number(ratingRange.value) || 0;

  const isDefaultSelection = (genre === 'all' && mood === 'all' && minRating === DEFAULT_MIN_RATING);

  // Show loading shimmer briefly
  show(loadingEl);
  hide(emptyStateEl);

  setTimeout(() => {
    let results = [];

    if (isDefaultSelection) {
      // No filter selected: show top-rated items for the active mode (8)
      results = window.DATA
        .filter(i => i.type === activeMode)
        .sort((a,b) => Number(b.rating) - Number(a.rating))
        .slice(0, 8);
      statusArea.textContent = 'Top picks for you — try filters to narrow results.';
    } else {
      results = filterData({ genre, mood, minRating });
      statusArea.textContent = '';
    }

    hide(loadingEl);
    renderResults(results);
  }, 350);
}

// Wire up events
function bindEvents() {
  btnMovies.addEventListener('click', () => setMode('movie'));
  btnBooks.addEventListener('click', () => setMode('book'));

  btnGet.addEventListener('click', handleGetRecommendations);
  btnReset.addEventListener('click', resetFilters);

  // Live update rating label if present
  if (ratingRange && ratingValueLabel) {
    ratingRange.addEventListener('input', (e) => {
      ratingValueLabel.textContent = e.target.value;
    });
  }
}

// Initialize app when DOM content is ready
function init() {
  populateFilters();
  bindEvents();
  setMode(activeMode);
}

// If DOM already loaded, init; otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
