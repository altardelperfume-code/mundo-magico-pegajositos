"""Genera las voces de los Pegajositos con Piper (TTS libre que funciona sin internet).

Uso (desde la carpeta mundo-magico):
    pip install piper-tts lameenc numpy scipy
    node tools/voces/frases.mjs
    python tools/voces/generar.py            # solo crea las frases nuevas
    python tools/voces/generar.py --todo     # vuelve a crear todas

Los modelos de voz se descargan la primera vez en tools/voces/modelos/ (no se suben a git).
Cada personaje usa una voz base con su propio tono (pitch) y velocidad.
"""
import json
import re
import sys
import urllib.request
from pathlib import Path

import lameenc
import numpy as np
from piper import PiperVoice, SynthesisConfig
from scipy.signal import resample

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
MODELS = HERE / 'modelos'
OUT = ROOT / 'audio' / 'voces'
HF = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/'

# Voces base (todas con licencia libre; ver README).
BASES = {
    'claude': 'es/es_MX/claude/high/es_MX-claude-high',     # femenina, México · Apache-2.0
    'daniela': 'es/es_AR/daniela/high/es_AR-daniela-high',  # femenina, Argentina · CC BY-SA 4.0
    'ald': 'es/es_MX/ald/medium/es_MX-ald-medium',          # masculina, México · Unlicense
}

# pitch > 1 = más agudo · speed > 1 = más rápido · expr = variación de entonación
CHARACTERS = {
    'romina':    {'base': 'claude',  'pitch': 1.10, 'speed': 1.00, 'expr': 0.75},  # alegre y amigable
    'celestial': {'base': 'daniela', 'pitch': 1.02, 'speed': 0.92, 'expr': 0.60},  # tranquila y respetuosa
    'gatiamor':  {'base': 'claude',  'pitch': 1.28, 'speed': 1.04, 'expr': 0.85},  # gatita dulce
    'hielosi':   {'base': 'ald',     'pitch': 0.94, 'speed': 0.94, 'expr': 0.60},  # amable y sereno
    'aquarius':  {'base': 'daniela', 'pitch': 1.20, 'speed': 1.05, 'expr': 0.80},  # gotita burbujeante
    'popi':      {'base': 'ald',     'pitch': 1.32, 'speed': 1.06, 'expr': 0.85},  # monstruito travieso
    'rosebell':  {'base': 'daniela', 'pitch': 1.10, 'speed': 0.96, 'expr': 0.70},  # flor cariñosa
    'chochito':  {'base': 'ald',     'pitch': 1.20, 'speed': 1.02, 'expr': 0.80},  # niño responsable
}

OUT_RATE = 24000
GAP = 0.18  # silencio entre oraciones (segundos)


def model(name):
    MODELS.mkdir(exist_ok=True)
    path = MODELS / (Path(BASES[name]).name + '.onnx')
    for suffix in ('', '.json'):
        target = Path(str(path) + suffix)
        if not target.exists():
            print(f'Descargando {target.name}…')
            urllib.request.urlretrieve(HF + BASES[name] + '.onnx' + suffix, target)
    return PiperVoice.load(str(path))


def for_speech(text):
    # Palabras en MAYÚSCULAS (GATIAMOR, RESPETAR) se leen mejor en minúsculas.
    text = re.sub(r'\b[A-ZÁÉÍÓÚÑ]{4,}\b', lambda m: m.group(0).capitalize(), text)
    return text.replace('…', '...').replace('“', '').replace('”', '')


def synth(voice, cfg, text):
    # Para subir el tono sin acelerar la voz: se genera más lenta (× pitch)
    # y luego se reproduce a una frecuencia mayor (× pitch).
    syn = SynthesisConfig(length_scale=cfg['pitch'] / cfg['speed'], noise_scale=cfg['expr'], noise_w_scale=0.85)
    parts, rate = [], 22050
    for chunk in voice.synthesize(for_speech(text), syn_config=syn):
        rate = chunk.sample_rate
        parts.append(chunk.audio_float_array)
        parts.append(np.zeros(int(rate * GAP), dtype=np.float32))
    audio = np.concatenate(parts[:-1]) if parts else np.zeros(1, dtype=np.float32)
    # Recorta silencios de los extremos.
    loud = np.nonzero(np.abs(audio) > 0.01)[0]
    if loud.size:
        audio = audio[max(loud[0] - 400, 0):loud[-1] + 1200]
    effective_rate = rate * cfg['pitch']
    audio = resample(audio, int(len(audio) * OUT_RATE / effective_rate))
    peak = np.max(np.abs(audio)) or 1
    audio = audio / peak * 0.89
    pcm = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
    enc = lameenc.Encoder()
    enc.set_bit_rate(48)
    enc.set_in_sample_rate(OUT_RATE)
    enc.set_channels(1)
    enc.set_quality(2)
    return enc.encode(pcm.tobytes()) + enc.flush()


def main():
    redo = '--todo' in sys.argv
    lines = json.loads((HERE / 'frases.json').read_text(encoding='utf8'))
    voices = {}
    made = 0
    for i, line in enumerate(lines, 1):
        char = line['char']
        target = OUT / char / f"{line['key']}.mp3"
        if target.exists() and not redo:
            continue
        cfg = CHARACTERS[char]
        if cfg['base'] not in voices:
            voices[cfg['base']] = model(cfg['base'])
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(synth(voices[cfg['base']], cfg, line['text']))
        made += 1
        print(f'[{i}/{len(lines)}] {char}: {line["text"][:60]}')

    # Borra audios que ya no corresponden a ninguna frase y actualiza el índice.
    keys = {f"{l['char']}/{l['key']}" for l in lines}
    for mp3 in OUT.glob('*/*.mp3'):
        if f'{mp3.parent.name}/{mp3.stem}' not in keys:
            mp3.unlink()
    (OUT / 'manifest.json').write_text(json.dumps({'keys': sorted(l['key'] for l in lines)}), encoding='utf8')
    print(f'Listo: {made} audios nuevos, {len(lines)} en total.')


if __name__ == '__main__':
    main()
