import { SCENES } from '../data/story.js';

const STORAGE_KEY = 'grimorio-sintaxista:v1';
const listeners = new Set();

function defaultState() {
  return {
    sceneId: SCENES[0].id,
    xp: 0,
    completed: [],
    inventory: [],
    drafts: {}
  };
}

function normalize(raw) {
  const base = defaultState();
  if (!raw || typeof raw !== 'object') return base;

  const sceneId = SCENES.some((scene) => scene.id === raw.sceneId) ? raw.sceneId : base.sceneId;
  const completed = Array.isArray(raw.completed)
    ? raw.completed.filter((id) => SCENES.some((scene) => scene.id === id))
    : [];
  const inventory = Array.isArray(raw.inventory)
    ? raw.inventory.filter((item) => typeof item === 'string')
    : [];
  const drafts = raw.drafts && typeof raw.drafts === 'object' && !Array.isArray(raw.drafts)
    ? Object.fromEntries(
        Object.entries(raw.drafts)
          .filter(([id, code]) => SCENES.some((scene) => scene.id === id) && typeof code === 'string')
      )
    : {};

  return {
    sceneId,
    xp: Number.isFinite(raw.xp) && raw.xp >= 0 ? raw.xp : 0,
    completed,
    inventory,
    drafts
  };
}

function load() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? normalize(JSON.parse(stored)) : defaultState();
  } catch (error) {
    console.warn('No se pudo leer el progreso guardado:', error);
    return defaultState();
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('No se pudo guardar el progreso:', error);
  }
  listeners.forEach((listener) => listener(state));
}

const state = load();

export function getState() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setScene(sceneId) {
  if (!SCENES.some((scene) => scene.id === sceneId)) return;
  state.sceneId = sceneId;
  persist();
}

export function getDraft(sceneId) {
  return Object.prototype.hasOwnProperty.call(state.drafts, sceneId) ? state.drafts[sceneId] : null;
}

export function saveDraft(sceneId, code) {
  state.drafts[sceneId] = String(code);
  persist();
}

export function clearDraft(sceneId) {
  delete state.drafts[sceneId];
  persist();
}

export function completeScene(scene) {
  if (!scene || state.completed.includes(scene.id)) return false;

  state.completed.push(scene.id);
  state.xp += scene.rewards.xp;
  if (!state.inventory.includes(scene.rewards.item)) {
    state.inventory.push(scene.rewards.item);
  }
  persist();
  return true;
}

export function isCompleted(sceneId) {
  return state.completed.includes(sceneId);
}

export function getLevel() {
  return Math.floor(state.xp / 100) + 1;
}

export function resetProgress() {
  const fresh = defaultState();
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, fresh);
  persist();
}
