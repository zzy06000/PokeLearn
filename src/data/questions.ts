import { Question } from '../types/game';

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'What is the past tense of "go"?',
    options: ['Goes', 'Gone', 'Went', 'Going'],
    correctAnswerIndex: 2,
    category: 'english',
    difficulty: 'easy'
  },
  {
    id: 'q2',
    text: 'Which word is a synonym for "Happy"?',
    options: ['Sad', 'Angry', 'Joyful', 'Tired'],
    correctAnswerIndex: 2,
    category: 'english',
    difficulty: 'easy'
  },
  {
    id: 'q3',
    text: '2 + 2 = ?',
    options: ['3', '4', '5', '22'],
    correctAnswerIndex: 1,
    category: 'math',
    difficulty: 'easy'
  },
  {
    id: 'q4',
    text: 'What do you use to brush your teeth?',
    options: ['Comb', 'Toothbrush', 'Spoon', 'Pencil'],
    correctAnswerIndex: 1,
    category: 'english',
    difficulty: 'easy'
  },
  {
    id: 'q5',
    text: 'What is the opposite of "Hot"?',
    options: ['Cold', 'Warm', 'Spicy', 'Red'],
    correctAnswerIndex: 0,
    category: 'english',
    difficulty: 'easy'
  },
  {
    id: 'q6',
    text: '10 - 5 = ?',
    options: ['2', '5', '15', '50'],
    correctAnswerIndex: 1,
    category: 'math',
    difficulty: 'easy'
  },
  {
    id: 'q7',
    text: 'Which of these is a fruit?',
    options: ['Carrot', 'Apple', 'Potato', 'Broccoli'],
    correctAnswerIndex: 1,
    category: 'general',
    difficulty: 'easy'
  },
  {
    id: 'q8',
    text: '5 x 2 = ?',
    options: ['7', '10', '3', '25'],
    correctAnswerIndex: 1,
    category: 'math',
    difficulty: 'easy'
  },
  {
    id: 'q9',
    text: 'What is the plural of "Cat"?',
    options: ['Cat', 'Cates', 'Cats', 'Kitten'],
    correctAnswerIndex: 2,
    category: 'english',
    difficulty: 'easy'
  },
  {
    id: 'q10',
    text: 'What color is the sky on a clear day?',
    options: ['Green', 'Blue', 'Purple', 'Red'],
    correctAnswerIndex: 1,
    category: 'general',
    difficulty: 'easy'
  }
];
