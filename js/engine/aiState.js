import { LESSONS } from '../data/aiLessons.js';
import { createQuizState } from './quizState.js';

export const { getState, isCompleted, completeLesson, getLevel, resetCourse } =
  createQuizState('grimorio-ia:v1', LESSONS);
