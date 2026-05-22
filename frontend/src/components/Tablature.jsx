import React from 'react'

export default function Tablature({ notes = [], currentTime = 0 }) {
  const STRINGS = ['G', 'D', 'A', 'E', 'B']
  const PIXELS_PER_SECOND = 100

  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-black/80 border-t border-neon/20 overflow-hidden flex items-center">
      <div className="absolute left-10 top-0 bottom-0 w-px bg-neon/50 z-20" />

      <div
        className="flex gap-0 transition-transform duration-100 ease-linear h-full items-center"
        style={{ transform: `translateX(calc(40px - ${currentTime * PIXELS_PER_SECOND}px))` }}
      >
        <div className="absolute left-0 right-0 h-full flex flex-col justify-between py-2 pointer-events-none opacity-20">
          {STRINGS.map(s => <div key={s} className="w-[50000px] h-px bg-white" />)}
        </div>

        {notes.map((note, i) => {
          const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
          const tunings = [7, 2, 9, 4, 11]
          const noteIdx = noteNames.indexOf(note.note.replace(/[0-9]/g, ''))
          const octave = parseInt(note.note.replace(/[^0-9]/g, ''))
          const absoluteHalfSteps = noteIdx + octave * 12

          let bestString = 4
          let bestFret = absoluteHalfSteps - (11 + 0 * 12) // B0

          return (
            <div
              key={i}
              className="absolute flex items-center justify-center bg-black border border-neon text-neon text-[10px] font-bold rounded-sm w-5 h-4"
              style={{
                left: note.start * PIXELS_PER_SECOND,
                top: `${(bestString * 20) + 10}%`,
                transform: 'translateY(-50%)'
              }}
            >
              {bestFret}
            </div>
          )
        })}
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-10 bg-black z-30 flex flex-col justify-between py-2 text-[10px] font-mono text-white/40 pl-2">
        {STRINGS.map(s => <span key={s}>{s} |</span>)}
      </div>
    </div>
  )
}
