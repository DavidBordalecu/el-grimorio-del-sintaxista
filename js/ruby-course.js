import { LESSONS } from './data/rubyLessons.js';
import * as state from './engine/rubyState.js';
import { createCodeCourse } from './code-course.js';

createCodeCourse({
  lessons: LESSONS,
  state,
  elements: {
    container: document.getElementById('lessonsContainer'),
    xp: document.getElementById('courseXp'),
    level: document.getElementById('courseLevel'),
    count: document.getElementById('courseCount'),
    bar: document.getElementById('courseBar'),
    inventory: document.getElementById('pythonInventory'),
    reset: document.getElementById('resetPythonBtn')
  }
});
