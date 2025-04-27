"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from "react";
import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import hexToPosition from "../../../library/utililies/game/tileUtilities/positionFinder";
import TileInfoPanel from "../gameUI/infoTile";
import InteractiveBoard from "./interactiveElements";
import FogEnclosure from "./fogMask";
import AudioSwitcher from "./audioSwitcher";
import FogBestagon from "./fogagon";

// axial hex‐distance helper
function offsetToCube({ q, r }) {
  const x = q - (r - (r & 1)) / 2;
  const z = r;
  const y = -x - z;
  return { x, y, z };
}
function hexDistance(a, b) {
  const A = offsetToCube(a);
  const B = offsetToCube(b);
  return (Math.abs(A.x - B.x) + Math.abs(A.y - B.y) + Math.abs(A.z - B.z)) / 2;
}

const BoardCanvas = memo(function BoardCanvas({
  board,
  pieces,
  selectedPieceId,
  onTileClick,
  setHoveredTile,
  isDraggingRef,
}) {
  const heightScale = 0.5;

  // ➤ Compute only those tiles in range AND passable AND not the current tile
  const reachableTiles = useMemo(() => {
    if (selectedPieceId == null) return [];
    const sel = pieces.find((p) => p.id === selectedPieceId);
    if (!sel) return [];
    return board.tiles.filter((tile) => {
      // exclude the tile the piece currently occupies
      if (tile.q === sel.q && tile.r === sel.r) return false;
      const inRange = hexDistance(tile, sel) <= sel.move;
      const passable =
        tile.type !== "impassable mountain" &&
        (tile.type !== "water" || sel.amphibious);
      return inRange && passable;
    });
  }, [selectedPieceId, pieces, board.tiles]);

  return (
    <Canvas
      camera={{ position: [10, 10, 15] }}
      style={{ width: "100vw", height: "100vh" }}
      onPointerDown={() => (isDraggingRef.current = true)}
      onPointerUp={() => (isDraggingRef.current = false)}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 20, 10]} />

      {/* Base terrain + hover/click */}
      <InteractiveBoard
        board={board}
        setHoveredTile={setHoveredTile}
        isDraggingRef={isDraggingRef}
        onTileClick={onTileClick}
      />

      {/* Fog on undiscovered */}
      {board.tiles
        .filter((t) => !t.discovered)
        .map((tile) => {
          const [x, , z] = hexToPosition(tile.q, tile.r, board.spacing);
          const y = tile.height * heightScale + 0.01;
          return (
            <FogBestagon
              key={`fog-${tile.q}-${tile.r}`}
              position={[x, y, z]}
              userData={{ tile }}
              onClick={() => onTileClick(tile)}
              radius={board.spacing}
              thickness={0.3}
              speed={0.5}
            />
          );
        })}

      {/* MOVE BORDERS (wireframe) */}
      {reachableTiles.map((tile) => {
        const [x, , z] = hexToPosition(tile.q, tile.r, board.spacing);
        const y = tile.height * heightScale + 0.1;
        return (
          <mesh
            key={`border-${tile.q}-${tile.r}`}
            position={[x, y, z]}
            renderOrder={999}
          >
            {/* flat hex prism */}
            <cylinderGeometry
              args={[board.spacing * 0.85, board.spacing * 0.85, 0.02, 6]}
            />
            <meshBasicMaterial
              color="cyan"
              wireframe
              transparent
              opacity={0.8}
              depthTest={false}
            />
          </mesh>
        );
      })}

      {/* Pieces */}
      {pieces.map((p) => {
        const tile = board.tiles.find((t) => t.q === p.q && t.r === p.r);
        if (!tile) return null;
        const [x, , z] = hexToPosition(p.q, p.r, board.spacing);
        const y = tile.height * heightScale + 0.5;
        return (
          <mesh
            key={`piece-${p.id}`}
            position={[x, y, z]}
            onClick={(e) => {
              e.stopPropagation();
              onTileClick(tile);
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

      <MapControls
        enableDamping
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 4}
      />

      <AudioSwitcher
        threshold={board.threshold}
        sciFiAudioRef={useRef()}
        natureAudioRef={useRef()}
      />

      <FogEnclosure
        board={board}
        spacing={board.spacing}
        floorFactor={10}
        speed={0.15}
      />
    </Canvas>
  );
});

export default function HexBoard({ board: initialBoard, threshold = 8 }) {
  const [board, setBoard] = useState(initialBoard);
  const { id: boardId, tiles } = board;

  // ▶ Include amphibious flag in piece state
  const [pieces, setPieces] = useState(() =>
    initialBoard.pieces.map((p, idx) => ({
      id: p.id ?? idx,
      q: Number(p.q),
      r: Number(p.r),
      type: p.type,
      vision: p.vision,
      move: p.move,
      amphibious: Boolean(p.amphibious),
    }))
  );
  const [selectedPieceId, setSelectedPieceId] = useState(null);

  const [hoveredTile, setHoveredTile] = useState(null);
  const isDraggingRef = useRef(false);

  // Reveal/discover logic (unchanged)
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
    setBoard((b) => ({ ...b, tiles: newTiles }));
    fetch("/api/boardTable", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        board_id: boardId,
        board: { tiles: newTiles, pieces },
      }),
    }).catch(console.error);
  }, [pieces, tiles, boardId]);

  // Select / move logic with water and impassable checks
  const handleTileClick = useCallback(
    (tile) => {
      const clickedPiece = pieces.find((p) => p.q === tile.q && p.r === tile.r);
      if (clickedPiece) {
        setSelectedPieceId((id) =>
          id === clickedPiece.id ? null : clickedPiece.id
        );
        return;
      }

      if (selectedPieceId != null) {
        const sel = pieces.find((p) => p.id === selectedPieceId);
        const inRange = sel && hexDistance(tile, sel) <= sel.move;
        const passable =
          tile.type !== "impassable mountain" &&
          (tile.type !== "water" || sel.amphibious);

        if (sel && inRange && passable) {
          const updated = pieces.map((p) =>
            p.id === sel.id ? { ...p, q: tile.q, r: tile.r } : p
          );
          setPieces(updated);
          setSelectedPieceId(null);
          fetch("/api/boardTable", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              board_id: boardId,
              board: { tiles, pieces: updated },
            }),
          }).catch(console.error);
        }
      }
    },
    [pieces, selectedPieceId, tiles, boardId]
  );

  return (
    <div className="relative">
      <BoardCanvas
        board={board}
        pieces={pieces}
        selectedPieceId={selectedPieceId}
        onTileClick={handleTileClick}
        setHoveredTile={setHoveredTile}
        isDraggingRef={isDraggingRef}
      />
      <TileInfoPanel tile={hoveredTile} />
    </div>
  );
}
