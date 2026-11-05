// Sonidos suaves generados con Web Audio (sin archivos externos) y lectura en voz alta.
import { state } from './state.js';

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

export const canSpeak = 'speechSynthesis' in window;

export function speak(text) {
  if (!canSpeak) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[^\p{L}\p{N}\s¡!¿?.,:;“”"'-]/gu, ''));
    u.lang = 'es-CO';
    const voice = speechSynthesis.getVoices().find(v => v.lang.startsWith('es'));
    if (voice) u.voice = voice;
    u.rate = 0.95; u.pitch = 1.15;
    speechSynthesis.speak(u);
  } catch (e) { /* sin voz */ }
}

export function stopSpeaking() { if (canSpeak) speechSynthesis.cancel(); }
