"use client";

import React, { memo, useMemo, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import { hexDistance } from "../../../../library/utililies/game/tileUtilities/Positioning/distanceFinder";
import hexToPosition from "../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";

import InteractiveBoard from "./interactiveElements";
import AudioSwitcher from "./audioSwitcher";
import FogEnclosure from "./fogMask";

import BuildingLayer from "./layers/buildingLayer";
import FogLayer from "./layers/fogLayer";
import RiverLayer from "./layers/riverLayer";
import MovementLayer from "./layers/movementLayer";
import PiecesLayer from "./layers/pieceLayers/piecesLayer";
import SemiFogLayer from "./layers/semiFogLayer";
import NeutralPiecesLayer from "./layers/pieceLayers/neutralPiecesLayer";
import HostilePiecesLayer from "./layers/pieceLayers/hostilePiecesLayer";
import FogWallLayer from "./layers/FogWallLayer";
import SemiFogWallLayer from "./layers/SemiFogWallLayer";
import PineTreeLayer from "./layers/PineTreeLayer";
import GrassPatchLayer from "./layers/GrassPatchLayer";
import BerryBushLayer from "./layers/BerryBushLayer";
import MountainLayer from "./layers/MountainLayer";

const BoardCanvas = memo(function BoardCanvas({
  board,
  pieces,
  selectedPieceId,
  onTileClick,
  setHoveredTile,
  isDraggingRef,
  spawnTiles = [],
  sciFiAudioRef,
  natureAudioRef,
  activeAction,
  hostilePieceHover,
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

      // Exclude tiles with hostile pieces
      const hostileOnTile = (board.hostilePieces || []).some(
        (h) => h.q === tile.q && h.r === tile.r
      );
      if (hostileOnTile) return false;

      const isWaterOrLake = tile.type === "water" || tile.type === "lake";
      const waterPass = !isWaterOrLake || amphibious || seafaring;
      const coastPass = !isWaterOrLake || coastfaring;
      const mountainPass =
        tile.type !== "impassable mountain" || mountaineering;
      const passable = flying || (waterPass && coastPass && mountainPass);
      return passable;
    });
  }, [selectedPieceId, pieces, board.tiles, board.hostilePieces]);

  // Compute attackable hostile tiles (adjacent to selected piece)
  const attackableHostileTiles = useMemo(() => {
    if (activeAction !== "attack" || selectedPieceId == null) return [];
    const sel = pieces.find((p) => p.id === selectedPieceId);
    if (!sel) return [];
    const range = sel.range ?? 1;

    // Find all hostiles within attack range that are visible and not semi-fogged
    return (board.hostilePieces || [])
      .map((h) => {
        const dist = hexDistance(h, sel);
        const tile = board.tiles.find((t) => t.q === h.q && t.r === h.r);

        if (
          dist <= range &&
          tile &&
          tile.discovered && // tile must be discovered
          tile.visible && // tile must be visible (not in fog)
          !tile.semiFogged // tile must not be semi-fogged
        ) {
          return tile;
        }
        return null;
      })
      .filter(Boolean);
  }, [activeAction, selectedPieceId, pieces, board.hostilePieces, board.tiles]);

  // Calculate camera position to center on player's first piece
  const cameraPosition = useMemo(() => {
    // Find the first player piece
    const firstPiece = pieces.find((piece) => piece);

    if (firstPiece) {
      // Convert hex coordinates to world position
      const [x, y, z] = hexToPosition(
        firstPiece.q,
        firstPiece.r,
        board.spacing
      );
      // Position camera very close to ground level
      return [x - 5, 2.5, z - 4];
    }

    // Fallback to original position if no pieces found
    return [10, 10, 15];
  }, [pieces, board.spacing]);

  // Calculate target position to look at the piece
  const cameraTarget = useMemo(() => {
    const firstPiece = pieces.find((piece) => piece);
    if (firstPiece) {
      const [x, y, z] = hexToPosition(
        firstPiece.q,
        firstPiece.r,
        board.spacing
      );
      return [x, 0, z];
    }
    return [0, 0, 0];
  }, [pieces, board.spacing]);

  // stabilize callback
  const onTileClickCb = useCallback(onTileClick, [onTileClick]);

  return (
    <Canvas
      camera={{
        position: cameraPosition,
        fov: 50,
      }}
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
      <SemiFogWallLayer
        tiles={board.tiles}
        spacing={board.spacing}
        heightScale={heightScale}
      />
      <RiverLayer
        riverPaths={board.riverPaths || []}
        spacing={board.spacing}
        heightScale={heightScale}
        tiles={board.tiles}
      />
      {activeAction === "move" && (
        <MovementLayer
          reachableTiles={reachableTiles}
          spacing={board.spacing}
          heightScale={heightScale}
          hostilePieces={[]}
          attackMode={false}
          tiles={board.tiles}
        />
      )}
      {activeAction === "attack" && (
        <MovementLayer
          reachableTiles={attackableHostileTiles}
          spacing={board.spacing}
          heightScale={heightScale}
          hostilePieces={board.hostilePieces || []}
          attackMode={true}
          tiles={board.tiles}
        />
      )}
      {spawnTiles.length > 0 && (
        <MovementLayer
          reachableTiles={spawnTiles}
          spacing={board.spacing}
          heightScale={0.5}
        />
      )}
      <GrassPatchLayer
        tiles={board.tiles}
        spacing={board.spacing}
        heightScale={heightScale}
      />
      <PineTreeLayer
        tiles={board.tiles}
        spacing={board.spacing}
        heightScale={heightScale}
      />
      <BerryBushLayer
        tiles={board.tiles}
        spacing={board.spacing}
        heightScale={heightScale}
      />
      <MountainLayer
        tiles={board.tiles}
        spacing={board.spacing}
        heightScale={heightScale}
      />
      <PiecesLayer
        pieces={pieces}
        selectedPieceId={selectedPieceId}
        tiles={board.tiles}
        spacing={board.spacing}
        heightScale={heightScale}
        onTileClick={onTileClickCb}
      />
      <NeutralPiecesLayer
        neutralPieces={board.neutralPieces || []}
        tiles={board.tiles}
        spacing={board.spacing}
        heightScale={heightScale}
        onTileClick={onTileClickCb}
      />
      <HostilePiecesLayer
        hostilePieces={board.hostilePieces || []}
        tiles={board.tiles}
        spacing={board.spacing}
        heightScale={heightScale}
        onTileClick={onTileClickCb}
        onPieceHover={hostilePieceHover}
      />
      <FogWallLayer
        tiles={fogTiles}
        spacing={board.spacing}
        heightScale={heightScale}
      />
      <MapControls
        enableDamping
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 4}
        target={cameraTarget}
      />
      <AudioSwitcher
        threshold={board.threshold ?? 10}
        sciFiAudioRef={sciFiAudioRef}
        natureAudioRef={natureAudioRef}
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
