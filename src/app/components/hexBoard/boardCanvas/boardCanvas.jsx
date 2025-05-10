"use client";

import React, { memo, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import { hexDistance } from "../../../../library/utililies/game/tileUtilities/distanceFinder";

import InteractiveBoard from "./interactiveElements";
import AudioSwitcher from "./audioSwitcher";
import FogEnclosure from "./fogMask";

import BuildingLayer from "./layers/buildingLayer";
import FogLayer from "./layers/fogLayer";
import RiverLayer from "./layers/riverLayer";
import MovementLayer from "./layers/movementLayer";
import PiecesLayer from "./layers/piecesLayer";

const BoardCanvas = memo(function BoardCanvas({
  board,
  pieces,
  selectedPieceId,
  onTileClick,
  setHoveredTile,
  isDraggingRef,
}) {
  const heightScale = 0.5;

  // precompute reachable tiles for the movement layer
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

      {/* Base hex board + pointer handling */}
      <InteractiveBoard
        board={board}
        setHoveredTile={setHoveredTile}
        isDraggingRef={isDraggingRef}
        onTileClick={onTileClick}
      />

      {/* Render layers */}
      <BuildingLayer board={board} heightScale={heightScale} />
      <FogLayer
        board={board}
        heightScale={heightScale}
        onTileClick={onTileClick}
      />
      <RiverLayer board={board} heightScale={heightScale} />
      <MovementLayer
        reachableTiles={reachableTiles}
        board={board}
        heightScale={heightScale}
      />
      <PiecesLayer
        pieces={pieces}
        selectedPieceId={selectedPieceId}
        board={board}
        heightScale={heightScale}
        onTileClick={onTileClick}
      />

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

export default BoardCanvas;
