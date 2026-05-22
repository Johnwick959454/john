import React, { useState, useEffect, useMemo } from 'react'
import { Play, Pause, SkipBack, Music, Video, Upload, Settings, Loader2 } from 'lucide-react'
import Fretboard from './components/Fretboard'
import PianoKeyboard from './components/PianoKeyboard'
import ChordTimeline from './components/ChordTimeline'
import Tablature from './components/Tablature'
import { usePlayer } from './hooks/usePlayer'
import { api } from './services/api'

function App() {
  const {
    isPlaying,
    currentTime,
    duration,
    bpm,
    analysis,
    loadTrack,
    togglePlay,
    setCurrentTime
  } = usePlayer()

  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const activeNote = useMemo(() => {
    if (!analysis?.bass_notes) return null
    return analysis.bass_notes.find(n =>
      currentTime >= n.start && currentTime <= (n.start + n.duration)
    )
  }, [analysis, currentTime])

  const activeChord = useMemo(() => {
    if (!analysis?.metadata?.chords) return []
    const chord = analysis.metadata.chords.find((c, i) => {
      const nextChord = analysis.metadata.chords[i+1]
      return currentTime >= c.time && (!nextChord || currentTime < nextChord.time)
    })
    return chord ? [chord.chord] : []
  }, [analysis, currentTime])

  const mappedNote = useMemo(() => {
    if (!activeNote) return null
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const tunings = [7, 2, 9, 4, 11] // G, D, A, E, B relative to C
    const noteIdx = noteNames.indexOf(activeNote.note.replace(/[0-9]/g, ''))
    const octave = parseInt(activeNote.note.replace(/[^0-9]/g, ''))
    const absoluteHalfSteps = noteIdx + octave * 12

    // Find best string/fret
    let string = 4
    let fret = absoluteHalfSteps - (11 + 0 * 12) // B0

    if (fret > 24) { string = 3; fret = absoluteHalfSteps - (4 + 1 * 12); } // E1
    if (fret > 24 || fret < 0) { string = 2; fret = absoluteHalfSteps - (9 + 1 * 12); } // A1

    return { string, fret: Math.max(0, Math.min(24, fret)), note: activeNote.note }
  }, [activeNote])

  const handleYoutubeSubmit = async (e) => {
    if (e.key === 'Enter' && youtubeUrl) {
      setIsProcessing(true)
      try {
        const res = await api.processYoutube(youtubeUrl)
        const fileId = res.data.id
        const poll = setInterval(async () => {
           const statusRes = await api.getStatus(fileId)
           if (statusRes.data.status === 'complete') {
              clearInterval(poll)
              loadTrack(statusRes.data.data)
              setIsProcessing(false)
           }
        }, 3000)
      } catch (err) {
        console.error(err)
        setIsProcessing(false)
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-dark text-white overflow-hidden">
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neon rounded-lg flex items-center justify-center">
            <Music className="text-black w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">BASS<span className="text-neon">AI</span></h1>
        </div>
        <div className="flex items-center gap-4 flex-1 max-w-2xl mx-10">
          <div className="relative w-full group">
            <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-neon w-4 h-4 transition-colors" />
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              onKeyDown={handleYoutubeSubmit}
              placeholder="Paste YouTube Link..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 transition-all text-sm"
            />
            {isProcessing && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-neon" />}
          </div>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm transition-colors whitespace-nowrap">
            <Upload className="w-4 h-4" />
            Upload File
          </button>
        </div>
        <div className="flex items-center gap-4">
          <Settings className="w-5 h-5 text-white/60 hover:text-white cursor-pointer transition-colors" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon to-neon-purple" />
        </div>
      </header>
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="h-1/3 border-b border-white/5 bg-black/20 relative flex items-center justify-center overflow-hidden">
           <div className="w-full h-full opacity-30 flex items-end gap-1 px-4">
              {[...Array(100)].map((_, i) => (
                <div
                  key={i}
                  className="bg-neon w-full transition-all duration-300"
                  style={{ height: `${Math.random() * 80 + 10}%`, opacity: isPlaying ? 1 : 0.5 }}
                />
              ))}
           </div>
           <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="text-white/40 text-xs uppercase tracking-widest font-bold">Audio Spectrum Analysis</span>
           </div>
        </div>
        <div className="h-1/3 border-b border-white/5 bg-black/40 relative">
          <Fretboard activeNote={mappedNote} />
          <Tablature notes={analysis?.bass_notes} currentTime={currentTime} />
        </div>
        <div className="h-1/3 bg-black/60 relative flex flex-col">
          <div className="h-12 border-b border-white/5 bg-black/40">
             <ChordTimeline chords={analysis?.metadata?.chords} currentTime={currentTime} />
          </div>
          <div className="flex-1 flex items-center justify-center">
             <PianoKeyboard activeNotes={useMemo(() => {
                if (!activeChord.length) return []
                const chord = activeChord[0]
                const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
                let root = chord[0]
                if (chord[1] === '#') root += '#'
                const suffix = chord.replace(root, '')
                const rootIdx = notes.indexOf(root)
                const templates = {
                    "": [0, 4, 7],
                    "m": [0, 3, 7],
                    "7": [0, 4, 7, 10],
                    "maj7": [0, 4, 7, 11],
                    "m7": [0, 3, 7, 10],
                    "sus4": [0, 5, 7],
                    "sus2": [0, 2, 7],
                    "5": [0, 7],
                }
                const intervals = templates[suffix] || [0]
                return intervals.map(i => `${notes[(rootIdx + i) % 12]}3`)
             }, [activeChord])} />
          </div>
        </div>
      </main>
      <footer className="h-20 bg-black border-t border-white/10 flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <SkipBack className="w-5 h-5 text-white/60 hover:text-white cursor-pointer" onClick={() => setCurrentTime(0)} />
            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? <Pause className="text-black fill-black w-5 h-5" /> : <Play className="text-black fill-black w-5 h-5 ml-1" />}
            </button>
          </div>
          <div className="flex flex-col">
             <span className="text-sm font-medium">{analysis ? 'Processed Track' : 'No Track Loaded'}</span>
             <span className="text-xs text-white/40">
               {new Date(currentTime * 1000).toISOString().substr(14, 5)} /
               {new Date(duration * 1000).toISOString().substr(14, 5)}
             </span>
          </div>
        </div>
        <div className="flex-1 max-w-2xl mx-12">
          <div
            className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const percent = (e.clientX - rect.left) / rect.width
              setCurrentTime(percent * duration)
            }}
          >
            <div
              className="absolute top-0 left-0 h-full bg-neon group-hover:bg-cyan-400 transition-colors"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
             <span className="text-xs uppercase text-white/40 font-bold">BPM</span>
             <span className="text-sm font-mono text-neon">{bpm.toFixed(1)}</span>
           </div>
           <div className="flex flex-col items-end">
             <span className="text-xs uppercase text-white/40 font-bold">Key</span>
             <span className="text-sm font-mono text-neon-purple">{analysis?.metadata?.key || '--'}</span>
           </div>
        </div>
      </footer>
    </div>
  )
}

export default App
