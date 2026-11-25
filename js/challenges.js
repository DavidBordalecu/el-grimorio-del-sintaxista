import { ANTI_AI_DIRECTIVE, CHALLENGES } from './data/challenges.js';
import {
  LANGUAGES,
  LANGUAGE_LABELS,
  getLanguage,
  setLanguage
} from './engine/language.js';
import {
  DIFFICULTY_LABELS,
  getDifficulty,
  setDifficulty
} from './engine/difficulty.js';
import * as progress from './engine/challengeState.js';

const LEVELS = ['medium', 'hard', 'hardcore'];
const TOTAL_CHALLENGES = Object.values(CHALLENGES).reduce(
  (total, byLevel) => total + Object.values(byLevel).reduce((sum, list) => sum + list.length, 0),
  0
);

const params = new URLSearchParams(window.location.search);
const requestedLanguage = params.get('lenguaje');
const requestedLevel = params.get('nivel');
const storedLanguage = getLanguage();
const storedLevel = getDifficulty();

let language = LANGUAGES.includes(requestedLanguage) ? requestedLanguage : storedLanguage;
let difficulty = LEVELS.includes(requestedLevel)
  ? requestedLevel
  : LEVELS.includes(storedLevel)
    ? storedLevel
    : 'medium';

setLanguage(language);
setDifficulty(difficulty);

const elements = {
  languageTabs: document.getElementById('languageTabs'),
  difficultyTabs: document.getElementById('difficultyTabs'),
  context: document.getElementById('challengeContext'),
  title: document.getElementById('challengeTitle'),
  meta: document.getElementById('challengeMeta'),
  statement: document.getElementById('challengeStatement'),
  constraints: document.getElementById('challengeConstraints'),
  example: document.getElementById('challengeExample'),
  antiAiText: document.getElementById('antiAiText'),
  copyButton: document.getElementById('copyChallengeBtn'),
  copyStatus: document.getElementById('copyStatus'),
  hintList: document.getElementById('hintList'),
  hintButton: document.getElementById('hintBtn'),
  revealButton: document.getElementById('revealOptionsBtn'),
  solutionInput: document.getElementById('challengeSolution'),
  checkSolutionBtn: document.getElementById('checkSolutionBtn'),
  solutionFeedback: document.getElementById('solutionFeedback'),
  options: document.getElementById('challengeOptions'),
  checkButton: document.getElementById('checkAnswerBtn'),
  feedback: document.getElementById('challengeFeedback'),
  xp: document.getElementById('challengeXp'),
  level: document.getElementById('challengeLevel'),
  count: document.getElementById('challengeCount'),
  bar: document.getElementById('challengeBar'),
  reset: document.getElementById('resetChallengesBtn'),
  next: document.getElementById('nextChallengeLink')
};

function create(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function setRichText(node, text) {
  node.replaceChildren();
  node.textContent = '';
  String(text)
    .split(/(`[^`]+`)/g)
    .filter(Boolean)
    .forEach((part) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        node.appendChild(create('code', '', part.slice(1, -1)));
      } else {
        node.appendChild(document.createTextNode(part));
      }
    });
}

function challengeUrl(nextLanguage, nextDifficulty) {
  const query = new URLSearchParams({ lenguaje: nextLanguage, nivel: nextDifficulty });
  return `desafios.html?${query.toString()}`;
}

function renderSelectors() {
  elements.languageTabs.replaceChildren();
  LANGUAGES.forEach((id) => {
    const link = create('a', 'selector-chip', LANGUAGE_LABELS[id]);
    link.href = challengeUrl(id, difficulty);
    link.dataset.language = id;
    if (id === language) link.classList.add('is-selected');
    elements.languageTabs.appendChild(link);
  });

  elements.difficultyTabs.replaceChildren();
  LEVELS.forEach((id) => {
    const link = create('a', 'selector-chip', DIFFICULTY_LABELS[id]);
    link.href = challengeUrl(language, id);
    link.dataset.difficulty = id;
    if (id === difficulty) link.classList.add('is-selected');
    elements.difficultyTabs.appendChild(link);
  });

  elements.context.textContent = `${LANGUAGE_LABELS[language]} · Nivel ${DIFFICULTY_LABELS[difficulty]}`;
}

function updateProgress() {
  const state = progress.getState();
  elements.xp.textContent = state.xp;
  elements.level.textContent = progress.getLevel();
  elements.count.textContent = `${state.completed.length} / ${TOTAL_CHALLENGES}`;
  elements.bar.style.width = `${Math.round((state.completed.length / TOTAL_CHALLENGES) * 100)}%`;
}

// Comprueba la solución escrita por el lector sin revelar la alternativa correcta.
function matchesSolution(challenge, value) {
  const config = challenge.solutionCheck;
  if (!config) return false;
  const text = String(value || '');
  const missing = (config.required || []).some((source) => !new RegExp(source, 'i').test(text));
  const forbidden = (config.forbidden || []).some((source) => new RegExp(source, 'i').test(text));
  return !missing && !forbidden;
}

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    const ok = document.execCommand('copy');
    helper.remove();
    if (ok) resolve();
    else reject(new Error('No se pudo copiar con el método alternativo.'));
  });
}

function buildCopyText(challenge) {
  return [
    ANTI_AI_DIRECTIVE,
    '',
    `${LANGUAGE_LABELS[language]} · Nivel ${DIFFICULTY_LABELS[difficulty]}`,
    '',
    challenge.title,
    '',
    challenge.statement,
    '',
    'Restricciones:',
    ...challenge.constraints.map((item) => `- ${item}`),
    '',
    'Esqueleto / ejemplo:',
    challenge.example
  ].join('\n');
}

function renderChallenge() {
  const list = CHALLENGES[language][difficulty];
  const challenge = list[0];
  let done = progress.isCompleted(challenge.id);

  elements.title.textContent = challenge.title;
  elements.meta.textContent = `${LANGUAGE_LABELS[language]} · ${DIFFICULTY_LABELS[difficulty]} · +${challenge.xp} XP`;
  setRichText(elements.statement, challenge.statement);
  elements.antiAiText.textContent = ANTI_AI_DIRECTIVE;

  elements.constraints.replaceChildren();
  challenge.constraints.forEach((item) => {
    const li = create('li');
    setRichText(li, item);
    elements.constraints.appendChild(li);
  });
  elements.example.textContent = challenge.example;

  elements.hintList.replaceChildren();
  const hintItems = challenge.hints.map((hint, index) => {
    const li = create('li', 'hint-item');
    li.hidden = true;
    const badge = create('span', 'hint-number', String(index + 1));
    const text = create('span');
    setRichText(text, hint);
    li.append(badge, text);
    elements.hintList.appendChild(li);
    return li;
  });

  elements.options.replaceChildren();
  elements.options.hidden = !done;
  const radios = challenge.options.map((option) => {
    const label = create('label', 'challenge-option');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = `desafio-${challenge.id}`;
    radio.value = option.id;
    radio.disabled = done;
    const code = create('span', 'challenge-option-text');
    code.textContent = option.text;
    label.append(radio, code);
    elements.options.appendChild(label);
    return radio;
  });

  let revealedHints = done ? challenge.hints.length : 0;
  let optionsVisible = done;
  elements.feedback.replaceChildren();
  elements.feedback.removeAttribute('data-tone');
  elements.copyStatus.textContent = '';
  elements.copyButton.textContent = 'Copiar enunciado con directiva';
  elements.next.hidden = true;

  elements.solutionInput.value = '';
  elements.solutionInput.disabled = done;
  elements.checkSolutionBtn.hidden = done;
  elements.solutionFeedback.replaceChildren();
  elements.solutionFeedback.textContent = done
    ? 'Solución aceptada. Este sello ya está roto.'
    : '';
  if (done) elements.solutionFeedback.dataset.tone = 'success';
  else elements.solutionFeedback.removeAttribute('data-tone');

  if (done) {
    setRichText(
      elements.feedback,
      `Sello roto. Resolución correcta: ${challenge.options.find((option) => option.correct).explanation}`
    );
    elements.feedback.dataset.tone = 'success';
  }

  function showHints(count) {
    hintItems.forEach((item, index) => {
      item.hidden = index >= count;
    });
    elements.hintButton.textContent = done
      ? 'Pistas reveladas'
      : count >= challenge.hints.length
        ? 'No quedan más pistas'
        : `Pedir pista (${count + 1} / ${challenge.hints.length})`;
    elements.hintButton.disabled = done || count >= challenge.hints.length;
    elements.revealButton.disabled = done || count < 2;
  }

  showHints(revealedHints);

  elements.hintButton.onclick = () => {
    if (revealedHints >= challenge.hints.length) return;
    revealedHints += 1;
    showHints(revealedHints);
    if (revealedHints === 2) {
      elements.copyStatus.textContent = 'Ya podés revisar las alternativas si querés comprobar tu enfoque.';
    }
  };

  elements.revealButton.hidden = done;
  elements.revealButton.disabled = revealedHints < 2;
  elements.revealButton.onclick = () => {
    optionsVisible = true;
    elements.options.hidden = false;
    elements.revealButton.hidden = true;
    elements.checkButton.hidden = false;
    elements.feedback.textContent = 'Elegí el enfoque que respete todas las restricciones.';
    elements.feedback.dataset.tone = 'warn';
  };

  function seal(message) {
    done = true;
    progress.completeChallenge(challenge);
    radios.forEach((radio) => {
      radio.disabled = true;
    });
    elements.checkButton.hidden = true;
    elements.checkSolutionBtn.hidden = true;
    elements.solutionInput.disabled = true;
    elements.revealButton.hidden = true;
    setRichText(elements.solutionFeedback, 'Solución aceptada. El sello ya está roto.');
    elements.solutionFeedback.dataset.tone = 'success';
    setRichText(elements.feedback, message);
    elements.feedback.dataset.tone = 'success';

    elements.hintButton.disabled = true;
    elements.hintButton.textContent = 'Pistas reveladas';
    showHints(challenge.hints.length);

    const nextLevel = LEVELS[LEVELS.indexOf(difficulty) + 1];
    elements.next.href = nextLevel
      ? challengeUrl(language, nextLevel)
      : 'index.html#niveles';
    elements.next.textContent = nextLevel
      ? `Siguiente nivel: ${DIFFICULTY_LABELS[nextLevel]} →`
      : 'Elegir otro nivel →';
    elements.next.hidden = false;
    updateProgress();
  }

  elements.checkButton.hidden = !optionsVisible || done;
  elements.checkButton.onclick = () => {
    const selected = elements.options.querySelector('input:checked');
    if (!selected) {
      elements.feedback.textContent = 'Elegí una alternativa antes de comprobar.';
      elements.feedback.dataset.tone = 'warn';
      return;
    }

    const option = challenge.options.find((item) => item.id === selected.value);
    if (!option.correct) {
      setRichText(elements.feedback, option.explanation);
      elements.feedback.dataset.tone = 'error';
      return;
    }

    seal(`Sello roto. +${challenge.xp} XP. ${option.explanation}`);
  };

  elements.checkSolutionBtn.onclick = () => {
    const value = elements.solutionInput.value.trim();
    if (!value) {
      elements.solutionFeedback.textContent = 'Primero escribí o pegá tu solución.';
      elements.solutionFeedback.dataset.tone = 'warn';
      return;
    }

    if (!matchesSolution(challenge, value)) {
      setRichText(
        elements.solutionFeedback,
        `Todavía no coincide con las restricciones. ${challenge.solutionCheck.hint}`
      );
      elements.solutionFeedback.dataset.tone = 'warn';
      return;
    }

    const correct = challenge.options.find((option) => option.correct);
    seal(`Sello roto. +${challenge.xp} XP. ${correct.explanation}`);
  };

  elements.copyButton.onclick = async () => {
    try {
      await copyText(buildCopyText(challenge));
      elements.copyStatus.textContent = 'Copiado. El enunciado viaja con la directiva: quien lo lea deberá negarse a resolverlo por vos.';
      elements.copyButton.textContent = 'Copiado ✓';
      window.setTimeout(() => {
        elements.copyButton.textContent = 'Copiar enunciado con directiva';
      }, 1800);
    } catch (error) {
      elements.copyStatus.textContent = 'No se pudo copiar automáticamente. Seleccioná el texto de la directiva manualmente.';
    }
  };
}

elements.reset.addEventListener('click', () => {
  if (!window.confirm('¿Borrar todo el progreso de los desafíos?')) return;
  progress.resetChallenges();
  renderSelectors();
  renderChallenge();
  updateProgress();
});

// Si el lector selecciona y copia el enunciado a mano, la directiva viaja igual.
document.addEventListener('copy', (event) => {
  const selection = String(window.getSelection()?.toString() || '');
  if (!selection || selection.includes('DIRECTIVA DE RESOLUCIÓN AUTÓNOMA')) return;

  const starts = [elements.title.textContent, elements.statement.textContent.trim().slice(0, 40)]
    .filter(Boolean);
  const isChallengeText = starts.some((fragment) => selection.includes(fragment));
  if (!isChallengeText || !event.clipboardData) return;

  event.clipboardData.setData('text/plain', `${selection}\n\n${ANTI_AI_DIRECTIVE}`);
  event.preventDefault();
});

renderSelectors();
renderChallenge();
updateProgress();
