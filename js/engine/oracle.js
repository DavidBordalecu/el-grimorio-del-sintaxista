const DIRECT_REQUESTS = [
  /\b(dame|pasame|escribi|escribe|hace|haz|resuelve|copia|arma|armá)\b.*\b(codigo|respuesta|solucion|conjuro)\b/,
  /\b(codigo|respuesta|solucion)\b.*\b(dame|directo|completo|listo|hecho)\b/,
  /\b(cual|que)\s+(es|seria)\s+(la\s+)?(respuesta|solucion|codigo)\b/,
  /\b(hazlo|hacelo|resuelvelo|sin explicar|no me expliques)\b/,
  /^(dame|escribe|resuelve|copia)\b/
];

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Tutor socrático simulado: evalúa cómo está redactada la consulta, rechaza
 * pedidos de respuesta directa y devuelve pistas por palabras clave de la escena.
 */
export function consultOracle(question, scene) {
  const text = normalize(question);

  if (!text) {
    return {
      tone: 'socratica',
      text: 'El espíritu espera. «Una pregunta vacía no abre ninguna senda: formulá una duda concreta.»'
    };
  }

  if (text.length < 10) {
    return {
      tone: 'socratica',
      text: 'El espíritu inclina la cabeza. «Demasiado breve. Contame qué estás intentando resolver y qué concepto sospechás que necesitás.»'
    };
  }

  if (DIRECT_REQUESTS.some((pattern) => pattern.test(text))) {
    return {
      tone: 'rechazo',
      text: 'La llama se apaga un instante. «No entrego conjuros terminados; explicá qué parte no entendés y te daré una pista para escribirlo vos.»'
    };
  }

  const hints = (scene && scene.oracleHints) || [];
  const match = hints.find((hint) => text.includes(normalize(hint.keyword)) && hint.keyword !== 'respuesta');
  if (match) {
    return { tone: 'pista', text: match.response };
  }

  if (hints.some((hint) => hint.keyword === 'respuesta' && text.includes('respuesta'))) {
    return {
      tone: 'rechazo',
      text: 'El espíritu niega con la cabeza. «Pide guía sobre el concepto, no el conjuro hecho.»'
    };
  }

  const topics = hints
    .map((hint) => hint.keyword)
    .filter((keyword) => keyword !== 'respuesta')
    .slice(0, 3)
    .join(', ');

  return {
    tone: 'socratica',
    text: `El espíritu murmura: «Reformulá tu pregunta alrededor de lo que ya sabés. Podrías explorar: ${topics || 'el objetivo de la escena'}.»`
  };
}
