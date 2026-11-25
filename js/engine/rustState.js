import { LESSONS } from '../data/rustLessons.js';
import { createQuizState } from './quizState.js';

export const { getState, isCompleted, completeLesson, getLevel, resetCourse } =
  createQuizState('grimorio-rust:v1', LESSONS);
