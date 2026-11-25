import { LESSONS } from '../data/pythonLessons.js';
import { createQuizState } from './quizState.js';

export const { getState, isCompleted, completeLesson, getLevel, resetCourse } =
  createQuizState('grimorio-python:v1', LESSONS);
