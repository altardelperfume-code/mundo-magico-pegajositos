// Sonidos suaves generados con Web Audio y voces grabadas de los personajes.
import { state } from './state.js';
import { voiceKey, cleanSpeech } from './lines.js';

let ctx = null;
function ac() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type = 'sine', vol = 0.12) {
  const c = ac(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq;
  const t = c.currentTime + start;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t); o.stop(t + dur + 0.05);
}

const SOUNDS = {
  tap: () => tone(660, 0, 0.08, 'triangle', 0.06),
  correct: () => { tone(784, 0, 0.15, 'triangle'); tone(1047, 0.1, 0.25, 'triangle'); },
  wrong: () => { tone(392, 0, 0.18, 'sine', 0.08); tone(349, 0.14, 0.25, 'sine', 0.08); },
  pick: () => tone(880, 0, 0.1, 'sine', 0.08),
  win: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.1)),
};

export function play(name) {
  if (!state.sound) return;
  try { SOUNDS[name]?.(); } catch (e) { /* sin audio */ }
}

// ---------------------------------------------------------------- VOCES
// Las frases grabadas viven en audio/voces/<personaje>/<clave>.mp3 y
// manifest.json dice cuáles existen (se generan con tools/voces).
let recorded = new Set();
fetch('audio/voces/manifest.json')
  .then(r => (r.ok ? r.json() : { keys: [] }))
  .then(m => { recorded = new Set(m.keys); })
  .catch(() => {});

let queue = [], player = null, token = 0;

// Dice una o varias frases con la voz del personaje.
// manual: el niño tocó 🔊 (suena aunque el sonido esté apagado y, si falta
// la grabación, usa la voz del navegador como respaldo).
export function speakAs(char, texts, { manual = false } = {}) {
  if (!manual && !state.sound) return;
  stopSpeaking();
  queue = [].concat(texts).filter(Boolean).map(text => ({ char, text: cleanSpeech(text), manual }));
  next(++token);
}

function next(t) {
  if (t !== token) return;
  const item = queue.shift();
  if (!item) return;
  const key = voiceKey(item.char, item.text);
  if (item.char && recorded.has(key)) {
    player = new Audio(`audio/voces/${item.char}/${key}.mp3`);
    player.onended = () => next(t);
    player.onerror = () => fallback(item, t);
    player.play().catch(() => fallback(item, t));
  } else {
    console.debug('[voz] frase sin grabación:', item.char, item.text);
    fallback(item, t);
  }
}

function fallback(item, t) {
  if (!item.manual || !('speechSynthesis' in window)) return next(t);
  try {
    const u = new SpeechSynthesisUtterance(item.text);
    u.lang = 'es-CO';
    const voice = speechSynthesis.getVoices().find(v => v.lang.startsWith('es'));
    if (voice) u.voice = voice;
    u.onend = () => next(t);
    speechSynthesis.speak(u);
  } catch (e) { next(t); }
}

export function stopSpeaking() {
  token++;
  queue = [];
  if (player) { player.pause(); player = null; }
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
