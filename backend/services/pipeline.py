import os
import json
from .separator import Separator
from .analyzer import Analyzer
from .bass_processor import BassProcessor

class Pipeline:
    def __init__(self, output_dir="backend/processed"):
        self.output_dir = output_dir
        self.separator = Separator(output_dir)
        self.analyzer = Analyzer()
        self.bass_processor = BassProcessor()

    def process(self, file_path, file_id):
        tracks = self.separator.separate(file_path, file_id)
        analysis = self.analyzer.analyze_audio(file_path)
        bass_notes = self.bass_processor.process_bass(tracks['bass'])

        result = {
            "id": file_id,
            "metadata": analysis,
            "bass_notes": bass_notes,
            "tracks": tracks
        }

        result_path = os.path.join(self.output_dir, file_id, "analysis.json")
        os.makedirs(os.path.dirname(result_path), exist_ok=True)
        with open(result_path, "w") as f:
            json.dump(result, f, indent=2)

        return result
