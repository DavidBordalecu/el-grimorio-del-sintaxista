/**
 * Base de datos narrativa del MVP. Cada nodo sigue el esquema descrito en el SDD:
 * id, act, title, narrative, objective, initialCode, oracleHints, validation,
 * rewards y nextScene.
 */
export const SCENES = [
  {
    id: 'acto1_variables',
    act: 'Acto I: La Aldea de las Runas',
    title: 'El Puente del Guardián',
    energy: 30,
    narrative: `
      <p>La niebla se aferra al Puente del Guardián. Bajo tus botas, una runa de hierro yace partida en dos; sin ella, el mecanismo de la aldea no reconocerá tu paso.</p>
      <p>La estatua habla con voz de gravilla: <em>«Nombra lo que no debe cambiar y suelta lo que aún puede fluctuar.»</em></p>
    `,
    theory: `
      <h3>Lo que el guardián enseña antes de soltarte</h3>
      <p>En JavaScript toda runa vive en una <strong>variable</strong>: un nombre que apunta a un valor. Hay dos formas de crearla. <code>const</code> graba el nombre en piedra: no podés volver a asignarlo. <code>let</code> lo escribe en arena: podés borrar y guardar otro valor después.</p>
      <p>La forma es siempre <code>tipo nombre = valor;</code>. El signo <code>=</code> se lee «guardá este valor en este nombre», no «ambos lados son iguales». El punto y coma cierra la frase, como un sello de cera al final del pergamino.</p>
      <p>La llave es de piedra porque, si cambiara, el puente ya no reconocería al portador. Las monedas son arena porque el caudal de una partida sube y baja.</p>
    `,
    objective: 'Declará <code>const llave = "hierro"</code> y <code>let monedas = 15</code>. La llave es un sello inmutable; las monedas, un caudal que puede variar.',
    initialCode: '// El puente espera tus runas...\n',
    oracleHints: [
      { keyword: 'respuesta', response: 'El espíritu niega con la cabeza. «Pide guía sobre constantes, no el conjuro hecho.»' },
      { keyword: 'const', response: 'Para sellar un valor inmutable usa la runa <code>const nombre = "valor";</code>.' },
      { keyword: 'let', response: '<code>let</code> abre una variable que podrás reasignar más adelante. Úsala para lo que cuenta y cambia.' },
      { keyword: 'constante', response: 'Una constante no se reasigna. ¿Qué objeto del puente debe permanecer siempre igual?' },
      { keyword: 'variable', response: 'Las variables guardan estado. El espíritu sugiere observar cuál de los dos datos del acertijo puede cambiar.' }
    ],
    validation: {
      expectedVars: { llave: 'hierro', monedas: 15 },
      customTest: "typeof llave !== 'undefined' && llave === 'hierro' && typeof monedas !== 'undefined' && monedas === 15",
      sourceRules: [
        { pattern: '\\bconst\\s+llave\\s*=', message: 'Falta sellar la llave con <code>const llave = ...</code>.' },
        { pattern: '\\blet\\s+monedas\\s*=', message: 'Las monedas deben declararse con <code>let monedas = ...</code>.' }
      ]
    },
    rewards: {
      xp: 50,
      item: 'Runa de Inmutabilidad (const)',
      description: 'Grabada en la piedra del puente. Recuerda que algunos valores nunca deben cambiar.'
    },
    nextScene: 'acto1_condicionales'
  },
  {
    id: 'acto1_condicionales',
    act: 'Acto I: La Aldea de las Runas',
    title: 'La Bifurcación de las Sombras',
    energy: 30,
    narrative: `
      <p>Dos sendas se abren entre los helechos. A tu izquierda, el sigilo; a la derecha, un combate que despertaría a lo que duerme bajo la tierra.</p>
      <p>Tu energía marca <strong>30</strong>. Un movimiento en falso y la crónica terminará aquí. Decide en función de un umbral, no al azar.</p>
    `,
    theory: `
      <h3>La runa de la decisión</h3>
      <p>Una <strong>condición</strong> es una pregunta que el programa puede responder con verdadero o falso. Se escribe entre paréntesis y usa operadores como <code>&lt;</code>, <code>&gt;</code> o <code>===</code>.</p>
      <p><code>if (condición) { ... }</code> abre el camino verdadero. <code>else { ... }</code> abre el camino que queda cuando la respuesta es falsa. Las llaves agrupan las runas que obedecen a cada lado: sin ellas, solo la primera línea dependería de la condición.</p>
      <p>La crónica no decide al azar: decide comparando datos. Por eso la energía (30) se compara con el umbral (50) antes de elegir senda.</p>
    `,
    objective: 'Con <code>energia = 30</code> ya declarada, escribí un <code>if / else</code> que asigne <code>accion = "sigilo"</code> si <code>energia &lt; 50</code>, o <code>"ataque"</code> en caso contrario.',
    initialCode: "let energia = 30;\nlet accion = '';\n\n// Escribí la condición aquí\n",
    oracleHints: [
      { keyword: 'respuesta', response: '«No te daré la senda hecha», susurra el espíritu. «Pregúntame cómo se compara la energía con el umbral.»' },
      { keyword: 'if', response: 'La runa <code>if (condición) { ... } else { ... }</code> abre dos caminos: uno se cumple, el otro queda para cuando la condición es falsa.' },
      { keyword: 'comparacion', response: 'Los operadores de comparación devuelven verdadero o falso. Observa la energía y piensa si 30 cruza el umbral de 50.' },
      { keyword: 'energia', response: 'La energía ya está en la página. No la redeclares: compárala.' },
      { keyword: 'menor', response: 'El símbolo <code>&lt;</code> significa «menor que». Úsalo para contrastar la energía con el límite.' },
      { keyword: 'else', response: 'El camino alternativo se escribe con <code>else</code> después del bloque <code>if</code>.' }
    ],
    validation: {
      expectedVars: { accion: 'sigilo' },
      customTest: "typeof accion !== 'undefined' && accion === 'sigilo'",
      sourceRules: [
        { pattern: '\\bif\\b', message: 'La encrucijada exige una decisión con <code>if</code>.' },
        { pattern: '\\belse\\b', message: 'Toda senda necesita su alternativa: agregá un <code>else</code>.' }
      ]
    },
    rewards: {
      xp: 65,
      item: 'Daga de las Dos Sendas (if/else)',
      description: 'Una hoja que solo hiere cuando la condición es falsa.'
    },
    nextScene: 'acto1_arrays_bucles'
  },
  {
    id: 'acto1_arrays_bucles',
    act: 'Acto I: La Aldea de las Runas',
    title: 'Las Catacumbas del Eco',
    energy: 25,
    narrative: `
      <p>Las catacumbas devuelven cada paso como un tintineo de vidrio. En una estantería se alinean frascos: unos contienen veneno, otros guardan la luz de una poción curativa.</p>
      <p>El eco insiste: <em>«Separa lo que sana de lo que hiere. No dejes pasar ni un solo veneno.»</em></p>
    `,
    theory: `
      <h3>La estantería de las runas</h3>
      <p>Un <strong>array</strong> es una estantería numerada: cada frasco tiene una posición y se recorre de izquierda a derecha. Podés caminar con un bucle <code>for</code> y decidir uno por uno, o pedirle al array que filtre por vos.</p>
      <p><code>filter()</code> recibe una función y conserva solo los elementos para los que esa función responde verdadero. Devuelve un <strong>array nuevo</strong>: la estantería original queda intacta, igual que el eco no reescribe los frascos.</p>
      <p>Dentro de la función de filtrado, <code>f</code> representa cada frasco. Comparar con <code>===</code> evita confundir la comparación con la asignación <code>=</code>.</p>
    `,
    objective: 'A partir de <code>frascos</code>, creá un array <code>seguros</code> que contenga únicamente los valores <code>"cura"</code>. Podés usar <code>filter()</code> o un bucle <code>for</code>.',
    initialCode: "const frascos = ['veneno', 'cura', 'veneno', 'cura', 'cura'];\n\n// Creá el array seguros aquí\n",
    oracleHints: [
      { keyword: 'respuesta', response: 'El espíritu cruza los brazos. «Te mostraré el método, no el resultado: pregúntame por filtrado o por bucles.»' },
      { keyword: 'filter', response: '<code>array.filter(funcion)</code> conserva solo los elementos para los que la función devuelve verdadero.' },
      { keyword: 'for', response: 'Un bucle <code>for</code> puede recorrer cada frasco y decidir si lo guardas. Necesitarás un array vacío donde acumular los seguros.' },
      { keyword: 'array', response: 'Los arrays son listas. Ya tenés <code>frascos</code>; necesitás una segunda lista para los resultados.' },
      { keyword: 'cura', response: 'Compará cada elemento con la cadena <code>"cura"</code>. Solo esos merecen seguir contigo.' },
      { keyword: 'push', response: 'Dentro de un bucle, <code>array.push(valor)</code> agrega un elemento al final de tu lista.' }
    ],
    validation: {
      customTest: "typeof seguros !== 'undefined' && Array.isArray(seguros) && seguros.length === 3 && seguros.every(v => v === 'cura')",
      sourceRules: [
        { pattern: '\\.filter\\s*\\(|\\bfor\\b', message: 'El eco exige filtrar con <code>filter()</code> o recorrer con un bucle <code>for</code>.' }
      ]
    },
    rewards: {
      xp: 80,
      item: 'Tamiz del Eco (filter / for)',
      description: 'Un cedazo que solo deja pasar lo que ha sido probado.'
    },
    nextScene: 'acto5_oraculo_ia'
  },
  {
    id: 'acto5_oraculo_ia',
    act: 'Acto V: El Oráculo del Abismo',
    title: 'El Oráculo del Abismo',
    energy: 20,
    narrative: `
      <p>El Oráculo no habla con palabras: responde solo a estructuras. Una petición ambigua se disuelve en la oscuridad; una petición bien formada regresa como un pergamino legible.</p>
      <p>En la losa aparecen tres campos grabados: <strong>rol</strong>, <strong>formato</strong> e <strong>instruccion</strong>. El abismo quiere un traductor que devuelva JSON con <code>traduccion</code> y <code>notas</code>.</p>
    `,
    theory: `
      <h3>El pergamino estructurado</h3>
      <p>Un <strong>objeto</strong> es un pergamino con campos con nombre: cada <code>clave</code> guarda un <code>valor</code>. Se escribe entre llaves y las claves van entre comillas o como identificadores simples.</p>
      <p><code>JSON</code> es una forma de escribir esos pergaminos como texto: claves entre comillas, valores entre comillas o números, todo separado por comas. Por eso el campo <code>formato</code> debe valer literalmente <code>"JSON"</code>.</p>
      <p>Un prompt útil no es una súplica: es una configuración. Define el <code>rol</code> (quién responde), el <code>formato</code> (cómo responde) y la <code>instruccion</code> (qué debe devolver). Cuanto más explícitas sean las claves, menos margen tiene el abismo para inventar.</p>
    `,
    objective: 'Declará <code>const promptConfig = { rol: "traductor", formato: "JSON", instruccion: "..." }</code>. En <code>instruccion</code> pedí traducir un hechizo al español y exigí una respuesta JSON con las claves <code>traduccion</code> y <code>notas</code> (mínimo 20 caracteres).',
    initialCode: '// Configurá la petición para el Oráculo del Abismo\n',
    oracleHints: [
      { keyword: 'respuesta', response: 'El abismo traga tu pedido. «No te daré el objeto terminado; pregúntame qué hace válida una instrucción.»' },
      { keyword: 'prompt', response: 'Un prompt útil define quién responde, en qué formato y qué debe incluir. Observá las tres claves de la losa.' },
      { keyword: 'json', response: 'JSON es una estructura de claves y valores escritos entre comillas. El campo <code>formato</code> debe valer exactamente <code>"JSON"</code>.' },
      { keyword: 'rol', response: 'El <code>rol</code> le dice al modelo qué papel asumir. Aquí el abismo pide un traductor.' },
      { keyword: 'instruccion', response: 'La instrucción debe ser explícita: qué traducir, a qué idioma y qué claves devolver. Cuanto más contexto, mejor.' },
      { keyword: 'traductor', response: 'Asigná <code>rol: "traductor"</code>. Luego explicá en la instrucción la tarea de traducción.' },
      { keyword: 'notas', response: 'El Oráculo solo acepta respuestas con dos claves: <code>traduccion</code> y <code>notas</code>. Asegúrate de mencionarlas.' }
    ],
    validation: {
      customTest: "typeof promptConfig !== 'undefined' && promptConfig.rol === 'traductor' && promptConfig.formato === 'JSON' && typeof promptConfig.instruccion === 'string' && promptConfig.instruccion.length >= 20 && /traduc/i.test(promptConfig.instruccion) && /notas/i.test(promptConfig.instruccion)",
      sourceRules: [
        { pattern: '\\bconst\\s+promptConfig\\s*=', message: 'La losa exige declarar el objeto con <code>const promptConfig = { ... }</code>.' },
        { pattern: 'rol\\s*:', message: 'Falta la clave <code>rol</code> en la configuración.' },
        { pattern: 'formato\\s*:', message: 'Falta la clave <code>formato</code> en la configuración.' },
        { pattern: 'instruccion\\s*:', message: 'Falta la clave <code>instruccion</code> en la configuración.' }
      ]
    },
    rewards: {
      xp: 100,
      item: 'Pergamino de Prompt (JSON)',
      description: 'Un pergamino que convierte intenciones vagas en peticiones estructuradas.'
    },
    nextScene: null
  }
];

export function getScene(id) {
  return SCENES.find((scene) => scene.id === id) || null;
}

export function getSceneIndex(id) {
  return SCENES.findIndex((scene) => scene.id === id);
}
