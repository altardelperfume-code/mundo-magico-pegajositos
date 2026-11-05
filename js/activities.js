// Motores de las actividades. Cada uno recibe (actividad, contenedor, api).
// api: right(text, then) · wrong(text) · say(text, mood) · mistake() · finish(text) · host
import { CHARACTERS } from './data.js';
import { play } from './audio.js';

const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const sceneHTML = (icons, focus, who) => `
  <div class="scene" style="--focus:${focus || '50% 50%'}">
    ${who ? `<img class="scene-char" src="${CHARACTERS[who].img}" alt="${CHARACTERS[who].name}">` : ''}
    <div class="scene-stickers">${(icons || []).map((i, n) => `<span class="sticker" style="--d:${n * 0.15}s">${i}</span>`).join('')}</div>
  </div>`;

function shake(el) {
  el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
}

// ---------- Pregunta ilustrada / situación ----------
function quiz(act, el, api) {
  el.innerHTML = `
    ${sceneHTML(act.scene, api.focus)}
    <div class="options" role="group" aria-label="Opciones">
      ${act.options.map((o, i) => `
        <button class="option" data-i="${i}">
          <span class="opt-icon" aria-hidden="true">${o.icon || ''}</span>
          <span class="opt-text">${esc(o.text)}</span>
        </button>`).join('')}
    </div>`;
  el.querySelectorAll('.option').forEach(btn => btn.addEventListener('click', () => {
    const o = act.options[+btn.dataset.i];
    if (o.correct) {
      btn.classList.add('is-right');
      el.querySelectorAll('.option').forEach(b => b.disabled = true);
      api.right(null);
      setTimeout(() => api.finish(o.why), 550);
    } else {
      btn.classList.add('is-wrong'); btn.disabled = true; shake(btn);
      api.mistake();
      api.wrong(o.hint);
    }
  }));
}

// ---------- Serie de preguntas cortas / verdadero o falso ----------
function series(act, el, api) {
  let i = 0;
  const opts = item => act.tf ? ['Verdadero', 'Falso'] : item.options;
  const icons = act.tf ? ['✔️', '❌'] : (act.items[0].options[0] === 'Responsable' ? ['😊', '🤔'] : []);
  const draw = () => {
    const item = act.items[i];
    el.innerHTML = `
      <div class="steps-dots" aria-label="Pregunta ${i + 1} de ${act.items.length}">
        ${act.items.map((_, n) => `<span class="${n < i ? 'done' : n === i ? 'now' : ''}"></span>`).join('')}
      </div>
      <div class="card-q">
        <div class="big-emoji" aria-hidden="true">${item.emoji}</div>
        <p class="q-text">${esc(item.text)}</p>
      </div>
      <div class="options ${act.tf ? 'two' : ''}">
        ${opts(item).map((t, n) => `
          <button class="option ${act.tf ? (n === 0 ? 'tf-yes' : 'tf-no') : ''}" data-n="${n}">
            ${icons[n] ? `<span class="opt-icon" aria-hidden="true">${icons[n]}</span>` : ''}
            <span class="opt-text">${esc(t)}</span>
          </button>`).join('')}
      </div>`;
    el.querySelectorAll('.option').forEach(btn => btn.addEventListener('click', () => {
      const n = +btn.dataset.n;
      if (n === item.answer) {
        btn.classList.add('is-right');
        el.querySelectorAll('.option').forEach(b => b.disabled = true);
        api.right(item.explain, () => { i++; i < act.items.length ? draw() : api.finish(act.done || '¡Completaste todas las preguntas!'); });
      } else {
        btn.classList.add('is-wrong'); btn.disabled = true; shake(btn);
        api.mistake();
        api.wrong(item.hint || 'Lee la frase otra vez con calma y piensa cómo se sentirían los demás… o el planeta.');
      }
    }));
  };
  draw();
}

// ---------- Clasificación (arrastrar o tocar) ----------
function sort(act, el, api) {
  let left = shuffle(act.items);
  let selected = null;
  el.innerHTML = `
    <p class="mini-help">👆 Arrastra o toca un residuo y luego su caneca.</p>
    <div class="tray" role="group" aria-label="Residuos"></div>
    <div class="bins">
      ${act.bins.map(b => `
        <button class="bin" data-bin="${b.id}" style="--bin:${b.color};--ink:${b.ink || '#fff'}" aria-label="Caneca ${b.name}: ${b.tip}">
          <svg viewBox="0 0 100 110" aria-hidden="true"><rect x="8" y="8" width="84" height="16" rx="7" class="lid"/><path d="M14 28h72l-7 74a8 8 0 0 1-8 7H29a8 8 0 0 1-8-7z" class="body"/><path d="M40 52l6-9 6 9M58 64l-5 9h-11M34 70l-5-8 10-2" class="rec"/></svg>
          <span class="bin-name">${b.name}</span>
          <span class="bin-tip">${b.tip}</span>
          <span class="bin-count" aria-hidden="true">0</span>
        </button>`).join('')}
    </div>`;
  const tray = el.querySelector('.tray');
  const counts = {};

  const drawTray = () => {
    tray.innerHTML = left.map((it, n) => `
      <button class="waste ${selected === it ? 'selected' : ''}" data-n="${n}" aria-pressed="${selected === it}">
        <span class="w-icon" aria-hidden="true">${it.icon}</span><span class="w-name">${esc(it.name)}</span>
      </button>`).join('');
    tray.querySelectorAll('.waste').forEach(w => attachDrag(w, left[+w.dataset.n]));
  };

  const drop = (item, binId, wasteEl) => {
    const binEl = el.querySelector(`[data-bin="${binId}"]`);
    if (item.bin === binId) {
      left = left.filter(x => x !== item);
      selected = null;
      counts[binId] = (counts[binId] || 0) + 1;
      binEl.querySelector('.bin-count').textContent = counts[binId];
      binEl.classList.remove('gulp'); void binEl.offsetWidth; binEl.classList.add('gulp');
      api.right(null);
      api.say(`¡Sí! ${item.name}: ${act.bins.find(b => b.id === binId).name.toLowerCase()}.`, 'happy');
      drawTray();
      if (!left.length) setTimeout(() => api.finish(act.done), 450);
    } else {
      api.mistake();
      api.wrong(null);
      api.say(`Esa no es su caneca. Pista: ${item.hint}`, 'think');
      if (wasteEl) shake(wasteEl);
      shake(binEl);
    }
  };

  function attachDrag(w, item) {
    let ghost = null, sx = 0, sy = 0, moved = false;
    w.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      sx = e.clientX; sy = e.clientY; moved = false;
      w.setPointerCapture(e.pointerId);
    });
    w.addEventListener('pointermove', e => {
      if (!w.hasPointerCapture(e.pointerId)) return;
      if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) {
        moved = true;
        ghost = document.createElement('div');
        ghost.className = 'ghost';
        ghost.textContent = item.icon;
        document.body.appendChild(ghost);
        w.classList.add('dragging');
      }
      if (ghost) {
        ghost.style.transform = `translate(${e.clientX - 36}px, ${e.clientY - 36}px)`;
        el.querySelectorAll('.bin').forEach(b => b.classList.toggle('hover', b === binAt(e)));
      }
    });
    const end = e => {
      if (!moved) return;
      const b = binAt(e);
      ghost?.remove(); ghost = null; w.classList.remove('dragging');
      el.querySelectorAll('.bin').forEach(x => x.classList.remove('hover'));
      if (b) drop(item, b.dataset.bin, w);
      w.dataset.dragged = '1';
    };
    w.addEventListener('pointerup', end);
    w.addEventListener('pointercancel', () => { ghost?.remove(); ghost = null; w.classList.remove('dragging'); });
    w.addEventListener('click', () => {
      if (w.dataset.dragged) { delete w.dataset.dragged; return; }
      selected = selected === item ? null : item;
      play('pick');
      if (selected) api.say(`${item.name}. Ahora toca la caneca correcta.`, 'think');
      drawTray();
      tray.querySelector('.selected')?.focus();
    });
  }
  const binAt = e => document.elementFromPoint(e.clientX, e.clientY)?.closest('.bin');

  el.querySelectorAll('.bin').forEach(b => b.addEventListener('click', () => {
    if (!selected) { api.say('Primero elige un residuo de arriba 👆', 'think'); shake(tray); return; }
    drop(selected, b.dataset.bin, tray.querySelector('.selected'));
  }));
  drawTray();
}

// ---------- Encuentra en la ilustración ----------
function find(act, el, api) {
  let found = 0;
  el.innerHTML = `
    <div class="find-counter" aria-live="polite"><span class="fc-num">0</span> / ${act.targets.length} encontradas</div>
    <div class="find-scene" style="background-image:url('${act.bg}')">
      ${act.targets.map((t, n) => `<button class="hot target" data-t="${n}" style="left:${t.x}%;top:${t.y}%" aria-label="Basura: ${t.name}">${t.icon}</button>`).join('')}
      ${act.decoys.map((d, n) => `<button class="hot decoy" data-d="${n}" style="left:${d.x}%;top:${d.y}%" aria-label="Animal del río">${d.icon}</button>`).join('')}
    </div>`;
  el.querySelectorAll('.target').forEach(b => b.addEventListener('click', () => {
    if (b.classList.contains('got')) return;
    b.classList.add('got'); b.disabled = true;
    found++;
    el.querySelector('.fc-num').textContent = found;
    api.right(null);
    const t = act.targets[+b.dataset.t];
    api.say(found < act.targets.length ? `¡Recogiste ${t.name}! Faltan ${act.targets.length - found}.` : '¡Lo lograste!', 'happy');
    if (found === act.targets.length) setTimeout(() => api.finish(act.done), 600);
  }));
  el.querySelectorAll('.decoy').forEach(b => b.addEventListener('click', () => {
    shake(b); play('tap');
    api.say(act.decoys[+b.dataset.d].say, 'think');
  }));
}

// ---------- Historia interactiva ----------
function story(act, el, api) {
  let lastChoiceNode = act.start;
  const draw = key => {
    const node = act.nodes[key];
    const who = CHARACTERS[node.who];
    el.innerHTML = `
      <div class="story ${node.end ? 'end-' + node.end : ''}">
        ${sceneHTML(node.scene, api.focus, node.who)}
        <div class="story-text"><strong>${who.name}</strong><p>${esc(node.text)}</p></div>
        <div class="options">
          ${node.choices ? node.choices.map((c, n) => `
            <button class="option" data-n="${n}"><span class="opt-icon" aria-hidden="true">${c.icon}</span><span class="opt-text">${esc(c.text)}</span></button>`).join('')
            : node.end === 'retry'
              ? `<button class="btn btn-sun" data-act="retry">🔁 Intentar otra vez</button>`
              : `<button class="btn btn-green" data-act="finish">⭐ ¡Terminar la historia!</button>`}
        </div>
      </div>`;
    el.querySelectorAll('.option').forEach(b => b.addEventListener('click', () => {
      const next = node.choices[+b.dataset.n].next;
      lastChoiceNode = key;
      play('tap');
      if (act.nodes[next].end === 'retry') { api.mistake(); api.wrong(null); }
      if (act.nodes[next].end === 'good') api.right(null);
      draw(next);
      el.querySelector('.story-text')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }));
    el.querySelector('[data-act="retry"]')?.addEventListener('click', () => draw(lastChoiceNode));
    el.querySelector('[data-act="finish"]')?.addEventListener('click', () => api.finish(node.text));
    if (node.end) api.say(node.end === 'retry' ? '¡No pasa nada! Volvamos a elegir.' : '¡Qué buen final!', node.end === 'retry' ? 'think' : 'happy');
  };
  draw(act.start);
}

// ---------- Ordenar pasos ----------
function order(act, el, api) {
  let next = 0;
  const pool = shuffle(act.steps.map((s, i) => ({ ...s, i })));
  el.innerHTML = `
    <ol class="slots">${act.steps.map((_, n) => `<li class="slot" data-s="${n}"><span class="slot-n">${n + 1}</span><span class="slot-c">?</span></li>`).join('')}</ol>
    <div class="options">
      ${pool.map(s => `<button class="option" data-i="${s.i}"><span class="opt-icon" aria-hidden="true">${s.icon}</span><span class="opt-text">${esc(s.text)}</span></button>`).join('')}
    </div>`;
  el.querySelectorAll('.option').forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.i;
    if (i === next) {
      const slot = el.querySelector(`[data-s="${next}"]`);
      slot.classList.add('filled');
      slot.querySelector('.slot-c').innerHTML = `${act.steps[i].icon} ${esc(act.steps[i].text)}`;
      b.disabled = true; b.classList.add('is-right', 'used');
      next++;
      api.right(null);
      if (next === act.steps.length) setTimeout(() => api.finish(act.done), 500);
      else api.say(`¡Bien! ¿Cuál es el paso ${next + 1}?`, 'happy');
    } else {
      shake(b); api.mistake(); api.wrong(null);
      api.say(next === 0 ? act.hint : `Ese paso viene después. ¿Qué sigue luego de “${act.steps[next - 1].text.toLowerCase()}”?`, 'think');
    }
  }));
}

// ---------- Unir parejas ----------
function match(act, el, api) {
  const ids = act.pairs;
  const values = shuffle(ids);
  let pick = null; // { kind, id, el }
  let matched = 0;
  el.innerHTML = `
    <div class="match">
      <div class="match-col">${ids.map(id => `
        <button class="m-item m-char" data-kind="char" data-id="${id}" style="--c:${CHARACTERS[id].color}">
          <img src="${CHARACTERS[id].img}" alt=""><span>${CHARACTERS[id].name}</span>
        </button>`).join('')}</div>
      <div class="match-col">${values.map(id => `
        <button class="m-item m-val" data-kind="val" data-id="${id}">${CHARACTERS[id].value}</button>`).join('')}</div>
    </div>`;
  el.querySelectorAll('.m-item').forEach(b => b.addEventListener('click', () => {
    if (b.classList.contains('matched')) return;
    if (!pick || pick.kind === b.dataset.kind) {
      el.querySelectorAll('.m-item.sel').forEach(x => x.classList.remove('sel'));
      pick = { kind: b.dataset.kind, id: b.dataset.id, el: b };
      b.classList.add('sel'); play('pick');
      return;
    }
    const charId = pick.kind === 'char' ? pick.id : b.dataset.id;
    if (pick.id === b.dataset.id) {
      matched++;
      [pick.el, b].forEach(x => { x.classList.remove('sel'); x.classList.add('matched'); x.disabled = true; x.style.setProperty('--m', CHARACTERS[charId].color); x.dataset.num = matched; });
      api.right(null);
      api.say(`¡Sí! ${CHARACTERS[charId].motto}.`, 'happy');
      if (matched === ids.length) setTimeout(() => api.finish(act.done), 500);
    } else {
      shake(b); shake(pick.el); pick.el.classList.remove('sel');
      api.mistake(); api.wrong(null);
      api.say(`Pista sobre ${CHARACTERS[charId].name}: ${CHARACTERS[charId].about}`, 'think');
    }
    pick = null;
  }));
}

export const ENGINES = { quiz, series, sort, find, story, order, match };
