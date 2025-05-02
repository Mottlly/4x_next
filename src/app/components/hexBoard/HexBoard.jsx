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
import { hexDistance } from "../../../library/utililies/game/tileUtilities/distanceFinder";
import useMoveHandler from "./useMoveHandler";
import useEndTurn from "./useEndTurn";
import TileInfoPanel from "../gameUI/infoTile";
import NextTurnButton from "../gameUI/endTurn";
import InteractiveBoard from "./interactiveElements";
import FogEnclosure from "./fogMask";
import AudioSwitcher from "./audioSwitcher";
import FogBestagon from "./fogagon";
import { defaultFriendlyPiece } from "../../../library/utililies/game/gamePieces/friendlyPieces";

const BoardCanvas = memo(function BoardCanvas({
  board,
  pieces,
  selectedPieceId,
  onTileClick,
  setHoveredTile,
  isDraggingRef,
}) {
  const heightScale = 0.5;

  const reachableTiles = useMemo(() => {
    if (selectedPieceId == null) return [];
    const sel = pieces.find((p) => p.id === selectedPieceId);
    if (!sel) return [];

    const { movesLeft, abilities } = sel;
    const { seafaring, coastfaring, amphibious, mountaineering, flying } =
      abilities;

    return board.tiles.filter((tile) => {
      if (tile.q === sel.q && tile.r === sel.r) return false;
      const dist = hexDistance(tile, sel);
      if (dist > movesLeft) return false;

      const isWaterOrLake = tile.type === "water" || tile.type === "lake";
      const waterPass = !isWaterOrLake || amphibious || seafaring;
      const coastPass = !isWaterOrLake || coastfaring;
      const mountainPass =
        tile.type !== "impassable mountain" || mountaineering;
      const passable = flying || (waterPass && coastPass && mountainPass);

      return passable;
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

      <InteractiveBoard
        board={board}
        setHoveredTile={setHoveredTile}
        isDraggingRef={isDraggingRef}
        onTileClick={onTileClick}
      />

      {/* Fog */}
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

      {/* Rivers */}
      {board.tiles
        .filter((t) => t.riverPresent)
        .map((tile) => {
          const [x, , z] = hexToPosition(tile.q, tile.r, board.spacing);
          const y = tile.height * heightScale + 0.05;
          return (
            <mesh
              key={`river-${tile.q}-${tile.r}`}
              position={[x, y, z]}
              renderOrder={1000}
            >
              <sphereGeometry args={[board.spacing * 0.1, 8, 8]} />
              <meshStandardMaterial color="deepskyblue" />
            </mesh>
          );
        })}

      {/* Move borders */}
      {reachableTiles.map((tile) => {
        const [x, , z] = hexToPosition(tile.q, tile.r, board.spacing);
        const y = tile.height * heightScale + 0.1;
        return (
          <mesh
            key={`border-${tile.q}-${tile.r}`}
            position={[x, y, z]}
            renderOrder={999}
          >
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
  // initialBoard MUST include turn from API
  const { id: boardId, tiles, turn: initialTurn } = initialBoard;
  console.log("HexBoard", initialBoard);

  // Local state
  const [board, setBoard] = useState(initialBoard);
  const [currentTurn, setCurrentTurn] = useState(initialTurn);
  const [pieces, setPieces] = useState(() =>
    initialBoard.pieces.map((p) => ({ ...defaultFriendlyPiece, ...p }))
  );
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [hoveredTile, setHoveredTile] = useState(null);
  const isDraggingRef = useRef(false);

  // Reveal logic
  useEffect(() => {
    let changed = false;
    const newTiles = board.tiles.map((tile) => {
      if (tile.discovered) return tile;
      if (pieces.some((p) => hexDistance(tile, p) <= p.vision)) {
        changed = true;
        return { ...tile, discovered: true };
      }
      return tile;
    });
    if (changed) setBoard((b) => ({ ...b, tiles: newTiles }));
  }, [pieces, tiles]);

  // Handle moves
  const handleTileClick = useMoveHandler(
    pieces,
    selectedPieceId,
    setPieces,
    setSelectedPieceId
  );

  // End turn
  const nextTurn = useEndTurn(
    boardId,
    board,
    setBoard,
    currentTurn,
    setCurrentTurn,
    pieces,
    setPieces
  );

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-20"></div>
      <BoardCanvas
        board={board}
        pieces={pieces}
        selectedPieceId={selectedPieceId}
        onTileClick={handleTileClick}
        setHoveredTile={setHoveredTile}
        isDraggingRef={isDraggingRef}
      />
      <TileInfoPanel tile={hoveredTile} />
      <NextTurnButton currentTurn={currentTurn} onNext={nextTurn} />
    </div>
  );
}
