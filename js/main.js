import { getScene } from './data/story.js';
import { getState, setScene } from './engine/state.js';
import * as narrative from './engine/narrative.js';
import { runCode } from './engine/sandbox.js';
import { consultOracle } from './engine/oracle.js';

const elements = {
  runBtn: document.getElementById('runBtn'),
  resetBtn: document.getElementById('resetBtn'),
  clearConsoleBtn: document.getElementById('clearConsoleBtn'),
  continueBtn: document.getElementById('continueBtn'),
  oracleForm: document.getElementById('oracleForm'),
  oracleInput: document.getElementById('oracleInput'),
  oracleResponse: document.getElementById('oracleResponse')
};

let busy = false;

function currentScene() {
  return getScene(getState().sceneId);
}

async function handleRun() {
  if (busy) return;
  const scene = currentScene();
  if (!scene) return;

  busy = true;
  elements.runBtn.disabled = true;
  elements.runBtn.textContent = 'Invocando…';
  elements.continueBtn.hidden = true;
  narrative.clearConsole();
  narrative.appendConsole('Invocando conjuro en el hilo arcano…', 'system');

  const result = await runCode({
    userCode: narrative.getCode(),
    validationTest: scene.validation.customTest,
    expectedVars: scene.validation.expectedVars,
    sourceRules: scene.validation.sourceRules
  });

  const succeeded = narrative.renderRunResult(result, scene);
  elements.continueBtn.hidden = !(succeeded && scene.nextScene);

  busy = false;
  elements.runBtn.disabled = false;
  elements.runBtn.textContent = 'Invocar Conjuro';
}

function handleReset() {
  narrative.resetCode();
  narrative.clearConsole();
  narrative.appendConsole('Página restaurada a su estado original.', 'system');
  narrative.hideResult();
  elements.continueBtn.hidden = true;
}

function handleContinue() {
  const scene = currentScene();
  if (!scene || !scene.nextScene) return;
  setScene(scene.nextScene);
  narrative.renderScene(scene.nextScene);
  elements.continueBtn.hidden = true;
  narrative.focusEditor();
}

function handleOracle(event) {
  event.preventDefault();
  const scene = currentScene();
  if (!scene) return;
  const answer = consultOracle(elements.oracleInput.value, scene);
  elements.oracleResponse.innerHTML = answer.text;
  elements.oracleResponse.dataset.tone = answer.tone;
  elements.oracleInput.value = '';
}

function bindEvents() {
  elements.runBtn.addEventListener('click', handleRun);
  elements.resetBtn.addEventListener('click', handleReset);
  elements.clearConsoleBtn.addEventListener('click', () => narrative.clearConsole());
  elements.continueBtn.addEventListener('click', handleContinue);
  elements.oracleForm.addEventListener('submit', handleOracle);
}

narrative.initNarrative();
narrative.renderScene(getState().sceneId);
narrative.renderInventory();
bindEvents();
