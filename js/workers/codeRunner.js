/**
 * Web Worker aislado. Ejecuta el código del jugador, captura console.log y
 * comprueba las reglas de la escena sin acceso al DOM del hilo principal.
 */

function formatArg(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'undefined') return 'undefined';
  if (typeof value === 'function') return `[Function ${value.name || 'anónima'}]`;
  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
}

function makeConsole(logs) {
  const write = (args) => logs.push(args.map(formatArg).join(' '));
  return {
    log: (...args) => write(args),
    info: (...args) => write(args),
    warn: (...args) => write(['[advertencia]', ...args]),
    error: (...args) => write(['[error]', ...args])
  };
}

self.onmessage = (event) => {
  const { id, userCode = '', validationTest = '', expectedVars = {}, sourceRules = [] } = event.data;
  const logs = [];
  let error = null;
  let failedRule = null;
  let passed = false;

  try {
    for (const rule of sourceRules) {
      const regex = new RegExp(rule.pattern);
      if (!regex.test(userCode)) {
        failedRule = rule.message;
        break;
      }
    }

    const checks = [];
    for (const [key, expected] of Object.entries(expectedVars || {})) {
      if (!/^[A-Za-z_$][\w$]*$/.test(key)) continue;
      checks.push(
        `typeof ${key} !== 'undefined' && JSON.stringify(${key}) === ${JSON.stringify(JSON.stringify(expected))}`
      );
    }
    if (validationTest) checks.push(`(${validationTest})`);

    const expression = checks.length ? checks.join(' && ') : 'true';
    const source = `"use strict";\n${userCode}\n;return Boolean(${expression});`;

    // Se bloquean las vías de red y de comunicación del Worker. El modo estricto
    // evita que `this` filtre el global de forma accidental.
    const runner = new Function(
      'console',
      'fetch',
      'XMLHttpRequest',
      'WebSocket',
      'importScripts',
      'postMessage',
      'close',
      'self',
      'window',
      'globalThis',
      source
    );

    passed = Boolean(
      runner(
        makeConsole(logs),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      )
    );
  } catch (caught) {
    error = {
      name: (caught && caught.name) || 'Error',
      message: (caught && caught.message) || String(caught)
    };
  }

  self.postMessage({
    id,
    ok: !error,
    passed: passed && !failedRule && !error,
    logs,
    error,
    failedRule,
    timedOut: false
  });
};
