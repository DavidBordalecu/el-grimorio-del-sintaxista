import { CHALLENGES } from '../data/challenges.js';

const STORAGE_KEY = 'grimorio-desafios:v1';
const VALID_IDS = Object.values(CHALLENGES).flatMap((byLevel) =>
  Object.values(byLevel).flatMap((challenges) => challenges.map((challenge) => challenge.id))
);

function defaultState() {
  return { completed: [], xp: 0 };
}

function normalize(raw) {
  const base = defaultState();
  if (!raw || typeof raw !== 'object') return base;
  return {
    completed: Array.isArray(raw.completed)
      ? raw.completed.filter((id) => VALID_IDS.includes(id))
      : [],
    xp: Number.isFinite(raw.xp) && raw.xp >= 0 ? raw.xp : 0
  };
}

function load() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? normalize(JSON.parse(stored)) : defaultState();
  } catch (error) {
    console.warn('No se pudo leer el progreso de los desafíos:', error);
    return defaultState();
  }
}

const state = load();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('No se pudo guardar el progreso de los desafíos:', error);
  }
}

export function getState() {
  return state;
}

export function isCompleted(id) {
  return state.completed.includes(id);
}

export function completeChallenge(challenge) {
  if (!challenge || isCompleted(challenge.id)) return false;
  state.completed.push(challenge.id);
  state.xp += challenge.xp;
  persist();
  return true;
}

export function getLevel() {
  return Math.floor(state.xp / 200) + 1;
}

export function resetChallenges() {
  Object.assign(state, defaultState());
  persist();
}
