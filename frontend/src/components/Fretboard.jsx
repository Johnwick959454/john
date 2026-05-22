import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'

const STRINGS = 5
const FRETS = 24
const BOARD_WIDTH = 12

function String({ position, index, isActive }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (isActive && meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 40) * 0.01
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.01 + (4 - index) * 0.005, 0.01 + (4 - index) * 0.005, BOARD_WIDTH, 8]} />
      <meshStandardMaterial
        color={isActive ? "#00f3ff" : "#888"}
        emissive={isActive ? "#00f3ff" : "#000"}
        emissiveIntensity={isActive ? 2 : 0}
      />
    </mesh>
  )
}

function FretboardContent({ activeNote }) {
  const fretPositions = useMemo(() => {
    const positions = []
    for (let i = 0; i <= FRETS; i++) {
      positions.push(-BOARD_WIDTH / 2 + (i * (BOARD_WIDTH / FRETS)))
    }
    return positions
  }, [])

  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <RoundedBox args={[2, 0.2, BOARD_WIDTH]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </RoundedBox>

      {fretPositions.map((pos, i) => (
        <mesh key={i} position={[0, 0.1, pos]}>
          <boxGeometry args={[2, 0.05, 0.02]} />
          <meshStandardMaterial color="#444" metalness={0.8} />
        </mesh>
      ))}

      {[...Array(STRINGS)].map((_, i) => (
        <String
          key={i}
          index={i}
          position={[(i - 2) * 0.4, 0.15, 0]}
          isActive={activeNote?.string === i}
        />
      ))}

      {activeNote && (
        <group position={[(activeNote.string - 2) * 0.4, 0.2, fretPositions[activeNote.fret] - (BOARD_WIDTH / FRETS / 2)]}>
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="#00f3ff" />
          </mesh>
          <pointLight color="#00f3ff" intensity={1} distance={2} />
          <Text
            position={[0, 0.3, 0]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          >
            {activeNote.note}
          </Text>
        </group>
      )}
    </group>
  )
}

export default function Fretboard({ activeNote }) {
  return (
    <div className="w-full h-full bg-black/20">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={40} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <FretboardContent activeNote={activeNote} />
      </Canvas>
    </div>
  )
}
