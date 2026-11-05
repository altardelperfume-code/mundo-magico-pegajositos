// =====================================================================
//  DATOS DEL MUNDO MÁGICO — edita aquí personajes, lugares y actividades.
//  No hace falta tocar el resto del código para cambiar el contenido.
// =====================================================================

export const CONFIG = {
  appName: 'El Mundo Mágico de los Pegajositos Ecológicos',
  // Ruta del logo del colegio (por ejemplo 'assets/logo-colegio.png').
  // Mientras sea null se muestra un espacio reservado: no inventamos el logo.
  schoolLogo: null,
  schoolName: 'Mi colegio',
  credits: 'Personajes creados por los estudiantes de 4A · 2022',
  // Cuántos retos de un lugar hay que completar para abrir el siguiente.
  retosParaDesbloquear: 2,
};

// ---------------------------------------------------------------------
//  PERSONAJES PRINCIPALES (ilustraciones procesadas)
// ---------------------------------------------------------------------
export const CHARACTERS = {
  romina: {
    name: 'Romina', value: 'Ser amigable', motto: 'Lo mío es ser AMIGABLE',
    img: 'assets/personajes/romina.webp', color: '#f59e0b', soft: '#fff3d6',
    about: 'Romina lleva una corona dorada y tres ojitos de colores. Siempre saluda primero e invita a todos a jugar.',
    greeting: '¡Hola, explorador! Soy Romina. ¡Juntos haremos muchos amigos!',
  },
  celestial: {
    name: 'Celestial', value: 'Respetar', motto: 'Lo mío es RESPETAR',
    img: 'assets/personajes/celestial.webp', color: '#7c3aed', soft: '#efe7ff',
    about: 'Celestial es un cuadrito de colores con tres ojos. Escucha con atención y espera su turno.',
    greeting: '¡Hola! Soy Celestial. Respetar es escuchar y tratar bien a los demás.',
  },
  gatiamor: {
    name: 'GATIAMOR', value: 'El amor', motto: 'Lo mío es el AMOR',
    img: 'assets/personajes/gatiamor.webp', color: '#e11d63', soft: '#ffe4ee',
    about: 'GATIAMOR es una gatita rosada con un corazón en la pancita. Reparte cariño a donde va.',
    greeting: '¡Miau! Soy GATIAMOR. Un abrazo y una palabra bonita cambian el día.',
  },
  hielosi: {
    name: 'Hielosi', value: 'La solidaridad', motto: 'Lo mío es la SOLIDARIDAD',
    img: 'assets/personajes/hielosi.webp', color: '#1d5fb0', soft: '#e1edff',
    about: 'Hielosi es azul y alargado, con dos ojitos uno encima del otro. Siempre ayuda a quien lo necesita.',
    greeting: '¡Hola! Soy Hielosi. Si alguien necesita ayuda, ¡ahí estaré!',
  },
  aquarius: {
    name: 'Aquarius', value: 'Cuidar el agua', motto: 'Lo mío es cuidar el AGUA',
    img: 'assets/personajes/aquarius.webp', color: '#0ea5e9', soft: '#dff5ff',
    about: 'Aquarius es una gotita gigante y sonriente. Cuida cada gota de los ríos y del colegio.',
    greeting: '¡Glu glu! Soy Aquarius. Cada gota cuenta, ¡cuidémosla!',
  },
  popi: {
    name: 'Popi', value: 'Cuidar el colegio', motto: 'Lo mío es CUIDAR EL COLEGIO',
    img: 'assets/personajes/popi.webp', color: '#db2777', soft: '#ffe3f1',
    about: 'Popi es fucsia, con un ojo enorme, brazos amarillos y patitas azules. Mantiene el colegio limpio y bonito.',
    greeting: '¡Hola! Soy Popi. Nuestro colegio es de todos, ¡lo cuidamos juntos!',
  },
  rosebell: {
    name: 'Rosebell', value: 'Cuidar la naturaleza', motto: 'Lo mío es CUIDAR LA NATURALEZA',
    img: 'assets/personajes/rosebell.webp', color: '#16a34a', soft: '#e3f9e8',
    about: 'Rosebell es una flor con pétalos de todos los colores. Protege las plantas, los árboles y los animales.',
    greeting: '¡Hola! Soy Rosebell. Las plantas también son nuestras amigas.',
  },
  chochito: {
    name: 'Chochito', value: 'La responsabilidad', motto: 'Lo mío es la RESPONSABILIDAD',
    img: 'assets/personajes/chochito.webp', color: '#0284c7', soft: '#ddf2ff',
    about: 'Chochito es azul con borde rosado, tres ojos grandes y antenas. Cumple lo que promete.',
    greeting: '¡Hola! Soy Chochito. Ser responsable es cumplir con lo que me toca.',
  },
};

// Más Pegajositos de la hoja original del 4A (ilustraciones originales).
// Para agregar otro personaje: añade un objeto con name, value e img.
export const MORE_FRIENDS = [
  { name: 'Polix', value: 'El respeto', img: 'assets/amigos/polix.webp' },
  { name: 'Head Sun', value: 'La amistad', img: 'assets/amigos/head-sun.webp' },
  { name: 'Team Jukilop', value: 'La felicidad', img: 'assets/amigos/team-jukilop.webp' },
  { name: 'Fermín', value: 'La responsabilidad', img: 'assets/amigos/fermin.webp' },
  { name: 'Pupilo', value: 'La verdad', img: 'assets/amigos/pupilo.webp' },
  { name: 'Many', value: 'La solidaridad', img: 'assets/amigos/many.webp' },
  { name: 'Bobi', value: 'La verdad', img: 'assets/amigos/bobi.webp' },
  { name: 'Malory', value: 'La responsabilidad', img: 'assets/amigos/malory.webp' },
];

// ---------------------------------------------------------------------
//  MENSAJES DE ÁNIMO
// ---------------------------------------------------------------------
export const MESSAGES = {
  correct: [
    '¡Excelente! ¡Lo lograste!',
    '¡Muy bien, explorador!',
    '¡Tu decisión ayuda a nuestro planeta!',
    '¡Has aprendido algo maravilloso!',
  ],
  wrong: [
    '¡Casi lo consigues! Vamos a intentarlo otra vez.',
    'No pasa nada. ¡Aprendamos juntos!',
    'Mira esta pista y vuelve a intentarlo.',
  ],
};

// ---------------------------------------------------------------------
//  LUGARES DEL MAPA Y SUS ACTIVIDADES
//  x / y = posición en el mapa (porcentaje). focus = recorte del mapa
//  usado como ilustración del lugar.
//  Tipos de actividad: quiz · series · sort · find · story · order · match
// ---------------------------------------------------------------------
export const ZONES = [
  {
    id: 'bosque',
    name: 'Bosque de la Amistad',
    short: 'Bosque',
    guide: 'romina',
    friends: ['celestial', 'gatiamor'],
    color: '#22a35a',
    x: 17.7, y: 32.5, focus: '12% 25%',
    medal: { name: 'Medalla de la Amistad', icon: '💚' },
    story: 'En este bosque los árboles crecen cuando los amigos se tratan con cariño. ¡Ayuda a Romina, Celestial y GATIAMOR a llenarlo de alegría!',
    activities: [
      {
        id: 'b1', type: 'quiz', label: 'Situación', host: 'romina',
        title: 'El niño nuevo',
        prompt: 'Llega un niño nuevo al salón. En el recreo está solito. ¿Qué haces?',
        scene: ['🧒', '🌳', '⚽'],
        options: [
          { text: 'Lo invito a jugar conmigo', icon: '🤝', correct: true,
            why: '¡Así nace una amistad! Ser amigable es hacer que todos se sientan parte del grupo.' },
          { text: 'Sigo jugando sin mirarlo', icon: '🙈',
            hint: 'Imagina que tú eres el nuevo. ¿Qué te gustaría que hicieran por ti?' },
          { text: 'Me río porque no conoce a nadie', icon: '😝',
            hint: 'Las burlas ponen triste a la gente. Busca la opción que lo haría sonreír.' },
        ],
      },
      {
        id: 'b2', type: 'series', label: 'Completa el reto', host: 'celestial',
        title: 'Palabras mágicas',
        prompt: 'Elige la palabra mágica para cada momento.',
        items: [
          { text: 'Cuando pido algo, digo…', emoji: '🙏', options: ['¡Dame eso ya!', 'Por favor', 'Nada'], answer: 1,
            explain: '“Por favor” hace que los demás quieran ayudarte.' },
          { text: 'Cuando alguien me ayuda, digo…', emoji: '🎁', options: ['Gracias', '¿Y qué?', 'Ya era hora'], answer: 0,
            explain: 'Dar las gracias demuestra que valoras lo que hacen por ti.' },
          { text: 'Si empujo a alguien sin querer, digo…', emoji: '🤕', options: ['¡Quítate!', 'Fue tu culpa', 'Perdón'], answer: 2,
            explain: 'Pedir perdón ayuda a que todos estén bien otra vez.' },
          { text: 'Cuando llego al salón, digo…', emoji: '🏫', options: ['¡Buenos días!', 'Nada', '¡Uff!'], answer: 0,
            explain: 'Un saludo alegre es el comienzo de un buen día.' },
        ],
      },
      {
        id: 'b3', type: 'story', label: 'Historia interactiva', host: 'gatiamor',
        title: 'El dibujo mojado',
        prompt: 'Elige qué hace GATIAMOR y mira cómo cambia la historia.',
        start: 'a',
        nodes: {
          a: { who: 'celestial', scene: ['🖼️', '💧', '😢'],
               text: 'A Celestial se le cayó su dibujo en un charco. Está muy triste. ¿Qué hace GATIAMOR?',
               choices: [
                 { text: 'Le ayuda a recogerlo y le da un abrazo', icon: '🤗', next: 'b' },
                 { text: 'Se ríe del dibujo mojado', icon: '😹', next: 'oops1' },
               ] },
          b: { who: 'gatiamor', scene: ['🤗', '🖍️', '🙂'],
               text: 'Celestial sonríe un poquito. ¿Cómo pueden alegrarse aún más?',
               choices: [
                 { text: 'Hacer juntos un dibujo nuevo', icon: '🎨', next: 'fin' },
                 { text: 'Decirle que de todas formas era feo', icon: '👎', next: 'oops2' },
               ] },
          oops1: { who: 'celestial', scene: ['😢', '💔'], end: 'retry',
                   text: 'Celestial se sintió peor. Reírse del problema de alguien lastima su corazón. ¡Probemos otra vez!' },
          oops2: { who: 'celestial', scene: ['😞'], end: 'retry',
                   text: 'Las palabras también pueden doler. Elijamos palabras con amor.' },
          fin: { who: 'gatiamor', scene: ['🎨', '💖', '😄'], end: 'good',
                 text: '¡El nuevo dibujo quedó precioso! El amor se nota en lo que hacemos por los demás.' },
        },
      },
      {
        id: 'b4', type: 'series', label: 'Verdadero o falso', host: 'celestial',
        title: '¿Qué es respetar?',
        prompt: 'Lee cada frase. ¿Es verdadera o falsa?',
        tf: true,
        items: [
          { text: 'Respetar es escuchar cuando otra persona habla.', emoji: '👂', answer: 0,
            explain: '¡Sí! Escuchar es una forma de decir “me importas”.' },
          { text: 'Si alguien piensa diferente, debo gritarle.', emoji: '📢', answer: 1,
            explain: 'Podemos pensar distinto y seguir siendo amigos.' },
          { text: 'Esperar mi turno en el columpio es respetar.', emoji: '🎠', answer: 0,
            explain: '¡Exacto! Todos merecen su turno.' },
          { text: 'Puedo tomar las cosas de otros sin pedir permiso.', emoji: '✏️', answer: 1,
            explain: 'Siempre pedimos permiso antes de usar algo que no es nuestro.' },
        ],
      },
    ],
  },
  {
    id: 'rio',
    name: 'Río de las Buenas Acciones',
    short: 'Río',
    guide: 'aquarius',
    friends: [],
    color: '#1590d8',
    x: 26.6, y: 82, focus: '15% 88%',
    medal: { name: 'Medalla Guardián del Agua', icon: '💧' },
    story: 'Aquarius cuida cada gota de este río. Pero alguien dejó basura en el agua… ¡ayúdalo a dejarlo brillante!',
    activities: [
      {
        id: 'r1', type: 'find', label: 'Encuentra', host: 'aquarius',
        title: '¡Limpia el río!',
        prompt: 'Toca toda la basura que hay en el río y en la orilla.',
        bg: 'assets/mundo/bienvenida.webp',
        targets: [
          { icon: '🧴', name: 'una botella', x: 22, y: 77 },
          { icon: '🥫', name: 'una lata', x: 37, y: 86 },
          { icon: '🛍️', name: 'una bolsa', x: 13, y: 64 },
          { icon: '🥤', name: 'un vaso', x: 47, y: 51 },
          { icon: '🍬', name: 'una envoltura', x: 64, y: 63 },
          { icon: '📰', name: 'un periódico', x: 80, y: 52 },
        ],
        decoys: [
          { icon: '🐟', x: 30, y: 70, say: '¡Ese pececito vive aquí! Busca la basura.' },
          { icon: '🦆', x: 62, y: 47, say: 'El patito está feliz nadando. Sigue buscando.' },
          { icon: '🐸', x: 9, y: 85, say: 'La ranita es parte del río. ¡No es basura!' },
        ],
        done: '¡El río brilla otra vez! La basura en el agua enferma a los peces y a las plantas.',
      },
      {
        id: 'r2', type: 'quiz', label: 'Pregunta ilustrada', host: 'aquarius',
        title: 'Hora de cepillarse',
        prompt: 'Te estás cepillando los dientes. ¿Qué haces con la llave del agua?',
        scene: ['🪥', '🚰', '😁'],
        options: [
          { text: 'La cierro mientras me cepillo', icon: '✋', correct: true,
            why: '¡Bien hecho! Así ahorras muchos litros de agua cada día.' },
          { text: 'La dejo abierta todo el tiempo', icon: '🌊',
            hint: 'Mientras te cepillas, el agua se va por el desagüe sin usarla. ¿Cómo podrías guardarla?' },
          { text: 'La abro todavía más fuerte', icon: '💦',
            hint: 'Más agua no limpia mejor tus dientes. Piensa en ahorrar.' },
        ],
      },
      {
        id: 'r3', type: 'story', label: 'Historia interactiva', host: 'aquarius',
        title: 'La llave que gotea',
        prompt: 'Decide qué hacer y descubre qué pasa.',
        start: 'a',
        nodes: {
          a: { who: 'aquarius', scene: ['🚰', '💧', '💧'],
               text: 'En el baño del colegio una llave gotea: plic, plic, plic. ¿Qué haces?',
               choices: [
                 { text: 'Le aviso a la profe o a un adulto', icon: '🙋', next: 'fin' },
                 { text: 'La ignoro: no es mi problema', icon: '🤷', next: 'b' },
               ] },
          b: { who: 'aquarius', scene: ['🪣', '😟'],
               text: 'Al final del día se perdió ¡un balde entero de agua! Aquarius está preocupado. ¿Y ahora?',
               choices: [
                 { text: 'Le aviso a un adulto para que la arreglen', icon: '🙋', next: 'fin' },
                 { text: 'Sigo sin decir nada', icon: '🤐', next: 'oops' },
               ] },
          oops: { who: 'aquarius', scene: ['💧', '💧', '💧', '😢'], end: 'retry',
                  text: 'El agua se sigue perdiendo. Cuidar el agua es tarea de todos. ¡Intentemos de nuevo!' },
          fin: { who: 'aquarius', scene: ['🔧', '✨', '😄'], end: 'good',
                 text: '¡La arreglaron! Una buena acción salva miles de gotas.' },
        },
      },
      {
        id: 'r4', type: 'series', label: 'Verdadero o falso', host: 'aquarius',
        title: 'Secretos del agua',
        prompt: '¿Verdadero o falso?',
        tf: true,
        items: [
          { text: 'El agua del planeta nunca se acaba.', emoji: '🌍', answer: 1,
            explain: 'El agua dulce que podemos tomar es poquita. ¡Por eso la cuidamos!' },
          { text: 'Una ducha corta ahorra agua.', emoji: '🚿', answer: 0,
            explain: '¡Sí! Cinco minutos son suficientes.' },
          { text: 'Botar aceite por el lavaplatos ensucia los ríos.', emoji: '🫗', answer: 0,
            explain: 'El aceite contamina mucha agua. Se guarda en una botella y se entrega para reciclar.' },
          { text: 'Puedo regar las plantas con el agua de lavar frutas.', emoji: '🪴', answer: 0,
            explain: '¡Qué buena idea! Así el agua se usa dos veces.' },
        ],
      },
    ],
  },
  {
    id: 'reciclaje',
    name: 'Valle del Reciclaje',
    short: 'Reciclaje',
    guide: 'popi',
    friends: ['rosebell'],
    color: '#e0a200',
    x: 58.9, y: 32.5, focus: '58% 28%',
    medal: { name: 'Medalla Súper Recicladora', icon: '♻️' },
    story: 'Popi mantiene limpio el colegio y Rosebell cuida las plantas. En este valle cada residuo tiene su lugar.',
    activities: [
      {
        id: 'v1', type: 'sort', label: 'Clasifica', host: 'popi',
        title: '¿En qué caneca va?',
        prompt: 'Arrastra cada residuo a su caneca. También puedes tocar el residuo y luego la caneca.',
        bins: [
          { id: 'verde', name: 'Orgánicos', color: '#2e9e44', tip: 'Restos de comida y cáscaras' },
          { id: 'blanca', name: 'Aprovechables', color: '#f4f6f8', ink: '#334155', tip: 'Plástico, papel, cartón, vidrio y metal limpios' },
          { id: 'negra', name: 'No aprovechables', color: '#2b2f36', tip: 'Servilletas y papeles sucios' },
        ],
        items: [
          { icon: '🍌', name: 'Cáscara de banano', bin: 'verde', hint: 'Viene de una fruta: es un resto de comida.' },
          { icon: '🧴', name: 'Botella plástica limpia', bin: 'blanca', hint: 'El plástico limpio se puede volver a usar.' },
          { icon: '🧻', name: 'Servilleta usada', bin: 'negra', hint: 'Está sucia: ya no se puede reciclar.' },
          { icon: '📦', name: 'Caja de cartón', bin: 'blanca', hint: 'El cartón seco se recicla.' },
          { icon: '🍎', name: 'Corazón de manzana', bin: 'verde', hint: 'Es parte de una fruta.' },
          { icon: '🥫', name: 'Lata', bin: 'blanca', hint: 'El metal se puede derretir y volver a usar.' },
          { icon: '🥚', name: 'Cáscara de huevo', bin: 'verde', hint: 'Es un resto de la cocina.' },
          { icon: '📄', name: 'Hoja de papel', bin: 'blanca', hint: 'El papel limpio se vuelve papel nuevo.' },
          { icon: '🩹', name: 'Curita usada', bin: 'negra', hint: 'Algo usado y sucio no se recicla.' },
        ],
        done: '¡Todo en su lugar! Separar bien ayuda a que los residuos tengan una nueva vida.',
      },
      {
        id: 'v2', type: 'quiz', label: 'Situación', host: 'popi',
        title: 'Un papel en el patio',
        prompt: 'Ves un papel tirado en el patio del colegio. ¿Qué haces?',
        scene: ['📄', '🏫', '🍃'],
        options: [
          { text: 'Lo recojo y lo llevo a la caneca', icon: '🙌', correct: true,
            why: '¡Así se cuida el colegio! Un patio limpio es más bonito para todos.' },
          { text: 'Lo pateo hacia otro lado', icon: '🦶',
            hint: 'El papel sigue ahí, solo cambió de lugar. ¿Cómo lo quitamos de verdad?' },
          { text: 'Espero que otro lo recoja', icon: '⏳',
            hint: 'Popi dice: el colegio es de todos y lo cuidamos entre todos.' },
        ],
      },
      {
        id: 'v3', type: 'quiz', label: 'Pregunta ilustrada', host: 'rosebell',
        title: 'Una nueva vida',
        prompt: '¿Cómo le das una nueva vida a una botella plástica?',
        scene: ['🧴', '➡️', '🪴'],
        options: [
          { text: 'La tiro al río', icon: '🌊',
            hint: 'En el río la botella dañaría a los peces. ¡Piensa en algo creativo!' },
          { text: 'La convierto en una matera', icon: '🪴', correct: true,
            why: '¡Genial! Reutilizar es darle otro uso a las cosas antes de botarlas.' },
          { text: 'La quemo', icon: '🔥',
            hint: 'El humo contamina el aire que respiramos. Busca otra idea.' },
        ],
      },
      {
        id: 'v4', type: 'order', label: 'Completa el reto', host: 'rosebell',
        title: 'Siembra una planta',
        prompt: 'Toca los pasos en el orden correcto para sembrar una planta.',
        steps: [
          { text: 'Hacer un hoyo en la tierra', icon: '🕳️' },
          { text: 'Poner la semilla', icon: '🌰' },
          { text: 'Taparla con tierra', icon: '🟫' },
          { text: 'Regarla con agua', icon: '💧' },
        ],
        hint: 'Piensa: ¿qué se hace primero para que la semilla tenga dónde estar?',
        done: '¡Muy bien! Con agua, sol y cariño la semillita crecerá.',
      },
    ],
  },
  {
    id: 'montana',
    name: 'Montaña de los Valores',
    short: 'Montaña',
    guide: 'chochito',
    friends: ['hielosi'],
    color: '#7c4dd8',
    x: 86, y: 37.5, focus: '95% 30%',
    medal: { name: 'Medalla de los Valores', icon: '🏔️' },
    story: 'En la cima viven Chochito y Hielosi. Para subir la montaña hay que tomar buenas decisiones.',
    activities: [
      {
        id: 'm1', type: 'story', label: 'Historia interactiva', host: 'chochito',
        title: 'Tarea o juego',
        prompt: 'Elige qué hace Chochito y mira lo que pasa.',
        start: 'a',
        nodes: {
          a: { who: 'chochito', scene: ['📚', '⚽'],
               text: 'Chochito tiene tarea y sus amigos lo invitan a jugar. ¿Qué hace?',
               choices: [
                 { text: 'Hace la tarea primero y luego juega', icon: '✅', next: 'fin' },
                 { text: 'Juega primero y deja la tarea para después', icon: '🏃', next: 'b' },
               ] },
          b: { who: 'chochito', scene: ['🌙', '📚', '😴'],
               text: 'Jugó tanto que ya es de noche, está cansado… ¡y la tarea sigue sin hacer! ¿Qué hace ahora?',
               choices: [
                 { text: 'Hace lo que puede y mañana se organiza mejor', icon: '📝', next: 'fin2' },
                 { text: 'Dice que el perro se comió la tarea', icon: '🐶', next: 'oops' },
               ] },
          oops: { who: 'chochito', scene: ['🙊'], end: 'retry',
                  text: 'Decir mentiras no arregla el problema. ¡Busquemos una mejor decisión!' },
          fin: { who: 'chochito', scene: ['✅', '⚽', '😄'], end: 'good',
                 text: '¡Terminó la tarea y jugó tranquilo! Ser responsable es cumplir con lo que te toca.' },
          fin2: { who: 'chochito', scene: ['📝', '🌅', '🙂'], end: 'good',
                  text: 'Chochito aprendió algo: organizarse primero hace todo más fácil. ¡Eso también es responsabilidad!' },
        },
      },
      {
        id: 'm2', type: 'quiz', label: 'Situación', host: 'hielosi',
        title: 'La lonchera olvidada',
        prompt: 'A un compañero se le olvidó la lonchera y tiene hambre. ¿Qué haces?',
        scene: ['🥪', '🍎', '🧒'],
        options: [
          { text: 'Me como todo rápido para que no me pida', icon: '😬',
            hint: 'Piensa cómo se siente tener hambre. ¿Cómo podrías ayudarlo?' },
          { text: 'Le digo que es su culpa', icon: '☝️',
            hint: 'Todos olvidamos cosas a veces. ¿Qué haría Hielosi?' },
          { text: 'Comparto un poco de mi merienda', icon: '🤲', correct: true,
            why: '¡Eso es solidaridad! Ayudar a quien lo necesita nos hace más fuertes.' },
        ],
      },
      {
        id: 'm3', type: 'match', label: 'Une las parejas', host: 'chochito',
        title: 'Cada uno con su valor',
        prompt: 'Toca un Pegajosito y luego el valor que representa.',
        pairs: ['romina', 'celestial', 'gatiamor', 'hielosi', 'aquarius', 'chochito'],
        done: '¡Conoces muy bien a tus amigos y sus valores!',
      },
      {
        id: 'm4', type: 'series', label: '¿Responsable?', host: 'hielosi',
        title: '¿Es responsable?',
        prompt: 'Decide si cada acción es responsable o no.',
        items: [
          { text: 'Guardo mis juguetes después de jugar.', emoji: '🧸', options: ['Responsable', 'No es responsable'], answer: 0,
            explain: '¡Muy bien! Así nada se pierde ni se daña.' },
          { text: 'Dejo la luz encendida al salir del salón.', emoji: '💡', options: ['Responsable', 'No es responsable'], answer: 1,
            explain: 'Apagar la luz ahorra energía y cuida el planeta.' },
          { text: 'Riego la planta del salón cuando me toca.', emoji: '🪴', options: ['Responsable', 'No es responsable'], answer: 0,
            explain: '¡Eso es cumplir con tu tarea!' },
          { text: 'Dejo mis útiles tirados y se pierden.', emoji: '🎒', options: ['Responsable', 'No es responsable'], answer: 1,
            explain: 'Cuidar nuestras cosas también es ser responsable.' },
        ],
      },
    ],
  },
];

// El Jardín de las Recompensas es el lugar especial donde se ven los logros.
export const GARDEN = {
  id: 'jardin', name: 'Jardín de las Recompensas', short: 'Jardín',
  guide: 'rosebell', color: '#e0457b', x: 78.6, y: 86,
};

// ---------------------------------------------------------------------
//  INSIGNIAS (se ganan por esfuerzo y aprendizaje, no por velocidad)
// ---------------------------------------------------------------------
export const BADGES = [
  { id: 'primer-paso', name: 'Primer paso', icon: '👣', desc: 'Completa tu primer reto.' },
  { id: 'perseverante', name: 'Nunca me rindo', icon: '💪', desc: 'Acierta después de equivocarte.' },
  { id: 'conoce-equipo', name: 'Amigo de todos', icon: '🫶', desc: 'Conoce a los 8 Pegajositos.' },
  { id: 'amigo-agua', name: 'Amigo del agua', icon: '🐟', desc: 'Limpia el río de Aquarius.' },
  { id: 'reciclador', name: 'Maestro reciclador', icon: '♻️', desc: 'Separa todos los residuos.' },
  { id: 'racha-5', name: 'Racha brillante', icon: '🔥', desc: 'Acierta 5 veces seguidas.' },
  { id: 'estrellas-15', name: 'Cielo estrellado', icon: '🌟', desc: 'Reúne 15 estrellas.' },
  { id: 'explorador', name: 'Gran explorador', icon: '🧭', desc: 'Completa los 4 lugares del mapa.' },
];
