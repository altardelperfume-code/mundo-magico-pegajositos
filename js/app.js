// Navegación, pantallas, retroalimentación y celebraciones.
import { CONFIG, CHARACTERS, MORE_FRIENDS, ZONES, GARDEN, BADGES, MESSAGES } from './data.js';
import {
  state, save, resetProgress, totalStars, maxStars, zoneDone, zoneStatus, zoneUnlocked,
  progressPct, completeActivity, registerAnswer, markSeen,
} from './state.js';
import { ENGINES } from './activities.js';
import { play, speakAs, stopSpeaking } from './audio.js';
import { LINES } from './lines.js';

const $ = (s, r = document) => r.querySelector(s);
const screen = $('#screen');
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const charIds = Object.keys(CHARACTERS);
const zoneById = id => ZONES.find(z => z.id === id);

// ------------------------------------------------------------------ HUD
function updateHUD() {
  $('#hud-stars').textContent = totalStars();
  $('#hud-points').textContent = state.points;
  $('#hud-bar').style.width = progressPct() + '%';
  $('#hud-progress').setAttribute('aria-valuenow', progressPct());
  $('#hud-progress').title = `Progreso de la aventura: ${progressPct()}%`;
  const s = $('#btn-sound');
  s.setAttribute('aria-pressed', state.sound);
  s.querySelector('.ico').textContent = state.sound ? '🔊' : '🔇';
  s.querySelector('.lbl').textContent = state.sound ? 'Sonido' : 'Silencio';
}

function setNav(route) {
  document.querySelectorAll('.dock a').forEach(a =>
    a.classList.toggle('active', a.dataset.route === route));
  document.body.dataset.screen = route;
}

// ------------------------------------------------------------------ TOASTS
function toast(html, cls = '') {
  const t = document.createElement('div');
  t.className = 'toast ' + cls;
  t.innerHTML = html;
  $('#toasts').appendChild(t);
  setTimeout(() => t.classList.add('out'), 2600);
  setTimeout(() => t.remove(), 3100);
}
const announceBadges = list => list.forEach((b, i) =>
  setTimeout(() => { toast(`<span class="t-ico">${b.icon}</span><span><b>¡Nueva insignia!</b><br>${b.name}</span>`, 'badge'); play('win'); }, 400 + i * 900));

// ------------------------------------------------------------------ INICIO
function viewHome() {
  setNav('inicio');
  const logo = CONFIG.schoolLogo
    ? `<img class="school-logo" src="${CONFIG.schoolLogo}" alt="Logo de ${CONFIG.schoolName}">`
    : `<div class="school-logo placeholder" title="Agrega el logo en js/data.js → CONFIG.schoolLogo"><span>🏫</span>Logo del colegio</div>`;
  screen.innerHTML = `
    <section class="home">
      <div class="sparkles" aria-hidden="true">${'<i></i>'.repeat(14)}</div>
      <div class="home-card">
        <div class="card-head"><p class="kicker">✨ Una aventura para pequeños héroes</p>${logo}</div>
        <div class="crew-mini" aria-hidden="true">${charIds.map((id, i) => `<img src="${CHARACTERS[id].img}" alt="" style="--i:${i}">`).join('')}</div>
        <h1 class="title">El Mundo Mágico de los <span>Pegajositos Ecológicos</span></h1>
        <div class="bubble home-bubble">
          <img src="${CHARACTERS.romina.img}" alt="">
          <p>${LINES.homeGreeting}</p>
          <button class="icon-btn" data-char="romina" data-speak="${LINES.homeGreeting}" aria-label="Escuchar a Romina">🔊</button>
        </div>
        <a class="btn btn-sun btn-xl pulse" href="#mapa">🚀 ¡EMPEZAR AVENTURA!</a>
        <a class="btn btn-ghost" href="#personajes">🫶 Conocer a los personajes</a>
      </div>
      <div class="crew" aria-label="Los Pegajositos">
        ${charIds.map((id, i) => `<a href="#personajes/${id}" class="crew-member" style="--i:${i}" title="${CHARACTERS[id].name}">
          <img src="${CHARACTERS[id].img}" alt="${CHARACTERS[id].name}" loading="${i > 3 ? 'lazy' : 'eager'}"></a>`).join('')}
      </div>
    </section>`;
}

// ------------------------------------------------------------------ MAPA
const statusInfo = {
  locked: { ico: '🔒', txt: 'Bloqueado' },
  open: { ico: '✨', txt: '¡Disponible!' },
  progress: { ico: '▶️', txt: 'En progreso' },
  done: { ico: '🏅', txt: '¡Completado!' },
};

function viewMap() {
  setNav('mapa');
  const next = ZONES.find(z => zoneStatus(z) !== 'done' && zoneUnlocked(z));
  const marker = (z, i) => {
    const st = zoneStatus(z);
    const label = `${z.name}. ${statusInfo[st].txt}. ${zoneDone(z)} de ${z.activities.length} retos.`;
    return `
      <a class="spot st-${st} ${z === next ? 'is-next' : ''}" href="#lugar/${z.id}" style="left:${z.x}%;top:${z.y}%;--c:${z.color}" aria-label="${label}">
        <span class="spot-num">${i + 1}</span>
        <span class="spot-ring"><img src="${CHARACTERS[z.guide].img}" alt=""></span>
        <span class="spot-name">${z.name}</span>
        <span class="spot-status">${statusInfo[st].ico} ${st === 'locked' ? 'Bloqueado' : `${zoneDone(z)}/${z.activities.length}`}</span>
      </a>`;
  };
  screen.innerHTML = `
    <section class="map-screen">
      <header class="screen-head">
        <h1>🗺️ Explora el mundo</h1>
        <p>${next ? `Toca <b>${next.name}</b> para seguir tu aventura.` : '¡Completaste todo el mundo! Visita el Jardín.'}</p>
      </header>
      <div class="map-frame">
        <div class="map-scroll" tabindex="0" aria-label="Mapa del mundo. Desliza para ver más lugares.">
          <div class="map">
            ${ZONES.map(marker).join('')}
            <a class="spot st-garden" href="#logros" style="left:${GARDEN.x}%;top:${GARDEN.y}%;--c:${GARDEN.color}" aria-label="${GARDEN.name}: tus logros">
              <span class="spot-num">🏆</span>
              <span class="spot-ring"><img src="${CHARACTERS[GARDEN.guide].img}" alt=""></span>
              <span class="spot-name">${GARDEN.name}</span>
              <span class="spot-status">🏅 ${state.medals.length}/${ZONES.length}</span>
            </a>
          </div>
        </div>
        <p class="swipe-hint" aria-hidden="true">👈 Desliza el mapa 👉</p>
      </div>
      <div class="place-list">
        ${ZONES.map((z, i) => {
          const st = zoneStatus(z);
          return `<a class="place-chip st-${st}" href="#lugar/${z.id}" style="--c:${z.color}">
            <img src="${CHARACTERS[z.guide].img}" alt=""><span><b>${i + 1}. ${z.short}</b><small>${statusInfo[st].ico} ${statusInfo[st].txt}</small></span></a>`;
        }).join('')}
      </div>
    </section>`;
  // En celulares centra el mapa en el siguiente lugar disponible.
  const sc = $('.map-scroll');
  if (next && sc.scrollWidth > sc.clientWidth) {
    requestAnimationFrame(() => { sc.scrollLeft = sc.scrollWidth * next.x / 100 - sc.clientWidth / 2; });
  }
  if (!state.visitedMap) { state.visitedMap = true; save(); }
}

// ------------------------------------------------------------------ LUGAR
function viewZone(id) {
  const z = zoneById(id);
  if (!z) return go('mapa');
  setNav('mapa');
  const g = CHARACTERS[z.guide];
  if (!zoneUnlocked(z)) {
    const prev = ZONES[ZONES.indexOf(z) - 1];
    screen.innerHTML = `
      <section class="zone locked-zone" style="--c:${z.color}">
        <div class="zone-hero" style="--focus:${z.focus}"><span class="lock-big">🔒</span></div>
        <div class="bubble"><img src="${g.img}" alt=""><p>${LINES.locked(prev)}</p><button class="icon-btn" data-char="${z.guide}" data-speak="${LINES.locked(prev)}" aria-label="Escuchar">🔊</button></div>
        <div class="row-btns"><a class="btn btn-sun" href="#lugar/${prev.id}">Ir a ${prev.short}</a><a class="btn btn-ghost" href="#mapa">🗺️ Volver al mapa</a></div>
      </section>`;
    speakAs(z.guide, LINES.locked(prev));
    return;
  }
  screen.innerHTML = `
    <section class="zone" style="--c:${z.color}">
      <a class="back" href="#mapa">⬅ Mapa</a>
      <div class="zone-hero" style="--focus:${z.focus}">
        <div class="zone-cast">
          ${[z.guide, ...z.friends].map((c, i) => `<img class="cast-${i}" src="${CHARACTERS[c].img}" alt="${CHARACTERS[c].name}">`).join('')}
        </div>
        <h1>${z.name}</h1>
      </div>
      <div class="bubble">
        <img src="${g.img}" alt="">
        <p>${z.story}</p>
        <button class="icon-btn" data-char="${z.guide}" data-speak="${z.story}" aria-label="Escuchar a ${g.name}">🔊</button>
      </div>
      <div class="zone-progress">
        <span>Retos: <b>${zoneDone(z)} / ${z.activities.length}</b></span>
        <span class="medal-slot ${state.medals.includes(z.id) ? 'got' : ''}" title="${z.medal.name}">${z.medal.icon} ${state.medals.includes(z.id) ? z.medal.name : 'Medalla por ganar'}</span>
      </div>
      <ol class="missions">
        ${z.activities.map((a, i) => {
          const r = state.activities[a.id];
          const h = CHARACTERS[a.host];
          return `<li><a class="mission ${r?.done ? 'done' : ''}" href="#reto/${z.id}/${i}">
            <img src="${h.img}" alt="">
            <span class="m-info"><small>${a.label}</small><b>${a.title}</b>
              <span class="m-stars" aria-label="${r?.stars || 0} de 3 estrellas">${[1, 2, 3].map(n => `<i class="${(r?.stars || 0) >= n ? 'on' : ''}">★</i>`).join('')}</span></span>
            <span class="m-go">${r?.done ? '🔁' : '▶'}</span></a></li>`;
        }).join('')}
      </ol>
    </section>`;
  speakAs(z.guide, z.story);
}

// ------------------------------------------------------------------ ACTIVIDAD
let current = null;
function viewActivity(zid, idx) {
  const z = zoneById(zid);
  const act = z?.activities[+idx];
  if (!act) return go('mapa');
  if (!zoneUnlocked(z)) return go('lugar/' + z.id);
  setNav('reto');
  const host = CHARACTERS[act.host];
  current = { z, act, idx: +idx, mistakes: 0, afterMistake: false };
  screen.innerHTML = `
    <section class="activity" style="--c:${z.color}">
      <div class="act-top">
        <a class="back" href="#lugar/${z.id}">⬅ Volver</a>
        <span class="chip">${act.label}</span>
        <span class="act-count">${+idx + 1} / ${z.activities.length}</span>
      </div>
      <h1 class="act-title">${act.title}</h1>
      <div class="host">
        <img class="host-img" src="${host.img}" alt="${host.name}">
        <div class="host-bubble" aria-live="polite">
          <p class="host-say">${act.prompt}</p>
          <button class="icon-btn" data-speak-host aria-label="Escuchar a ${host.name}">🔊</button>
        </div>
      </div>
      <div class="act-body"></div>
      <div class="act-foot">
        <button class="btn btn-ghost small" data-restart>🔁 Repetir</button>
        <a class="btn btn-ghost small" href="#mapa">🗺️ Volver al mapa</a>
      </div>
    </section>`;
  // quiet: solo cambia el globo de texto, sin decirlo en voz alta.
  const say = (text, mood, quiet) => {
    const s = $('.host-say'); if (!s) return;
    s.textContent = text;
    if (!quiet) speakAs(act.host, text);
    const img = $('.host-img');
    img.classList.remove('happy', 'think'); void img.offsetWidth;
    if (mood) img.classList.add(mood);
  };
  const api = {
    host: act.host,
    focus: z.focus,
    say,
    speakAs: (char, texts) => speakAs(char, texts),
    mistake() { current.mistakes++; current.afterMistake = true; },
    right(text, then) {
      play('correct');
      announceBadges(registerAnswer(true, current.afterMistake));
      current.afterMistake = false;
      updateHUD();
      if (text) feedback(true, text, then);
    },
    wrong(text) {
      play('wrong');
      registerAnswer(false);
      if (text) feedback(false, text);
    },
    finish(text) { celebrate(text); },
  };
  $('[data-restart]').addEventListener('click', () => viewActivity(zid, idx));
  $('[data-speak-host]').addEventListener('click', () => speakAs(act.host, $('.host-say').textContent, { manual: true }));
  // Las historias y las series dicen su propio texto al dibujarse.
  if (act.type !== 'story' && act.type !== 'series') speakAs(act.host, act.prompt);
  ENGINES[act.type](act, $('.act-body'), api);
}

// Hoja de retroalimentación con el personaje.
function feedback(ok, text, then) {
  const host = CHARACTERS[current.act.host];
  const title = ok ? pick(MESSAGES.correct) : pick(MESSAGES.wrong);
  openModal(`
    <div class="sheet ${ok ? 'ok' : 'retry'}" role="alertdialog" aria-labelledby="fb-t" aria-describedby="fb-d">
      <img class="sheet-char ${ok ? 'jump' : 'nod'}" src="${host.img}" alt="${host.name}">
      <div class="sheet-body">
        <h2 id="fb-t">${ok ? '🌟' : '💡'} ${title}</h2>
        <p id="fb-d">${text}</p>
        <button class="btn ${ok ? 'btn-green' : 'btn-sun'}" data-close>${ok ? 'Continuar ➜' : '🔁 Intentar otra vez'}</button>
      </div>
    </div>`, then, 'sheet-wrap');
  speakAs(current.act.host, [title, text]);
}

// Celebración al terminar un reto.
function celebrate(text) {
  const { z, act, idx, mistakes } = current;
  const res = completeActivity(z, act, mistakes);
  updateHUD();
  play('win');
  confetti();
  const host = CHARACTERS[act.host];
  const nextIdx = z.activities.findIndex((a, i) => i > idx && !state.activities[a.id]?.done);
  const anyLeft = z.activities.findIndex(a => !state.activities[a.id]?.done);
  const nextTarget = nextIdx >= 0 ? nextIdx : anyLeft;
  const nextZone = ZONES.find(zz => zoneUnlocked(zz) && zoneStatus(zz) !== 'done');
  const nextHref = nextTarget >= 0 ? `#reto/${z.id}/${nextTarget}` : nextZone ? `#lugar/${nextZone.id}` : '#logros';
  const nextLabel = nextTarget >= 0 ? 'Siguiente reto ➜' : nextZone ? `Ir a ${nextZone.short} ➜` : 'Ver mis logros 🏆';
  const effort = LINES.effort(mistakes === 0);
  const title = LINES.celebrateTitle(res.medal);
  openModal(`
    <div class="celebration" role="dialog" aria-labelledby="cel-t">
      <div class="rays" aria-hidden="true"></div>
      <img class="cel-char" src="${host.img}" alt="${host.name} celebrando">
      <h2 id="cel-t">${title}</h2>
      <div class="cel-stars" aria-label="${res.stars} de 3 estrellas">${[1, 2, 3].map(n => `<span class="${res.stars >= n ? 'on' : ''}" style="--d:${n * 0.25}s">★</span>`).join('')}</div>
      <p class="cel-effort">${effort}</p>
      ${text ? `<p class="cel-learn"><b>Aprendiste:</b> ${text}</p>` : ''}
      ${res.firstTime ? `<p class="cel-points">+30 puntos</p>` : ''}
      ${res.medal ? `<div class="cel-medal"><span>${res.medal.icon}</span><b>${res.medal.name}</b><small>+100 puntos · Una flor nueva nació en el Jardín</small></div>` : ''}
      <div class="cel-btns">
        <a class="btn btn-green btn-lg" href="${nextHref}" data-close>${nextLabel}</a>
        <button class="btn btn-ghost" data-replay>🔁 Repetir</button>
        <a class="btn btn-ghost" href="#mapa" data-close>🗺️ Mapa</a>
      </div>
    </div>`, null, 'cel-wrap');
  $('[data-replay]').addEventListener('click', () => { closeModal(); viewActivity(z.id, idx); });
  speakAs(act.host, [title, effort]);
  announceBadges(res.newBadges);
  if (res.medal) setTimeout(() => toast(`<span class="t-ico">${res.medal.icon}</span><span><b>¡Medalla ganada!</b><br>${res.medal.name}</span>`, 'badge'), 300);
}

// ------------------------------------------------------------------ PERSONAJES
function viewCharacters(openId) {
  setNav('personajes');
  screen.innerHTML = `
    <section class="chars">
      <header class="screen-head">
        <h1>🫶 Los Pegajositos</h1>
        <p>Toca a cada amigo para conocerlo. Conocidos: <b>${state.seen.filter(s => CHARACTERS[s]).length} / ${charIds.length}</b></p>
      </header>
      <div class="char-grid">
        ${charIds.map((id, i) => {
          const c = CHARACTERS[id];
          return `<button class="char-card ${state.seen.includes(id) ? 'seen' : ''}" data-char="${id}" style="--c:${c.color};--soft:${c.soft};--i:${i}">
            <span class="cc-img"><img src="${c.img}" alt="" loading="lazy"></span>
            <b>${c.name}</b><small>${c.value}</small>
            ${state.seen.includes(id) ? '<span class="cc-check" aria-label="Ya lo conoces">✓</span>' : ''}
          </button>`;
        }).join('')}
      </div>
      <h2 class="sub-head">🌈 Más Pegajositos del 4A</h2>
      <div class="friend-grid">
        ${MORE_FRIENDS.map(f => `<figure class="friend"><img src="${f.img}" alt="${f.name}" loading="lazy"><figcaption><b>${f.name}</b><small>${f.value}</small></figcaption></figure>`).join('')}
      </div>
      <p class="credits">${CONFIG.credits}</p>
    </section>`;
  screen.querySelectorAll('[data-char]').forEach(b => b.addEventListener('click', () => openCharacter(b.dataset.char)));
  if (openId && CHARACTERS[openId]) openCharacter(openId);
}

function openCharacter(id) {
  const c = CHARACTERS[id];
  const zone = ZONES.find(z => z.guide === id || z.friends.includes(id)) || (GARDEN.guide === id ? GARDEN : null);
  announceBadges(markSeen(id));
  play('pick');
  openModal(`
    <div class="char-modal" role="dialog" aria-labelledby="cm-t" style="--c:${c.color};--soft:${c.soft}">
      <button class="close-x" data-close aria-label="Cerrar">✕</button>
      <img class="cm-img wave" src="${c.img}" alt="${c.name}">
      <h2 id="cm-t">${c.name}</h2>
      <p class="cm-motto">${c.motto}</p>
      <div class="bubble"><p>${c.greeting}</p><button class="icon-btn" data-char="${id}" data-speak="${c.greeting}" aria-label="Escuchar a ${c.name}">🔊</button></div>
      <p class="cm-about">${c.about}</p>
      ${zone ? `<a class="btn btn-sun" href="${zone === GARDEN ? '#logros' : '#lugar/' + zone.id}" data-close>📍 Visitar ${zone.name}</a>` : ''}
    </div>`, () => { if (location.hash.startsWith('#personajes')) viewCharacters(); });
  speakAs(id, c.greeting);
}

// ------------------------------------------------------------------ LOGROS
function viewRewards() {
  setNav('logros');
  const stars = totalStars();
  screen.innerHTML = `
    <section class="rewards">
      <header class="screen-head">
        <h1>🏆 Jardín de las Recompensas</h1>
        <p>Cada medalla hace florecer el jardín de Rosebell.</p>
      </header>
      <div class="garden">
        <img class="garden-host" src="${CHARACTERS.rosebell.img}" alt="Rosebell">
        <div class="flowers">
          ${ZONES.map(z => `<div class="flower ${state.medals.includes(z.id) ? 'bloom' : ''}" style="--c:${z.color}">
            <span class="petals" aria-hidden="true">${state.medals.includes(z.id) ? '🌸' : '🌱'}</span>
            <small>${z.short}</small></div>`).join('')}
        </div>
      </div>
      <div class="stats">
        <div class="stat"><span>⭐</span><b>${stars}</b><small>de ${maxStars()} estrellas</small></div>
        <div class="stat"><span>💎</span><b>${state.points}</b><small>puntos</small></div>
        <div class="stat"><span>🏅</span><b>${state.medals.length}</b><small>de ${ZONES.length} medallas</small></div>
        <div class="stat"><span>🎖️</span><b>${state.badges.length}</b><small>de ${BADGES.length} insignias</small></div>
      </div>
      <div class="progress-big" role="progressbar" aria-valuenow="${progressPct()}" aria-valuemin="0" aria-valuemax="100">
        <span style="width:${progressPct()}%"></span><b>Aventura completada: ${progressPct()}%</b>
      </div>
      <h2 class="sub-head">🏅 Medallas</h2>
      <div class="medals">
        ${ZONES.map(z => {
          const got = state.medals.includes(z.id);
          return `<a class="medal ${got ? 'got' : ''}" href="#lugar/${z.id}" style="--c:${z.color}">
            <span class="medal-disc">${got ? z.medal.icon : '?'}</span><b>${z.medal.name}</b><small>${got ? '¡Ganada!' : `${zoneDone(z)}/${z.activities.length} retos`}</small></a>`;
        }).join('')}
      </div>
      <h2 class="sub-head">🎖️ Insignias</h2>
      <div class="badges">
        ${BADGES.map(b => {
          const got = state.badges.includes(b.id);
          return `<div class="badge-card ${got ? 'got' : ''}"><span class="b-ico">${got ? b.icon : '🔒'}</span><b>${b.name}</b><small>${b.desc}</small></div>`;
        }).join('')}
      </div>
      <div class="reset-zone">
        <button class="btn btn-ghost small" data-reset>🧹 Reiniciar progreso</button>
        <p>El progreso se guarda solo en este dispositivo.</p>
      </div>
    </section>`;
  $('[data-reset]').addEventListener('click', confirmReset);
}

function confirmReset() {
  openModal(`
    <div class="confirm" role="alertdialog" aria-labelledby="cf-t">
      <img src="${CHARACTERS.chochito.img}" alt="Chochito">
      <h2 id="cf-t">¿Empezar de nuevo?</h2>
      <p>Se borrarán tus estrellas, puntos, medallas e insignias en este dispositivo.</p>
      <div class="row-btns">
        <button class="btn btn-ghost" data-close>No, mejor no</button>
        <button class="btn btn-red" data-yes>Sí, reiniciar</button>
      </div>
    </div>`);
  $('[data-yes]').addEventListener('click', () => {
    resetProgress(); closeModal(); updateHUD(); viewRewards();
    toast('<span class="t-ico">🌱</span><span>Progreso reiniciado. ¡Una nueva aventura comienza!</span>');
  });
}

// ------------------------------------------------------------------ MODAL
let onCloseCb = null, lastFocus = null;
function openModal(html, onClose, cls = '') {
  const m = $('#modal');
  lastFocus = document.activeElement;
  m.className = 'modal open ' + cls;
  m.innerHTML = `<div class="modal-bg" data-close></div><div class="modal-box">${html}</div>`;
  onCloseCb = onClose || null;
  m.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', e => {
    if (el.tagName !== 'A') e.preventDefault();
    closeModal();
  }));
  m.removeAttribute('hidden');
  setTimeout(() => (m.querySelector('.modal-box .btn, .modal-box button') || m).focus(), 50);
}
function closeModal() {
  const m = $('#modal');
  if (m.hidden) return;
  m.hidden = true; m.innerHTML = '';
  stopSpeaking();
  const cb = onCloseCb; onCloseCb = null;
  if (cb) cb();
  else lastFocus?.focus?.();
}

// ------------------------------------------------------------------ CONFETI
function confetti() {
  if (reduceMotion.matches) return;
  const c = document.createElement('canvas');
  c.className = 'confetti';
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  const W = c.width = innerWidth, H = c.height = innerHeight;
  const colors = ['#ffd23f', '#3bceac', '#ee4266', '#0ead69', '#4cc9f0', '#9b5de5', '#ff8c42'];
  const parts = Array.from({ length: 110 }, () => ({
    x: W / 2 + (Math.random() - .5) * 120, y: H * .45, r: 4 + Math.random() * 6,
    vx: (Math.random() - .5) * 14, vy: -8 - Math.random() * 10, c: pick(colors), a: Math.random() * 6, s: Math.random() > .5,
  }));
  let t = 0;
  (function frame() {
    ctx.clearRect(0, 0, W, H);
    parts.forEach(p => {
      p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += .15;
      ctx.fillStyle = p.c; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
      if (p.s) ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); else { ctx.beginPath(); ctx.arc(0, 0, p.r / 1.4, 0, 7); ctx.fill(); }
      ctx.restore();
    });
    if (++t < 140) requestAnimationFrame(frame); else c.remove();
  })();
}

// ------------------------------------------------------------------ ROUTER
function go(route) { location.hash = '#' + route; }

function router() {
  closeModal();
  stopSpeaking();
  const [name, a, b] = location.hash.replace(/^#\/?/, '').split('/');
  switch (name) {
    case 'mapa': viewMap(); break;
    case 'lugar': viewZone(a); break;
    case 'reto': viewActivity(a, b); break;
    case 'personajes': viewCharacters(a); break;
    case 'logros': viewRewards(); break;
    default: viewHome();
  }
  screen.scrollTop = 0;
  window.scrollTo(0, 0);
  const h1 = screen.querySelector('h1');
  if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
}

// ------------------------------------------------------------------ EVENTOS GLOBALES
document.addEventListener('click', e => {
  const sp = e.target.closest('[data-speak]');
  if (sp) { speakAs(sp.dataset.char, sp.dataset.speak, { manual: true }); return; }
  if (e.target.closest('.btn, .option, .spot, .mission, .dock a')) play('tap');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  // Atajos 1-4 para elegir opciones en un reto.
  if (/^[1-4]$/.test(e.key) && document.body.dataset.screen === 'reto' && $('#modal').hidden) {
    const opts = [...document.querySelectorAll('.act-body .option:not(:disabled)')];
    opts[+e.key - 1]?.click();
  }
});
$('#btn-sound').addEventListener('click', () => {
  state.sound = !state.sound; save(); updateHUD();
  if (state.sound) play('correct'); else stopSpeaking();
});
addEventListener('hashchange', router);

updateHUD();
router();

// PWA: permite instalar la app y jugar sin conexión.
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
