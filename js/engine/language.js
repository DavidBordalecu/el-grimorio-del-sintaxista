const STORAGE_KEY = 'grimorio-lenguaje:v1';
export const LANGUAGES = ['javascript', 'python', 'rust', 'ruby'];

export const LANGUAGE_LABELS = {
  javascript: 'JavaScript',
  python: 'Python',
  rust: 'Rust',
  ruby: 'Ruby / Rails'
};

export function getLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return LANGUAGES.includes(stored) ? stored : 'javascript';
  } catch (error) {
    return 'javascript';
  }
}

export function setLanguage(language) {
  if (!LANGUAGES.includes(language)) return;
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch (error) {
    console.warn('No se pudo guardar el idioma elegido:', error);
  }
  document.dispatchEvent(new CustomEvent('grimorio:languagechange', { detail: { language } }));
}

function initLanguageUI() {
  const current = getLanguage();

  document.querySelectorAll('[data-language]').forEach((element) => {
    if (element.dataset.language === current) element.classList.add('is-selected');
    element.addEventListener('click', () => {
      setLanguage(element.dataset.language);
      document.querySelectorAll('[data-language]').forEach((other) => {
        other.classList.toggle('is-selected', other.dataset.language === element.dataset.language);
      });
    });
  });

  const status = document.getElementById('languageStatus');
  if (status) {
    status.textContent = `Tu elección actual: ${LANGUAGE_LABELS[current]}. Podés cambiarla cuando quieras.`;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguageUI);
} else {
  initLanguageUI();
}
