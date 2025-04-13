import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import Bestagon from "@/app/components/bestagon";
import TileInfoPanel from "../components/gameUI/infoTile";

// Utility: Map tile type to color
const getColorForType = (type) => {
  switch (type) {
    case "water":
      return "#4169E1";
    case "lake":
      return "#007BA7";
    case "forest":
      return "#228B22";
    case "desert":
      return "#EDC9Af";
    case "mountain":
      return "#A9A9A9";
    case "impassable mountain":
      return "#555555"; // Color for impassable mountain tiles
    case "plains":
      return "#90EE90";
    default:
      return "#CCCCCC";
  }
};

// Convert axial coordinates to 3D position
const hexToPosition = (q, r, spacing) => {
  const xOffset = spacing * 1.65;
  const zOffset = spacing * 1.42;
  return [q * xOffset + (r % 2) * (xOffset / 2), 0, -r * zOffset];
};

const InteractiveBoard = ({ board, setHoveredTile, isDraggingRef }) => {
  const groupRef = useRef();
  const previousTileRef = useRef(null);
  const elements = [];

  // Optional: height scaling to adjust tile differences, if desired
  const heightScale = 0.5;

  const handlePointerMove = (event) => {
    if (isDraggingRef.current) return;
    event.stopPropagation();

    const intersect = event.intersections?.[0];
    const tile = intersect?.object?.userData?.tile || null;
    const prev = previousTileRef.current;

    const sameTile =
      tile &&
      prev &&
      tile.q === prev.q &&
      tile.r === prev.r &&
      tile.type === prev.type;

    if (sameTile || (!tile && !prev)) return;

    previousTileRef.current = tile;
    setHoveredTile(tile);
  };

  board.tiles.forEach((tile) => {
    const { q, r, type, height, river } = tile;
    const pos = hexToPosition(q, r, board.spacing);
    const color = getColorForType(type);
    elements.push(
      <group key={`tile-${q}-${r}`}>
        <Bestagon
          position={[pos[0], height * heightScale, pos[2]]} // using heightScale
          color={color}
          userData={{ tile: { q, r, type, height, river } }}
        />
        {river && (
          <mesh position={[pos[0], height * heightScale + 0.1, pos[2]]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#0000FF" />
          </mesh>
        )}
      </group>
    );
  });

  return (
    <group ref={groupRef} onPointerMove={handlePointerMove}>
      {elements}
    </group>
  );
};

// AudioSwitcher monitors the camera every frame to switch audio loops.
const AudioSwitcher = ({ threshold, sciFiAudioRef, natureAudioRef }) => {
  const { camera } = useThree();
  useFrame(() => {
    if (!sciFiAudioRef.current || !natureAudioRef.current) return;

    // When the camera's y (height) is below the threshold, play nature audio
    if (camera.position.y < threshold) {
      if (!natureAudioRef.current.paused) {
        // already playing nature audio
      } else {
        natureAudioRef.current.play().catch(() => {});
      }
      if (!sciFiAudioRef.current.paused) {
        sciFiAudioRef.current.pause();
      }
    } else {
      if (!sciFiAudioRef.current.paused) {
        // already playing sci-fi audio
      } else {
        sciFiAudioRef.current.play().catch(() => {});
      }
      if (!natureAudioRef.current.paused) {
        natureAudioRef.current.pause();
      }
    }
  });
  return null;
};

export default function HexBoard({ board, threshold = 8 }) {
  const [hoveredTile, setHoveredTile] = useState(null);
  const isDraggingRef = useRef(false);
  const dragTimeoutRef = useRef(null);

  // Audio refs for sci-fi and nature loops
  const sciFiAudioRef = useRef(null);
  const natureAudioRef = useRef(null);

  // Setup background audio when the component mounts
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

    // On user interaction, try to play the sci-fi loop (nature starts paused)
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

  // Manage dragging status (for pointer interaction on the board)
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
        camera={{ position: [10, 10, 15] }}
        style={{ width: "100vw", height: "100vh" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 20, 10]} />
        <InteractiveBoard
          board={board}
          setHoveredTile={setHoveredTile}
          isDraggingRef={isDraggingRef}
        />
        <MapControls
          enableDamping
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 3}
        />
        {/* The AudioSwitcher component uses the camera's position to switch audio */}
        <AudioSwitcher
          threshold={threshold}
          sciFiAudioRef={sciFiAudioRef}
          natureAudioRef={natureAudioRef}
        />
      </Canvas>
      <TileInfoPanel tile={hoveredTile} />
    </div>
  );
}
