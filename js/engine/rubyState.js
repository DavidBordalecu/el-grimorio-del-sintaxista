import { LESSONS } from '../data/rubyLessons.js';
import { createQuizState } from './quizState.js';

export const { getState, isCompleted, completeLesson, getLevel, resetCourse } =
  createQuizState('grimorio-ruby:v1', LESSONS);
