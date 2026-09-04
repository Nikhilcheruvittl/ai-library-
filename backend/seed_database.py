import os
import sys

# Ensure backend root directory is in sys.path when running script directly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine
from app.models import Book, Author, Genre

SEED_BOOKS = [
    # --- PROGRAMMING ---
    {
        "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
        "subtitle": "How to write code that is clean, readable, and maintainable",
        "isbn": "9780132350884",
        "summary": "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
        "description": "Clean Code is divided into three parts. The first describes the principles, patterns, and practices of writing clean code. The second part consists of several case studies of increasing complexity. The third part contains heuristics and code smells gathered while creating the case studies.",
        "authors": ["Robert C. Martin"],
        "genres": ["Programming", "Technology"],
        "page_count": 464,
        "publication_year": 2008,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.8,
        "publisher": "Prentice Hall",
        "format": "Paperback",
        "target_audience": "Software Developers",
        "cover_image_url": None
    },
    {
        "title": "The Pragmatic Programmer",
        "subtitle": "Your Journey To Mastery",
        "isbn": "9780135957059",
        "summary": "Illustrates the best approaches and major pitfalls of many aspects of software development.",
        "description": "Written as a series of self-contained sections and filled with entertaining anecdotes, thoughtful examples, and interesting analogies, The Pragmatic Programmer illustrates the best approaches and major pitfalls of many aspects of software development.",
        "authors": ["Andrew Hunt", "David Thomas"],
        "genres": ["Programming", "Technology"],
        "page_count": 352,
        "publication_year": 2019,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.9,
        "publisher": "Addison-Wesley Professional",
        "format": "Hardcover",
        "target_audience": "Software Engineers",
        "cover_image_url": None
    },
    {
        "title": "Grokking Algorithms",
        "subtitle": "An illustrated guide for programmers and curious people",
        "isbn": "9781617292231",
        "summary": "A friendly, fully illustrated guide that teaches you how to apply common computer algorithms to practical problems.",
        "description": "Grokking Algorithms is a fully illustrated, friendly guide that teaches you how to apply common algorithms to the practical problems you face every day as a programmer. You'll start with sorting and searching and, as you build up your skills in thinking algorithmically, you'll tackle more complex problems.",
        "authors": ["Aditya Bhargava"],
        "genres": ["Programming"],
        "page_count": 256,
        "publication_year": 2016,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.8,
        "publisher": "Manning Publications",
        "format": "Paperback",
        "target_audience": "Beginner Programmers",
        "cover_image_url": None
    },
    {
        "title": "Structure and Interpretation of Computer Programs",
        "subtitle": "Second Edition",
        "isbn": "9780262510875",
        "summary": "The world-famous textbook on computer science and programming concepts using Scheme.",
        "description": "SICP emphasizes the central role played by different mental models of computation. It has had a dramatic impact on computer science curricula over the past four decades.",
        "authors": ["Harold Abelson", "Gerald Jay Sussman"],
        "genres": ["Programming", "Technology"],
        "page_count": 657,
        "publication_year": 1996,
        "language": "English",
        "difficulty_level": "Advanced",
        "rating": 4.7,
        "publisher": "MIT Press",
        "format": "Paperback",
        "target_audience": "Computer Scientists",
        "cover_image_url": None
    },

    # --- CYBERSECURITY ---
    {
        "title": "The Phoenix Project",
        "subtitle": "A Novel about IT, DevOps, and Helping Your Business Win",
        "isbn": "9780988262591",
        "summary": "A thrilling business novel that teaches core DevOps and security principles through the story of a struggling IT organization.",
        "description": "Bill, an IT manager at Parts Unlimited, is tasked with fixing the botched Phoenix Project within 90 days. Readers learn how DevOps and security principles transform IT departments into strategic powerhouses.",
        "authors": ["Gene Kim", "Kevin Behr", "George Spafford"],
        "genres": ["Cybersecurity", "Business", "Technology"],
        "page_count": 382,
        "publication_year": 2013,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.7,
        "publisher": "IT Revolution Press",
        "format": "Paperback",
        "target_audience": "IT & Security Professionals",
        "cover_image_url": None
    },
    {
        "title": "Cybersecurity Essentials for Beginners",
        "subtitle": "Understanding Network Security, Cryptography, and Defense",
        "isbn": "9781119362395",
        "summary": "A foundational, beginner-friendly guide to modern information security and threat prevention.",
        "description": "Covers essential topics in security, including threat management, cryptography, wireless security, access control, and vulnerability management in an easy-to-read style.",
        "authors": ["Charles P. Pfleeger"],
        "genres": ["Cybersecurity"],
        "page_count": 280,
        "publication_year": 2021,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.6,
        "publisher": "Sybex",
        "format": "Paperback",
        "target_audience": "Security Beginners",
        "cover_image_url": None
    },
    {
        "title": "The Art of Invisibility",
        "subtitle": "The World's Most Famous Hacker Teaches You How to Be Safe in the Age of Big Brother",
        "isbn": "9780316380508",
        "summary": "Kevin Mitnick shows how online privacy is compromised and how to protect yourself.",
        "description": "Covers digital footprints, password safety, VPNs, encryption, and anonymous browsing in straightforward terms.",
        "authors": ["Kevin Mitnick"],
        "genres": ["Cybersecurity", "Technology"],
        "page_count": 320,
        "publication_year": 2017,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.5,
        "publisher": "Little, Brown and Company",
        "format": "Hardcover",
        "target_audience": "General Readers",
        "cover_image_url": None
    },
    {
        "title": "Social Engineering: The Science of Human Hacking",
        "subtitle": "Second Edition",
        "isbn": "9781119433385",
        "summary": "Explores the psychological manipulation of people into performing actions or divulging confidential information.",
        "description": "Reveals the secret techniques used by hackers to manipulate people into handing over confidential access credentials.",
        "authors": ["Christopher Hadnagy"],
        "genres": ["Cybersecurity", "Psychology"],
        "page_count": 320,
        "publication_year": 2018,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.6,
        "publisher": "Wiley",
        "format": "Paperback",
        "target_audience": "Security Analysts",
        "cover_image_url": None
    },

    # --- TECHNOLOGY ---
    {
        "title": "Designing Data-Intensive Applications",
        "subtitle": "The Big Ideas Behind Reliable, Scalable, and Maintainable Systems",
        "isbn": "9781449373320",
        "summary": "The definitive guide to architecture, data storage, stream processing, and distributed consensus.",
        "description": "Data is at the center of many challenges in system design today. Difficult issues such as scalability, consistency, reliability, efficiency, and maintainability need to be figured out.",
        "authors": ["Martin Kleppmann"],
        "genres": ["Technology", "Programming"],
        "page_count": 616,
        "publication_year": 2017,
        "language": "English",
        "difficulty_level": "Advanced",
        "rating": 4.9,
        "publisher": "O'Reilly Media",
        "format": "Paperback",
        "target_audience": "Backend & System Engineers",
        "cover_image_url": None
    },
    {
        "title": "System Design Interview – An Insider's Guide",
        "subtitle": "Volume 1",
        "isbn": "9798664653403",
        "summary": "An invaluable resource providing real-world system design interview questions and step-by-step solutions.",
        "description": "Provides step-by-step strategies to tackle complex distributed system architecture problems such as rate limiters, key-value stores, and web crawlers.",
        "authors": ["Alex Xu"],
        "genres": ["Technology", "Programming"],
        "page_count": 320,
        "publication_year": 2020,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.8,
        "publisher": "ByteByteGo",
        "format": "Paperback",
        "target_audience": "Software Engineers",
        "cover_image_url": None
    },
    {
        "title": "Computer Networking: A Top-Down Approach",
        "subtitle": "Seventh Edition",
        "isbn": "9780133594140",
        "summary": "Focuses on the Internet and fundamental principles of networking protocols.",
        "description": "Teaches networking principles by starting at the application layer and working down through the protocol stack.",
        "authors": ["James Kurose", "Keith Ross"],
        "genres": ["Technology"],
        "page_count": 864,
        "publication_year": 2016,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.6,
        "publisher": "Pearson",
        "format": "Hardcover",
        "target_audience": "Networking Students",
        "cover_image_url": None
    },

    # --- SCIENCE FICTION ---
    {
        "title": "Dune",
        "subtitle": "Book 1 of the Epic Dune Chronicles",
        "isbn": "9780441172719",
        "summary": "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family.",
        "description": "Frank Herbert’s classic masterpiece tells the story of Paul Atreides as he travels to Arrakis, the most dangerous planet in the universe, to secure the future of his family.",
        "authors": ["Frank Herbert"],
        "genres": ["Science Fiction", "Fiction"],
        "page_count": 688,
        "publication_year": 1965,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.9,
        "publisher": "Ace Books",
        "format": "Paperback",
        "target_audience": "Sci-Fi Readers",
        "cover_image_url": None
    },
    {
        "title": "Neuromancer",
        "subtitle": "The Cyberpunk Classic",
        "isbn": "9780441569564",
        "summary": "The groundbreaking novel that defined cyberpunk and predicted the virtual reality matrix.",
        "description": "Case was the hottest computer cowboy cruising the information superhighway until he crossed the wrong people.",
        "authors": ["William Gibson"],
        "genres": ["Science Fiction", "Cybersecurity"],
        "page_count": 271,
        "publication_year": 1984,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.5,
        "publisher": "Ace Books",
        "format": "Paperback",
        "target_audience": "Sci-Fi Fans",
        "cover_image_url": None
    },
    {
        "title": "Foundation",
        "subtitle": "Book 1 of the Foundation Series",
        "isbn": "9780553293357",
        "summary": "Hari Seldon uses psychohistory to predict the fall of the Galactic Empire and save human civilization.",
        "description": "For twelve thousand years the Galactic Empire has ruled supreme. Now it is dying. But only Hari Seldon, creator of psychohistory, can see into the future.",
        "authors": ["Isaac Asimov"],
        "genres": ["Science Fiction"],
        "page_count": 255,
        "publication_year": 1951,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.7,
        "publisher": "Spectra",
        "format": "Paperback",
        "target_audience": "Classic Sci-Fi Fans",
        "cover_image_url": None
    },
    {
        "title": "Snow Crash",
        "subtitle": "A Novel",
        "isbn": "9780553380958",
        "summary": "A fast-paced cyberpunk story exploring virtual reality, linguistics, and corporate dominance.",
        "description": "Hiro Protagonist delivers pizza for the Mafia in real life, but in the Metaverse he is a warrior prince.",
        "authors": ["Neal Stephenson"],
        "genres": ["Science Fiction", "Technology"],
        "page_count": 480,
        "publication_year": 1992,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.6,
        "publisher": "Bantam Spectra",
        "format": "Paperback",
        "target_audience": "Cyberpunk Enthusiasts",
        "cover_image_url": None
    },

    # --- HISTORY ---
    {
        "title": "Sapiens: A Brief History of Humankind",
        "subtitle": "From wild apes to masters of planet Earth",
        "isbn": "9780062316097",
        "summary": "Explores how Homo sapiens conquered the planet through cognitive, agricultural, and scientific revolutions.",
        "description": "Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical transformations of the Cognitive and Agricultural Revolutions.",
        "authors": ["Yuval Noah Harari"],
        "genres": ["History", "Philosophy"],
        "page_count": 443,
        "publication_year": 2014,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.8,
        "publisher": "Harper",
        "format": "Hardcover",
        "target_audience": "General History Readers",
        "cover_image_url": None
    },
    {
        "title": "Guns, Germs, and Steel",
        "subtitle": "The Fates of Human Societies",
        "isbn": "9780393317558",
        "summary": "Examines how environmental and geographical factors shaped human history and civilizational power.",
        "description": "Jared Diamond convincingly argues that geographical and environmental factors shaped the modern world rather than human genetic differences.",
        "authors": ["Jared Diamond"],
        "genres": ["History"],
        "page_count": 480,
        "publication_year": 1997,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.7,
        "publisher": "W. W. Norton & Company",
        "format": "Paperback",
        "target_audience": "History Enthusiasts",
        "cover_image_url": None
    },
    {
        "title": "The Silk Roads: A New History of the World",
        "subtitle": "An Illustrated New History of the World",
        "isbn": "9781101912379",
        "summary": "Re-assesses world history through the lens of trade networks connecting East and West.",
        "description": "Peter Frankopan turns world history upside down, placing the Central Asian trade routes as the central driver of global events.",
        "authors": ["Peter Frankopan"],
        "genres": ["History"],
        "page_count": 656,
        "publication_year": 2015,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.6,
        "publisher": "Vintage",
        "format": "Paperback",
        "target_audience": "History Students",
        "cover_image_url": None
    },

    # --- PSYCHOLOGY ---
    {
        "title": "Thinking, Fast and Slow",
        "subtitle": "Intuition, Judgment, and Decision Making",
        "isbn": "9780374533557",
        "summary": "Nobel laureate Daniel Kahneman takes us on a groundbreaking tour of the mind.",
        "description": "Explores the two systems that drive the way we think: System 1 (fast, emotional, intuitive) and System 2 (slower, deliberate, logical).",
        "authors": ["Daniel Kahneman"],
        "genres": ["Psychology", "Self-development"],
        "page_count": 499,
        "publication_year": 2011,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.6,
        "publisher": "Farrar, Straus and Giroux",
        "format": "Paperback",
        "target_audience": "General Readers",
        "cover_image_url": None
    },
    {
        "title": "The Body Keeps the Score",
        "subtitle": "Brain, Mind, and Body in the Healing of Trauma",
        "isbn": "9780143127741",
        "summary": "Explores how trauma reshapes body and brain, and innovative treatments for recovery.",
        "description": "Dr. Bessel van der Kolk uses recent scientific advances to show how trauma literally reshapes both body and brain, compromising sufferers' capacities for pleasure and trust.",
        "authors": ["Bessel van der Kolk"],
        "genres": ["Psychology"],
        "page_count": 464,
        "publication_year": 2014,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.9,
        "publisher": "Penguin Books",
        "format": "Paperback",
        "target_audience": "Psychology & Wellness Readers",
        "cover_image_url": None
    },
    {
        "title": "Influence: The Psychology of Persuasion",
        "subtitle": "New and Expanded Edition",
        "isbn": "9780061241895",
        "summary": "Explores the six universal principles of persuasion and how to apply them ethically.",
        "description": "Robert Cialdini explains why people say 'yes' and how to apply these understandings in business and everyday life.",
        "authors": ["Robert B. Cialdini"],
        "genres": ["Psychology", "Business"],
        "page_count": 336,
        "publication_year": 2006,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.8,
        "publisher": "Harper Business",
        "format": "Paperback",
        "target_audience": "Marketers & Leaders",
        "cover_image_url": None
    },

    # --- BUSINESS ---
    {
        "title": "Zero to One",
        "subtitle": "Notes on Startups, or How to Build the Future",
        "isbn": "9780804139298",
        "summary": "Peter Thiel shows how entrepreneurs can create singular new inventions.",
        "description": "The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create.",
        "authors": ["Peter Thiel", "Blake Masters"],
        "genres": ["Business", "Technology"],
        "page_count": 224,
        "publication_year": 2014,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.7,
        "publisher": "Crown Business",
        "format": "Hardcover",
        "target_audience": "Entrepreneurs",
        "cover_image_url": None
    },
    {
        "title": "The Lean Startup",
        "subtitle": "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses",
        "isbn": "9780307887894",
        "summary": "Fosters companies that are both more capital efficient and leverage human creativity more effectively.",
        "description": "Eric Ries defines a startup as an organization dedicated to creating something new under conditions of extreme uncertainty using rapid iteration.",
        "authors": ["Eric Ries"],
        "genres": ["Business", "Technology"],
        "page_count": 336,
        "publication_year": 2011,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.6,
        "publisher": "Crown Business",
        "format": "Hardcover",
        "target_audience": "Startup Founders",
        "cover_image_url": None
    },
    {
        "title": "Good to Great",
        "subtitle": "Why Some Companies Make the Leap... and Others Don't",
        "isbn": "9780066620992",
        "summary": "Identifies the common traits that propel good companies into long-term greatness.",
        "description": "Jim Collins and his research team identified the key management characteristics of companies that sustained elite performance over 15 years.",
        "authors": ["Jim Collins"],
        "genres": ["Business"],
        "page_count": 320,
        "publication_year": 2001,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.7,
        "publisher": "HarperBusiness",
        "format": "Hardcover",
        "target_audience": "Business Leaders",
        "cover_image_url": None
    },

    # --- FINANCE ---
    {
        "title": "Psychology of Money",
        "subtitle": "Timeless lessons on wealth, greed, and happiness",
        "isbn": "9780857197689",
        "summary": "Doing well with money isn't necessarily about what you know. It's about how you behave.",
        "description": "Morgan Housel shares 19 short stories exploring the strange ways people think about money.",
        "authors": ["Morgan Housel"],
        "genres": ["Finance", "Psychology"],
        "page_count": 252,
        "publication_year": 2020,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.8,
        "publisher": "Harriman House",
        "format": "Paperback",
        "target_audience": "Personal Finance Investors",
        "cover_image_url": None
    },
    {
        "title": "The Intelligent Investor",
        "subtitle": "The Definitive Book on Value Investing",
        "isbn": "9780060555665",
        "summary": "The classic guide on value investing pioneered by Benjamin Graham.",
        "description": "Graham's philosophy of 'value investing' shields investors from substantial error and teaches them to develop long-term strategies.",
        "authors": ["Benjamin Graham"],
        "genres": ["Finance"],
        "page_count": 640,
        "publication_year": 1949,
        "language": "English",
        "difficulty_level": "Advanced",
        "rating": 4.7,
        "publisher": "Harper Business",
        "format": "Paperback",
        "target_audience": "Value Investors",
        "cover_image_url": None
    },
    {
        "title": "Rich Dad Poor Dad",
        "subtitle": "What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!",
        "isbn": "9781612680194",
        "summary": "Explodes the myth that you need to earn a high income to become rich.",
        "description": "Robert Kiyosaki shares personal financial lessons learned from his real father and the wealthy father of his best friend.",
        "authors": ["Robert T. Kiyosaki"],
        "genres": ["Finance", "Self-development"],
        "page_count": 336,
        "publication_year": 1997,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.7,
        "publisher": "Plata Publishing",
        "format": "Paperback",
        "target_audience": "General Readers",
        "cover_image_url": None
    },
    {
        "title": "Principles for Navigating Big Debt Crises",
        "subtitle": "Compendium of Debt Crises",
        "isbn": "9781732688308",
        "summary": "Ray Dalio shares his template for understanding how big debt crises work.",
        "description": "Ray Dalio shares his unique template for navigating major economic and debt crises based on decades of macro-investing.",
        "authors": ["Ray Dalio"],
        "genres": ["Finance", "Business"],
        "page_count": 425,
        "publication_year": 2018,
        "language": "English",
        "difficulty_level": "Advanced",
        "rating": 4.8,
        "publisher": "Bridgewater",
        "format": "Paperback",
        "target_audience": "Macro Economists",
        "cover_image_url": None
    },

    # --- BIOGRAPHY ---
    {
        "title": "Steve Jobs",
        "subtitle": "The Exclusive Biography",
        "isbn": "9781451648539",
        "summary": "Based on more than forty interviews with Jobs conducted over two years.",
        "description": "Walter Isaacson presents a riveting story of the roller-coaster life and searingly intense personality of a creative entrepreneur.",
        "authors": ["Walter Isaacson"],
        "genres": ["Biography", "Technology"],
        "page_count": 656,
        "publication_year": 2011,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.8,
        "publisher": "Simon & Schuster",
        "format": "Hardcover",
        "target_audience": "Biography Readers",
        "cover_image_url": None
    },
    {
        "title": "Elon Musk",
        "subtitle": "The Authoritative Biography",
        "isbn": "9781398527492",
        "summary": "An intimate biography of the astonishingly innovative entrepreneur.",
        "description": "Isaacson spent two years shadowing Musk, attending his meetings, and interviewing his family, friends, and coworkers.",
        "authors": ["Walter Isaacson"],
        "genres": ["Biography", "Technology"],
        "page_count": 688,
        "publication_year": 2023,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.7,
        "publisher": "Simon & Schuster",
        "format": "Hardcover",
        "target_audience": "Tech & Business Readers",
        "cover_image_url": None
    },
    {
        "title": "Shoe Dog: A Memoir by the Creator of Nike",
        "subtitle": "A Memoir by the Creator of Nike",
        "isbn": "9781501135927",
        "summary": "Phil Knight shares the candid story of Nike's early startup days.",
        "description": "Nike founder Phil Knight shares the inside story of the company's early startup days as an intrepid young entrepreneur.",
        "authors": ["Phil Knight"],
        "genres": ["Biography", "Business"],
        "page_count": 400,
        "publication_year": 2016,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.8,
        "publisher": "Scribner",
        "format": "Paperback",
        "target_audience": "Entrepreneurs & Memoir Fans",
        "cover_image_url": None
    },

    # --- PHILOSOPHY ---
    {
        "title": "Meditations",
        "subtitle": "Personal Writings of the Roman Emperor",
        "isbn": "9780812968255",
        "summary": "Private reflections by Marcus Aurelius on Stoic philosophy, duty, and spiritual resilience.",
        "description": "Marcus Aurelius gives timeless wisdom on emotional self-control, leadership, mortality, and virtue.",
        "authors": ["Marcus Aurelius"],
        "genres": ["Philosophy", "Self-development"],
        "page_count": 254,
        "publication_year": 2002,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.7,
        "publisher": "Modern Library",
        "format": "Paperback",
        "target_audience": "Philosophy Readers",
        "cover_image_url": None
    },
    {
        "title": "Beyond Good and Evil",
        "subtitle": "Prelude to a Philosophy of the Future",
        "isbn": "9780486298689",
        "summary": "Friedrich Nietzsche's critique of traditional morality and philosophical systems.",
        "description": "Nietzsche dramatically rejects traditional morality and examines the nature of truth, language, and individual will.",
        "authors": ["Friedrich Nietzsche"],
        "genres": ["Philosophy"],
        "page_count": 240,
        "publication_year": 1886,
        "language": "English",
        "difficulty_level": "Advanced",
        "rating": 4.5,
        "publisher": "Dover Publications",
        "format": "Paperback",
        "target_audience": "Philosophy Students",
        "cover_image_url": None
    },
    {
        "title": "The Republic",
        "subtitle": "Classic Socratic Dialogue on Justice",
        "isbn": "9780140455113",
        "summary": "Plato's foundational work on justice, the ideal state, and the allegory of the cave.",
        "description": "A Socratic dialogue concerning justice, the order and character of the just city-state, and the just man.",
        "authors": ["Plato"],
        "genres": ["Philosophy"],
        "page_count": 416,
        "publication_year": 2007,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.6,
        "publisher": "Penguin Classics",
        "format": "Paperback",
        "target_audience": "Classics Readers",
        "cover_image_url": None
    },

    # --- SELF-DEVELOPMENT ---
    {
        "title": "Atomic Habits",
        "subtitle": "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
        "isbn": "9780735211292",
        "summary": "Tiny Changes, Remarkable Results. Learn how small habit adjustments compound over time.",
        "description": "James Clear distills complex topics into simple behaviors that can be easily applied to daily life and work.",
        "authors": ["James Clear"],
        "genres": ["Self-development", "Psychology"],
        "page_count": 320,
        "publication_year": 2018,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.9,
        "publisher": "Avery",
        "format": "Hardcover",
        "target_audience": "General Readers",
        "cover_image_url": None
    },
    {
        "title": "Deep Work: Rules for Focused Success in a Distracted World",
        "subtitle": "Rules for Focused Success in a Distracted World",
        "isbn": "9781455586691",
        "summary": "Cal Newport demonstrates how cultivating intense focus produces extraordinary value.",
        "description": "Deep work is the ability to focus without distraction on a cognitively demanding task. It's a skill that allows you to quickly master complicated information.",
        "authors": ["Cal Newport"],
        "genres": ["Self-development", "Business"],
        "page_count": 304,
        "publication_year": 2016,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.7,
        "publisher": "Grand Central Publishing",
        "format": "Hardcover",
        "target_audience": "Knowledge Workers",
        "cover_image_url": None
    },
    {
        "title": "The 7 Habits of Highly Effective People",
        "subtitle": "Powerful Lessons in Personal Change",
        "isbn": "9781982137274",
        "summary": "A principle-centered approach for solving personal and professional problems.",
        "description": "Stephen Covey presents a holistic approach for solving personal and professional problems based on timeless principles.",
        "authors": ["Stephen R. Covey"],
        "genres": ["Self-development"],
        "page_count": 432,
        "publication_year": 1989,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.8,
        "publisher": "Simon & Schuster",
        "format": "Paperback",
        "target_audience": "General Readers",
        "cover_image_url": None
    },

    # --- FICTION ---
    {
        "title": "1984",
        "subtitle": "A Dystopian Masterpiece",
        "isbn": "9780451524935",
        "summary": "Winston Smith wrestles with oppression in Oceania, a place where Big Brother is always watching.",
        "description": "George Orwell's classic dystopian novel examines total surveillance, political propaganda, and loss of individual freedom.",
        "authors": ["George Orwell"],
        "genres": ["Fiction", "Science Fiction"],
        "page_count": 328,
        "publication_year": 1949,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.8,
        "publisher": "Signet Classic",
        "format": "Paperback",
        "target_audience": "Fiction Readers",
        "cover_image_url": None
    },
    {
        "title": "To Kill a Mockingbird",
        "subtitle": "Pulitzer Prize Winning Classic",
        "isbn": "9780060935467",
        "summary": "Scout Finch grows up in Maycomb, Alabama, as her father Atticus defends a Black man unjustly accused.",
        "description": "Compassionate, dramatic, and deeply moving, To Kill a Mockingbird takes readers to the roots of human behavior.",
        "authors": ["Harper Lee"],
        "genres": ["Fiction"],
        "page_count": 323,
        "publication_year": 1960,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.9,
        "publisher": "Harper Perennial",
        "format": "Paperback",
        "target_audience": "General Readers",
        "cover_image_url": None
    },
    {
        "title": "The Great Gatsby",
        "subtitle": "A Jazz Age Classic",
        "isbn": "9780743273565",
        "summary": "Jay Gatsby's tragic obsession with Daisy Buchanan during the Roaring Twenties.",
        "description": "F. Scott Fitzgerald's third book stands as the supreme achievement of his career and a classic of American literature.",
        "authors": ["F. Scott Fitzgerald"],
        "genres": ["Fiction"],
        "page_count": 180,
        "publication_year": 1925,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.5,
        "publisher": "Scribner",
        "format": "Paperback",
        "target_audience": "Fiction Fans",
        "cover_image_url": None
    },

    # --- MYSTERY ---
    {
        "title": "The Name of the Rose",
        "subtitle": "A Medieval Murder Mystery",
        "isbn": "9780156001311",
        "summary": "Brother William of Baskerville arrives at an Italian abbey where monks die under mysterious circumstances.",
        "description": "In 1327, Franciscans in an Italian abbey are suspected of heresy, but Brother William turns detective when monks start dying.",
        "authors": ["Umberto Eco"],
        "genres": ["Mystery", "Fiction"],
        "page_count": 536,
        "publication_year": 1980,
        "language": "English",
        "difficulty_level": "Advanced",
        "rating": 4.4,
        "publisher": "Houghton Mifflin Harcourt",
        "format": "Paperback",
        "target_audience": "Mystery & History Fans",
        "cover_image_url": None
    },
    {
        "title": "The Girl with the Dragon Tattoo",
        "subtitle": "Millennium Series Book 1",
        "isbn": "9780307949486",
        "summary": "Journalist Mikael Blomkvist and hacker Lisbeth Salander investigate a decades-old disappearance.",
        "description": "A thrilling blend of corporate corruption, murder mystery, and digital investigation in Sweden.",
        "authors": ["Stieg Larsson"],
        "genres": ["Mystery", "Fiction"],
        "page_count": 465,
        "publication_year": 2005,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.7,
        "publisher": "Vintage Crime",
        "format": "Paperback",
        "target_audience": "Thriller Enthusiasts",
        "cover_image_url": None
    },
    {
        "title": "And Then There Were None",
        "subtitle": "The World's Best-Selling Mystery",
        "isbn": "9780062073488",
        "summary": "Ten strangers are lured to an isolated island, where they are executed one by one.",
        "description": "Ten people, each with something to hide, are invited to a secluded island mansion by an absent host.",
        "authors": ["Agatha Christie"],
        "genres": ["Mystery"],
        "page_count": 272,
        "publication_year": 1939,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.8,
        "publisher": "William Morrow",
        "format": "Paperback",
        "target_audience": "Mystery Readers",
        "cover_image_url": None
    },

    # --- FANTASY ---
    {
        "title": "The Hobbit",
        "subtitle": "There and Back Again",
        "isbn": "9780547928227",
        "summary": "Bilbo Baggins is a hobbit who enjoys a comfortable life until Gandalf invites him on a dragon quest.",
        "description": "Written for J.R.R. Tolkien's own children, The Hobbit met with instant critical acclaim when published.",
        "authors": ["J.R.R. Tolkien"],
        "genres": ["Fantasy", "Fiction"],
        "page_count": 310,
        "publication_year": 1937,
        "language": "English",
        "difficulty_level": "Beginner",
        "rating": 4.9,
        "publisher": "Mariner Books",
        "format": "Paperback",
        "target_audience": "Fantasy Readers",
        "cover_image_url": None
    },
    {
        "title": "The Name of the Wind",
        "subtitle": "The Kingkiller Chronicle: Day One",
        "isbn": "9780756404741",
        "summary": "Kvothe tells the story of his life growing up in a troupe of traveling players to becoming a legendary wizard.",
        "description": "The tale of Kvothe—from his childhood in a troupe of traveling players, to his years as a near-feral orphan in a crime-ridden city.",
        "authors": ["Patrick Rothfuss"],
        "genres": ["Fantasy"],
        "page_count": 662,
        "publication_year": 2007,
        "language": "English",
        "difficulty_level": "Intermediate",
        "rating": 4.8,
        "publisher": "DAW",
        "format": "Paperback",
        "target_audience": "Epic Fantasy Readers",
        "cover_image_url": None
    },
    {
        "title": "A Game of Thrones",
        "subtitle": "A Song of Ice and Fire: Book One",
        "isbn": "9780553573404",
        "summary": "Noble houses battle for control of the Iron Throne while an ancient evil awakens in the north.",
        "description": "Summers span decades. Winters can last a lifetime. And the struggle for the Iron Throne has begun.",
        "authors": ["George R.R. Martin"],
        "genres": ["Fantasy", "Fiction"],
        "page_count": 835,
        "publication_year": 1996,
        "language": "English",
        "difficulty_level": "Advanced",
        "rating": 4.8,
        "publisher": "Bantam",
        "format": "Mass Market Paperback",
        "target_audience": "Fantasy Fans",
        "cover_image_url": None
    }
]

def seed_database():
    """
    Idempotent database seeder for Phase 1 AI Library:
    - Avoids duplicate Author records by checking `Author.name`.
    - Avoids duplicate Genre records by checking `Genre.name` and generating clean slugs.
    - Avoids duplicate Book records by checking `Book.isbn`.
    - Populates `book_authors` and `book_genres` relationships via ORM collection mapping.
    """
    db = SessionLocal()

    books_added = 0
    books_skipped = 0
    authors_created = 0
    genres_created = 0

    try:
        print(f"Starting seed process for {len(SEED_BOOKS)} books...")

        for item in SEED_BOOKS:
            isbn = item["isbn"]

            # 1. Check if Book already exists (Duplicate Prevention)
            existing_book = db.query(Book).filter(Book.isbn == isbn).first()
            if existing_book:
                books_skipped += 1
                continue

            # 2. Resolve Authors (reuse existing or create new)
            author_objects = []
            for author_name in item["authors"]:
                author_inst = db.query(Author).filter(Author.name == author_name).first()
                if not author_inst:
                    author_inst = Author(name=author_name, bio=f"Author of {item['title']}.")
                    db.add(author_inst)
                    db.flush()
                    authors_created += 1
                author_objects.append(author_inst)

            # 3. Resolve Genres (reuse existing or create new)
            genre_objects = []
            for genre_name in item["genres"]:
                genre_inst = db.query(Genre).filter(Genre.name == genre_name).first()
                if not genre_inst:
                    slug = genre_name.lower().replace(" ", "-")
                    genre_inst = Genre(name=genre_name, slug=slug)
                    db.add(genre_inst)
                    db.flush()
                    genres_created += 1
                genre_objects.append(genre_inst)

            # 4. Instantiate and Link New Book
            new_book = Book(
                title=item["title"],
                subtitle=item.get("subtitle"),
                isbn=isbn,
                summary=item["summary"],
                description=item["description"],
                page_count=item["page_count"],
                publication_year=item["publication_year"],
                language=item.get("language", "English"),
                difficulty_level=item["difficulty_level"],
                rating=item.get("rating", 4.5),
                publisher=item.get("publisher"),
                format=item.get("format"),
                target_audience=item.get("target_audience"),
                cover_image_url=item.get("cover_image_url")
            )

            # Map relationships
            new_book.authors = author_objects
            new_book.genres = genre_objects

            db.add(new_book)
            books_added += 1

        db.commit()

        print("\n=== SEED SUMMARY ===")
        print(f"Books Added    : {books_added}")
        print(f"Books Skipped  : {books_skipped} (Already present in database)")
        print(f"Authors Created: {authors_created}")
        print(f"Genres Created : {genres_created}")
        print("Database seed process completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"\n[ERROR] Seeding failed: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
