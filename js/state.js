// Progreso del jugador guardado en el navegador (localStorage).
import { ZONES, BADGES, CONFIG } from './data.js';

const KEY = 'pegajositos-progreso-v1';

const fresh = () => ({
  activities: {},   // id -> { stars, done }
  points: 0,
  badges: [],
  medals: [],
  seen: [],         // personajes conocidos
  streak: 0,
  sound: true,
  visitedMap: false,
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...fresh(), ...JSON.parse(raw) };
  } catch (e) { /* almacenamiento no disponible: se juega igual */ }
  return fresh();
}

export const state = load();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* sin guardado */ }
}

export function resetProgress() {
  const sound = state.sound;
  Object.assign(state, fresh(), { sound });
  save();
}

export const totalStars = () =>
  Object.values(state.activities).reduce((s, a) => s + (a.stars || 0), 0);

export const allActivities = () => ZONES.flatMap(z => z.activities);
export const maxStars = () => allActivities().length * 3;

export const zoneDone = z => z.activities.filter(a => state.activities[a.id]?.done).length;
export const zoneComplete = z => zoneDone(z) === z.activities.length;

export function zoneUnlocked(z) {
  const i = ZONES.indexOf(z);
  if (i <= 0) return true;
  const prev = ZONES[i - 1];
  return zoneDone(prev) >= Math.min(CONFIG.retosParaDesbloquear, prev.activities.length);
}

export function zoneStatus(z) {
  if (!zoneUnlocked(z)) return 'locked';
  if (zoneComplete(z)) return 'done';
  return zoneDone(z) > 0 ? 'progress' : 'open';
}

export const progressPct = () => {
  const all = allActivities();
  return Math.round(all.filter(a => state.activities[a.id]?.done).length / all.length * 100);
};

// Devuelve las insignias nuevas (para anunciarlas).
function award(id, list) {
  if (!state.badges.includes(id)) { state.badges.push(id); list.push(BADGES.find(b => b.id === id)); }
}

export function addPoints(n) { state.points += n; save(); }

export function registerAnswer(correct, afterMistake) {
  const fresh = [];
  if (correct) {
    state.streak += 1;
    state.points += 10;
    if (state.streak >= 5) award('racha-5', fresh);
    if (afterMistake) award('perseverante', fresh);
  } else {
    state.streak = 0;
  }
  save();
  return fresh;
}

// Guarda el resultado de una actividad y calcula premios.
export function completeActivity(zone, activity, mistakes) {
  const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
  const prev = state.activities[activity.id];
  const firstTime = !prev?.done;
  state.activities[activity.id] = { done: true, stars: Math.max(stars, prev?.stars || 0) };
  if (firstTime) state.points += 30;

  const newBadges = [];
  award('primer-paso', newBadges);
  if (activity.id === 'r1') award('amigo-agua', newBadges);
  if (activity.type === 'sort') award('reciclador', newBadges);
  if (totalStars() >= 15) award('estrellas-15', newBadges);

  let medal = null;
  if (zoneComplete(zone) && !state.medals.includes(zone.id)) {
    state.medals.push(zone.id);
    state.points += 100;
    medal = zone.medal;
  }
  if (ZONES.every(zoneComplete)) award('explorador', newBadges);
  save();
  return { stars, newBadges, medal, firstTime };
}

export function markSeen(id) {
  const out = [];
  if (!state.seen.includes(id)) state.seen.push(id);
  if (state.seen.length >= 8) award('conoce-equipo', out);
  save();
  return out;
}
