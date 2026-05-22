import librosa
import numpy as np

class BassProcessor:
    def __init__(self):
        pass

    def process_bass(self, bass_file_path):
        y, sr = librosa.load(bass_file_path)
        f0, voiced_flag, voiced_probs = librosa.pyin(y, fmin=librosa.note_to_hz('B0'), fmax=librosa.note_to_hz('G3'), sr=sr)
        times = librosa.times_like(f0, sr=sr)

        notes = []
        current_note = None
        current_start = 0

        for i, freq in enumerate(f0):
            if not np.isnan(freq):
                note_name = librosa.hz_to_note(freq)
                if current_note is None:
                    current_note = note_name
                    current_start = times[i]
                elif note_name != current_note:
                    notes.append({
                        "note": current_note,
                        "start": float(current_start),
                        "duration": float(times[i] - current_start),
                        "frequency": float(librosa.note_to_hz(current_note))
                    })
                    current_note = note_name
                    current_start = times[i]
            else:
                if current_note is not None:
                    notes.append({
                        "note": current_note,
                        "start": float(current_start),
                        "duration": float(times[i] - current_start),
                        "frequency": float(librosa.note_to_hz(current_note))
                    })
                    current_note = None

        notes = [n for n in notes if n['duration'] > 0.05]
        return notes
