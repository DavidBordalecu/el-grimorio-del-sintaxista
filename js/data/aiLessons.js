/**
 * Curso de desarrollo con IA: el alumno redacta prompts, revisiones y flujos de
 * trabajo, y la aplicación comprueba que cubran los criterios de la lección.
 * No ejecuta código ni consulta modelos externos: evalúa el criterio del lector.
 */
export const LESSONS = [
  {
    id: 'ia_prompt',
    act: 'Lección I · La Cámara de las Peticiones',
    title: 'La petición con cinco sellos',
    narrative: 'El Oráculo del Abismo ya no admite frases sueltas. La orden guarda cinco sellos en la mesa: un rol, un contexto, una tarea, un criterio de éxito y un formato. Sin todos, la respuesta es educada, inútil y libre de inventar. El guardián dice: «No rueges. Configurá.»',
    concept: 'Un prompt útil no es una frase larga: es una especificación. El `rol` define desde dónde responde. El `contexto` entrega el material de trabajo. La `tarea` dice qué hacer. El `criterio de éxito` permite saber si sirve. El `formato` fija cómo devolverlo. Las `restricciones` cerran los atajos.\n\nPedir que señale `supuestos` es tan importante como pedir la respuesta: evita que el modelo llene vacíos con inventos.',
    task: 'Escribí un prompt para que un asistente explique la función `calcularTotal(items)` de un checkout en Python. Debe incluir rol, contexto, tarea, criterio de éxito, formato, restricciones y pedir que marque los supuestos.',
    starter: 'Actuá como [rol].\nContexto: [proyecto, stack y qué hace la función].\nTarea: [qué quieres que explique].\nCriterio de éxito: [cómo sabrás que la explicación sirve].\nFormato: [pasos / lista / JSON].\nRestricciones: [qué no debe hacer].\nSupuestos: [qué debe preguntar si le falta información].',
    checklist: [
      'Un rol explícito.',
      'Contexto del proyecto y de la función.',
      'Una tarea concreta.',
      'Un criterio verificable de éxito.',
      'Un formato de salida.',
      'Restricciones y pedido de supuestos.'
    ],
    hints: [
      'Empezá con «Actuá como...»: eso fija el rol.',
      'El criterio de éxito no es «que esté bien»: es, por ejemplo, «que un alumno pueda seguir el cálculo sin mirar el código».',
      'Cerrá con «si falta información, preguntá y marcá tus supuestos».'
    ],
    answer: {
      minWords: 25,
      required: [
        { label: 'un rol', pattern: 'act[uú]a como|rol|ingeniero|desarrollador|revisor|arquitecto|profesor' },
        { label: 'contexto', pattern: 'contexto|proyecto|stack|entorno|checkout|calcularTotal|funci[oó]n' },
        { label: 'una tarea concreta', pattern: 'tarea|explic[aá]|revis[aá]|analiza|describe|convierte' },
        { label: 'un criterio de éxito', pattern: 'criterio|éxito|aceptaci[oó]n|esperado|objetivo|debe lograr|verificable' },
        { label: 'un formato de salida', pattern: 'formato|json|lista|tabla|pasos|devuelve' },
        { label: 'restricciones', pattern: 'restricci[oó]n|no uses|sin librer|l[ií]mite|debe evitar|proh[ií]be|no inventes' }
      ],
      anyOf: [
        { label: 'pedir supuestos o preguntas', patterns: ['supuestos?', 'no inventes', 'si falta informaci[oó]n', 'pregunt', 'aclara'] }
      ],
      forbidden: [
        {
          label: 'pedir la respuesta sin explicación',
          pattern: 'sin explicar|no me expliques|solo el c[oó]digo final|resuelve directamente',
          reason: 'Un prompt útil pide razonamiento verificable, no solo el resultado.'
        }
      ],
      success: 'El Oráculo recibió una petición completa: rol, contexto, tarea, criterio, formato y límites. Eso es configurar, no rogar.'
    },
    xp: 60,
    item: 'Prompt estructurado'
  },
  {
    id: 'ia_contexto',
    act: 'Lección II · La Sala de los Ecos Fallidos',
    title: 'El contexto que salva la respuesta',
    narrative: 'Un aprendiz escribe «no funciona» y el Oráculo devuelve conjeturas. El guardián le acerca una tablilla con cinco columnas: error, código, esperado, obtenido y lo ya intentado. «El modelo no ve tu pantalla», dice. «Si no le das el caso, te va a dar el promedio de todos los casos.»',
    concept: 'Un bug se describe, no se lamenta. Incluí el `error` exacto o el traceback, el `fragmento` de código relevante, lo que `esperabas`, lo que `obteniste`, qué `intentaste` y el `entorno` (lenguaje, versión, navegador).\n\nUna pregunta concreta cierra el círculo: «¿por qué ocurre y qué línea lo causa?». Sin eso, el asistente adivina entre demasiadas posibilidades.',
    task: 'Redactá una consulta para diagnosticar un fallo en una función que calcula descuentos: devuelve 0 cuando el carrito tiene más de diez items. Incluí error, código, esperado, obtenido, intentos, entorno y una pregunta concreta.',
    starter: 'Error exacto: [...]\nCódigo relevante: [...]\nEsperaba: [...]\nObtuve: [...]\nYa intenté: [...]\nEntorno: [...]\nPregunta: [...]',
    checklist: [
      'El error o traceback.',
      'El fragmento de código.',
      'Resultado esperado y obtenido.',
      'Lo que ya intentaste.',
      'Versión o entorno.',
      'Una pregunta concreta.'
    ],
    hints: [
      'Pegá el mensaje de error tal cual aparece, sin resumirlo.',
      'Contrastá «esperaba 10% de descuento» con «obtuve 0».',
      'Terminá con una pregunta: «¿qué condición descarta el descuento?».'
    ],
    answer: {
      minWords: 30,
      required: [
        { label: 'el error o traceback', pattern: 'error|traceback|excepci[oó]n|fallo|stack trace' },
        { label: 'el código relevante', pattern: 'c[oó]digo|fragmento|archivo|l[ií]nea|carrito|descuento' },
        { label: 'resultado esperado y obtenido', pattern: 'esperad|esperab|deber[ií]a|obtenid|obtuve|actual|sale|resultado' },
        { label: 'lo que intentaste', pattern: 'intent|prob|ya hice|hasta ahora|revis[eé]' },
        { label: 'el entorno o la versión', pattern: 'versi[oó]n|python|node|navegador|sistema|stack|entorno' }
      ],
      anyOf: [
        { label: 'una pregunta concreta', patterns: ['¿', 'pregunta', 'dudas?', 'por qu[eé]', 'qu[eé] condici[oó]n'] }
      ],
      forbidden: [],
      success: 'Ahora el Oráculo tiene caso, no impresión. Describir el fallo con precisión ya eliminó la mitad de las respuestas inventadas.'
    },
    xp: 70,
    item: 'Contexto de depuración'
  },
  {
    id: 'ia_revision',
    act: 'Lección III · El Espejo de los Parches',
    title: 'La revisión no es un reescrito ciego',
    narrative: 'El guardián coloca un parche sobre la mesa: viene de un asistente y parece impecable. Hay una consulta SQL construida con texto y un bucle que consulta la base en cada fila. «No me lo cambies por otra cosa», dice. «Decime qué duele, por qué y con qué evidencia.»',
    concept: 'Pedir «revisá esto» es tan vago como pedir «arreglá esto». Una revisión útil pide `hallazgos` con severidad, `evidencia` en líneas concretas, `impacto`, un `parche mínimo` y `tests` que demuestren el arreglo.\n\nTambién conviene pedir que `pregunte` si algo no está claro. Un asistente que inventa contexto donde no lo hay es peor que uno que dice «no lo sé».',
    task: 'Escribí una petición de revisión para ese parche: pide hallazgos con severidad, evidencia, impacto, parche mínimo, tests y preguntas si falta contexto. No pidas reescribir todo.',
    starter: 'Revisá este cambio con criterio de [seguridad / rendimiento / claridad].\nPara cada hallazgo indicá: severidad, línea, evidencia, impacto y parche mínimo.\nNo reescribas el archivo completo; mostrá solo el diff.\nAgregá tests que fallen antes y pasen después.\nSi falta contexto, preguntá en vez de suponer.',
    checklist: [
      'Revisión con criterios.',
      'Riesgos de seguridad y rendimiento.',
      'Severidad e impacto.',
      'Evidencia en código.',
      'Parche mínimo y tests.',
      'Preguntas si falta contexto.'
    ],
    hints: [
      'Pedí hallazgos ordenados por severidad, no una opinión general.',
      'La evidencia es la línea concreta que provoca el problema.',
      '«Mostrá solo el diff» evita que el modelo reescriba lo que ya estaba bien.'
    ],
    answer: {
      minWords: 30,
      required: [
        { label: 'la revisión', pattern: 'revisi[oó]n|revis[aá]|eval[uú]a|audita' },
        { label: 'seguridad', pattern: 'seguridad|inyecci[oó]n|validaci[oó]n|autenticaci[oó]n|secretos|datos|sql' },
        { label: 'rendimiento o N+1', pattern: 'n[+]1|consultas?|rendimiento|performance|lentitud' },
        { label: 'severidad o impacto', pattern: 'severidad|impacto|riesgo|criticidad|prioridad' },
        { label: 'evidencia', pattern: 'evidencia|l[ií]nea|fragmento|por qu[eé]|justific' },
        { label: 'parche mínimo', pattern: 'diff|parche|cambios m[ií]nimos|sin reescribir|no reescribas|solo el cambio' },
        { label: 'tests', pattern: 'tests|pruebas|casos de prueba' }
      ],
      anyOf: [
        { label: 'preguntar si falta contexto', patterns: ['si falta', 'pregunt', 'dudas?', 'no est[aá] claro', 'aclara'] }
      ],
      forbidden: [
        {
          label: 'reescritura ciega',
          pattern: 'reescribe todo|reescr[ií]belo todo|cambia todo sin explicar',
          reason: 'Reescribir sin explicar oculta el riesgo original y dificulta revisar el cambio.'
        }
      ],
      success: 'El espejo devolvió hallazgos con líneas, impacto y parche mínimo. Eso es usar IA como revisora, no como chaperona ciega.'
    },
    xp: 85,
    item: 'Revisión con evidencia'
  },
  {
    id: 'ia_tests',
    act: 'Lección IV · La Balanza de los Casos',
    title: 'Tests antes que fe',
    narrative: 'El Oráculo anuncia: «Esta función es correcta». El guardián no se conmueve. Coloca una balanza vacía y dice: «Las palabras no pesan. Los casos sí». Antes de aceptar código generado, la orden exige probar los bordes que nadie menciona.',
    concept: 'Pedir tests es pedir evidencia, no decoración. La petición debe incluir `casos normales`, `casos límite` (vacío, nulo, uno, muchos), `casos negativos` y una `afirmación` clara de qué se espera.\n\nAdemás, conviene prohibir que se modifique la implementación: si el test se adapta al código, ya no prueba nada. Pedir una tabla de casos antes de escribir el test obliga a pensar el comportamiento.',
    task: 'Pedí una batería de tests para una función que divide dos números. Incluí casos normales, bordes, división por cero, resultado esperado y la orden de no tocar la implementación.',
    starter: 'Generá tests para [función].\nPrimero listá una tabla de casos: normales, límites y negativos.\nPara cada caso indicá entrada y resultado esperado.\nLuego escribí las afirmaciones.\nNo modifiques la implementación: si algo no puede cumplirse, explicalo.',
    checklist: [
      'Tests o pruebas.',
      'Casos normales y límite.',
      'Caso negativo: división por cero.',
      'Resultado esperado o afirmación.',
      'Prohibición de tocar la implementación.'
    ],
    hints: [
      'Los bordes acá son cero, negativos y números muy grandes.',
      'El caso negativo debe esperar un error, no un número.',
      'Agregá «no modifiques la función bajo prueba».'
    ],
    answer: {
      minWords: 25,
      required: [
        { label: 'tests', pattern: 'tests|pruebas|casos de prueba' },
        { label: 'casos normales y límite', pattern: 'normales?|l[ií]mites?|bordes?|edge|vac[ií]o|nulo|cero' },
        { label: 'caso negativo', pattern: 'negativ|divisi[oó]n por cero|error|excepci[oó]n|fallo' },
        { label: 'resultado esperado', pattern: 'esperado|assert|afirmaci[oó]n|resultado|debe devolver' },
        { label: 'no modificar la implementación', pattern: 'no modifiques|sin tocar|no cambies|implementaci[oó]n|funci[oó]n bajo prueba' }
      ],
      anyOf: [
        { label: 'una tabla o matriz de casos', patterns: ['tabla', 'matriz', 'listá', 'escenarios', 'cobertura'] }
      ],
      forbidden: [],
      success: 'La balanza ya pesa casos, no promesas. Un test bien pedido convierte la confianza en evidencia.'
    },
    xp: 90,
    item: 'Casos de prueba'
  },
  {
    id: 'ia_fuentes',
    act: 'Lección V · La Cripta de las Citas Falsas',
    title: 'Fuentes, versiones y alucinaciones',
    narrative: 'En la cripta hay pergaminos que parecen antiguos pero fueron escritos anoche. El Oráculo cita un método que no existe en la versión instalada. El guardián dice: «Pedir documentación no es desconfiar: es hacer el oficio». Un nombre de función sin versión es una pista sin sello.',
    concept: 'Los modelos pueden inventar APIs, parámetros y enlaces. Mitigarlo no consiste en creer más o menos, sino en pedir `fuentes`, `versión` y `ejemplo` ejecutable, y después `contrastar` con la documentación oficial.\n\nUna cláusula clave: «si no lo sabés, decilo; no lo inventes». Obliga al asistente a declarar incertidumbre en vez de rellenar el vacío con texto convincente.',
    task: 'Redactá una consulta sobre una librería de fechas para que el asistente cite documentación oficial, indique la versión, muestre un ejemplo y admita cuando no sepa algo. Pedí además que no invente métodos.',
    starter: 'Sobre [librería de fechas], necesito [operación].\nIndicá la versión a la que aplica la respuesta.\nCitá documentación oficial y un ejemplo ejecutable.\nSi el método no existe o no estás seguro, decilo: no lo inventes.\nDespués contrastaré lo que escribas con la documentación.',
    checklist: [
      'Fuentes o documentación oficial.',
      'Versión o fecha de la respuesta.',
      'Ejemplo concreto.',
      'Permiso para decir «no lo sé».',
      'Pedido de verificación.'
    ],
    hints: [
      'Pedí que cite la documentación oficial, no un blog cualquiera.',
      '«Si no estás seguro, decilo» reduce las invenciones.',
      'Cerrá con «voy a contrastarlo con la versión instalada».'
    ],
    answer: {
      minWords: 25,
      required: [
        { label: 'fuentes o documentación', pattern: 'fuente|documentaci[oó]n|link|enlace|oficial' },
        { label: 'versión o fecha', pattern: 'versi[oó]n|fecha|actualizado|instalada' },
        { label: 'ejemplo concreto', pattern: 'ejemplo|c[oó]digo|comando|m[eé]todo|funci[oó]n' },
        { label: 'permiso para no saber', pattern: 'no inventes|no lo sabes|si no sabes|no est[aá]s seguro|decilo|dudas?' },
        { label: 'verificación', pattern: 'verificar|contrastar|comprobar|buscar|revisar' }
      ],
      anyOf: [],
      forbidden: [
        {
          label: 'fe ciega',
          pattern: 'cr[eé]eme|conf[ií]a en m[ií] sin verificar|no hace falta verificar',
          reason: 'Nada de lo que diga un modelo reemplaza la comprobación contra la documentación.'
        }
      ],
      success: 'El pergamino trae versión, fuente y ejemplo. Aun así, lo contrastás antes de grabarlo: esa es la diferencia entre citar y creer.'
    },
    xp: 95,
    item: 'Verificación de fuentes'
  },
  {
    id: 'ia_secretos',
    act: 'Lección VI · La Cámara de los Secretos',
    title: 'Secretos, datos y permisos',
    narrative: 'El guardián señala una tablilla que alguien dejó abierta: contiene una clave de API, un correo real y un token de sesión. «Un asistente no es un cofre», dice. «Antes de compartir, tachá lo que no debería salir de esta sala.» La regla no es desconfiar del modelo: es cuidar lo que se le entrega.',
    concept: 'Antes de pegar un error o un fragmento, revisá si contiene `claves`, `tokens`, `contraseñas`, `correos` o datos de clientes. Reemplazalos por marcadores como `<API_KEY>` o `usuario@example.com`.\n\nTambién revisá `permisos`: pedir acceso a un repositorio o a una base no es lo mismo que pedir una explicación. Un flujo seguro pide el `ámbito mínimo` y deja registro de qué se compartió.',
    task: 'Escribí una checklist para compartir un error con un asistente sin filtrar secretos ni datos personales. Incluí claves, tokens, datos sensibles, marcadores de reemplazo, permisos mínimos y revisión final.',
    starter: 'Antes de pegar, revisá:\n1. [ ] Claves, tokens y contraseñas → reemplazalos por [marcador].\n2. [ ] Datos personales o de clientes → [acción].\n3. [ ] Permisos solicitados → solo [ámbito].\n4. [ ] Revisión final de [qué se comparte].',
    checklist: [
      'Claves, tokens o contraseñas.',
      'Datos personales o sensibles.',
      'Marcadores de reemplazo.',
      'Permisos mínimos.',
      'Revisión final antes de compartir.'
    ],
    hints: [
      'Pensá en un log real: suele tener correos y tokens dentro.',
      'Reemplazá el valor por un marcador en vez de borrar la línea: así se entiende el error.',
      'Pedí solo el permiso necesario para la tarea, no acceso total.'
    ],
    answer: {
      minWords: 25,
      required: [
        { label: 'secretos', pattern: 'secreto|clave|token|contrase|api key|credencial' },
        { label: 'no pegar o redactar', pattern: 'no pegues|redact|oculta|reemplaza|elimina|tach|nunca compartas' },
        { label: 'datos personales o sensibles', pattern: 'datos personales|sensible|correo|cliente|privad|pii|informaci[oó]n personal' },
        { label: 'permisos mínimos', pattern: 'permiso|autorizaci[oó]n|acceso|[aá]mbito|scope|m[ií]nimo' },
        { label: 'revisión antes de compartir', pattern: 'revisi[oó]n|antes de pegar|antes de compartir|checklist|comprob' }
      ],
      anyOf: [
        { label: 'logs o errores', patterns: ['log|error|traza|traceback|mensaje'] }
      ],
      forbidden: [
        {
          label: 'compartir el valor real',
          pattern: 'pega tu .env|comparte la clave real|incluye el token real',
          reason: 'La checklist debe impedir que el secreto viaje, no sugerir que se copie tal cual.'
        }
      ],
      success: 'La tablilla quedó limpia: secretos tachados, datos reemplazados, permisos mínimos. Ahora sí podés compartir el error.'
    },
    xp: 100,
    item: 'Higiene de secretos'
  }
];
