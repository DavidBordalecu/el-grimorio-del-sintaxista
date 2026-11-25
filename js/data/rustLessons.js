/**
 * Curso de Rust basado en ejecución externa: el alumno completa el código,
 * lo corre en Rust Playground o en su equipo y pega la salida exacta.
 * Cada lección explica la teoría dentro de la historia antes de pedir el código.
 */
export const LESSONS = [
  {
    id: 'rs_variables',
    act: 'Lección I · La Aldea de las Runas',
    title: 'Runas inmutables por defecto',
    narrative: 'El guardián te entrega una runa de hierro y te advierte: «En esta torre nada se mueve salvo que des permiso». Rust toma esa advertencia en serio: una variable normal es inmutable y el compilador te detiene si intentás cambiarla.',
    concept: '`let nombre = valor;` crea una runa inmutable. Si querés reasignarla, tenés que escribir `let mut nombre = valor;` desde el principio: el `mut` es el permiso explícito para cambiar.\n\n`+=` es una forma corta de sumar y guardar: `monedas += 1;` equivale a `monedas = monedas + 1;`.\n\n`println!("{}", monedas);` imprime el valor entre paréntesis. El `{}` es un hueco que Rust rellena con la variable que le pasás después.',
    code: 'fn main() {\n    let mut monedas = 15;\n    monedas ______ 1;\n    println!("{}", monedas);\n}',
    instruction: 'Sumale una moneda a `monedas` y mostrá el total por pantalla.',
    expectedOutput: '16',
    hints: [
      'Rust usa `+=` para sumar y reasignar en una sola línea.',
      'El resultado debe ser un único número: 16.'
    ],
    xp: 45,
    item: 'Runa de Mutabilidad (mut)'
  },
  {
    id: 'rs_borrow',
    act: 'Lección II · El Puente del Guardián',
    title: 'Préstamos sin dolor',
    narrative: 'El puente solo deja pasar si sabés pedir prestado sin romper la cadena. El guardián pone una cadena sobre el suelo: «No la arranques. Acercate, leela y seguí; el dueño sigue siendo su dueño.»',
    concept: 'En Rust, un valor tiene un dueño. Podés prestarlo con `&nombre`: eso crea una referencia que solo permite leer. `len()` no necesita ser dueño, así que le basta con un préstamo.\n\nComo `nombre` sigue siendo dueño de la cadena, después de medirla podés imprimirla. Si hubieras movido la cadena en lugar de prestarla, ya no estaría disponible.\n\nEl compilador verifica esto antes de ejecutar. Por eso los errores de préstamo aparecen al compilar, no en la consola.',
    code: 'fn main() {\n    let nombre = String::from("glim");\n    let longitud = ______.len();\n    println!("{} {}", longitud, nombre);\n}',
    instruction: 'Calculá la longitud de `nombre` y mostrá la longitud y la cadena separadas por un espacio.',
    expectedOutput: '4 glim',
    hints: [
      'La variable que querés medir es `nombre`.',
      '`len()` devuelve la cantidad de caracteres; `glim` tiene 4.'
    ],
    xp: 60,
    item: 'Préstamo inmutable (&T)'
  },
  {
    id: 'rs_result',
    act: 'Lección III · La Torre de los Autómatas',
    title: 'La runa que puede fallar',
    narrative: 'La torre guarda pergaminos que a veces no existen. Otros lenguajes lanzan excepciones y cortan el hilo; Rust prefiere avisar con un valor. El pergamino puede traer un número o un error, y la firma de la función lo dice abiertamente.',
    concept: '`Result<T, E>` es un tipo con dos caminos: `Ok(valor)` cuando todo salió bien y `Err(error)` cuando falló. La flecha `-> Result<i32, ParseIntError>` obliga a la función a devolver uno de los dos.\n\nEl operador `?` significa: «si hay error, devolvelo ahora; si no, seguí con el valor». Por eso `texto.parse()?` convierte el texto en número sin manejar el error a mano.\n\nLa última expresión de la función debe ser `Ok(numero * 2)`: en Rust la última línea sin punto y coma es el retorno.',
    code: 'fn duplicar(texto: &str) -> Result<i32, std::num::ParseIntError> {\n    let numero: i32 = texto.parse()?;\n    ______(numero * 2)\n}\n\nfn main() {\n    println!("{}", duplicar("21").unwrap());\n}',
    instruction: 'Devolvé el número duplicado dentro de un `Result` y mostrá el valor final.',
    expectedOutput: '42',
    hints: [
      'La función `duplicar` ya convirtió el texto en número con `?`.',
      'Necesitás envolver la expresión en el constructor de éxito de `Result`.'
    ],
    xp: 55,
    item: 'Propagación con ?'
  },
  {
    id: 'rs_match',
    act: 'Lección IV · El Oráculo del Abismo',
    title: 'El juicio exhaustivo',
    narrative: 'El Oráculo exige que cada respuesta posible esté contemplada. No acepta «ya veremos qué pasa»: si una rama falta, el compilador se niega a grabar la runa.',
    concept: '`match` compara un valor contra patrones y ejecuta la rama que coincide. Con `Option<T>` hay dos posibilidades: `Some(valor)` cuando hay algo y `None` cuando no hay nada.\n\nSer exhaustivo significa cubrir todos los casos posibles. Por eso el brazo que falta es `None`: sin él, el compilador avisa que la respuesta no está completa.\n\n`format!("Sello: {}", v)` construye un texto insertando el valor de `v` en el hueco `{}`.',
    code: 'fn main() {\n    let llave: Option<&str> = Some("hierro");\n\n    let mensaje = match llave {\n        Some(v) => format!("Sello: {}", v),\n        ______ => String::from("Sin sello"),\n    };\n\n    println!("{}", mensaje);\n}',
    instruction: 'Completá el brazo que falta y mostrá el mensaje resultante.',
    expectedOutput: 'Sello: hierro',
    hints: [
      'Falta cubrir el caso en el que no hay ninguna llave.',
      'El patrón que falta es `None`.'
    ],
    xp: 50,
    item: 'Patrones exhaustivos (match)'
  }
];
