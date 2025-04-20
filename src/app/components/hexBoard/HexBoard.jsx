import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import { hexToPosition } from "./hexUtilities";
import TileInfoPanel from "../gameUI/infoTile";
import InteractiveBoard from "./interactiveElements";
import VolumetricFogMask from "./fogMask";
import AudioSwitcher from "./audioSwitcher";

export default function HexBoard({ board, threshold = 8 }) {
  const [hoveredTile, setHoveredTile] = useState(null);
  const isDraggingRef = useRef(false);
  const dragTimeoutRef = useRef(null);
  const sciFiAudioRef = useRef(null);
  const natureAudioRef = useRef(null);

  const heightScale = 0.5;

  // Piece sits on whichever tile you click
  const [piecePos, setPiecePos] = useState(() => {
    const first = board.tiles?.[0];
    return first ? { q: first.q, r: first.r } : { q: 0, r: 0 };
  });

  // Setup background audio on mount.
  useEffect(() => {
    const sciFiAudio = new Audio("/music/sci-fi_loop.wav");
    sciFiAudio.loop = true;
    const natureAudio = new Audio("/music/nature_loop.wav");
    natureAudio.loop = true;
    const savedVolume = localStorage.getItem("musicVolume");
    const volume = savedVolume ? parseFloat(savedVolume) : 0.3;
    sciFiAudio.volume = volume;
    natureAudio.volume = volume - 0.2;
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
          onTileClick={(tile) => {
            console.log("Moving piece to:", tile);
            setPiecePos({ q: tile.q, r: tile.r });
          }}
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
        <VolumetricFogMask
          board={board}
          spacing={board.spacing}
          wallHeight={5}
        />
        {/* — render the “piece” on top of the selected tile */}
        {(() => {
          const tile = board.tiles.find(
            (t) => t.q === piecePos.q && t.r === piecePos.r
          );
          if (!tile) return null;
          const [x, , z] = hexToPosition(tile.q, tile.r, board.spacing);
          const y = tile.height * heightScale + 0.5; // lift it up a bit
          return (
            <mesh position={[x, y, z]}>
              <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
              <meshStandardMaterial color="red" />
            </mesh>
          );
        })()}
      </Canvas>
      <TileInfoPanel tile={hoveredTile} /> {/* Display tile info */}
    </div>
  );
}
