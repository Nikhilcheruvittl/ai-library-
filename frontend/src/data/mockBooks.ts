export interface MockBook {
  id: number;
  title: string;
  author: string;
  genre: string;
  pageCount: number;
  publicationYear: number;
  language: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  summary: string;
  coverGradient: string;
}

export const MOCK_BOOKS: MockBook[] = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Programming",
    pageCount: 464,
    publicationYear: 2008,
    language: "English",
    difficulty: "Intermediate",
    rating: 4.8,
    summary: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
    coverGradient: "from-blue-600 via-indigo-700 to-slate-900"
  },
  {
    id: 2,
    title: "Cybersecurity Essentials for Beginners",
    author: "Charles P. Pfleeger",
    genre: "Cybersecurity",
    pageCount: 280,
    publicationYear: 2021,
    language: "English",
    difficulty: "Beginner",
    rating: 4.6,
    summary: "A foundational guide to modern network security, cryptography, and digital threat prevention under 300 pages.",
    coverGradient: "from-emerald-600 via-teal-800 to-slate-900"
  },
  {
    id: 3,
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    pageCount: 688,
    publicationYear: 1965,
    language: "English",
    difficulty: "Intermediate",
    rating: 4.9,
    summary: "Set on the desert planet Arrakis, Dune tells the story of Paul Atreides as he navigates political betrayal and mystic destiny.",
    coverGradient: "from-amber-600 via-orange-800 to-slate-900"
  },
  {
    id: 4,
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "History",
    pageCount: 443,
    publicationYear: 2014,
    language: "English",
    difficulty: "Beginner",
    rating: 4.8,
    summary: "Explores how Homo sapiens conquered the planet through cognitive, agricultural, and scientific revolutions.",
    coverGradient: "from-stone-600 via-amber-900 to-slate-900"
  },
  {
    id: 5,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    genre: "Psychology",
    pageCount: 499,
    publicationYear: 2011,
    language: "English",
    difficulty: "Intermediate",
    rating: 4.7,
    summary: "A tour of the human mind examining the two systems that drive our choices: fast intuition and slow deliberate logic.",
    coverGradient: "from-purple-600 via-indigo-900 to-slate-900"
  },
  {
    id: 6,
    title: "Zero to One",
    author: "Peter Thiel",
    genre: "Business",
    pageCount: 224,
    publicationYear: 2014,
    language: "English",
    difficulty: "Beginner",
    rating: 4.7,
    summary: "Notes on startups and how to build novel technology that creates genuine progress from zero to one.",
    coverGradient: "from-cyan-600 via-blue-900 to-slate-900"
  },
  {
    id: 7,
    title: "Psychology of Money",
    author: "Morgan Housel",
    genre: "Finance",
    pageCount: 252,
    publicationYear: 2020,
    language: "English",
    difficulty: "Beginner",
    rating: 4.8,
    summary: "19 short stories exploring the strange ways people think about wealth, greed, risk, and financial happiness.",
    coverGradient: "from-emerald-700 via-green-950 to-slate-900"
  },
  {
    id: 8,
    title: "Meditations",
    author: "Marcus Aurelius",
    genre: "Philosophy",
    pageCount: 254,
    publicationYear: 2002,
    language: "English",
    difficulty: "Intermediate",
    rating: 4.7,
    summary: "Personal reflections by the Roman Emperor on Stoic philosophy, duty, emotional mastery, and virtue.",
    coverGradient: "from-amber-700 via-yellow-950 to-slate-900"
  },
  {
    id: 9,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-development",
    pageCount: 320,
    publicationYear: 2018,
    language: "English",
    difficulty: "Beginner",
    rating: 4.9,
    summary: "An easy and proven system to build good daily habits, break bad ones, and achieve small compounding results.",
    coverGradient: "from-rose-600 via-pink-900 to-slate-900"
  },
  {
    id: 10,
    title: "The Name of the Rose",
    author: "Umberto Eco",
    genre: "Mystery",
    pageCount: 536,
    publicationYear: 1980,
    language: "English",
    difficulty: "Advanced",
    rating: 4.4,
    summary: "A medieval detective mystery following Brother William of Baskerville investigating unusual monk deaths at an Italian abbey.",
    coverGradient: "from-red-800 via-rose-950 to-slate-900"
  },
  {
    id: 11,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    pageCount: 310,
    publicationYear: 1937,
    language: "English",
    difficulty: "Beginner",
    rating: 4.9,
    summary: "Bilbo Baggins leaves his comfortable home in the Shire on an unexpected quest to reclaim a lost dwarf kingdom.",
    coverGradient: "from-teal-600 via-emerald-900 to-slate-900"
  },
  {
    id: 12,
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    genre: "Technology",
    pageCount: 616,
    publicationYear: 2017,
    language: "English",
    difficulty: "Advanced",
    rating: 4.9,
    summary: "The definitive guide to distributed system design, data storage models, stream processing, and system reliability.",
    coverGradient: "from-violet-600 via-purple-950 to-slate-900"
  }
];
