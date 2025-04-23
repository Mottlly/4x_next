import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import hexToPosition from "../tileUtilities/positionFinder";
import TileInfoPanel from "../gameUI/infoTile";
import InteractiveBoard from "./interactiveElements";
import VolumetricFogMask from "./fogMask";
import AudioSwitcher from "./audioSwitcher";

export default function HexBoard({ board, threshold = 8 }) {
  // ── pull out board.id so we can PATCH by that primary key
  const { id: boardId, tiles, spacing, pieces: initialPieces = [] } = board;

  const [hoveredTile, setHoveredTile] = useState(null);
  const isDraggingRef = useRef(false);
  const dragTimeoutRef = useRef(null);
  const sciFiAudioRef = useRef(null);
  const natureAudioRef = useRef(null);
  const heightScale = 0.5;

  // ── manage arbitrary number of pieces
  const [pieces, setPieces] = useState(() =>
    initialPieces.map((p, idx) => ({
      id: p.id ?? idx,
      q: Number(p.q),
      r: Number(p.r),
      type: p.type,
      vision: p.vision,
    }))
  );
  const [selectedPieceId, setSelectedPieceId] = useState(null);

  // ── click handler: select, move & PATCH
  const handleTileClick = async (tile) => {
    // did we click on an existing piece?
    const clickedPiece = pieces.find((p) => p.q === tile.q && p.r === tile.r);
    if (clickedPiece) {
      // toggle select
      setSelectedPieceId((id) =>
        id === clickedPiece.id ? null : clickedPiece.id
      );
      return;
    }

    // if a piece is selected, move it
    if (selectedPieceId !== null) {
      const updated = pieces.map((p) =>
        p.id === selectedPieceId ? { ...p, q: tile.q, r: tile.r } : p
      );
      setPieces(updated);
      setSelectedPieceId(null);

      // ── PATCH the new board state back to the DB
      try {
        const res = await fetch("/api/boardTable", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            board_id: boardId,
            board: { tiles, pieces: updated },
          }),
        });
        if (!res.ok) {
          console.error("PATCH failed:", await res.text());
        }
      } catch (err) {
        console.error("PATCH error:", err);
      }
    }
  };

  return (
    <div className="relative">
      <Canvas
        camera={{ position: [10, 10, 15] }}
        style={{ width: "100vw", height: "100vh" }}
        onPointerDown={() => (isDraggingRef.current = true)}
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
          pieces={board.pieces}
          wallHeight={5}
        />

        {/* render each piece */}
        {pieces.map((p) => {
          const tile = tiles.find((t) => t.q === p.q && t.r === p.r);
          if (!tile) return null;
          const [x, , z] = hexToPosition(p.q, p.r, spacing);
          const y = tile.height * heightScale + 0.5;

          return (
            <mesh
              key={p.id}
              position={[x, y, z]}
              onClick={(e) => {
                e.stopPropagation();
                handleTileClick(tile);
              }}
            >
              <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
              <meshStandardMaterial
                color={
                  selectedPieceId === p.id
                    ? "yellow"
                    : p.type === "pod"
                    ? "green"
                    : "red"
                }
              />
            </mesh>
          );
        })}
      </Canvas>

      <TileInfoPanel tile={hoveredTile} />
    </div>
  );
}
