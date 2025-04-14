// HexBoard.jsx
import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import TileInfoPanel from "../gameUI/infoTile";
import InteractiveBoard from "./interactiveElements";
import ExtrudedFogMask from "./fogMask";
import AudioSwitcher from "./audioSwitcher";

export default function HexBoard({ board, threshold = 8 }) {
  const [hoveredTile, setHoveredTile] = useState(null);
  const isDraggingRef = useRef(false);
  const dragTimeoutRef = useRef(null);
  const sciFiAudioRef = useRef(null);
  const natureAudioRef = useRef(null);

  // Setup background audio on mount.
  useEffect(() => {
    const sciFiAudio = new Audio("/music/sci-fi_loop.wav");
    sciFiAudio.loop = true;
    const natureAudio = new Audio("/music/nature_loop.wav");
    natureAudio.loop = true;
    const savedVolume = localStorage.getItem("musicVolume");
    const volume = savedVolume ? parseFloat(savedVolume) : 0.3;
    sciFiAudio.volume = volume;
    natureAudio.volume = volume;
    sciFiAudioRef.current = sciFiAudio;
    natureAudioRef.current = natureAudio;

    const tryPlay = () => {
      sciFiAudio
        .play()
        .catch((err) => console.log("Unable to play sci-fi audio:", err));
      natureAudio.pause();
      window.removeEventListener("click", tryPlay);
    };
    window.addEventListener("click", tryPlay);

    return () => {
      sciFiAudio.pause();
      sciFiAudio.currentTime = 0;
      natureAudio.pause();
      natureAudio.currentTime = 0;
      window.removeEventListener("click", tryPlay);
    };
  }, []);

  // Manage pointer drag state.
  const handlePointerDown = () => {
    isDraggingRef.current = true;
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
  };
  const handlePointerUp = () => {
    dragTimeoutRef.current = setTimeout(() => {
      isDraggingRef.current = false;
      dragTimeoutRef.current = null;
    }, 800);
  };

  return (
    <div className="relative">
      <Canvas
        camera={{ position: [10, 10, 15] }} // Initial camera position.
        style={{ width: "100vw", height: "100vh" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <ambientLight intensity={0.5} /> {/* Global ambient light */}
        <pointLight position={[10, 20, 10]} /> {/* Dynamic point light */}
        {/* Render hex board tiles */}
        <InteractiveBoard
          board={board}
          setHoveredTile={setHoveredTile}
          isDraggingRef={isDraggingRef}
        />
        {/* Orbit controls with damping and angle limits */}
        <MapControls
          enableDamping
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 4}
        />
        {/* Toggle background audio based on camera height */}
        <AudioSwitcher
          threshold={threshold}
          sciFiAudioRef={sciFiAudioRef}
          natureAudioRef={natureAudioRef}
        />
        {/* Render the extruded fog mask */}
        <ExtrudedFogMask board={board} spacing={board.spacing} wallHeight={5} />
      </Canvas>
      <TileInfoPanel tile={hoveredTile} /> {/* Display tile info */}
    </div>
  );
}
