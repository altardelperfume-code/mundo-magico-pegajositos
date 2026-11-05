// Frases que dicen los personajes. Las usan la app y el generador de voces
// (tools/voces), así cada frase grabada coincide con la que se muestra.
import { CONFIG, CHARACTERS, ZONES, MESSAGES } from './data.js';

export const LINES = {
  homeGreeting: '¡Hola, explorador! ¿Listo para aprender y salvar nuestro mundo?',
  locked: prev => `¡Este lugar todavía está dormido! Completa ${CONFIG.retosParaDesbloquear} retos en ${prev.name} para despertarlo.`,
  genericHint: 'Lee la frase otra vez con calma y piensa cómo se sentirían los demás… o el planeta.',
  seriesDone: '¡Completaste todas las preguntas!',
  sortRight: (item, bin) => `¡Sí! ${item.name}: ${bin.name.toLowerCase()}.`,
  sortWrong: item => `Esa no es su caneca. Pista: ${item.hint}`,
  sortPicked: item => `${item.name}. Ahora toca la caneca correcta.`,
  sortFirst: 'Primero elige un residuo de arriba 👆',
  findGot: (t, left) => left ? `¡Recogiste ${t.name}! Faltan ${left}.` : '¡Lo lograste!',
  storyRetry: '¡No pasa nada! Volvamos a elegir.',
  storyGood: '¡Qué buen final!',
  orderNext: n => `¡Bien! ¿Cuál es el paso ${n}?`,
  orderAfter: step => `Ese paso viene después. ¿Qué sigue luego de “${step.text.toLowerCase()}”?`,
  matchRight: c => `¡Sí! ${c.motto}.`,
  matchHint: c => `Pista sobre ${c.name}: ${c.about}`,
  celebrateTitle: medal => medal ? '¡Misión cumplida!' : '¡Reto superado!',
  effort: perfect => perfect ? '¡Perfecto a la primera!' : '¡Seguiste intentando hasta lograrlo! Eso es esfuerzo.',
};

// Texto limpio para hablar: sin emojis, etiquetas ni espacios de más.
export const cleanSpeech = text => String(text)
  .replace(/<[^>]*>/g, ' ')
  .replace(/[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}️‍]/gu, '')
  .replace(/\s+/g, ' ')
  .trim();

// Identificador del audio de una frase (FNV-1a de 32 bits).
export function voiceKey(char, text) {
  const s = `${char}|${cleanSpeech(text)}`;
  let h = 0x811c9dc5;
  for (const ch of s) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

// Todas las frases que se pueden escuchar, con el personaje que las dice.
export function allLines() {
  const out = [];
  const add = (char, text) => text && out.push({ char, text: cleanSpeech(text) });

  for (const [id, c] of Object.entries(CHARACTERS)) {
    add(id, c.greeting);
    [...MESSAGES.correct, ...MESSAGES.wrong].forEach(m => add(id, m));
    [true, false].forEach(b => { add(id, LINES.celebrateTitle(b)); add(id, LINES.effort(b)); });
  }
  add('romina', LINES.homeGreeting);

  ZONES.forEach((z, zi) => {
    add(z.guide, z.story);
    if (zi > 0) add(z.guide, LINES.locked(ZONES[zi - 1]));
    for (const a of z.activities) {
      const h = a.host;
      add(h, a.prompt);
      add(h, a.done);
      if (a.type === 'quiz') a.options.forEach(o => { add(h, o.why); add(h, o.hint); });
      if (a.type === 'series') {
        a.items.forEach(it => { add(h, it.text); add(h, it.explain); add(h, it.hint || LINES.genericHint); });
        add(h, a.done || LINES.seriesDone);
      }
      if (a.type === 'sort') {
        add(h, LINES.sortFirst);
        a.items.forEach(it => {
          add(h, LINES.sortRight(it, a.bins.find(b => b.id === it.bin)));
          add(h, LINES.sortWrong(it));
          add(h, LINES.sortPicked(it));
        });
      }
      if (a.type === 'find') {
        a.decoys.forEach(d => add(h, d.say));
        a.targets.forEach(t => { for (let left = 0; left < a.targets.length; left++) add(h, LINES.findGot(t, left)); });
      }
      if (a.type === 'story') {
        Object.values(a.nodes).forEach(n => add(n.who, n.text));
        add(h, LINES.storyRetry); add(h, LINES.storyGood);
      }
      if (a.type === 'order') {
        add(h, a.hint);
        for (let n = 2; n <= a.steps.length; n++) add(h, LINES.orderNext(n));
        a.steps.slice(0, -1).forEach(s => add(h, LINES.orderAfter(s)));
      }
      if (a.type === 'match') a.pairs.forEach(id => { add(h, LINES.matchRight(CHARACTERS[id])); add(h, LINES.matchHint(CHARACTERS[id])); });
    }
  });

  const seen = new Set();
  return out.filter(l => {
    const k = voiceKey(l.char, l.text);
    if (seen.has(k)) return false;
    seen.add(k); l.key = k;
    return true;
  });
}
