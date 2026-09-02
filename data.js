// data.js
// Array of 30 items: 15 movies and 15 books
const ITEMS = [
  // Movies
  { title: "Moonlight Sonata", genre: "Drama", mood: "Thought-provoking", year: 2016, rating: 8.7, type: "movie", description: "A quiet coming-of-age story about identity and family." },
  { title: "Starbound", genre: "Sci-Fi", mood: "Adventurous", year: 2021, rating: 7.9, type: "movie", description: "A crew ventures beyond the solar system and faces unknown perils." },
  { title: "Laugh Track", genre: "Comedy", mood: "Light-hearted", year: 2019, rating: 6.4, type: "movie", description: "A comedian navigates fame, love, and the absurdities of life." },
  { title: "Midnight Whispers", genre: "Thriller", mood: "Suspenseful", year: 2018, rating: 7.5, type: "movie", description: "A journalist uncovers a conspiracy that puts them in danger." },
  { title: "Hearts in Paris", genre: "Romance", mood: "Romantic", year: 2015, rating: 7.1, type: "movie", description: "Two strangers find unexpected love on the streets of Paris." },
  { title: "The Old Library", genre: "Mystery", mood: "Thought-provoking", year: 2020, rating: 8.2, type: "movie", description: "A detective explores hidden secrets in an ancient library." },
  { title: "Wilderness Run", genre: "Adventure", mood: "Adventurous", year: 2014, rating: 6.9, type: "movie", description: "Survival and friendship on an unforgiving mountain range." },
  { title: "Shadows of Elm Street", genre: "Horror", mood: "Dark", year: 2012, rating: 5.8, type: "movie", description: "An old town is haunted by secrets that won't stay buried." },
  { title: "Future Crimes", genre: "Sci-Fi", mood: "Dark", year: 2022, rating: 8.9, type: "movie", description: "A detective chases a hacker in a neon-lit metropolis." },
  { title: "Gentle Giants", genre: "Documentary", mood: "Calm", year: 2017, rating: 9.1, type: "movie", description: "An intimate portrait of conservationists and the animals they protect." },
  { title: "Culinary Roads", genre: "Documentary", mood: "Light-hearted", year: 2016, rating: 7.4, type: "movie", description: "A travel-food journey through small towns and big flavors." },
  { title: "The Last Heist", genre: "Thriller", mood: "Suspenseful", year: 2013, rating: 6.2, type: "movie", description: "A group plans one final, risky robbery with unexpected twists." },
  { title: "Skybound", genre: "Fantasy", mood: "Adventurous", year: 2011, rating: 7.8, type: "movie", description: "A young pilot discovers a world in the clouds and a destiny to save it." },
  { title: "Friendly Neighbors", genre: "Comedy", mood: "Happy", year: 2020, rating: 6.0, type: "movie", description: "A neighborhood's antics lead to misunderstandings and laughs." },
  { title: "Echoes", genre: "Drama", mood: "Melancholic", year: 2009, rating: 8.5, type: "movie", description: "Memory, grief, and the echoes that shape our lives." },

  // Books
  { title: "Map of Quiet Things", genre: "Historical", mood: "Thought-provoking", year: 2013, rating: 8.3, type: "book", description: "A novel about small moments that change generations." },
  { title: "Galactic Traders", genre: "Sci-Fi", mood: "Adventurous", year: 2018, rating: 7.6, type: "book", description: "Smugglers, trade wars, and a fight for freedom in deep space." },
  { title: "Beneath the Willow", genre: "Romance", mood: "Romantic", year: 2010, rating: 6.7, type: "book", description: "A slow-burning romance between two unlikely souls." },
  { title: "Laughter Lines", genre: "Comedy", mood: "Light-hearted", year: 2020, rating: 7.0, type: "book", description: "Essays on modern life with warmth and wit." },
  { title: "The Silent Vault", genre: "Mystery", mood: "Suspenseful", year: 2015, rating: 8.0, type: "book", description: "An archivist races to decode a series of cryptic journals." },
  { title: "Steps to Clarity", genre: "Self-help", mood: "Motivating", year: 2021, rating: 7.9, type: "book", description: "Practical advice for clearing mental clutter and building habits." },
  { title: "Ancient Rivers", genre: "Non-fiction", mood: "Thought-provoking", year: 2012, rating: 8.6, type: "book", description: "An exploration of civilizations shaped by water." },
  { title: "The Last Letter", genre: "Drama", mood: "Melancholic", year: 2008, rating: 7.3, type: "book", description: "A family saga told through letters and memories." },
  { title: "Rise & Quest", genre: "Fantasy", mood: "Adventurous", year: 2019, rating: 8.1, type: "book", description: "A band of misfits set out to reclaim lost magic." },
  { title: "Dark Corners", genre: "Horror", mood: "Dark", year: 2014, rating: 6.1, type: "book", description: "A chilling collection of short stories." },
  { title: "Numbers & Notes", genre: "Biography", mood: "Calm", year: 2016, rating: 8.8, type: "book", description: "The life story of a pianist who changed classical music." },
  { title: "Mindful Minutes", genre: "Self-help", mood: "Calm", year: 2022, rating: 7.2, type: "book", description: "Short practices to reduce stress and increase focus." },
  { title: "City of Glass", genre: "Mystery", mood: "Thought-provoking", year: 2005, rating: 9.0, type: "book", description: "A detective novel that blurs reality and imagination." },
  { title: "Kitchen Diaries", genre: "Non-fiction", mood: "Light-hearted", year: 2017, rating: 6.5, type: "book", description: "Stories and recipes from a lifetime of cooking." },
  { title: "Brave Steps", genre: "Self-help", mood: "Motivating", year: 2011, rating: 5.9, type: "book", description: "An honest look at failure and the path forward." }
];

// Note: Genre options used across items (must match index.html select options):
const GENRES = [
  "All",
  "Drama",
  "Comedy",
  "Sci-Fi",
  "Fantasy",
  "Thriller",
  "Romance",
  "Mystery",
  "Adventure",
  "Horror",
  "Documentary",
  "Historical",
  "Non-fiction",
  "Biography",
  "Self-help"
];

// Mood options used across items (must match index.html select options):
const MOODS = [
  "All",
  "Happy",
  "Dark",
  "Thought-provoking",
  "Light-hearted",
  "Motivating",
  "Calm",
  "Adventurous",
  "Romantic",
  "Melancholic",
  "Suspenseful"
];
