/**
 * Curso de Ruby y Ruby on Rails basado en ejecución externa: el alumno completa
 * el código, lo corre en su equipo o en una plataforma online y pega la salida.
 * Cada lección explica la teoría dentro de la historia antes de pedir el código.
 */
export const LESSONS = [
  {
    id: 'rb_variables',
    act: 'Lección I · La Aldea de las Runas',
    title: 'Variables con alma',
    narrative: 'Ruby no pide permiso para crear variables: basta con asignar. El guardián sonríe: «Acá todo es un objeto, hasta los números. Los nombres son solo etiquetas que pegás sobre ellos.»',
    concept: '`nombre = valor` crea una variable local. Ruby no necesita `let`, `const` ni tipos declarados: el objeto que asignás determina de qué se trata.\n\nLas comillas dobles permiten interpolar: `#{variable}` se reemplaza por el valor de la variable dentro del texto. Con comillas simples no hay interpolación.\n\n`puts` escribe una línea y salta al final. Por eso la salida aparece limpia, sin comillas.',
    code: 'llave = "hierro"\nputs "Sello: ______"',
    instruction: 'Interpolá la variable `llave` dentro del texto y mostrá la huella resultante.',
    expectedOutput: 'Sello: hierro',
    hints: [
      'La interpolación en Ruby se escribe con `#{}` dentro de comillas dobles.',
      'Dentro de las llaves va el nombre de la variable: `llave`.'
    ],
    xp: 45,
    item: 'Asignación y puts'
  },
  {
    id: 'rb_condicionales',
    act: 'Lección II · El Bosque de las Bifurcaciones',
    title: 'La senda con end',
    narrative: 'Los bloques de Ruby no usan llaves: se abren con `if` y se cierran con `end`. El guardián señala la indentación: «Escribila para leer mejor, pero no esperes que ella decida dónde termina el bloque. Eso lo decide `end`.»',
    concept: 'La estructura es `if condición ... else ... end`. También existe `elsif` para casos intermedios. Cada bloque necesita su `end`; si falta, Ruby no sabe dónde cerrar la decisión.\n\nCon energía 30, la condición `energia < 50` es verdadera, así que se ejecuta la primera rama y la salida es `sigilo`.\n\nRuby además permite la forma modificadora: `accion = "sigilo" if energia < 50`, útil para decisiones de una sola línea.',
    code: 'energia = 30\n\nif energia < 50\n  accion = "sigilo"\nelse\n  accion = ______\nend\n\nputs accion',
    instruction: 'Completá la rama `else` y mostrá la acción elegida con energía 30.',
    expectedOutput: 'sigilo',
    hints: [
      'Con energía 30 se cumple la condición, así que la rama `else` no se ejecuta.',
      'Aun así, completá la rama con la otra acción posible: "ataque".'
    ],
    xp: 50,
    item: 'Bloques if / end'
  },
  {
    id: 'rb_select',
    act: 'Lección III · Las Catacumbas del Eco',
    title: 'El tamiz de bloques',
    narrative: 'Los frascos llegan en un array y el eco repite cada veneno. Ruby no te obliga a escribir un bucle: te da bloques, pequeñas piezas de código que se pasan a un método y deciden qué hacer con cada elemento.',
    concept: 'Un bloque va entre llaves `{ |f| ... }` o entre `do ... end`. La variable `f` dentro de las barras representa cada elemento del array.\n\n`select { |f| condición }` conserva solo los elementos cuya condición es verdadera y devuelve un array nuevo. Es el equivalente a filtrar con un bucle, pero en una línea.\n\n`p seguros` muestra el array con su representación inspectable: por eso aparecen corchetes y comillas dobles en la salida.',
    code: 'frascos = ["veneno", "cura", "veneno", "cura", "cura"]\nseguros = frascos.select { |f| ______ }\n\np seguros',
    instruction: 'Filtrá solo los frascos "cura" y mostrá la lista con `p`.',
    expectedOutput: '["cura", "cura", "cura"]',
    hints: [
      'La variable `f` representa cada frasco dentro del bloque.',
      'La comparación debe ser `f == "cura"`.'
    ],
    xp: 60,
    item: 'Bloques y select'
  },
  {
    id: 'rb_rails',
    act: 'Lección IV · La Torre de los Autómatas',
    title: 'El filtro de Rails',
    narrative: 'En la torre de Rails, los controladores no ejecutan todo de golpe: antes de una acción pueden correr filtros. El guardián describe un `before_action` que solo vigila `:editar` y `:actualizar`, y te pide reproducir esa idea con Ruby puro.',
    concept: '`before_action :autenticar, only: [:editar, :actualizar]` ejecuta el filtro solo para esas acciones. Acá lo simulamos con dos arrays: `acciones` y `only`.\n\n`select { |accion| only.include?(accion) }` conserva las acciones que están en la lista `only`. Es la misma idea: un filtro que decide qué pasa.\n\nLos símbolos como `:editar` son nombres ligeros que Ruby usa como identificadores; no son cadenas, pero se comportan de forma parecida en una lista.',
    code: 'acciones = [:editar, :actualizar, :mostrar]\nonly = [:editar, :actualizar]\n\nfiltradas = acciones.select { |accion| ______.include?(accion) }\np filtradas',
    instruction: 'Usá la lista `only` dentro del bloque para conservar solo esas acciones y mostrá el resultado.',
    expectedOutput: '[:editar, :actualizar]',
    hints: [
      'Adentro del bloque tenés la variable `accion` y la lista `only`.',
      'Preguntá si `only` incluye a `accion`.'
    ],
    xp: 65,
    item: 'Filtros de Rails (before_action)'
  }
];
