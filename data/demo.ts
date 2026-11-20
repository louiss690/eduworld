/**
 * Demonstration seed content for EduWorld.
 *
 * This content ships with the platform so the MVP is fully explorable before
 * a live database is connected. Every course is marked `isDemo: true`, and
 * the UI shows a "Demo content" label where this data appears.
 *
 * The same data is mirrored in `database/migrations/002_seed.sql` for the
 * production Supabase database.
 */

import type {
  Course,
  Country,
  EducationalLevel,
  Language,
  Lesson,
  Quiz,
  Subject,
  Achievement,
} from "@/types";

// ── Reference data ───────────────────────────────────────────────────────────

export const countries: Country[] = [
  { code: "KE", name: "Kenya" },
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
  { code: "ZA", name: "South Africa" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
];

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", available: true },
  { code: "fr", name: "French", nativeName: "Français", available: false },
  { code: "es", name: "Spanish", nativeName: "Español", available: false },
  { code: "pt", name: "Portuguese", nativeName: "Português", available: false },
  { code: "ar", name: "Arabic", nativeName: "العربية", available: false },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", available: false },
  { code: "tw", name: "Twi", nativeName: "Twi", available: false },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", available: false },
];

export const levels: EducationalLevel[] = [
  { id: "lvl-primary", slug: "primary", name: "Primary School", order: 1 },
  { id: "lvl-lower-sec", slug: "lower-secondary", name: "Lower Secondary", order: 2 },
  { id: "lvl-upper-sec", slug: "upper-secondary", name: "Upper Secondary", order: 3 },
  { id: "lvl-college", slug: "college", name: "College & University", order: 4 },
  { id: "lvl-self", slug: "self-directed", name: "Self-directed Learning", order: 5 },
];

// ── Subjects ─────────────────────────────────────────────────────────────────

export const subjects: Subject[] = [
  {
    id: "subj-math",
    slug: "mathematics",
    name: "Mathematics",
    shortDescription: "Numbers, algebra, geometry and problem solving.",
    description:
      "Build confidence with numbers and logical thinking. From arithmetic foundations to algebra, geometry and statistics.",
    imageUrl: "/images/photos/math-student.jpg",
    iconKey: "calculator",
  },
  {
    id: "subj-science",
    slug: "science",
    name: "Science",
    shortDescription: "Biology, chemistry and physics for curious minds.",
    description:
      "Explore the living and physical world through clear explanations, real experiments and practical examples.",
    imageUrl: "/images/photos/science-lab.jpg",
    iconKey: "flask-conical",
  },
  {
    id: "subj-english",
    slug: "english",
    name: "English",
    shortDescription: "Reading, writing, grammar and communication.",
    description:
      "Strengthen your reading, writing and speaking skills in English, the global language of education and work.",
    imageUrl: "/images/photos/library-books.jpg",
    iconKey: "book-open",
  },
  {
    id: "subj-cs",
    slug: "computer-science",
    name: "Computer Science",
    shortDescription: "Programming, logic and the digital world.",
    description:
      "Learn how computers think, write your first programs and understand the technology shaping the world.",
    imageUrl: "/images/photos/coding-screen.jpg",
    iconKey: "code-2",
  },
  {
    id: "subj-history",
    slug: "history",
    name: "History",
    shortDescription: "Understanding the past to shape the future.",
    description:
      "Study the people, events and ideas that shaped our world, from ancient civilisations to the modern age.",
    imageUrl: "/images/photos/history-archive.jpg",
    iconKey: "landmark",
  },
  {
    id: "subj-geography",
    slug: "geography",
    name: "Geography",
    shortDescription: "People, places and the planet we share.",
    description:
      "Discover how landscapes, climate and human activity shape life in every corner of the world.",
    imageUrl: "/images/photos/geography-map.jpg",
    iconKey: "map",
  },
  {
    id: "subj-econ",
    slug: "economics",
    name: "Economics",
    shortDescription: "How money, markets and choices work.",
    description:
      "Understand how individuals, businesses and governments make decisions with limited resources.",
    imageUrl: "/images/photos/business-meeting.jpg",
    iconKey: "trending-up",
  },
  {
    id: "subj-languages",
    slug: "languages",
    name: "Languages",
    shortDescription: "Learn to communicate across cultures.",
    description:
      "Study new languages and unlock conversations, cultures and opportunities across borders.",
    imageUrl: "/images/photos/languages-chat.jpg",
    iconKey: "message-square",
  },
  {
    id: "subj-tech",
    slug: "technology",
    name: "Technology",
    shortDescription: "Digital skills for the modern world.",
    description:
      "Practical digital skills: productivity tools, internet safety, spreadsheets, and working online.",
    imageUrl: "/images/photos/team-coding.jpg",
    iconKey: "cpu",
  },
  {
    id: "subj-business",
    slug: "business-studies",
    name: "Business Studies",
    shortDescription: "Entrepreneurship, management and enterprise.",
    description:
      "Learn how businesses start, grow and succeed, and how you can turn an idea into a venture.",
    imageUrl: "/images/photos/business-meeting.jpg",
    iconKey: "briefcase",
  },
];

// ── Courses ──────────────────────────────────────────────────────────────────

const courses: Course[] = [
  {
    id: "course-algebra",
    slug: "algebra-foundations",
    title: "Algebra Foundations",
    subjectId: "subj-math",
    level: "beginner",
    format: "course",
    description:
      "Master the language of algebra: variables, expressions, equations and the first steps of graphing.",
    longDescription:
      "Algebra is where mathematics starts to speak a new language. This course builds a solid foundation, step by step, with clear explanations and plenty of guided practice. You will leave able to read and write algebraic expressions, solve linear equations with confidence, and see the patterns behind the numbers.",
    imageUrl: "/images/photos/math-student.jpg",
    instructor: { name: "EduWorld Curriculum Team", title: "In-house content" },
    published: true,
    featured: true,
    isDemo: true,
    createdAt: "2026-01-10T09:00:00Z",
  },
  {
    id: "course-cells",
    slug: "cells-and-life-processes",
    title: "Cells & Life Processes",
    subjectId: "subj-science",
    level: "beginner",
    format: "course",
    description:
      "Explore the building blocks of life, from cells to the systems that keep organisms alive.",
    longDescription:
      "Every living thing is made of cells. In this course you will discover what cells are, how they work, and how tiny structures inside them power everything from breathing to growth. Microscopy, diagrams and everyday examples bring biology to life.",
    imageUrl: "/images/photos/science-lab.jpg",
    instructor: { name: "EduWorld Curriculum Team", title: "In-house content" },
    published: true,
    featured: true,
    isDemo: true,
    createdAt: "2026-01-12T09:00:00Z",
  },
  {
    id: "course-academic-writing",
    slug: "english-for-academic-writing",
    title: "English for Academic Writing",
    subjectId: "subj-english",
    level: "intermediate",
    format: "course",
    description:
      "Write clear, confident paragraphs and essays, a skill for school, university and work.",
    longDescription:
      "Academic writing is a muscle. This course trains you to structure paragraphs, build arguments, and express ideas with precision. You will practise with real writing tasks at every step and get the tools to edit your own work.",
    imageUrl: "/images/photos/library-books.jpg",
    instructor: { name: "EduWorld Curriculum Team", title: "In-house content" },
    published: true,
    featured: true,
    isDemo: true,
    createdAt: "2026-01-15T09:00:00Z",
  },
  {
    id: "course-python",
    slug: "introduction-to-python",
    title: "Introduction to Programming with Python",
    subjectId: "subj-cs",
    level: "beginner",
    format: "course",
    description:
      "Write your first programs and think like a programmer with the world's friendliest language.",
    longDescription:
      "Programming is a superpower. This course teaches you the core ideas, variables, conditions, loops and functions, using Python, the language beginners and professionals both love. By the final lesson you will have built a small real program of your own.",
    imageUrl: "/images/photos/coding-screen.jpg",
    instructor: { name: "EduWorld Curriculum Team", title: "In-house content" },
    published: true,
    featured: true,
    isDemo: true,
    createdAt: "2026-01-18T09:00:00Z",
  },
  {
    id: "course-modern-world",
    slug: "the-modern-world",
    title: "The Modern World: A 20th Century History",
    subjectId: "subj-history",
    level: "intermediate",
    format: "course",
    description:
      "Understand the wars, ideas and movements that made our world what it is today.",
    longDescription:
      "The twentieth century transformed humanity. Through clear narrative and primary sources, this course connects the big events, from world wars to decolonisation and the digital revolution, and shows why they still matter today.",
    imageUrl: "/images/photos/history-archive.jpg",
    instructor: { name: "EduWorld Curriculum Team", title: "In-house content" },
    published: true,
    featured: false,
    isDemo: true,
    createdAt: "2026-01-20T09:00:00Z",
  },
  {
    id: "course-physical-geography",
    slug: "our-planet-physical-geography",
    title: "Our Planet: Physical Geography",
    subjectId: "subj-geography",
    level: "beginner",
    format: "course",
    description:
      "Rivers, climates, landscapes and the water cycle, the Earth's systems explained.",
    longDescription:
      "Why do deserts form where they do? Where does rain come from? This course unpacks the Earth's physical systems with vivid examples from around the world, helping you read the landscape like a geographer.",
    imageUrl: "/images/photos/geography-map.jpg",
    instructor: { name: "EduWorld Curriculum Team", title: "In-house content" },
    published: true,
    featured: false,
    isDemo: true,
    createdAt: "2026-01-22T09:00:00Z",
  },
  {
    id: "course-economics-everyday",
    slug: "economics-in-everyday-life",
    title: "Economics in Everyday Life",
    subjectId: "subj-econ",
    level: "beginner",
    format: "course",
    description:
      "See the invisible forces behind prices, choices and markets all around you.",
    longDescription:
      "Economics is not abstract, it is the story of how we make choices. From the price of bread to why firms advertise, this course gives you a practical toolkit to understand the economy you live in every day.",
    imageUrl: "/images/photos/business-meeting.jpg",
    instructor: { name: "EduWorld Curriculum Team", title: "In-house content" },
    published: true,
    featured: false,
    isDemo: true,
    createdAt: "2026-01-25T09:00:00Z",
  },
  {
    id: "course-business-fundamentals",
    slug: "business-fundamentals",
    title: "Business Fundamentals",
    subjectId: "subj-business",
    level: "beginner",
    format: "course",
    description:
      "How businesses work: customers, value, money and simple business planning.",
    longDescription:
      "Whether you dream of starting a company or simply want to understand the one you might work for, this course explains the essentials: what a business does, how it earns and spends, and what makes customers come back.",
    imageUrl: "/images/photos/classroom-work.jpg",
    instructor: { name: "EduWorld Curriculum Team", title: "In-house content" },
    published: true,
    featured: false,
    isDemo: true,
    createdAt: "2026-01-28T09:00:00Z",
  },
];

// ── Lessons ──────────────────────────────────────────────────────────────────

const lessons: Lesson[] = [
  // Algebra Foundations
  {
    id: "lesson-algebra-1",
    courseId: "course-algebra",
    title: "What is Algebra?",
    description: "Meet the idea of the unknown and why algebra exists.",
    objectives: [
      "Understand why algebra uses letters for unknown numbers",
      "Recognise algebraic expressions in everyday situations",
      "Translate simple English sentences into expressions",
    ],
    minutes: 12,
    order: 1,
    blocks: [
      { type: "paragraph", text: "Algebra is a way of using letters to stand for numbers we do not know yet. Instead of asking 'what number plus 5 equals 9?', an algebraist writes x + 5 = 9. The letter x is a placeholder, a box we can fill in." },
      { type: "example", title: "Everyday algebra", text: "If a taxi charges $3 per kilometre plus a $2 base fare, the cost C for d kilometres is C = 3d + 2. You already use algebra when you estimate a fare!" },
      { type: "list", ordered: false, items: ["A variable is a letter that represents a number", "An expression combines numbers, variables and operations", "An equation says two expressions are equal"] },
      { type: "callout", tone: "tip", text: "Think of a variable as a blank space in a sentence. The sentence has meaning even before you know the missing word." },
      { type: "exercise", prompt: "Write an expression for: 'the total cost of a notebooks if each costs $4'.", hint: "Use the letter n for the number of notebooks." },
    ],
  },
  {
    id: "lesson-algebra-2",
    courseId: "course-algebra",
    title: "Simplifying Expressions",
    description: "Combine like terms to make expressions cleaner and easier to use.",
    objectives: [
      "Identify like terms",
      "Combine like terms correctly",
      "Spot common sign errors",
    ],
    minutes: 15,
    order: 2,
    blocks: [
      { type: "paragraph", text: "Like terms are terms that have exactly the same variable part. The terms 3x and 5x are like terms, so 3x + 5x = 8x. But 3x and 5y are not like terms, they cannot be combined." },
      { type: "example", title: "Combining", text: "Simplify 4x + 2 − x + 9. First group the x terms: 4x − x = 3x. Then the numbers: 2 + 9 = 11. The result is 3x + 11." },
      { type: "callout", tone: "warning", text: "A common mistake: 3x + 4y is NOT 7xy. Different variables cannot be added together." },
      { type: "exercise", prompt: "Simplify 5a + 3b − 2a + b.", hint: "Combine the a terms first, then the b terms." },
    ],
  },
  {
    id: "lesson-algebra-3",
    courseId: "course-algebra",
    title: "Solving Equations",
    description: "Find the value of the unknown using balance.",
    objectives: [
      "Understand an equation as a balanced scale",
      "Solve one-step equations",
      "Check solutions by substitution",
    ],
    minutes: 18,
    order: 3,
    blocks: [
      { type: "paragraph", text: "An equation is like a balance scale: the two sides weigh the same. Whatever you do to one side, you must do to the other to keep it balanced. To solve for x, isolate it on one side." },
      { type: "example", title: "One-step equation", text: "Solve x + 7 = 15. Subtract 7 from both sides: x = 15 − 7 = 8. Check: 8 + 7 = 15 ✓" },
      { type: "example", title: "Multiplication", text: "Solve 4x = 36. Divide both sides by 4: x = 9. Check: 4 × 9 = 36 ✓" },
      { type: "exercise", prompt: "Solve 3x + 2 = 14.", hint: "Subtract 2 first, then divide by 3." },
    ],
  },
  {
    id: "lesson-algebra-4",
    courseId: "course-algebra",
    title: "Graphing Basics",
    description: "See equations as lines on a coordinate grid.",
    objectives: [
      "Plot points on a coordinate plane",
      "Understand why y = x graphs as a straight line",
      "Read simple graphs",
    ],
    minutes: 16,
    order: 4,
    blocks: [
      { type: "paragraph", text: "The coordinate plane uses two axes: x (horizontal) and y (vertical). Every point is written as (x, y). An equation like y = 2x describes a whole set of points, together they form a line." },
      { type: "example", title: "Plotting", text: "For y = 2x, when x = 1 then y = 2, giving the point (1, 2). When x = 3, y = 6, giving (3, 6). Join the points, you get a straight line rising to the right." },
      { type: "callout", tone: "info", text: "The number multiplying x is the slope. It tells you how steep the line is and whether it rises (positive) or falls (negative)." },
      { type: "exercise", prompt: "If y = 3x, what is y when x = 4?", hint: "Multiply 4 by 3." },
    ],
  },

  // Cells & Life Processes
  {
    id: "lesson-cells-1",
    courseId: "course-cells",
    title: "The Cell: Life's Building Block",
    description: "What cells are, what they contain, and why size matters.",
    objectives: [
      "Describe what a cell is",
      "Name the main parts of an animal cell",
      "Explain why cells are microscopic",
    ],
    minutes: 14,
    order: 1,
    blocks: [
      { type: "paragraph", text: "All living things, from bacteria to elephants, are made of cells. A cell is the smallest unit that can be called alive. Your body contains trillions of them, each one a tiny factory enclosed in a membrane." },
      { type: "list", ordered: false, items: ["Cell membrane, the boundary that controls what enters and leaves", "Nucleus, the control centre containing DNA", "Cytoplasm, the jelly-like interior where reactions happen", "Mitochondria, the powerhouses that release energy"] },
      { type: "example", title: "Why so small?", text: "Nutrients enter and waste leaves through the cell surface. As a cell grows, its volume grows faster than its surface area, so beyond a certain size it cannot feed itself efficiently. That is why cells stay small." },
      { type: "exercise", prompt: "Which part of the cell contains the genetic instructions (DNA)?", hint: "It is usually described as the 'control centre'." },
    ],
  },
  {
    id: "lesson-cells-2",
    courseId: "course-cells",
    title: "Plant Cells and the Special Features of Life",
    description: "What plant cells have that animal cells do not.",
    objectives: [
      "Compare plant and animal cells",
      "Explain the role of the cell wall and chloroplasts",
      "Recall how photosynthesis fits in",
    ],
    minutes: 13,
    order: 2,
    blocks: [
      { type: "paragraph", text: "Plant cells share most parts with animal cells, but they add three special features: a cell wall for support, chloroplasts for photosynthesis, and a large vacuole for storing water." },
      { type: "example", title: "The cell wall", text: "The rigid cell wall is made mostly of cellulose. It lets plants stand tall, imagine a tree supporting its own weight without a skeleton. That strength comes from billions of cell walls." },
      { type: "callout", tone: "info", text: "Photosynthesis is the process where chloroplasts use sunlight, water and carbon dioxide to make glucose and oxygen. It is the foundation of almost all food chains." },
      { type: "exercise", prompt: "Name two structures found in plant cells but NOT in animal cells.", hint: "One is rigid, the other captures sunlight." },
    ],
  },
  {
    id: "lesson-cells-3",
    courseId: "course-cells",
    title: "Specialised Cells",
    description: "How cells become experts at one job.",
    objectives: [
      "Define differentiation",
      "Match cell types to their functions",
      "Explain why specialisation helps organisms",
    ],
    minutes: 12,
    order: 3,
    blocks: [
      { type: "paragraph", text: "A fertilised egg divides into identical cells at first. Then cells begin to specialise, a process called differentiation. Some become muscle cells, others neurons, others red blood cells. Each shape is suited to its job." },
      { type: "list", ordered: false, items: ["Red blood cells, disc-shaped to carry oxygen and squeeze through capillaries", "Nerve cells, long and branched to carry electrical signals", "Root hair cells, long extensions to absorb water from soil"] },
      { type: "callout", tone: "tip", text: "You can usually guess a cell's job from its shape. Form follows function." },
      { type: "exercise", prompt: "Why do red blood cells have a biconcave (dented disc) shape?", hint: "Think about surface area and flexibility." },
    ],
  },
  {
    id: "lesson-cells-4",
    courseId: "course-cells",
    title: "From Cells to Systems",
    description: "How trillions of cells cooperate to keep you alive.",
    objectives: [
      "Order the levels of organisation in the body",
      "Give an example of an organ system",
      "Explain how systems work together",
    ],
    minutes: 15,
    order: 4,
    blocks: [
      { type: "paragraph", text: "Cells do not work alone. They form tissues (groups of similar cells), tissues form organs, organs form systems, and systems form the whole organism. This organisation lets a body do far more than any single cell could." },
      { type: "example", title: "The journey of a meal", text: "Food moves through the digestive system, but it only becomes useful when the circulatory system carries absorbed nutrients to every cell. The respiratory system supplies the oxygen needed to release that energy." },
      { type: "exercise", prompt: "Put in order from smallest to largest: organ, cell, organism, tissue.", hint: "Cells make tissues, tissues make organs, organs make organisms." },
    ],
  },

  // English for Academic Writing
  {
    id: "lesson-writing-1",
    courseId: "course-academic-writing",
    title: "The Anatomy of a Paragraph",
    description: "Topic sentences, support and concluding sentences.",
    objectives: [
      "Identify the three parts of a paragraph",
      "Write a clear topic sentence",
      "Keep one paragraph on one idea",
    ],
    minutes: 16,
    order: 1,
    blocks: [
      { type: "paragraph", text: "A paragraph is a unit of thought. In academic writing, most paragraphs contain one main idea expressed in a topic sentence, supporting sentences that develop it, and sometimes a concluding sentence that ties it together." },
      { type: "example", title: "Topic sentence", text: "Weak: 'Education is important.' Strong: 'Education reduces poverty by opening doors to better-paid work and by building the skills communities need to grow.' Notice the strong version is specific and argues a point." },
      { type: "callout", tone: "tip", text: "If you find yourself writing about a second idea, start a new paragraph. One paragraph, one idea." },
      { type: "exercise", prompt: "Write a topic sentence for a paragraph about why reading matters.", hint: "Make it specific enough that a reader knows what the whole paragraph will cover." },
    ],
  },
  {
    id: "lesson-writing-2",
    courseId: "course-academic-writing",
    title: "Building an Argument",
    description: "Claims, evidence and explanation.",
    objectives: [
      "Define a claim",
      "Distinguish evidence from opinion",
      "Explain how evidence supports a claim",
    ],
    minutes: 18,
    order: 2,
    blocks: [
      { type: "paragraph", text: "An argument has three parts: a claim (your point), evidence (facts, examples or data), and reasoning (the explanation of how the evidence supports the claim). Without reasoning, evidence is just a list." },
      { type: "example", title: "Claim + evidence + reasoning", text: "Claim: 'Regular reading improves writing.' Evidence: In one study, students who read 20 minutes daily scored 12% higher on writing assessments. Reasoning: Reading exposes students to varied sentence structures and vocabulary, which they absorb and reproduce." },
      { type: "exercise", prompt: "Write one sentence of reasoning for this claim: 'Learning a second language improves job prospects.' Use evidence of your own.", hint: "Ask: how exactly does the evidence lead to the claim?" },
    ],
  },
  {
    id: "lesson-writing-3",
    courseId: "course-academic-writing",
    title: "Editing Your Own Work",
    description: "The difference between drafting and polishing.",
    objectives: [
      "Edit for clarity before grammar",
      "Cut unnecessary words",
      "Read your work aloud",
    ],
    minutes: 14,
    order: 3,
    blocks: [
      { type: "paragraph", text: "First drafts are allowed to be rough. Editing is where clarity is won. Work in two passes: first check structure and meaning (does each paragraph make its point?), then check grammar, spelling and punctuation." },
      { type: "example", title: "Cut the fluff", text: "Before: 'In my opinion, I think that the results of the study are very significant indeed.' After: 'The study results are significant.' Shorter is stronger." },
      { type: "callout", tone: "tip", text: "Read your writing aloud. Your ear catches awkward sentences your eye skips over." },
      { type: "exercise", prompt: "Rewrite this sentence to be clearer: 'Due to the fact that the experiment was repeated, it was confirmed that the results remained consistent.'", hint: "Remove 'due to the fact that' and 'it was confirmed that'." },
    ],
  },

  // Python
  {
    id: "lesson-python-1",
    courseId: "course-python",
    title: "Your First Program",
    description: "Printing, variables and talking to the computer.",
    objectives: [
      "Run a simple Python program",
      "Create and use variables",
      "Combine text and numbers in output",
    ],
    minutes: 15,
    order: 1,
    blocks: [
      { type: "paragraph", text: "Python is a language for giving computers instructions. Your first instruction is print(), which displays text on the screen. Run this and you are officially a programmer." },
      { type: "example", title: "Hello", text: "print('Hello, world!') prints Hello, world! Variables store values: name = 'Amina' then print(name) prints Amina." },
      { type: "callout", tone: "warning", text: "Text must be in quotes. print(hello) will crash because Python thinks hello is a variable that does not exist." },
      { type: "exercise", prompt: "Create a variable called school with the value 'EduWorld', then print it.", hint: "Two lines: one assignment, one print." },
    ],
  },
  {
    id: "lesson-python-2",
    courseId: "course-python",
    title: "Making Decisions",
    description: "If, elif and else, giving your program a brain.",
    objectives: [
      "Write an if statement",
      "Use comparison operators",
      "Handle multiple conditions with elif",
    ],
    minutes: 16,
    order: 2,
    blocks: [
      { type: "paragraph", text: "Programs make choices with if statements. They check a condition and run different code depending on whether it is true or false." },
      { type: "example", title: "Checking a score", text: "score = 72\nif score >= 60:\n    print('Pass')\nelse:\n    print('Retake'), Note the colon after the condition and the indentation underneath." },
      { type: "callout", tone: "tip", text: "Indentation is not decoration in Python, it defines which code belongs to which block." },
      { type: "exercise", prompt: "Write an if statement that prints 'Adult' when age is 18 or more, and 'Minor' otherwise.", hint: "Use age >= 18 as the condition." },
    ],
  },
  {
    id: "lesson-python-3",
    courseId: "course-python",
    title: "Loops",
    description: "Repeat work without repeating code.",
    objectives: [
      "Write a for loop",
      "Iterate over a range of numbers",
      "Understand iteration variables",
    ],
    minutes: 17,
    order: 3,
    blocks: [
      { type: "paragraph", text: "A loop repeats a block of code. The for loop walks through a sequence of values, running its body once per value." },
      { type: "example", title: "Counting", text: "for i in range(1, 4):\n    print(i) prints 1, 2, 3. Notice range(1, 4) stops before 4." },
      { type: "example", title: "Total", text: "total = 0\nfor n in range(1, 6):\n    total = total + n\nprint(total) prints 15, the sum of 1+2+3+4+5." },
      { type: "exercise", prompt: "Write code to print the numbers 2, 4, 6, 8, 10.", hint: "Use range(2, 11, 2)." },
    ],
  },
  {
    id: "lesson-python-4",
    courseId: "course-python",
    title: "Functions",
    description: "Pack code into reusable building blocks.",
    objectives: [
      "Define a function with def",
      "Pass arguments and return values",
      "Call functions you have written",
    ],
    minutes: 18,
    order: 4,
    blocks: [
      { type: "paragraph", text: "A function is a named block of code you can run again and again. It takes inputs (arguments) and can hand back a result with return." },
      { type: "example", title: "Doubling", text: "def double(x):\n    return x * 2\n\nprint(double(5)) prints 10. The function takes 5 in and gives 10 back out." },
      { type: "callout", tone: "tip", text: "Functions keep your code organised. If you copy-paste the same logic twice, consider making it a function." },
      { type: "exercise", prompt: "Define a function greet(name) that returns 'Hello, ' + name + '!' Then call it with your own name.", hint: "Use return with string concatenation." },
    ],
  },

  // The Modern World
  {
    id: "lesson-history-1",
    courseId: "course-modern-world",
    title: "The World in 1900",
    description: "The global order at the dawn of the twentieth century.",
    objectives: [
      "Describe the state of world empires in 1900",
      "Explain how industrialisation changed societies",
      "Identify tensions building before 1914",
    ],
    minutes: 16,
    order: 1,
    blocks: [
      { type: "paragraph", text: "In 1900, Europe dominated the world. A handful of empires, British, French, German, Russian, Austro-Hungarian, Ottoman, controlled most of Africa and Asia. Industrialisation had made them wealthy, but also suspicious of each other." },
      { type: "example", title: "A world connected by steam", text: "Steamships and railways linked continents within days instead of months. A crop failure in Argentina could move wheat prices in London, the first truly global economy was emerging." },
      { type: "callout", tone: "info", text: "Historians study 1900 not because it was peaceful, but because the alliance system and arms race it produced made a world war increasingly likely." },
      { type: "exercise", prompt: "Name two European empires that controlled territory in Africa in 1900.", hint: "Think of the largest colonial powers." },
    ],
  },
  {
    id: "lesson-history-2",
    courseId: "course-modern-world",
    title: "The World Wars",
    description: "How two conflicts reshaped the planet.",
    objectives: [
      "Summarise the causes of World War I",
      "Explain how World War II differed from World War I",
      "Describe the human cost of both wars",
    ],
    minutes: 20,
    order: 2,
    blocks: [
      { type: "paragraph", text: "World War I (1914–1918) began with a spark in Sarajevo but had deeper causes: rival alliances, nationalism and imperial competition. Industrial weapons, machine guns, artillery, poison gas, produced staggering casualties in trench warfare." },
      { type: "paragraph", text: "World War II (1939–1945) was broader and more mobile. It involved far more of the globe and introduced unprecedented devastation, including the Holocaust and the first use of nuclear weapons. When it ended, the world had a new shape and a new superpower rivalry." },
      { type: "callout", tone: "warning", text: "Historians debate precise casualty figures, but the wars together took an estimated 70–85 million lives. Numbers this large can feel abstract, historians constantly work to keep individual human stories at the centre." },
      { type: "exercise", prompt: "Give one difference between World War I and World War II.", hint: "Consider weapons, geography or the number of countries involved." },
    ],
  },
  {
    id: "lesson-history-3",
    courseId: "course-modern-world",
    title: "Decolonisation & the Modern Age",
    description: "The end of empire and the world we live in now.",
    objectives: [
      "Explain what decolonisation was",
      "Give examples of newly independent nations",
      "Connect the 20th century to today's world",
    ],
    minutes: 17,
    order: 3,
    blocks: [
      { type: "paragraph", text: "After World War II, the colonial empires unravelled quickly. Between 1945 and 1975, dozens of nations, from India and Ghana to Kenya and Vietnam, won independence. This was one of the most consequential transformations in modern history." },
      { type: "example", title: "Ghana, 1957", text: "Under the leadership of Kwame Nkrumah, the Gold Coast became Ghana in 1957, the first sub-Saharan African colony to gain independence. It inspired independence movements across the continent." },
      { type: "callout", tone: "tip", text: "Decolonisation was not only political. New nations also had to build economies, education systems and identities, challenges that continue to shape world events today." },
      { type: "exercise", prompt: "Why is 1957 significant in African history?", hint: "Think about which country and what 'first' it represents." },
    ],
  },

  // Physical Geography
  {
    id: "lesson-geo-1",
    courseId: "course-physical-geography",
    title: "The Water Cycle",
    description: "Earth's endless journey of water.",
    objectives: [
      "Name the stages of the water cycle",
      "Explain how evaporation and condensation work",
      "Link the cycle to rivers and rainfall",
    ],
    minutes: 14,
    order: 1,
    blocks: [
      { type: "paragraph", text: "Water on Earth is always on the move. The sun evaporates water from oceans, lakes and soil. It rises, cools and condenses into clouds, then falls as rain or snow. Rivers carry it back to the sea, and the cycle repeats." },
      { type: "example", title: "A raindrop's journey", text: "A drop evaporates from the Indian Ocean, is carried by monsoon winds, falls as rain over Kenya, seeps through soil, feeds a river and eventually returns to the ocean. The same molecules have cycled for billions of years." },
      { type: "exercise", prompt: "What drives the movement of water in the cycle?", hint: "It is the Sun's energy." },
    ],
  },
  {
    id: "lesson-geo-2",
    courseId: "course-physical-geography",
    title: "Climate Zones",
    description: "Why the world has deserts, rainforests and everything between.",
    objectives: [
      "Describe major climate zones",
      "Explain how latitude affects climate",
      "Give one example of a local climate influence",
    ],
    minutes: 16,
    order: 2,
    blocks: [
      { type: "paragraph", text: "The Earth's tilt and curvature mean sunlight strikes different places at different angles. The equator receives intense, direct sunlight, hence its warm, wet rainforests. Towards the poles, sunlight is weaker and spread out, producing colder climates." },
      { type: "list", ordered: false, items: ["Tropical, hot and often wet, near the equator", "Arid, dry, where sinking air suppresses rainfall (Sahara, Kalahari)", "Temperate, moderate seasons, between tropics and polar zones", "Polar, cold year-round, near the poles"] },
      { type: "callout", tone: "info", text: "Mountains and oceans disrupt the simple pattern: highlands are cooler, and coastal areas often have milder, wetter climates than inland regions at the same latitude." },
      { type: "exercise", prompt: "Why are tropical rainforests located near the equator?", hint: "Think about the angle of sunlight." },
    ],
  },
  {
    id: "lesson-geo-3",
    courseId: "course-physical-geography",
    title: "Rivers and Landscapes",
    description: "How flowing water carves the land.",
    objectives: [
      "Describe how rivers shape valleys",
      "Explain erosion, transport and deposition",
      "Identify features like deltas and waterfalls",
    ],
    minutes: 15,
    order: 3,
    blocks: [
      { type: "paragraph", text: "Rivers are Earth's sculptors. They erode rock and soil, transport the sediment downstream, and deposit it where the flow slows. Over millennia, this process carves canyons, builds floodplains and creates deltas at river mouths." },
      { type: "example", title: "A delta", text: "Where the Nile meets the Mediterranean, silt dropped by the slowing river has built a vast fan of fertile land. Deltas like this have supported farming, and civilisations, for thousands of years." },
      { type: "exercise", prompt: "What happens to a river's sediment when it reaches the sea?", hint: "The water slows down and can no longer carry the load." },
    ],
  },

  // Economics
  {
    id: "lesson-econ-1",
    courseId: "course-economics-everyday",
    title: "Scarcity and Choice",
    description: "The core problem every economy solves.",
    objectives: [
      "Define scarcity",
      "Explain opportunity cost",
      "Use the concept to analyse everyday decisions",
    ],
    minutes: 14,
    order: 1,
    blocks: [
      { type: "paragraph", text: "Economics begins with a simple fact: resources are limited, but wants are unlimited. This gap is scarcity. Because of scarcity, every choice has a cost, the value of the next best thing you gave up, called the opportunity cost." },
      { type: "example", title: "Your time", text: "You have one evening. Studying for tomorrow's test earns you a better grade, but you give up the movie you wanted to watch. The movie is the opportunity cost of studying." },
      { type: "callout", tone: "tip", text: "Whenever you choose, ask: 'What am I giving up?' You are doing economics." },
      { type: "exercise", prompt: "A student spends $10 on snacks instead of a book. What is the opportunity cost?", hint: "It is the book." },
    ],
  },
  {
    id: "lesson-econ-2",
    courseId: "course-economics-everyday",
    title: "Supply, Demand and Price",
    description: "The invisible hand at the market.",
    objectives: [
      "Define demand and supply",
      "Explain how prices change",
      "Read a simple market situation",
    ],
    minutes: 17,
    order: 2,
    blocks: [
      { type: "paragraph", text: "Demand is how much people want to buy at a given price; supply is how much sellers want to offer. When demand rises but supply stays the same, prices tend to rise. When supply rises, prices tend to fall." },
      { type: "example", title: "A mango harvest", text: "A good harvest floods the market with mangoes. Supply rises, so prices fall. If a drought destroys the crop, supply shrinks and prices climb. Simple observation, powerful prediction." },
      { type: "exercise", prompt: "A new phone is released and everyone wants it, but only a limited number are made. What happens to the price?", hint: "Demand is high and supply is low." },
    ],
  },
  {
    id: "lesson-econ-3",
    courseId: "course-economics-everyday",
    title: "Money, Inflation and You",
    description: "Why prices rise and what it means for your pocket.",
    objectives: [
      "Define inflation",
      "Explain a common cause of inflation",
      "Discuss why stable prices matter",
    ],
    minutes: 15,
    order: 3,
    blocks: [
      { type: "paragraph", text: "Inflation is a general rise in prices over time. When prices rise, each unit of money buys less. Mild inflation is normal in growing economies, but very high inflation erodes savings and hurts people on fixed incomes." },
      { type: "example", title: "The bread basket", text: "If the cost of flour, fuel and transport all rise, bakers charge more for bread. If many prices rise together, we have inflation, often because the total money in the economy grows faster than the goods available." },
      { type: "exercise", prompt: "Why does high inflation hurt people whose incomes do not change?", hint: "Consider what happens to what their money can buy." },
    ],
  },

  // Business Fundamentals
  {
    id: "lesson-biz-1",
    courseId: "course-business-fundamentals",
    title: "What Is a Business?",
    description: "Value, customers and the engine of enterprise.",
    objectives: [
      "Define a business",
      "Explain how value is created",
      "Identify who a business serves",
    ],
    minutes: 13,
    order: 1,
    blocks: [
      { type: "paragraph", text: "A business creates value for customers and earns money in return. The value might be a product (a phone), a service (a haircut) or an experience (a concert). If customers value what you offer more than the price they pay, the business can thrive." },
      { type: "example", title: "The market stall", text: "A market trader buys tomatoes in the morning and sells them by lunchtime. The trader creates value by having the tomatoes where shoppers are, in the quantities they need, at the moment they want them." },
      { type: "exercise", prompt: "Name one business in your community and say what value it creates.", hint: "Think about what customers get from it." },
    ],
  },
  {
    id: "lesson-biz-2",
    courseId: "course-business-fundamentals",
    title: "Revenue, Costs and Profit",
    description: "The money story behind every business.",
    objectives: [
      "Define revenue, costs and profit",
      "Calculate simple profit",
      "Explain why cash matters",
    ],
    minutes: 15,
    order: 2,
    blocks: [
      { type: "paragraph", text: "Revenue is the money a business receives from sales. Costs are what it spends to operate. Profit is revenue minus costs. Profit is not greed, it is what allows a business to grow, pay staff and survive." },
      { type: "example", title: "Selling lemonade", text: "You sell 50 cups at $2 = $100 revenue. Ingredients cost $30, so profit = $100 − $30 = $70. But if the cups cost $3, you make $150 revenue and $90 profit, more for the same effort." },
      { type: "callout", tone: "warning", text: "A business can be profitable on paper yet fail if it runs out of cash. Cash flow, when money actually arrives and leaves, is different from profit." },
      { type: "exercise", prompt: "A shop has revenue of $5,000 and costs of $3,200. What is its profit?", hint: "Subtract costs from revenue." },
    ],
  },
  {
    id: "lesson-biz-3",
    courseId: "course-business-fundamentals",
    title: "Customers and Marketing",
    description: "Finding people who need what you offer.",
    objectives: [
      "Explain what marketing is",
      "Identify the four Ps",
      "Connect features to benefits",
    ],
    minutes: 14,
    order: 3,
    blocks: [
      { type: "paragraph", text: "Marketing is how a business connects with customers. The classic framework is the four Ps: Product (what you offer), Price (what you charge), Place (where customers find it) and Promotion (how you tell people about it)." },
      { type: "example", title: "Feature vs benefit", text: "A feature: 'This bag has a padded laptop sleeve.' A benefit: 'Your laptop stays safe on the bus.' Customers buy benefits, not just features." },
      { type: "exercise", prompt: "A tutoring service advertises 'small groups of four'. Is that a feature or a benefit? How would you turn it into a benefit?", hint: "What does a small group do for the learner?" },
    ],
  },
];

// ── Quizzes ──────────────────────────────────────────────────────────────────

const quizzes: Quiz[] = [
  {
    id: "quiz-algebra",
    courseId: "course-algebra",
    lessonId: null,
    title: "Algebra Foundations, Checkpoint",
    description: "Ten questions covering the whole course.",
    passingScore: 60,
    timeLimitMinutes: 15,
    published: true,
    questions: [
      { id: "q-a1", type: "multiple_choice", prompt: "Which of these is an expression?", options: ["x + 5 = 9", "3x + 2", "7 = y", "x − 1 = 0"], correctIndex: 1, correctAnswer: null, explanation: "An expression has no equals sign. x + 5 = 9 is an equation; 3x + 2 is an expression." },
      { id: "q-a2", type: "multiple_choice", prompt: "Simplify 4x + 2 − x + 9.", options: ["3x + 11", "5x + 11", "3x + 7", "5x + 7"], correctIndex: 0, correctAnswer: null, explanation: "4x − x = 3x and 2 + 9 = 11, so the result is 3x + 11." },
      { id: "q-a3", type: "multiple_choice", prompt: "Solve x + 7 = 15.", options: ["x = 22", "x = 8", "x = 7", "x = 105"], correctIndex: 1, correctAnswer: null, explanation: "Subtract 7 from both sides: x = 8." },
      { id: "q-a4", type: "multiple_choice", prompt: "Solve 4x = 36.", options: ["x = 9", "x = 32", "x = 144", "x = 6"], correctIndex: 0, correctAnswer: null, explanation: "Divide both sides by 4: x = 9." },
      { id: "q-a5", type: "true_false", prompt: "3x + 4y can be simplified to 7xy.", options: ["True", "False"], correctIndex: 1, correctAnswer: null, explanation: "Different variables cannot be combined. 3x + 4y is already in simplest form." },
      { id: "q-a6", type: "multiple_choice", prompt: "If y = 2x and x = 3, what is y?", options: ["5", "6", "9", "2"], correctIndex: 1, correctAnswer: null, explanation: "y = 2 × 3 = 6." },
      { id: "q-a7", type: "short_answer", prompt: "Write an expression for: the total cost of n notebooks if each costs $4.", options: [], correctIndex: -1, correctAnswer: "4n", explanation: "Four dollars per notebook times n notebooks is 4n." },
    ],
  },
  {
    id: "quiz-cells",
    courseId: "course-cells",
    lessonId: null,
    title: "Cells & Life Processes, Checkpoint",
    description: "Eight questions on cells and organisation.",
    passingScore: 60,
    timeLimitMinutes: 12,
    published: true,
    questions: [
      { id: "q-c1", type: "multiple_choice", prompt: "Which part of the cell contains DNA?", options: ["Cell membrane", "Nucleus", "Cytoplasm", "Mitochondria"], correctIndex: 1, correctAnswer: null, explanation: "The nucleus is the control centre and contains the genetic material." },
      { id: "q-c2", type: "multiple_choice", prompt: "Which structure is found in plant cells but not animal cells?", options: ["Nucleus", "Cell wall", "Cell membrane", "Mitochondria"], correctIndex: 1, correctAnswer: null, explanation: "Plant cells have a rigid cell wall made mostly of cellulose." },
      { id: "q-c3", type: "multiple_choice", prompt: "What process do chloroplasts carry out?", options: ["Respiration", "Photosynthesis", "Digestion", "Excretion"], correctIndex: 1, correctAnswer: null, explanation: "Chloroplasts capture sunlight to make glucose and oxygen, photosynthesis." },
      { id: "q-c4", type: "multiple_choice", prompt: "Why do cells stay small?", options: ["To save energy", "Their surface area grows slower than volume", "They cannot divide otherwise", "To avoid mutations"], correctIndex: 1, correctAnswer: null, explanation: "As a cell grows, volume increases faster than surface area, making it hard to exchange materials." },
      { id: "q-c5", type: "true_false", prompt: "A tissue is a group of similar cells working together.", options: ["True", "False"], correctIndex: 0, correctAnswer: null, explanation: "Tissues are groups of similar cells with a shared function." },
      { id: "q-c6", type: "multiple_choice", prompt: "Which is the correct order from smallest to largest?", options: ["cell → tissue → organ → organism", "tissue → cell → organ → organism", "cell → organ → tissue → organism", "organ → cell → tissue → organism"], correctIndex: 0, correctAnswer: null, explanation: "Cells form tissues, tissues form organs, organs form organisms." },
      { id: "q-c7", type: "multiple_choice", prompt: "Which cell type is specialised to carry oxygen?", options: ["Nerve cell", "Red blood cell", "Root hair cell", "Muscle cell"], correctIndex: 1, correctAnswer: null, explanation: "Red blood cells are disc-shaped to carry oxygen efficiently." },
      { id: "q-c8", type: "short_answer", prompt: "What is the process called when cells become specialised?", options: [], correctIndex: -1, correctAnswer: "differentiation", explanation: "Differentiation is the process by which cells become specialised for particular roles." },
    ],
  },
  {
    id: "quiz-writing",
    courseId: "course-academic-writing",
    lessonId: null,
    title: "Academic Writing, Checkpoint",
    description: "Check your understanding of paragraphs and arguments.",
    passingScore: 60,
    timeLimitMinutes: 12,
    published: true,
    questions: [
      { id: "q-w1", type: "multiple_choice", prompt: "What is the role of a topic sentence?", options: ["To add examples", "To state the main idea of the paragraph", "To conclude the essay", "To list references"], correctIndex: 1, correctAnswer: null, explanation: "The topic sentence states the paragraph's main idea." },
      { id: "q-w2", type: "multiple_choice", prompt: "Which is a strong topic sentence?", options: ["Education is important.", "Education reduces poverty by building skills that help communities grow.", "Schools exist in many countries.", "Learning is a thing people do."], correctIndex: 1, correctAnswer: null, explanation: "A strong topic sentence is specific and arguable." },
      { id: "q-w3", type: "multiple_choice", prompt: "In an argument, reasoning is…", options: ["The claim itself", "The explanation of how evidence supports the claim", "A list of facts", "The introduction"], correctIndex: 1, correctAnswer: null, explanation: "Reasoning connects evidence to the claim." },
      { id: "q-w4", type: "true_false", prompt: "A first draft should be polished before checking structure.", options: ["True", "False"], correctIndex: 1, correctAnswer: null, explanation: "Edit structure and meaning first; polish grammar later." },
      { id: "q-w5", type: "multiple_choice", prompt: "What is the best rewrite of 'In my opinion, I think the results are very significant indeed'?", options: ["Keep it as is", "The results are significant.", "I think the results are significant.", "In my opinion the results are significant."], correctIndex: 1, correctAnswer: null, explanation: "Shorter is stronger; the filler adds nothing." },
      { id: "q-w6", type: "short_answer", prompt: "What are the three parts of an argument?", options: [], correctIndex: -1, correctAnswer: "claim, evidence, reasoning", explanation: "Claim, evidence and reasoning (also called claim-evidence-reasoning)." },
    ],
  },
  {
    id: "quiz-python",
    courseId: "course-python",
    lessonId: null,
    title: "Python Basics, Checkpoint",
    description: "A quick check of variables, conditions, loops and functions.",
    passingScore: 60,
    timeLimitMinutes: 15,
    published: true,
    questions: [
      { id: "q-p1", type: "multiple_choice", prompt: "What does print('Hi') do?", options: ["Asks the user a question", "Displays Hi on the screen", "Saves a file", "Ends the program"], correctIndex: 1, correctAnswer: null, explanation: "print() displays text to the screen." },
      { id: "q-p2", type: "multiple_choice", prompt: "Which line correctly defines a variable?", options: ["name = 'Amina'", "let name = 'Amina'", "name equals 'Amina'", "var name: 'Amina'"], correctIndex: 0, correctAnswer: null, explanation: "Python uses simple assignment with =." },
      { id: "q-p3", type: "multiple_choice", prompt: "What does range(1, 4) produce?", options: ["1, 2, 3, 4", "1, 2, 3", "0, 1, 2, 3", "2, 3, 4"], correctIndex: 1, correctAnswer: null, explanation: "range stops before the end value, so it yields 1, 2, 3." },
      { id: "q-p4", type: "multiple_choice", prompt: "Which condition prints 'Adult' for age = 20?", options: ["if age < 18:", "if age >= 18:", "if age == 18:", "if age > 18:"], correctIndex: 1, correctAnswer: null, explanation: "Age 20 is greater than or equal to 18." },
      { id: "q-p5", type: "true_false", prompt: "Indentation in Python is optional decoration.", options: ["True", "False"], correctIndex: 1, correctAnswer: null, explanation: "Indentation defines code blocks in Python, it is required." },
      { id: "q-p6", type: "multiple_choice", prompt: "What does this print? def double(x): return x * 2 → print(double(5))", options: ["25", "10", "5", "2"], correctIndex: 1, correctAnswer: null, explanation: "double(5) returns 5 × 2 = 10." },
      { id: "q-p7", type: "short_answer", prompt: "Write the keyword used to define a function.", options: [], correctIndex: -1, correctAnswer: "def", explanation: "Functions are defined with the def keyword." },
    ],
  },
  {
    id: "quiz-history",
    courseId: "course-modern-world",
    lessonId: null,
    title: "The Modern World, Checkpoint",
    description: "Ten questions on the twentieth century.",
    passingScore: 60,
    timeLimitMinutes: 15,
    published: true,
    questions: [
      { id: "q-h1", type: "multiple_choice", prompt: "In 1900, most of Africa was controlled by:", options: ["Independent African nations", "European empires", "The United Nations", "Chinese dynasties"], correctIndex: 1, correctAnswer: null, explanation: "European empires controlled the vast majority of Africa in 1900." },
      { id: "q-h2", type: "multiple_choice", prompt: "Which event is often called the spark of World War I?", options: ["The sinking of the Titanic", "The assassination of Archduke Franz Ferdinand", "The Russian Revolution", "The Treaty of Versailles"], correctIndex: 1, correctAnswer: null, explanation: "The assassination in Sarajevo in 1914 triggered the alliance system into war." },
      { id: "q-h3", type: "multiple_choice", prompt: "World War I was fought mainly:", options: ["In trenches", "Entirely at sea", "In the air", "With nuclear weapons"], correctIndex: 0, correctAnswer: null, explanation: "Trench warfare dominated the Western Front." },
      { id: "q-h4", type: "multiple_choice", prompt: "Which country became the first sub-Saharan African colony to gain independence in 1957?", options: ["Kenya", "Ghana", "Nigeria", "South Africa"], correctIndex: 1, correctAnswer: null, explanation: "Ghana (formerly the Gold Coast) became independent in 1957 under Kwame Nkrumah." },
      { id: "q-h5", type: "true_false", prompt: "Decolonisation was complete by the end of World War II.", options: ["True", "False"], correctIndex: 1, correctAnswer: null, explanation: "Decolonisation accelerated after 1945, spanning decades into the 1970s and beyond." },
      { id: "q-h6", type: "multiple_choice", prompt: "Which is a cause shared by both world wars?", options: ["Economic hardship and political instability", "The spread of the internet", "Colonialism in space", "Religious wars in Europe"], correctIndex: 0, correctAnswer: null, explanation: "Economic turmoil and political instability fed both conflicts." },
      { id: "q-h7", type: "short_answer", prompt: "Name one country that gained independence after World War II.", options: [], correctIndex: -1, correctAnswer: "india", explanation: "India (1947) is the most famous example; Ghana, Kenya, Vietnam and many others also qualify." },
    ],
  },
  {
    id: "quiz-geo",
    courseId: "course-physical-geography",
    lessonId: null,
    title: "Physical Geography, Checkpoint",
    description: "Seven questions on water, climate and landscapes.",
    passingScore: 60,
    timeLimitMinutes: 12,
    published: true,
    questions: [
      { id: "q-g1", type: "multiple_choice", prompt: "What drives the water cycle?", options: ["The Moon's gravity", "The Sun's energy", "Volcanoes", "Ocean currents alone"], correctIndex: 1, correctAnswer: null, explanation: "Solar energy powers evaporation and drives the cycle." },
      { id: "q-g2", type: "multiple_choice", prompt: "Water vapour cools and forms clouds. This is called:", options: ["Evaporation", "Condensation", "Precipitation", "Transpiration"], correctIndex: 1, correctAnswer: null, explanation: "Condensation is the change from gas to liquid." },
      { id: "q-g3", type: "multiple_choice", prompt: "Which climate zone is typically found near the equator?", options: ["Polar", "Temperate", "Tropical", "Arid"], correctIndex: 2, correctAnswer: null, explanation: "The equator receives direct sunlight, producing tropical climates." },
      { id: "q-g4", type: "multiple_choice", prompt: "Why are the Sahara and Kalahari deserts dry?", options: ["They are near the poles", "Sinking air suppresses rainfall", "They are far from the equator", "They are very high above sea level"], correctIndex: 1, correctAnswer: null, explanation: "High-pressure zones with sinking air create dry conditions around 30° latitude." },
      { id: "q-g5", type: "true_false", prompt: "Rivers only erode land; they never deposit material.", options: ["True", "False"], correctIndex: 1, correctAnswer: null, explanation: "Rivers both erode and deposit sediment, building features like floodplains and deltas." },
      { id: "q-g6", type: "multiple_choice", prompt: "A delta forms where:", options: ["A river meets a steep cliff", "A river slows and drops sediment at its mouth", "Rain falls heavily", "Glaciers melt"], correctIndex: 1, correctAnswer: null, explanation: "Deltas form where rivers deposit sediment as they enter slower water." },
      { id: "q-g7", type: "short_answer", prompt: "Name the process by which rivers wear away rock and soil.", options: [], correctIndex: -1, correctAnswer: "erosion", explanation: "Erosion is the wearing away and transport of material by water, wind or ice." },
    ],
  },
  {
    id: "quiz-econ",
    courseId: "course-economics-everyday",
    lessonId: null,
    title: "Economics, Checkpoint",
    description: "Seven questions on scarcity, markets and money.",
    passingScore: 60,
    timeLimitMinutes: 12,
    published: true,
    questions: [
      { id: "q-e1", type: "multiple_choice", prompt: "Scarcity means:", options: ["There is never enough money", "Resources are limited while wants are unlimited", "People are greedy", "Prices always rise"], correctIndex: 1, correctAnswer: null, explanation: "Scarcity is the gap between limited resources and unlimited wants." },
      { id: "q-e2", type: "multiple_choice", prompt: "The opportunity cost of choosing A is:", options: ["The price of A", "The value of the next best alternative given up", "The total cost of all alternatives", "Nothing, if A is free"], correctIndex: 1, correctAnswer: null, explanation: "Opportunity cost is the value of the next best alternative you forgo." },
      { id: "q-e3", type: "multiple_choice", prompt: "A good harvest increases the supply of mangoes. Prices will likely:", options: ["Rise", "Fall", "Stay exactly the same", "Become illegal"], correctIndex: 1, correctAnswer: null, explanation: "More supply, with demand unchanged, pushes prices down." },
      { id: "q-e4", type: "multiple_choice", prompt: "Inflation is:", options: ["A rise in the general level of prices", "A fall in taxes", "An increase in savings", "A decrease in wages"], correctIndex: 0, correctAnswer: null, explanation: "Inflation is a sustained rise in the overall price level." },
      { id: "q-e5", type: "true_false", prompt: "High inflation tends to hurt people on fixed incomes.", options: ["True", "False"], correctIndex: 0, correctAnswer: null, explanation: "As prices rise, fixed incomes buy less." },
      { id: "q-e6", type: "multiple_choice", prompt: "If demand for a new phone is high but supply is limited, price will likely:", options: ["Rise", "Fall", "Stay flat", "Be set by law"], correctIndex: 0, correctAnswer: null, explanation: "High demand with low supply pushes prices upward." },
      { id: "q-e7", type: "short_answer", prompt: "What is the next best thing you give up when you make a choice?", options: [], correctIndex: -1, correctAnswer: "opportunity cost", explanation: "The value of the forgone alternative is the opportunity cost." },
    ],
  },
  {
    id: "quiz-biz",
    courseId: "course-business-fundamentals",
    lessonId: null,
    title: "Business Fundamentals, Checkpoint",
    description: "Seven questions on value, money and customers.",
    passingScore: 60,
    timeLimitMinutes: 12,
    published: true,
    questions: [
      { id: "q-b1", type: "multiple_choice", prompt: "Which best describes what a business does?", options: ["Creates value for customers in exchange for money", "Collects taxes", "Provides only free services", "Buys shares"], correctIndex: 0, correctAnswer: null, explanation: "Businesses create value and earn revenue in return." },
      { id: "q-b2", type: "multiple_choice", prompt: "Profit equals:", options: ["Revenue plus costs", "Revenue minus costs", "Costs minus revenue", "Revenue divided by costs"], correctIndex: 1, correctAnswer: null, explanation: "Profit = revenue − costs." },
      { id: "q-b3", type: "multiple_choice", prompt: "Revenue of $5,000 and costs of $3,200 give a profit of:", options: ["$8,200", "$1,800", "$3,200", "$5,000"], correctIndex: 1, correctAnswer: null, explanation: "5,000 − 3,200 = 1,800." },
      { id: "q-b4", type: "multiple_choice", prompt: "Which is NOT one of the four Ps of marketing?", options: ["Product", "Price", "People", "Place"], correctIndex: 2, correctAnswer: null, explanation: "The four Ps are product, price, place and promotion." },
      { id: "q-b5", type: "multiple_choice", prompt: "'This bag has a padded laptop sleeve' is a:", options: ["Benefit", "Feature", "Price", "Promotion"], correctIndex: 1, correctAnswer: null, explanation: "It describes what the product has, a feature. The benefit is the safety it provides." },
      { id: "q-b6", type: "true_false", prompt: "A business can be profitable yet run out of cash.", options: ["True", "False"], correctIndex: 0, correctAnswer: null, explanation: "Profit and cash flow are different; timing matters." },
      { id: "q-b7", type: "short_answer", prompt: "What is the money a business receives from sales called?", options: [], correctIndex: -1, correctAnswer: "revenue", explanation: "Revenue is the income from sales." },
    ],
  },
];

// ── Achievements ─────────────────────────────────────────────────────────────

export const achievements: Achievement[] = [
  { id: "achv-first-lesson", slug: "first-lesson", name: "First Steps", description: "Complete your first lesson." },
  { id: "achv-first-quiz", slug: "first-quiz", name: "Tested", description: "Submit your first quiz." },
  { id: "achv-quiz-ace", slug: "quiz-ace", name: "Quiz Ace", description: "Score 90% or above on any quiz." },
  { id: "achv-course-complete", slug: "course-complete", name: "Course Conqueror", description: "Complete every lesson in a course." },
  { id: "achv-ten-lessons", slug: "ten-lessons", name: "Momentum", description: "Complete ten lessons in total." },
];

// ── Collections ─────────────────────────────────────────────────────────────

export const demoCatalog = {
  courses,
  lessons,
  quizzes,
  subjects,
  countries,
  languages,
  levels,
  achievements,
};

export function lessonsForCourse(courseId: string): Lesson[] {
  return lessons.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);
}

export function quizForCourse(courseId: string): Quiz | undefined {
  return quizzes.find((q) => q.courseId === courseId);
}

export function courseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function subjectById(id: string): Subject | undefined {
  return subjects.find((s) => s.id === id);
}

export function courseTotalMinutes(courseId: string): number {
  return lessonsForCourse(courseId).reduce((sum, l) => sum + l.minutes, 0);
}
