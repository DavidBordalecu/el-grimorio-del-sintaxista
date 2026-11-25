/** Estado genérico para los cursos de opción múltiple (Python, Rust, Ruby). */
export function createQuizState(storageKey, lessons) {
  const validIds = lessons.map((lesson) => lesson.id);

  function defaultState() {
    return { completed: [], xp: 0, inventory: [] };
  }

  function normalize(raw) {
    const base = defaultState();
    if (!raw || typeof raw !== 'object') return base;
    return {
      completed: Array.isArray(raw.completed)
        ? raw.completed.filter((id) => validIds.includes(id))
        : [],
      xp: Number.isFinite(raw.xp) && raw.xp >= 0 ? raw.xp : 0,
      inventory: Array.isArray(raw.inventory)
        ? raw.inventory.filter((item) => typeof item === 'string')
        : []
    };
  }

  function load() {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? normalize(JSON.parse(stored)) : defaultState();
    } catch (error) {
      console.warn(`No se pudo leer el progreso de ${storageKey}:`, error);
      return defaultState();
    }
  }

  const state = load();

  function persist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn(`No se pudo guardar el progreso de ${storageKey}:`, error);
    }
  }

  return {
    getState: () => state,
    isCompleted: (lessonId) => state.completed.includes(lessonId),
    completeLesson(lesson) {
      if (!lesson || state.completed.includes(lesson.id)) return false;
      state.completed.push(lesson.id);
      state.xp += lesson.xp;
      if (!state.inventory.includes(lesson.item)) state.inventory.push(lesson.item);
      persist();
      return true;
    },
    getLevel: () => Math.floor(state.xp / 100) + 1,
    resetCourse() {
      Object.assign(state, defaultState());
      persist();
    }
  };
}
