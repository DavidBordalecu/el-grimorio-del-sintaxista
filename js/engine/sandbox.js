const TIMEOUT_MS = 2000;

/**
 * Envía el conjuro del jugador al Web Worker y garantiza una respuesta máxima
 * en 2000 ms. Si el hilo se cuelga (bucle infinito), se termina de forma limpia.
 */
export function runCode({ userCode, validationTest, expectedVars, sourceRules } = {}) {
  return new Promise((resolve) => {
    let worker;
    try {
      worker = new Worker(new URL('../workers/codeRunner.js', import.meta.url));
    } catch (error) {
      resolve({
        ok: false,
        passed: false,
        logs: [],
        error: { name: 'WorkerError', message: 'No se pudo invocar el hilo arcano.' },
        failedRule: null,
        timedOut: false
      });
      return;
    }

    let settled = false;
    let timer;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      resolve(result);
    };

    timer = setTimeout(() => {
      finish({
        ok: false,
        passed: false,
        logs: [],
        error: { name: 'TimeoutError', message: `El hilo no respondió en ${TIMEOUT_MS} ms.` },
        failedRule: null,
        timedOut: true
      });
    }, TIMEOUT_MS);

    worker.onmessage = (event) => finish(event.data);
    worker.onerror = (event) => {
      finish({
        ok: false,
        passed: false,
        logs: [],
        error: { name: 'WorkerError', message: event.message || 'Error desconocido en el hilo.' },
        failedRule: null,
        timedOut: false
      });
    };

    worker.postMessage({ userCode, validationTest, expectedVars, sourceRules });
  });
}
