# BassAI Studio - Professional AI Music Analysis

Professional AI-powered music analysis studio that extracts basslines and chords from YouTube links and audio uploads, visualizing them in real-time.

## Features
- **AI Source Separation**: Extract Bass, Drums, Vocals, and Harmony using Demucs.
- **Harmony Analysis**: Real-time chord detection (Major, Minor, 7ths, etc.).
- **3D Visualization**: 5-string bass fretboard and animated piano keyboard.
- **Tablature**: Automatically generated scrolling bass tabs.
- **Desktop App**: Standalone PC experience powered by Electron.

## Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js & npm

### Desktop Installation (Build from Source)
1. Clone the repository.
2. Install root dependencies:
   ```bash
   npm install
   ```
3. Install Frontend dependencies:
   ```bash
   cd frontend && npm install && cd ..
   ```
4. Setup Backend Virtual Environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   cd ..
   ```
5. **Generate PC Installer (.exe)**:
   ```bash
   npm run dist-win
   ```
   The installer will be generated in the `dist_electron` folder.

### Running in Development
```bash
npm run dev
```

## Technologies
- **Frontend**: React, Three.js (react-three-fiber), Tone.js, Tailwind CSS.
- **Backend**: FastAPI, Demucs, Librosa, Static-FFmpeg.
- **Desktop**: Electron, Electron-Builder.
