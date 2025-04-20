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

  // 1️⃣ Where the piece currently sits
  const [piecePos, setPiecePos] = useState(() => {
    const first = board.tiles?.[0];
    return first ? { q: first.q, r: first.r } : { q: 0, r: 0 };
  });
  // 2️⃣ Whether the piece is “selected” and ready to move
  const [pieceSelected, setPieceSelected] = useState(false);

  // → audio setup, handlePointerDown/up, etc. remain unchanged…

  // 3️⃣ Unified click handler passed to InteractiveBoard
  const handleTileClick = (tile) => {
    const isOnPiece = tile.q === piecePos.q && tile.r === piecePos.r;

    if (isOnPiece) {
      // Toggle selection when clicking the piece itself
      setPieceSelected((sel) => !sel);
    } else if (pieceSelected) {
      // Move piece to the new tile, then deselect
      setPiecePos({ q: tile.q, r: tile.r });
      setPieceSelected(false);
    }
    // otherwise: clicking other tiles does nothing
  };

  return (
    <div className="relative">
      <Canvas
        camera={{ position: [10, 10, 15] }}
        style={{ width: "100vw", height: "100vh" }}
        onPointerDown={() => {
          isDraggingRef.current = true;
        }}
        onPointerUp={() => {
          isDraggingRef.current = false;
          if (dragTimeoutRef.current) {
            clearTimeout(dragTimeoutRef.current);
            dragTimeoutRef.current = null;
          }
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 20, 10]} />

        <InteractiveBoard
          board={board}
          setHoveredTile={setHoveredTile}
          isDraggingRef={isDraggingRef}
          onTileClick={handleTileClick}
        />

        <MapControls
          enableDamping
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 4}
        />

        <AudioSwitcher
          threshold={threshold}
          sciFiAudioRef={sciFiAudioRef}
          natureAudioRef={natureAudioRef}
        />

        <VolumetricFogMask
          board={board}
          spacing={board.spacing}
          wallHeight={5}
        />

        {/* 4️⃣ Render the piece, color it yellow if selected */}
        {(() => {
          const tile = board.tiles.find(
            (t) => t.q === piecePos.q && t.r === piecePos.r
          );
          if (!tile) return null;
          const [x, , z] = hexToPosition(tile.q, tile.r, board.spacing);
          const y = tile.height * heightScale + 0.5;
          return (
            <mesh position={[x, y, z]}>
              <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
              <meshStandardMaterial color={pieceSelected ? "yellow" : "red"} />
            </mesh>
          );
        })()}
      </Canvas>

      <TileInfoPanel tile={hoveredTile} />
    </div>
  );
}
