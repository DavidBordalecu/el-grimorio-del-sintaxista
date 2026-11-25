/** Renderizador de cursos: el alumno ejecuta el código fuera de la app y pega la salida. */
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

function normalizeOutput(value) {
  return String(value)
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/, ''))
    .join('\n')
    .trim();
}

// En listas, Python usa comillas simples y Ruby dobles; ambas son válidas acá.
function equivalentOutput(actual, expected) {
  const canonical = (value) => normalizeOutput(value).replace(/'/g, '"');
  return canonical(actual) === canonical(expected);
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

export function createCodeCourse({ lessons, state, elements }) {
  function updateProgress() {
    const current = state.getState();
    elements.xp.textContent = current.xp;
    elements.level.textContent = state.getLevel();
    elements.count.textContent = `${current.completed.length} / ${lessons.length}`;
    elements.bar.style.width = `${Math.round((current.completed.length / lessons.length) * 100)}%`;

    elements.inventory.replaceChildren();
    if (!current.inventory.length) {
      elements.inventory.appendChild(create('p', 'inventory-empty', 'Todavía no hay hechizos desbloqueados.'));
      return;
    }
    current.inventory.forEach((item) => elements.inventory.appendChild(create('li', '', item)));
  }

  function showSolved(article, lesson, feedback, input, checkButton, hintButton) {
    article.classList.add('is-done');
    setRichText(feedback, `Sello roto. +${lesson.xp} XP · ${lesson.item}.`);
    feedback.dataset.tone = 'success';
    input.disabled = true;
    checkButton.hidden = true;
    if (hintButton) hintButton.disabled = true;
    const next = article.querySelector('.lesson-next');
    if (next) next.hidden = false;
    updateProgress();
  }

  function buildLesson(lesson, index) {
    const previous = lessons[index - 1];
    const locked = Boolean(previous && !state.isCompleted(previous.id));
    const done = state.isCompleted(lesson.id);

    const article = create('article', 'lesson');
    if (locked) article.classList.add('is-locked');
    if (done) article.classList.add('is-done');
    article.id = lesson.id;

    const header = create('header', 'lesson-header');
    header.appendChild(create('p', 'lesson-act', lesson.act));
    header.appendChild(create('h3', '', lesson.title));
    article.appendChild(header);

    const narrative = create('p', 'lesson-narrative');
    setRichText(narrative, lesson.narrative);
    article.appendChild(narrative);

    const theoryLabel = create('p', 'theory-label', 'La teoría detrás de la runa');
    article.appendChild(theoryLabel);

    const concept = create('p', 'lesson-concept');
    setRichText(concept, lesson.concept);
    article.appendChild(concept);

    const instruction = create('p', 'lesson-question');
    setRichText(instruction, lesson.instruction || lesson.question);
    article.appendChild(instruction);

    const starter = create('div', 'starter-block');
    starter.appendChild(create('p', 'starter-label', 'Código inicial · completá los huecos'));
    const pre = create('pre', 'code-sample');
    pre.appendChild(create('code', '', lesson.code));
    starter.appendChild(pre);

    const copyButton = create('button', 'button button-secondary copy-starter', 'Copiar código inicial');
    copyButton.type = 'button';
    copyButton.disabled = locked || done;
    copyButton.addEventListener('click', async () => {
      try {
        await copyText(lesson.code);
        copyButton.textContent = 'Copiado ✓';
        window.setTimeout(() => {
          copyButton.textContent = 'Copiar código inicial';
        }, 1600);
      } catch (error) {
        copyButton.textContent = 'Copiá el código manualmente';
      }
    });
    starter.appendChild(copyButton);
    article.appendChild(starter);

    const expected = create('div', 'result-spec');
    expected.appendChild(create('p', 'result-label', 'La salida debe ser exactamente:'));
    const expectedPre = create('pre', 'expected-output');
    expectedPre.appendChild(create('code', '', lesson.expectedOutput));
    expected.appendChild(expectedPre);
    article.appendChild(expected);

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
    input.className = 'output-input';
    input.rows = 5;
    input.spellcheck = false;
    input.placeholder = 'Pegá acá la salida que mostró tu programa';
    input.disabled = locked || done;

    const checkButton = create('button', 'button button-primary check-output', 'Comprobar resultado');
    checkButton.type = 'button';
    checkButton.disabled = locked || done;

    const feedback = create('p', 'lesson-feedback');
    const actions = create('div', 'output-check');
    actions.append(input, checkButton, feedback);

    if (locked) {
      copyButton.hidden = true;
      expected.hidden = true;
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
        feedback.textContent = 'Primero ejecutá el código y pegá la salida.';
        feedback.dataset.tone = 'warn';
        return;
      }
      if (equivalentOutput(input.value, lesson.expectedOutput)) {
        state.completeLesson(lesson);
        showSolved(article, lesson, feedback, input, checkButton, hintButton);
        return;
      }
      feedback.textContent = 'La salida no coincide. Revisá comillas, espacios y saltos de línea.';
      feedback.dataset.tone = 'error';
    });

    article.appendChild(actions);

    if (index < lessons.length - 1) {
      const next = create('button', 'button button-secondary lesson-next', 'Siguiente lección →');
      next.type = 'button';
      next.hidden = !done;
      next.addEventListener('click', () => {
        render();
        const target = document.getElementById(lessons[index + 1].id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      article.appendChild(next);
    }

    return article;
  }

  function render() {
    elements.container.replaceChildren();
    lessons.forEach((lesson, index) => elements.container.appendChild(buildLesson(lesson, index)));
    updateProgress();
  }

  render();
  elements.reset.addEventListener('click', () => {
    if (!window.confirm('¿Borrar el progreso de este curso?')) return;
    state.resetCourse();
    render();
  });
}
