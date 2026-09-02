// data.js - list of toy products for the site
// Each product: id, name, category, price, ageGroup, rating, description, image, relatedImages
// Images use Unsplash source queries to provide relevant, free-to-use toy images.
window.PRODUCTS = [
  {
    id: 1,
    name: "Thunderbolt RC Car",
    category: "Remote Control Toys",
    price: 2499,
    ageGroup: "6+",
    rating: 4.5,
    description: "High-speed remote control car with rechargeable battery and precise steering — great for outdoor racing.",
    image: "https://images.unsplash.com/photo-1606813902868-3e3f0b5ae4f6?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1606813902868-3e3f0b5ae4f6?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1520975914846-53b1d2f0b6f4?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 2,
    name: "Galaxy Action Hero - 12in",
    category: "Action Figures",
    price: 899,
    ageGroup: "4+",
    rating: 4.2,
    description: "Articulated 12-inch action figure with removable accessories and detailed paintwork.",
    image: "https://images.unsplash.com/photo-1526403224745-8dd0f8d4f0b1?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1526403224745-8dd0f8d4f0b1?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1597101151652-6d78c2e1b2a1?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 3,
    name: "Cuddly Teddy Bear",
    category: "Soft Toys",
    price: 599,
    ageGroup: "0+",
    rating: 4.8,
    description: "Soft plush teddy bear made with hypoallergenic materials — perfect bedtime companion for babies and toddlers.",
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1526401281623-efd0f9e2b1f3?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 4,
    name: "Wooden Alphabet Puzzle",
    category: "Puzzles",
    price: 399,
    ageGroup: "2+",
    rating: 4.6,
    description: "Colorful wooden alphabet puzzle that helps pre-schoolers learn letters and develop fine motor skills.",
    image: "https://images.unsplash.com/photo-1582719478170-8f4b3b29d06f?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1582719478170-8f4b3b29d06f?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1582719478200-4d5a9a2b6a9f?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1582719478194-6b1b9f0a5f0c?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 5,
    name: "Robot Building Kit",
    category: "Educational Toys",
    price: 1299,
    ageGroup: "8+",
    rating: 4.4,
    description: "STEM robotics kit with easy-to-follow instructions — assemble, code, and control your first robot.",
    image: "https://images.unsplash.com/photo-1581091012184-7b2f5f6a0f84?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1581091012184-7b2f5f6a0f84?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1584270354949-6b7b8f6e6b2c?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 6,
    name: "Speedster Drone",
    category: "Remote Control Toys",
    price: 3499,
    ageGroup: "10+",
    rating: 4.1,
    description: "Compact beginner drone with stable flight, camera support and easy controls for young pilots.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 7,
    name: "Educational Shapes Sorter",
    category: "Educational Toys",
    price: 349,
    ageGroup: "1+",
    rating: 4.3,
    description: "Bright shape sorter for toddlers to learn shapes, colors and develop hand-eye coordination.",
    image: "https://images.unsplash.com/photo-1582719478223-3c8e6b1f9f9a?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1582719478223-3c8e6b1f9f9a?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1582719478198-3f5f2b3c4e6a?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1582719478210-2a3f9a1d4b1c?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 8,
    name: "Pirate Ship Playset",
    category: "Action Figures",
    price: 1599,
    ageGroup: "5+",
    rating: 4.0,
    description: "Detailed pirate ship playset with mini figures and moveable parts for imaginative play.",
    image: "https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 9,
    name: "Plush Bunny (Large)",
    category: "Soft Toys",
    price: 799,
    ageGroup: "0+",
    rating: 4.7,
    description: "Extra-large plush bunny with stitched eyes and soft fur — safe and machine-washable.",
    image: "https://images.unsplash.com/photo-1510821825093-0e4a6e2f6b1f?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1510821825093-0e4a6e2f6b1f?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 10,
    name: "3D Wooden Puzzle Globe",
    category: "Puzzles",
    price: 699,
    ageGroup: "9+",
    rating: 4.2,
    description: "Intricate 3D wooden globe puzzle — assemble continents and enjoy a decorative model when finished.",
    image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1520975914846-53b1d2f0b6f4?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 11,
    name: "Superhero Trading Figures (Pack of 6)",
    category: "Action Figures",
    price: 499,
    ageGroup: "4+",
    rating: 4.1,
    description: "Collectible mini superhero figures in a value pack — perfect for party favors and imaginative battles.",
    image: "https://images.unsplash.com/photo-1526403224745-8dd0f8d4f0b1?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1526403224745-8dd0f8d4f0b1?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 12,
    name: "Interactive Learning Tablet",
    category: "Educational Toys",
    price: 1999,
    ageGroup: "3+",
    rating: 4.0,
    description: "Kid-friendly learning tablet with games, reading exercises and parental controls.",
    image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1553456558-aff63285bdd2?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1582719478170-8f4b3b29d06f?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 13,
    name: "Magnetic Building Blocks Set",
    category: "Educational Toys",
    price: 899,
    ageGroup: "3+",
    rating: 4.6,
    description: "Magnetic tiles and blocks to build 2D/3D structures — encourages creativity and spatial reasoning.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1520975914846-53b1d2f0b6f4?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 14,
    name: "Classic Wooden Train Set",
    category: "Puzzles",
    price: 1199,
    ageGroup: "2+",
    rating: 4.5,
    description: "Durable wooden train set with tracks and wooden carriages — compatible with most wooden train systems.",
    image: "https://images.unsplash.com/photo-1544739313-8a6b41b8e0a9?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1544739313-8a6b41b8e0a9?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 15,
    name: "Remote Control Helicopter",
    category: "Remote Control Toys",
    price: 2799,
    ageGroup: "12+",
    rating: 4.0,
    description: "Stable RC helicopter with gyroscope stabilization — great for outdoor aerial fun.",
    image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 16,
    name: "Puzzle Adventure Board Game",
    category: "Puzzles",
    price: 749,
    ageGroup: "7+",
    rating: 4.3,
    description: "Cooperative puzzle board game that blends storytelling with problem solving for family game night.",
    image: "https://images.unsplash.com/photo-1541534401786-5e82b12f89f6?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1541534401786-5e82b12f89f6?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 17,
    name: "Fluffy Unicorn Plush",
    category: "Soft Toys",
    price: 699,
    ageGroup: "0+",
    rating: 4.7,
    description: "Sparkly mane unicorn plush — gentle, safe and perfect as a gift for young children.",
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1526403224745-8dd0f8d4f0b1?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 18,
    name: "DIY Model Airplane Kit",
    category: "Educational Toys",
    price: 549,
    ageGroup: "10+",
    rating: 4.1,
    description: "Glue-free model airplane kit for beginners — assemble and display your own flying replica.",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1520975914846-53b1d2f0b6f4?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 19,
    name: "Motorized Construction Truck",
    category: "Remote Control Toys",
    price: 1699,
    ageGroup: "5+",
    rating: 4.2,
    description: "Durable motorized construction truck with rolling wheels and working scoop for sandbox play.",
    image: "https://images.unsplash.com/photo-1515581709295-0c1f6f7f1f4b?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1515581709295-0c1f6f7f1f4b?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=300&q=60"
    ]
  },
  {
    id: 20,
    name: "Jigsaw Puzzle - 500 pieces",
    category: "Puzzles",
    price: 449,
    ageGroup: "10+",
    rating: 4.4,
    description: "Beautiful scenic 500-piece jigsaw puzzle — challenging and rewarding for older kids and adults.",
    image: "https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee?auto=format&fit=crop&w=600&q=60",
    relatedImages: [
      "https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=300&q=60",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=300&q=60"
    ]
  }
];
