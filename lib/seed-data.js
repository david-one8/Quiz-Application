import { db } from "@/lib/db";

export const SAMPLE_QUIZZES = [
  {
    title: "Web Development Fundamentals",
    description: "Test your knowledge of HTML, CSS, and basic JavaScript. Covers semantic tags, selectors, and core language features.",
    category: "Technology",
    difficulty: "EASY",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyper Link Main Logic", "Home Tool Markup Language"],
        correctAnswer: "Hyper Text Markup Language",
        marks: 5
      },
      {
        text: "Which property is used to change the background color in CSS?",
        options: ["background-color", "color", "bgcolor", "background"],
        correctAnswer: "background-color",
        marks: 5
      },
      {
        text: "Which HTML tag is used for the largest heading?",
        options: ["<h1>", "<heading>", "<h6>", "<head>"],
        correctAnswer: "<h1>",
        marks: 5
      }
    ]
  },
  {
    title: "Modern UI/UX Patterns",
    description: "Explore layouts, micro-interactions, and professional design systems.",
    category: "Design",
    difficulty: "MEDIUM",
    duration: 10,
    isPublished: true,
    questions: [
      {
        text: "What is the primary goal of white space in UI design?",
        options: [
          "To reduce cognitive load and group elements",
          "To make the page look empty",
          "To increase the scrolling length",
          "To save on background images"
        ],
        correctAnswer: "To reduce cognitive load and group elements",
        marks: 10
      }
    ]
  }
];

export async function seedPlatform(userId) {
  const quizCount = await db.quiz.count();
  if (quizCount > 0) return false;

  for (const quizData of SAMPLE_QUIZZES) {
    const { questions, ...quizInfo } = quizData;
    await db.quiz.create({
      data: {
        ...quizInfo,
        createdById: userId,
        questions: {
          create: questions
        }
      }
    });
  }
  return true;
}
