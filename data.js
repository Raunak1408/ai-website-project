// data.js — product and activity data for WonderBox Kids
// Ensure this file loads before script.js

window.WonderBox = window.WonderBox || {};

WonderBox.products = [
  {
    id: "P001",
    name: "Solar System Discovery Kit",
    description: "A hands-on kit with planets, orbit models and a glow-in-the-dark solar map to explore the solar system.",
    price: 34.99,
    category: "STEM & Science",
    age: "8-9",
    rating: 4.8,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6f5a6d9d2f2b8f6f3f3b6a1e7f5c9d2b",
    alt: "solar system model and planets educational kit",
    learning: "Astronomy basics, planetary order, observational skills"
  },
  {
    id: "P002",
    name: "Magnetic Building Tiles",
    description: "Colorful magnetic tiles for building 2D and 3D structures that develop spatial reasoning and fine motor skills.",
    price: 49.99,
    category: "Building & Construction",
    age: "5-6",
    rating: 4.7,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1578795845686-b6e78c4d9f9e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3b4e2f4c9a5b1d2f6e7e2b9a6c1d4e7f",
    alt: "colorful magnetic building tiles set",
    learning: "STEM, geometry, creativity, problem solving"
  },
  {
    id: "P003",
    name: "Dinosaur Fossil Dig Kit",
    description: "Dig, brush and assemble realistic fossil pieces to discover prehistoric creatures.",
    price: 19.99,
    category: "Puzzles & Games",
    age: "5-6",
    rating: 4.6,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1601040673732-0f1d2f4e3b2e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2b9c4a5f7d1e3b2c9a6f7d8e1b2c3d4e",
    alt: "dinosaur fossil dig archaeological excavation kit",
    learning: "Paleontology basics, patience, sequencing"
  },
  {
    id: "P004",
    name: "Junior Science Microscope",
    description: "A kid-friendly microscope with easy focusing, slides and simple experiments to explore the microscopic world.",
    price: 39.5,
    category: "STEM & Science",
    age: "7-8",
    rating: 4.5,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1581090463561-2c3c5f2d6f6d?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=a4b3c2d6e7f8a9b1c0d2e3f4b5a6c7d8",
    alt: "children's science microscope with slides",
    learning: "Observation, scientific method, fine motor"
  },
  {
    id: "P005",
    name: "Wooden Number Puzzle",
    description: "Durable wooden puzzle with numbers and shapes to support counting and early numeracy.",
    price: 14.0,
    category: "Puzzles & Games",
    age: "3-4",
    rating: 4.9,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1582719478177-7f0d3a8a1c7a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=7c6b5a4d3e2f1a0b9c8d7e6f5a4b3c2d",
    alt: "wooden number puzzle for toddlers",
    learning: "Counting, number recognition, hand-eye coordination"
  },
  {
    id: "P006",
    name: "Rainbow Art Studio",
    description: "A complete art set with washable paints, brushes, paper and stickers to spark creativity.",
    price: 27.5,
    category: "Arts & Creativity",
    age: "5-6",
    rating: 4.7,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=99b7a8c6d5e4f3c2b1a0e9d8c7b6a5f4",
    alt: "children's rainbow art studio painting supplies",
    learning: "Color mixing, fine motor, creative expression"
  },
  {
    id: "P007",
    name: "Kids Doctor Pretend Set",
    description: "Pretend play medical kit with stethoscope, thermometer and bandages to encourage empathy and role play.",
    price: 22.0,
    category: "Pretend Play",
    age: "3-4",
    rating: 4.6,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    alt: "children's doctor pretend play set with stethoscope",
    learning: "Empathy, language, role playing"
  },
  {
    id: "P008",
    name: "Remote Control Stunt Car",
    description: "Durable RC stunt car that flips, spins and races — built for outdoor adventure.",
    price: 59.99,
    category: "Outdoor Fun",
    age: "7-8",
    rating: 4.4,
    availability: "Limited stock",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1e2d3c4b5a6f7e8d9c0b1a2c3d4e5f6a",
    alt: "remote control stunt toy car",
    learning: "Hand-eye coordination, cause & effect, outdoor play"
  },
  {
    id: "P009",
    name: "World Map Learning Puzzle",
    description: "Large floor puzzle of the world with landmarks and animals to learn geography through play.",
    price: 44.0,
    category: "Puzzles & Games",
    age: "7-8",
    rating: 4.8,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d",
    alt: "world map learning floor puzzle for kids",
    learning: "Geography, landmarks, cultural awareness"
  },
  {
    id: "P010",
    name: "Mini Engineering Blocks",
    description: "Plastic blocks and connectors for building simple machines and practicing engineering basics.",
    price: 29.99,
    category: "Building & Construction",
    age: "7-8",
    rating: 4.5,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b0?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=4d3c2b1a9e8f7d6c5b4a3e2f1d0c9b8a",
    alt: "mini engineering building blocks set",
    learning: "Engineering, problem solving, spatial reasoning"
  },
  {
    id: "P011",
    name: "Coding Robot Buddy",
    description: "A beginner-friendly robot that teaches block-based coding and sequencing with lights and sounds.",
    price: 74.99,
    category: "STEM & Science",
    age: "9-10",
    rating: 4.7,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1581091012184-7b8b5f7b6a2c?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=8c7b6a5d4e3f2b1a0c9d8e7f6a5b4c3d",
    alt: "educational coding robot toy for kids",
    learning: "Coding fundamentals, sequencing, logical thinking"
  },
  {
    id: "P012",
    name: "Animal Memory Match",
    description: "A memory game with animal cards to boost concentration and memory skills.",
    price: 12.5,
    category: "Puzzles & Games",
    age: "3-4",
    rating: 4.6,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1501706362039-c6e8090d8a8e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d",
    alt: "animal memory match card game for kids",
    learning: "Memory, attention, animal recognition"
  },
  {
    id: "P013",
    name: "Kids Kitchen Play Set",
    description: "Realistic play kitchen with utensils and pretend food to encourage role play and social skills.",
    price: 68.0,
    category: "Pretend Play",
    age: "5-6",
    rating: 4.7,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1517705008125-6b3f74d6b6d3?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d",
    alt: "children's kitchen play set with utensils",
    learning: "Imaginative play, social skills, language"
  },
  {
    id: "P014",
    name: "Giant Floor Puzzle",
    description: "Oversized floor puzzle pieces for collaborative play and gross motor development.",
    price: 39.99,
    category: "Puzzles & Games",
    age: "5-6",
    rating: 4.6,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1509099836639-18ba3b7b8c5f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
    alt: "giant floor puzzle pieces for kids",
    learning: "Collaboration, spatial awareness, problem solving"
  },
  {
    id: "P015",
    name: "Outdoor Bubble Blaster",
    description: "High-output bubble blaster for outdoor fun and active play.",
    price: 24.99,
    category: "Outdoor Fun",
    age: "3-4",
    rating: 4.4,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1526403224731-7e6e5a6f4c2b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e",
    alt: "outdoor bubble blaster toy creating bubbles",
    learning: "Gross motor play, outdoor activity, cause & effect"
  },
  {
    id: "P016",
    name: "Creative Clay Starter Kit",
    description: "Non-toxic modeling clay set with tools to sculpt and explore textures and shapes.",
    price: 18.0,
    category: "Arts & Creativity",
    age: "5-6",
    rating: 4.5,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1519872471926-c91b28f2d7c8?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    alt: "creative modeling clay starter kit",
    learning: "Fine motor, creativity, sensory play"
  },
  {
    id: "P017",
    name: "Alphabet Learning Board",
    description: "Interactive alphabet board with letters, pictures and tracing activities for early literacy.",
    price: 21.5,
    category: "STEM & Science",
    age: "3-4",
    rating: 4.8,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1560200358-0c8f7f9a1e2b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d",
    alt: "alphabet learning board for toddlers",
    learning: "Letters, phonics, pre-reading skills"
  },
  {
    id: "P018",
    name: "Safari Animal Figure Set",
    description: "Durable miniature animal figures for imaginative play and learning about wildlife.",
    price: 16.99,
    category: "Pretend Play",
    age: "3-4",
    rating: 4.6,
    availability: "In stock",
    image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e",
    alt: "safari animal figure toy set",
    learning: "Animal recognition, vocabulary, imaginative play"
  }
];

// Categories for filters (must exactly match product.category values)
WonderBox.categories = [
  "All",
  "STEM & Science",
  "Building & Construction",
  "Arts & Creativity",
  "Pretend Play",
  "Puzzles & Games",
  "Outdoor Fun"
];

// Age buckets (must match product.age values)
WonderBox.ages = ["All", "3-4", "5-6", "7-8", "9-10", "11-12"];

// Activities list (10 required)
WonderBox.activities = [
  {
    id: "A01",
    title: "Build a Paper Rocket",
    image: "https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=7c3f2b9a5d1e6f4b2c3a1d9e8f7b6c5d",
    description: "Create a paper rocket and test launch with a straw-powered blast.",
    age: "5-6",
    duration: "20 mins",
    difficulty: "Easy",
    materials: ["Paper","Scissors","Tape","Straw"],
    instructions: "Fold and shape a rocket from paper, add fins, and use a straw to blow and launch. Test different fin shapes to compare distance."
  },
  {
    id: "A02",
    title: "DIY Volcano Experiment",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3d4c5b6a7f8e9c0b1a2d3e4f5b6c7a8d",
    description: "Make a baking-soda and vinegar volcano and observe chemical reactions.",
    age: "7-8",
    duration: "30 mins",
    difficulty: "Medium",
    materials: ["Baking soda","Vinegar","Dish soap","Food coloring"],
    instructions: "Build a volcano structure from clay or paper-mâché, add baking soda inside, mix vinegar with food coloring and dish soap, pour and observe eruption."
  },
  {
    id: "A03",
    title: "Nature Treasure Hunt",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6b7a8c9d0e1f2a3b4c5d6e7f8a9b0c1d",
    description: "Explore outside and collect items from a scavenger list to learn about nature.",
    age: "5-6",
    duration: "25 mins",
    difficulty: "Easy",
    materials: ["Bag","Checklist","Pencil"],
    instructions: "Make a checklist of leaves, rocks, flowers, seeds. Walk outside and find items, discuss textures and colors."
  },
  {
    id: "A04",
    title: "Make Your Own Story",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
    description: "Create an illustrated storybook using drawings and simple sentences.",
    age: "7-8",
    duration: "45 mins",
    difficulty: "Medium",
    materials: ["Paper","Markers","Stapler"],
    instructions: "Fold pages, draw scenes, write simple sentences, staple into a book and share with family."
  },
  {
    id: "A05",
    title: "Color Mixing Challenge",
    image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d",
    description: "Explore primary colors by mixing paint to achieve target colors.",
    age: "3-4",
    duration: "15 mins",
    difficulty: "Easy",
    materials: ["Washable paint","Paper","Palette"],
    instructions: "Provide color swatches, ask children to mix paints to match target colors — experiment and discuss results."
  },
  {
    id: "A06",
    title: "Build a Mini Bridge",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    description: "Construct a small bridge from craft sticks and test its strength.",
    age: "9-10",
    duration: "40 mins",
    difficulty: "Medium",
    materials: ["Craft sticks","Glue","Weights"],
    instructions: "Design a bridge, build supports and deck, add weights to test load. Discuss engineering choices."
  },
  {
    id: "A07",
    title: "Number Treasure Hunt",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=4f5e6d7c8b9a0c1d2e3f4a5b6c7d8e9f",
    description: "A counting hunt: find hidden numbers and practice simple sums.",
    age: "3-4",
    duration: "20 mins",
    difficulty: "Easy",
    materials: ["Number cards","Tape"],
    instructions: "Hide number cards around a room/outside, find them and add up values to reach a target."
  },
  {
    id: "A08",
    title: "Animal Memory Challenge",
    image: "https://images.unsplash.com/photo-1496975367451-8bbd7d0e3d4b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e",
    description: "A memory game using animal cards — improve recall and concentration.",
    age: "5-6",
    duration: "15 mins",
    difficulty: "Easy",
    materials: ["Animal cards","Table"],
    instructions: "Lay cards face down, take turns flipping two. Match pairs and collect — highest pairs win."
  },
  {
    id: "A09",
    title: "Create a Solar System",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=9c8b7a6d5e4f3a2b1c0d9e8f7a6b5c4d",
    description: "Paint and assemble a hanging solar mobile to learn planetary order.",
    age: "7-8",
    duration: "60 mins",
    difficulty: "Medium",
    materials: ["Paint","Cardboard","String"],
    instructions: "Cut circles for planets, paint them, attach strings to a ring and hang as a mobile. Label each planet."
  },
  {
    id: "A10",
    title: "Make Homemade Play Dough",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a",
    description: "Easy, edible play dough recipe for sensory and sculpting fun.",
    age: "3-4",
    duration: "20 mins",
    difficulty: "Easy",
    materials: ["Flour","Salt","Water","Food coloring"],
    instructions: "Mix flour, salt and water, add food coloring and knead until smooth. Store in airtight container."
  }
];

// Site metadata
WonderBox.site = {
  name: "WonderBox Kids",
  tagline: "Fun Today. Skills for Tomorrow.",
  currency: "$",
  freeShippingThreshold: 75,
  shippingFee: 7
};
