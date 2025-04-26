// HexBoard.jsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import hexToPosition from "../../../library/utililies/game/tileUtilities/positionFinder";
import { getColorForType } from "./interactiveElements"; // wherever you get colors
import TileInfoPanel from "../gameUI/infoTile";
import InteractiveBoard from "./interactiveElements";
import FogEnclosure from "./fogMask";
import AudioSwitcher from "./audioSwitcher";
import FogBestagon from "./fogagon";

// axial hex‐distance helper
function hexDistance(a, b) {
  const dq = a.q - b.q;
  const dr = a.r - b.r;
  const ds = -a.q - a.r - (-b.q - b.r);
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(ds)) / 2;
}

export default function HexBoard({ board: initialBoard, threshold = 8 }) {
  // ─── keep full board (with discovered flags) in state ────
  const [board, setBoard] = useState(initialBoard);
  const { id: boardId, spacing, tiles } = board;

  // ─── pieces carry their own vision radii ─────────────────
  const [pieces, setPieces] = useState(() =>
    initialBoard.pieces.map((p, idx) => ({
      id: p.id ?? idx,
      q: Number(p.q),
      r: Number(p.r),
      type: p.type,
      vision: p.vision,
    }))
  );
  const [selectedPieceId, setSelectedPieceId] = useState(null);

  // ─── hover + drag refs ───────────────────────────────────
  const [hoveredTile, setHoveredTile] = useState(null);
  const isDraggingRef = useRef(false);
  const dragTimeoutRef = useRef(null);
  const sciFiAudioRef = useRef(null);
  const natureAudioRef = useRef(null);
  const heightScale = 0.5;

  // ─── when pieces move, reveal any tiles in their vision ──
  useEffect(() => {
    let changed = false;
    const newTiles = tiles.map((tile) => {
      if (tile.discovered) return tile;
      if (pieces.some((p) => hexDistance(tile, p) <= p.vision)) {
        changed = true;
        return { ...tile, discovered: true };
      }
      return tile;
    });

    if (!changed) return;

    const newBoard = { ...board, tiles: newTiles };
    setBoard(newBoard);

    // persist new discovered flags
    fetch("/api/boardTable", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        board_id: boardId,
        board: { tiles: newTiles, pieces },
      }),
    }).catch(console.error);
  }, [pieces]);

  // ─── click handler: only select/move pieces, never reveal ──
  const handleTileClick = async (tile) => {
    // toggle select if clicking a piece
    const clicked = pieces.find((p) => p.q === tile.q && p.r === tile.r);
    if (clicked) {
      setSelectedPieceId((id) => (id === clicked.id ? null : clicked.id));
      return;
    }

    // move selected piece if any
    if (selectedPieceId !== null) {
      const updated = pieces.map((p) =>
        p.id === selectedPieceId ? { ...p, q: tile.q, r: tile.r } : p
      );
      setPieces(updated);
      setSelectedPieceId(null);

      // persist move (tiles stay the same here)
      fetch("/api/boardTable", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board_id: boardId,
          board: { tiles, pieces: updated },
        }),
      }).catch(console.error);
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

        {/* base terrain */}
        <InteractiveBoard
          board={board}
          setHoveredTile={setHoveredTile}
          isDraggingRef={isDraggingRef}
          onTileClick={handleTileClick}
        />

        {/* fog‐cover only on undiscovered */}
        {tiles
          .filter((t) => !t.discovered)
          .map((tile) => {
            const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
            const y = tile.height * heightScale + 0.01;
            return (
              <FogBestagon
                key={`${tile.q}-${tile.r}`}
                position={[x, y, z]}
                userData={{ tile }}
                onClick={handleTileClick}
                radius={spacing}
                thickness={0.3}
                speed={0.5}
              />
            );
          })}

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

        <FogEnclosure
          board={board}
          spacing={spacing}
          floorFactor={10}
          speed={0.15}
        />

        {/* pieces on top */}
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
