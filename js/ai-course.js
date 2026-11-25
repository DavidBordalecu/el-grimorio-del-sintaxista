/** Renderizador del curso de desarrollo con IA: comprueba criterios, no salidas de consola. */
import { LESSONS } from './data/aiLessons.js';
import * as state from './engine/aiState.js';

const elements = {
  container: document.getElementById('lessonsContainer'),
  xp: document.getElementById('courseXp'),
  level: document.getElementById('courseLevel'),
  count: document.getElementById('courseCount'),
  bar: document.getElementById('courseBar'),
  inventory: document.getElementById('aiInventory'),
  reset: document.getElementById('resetAiBtn')
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
    else reject(new Error('No se pudo copiar.'));
  });
}

// Devuelve los criterios incumplidos para no entregar la respuesta, solo la rubrica.
function evaluateAnswer(lesson, value) {
  const rules = lesson.answer;
  const text = String(value || '').trim();
  const words = text ? text.split(/\s+/).length : 0;
  const failures = [];

  if (words < rules.minWords) {
    failures.push(`Desarrollá un poco más: al menos ${rules.minWords} palabras.`);
  }

  (rules.required || []).forEach((rule) => {
    if (!new RegExp(rule.pattern, 'i').test(text)) failures.push(`Falta ${rule.label}.`);
  });

  (rules.anyOf || []).forEach((group) => {
    const passed = (group.patterns || []).some((pattern) => new RegExp(pattern, 'i').test(text));
    if (!passed) failures.push(group.label);
  });

  (rules.forbidden || []).forEach((rule) => {
    if (new RegExp(rule.pattern, 'i').test(text)) failures.push(rule.reason);
  });

  return { ok: failures.length === 0, failures };
}

function updateProgress() {
  const current = state.getState();
  elements.xp.textContent = current.xp;
  elements.level.textContent = state.getLevel();
  elements.count.textContent = `${current.completed.length} / ${LESSONS.length}`;
  elements.bar.style.width = `${Math.round((current.completed.length / LESSONS.length) * 100)}%`;

  elements.inventory.replaceChildren();
  if (!current.inventory.length) {
    elements.inventory.appendChild(create('p', 'inventory-empty', 'Todavía no hay hechizos desbloqueados.'));
    return;
  }
  current.inventory.forEach((item) => elements.inventory.appendChild(create('li', '', item)));
}

function showSolved(article, lesson, feedback, input, checkButton, hintButton) {
  article.classList.add('is-done');
  setRichText(feedback, `Sello roto. +${lesson.xp} XP · ${lesson.item}. ${lesson.answer.success}`);
  feedback.dataset.tone = 'success';
  input.disabled = true;
  checkButton.hidden = true;
  if (hintButton) hintButton.disabled = true;
  const next = article.querySelector('.lesson-next');
  if (next) next.hidden = false;
  updateProgress();
}

function buildLesson(lesson, index) {
  const previous = LESSONS[index - 1];
  const locked = Boolean(previous && !state.isCompleted(previous.id));
  const done = state.isCompleted(lesson.id);

  const article = create('article', 'lesson');
  article.id = lesson.id;
  if (locked) article.classList.add('is-locked');
  if (done) article.classList.add('is-done');

  const header = create('header', 'lesson-header');
  header.appendChild(create('p', 'lesson-act', lesson.act));
  header.appendChild(create('h3', '', lesson.title));
  article.appendChild(header);

  const narrative = create('p', 'lesson-narrative');
  setRichText(narrative, lesson.narrative);
  article.appendChild(narrative);

  article.appendChild(create('p', 'theory-label', 'La teoría detrás del conjuro'));
  const concept = create('p', 'lesson-concept');
  setRichText(concept, lesson.concept);
  article.appendChild(concept);

  const task = create('p', 'lesson-question');
  setRichText(task, lesson.task);
  article.appendChild(task);

  const starter = create('div', 'starter-block');
  starter.appendChild(create('p', 'starter-label', 'Plantilla para completar'));
  const pre = create('pre', 'code-sample');
  pre.appendChild(create('code', '', lesson.starter));
  starter.appendChild(pre);

  const copyButton = create('button', 'button button-secondary copy-starter', 'Copiar plantilla');
  copyButton.type = 'button';
  copyButton.disabled = locked || done;
  copyButton.addEventListener('click', async () => {
    try {
      await copyText(lesson.starter);
      copyButton.textContent = 'Copiado ✓';
      window.setTimeout(() => {
        copyButton.textContent = 'Copiar plantilla';
      }, 1600);
    } catch (error) {
      copyButton.textContent = 'Copiá la plantilla manualmente';
    }
  });
  starter.appendChild(copyButton);
  article.appendChild(starter);

  const checklist = create('div', 'answer-checklist');
  checklist.appendChild(create('p', 'starter-label', 'Tu respuesta debe cubrir'));
  const list = create('ul', 'ai-checklist');
  lesson.checklist.forEach((item) => {
    const li = create('li');
    setRichText(li, item);
    list.appendChild(li);
  });
  checklist.appendChild(list);
  article.appendChild(checklist);

  const hintList = create('ul', 'hint-list');
  const hints = (lesson.hints || []).map((hint) => {
    const li = create('li', 'hint-item');
    li.hidden = true;
    const text = create('span');
    setRichText(text, hint);
    li.appendChild(text);
    hintList.appendChild(li);
    return li;
  });

  const hintButton = create('button', 'button button-secondary hint-button', 'Pedir pista');
  hintButton.type = 'button';
  hintButton.disabled = locked || done || !hints.length;
  let revealedHints = 0;

  function showHints(count) {
    hints.forEach((item, position) => {
      item.hidden = position >= count;
    });
    hintButton.textContent = count >= hints.length
      ? 'No quedan más pistas'
      : `Pedir pista (${count + 1} / ${hints.length})`;
    hintButton.disabled = done || count >= hints.length;
  }

  hintButton.addEventListener('click', () => {
    revealedHints += 1;
    showHints(revealedHints);
  });
  showHints(0);

  const help = create('div', 'run-hints');
  help.appendChild(hintButton);
  help.appendChild(hintList);
  article.appendChild(help);

  const input = document.createElement('textarea');
  input.className = 'output-input ai-answer';
  input.rows = 7;
  input.spellcheck = false;
  input.placeholder = 'Escribí acá tu prompt, tu consulta o tu checklist...';
  input.disabled = locked || done;

  const checkButton = create('button', 'button button-primary check-output', 'Comprobar respuesta');
  checkButton.type = 'button';
  checkButton.disabled = locked || done;

  const feedback = create('p', 'lesson-feedback');
  const actions = create('div', 'output-check');
  actions.append(input, checkButton, feedback);

  if (locked) {
    copyButton.hidden = true;
    checklist.hidden = true;
    help.hidden = true;
    input.hidden = true;
    checkButton.hidden = true;
    feedback.textContent = 'Esta página está sellada. Completá la lección anterior para abrirla.';
    feedback.dataset.tone = 'locked';
  }

  if (done) {
    feedback.textContent = `Sello ya roto. ${lesson.item} adquirido.`;
    feedback.dataset.tone = 'success';
  }

  checkButton.addEventListener('click', () => {
    if (!input.value.trim()) {
      feedback.textContent = 'Primero escribí tu respuesta.';
      feedback.dataset.tone = 'warn';
      return;
    }

    const result = evaluateAnswer(lesson, input.value);
    if (!result.ok) {
      const detail = [...new Set(result.failures)].join(' ');
      setRichText(feedback, `Todavía no cubrís la rubrica. ${detail}`);
      feedback.dataset.tone = 'warn';
      return;
    }

    state.completeLesson(lesson);
    showSolved(article, lesson, feedback, input, checkButton, hintButton);
  });

  article.appendChild(actions);

  if (index < LESSONS.length - 1) {
    const next = create('button', 'button button-secondary lesson-next', 'Siguiente lección →');
    next.type = 'button';
    next.hidden = !done;
    next.addEventListener('click', () => {
      render();
      const target = document.getElementById(LESSONS[index + 1].id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    article.appendChild(next);
  }

  return article;
}

function render() {
  elements.container.replaceChildren();
  LESSONS.forEach((lesson, index) => elements.container.appendChild(buildLesson(lesson, index)));
  updateProgress();
}

render();

elements.reset.addEventListener('click', () => {
  if (!window.confirm('¿Borrar el progreso del curso de IA?')) return;
  state.resetCourse();
  render();
});
