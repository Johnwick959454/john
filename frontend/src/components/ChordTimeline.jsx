import React from 'react'

export default function ChordTimeline({ chords = [], currentTime = 0 }) {
  return (
    <div className="w-full h-full relative overflow-hidden flex items-center px-10">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neon z-20 shadow-[0_0_10px_#00f3ff]" />

      <div
        className="flex gap-40 transition-transform duration-100 ease-linear"
        style={{ transform: `translateX(calc(50% - ${currentTime * 100}px))` }}
      >
        {chords.map((chord, i) => (
          <div
            key={i}
            className="flex flex-col items-center"
            style={{ position: 'absolute', left: chord.time * 100 }}
          >
            <span className="text-neon font-bold text-lg mb-1">{chord.chord}</span>
            <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>
        ))}
      </div>
    </div>
  )
}
