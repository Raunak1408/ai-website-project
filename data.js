// data.js
// Dataset: 15 movies and 15 books
// Each item: title, genre, mood, year, rating (0-10), type ("movie"/"book"), description

window.DATA = [
  // Movies (15)
  { title: "Skyline Pursuit", genre: "Action", mood: "Adventurous", year: 2018, rating: 8.2, type: "movie", description: "High-speed chases and globe-trotting thrills." },
  { title: "Quiet Harbor", genre: "Drama", mood: "Melancholic", year: 2016, rating: 7.4, type: "movie", description: "A small-town story about loss and renewal." },
  { title: "Lunar Minds", genre: "Sci-Fi", mood: "Thought-provoking", year: 2022, rating: 8.9, type: "movie", description: "A cerebral voyage into human consciousness." },
  { title: "Laugh Track", genre: "Comedy", mood: "Light-hearted", year: 2019, rating: 6.8, type: "movie", description: "A mismatched duo learns to embrace chaos." },
  { title: "Crimson Night", genre: "Thriller", mood: "Suspenseful", year: 2020, rating: 7.9, type: "movie", description: "A detective races the clock to stop a mysterious threat." },
  { title: "Endless Garden", genre: "Romance", mood: "Romantic", year: 2015, rating: 7.1, type: "movie", description: "Two strangers find love in unexpected places." },
  { title: "Dragonfall", genre: "Fantasy", mood: "Adventurous", year: 2013, rating: 8.0, type: "movie", description: "Epic battles and ancient magic collide." },
  { title: "Paper Trails", genre: "Mystery", mood: "Thought-provoking", year: 2011, rating: 6.5, type: "movie", description: "An investigative reporter uncovers a web of secrets." },
  { title: "Roots of Light", genre: "Historical", mood: "Thought-provoking", year: 2009, rating: 7.8, type: "movie", description: "An intimate portrait of a changing era." },
  { title: "Edge of Tomorrow", genre: "Action", mood: "Motivating", year: 2014, rating: 8.6, type: "movie", description: "A relentless battle where hope sparks resilience." },
  { title: "Glass House", genre: "Drama", mood: "Dark", year: 2017, rating: 6.9, type: "movie", description: "Secrets simmer beneath a polished facade." },
  { title: "Neon Dreams", genre: "Sci-Fi", mood: "Light-hearted", year: 2021, rating: 7.6, type: "movie", description: "A colorful caper through futuristic nights." },
  { title: "Silent Whisper", genre: "Mystery", mood: "Suspenseful", year: 2012, rating: 7.0, type: "movie", description: "A cryptic note leads to a chilling revelation." },
  { title: "Champion's Rise", genre: "Biography", mood: "Motivating", year: 2010, rating: 8.1, type: "movie", description: "True story of an underdog's climb to fame." },
  { title: "Afterglow", genre: "Romance", mood: "Happy", year: 2023, rating: 7.5, type: "movie", description: "A sweet tale about new beginnings." },

  // Books (15)
  { title: "The Wandering Mind", genre: "Fantasy", mood: "Thought-provoking", year: 2014, rating: 8.7, type: "book", description: "An odyssey through memory and myth." },
  { title: "City of Echoes", genre: "Mystery", mood: "Suspenseful", year: 2018, rating: 7.3, type: "book", description: "A labyrinthine noir that keeps you guessing." },
  { title: "Sunlit Lessons", genre: "Self-help", mood: "Motivating", year: 2020, rating: 6.8, type: "book", description: "Practical tips to bring calm and focus to daily life." },
  { title: "Starlit Machines", genre: "Sci-Fi", mood: "Thought-provoking", year: 2019, rating: 8.4, type: "book", description: "A philosophical take on technology and morality." },
  { title: "The Lost Letter", genre: "Romance", mood: "Romantic", year: 2012, rating: 7.0, type: "book", description: "Love rediscovered through an old correspondence." },
  { title: "Bright Steps", genre: "Non-fiction", mood: "Happy", year: 2016, rating: 6.5, type: "book", description: "Uplifting essays on small wins and progress." },
  { title: "Beneath the Ice", genre: "Thriller", mood: "Dark", year: 2015, rating: 7.9, type: "book", description: "A tense survival thriller with moral stakes." },
  { title: "Portraits of Reason", genre: "Biography", mood: "Thought-provoking", year: 2011, rating: 8.0, type: "book", description: "Life lessons from a revolutionary thinker." },
  { title: "Quiet Revolutions", genre: "Historical", mood: "Thought-provoking", year: 2008, rating: 7.6, type: "book", description: "Hidden movements that shaped an era." },
  { title: "Comet Riders", genre: "Fantasy", mood: "Adventurous", year: 2021, rating: 8.3, type: "book", description: "Young heroes on a cosmic quest." },
  { title: "Laugh Lines", genre: "Comedy", mood: "Light-hearted", year: 2017, rating: 6.9, type: "book", description: "Humorous essays about modern life." },
  { title: "The Long Shadow", genre: "Drama", mood: "Melancholic", year: 2013, rating: 7.2, type: "book", description: "Interlinked stories about family and regret." },
  { title: "Blueprints for Tomorrow", genre: "Non-fiction", mood: "Motivating", year: 2022, rating: 8.5, type: "book", description: "Innovative ideas for building better communities." },
  { title: "Secret Orchards", genre: "Romance", mood: "Happy", year: 2007, rating: 6.7, type: "book", description: "A tender narrative about second chances." },
  { title: "Detective's Diary", genre: "Mystery", mood: "Suspenseful", year: 2005, rating: 7.4, type: "book", description: "A seasoned sleuth revisits unsolved cases." }
];

// Helper arrays for populating filters
window.DATA_GENRES = Array.from(new Set(window.DATA.map(i => i.genre))).sort();
window.DATA_MOODS = Array.from(new Set(window.DATA.map(i => i.mood))).sort();
