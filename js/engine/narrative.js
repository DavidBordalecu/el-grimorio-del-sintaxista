import { SCENES, getScene, getSceneIndex } from '../data/story.js';
import {
  clearDraft,
  completeScene,
  getDraft,
  getLevel,
  getState,
  isCompleted,
  saveDraft
} from './state.js';

const ERROR_LORE = {
  SyntaxError: 'La sintaxis del conjuro está torcida: revisá comillas, llaves y paréntesis.',
  ReferenceError: 'Un símbolo invocado no existe en este plano: ¿declaraste la variable antes de usarla?',
  TypeError: 'El hechizo intentó usar un valor de una manera imposible para su naturaleza.',
  RangeError: 'La magnitud del conjuro excede los límites de la crónica.',
  TimeoutError: 'Un bucle temporal infinito devoró el hilo: el guardián lo cortó a tiempo.',
  WorkerError: 'El hilo arcano no pudo ser invocado. ¿Estás sirviendo el proyecto por HTTP?'
};

let elements = {};
let currentScene = SCENES[0];

function stripTags(html) {
  return String(html || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function updateGutter() {
  const count = elements.editor.value.split('\n').length;
  let numbers = '';
  for (let line = 1; line <= count; line += 1) {
    numbers += `${line}${line < count ? '\n' : ''}`;
  }
  elements.gutter.textContent = numbers;
  elements.gutter.scrollTop = elements.editor.scrollTop;
}

function bindEditor() {
  elements.editor.addEventListener('input', () => {
    updateGutter();
    saveDraft(currentScene.id, elements.editor.value);
  });

  elements.editor.addEventListener('scroll', () => {
    elements.gutter.scrollTop = elements.editor.scrollTop;
  });

  elements.editor.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    const start = elements.editor.selectionStart;
    const end = elements.editor.selectionEnd;
    elements.editor.setRangeText('  ', start, end, 'end');
    updateGutter();
    saveDraft(currentScene.id, elements.editor.value);
  });
}

function bindInventory() {
  const open = () => {
    renderInventory();
    elements.overlay.hidden = false;
    elements.drawer.classList.add('is-open');
    elements.drawer.setAttribute('aria-hidden', 'false');
    elements.inventoryBtn.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    elements.overlay.hidden = true;
    elements.drawer.classList.remove('is-open');
    elements.drawer.setAttribute('aria-hidden', 'true');
    elements.inventoryBtn.setAttribute('aria-expanded', 'false');
  };

  elements.inventoryBtn.addEventListener('click', open);
  elements.closeInventoryBtn.addEventListener('click', close);
  elements.overlay.addEventListener('click', close);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && elements.drawer.classList.contains('is-open')) close();
  });
}

export function initNarrative() {
  const ids = {
    actLabel: 'actLabel',
    energyValue: 'energyValue',
    levelValue: 'levelValue',
    xpValue: 'xpValue',
    progressLabel: 'progressLabel',
    sceneTitle: 'sceneTitle',
    sceneNarrative: 'sceneNarrative',
    sceneTheory: 'sceneTheory',
    sceneObjective: 'sceneObjective',
    editor: 'codeEditor',
    gutter: 'lineNumbers',
    consoleOutput: 'consoleOutput',
    resultBanner: 'resultBanner',
    inventoryBtn: 'inventoryBtn',
    inventoryCount: 'inventoryCount',
    inventoryOverlay: 'inventoryOverlay',
    inventoryDrawer: 'inventoryDrawer',
    closeInventoryBtn: 'closeInventoryBtn',
    inventoryList: 'inventoryList'
  };

  elements = Object.fromEntries(
    Object.entries(ids).map(([key, id]) => [key, document.getElementById(id)])
  );

  elements.overlay = elements.inventoryOverlay;
  elements.drawer = elements.inventoryDrawer;

  bindEditor();
  bindInventory();
}

export function renderScene(sceneId) {
  currentScene = getScene(sceneId) || SCENES[0];

  elements.actLabel.textContent = currentScene.act;
  elements.energyValue.textContent = currentScene.energy;
  elements.sceneTitle.textContent = currentScene.title;
  elements.sceneNarrative.innerHTML = currentScene.narrative;
  elements.sceneTheory.innerHTML = currentScene.theory || '';
  elements.sceneObjective.innerHTML = currentScene.objective;

  const draft = getDraft(currentScene.id);
  elements.editor.value = draft === null ? currentScene.initialCode : draft;
  updateGutter();
  elements.editor.scrollTop = 0;
  elements.gutter.scrollTop = 0;

  clearConsole();
  appendConsole(`Página ${getSceneIndex(currentScene.id) + 1} abierta. Escribí tu conjuro y pulsá Invocar.`, 'system');
  hideResult();
  renderStatus();
}

export function renderStatus() {
  const state = getState();
  const index = getSceneIndex(state.sceneId);
  elements.levelValue.textContent = getLevel();
  elements.xpValue.textContent = state.xp;
  elements.progressLabel.textContent = `${index + 1} / ${SCENES.length}`;
  elements.inventoryCount.textContent = state.inventory.length;
}

export function renderInventory() {
  elements.inventoryList.replaceChildren();

  for (const scene of SCENES) {
    const unlocked = isCompleted(scene.id);
    const item = document.createElement('article');
    item.className = unlocked ? 'inventory-item is-unlocked' : 'inventory-item';

    const title = document.createElement('h3');
    title.textContent = unlocked ? scene.rewards.item : 'Hechizo sellado';

    const description = document.createElement('p');
    description.textContent = unlocked
      ? scene.rewards.description
      : `Superá «${scene.title}» para desbloquear este concepto.`;

    const meta = document.createElement('p');
    meta.className = 'item-meta';
    meta.textContent = `${scene.act} · +${scene.rewards.xp} XP`;

    item.append(title, description, meta);
    elements.inventoryList.appendChild(item);
  }
}

export function appendConsole(text, kind = 'log') {
  const line = document.createElement('div');
  line.className = 'console-line';
  line.dataset.kind = kind;
  line.textContent = text;
  elements.consoleOutput.appendChild(line);
  elements.consoleOutput.scrollTop = elements.consoleOutput.scrollHeight;
}

export function clearConsole() {
  elements.consoleOutput.replaceChildren();
}

export function hideResult() {
  elements.resultBanner.hidden = true;
  elements.resultBanner.removeAttribute('data-tone');
  elements.resultBanner.textContent = '';
}

function showResult(text, tone) {
  elements.resultBanner.textContent = text;
  elements.resultBanner.dataset.tone = tone;
  elements.resultBanner.hidden = false;
}

function describeError(error) {
  const name = (error && error.name) || 'Error';
  const message = (error && error.message) || 'Error desconocido.';
  const lore = ERROR_LORE[name] || 'El conjuro tropezó con una contradicción invisible.';
  return `${name}: ${message}\n${lore}`;
}

/** Devuelve true cuando la escena fue superada. */
export function renderRunResult(result, scene) {
  (result.logs || []).forEach((log) => appendConsole(log, 'log'));

  if (result.timedOut || !result.ok) {
    const text = describeError(result.error);
    appendConsole(text, 'error');
    showResult(stripTags(text), 'error');
    return false;
  }

  if (result.failedRule) {
    const message = stripTags(result.failedRule);
    appendConsole(`El sello no cede. ${message}`, 'warn');
    showResult(`El sello no cede. ${message}`, 'error');
    return false;
  }

  if (!result.passed) {
    const message = `El conjuro se ejecutó, pero no cumple el objetivo: ${stripTags(scene.objective)}`;
    appendConsole(message, 'warn');
    showResult(message, 'error');
    return false;
  }

  const firstTime = completeScene(scene);
  const rewardText = firstTime
    ? `Sello roto. +${scene.rewards.xp} XP · ${scene.rewards.item}`
    : `Sello ya roto. El conjuro vuelve a funcionar.`;
  appendConsole(rewardText, 'success');
  showResult(
    scene.nextScene
      ? `${rewardText} La crónica espera en la siguiente página.`
      : `${rewardText} Has completado el MVP. El grimorio está completo.`,
    'success'
  );
  renderStatus();
  renderInventory();
  return true;
}

export function getCode() {
  return elements.editor.value;
}

export function resetCode() {
  elements.editor.value = currentScene.initialCode;
  clearDraft(currentScene.id);
  updateGutter();
  elements.editor.scrollTop = 0;
  elements.gutter.scrollTop = 0;
  elements.editor.focus();
}

export function focusEditor() {
  elements.editor.focus();
}
