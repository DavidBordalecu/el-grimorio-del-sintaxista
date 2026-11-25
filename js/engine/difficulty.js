const STORAGE_KEY = 'grimorio-dificultad:v1';

export const DIFFICULTIES = ['beginner', 'medium', 'hard', 'hardcore'];

export const DIFFICULTY_LABELS = {
  beginner: 'Principiante',
  medium: 'Medio',
  hard: 'Hard',
  hardcore: 'Hardcore'
};

export function getDifficulty() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return DIFFICULTIES.includes(stored) ? stored : 'beginner';
  } catch (error) {
    return 'beginner';
  }
}

export function setDifficulty(difficulty) {
  if (!DIFFICULTIES.includes(difficulty)) return;
  try {
    localStorage.setItem(STORAGE_KEY, difficulty);
  } catch (error) {
    console.warn('No se pudo guardar el nivel elegido:', error);
  }
  document.dispatchEvent(new CustomEvent('grimorio:difficultychange', { detail: { difficulty } }));
}

function initDifficultyUI() {
  const current = getDifficulty();

  document.querySelectorAll('[data-difficulty]').forEach((element) => {
    if (element.dataset.difficulty === current) element.classList.add('is-selected');
    element.addEventListener('click', () => {
      setDifficulty(element.dataset.difficulty);
      document.querySelectorAll('[data-difficulty]').forEach((other) => {
        other.classList.toggle('is-selected', other.dataset.difficulty === element.dataset.difficulty);
      });
    });
  });

  const status = document.getElementById('difficultyStatus');
  if (status) {
    status.textContent = `Nivel actual: ${DIFFICULTY_LABELS[current]}.`;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDifficultyUI);
} else {
  initDifficultyUI();
}
