import { useState, useEffect, useCallback, useRef } from 'react'
import * as Tone from 'tone'

export function usePlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [bpm, setBpm] = useState(120)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [analysis, setAnalysis] = useState(null)
  const [soloTrack, setSoloTrack] = useState(null)
  const [mutedTracks, setMutedTracks] = useState([])

  const playersRef = useRef({})

  const loadTrack = useCallback(async (analysisData) => {
    setAnalysis(analysisData)
    setDuration(analysisData.metadata.duration)
    setBpm(analysisData.metadata.tempo)

    const tracks = analysisData.tracks
    const newPlayers = {}

    const API_BASE = 'http://localhost:8000'
    for (const [name, path] of Object.entries(tracks)) {
       // Path is now relative to backend/processed
       const relativePath = path.split('backend/processed/')[1]
       const url = `${API_BASE}/static/${relativePath}`
       newPlayers[name] = new Tone.Player(url).toDestination()
    }

    playersRef.current = newPlayers
    Tone.getTransport().bpm.value = analysisData.metadata.tempo
  }, [])

  const togglePlay = useCallback(async () => {
    if (Tone.getContext().state !== 'running') {
      await Tone.start()
    }

    if (isPlaying) {
      Tone.getTransport().pause()
      Object.values(playersRef.current).forEach(p => p.stop())
    } else {
      const startTime = Tone.getTransport().seconds
      Tone.getTransport().start()
      Object.values(playersRef.current).forEach(p => {
        if (p.loaded) p.start(0, startTime)
      })
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const setSolo = useCallback((trackName) => {
    setSoloTrack(trackName === soloTrack ? null : trackName)
    Object.keys(playersRef.current).forEach(name => {
      playersRef.current[name].mute = (trackName && name !== trackName)
    })
  }, [soloTrack])

  const toggleMute = useCallback((trackName) => {
    const isMuted = mutedTracks.includes(trackName)
    const newMuted = isMuted ? mutedTracks.filter(t => t !== trackName) : [...mutedTracks, trackName]
    setMutedTracks(newMuted)
    playersRef.current[trackName].mute = !isMuted
  }, [mutedTracks])

  const updatePlaybackRate = useCallback((rate) => {
    setPlaybackRate(rate)
    Tone.getTransport().playbackRate = rate
    Object.values(playersRef.current).forEach(p => { p.playbackRate = rate })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentTime(Tone.getTransport().seconds)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [isPlaying])

  return {
    isPlaying,
    currentTime,
    duration,
    bpm,
    playbackRate,
    analysis,
    soloTrack,
    mutedTracks,
    loadTrack,
    togglePlay,
    setSolo,
    toggleMute,
    updatePlaybackRate,
    setCurrentTime: (time) => {
      Tone.getTransport().seconds = time
      setCurrentTime(time)
    }
  }
}
