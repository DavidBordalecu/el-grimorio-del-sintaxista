import { LANGUAGES, LANGUAGE_LABELS } from './language.js';
import { DIFFICULTY_LABELS } from './difficulty.js';

const COURSE_PAGES = {
  javascript: 'juego.html',
  python: 'python.html',
  rust: 'rust.html',
  ruby: 'ruby.html'
};
const LEVELS = ['beginner', 'medium', 'hard', 'hardcore'];

const elements = {
  status: document.getElementById('selectionStatus'),
  start: document.getElementById('startGameBtn')
};

let selectedLanguage = null;
let selectedDifficulty = null;

function buildUrl(language, difficulty) {
  if (difficulty === 'beginner') return COURSE_PAGES[language];
  const query = new URLSearchParams({ lenguaje: language, nivel: difficulty });
  return `desafios.html?${query.toString()}`;
}

function markCards(selector, key, value) {
  document.querySelectorAll(selector).forEach((card) => {
    const active = card.dataset[key] === value;
    card.classList.toggle('is-selected', active);
    card.setAttribute('aria-pressed', String(active));
  });
}

function update() {
  if (!elements.status || !elements.start) return;

  if (selectedLanguage && selectedDifficulty) {
    elements.status.textContent = `Todo listo: ${LANGUAGE_LABELS[selectedLanguage]} · Nivel ${DIFFICULTY_LABELS[selectedDifficulty]}.`;
    elements.start.href = buildUrl(selectedLanguage, selectedDifficulty);
    elements.start.hidden = false;
    return;
  }

  elements.start.hidden = true;
  elements.start.removeAttribute('href');

  if (!selectedLanguage && !selectedDifficulty) {
    elements.status.textContent = 'Elegí un lenguaje y un nivel para abrir la partida.';
  } else if (!selectedLanguage) {
    elements.status.textContent = `Nivel elegido: ${DIFFICULTY_LABELS[selectedDifficulty]}. Ahora elegí un lenguaje.`;
  } else {
    elements.status.textContent = `Lenguaje elegido: ${LANGUAGE_LABELS[selectedLanguage]}. Ahora elegí el nivel.`;
  }
}

function init() {
  document.querySelectorAll('button.language-card[data-language], button.language-card[data-difficulty]').forEach((card) => {
    card.classList.remove('is-selected');
    card.setAttribute('aria-pressed', 'false');
  });

  document.addEventListener('grimorio:languagechange', (event) => {
    const language = event.detail?.language;
    if (!LANGUAGES.includes(language)) return;
    selectedLanguage = language;
    markCards('button.language-card[data-language]', 'language', language);
    update();
  });

  document.addEventListener('grimorio:difficultychange', (event) => {
    const difficulty = event.detail?.difficulty;
    if (!LEVELS.includes(difficulty)) return;
    selectedDifficulty = difficulty;
    markCards('button.language-card[data-difficulty]', 'difficulty', difficulty);
    update();
  });

  update();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
