# El Mundo Mágico de los Pegajositos Ecológicos

Aventura web educativa para niños: exploran un mapa mágico con los Pegajositos, superan retos sobre valores y cuidado del planeta y ganan estrellas, insignias y medallas.

Es un sitio estático (HTML + CSS + JavaScript, sin dependencias ni claves). Funciona en celulares, tabletas y computadores, se puede instalar como app (PWA) y guarda el progreso en el navegador del dispositivo.

## Qué incluye

- **Inicio** con los 8 Pegajositos, mensaje de bienvenida y el espacio para el logo del colegio.
- **Mapa** con 4 lugares que se desbloquean (2 retos completados abren el siguiente) y el Jardín de las Recompensas.
- **16 actividades** de 7 tipos: pregunta/situación, verdadero o falso, palabras mágicas, clasificar residuos (arrastrar o tocar), encontrar basura en el río, historias con decisiones, ordenar pasos y unir parejas.
- **Voces de personajes**: cada Pegajosito habla con su propia voz (grabada con Piper, TTS libre), dice las instrucciones, pistas y felicitaciones, y se puede repetir con 🔊. El botón de sonido lo silencia todo.
- **Retroalimentación** amable con pistas y sonidos.
- **Premios**: estrellas (3 a la primera, 2 o 1 si hubo errores; siempre se puede repetir), puntos, 8 insignias, 4 medallas y el jardín que florece.
- **Personajes**: fichas de los 8 protagonistas y galería con los demás Pegajositos del 4A.

## Probar en el computador

```bash
python -m http.server 5173
```

Luego abre `http://localhost:5173`. (Con doble clic sobre `index.html` no funciona, porque los navegadores bloquean los módulos JavaScript abiertos como archivo.)

## Editar el contenido

Todo el contenido está en **`js/data.js`**:

- `CONFIG.schoolLogo`: ruta del logo del colegio (ahora `assets/logo-colegio.webp`). Para cambiarlo, reemplaza ese archivo.
- `CHARACTERS`: nombre, valor, descripción y saludo de cada Pegajosito.
- `MORE_FRIENDS`: los demás Pegajositos de la galería.
- `ZONES`: lugares del mapa y sus actividades (preguntas, respuestas, pistas y explicaciones).
- `BADGES`: insignias.

Después de cambiar textos, vuelve a generar las voces (ver abajo). Si agregas o cambias imágenes, añade sus rutas a la lista `SHELL` de `sw.js` y cambia `CACHE` (por ejemplo `pegajositos-v2`) para que los celulares descarguen la versión nueva.

## Voces de los personajes

Las voces se generan en el computador con [Piper](https://github.com/rhasspy/piper), un sistema de voz libre que funciona sin internet, y se guardan como MP3 en `audio/voces/`. Cada personaje usa una voz base con su propio tono y velocidad (se ajustan en `CHARACTERS` dentro de `tools/voces/generar.py`).

```bash
pip install piper-tts lameenc numpy scipy
node tools/voces/frases.mjs
python tools/voces/generar.py
```

El primer comando instala lo necesario; el segundo lista todas las frases de `js/data.js` y `js/lines.js`; el tercero crea solo los audios nuevos (con `--todo` los rehace todos) y descarga las voces la primera vez. Si una frase no tiene audio, la app no la dice sola; con 🔊 usa la voz del navegador como respaldo.

Voces base: `es_MX-claude-high` (Apache-2.0), `es_AR-daniela-high` (CC BY-SA 4.0, dataset OpenSLR 61) y `es_MX-ald-medium` (Unlicense), de [rhasspy/piper-voices](https://huggingface.co/rhasspy/piper-voices).

## Estructura

```
index.html            carcasa de la app (HUD, pantalla, menú inferior)
css/styles.css        estilos mobile-first
js/data.js            datos editables
js/state.js           progreso guardado en localStorage
js/activities.js      motores de las actividades
js/app.js             pantallas, navegación y celebraciones
js/audio.js           sonidos y voces de los personajes
js/lines.js           frases que dicen los personajes
audio/voces/          voces grabadas (MP3) y manifest.json
tools/voces/          generador de voces con Piper
sw.js, manifest.webmanifest, assets/icons/   PWA (instalable y sin conexión)
assets/personajes/    8 Pegajositos procesados
assets/amigos/        otros Pegajositos de la hoja del 4A
assets/mundo/         escenarios (bosque y mapa)
```

## Publicar gratis

### GitHub Pages (el que se usa ahora)

1. Crea un repositorio público en GitHub y sube el contenido de esta carpeta.
2. En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch**, elige `main` y la carpeta `/ (root)`.
3. En uno o dos minutos la app queda en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

Con la terminal y GitHub CLI:

```bash
git init && git add . && git commit -m "Primera versión"
gh repo create NOMBRE-DEL-REPO --public --source . --push
gh api repos/TU-USUARIO/NOMBRE-DEL-REPO/pages -X POST -f "source[branch]=main" -f "source[path]=/"
```

Para actualizar: haz los cambios, `git add . && git commit -m "Cambios" && git push`.

### Alternativa: Netlify Drop

Entra a https://app.netlify.com/drop y arrastra esta carpeta completa. Netlify te da una URL HTTPS.

## Privacidad

No hay cuentas, formularios ni envío de datos. El progreso se guarda solo en el navegador del dispositivo y se puede borrar desde **Mis logros → Reiniciar progreso**.

Personajes creados por los estudiantes de 4A (2022).
