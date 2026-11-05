// Exporta todas las frases de los personajes a frases.json (las lee generar.py).
import { writeFileSync } from 'node:fs';
import { allLines } from '../../js/lines.js';

const lines = allLines();
writeFileSync(new URL('./frases.json', import.meta.url), JSON.stringify(lines, null, 1));
console.log(`${lines.length} frases`);
