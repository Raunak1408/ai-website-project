// data.js — product data for WonderBox Kids
window.WonderBox = window.WonderBox || {};
WonderBox.products = [
  {id:'P001',name:'Solar System Discovery Kit',description:'Build a glowing solar system model and learn about planets.',price:34.99,category:'STEM & Science',age:'8-9',rating:4.8,image:'https://images.unsplash.com/photo-1531224223341-0d6b6c6f8a1e?q=80&w=1200&auto=format&fit=crop',alt:'solar system kit'},
  {id:'P002',name:'Magnetic Building Tiles',description:'Colorful magnetic tiles for creative building and geometry play.',price:49.99,category:'Building & Construction',age:'5-6',rating:4.7,image:'https://images.unsplash.com/photo-1597600155367-1f1c3e1a5a07?q=80&w=1200&auto=format&fit=crop',alt:'magnetic tiles'},
  {id:'P003',name:'Dinosaur Fossil Dig Kit',description:'Excavate mini fossils and learn about paleontology.',price:19.99,category:'Outdoor & Exploration',age:'5-6',rating:4.6,image:'https://images.unsplash.com/photo-1582719478250-6c3b6d6b97e0?q=80&w=1200&auto=format&fit=crop',alt:'fossil dig kit'},
  {id:'P004',name:'Junior Microscope',description:'Compact microscope for observing leaves, insects and slides.',price:39.5,category:'STEM & Science',age:'7-8',rating:4.5,image:'https://images.unsplash.com/photo-1581093588401-5a8d9b8e4b8c?q=80&w=1200&auto=format&fit=crop',alt:'kid microscope'},
  {id:'P005',name:'Wooden Number Puzzle',description:'Durable wooden puzzle to practice counting and shapes.',price:14.0,category:'Puzzles & Learning',age:'3-4',rating:4.9,image:'https://images.unsplash.com/photo-1547149602-2f05a3f3b9b0?q=80&w=1200&auto=format&fit=crop',alt:'wooden puzzle'},
  {id:'P006',name:'Rainbow Paint Set',description:'Washable paints and brushes for creative art sessions.',price:27.5,category:'Arts & Creative',age:'5-6',rating:4.7,image:'https://images.unsplash.com/photo-1526318472351-c75fcf070b44?q=80&w=1200&auto=format&fit=crop',alt:'paint set'},
  {id:'P007',name:'Pretend Play Kitchen',description:'Mini kitchen with utensils for role play and social skills.',price:22.0,category:'Pretend Play',age:'3-4',rating:4.6,image:'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1200&auto=format&fit=crop',alt:'toy kitchen'},
  {id:'P008',name:'Outdoor Explorer Binoculars',description:'Kid-friendly binoculars for backyard nature adventures.',price:24.9,category:'Outdoor & Exploration',age:'3-4',rating:4.4,image:'https://images.unsplash.com/photo-1502759775549-0c9ecf1e6a6f?q=80&w=1200&auto=format&fit=crop',alt:'binoculars'}
];

// categories and site meta
WonderBox.categories = ['All'].concat(Array.from(new Set(WonderBox.products.map(p=>p.category))));
WonderBox.ages = ['All'].concat(Array.from(new Set(WonderBox.products.map(p=>p.age))));

// simple site metadata
WonderBox.site = {name:'WonderBox Kids',tagline:'Fun Toys. Skills for Tomorrow.'};
