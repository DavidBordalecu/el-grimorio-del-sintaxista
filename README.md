# El Grimorio del Sintaxista (MVP v1.0)

Librojuego RPG interactivo para aprender programación desde los fundamentos hasta el desarrollo con IA responsable. Implementado según el `SDD - El Grimorio del Sintaxista.pdf` incluido en esta carpeta. La interfaz adopta la estética de un libro antiguo: papel añejo, tinta sepia, capitulares, encuadernación de cuero y detalles de impresión envejecida.

La **portada** (`index.html`) explica el proyecto, la historia, las mecánicas, los actos y los detalles técnicos. Primero se elige **idioma** (JavaScript, Python, Rust, Ruby / Rails o **Desarrollo con IA**) y después **nivel** (principiante, medio, hard o hardcore); recién cuando ambos están elegidos aparece el botón **«Comenzar la partida»**, que abre el curso o el desafío correspondiente. Las elecciones se guardan en `localStorage` y se pueden cambiar desde cualquier página.

En los cursos de **Python, Rust y Ruby / Rails** el alumnado completa un código inicial, lo ejecuta en su propia computadora o en una plataforma online y pega la **salida exacta** en la aplicación. El juego valida ese resultado, no el código escrito: así se practica escribir y correr programas de verdad.

## Ejecución

Requiere un servidor estático (los Web Workers no funcionan abriendo los archivos con `file://`):

```bash
cd proyectos/aprenderprogramar
python3 -m http.server 8000
```

Luego abrir <http://localhost:8000>.

También funciona con `npx live-server`, `php -S localhost:8000` o cualquier hosting estático (GitHub Pages, itch.io).

## Estructura

```
index.html              Portada: contexto, selector de idioma y selector de nivel
juego.html              Curso de JavaScript (libro abierto, con ejecución real)
python.html             Curso de Python: completar código, ejecutarlo y pegar salida
rust.html               Curso de Rust: completar código, compilarlo y pegar salida
ruby.html               Curso de Ruby / Rails: completar código, ejecutarlo y pegar salida
ia.html                 Curso de desarrollo con IA: prompts, revisión, tests, fuentes y secretos
desafios.html           Desafíos medio, hard y hardcore para los cinco tracks
css/reset.css           Normalización
css/theme.css           Paleta de libro antiguo y variables
css/layout.css          Libro abierto en escritorio, apilado en móvil
css/landing.css         Portada, selectores y tarjetas de idioma/nivel
css/course.css          Guía previa, cursos de salida esperada y estilos compartidos
css/challenges.css      Desafíos avanzados
js/main.js              Entrada del juego de JavaScript
js/python-course.js     Entrada del curso de Python
js/rust-course.js       Entrada del curso de Rust
js/ruby-course.js       Entrada del curso de Ruby / Rails
js/ai-course.js         Entrada del curso de desarrollo con IA
js/challenges.js        Entrada de los desafíos avanzados
js/code-course.js       Renderizador de ejercicios: compara la salida pegada
js/engine/language.js   Idioma elegido y enlaces de cambio
js/engine/difficulty.js Nivel elegido y enlaces de cambio
js/engine/adventure.js  Flujo de selección y botón «Comenzar la partida»
js/engine/quizState.js  Estado compartido de progreso de los cursos
js/engine/pythonState.js  Progreso de Python en localStorage
js/engine/rustState.js    Progreso de Rust en localStorage
js/engine/rubyState.js    Progreso de Ruby en localStorage
js/engine/aiState.js      Progreso del curso de IA en localStorage
js/engine/challengeState.js  Progreso de los desafíos en localStorage
js/data/story.js        Escenas de JavaScript, objetivos y validaciones
js/data/pythonLessons.js  Código inicial, salida esperada y pistas de Python
js/data/rustLessons.js    Código inicial, salida esperada y pistas de Rust
js/data/rubyLessons.js    Código inicial, salida esperada y pistas de Ruby / Rails
js/data/aiLessons.js      Rubrica narrada de las seis lecciones de desarrollo con IA
js/data/challenges.js   Desafíos avanzados, directiva anti-IA y directiva de uso responsable
js/engine/state.js      Estado del juego de JavaScript
js/engine/narrative.js  Render de la crónica, editor, consola e inventario
js/engine/sandbox.js    Cliente del Web Worker con timeout de 2000 ms
js/engine/oracle.js     Espíritu Guía: tutor socrático por palabras clave
js/workers/codeRunner.js  Worker aislado: ejecuta, captura logs y valida
```

## Niveles

| Nivel | Experiencia | Contenido |
| --- | --- | --- |
| **Principiante** | Cursos de JavaScript, Python, Rust, Ruby / Rails y Desarrollo con IA | Sintaxis guiada, primeros acertijos y trabajo responsable con modelos. |
| **Medio** | 1 desafío por track | Estado mutable, borrow checker, N+1, efectos colaterales y prompt incompleto. |
| **Hard** | 1 desafío por track | Event loop, decoradores y caché, concurrencia, transacciones anidadas y revisión sin evidencia. |
| **Hardcore** | 1 desafío por track | Detección de ciclos en O(1), cancelación de tareas, referencias débiles, jobs idempotentes y cadena de confianza. |

Los quince desafíos comparten progreso bajo la clave `grimorio-desafios:v1`. Cada uno entrega XP según su dificultad.

Cada desafío tiene un campo **«Comprobar mi solución»** disponible desde el principio: se pega el código o el patrón escrito por el alumno y se valida contra las restricciones, sin revelar la alternativa correcta. Las alternativas de opción múltiple siguen desbloqueándose recién después de dos pistas, como segunda vía de comprobación.

## Directiva anti-IA

Los enunciados avanzados de los cuatro lenguajes clásicos incluyen `ANTI_AI_DIRECTIVE` en `js/data/challenges.js`. Esa directiva viaja con el texto al copiarlo, tanto con el botón «Copiar enunciado con directiva» como al seleccionar y copiar el enunciado a mano: indica a cualquier asistente que **debe abstenerse de escribir la solución** y, como máximo, ofrecer una pista socrática. Dentro de la aplicación, el grimorio entrega hasta tres pistas progresivas y solo revela alternativas después de dos pistas. El objetivo es que el problema se resuelva de forma autónoma.

El track de **Desarrollo con IA** es la excepción deliberada: sus tres desafíos usan `AI_COLLAB_DIRECTIVE`. Esa directiva permite usar asistentes, pero exige verificar, pedir evidencia, explicar decisiones y no compartir secretos. La página detecta el track activo y cambia el cartel, el texto copiado y la directiva que se agrega al copiar a mano.

## Mecánica del juego de JavaScript

1. Escribí tu conjuro en el panel derecho (la tecla `Tab` inserta dos espacios).
2. Pulsá **Invocar Conjuro**: el código viaja a un Web Worker que captura `console.log`, ejecuta el código y comprueba las reglas de la escena.
3. Si el hilo no responde en 2000 ms se termina y se informa un bucle temporal infinito.
4. Al superar una escena se otorgan XP y un concepto al inventario; el progreso se guarda en `localStorage` bajo la clave `grimorio-sintaxista:v1`.
5. El **Espíritu Guía** rechaza pedidos de respuesta directa y devuelve pistas según las palabras clave de tu consulta.

## Contenido del MVP

| Escena | Concepto | Reto |
| --- | --- | --- |
| `acto1_variables` | `const` / `let` | Declarar `llave = "hierro"` y `monedas = 15` |
| `acto1_condicionales` | `if` / `else` | Asignar `accion` según `energia < 50` |
| `acto1_arrays_bucles` | `filter` / bucles | Obtener solo pociones `cura` de `frascos` |
| `acto5_oraculo_ia` | prompts y JSON | Construir `promptConfig` válido para el Oráculo |

Cada escena incorpora un bloque **«Lo que el guardián enseña»**: la teoría del lenguaje se explica dentro de la historia, antes del objetivo y del editor. Los cursos de Python, Rust y Ruby / Rails hacen lo mismo con la narración y el bloque «La teoría detrás de la runa», de modo que el alumno nunca recibe una tarea sin haber leído primero por qué existe esa sintaxis.

## Cursos de código ejecutado

Cada lección muestra un código inicial con huecos. El alumno lo copia, lo completa, lo ejecuta en su equipo o en una plataforma online y pega la salida exacta. La aplicación compara ese texto con la salida esperada: no entrega la respuesta ni ejecuta el código por el alumno. Antes de las lecciones, cada curso incluye una guía con pasos, enlaces de instalación y plataformas recomendadas.

- **Python**: variables, indentación, comprensión de listas, diccionarios/JSON y `print()`.
- **Rust**: `let mut`, préstamos, `Result` y `?`, y `match` exhaustivo.
- **Ruby / Rails**: asignación e interpolación, `if/end`, bloques con `select` y filtros `before_action`.

Sus progresos viven en `grimorio-python:v1`, `grimorio-rust:v1` y `grimorio-ruby:v1`.

## Curso de desarrollo con IA

`ia.html` es el quinto track. No ejecuta código ni llama a modelos externos: presenta seis lecciones narradas y comprueba la respuesta del alumno contra una **rúbrica de criterios** (`js/data/aiLessons.js`). Cada lección tiene plantilla, checklist visible, tres pistas progresivas y XP. La comprobación revisa palabras clave con expresiones regulares (`required`, `anyOf`, `forbidden` y `minWords`) y devuelve qué falta, sin entregar una respuesta única.

Contenido: prompt con cinco sellos, contexto de depuración, revisión con evidencia, tests antes que fe, fuentes y versiones, y higiene de secretos. El progreso se guarda en `grimorio-ia:v1`.

## Agregar escenas o desafíos

- Escenas de JavaScript: editar `js/data/story.js`. Cada objeto sigue el esquema `id`, `act`, `title`, `narrative`, `theory`, `objective`, `initialCode`, `oracleHints`, `validation`, `rewards` y `nextScene`.
- Lecciones de código: agregar objetos con `id`, `act`, `title`, `narrative`, `concept`, `code`, `instruction`, `expectedOutput`, `hints`, `xp` e `item` en el archivo de lecciones correspondiente.
- Lecciones de IA: agregar objetos con `id`, `act`, `title`, `narrative`, `concept`, `task`, `starter`, `checklist`, `hints`, `answer` (`minWords`, `required`, `anyOf`, `forbidden`, `success`), `xp` e `item` en `js/data/aiLessons.js`.
- Desafíos: agregar objetos con `id`, `title`, `statement`, `constraints`, `example`, `options`, `solutionCheck`, `hints` y `xp` dentro de `CHALLENGES[lenguaje][nivel]` en `js/data/challenges.js`. `solutionCheck` lleva `required`, `forbidden` opcional y `hint`. El contador total se calcula solo.

## Nota de seguridad

El Worker aísla la ejecución del hilo principal y limita el tiempo de ejecución, pero es una barrera *educativa*, no un sandbox criptográfico: no expongas esta aplicación a código no confiable en un entorno de producción.
