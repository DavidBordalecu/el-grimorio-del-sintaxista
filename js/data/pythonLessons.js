/**
 * Curso de Python basado en ejecución externa: el alumno completa el código,
 * lo corre en su equipo o en una plataforma online y pega la salida exacta.
 * Cada lección explica la teoría dentro de la historia antes de pedir el código.
 */
export const LESSONS = [
  {
    id: 'py_variables',
    act: 'Lección I · La Aldea de las Runas',
    title: 'Variables sin runas',
    narrative: 'El guardián te entrega una tablilla en lugar de una runa. «Acá no se talla en piedra», dice. «Se escribe un nombre y se le confía un valor; la tablilla lo recuerda por vos.»\n\nComo no hay que declarar el tipo, la tablilla decide sola: texto entre comillas, números sin comillas. Al principio parece magia, pero es solo una regla: el valor que escribís determina de qué es la variable.',
    concept: 'En Python, `nombre = valor` crea una variable y guarda ese valor. No necesitás `const` ni `let`: la asignación misma hace el trabajo.\n\n`print()` es la voz de la tablilla: muestra lo que le pongas entre paréntesis. Si imprimís dos cosas seguidas, aparecen en dos líneas, en el mismo orden en que las escribiste.\n\nError común: confundir `=` (asignar) con `==` (comparar). En esta lección solo estás guardando valores.',
    code: '# Completá los dos valores\nllave = ______\nmonedas = ______\nprint(llave)\nprint(monedas)',
    instruction: 'Asigná la llave "hierro" y 15 monedas. Mostrá cada valor con `print()`, uno por línea.',
    expectedOutput: 'hierro\n15',
    hints: [
      'Una cadena de texto va entre comillas; un número entero va sin comillas.',
      'El orden de los `print()` decide el orden de las líneas en la salida.'
    ],
    xp: 40,
    item: 'Asignación simple (=)'
  },
  {
    id: 'py_condicionales',
    act: 'Lección II · El Bosque de las Bifurcaciones',
    title: 'La bifurcación indentada',
    narrative: 'Dos caminos se abren con energía 30. La tablilla no lleva llaves: el sendero se marca con dos puntos y una sangría. El guardián golpea el suelo cuatro veces: «Cada espacio cuenta. La indentación no adorna: decide qué líneas obedecen a la condición.»',
    concept: 'Un bloque en Python empieza con `if condición:` y continúa con líneas indentadas cuatro espacios. El `else:` se alinea con el `if`, no con las líneas de adentro.\n\nLa condición se evalúa como verdadera o falsa. Con energía 30, `energia < 50` es verdadera, así que se ejecuta solo el primer bloque.\n\nSi olvidás los dos puntos o la sangría, Python no sabe dónde termina la decisión y se detiene antes de correr.',
    code: 'energia = 30\n\nif energia < 50:\n    accion = ______\nelse:\n    accion = ______\n\nprint(accion)',
    instruction: 'Si la energía es menor que 50 elegí "sigilo"; si no, elegí "ataque". Mostrá solo la acción elegida.',
    expectedOutput: 'sigilo',
    hints: [
      'Con energía 30, la condición `energia < 50` es verdadera.',
      'La cadena que imprimás debe ser exactamente `sigilo`, sin comillas en la salida.'
    ],
    xp: 50,
    item: 'Bloques con sangría (:)'
  },
  {
    id: 'py_listas',
    act: 'Lección III · Las Catacumbas del Eco',
    title: 'El tamiz de la catacumba',
    narrative: 'Las catacumbas devuelven el eco de cada frasco. La estantería original no se puede tocar: si tirás un veneno, el eco lo repite para siempre. Necesitás una estantería nueva donde solo entren los frascos que sanan.',
    concept: 'La comprensión de listas es una forma compacta de recorrer y filtrar: `[expresion for elemento in iterable if condicion]`.\n\nLa parte `for f in frascos` visita cada frasco; el `if` decide cuáles pasan; la expresión inicial decide qué se guarda. El resultado es una lista nueva: la original queda intacta.\n\nLa comparación de igualdad se escribe `==`. Usar `=` dentro del `if` sería un error de sintaxis.',
    code: 'frascos = ["veneno", "cura", "veneno", "cura", "cura"]\nseguros = [f for f in frascos if ______]\n\nprint(seguros)',
    instruction: 'Completá el filtro para conservar solo los frascos "cura" y mostrá la lista resultante.',
    expectedOutput: "['cura', 'cura', 'cura']",
    hints: [
      'La condición compara cada elemento `f` con el texto "cura".',
      'En Python, la comparación de igualdad se escribe con `==`, no con `=`.'
    ],
    xp: 60,
    item: 'Comprensión de listas'
  },
  {
    id: 'py_json',
    act: 'Lección IV · El Oráculo del Abismo',
    title: 'El diccionario del Oráculo',
    narrative: 'El Oráculo no escucha frases sueltas: solo lee pares. Cada par tiene una clave que lo identifica y un valor que guarda. La tablilla los llama «diccionario» y los reconoce por sus nombres entre comillas.',
    concept: 'Un diccionario se escribe `{"clave": valor}` y se parece a un objeto JSON. Se consulta con `diccionario["clave"]`: la clave va entre corchetes y entre comillas.\n\nPor eso el campo `formato` debe valer `"JSON"`: el Oráculo quiere ese texto exacto, no la palabra json en minúsculas ni una variable.\n\nSi pedís una clave que no existe, Python avisa con `KeyError`. Revisar la ortografía de las claves es parte del oficio.',
    code: 'prompt_config = {\n    "rol": "traductor",\n    "formato": "JSON",\n    "instruccion": "Traducí y devolvé JSON"\n}\n\nprint(prompt_config[______])\nprint(prompt_config["formato"])',
    instruction: 'Completá el hueco para mostrar primero el valor de "rol"; la segunda línea ya muestra "formato".',
    expectedOutput: 'traductor\nJSON',
    hints: [
      'Entre los corchetes va la clave que querés consultar, entre comillas.',
      'La primera línea debe mostrar `traductor` y la segunda `JSON`.'
    ],
    xp: 70,
    item: 'Diccionarios y JSON'
  },
  {
    id: 'py_print',
    act: 'Lección V · La huella impresa',
    title: 'La huella impresa',
    narrative: 'Toda crónica necesita dejar constancia. La tablilla ya sabe cuánta experiencia ganaste, pero todavía no lo dice: tenés que pedirle que lo escriba con tus palabras.',
    concept: '`print()` muestra texto en la consola. Una f-string se escribe `f"texto {variable}"`: la `f` antes de las comillas le dice a Python que reemplace lo que está entre llaves por el valor de la variable.\n\nEl resultado es texto, así que el número 50 aparece como `50`, sin comillas en la salida.\n\nSi te sobra o falta un carácter en el mensaje, la comprobación falla: acá la salida debe ser exacta.',
    code: 'xp = 50\nprint(______)',
    instruction: 'Usando una f-string, imprimí exactamente: `Sello roto: +50 XP`.',
    expectedOutput: 'Sello roto: +50 XP',
    hints: [
      'La f-string empieza con `f` antes de las comillas.',
      'Dentro de la f-string, `{xp}` se reemplaza por el valor de la variable.'
    ],
    xp: 40,
    item: 'print() y f-strings'
  }
];
