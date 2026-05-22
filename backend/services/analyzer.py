import librosa
import numpy as np

class Analyzer:
    def __init__(self):
        pass

    def analyze_audio(self, file_path):
        y, sr = librosa.load(file_path)

        tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
        beat_times = librosa.frames_to_time(beat_frames, sr=sr)

        chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
        chroma_avg = np.mean(chroma, axis=1)
        key_idx = np.argmax(chroma_avg)
        keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        detected_key = keys[key_idx]

        hop_length = 512
        chroma_stft = librosa.feature.chroma_stft(y=y, sr=sr, hop_length=hop_length)

        chords = []
        templates = {
            "": [0, 4, 7],
            "m": [0, 3, 7],
            "7": [0, 4, 7, 10],
            "maj7": [0, 4, 7, 11],
            "m7": [0, 3, 7, 10],
            "sus4": [0, 5, 7],
            "sus2": [0, 2, 7],
            "5": [0, 7],
        }

        for i in range(len(beat_times) - 1):
            start_frame = beat_frames[i]
            end_frame = beat_frames[i+1]
            beat_chroma = np.mean(chroma_stft[:, start_frame:end_frame], axis=1)

            best_chord = "N.C."
            best_score = -1

            for root_idx in range(12):
                shifted_chroma = np.roll(beat_chroma, -root_idx)
                for suffix, intervals in templates.items():
                    score = sum(shifted_chroma[interval] for interval in intervals)
                    score /= len(intervals)
                    if score > best_score:
                        best_score = score
                        best_chord = f"{keys[root_idx]}{suffix}"

            chords.append({
                "time": float(beat_times[i]),
                "chord": best_chord
            })

        return {
            "tempo": float(tempo[0]) if isinstance(tempo, np.ndarray) else float(tempo),
            "key": detected_key,
            "chords": chords,
            "duration": float(librosa.get_duration(y=y, sr=sr))
        }
