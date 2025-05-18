"use client";

import React, { memo, useMemo, useRef, useCallback } from "react";
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
import SemiFogLayer from "./layers/semiFogLayer";

const BoardCanvas = memo(function BoardCanvas({
  board,
  pieces,
  selectedPieceId,
  onTileClick,
  setHoveredTile,
  isDraggingRef,
  spawnTiles = [],
}) {
  const heightScale = 0.5;

  const buildingTiles = useMemo(
    () => board.tiles.filter((t) => !!t.building),
    [board.tiles]
  );
  const fogTiles = useMemo(
    () => board.tiles.filter((t) => !t.discovered),
    [board.tiles]
  );
  const riverTiles = useMemo(
    () => board.tiles.filter((t) => t.riverPresent),
    [board.tiles]
  );

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

  // stabilize callback
  const onTileClickCb = useCallback(onTileClick, [onTileClick]);

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
        onTileClick={onTileClickCb}
      />

      {/* Render layers */}
      <BuildingLayer
        tiles={buildingTiles}
        spacing={board.spacing}
        heightScale={heightScale}
      />
      <FogLayer
        tiles={fogTiles}
        spacing={board.spacing}
        heightScale={heightScale}
        onTileClick={onTileClickCb}
      />
      <SemiFogLayer
        tiles={board.tiles.filter((t) => t.semiFogged)}
        spacing={board.spacing}
        heightScale={heightScale}
      />
      <RiverLayer
        tiles={riverTiles}
        spacing={board.spacing}
        heightScale={heightScale}
      />
      <MovementLayer
        reachableTiles={reachableTiles}
        spacing={board.spacing}
        heightScale={heightScale}
      />
      {spawnTiles.length > 0 && (
        <MovementLayer
          reachableTiles={spawnTiles}
          spacing={board.spacing}
          heightScale={0.5}
        />
      )}
      <PiecesLayer
        pieces={pieces}
        selectedPieceId={selectedPieceId}
        tiles={board.tiles}
        spacing={board.spacing}
        heightScale={heightScale}
        onTileClick={onTileClickCb}
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
