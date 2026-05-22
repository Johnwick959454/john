import os
import subprocess
from static_ffmpeg import add_paths

add_paths()

class Separator:
    def __init__(self, output_dir="backend/processed"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def separate(self, file_path, file_id):
        import sys
        full_cmd = [sys.executable, "-m", "demucs.separate", "-n", "htdemucs", "--out", self.output_dir, file_path]

        print(f"Running separation: {' '.join(full_cmd)}")
        result = subprocess.run(full_cmd, capture_output=True, text=True)

        if result.returncode != 0:
            print(f"Error during separation: {result.stderr}")
            raise Exception(f"Separation failed: {result.stderr}")

        filename = os.path.basename(file_path).replace(".mp3", "").replace(".wav", "").replace(".flac", "").replace(".aac", "")
        separated_path = os.path.join(self.output_dir, "htdemucs", filename)

        return {
            "bass": os.path.join(separated_path, "bass.wav"),
            "drums": os.path.join(separated_path, "drums.wav"),
            "other": os.path.join(separated_path, "other.wav"),
            "vocals": os.path.join(separated_path, "vocals.wav"),
        }
