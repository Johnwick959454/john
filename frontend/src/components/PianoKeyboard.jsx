import React, { useMemo } from 'react'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export default function PianoKeyboard({ activeNotes = [] }) {
  const keys = useMemo(() => {
    const k = []
    for (let octave = 2; octave <= 4; octave++) {
      NOTES.forEach((note) => {
        const isBlack = note.includes('#')
        k.push({ note: `${note}${octave}`, isBlack })
      })
    }
    return k
  }, [])

  return (
    <div className="flex h-32 w-full justify-center bg-black/40 px-4 overflow-hidden">
      <div className="flex relative h-full">
        {keys.map((key, i) => (
          <div
            key={i}
            className={`
              relative flex-shrink-0
              ${key.isBlack
                ? 'w-6 h-20 -mx-3 z-10 rounded-b-sm'
                : 'w-10 h-32 border-x border-black/10 rounded-b-md'}
              ${key.isBlack ? 'bg-zinc-800' : 'bg-zinc-100'}
              transition-colors duration-100
            `}
            style={{
              backgroundColor: activeNotes.includes(key.note)
                ? (key.isBlack ? '#bc00ff' : '#00f3ff')
                : undefined,
              boxShadow: activeNotes.includes(key.note)
                ? `0 0 20px ${key.isBlack ? '#bc00ff' : '#00f3ff'}88`
                : undefined
            }}
          >
            {!key.isBlack && (
              <span className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black/20 font-bold">
                {key.note}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
