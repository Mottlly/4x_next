"use client";

import React, { useState, useRef, useEffect } from "react";
import { defaultFriendlyPiece } from "../../../library/utililies/game/gamePieces/friendlyPieces";
import {
  ACTIONS_BY_TYPE,
  ACTION_DETAILS,
} from "../../../library/utililies/game/gamePieces/actionsDictator";
import { getBuildOptionsForType } from "../../../library/utililies/game/gamePieces/buildBank";
import BoardCanvas from "./boardCanvas/boardCanvas";
import NextTurnButton from "../gameUI/endTurn";
import SettlementPanel from "../gameUI/settlementTile";
import ResourcePanel from "../gameUI/resourcePanel";
import FloatingTileInfoPanel from "../gameUI/tileDataNode/FloatingTileInfoPanel";
import { createPiece } from "../../../library/utililies/game/gamePieces/pieceBank";
import { UNIT_BUILD_OPTIONS } from "../../../library/utililies/game/gamePieces/unitBuildOptions";
import { NO_SPAWN_TILE_TYPES } from "../../../library/utililies/game/tileUtilities/typeChecks/noSpawnTypes";
import getNeighborsAxial from "../../../library/utililies/game/tileUtilities/Positioning/getNeighbors";
import { getTilesWithLOS } from "../../../library/utililies/game/tileUtilities/lineOfSight/sightLineAlgo";
import { getTilesWithSemiFog } from "../../../library/utililies/game/tileUtilities/lineOfSight/getTilesWithSemiFog";
import useFloatingTileInfo from "../gameUI/tileDataNode/useFloatingTileNode";
import ActionsMenu from "../gameUI/actionsMenu";

// custom hooks
import useMoveHandler from "./HexBoardFunctions/useMoveHandler";
import useEndTurn from "./HexBoardFunctions/useEndTurn";
import useRevealTiles from "./HexBoardFunctions/useRevealTiles";

// extracted functions
import { handleTileClick } from "./HexBoardFunctions/handleTileClick";
import { handleAction } from "./HexBoardFunctions/handleAction";
import { handleBuildOption } from "./HexBoardFunctions/handleBuildOption";

export default function HexBoard({ board: initialBoard }) {
  const {
    id: boardId,
    turn: initialTurn,
    resources: initialResources = [0, 0, 0],
  } = initialBoard;

  const [board, setBoard] = useState(initialBoard);
  const [currentTurn, setCurrentTurn] = useState(initialTurn ?? 1);
  const [pieces, setPieces] = useState(() =>
    initialBoard.pieces.map((p) => createPiece(p.type, p))
  );
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [openSettlement, setOpenSettlement] = useState(null);
  const isDraggingRef = useRef(false);
  const { infoPanelRef, showTileInfo } = useFloatingTileInfo();
  const [spawnMode, setSpawnMode] = useState(null);
  const [spawnTiles, setSpawnTiles] = useState([]);

  // map resources array to object
  const [resources, setResources] = useState({
    rations: initialResources[0],
    printingMaterial: initialResources[1],
    weapons: initialResources[2],
  });

  useEffect(() => {
    setActiveAction(selectedPieceId ? "move" : null);
  }, [selectedPieceId]);

  useRevealTiles(board, pieces, setBoard);

  const baseMove = useMoveHandler(
    pieces,
    selectedPieceId,
    setPieces,
    setSelectedPieceId
  );

  const onTileClick = (tile) => {
    if (spawnMode) {
      // Only allow clicking on highlighted spawn tiles
      if (spawnTiles.some((t) => t.q === tile.q && t.r === tile.r)) {
        // Create and place the new piece
        const { unitKey, cost } = spawnMode;
        const newPiece = createPiece(unitKey, {
          id: crypto.randomUUID(),
          q: tile.q,
          r: tile.r,
        });
        setPieces((prev) => [...prev, newPiece]);
        setResources((prev) => subtractResources(prev, cost));
        setBoard((prev) => ({
          ...prev,
          pieces: [...prev.pieces, newPiece],
        }));
        setSpawnMode(null);
        setSpawnTiles([]);
      }
      return;
    }
    handleTileClick(tile, baseMove, setOpenSettlement);
  };

  const nextTurn = useEndTurn(
    boardId,
    board,
    setBoard,
    currentTurn,
    setCurrentTurn,
    pieces,
    setPieces,
    setResources
  );

  const selectedPiece = pieces.find((p) => p.id === selectedPieceId) || null;
  const availableActions = selectedPiece
    ? ACTIONS_BY_TYPE[selectedPiece.type] || []
    : [];
  const buildOptions =
    activeAction === "build" && selectedPiece
      ? getBuildOptionsForType(selectedPiece.type)
      : [];

  const onActionClick = (action) =>
    handleAction(action, activeAction, setActiveAction);

  const onBuildOptionClick = (key) =>
    handleBuildOption(
      key,
      selectedPiece,
      setPieces,
      setSelectedPieceId,
      setBoard,
      setActiveAction
    );

  const tilesWithLOS = getTilesWithLOS(board.tiles, pieces);
  const tilesWithSemiFog = getTilesWithSemiFog(board.tiles, pieces);

  // Helper to subtract cost from resources
  function subtractResources(resources, cost) {
    return {
      rations: resources.rations - (cost.rations || 0),
      printingMaterial:
        resources.printingMaterial - (cost.printingMaterial || 0),
      weapons: resources.weapons - (cost.weapons || 0),
    };
  }

  const handleBuildUnit = (unitKey, cost, settlementTile) => {
    // Find adjacent spawnable tiles
    const adjTiles = getNeighborsAxial(settlementTile.q, settlementTile.r)
      .map(({ q, r }) => board.tiles.find((t) => t.q === q && t.r === r))
      .filter(
        (tile) =>
          tile &&
          !NO_SPAWN_TILE_TYPES.has(tile.type) &&
          !tile.building &&
          !pieces.some((p) => p.q === tile.q && p.r === tile.r)
      );
    if (adjTiles.length === 0) {
      alert("No adjacent space to deploy unit!");
      return;
    }
    setSpawnMode({ unitKey, cost, settlementTile });
    setSpawnTiles(adjTiles);
    setOpenSettlement(null);
  };

  return (
    <div className="relative w-full h-full">
      <ResourcePanel resources={resources} />

      <BoardCanvas
        board={{ ...board, tiles: tilesWithSemiFog }}
        pieces={pieces}
        selectedPieceId={selectedPieceId}
        onTileClick={onTileClick}
        setHoveredTile={showTileInfo}
        isDraggingRef={isDraggingRef}
        spawnTiles={spawnTiles}
      />

      {/* Floating info panel */}
      <FloatingTileInfoPanel ref={infoPanelRef} />

      {/* Actions menu (centered at top) */}
      <ActionsMenu
        selectedPiece={selectedPiece}
        availableActions={availableActions}
        activeAction={activeAction}
        onActionClick={onActionClick}
        buildOptions={buildOptions}
        onBuildOptionClick={onBuildOptionClick}
      />

      <NextTurnButton currentTurn={currentTurn} onNext={nextTurn} />

      {openSettlement && (
        <SettlementPanel
          tile={openSettlement}
          onClose={() => setOpenSettlement(null)}
          onBuildUnit={handleBuildUnit}
          resources={resources}
        />
      )}
    </div>
  );
}
