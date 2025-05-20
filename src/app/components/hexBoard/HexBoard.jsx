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

// custom hooks
import useMoveHandler from "./HexBoardFunctions/useMoveHandler";
import useEndTurn from "./HexBoardFunctions/useEndTurn";
import useRevealTiles from "./HexBoardFunctions/useRevealTiles";

// extracted functions
import { handleTileClick } from "./HexBoardFunctions/handleTileClick";
import { handleAction } from "./HexBoardFunctions/handleAction";
import { handleBuildOption } from "./HexBoardFunctions/handleBuildOption";

export default function HexBoard({ board: initialBoard }) {
  console.log("Initial board:", initialBoard);
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

  // map array to object
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

  // Find an adjacent empty tile for the new unit
  function findSpawnTile(settlementTile, tiles, pieces) {
    const directions = [
      [1, 0],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [0, -1],
      [1, -1],
    ];
    for (const [dq, dr] of directions) {
      const q = settlementTile.q + dq;
      const r = settlementTile.r + dr;
      const tile = tiles.find((t) => t.q === q && t.r === r);
      if (
        tile &&
        !tile.building &&
        !pieces.some((p) => p.q === q && p.r === r)
      ) {
        return tile;
      }
    }
    return null;
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

      {/* Floating info panel, always rendered, always floating */}
      <FloatingTileInfoPanel ref={infoPanelRef} />

      {/* --- TOP LEFT UI: Only actions menu here --- */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-row items-start space-x-4 pointer-events-none">
        {selectedPiece && (
          <div className="pointer-events-auto flex flex-row space-x-2 mt-0 ml-0">
            {availableActions.map((action) => {
              const {
                icon: Icon,
                tooltip,
                buttonClass,
              } = ACTION_DETAILS[action];
              const isActive = activeAction === action;
              return (
                <div key={action} className="relative">
                  <button
                    onClick={() => onActionClick(action)}
                    title={tooltip}
                    className={`flex items-center justify-center w-12 h-12 bg-gray-800 bg-opacity-80 ${buttonClass} ${
                      isActive ? "ring-2 ring-offset-2 ring-white" : ""
                    } rounded-lg transition`}
                  >
                    <Icon className="w-6 h-6 text-cyan-200" />
                  </button>
                  {action === "build" && isActive && (
                    <div className="absolute top-full left-0 mt-2 flex flex-row space-x-2 bg-gray-900 bg-opacity-90 p-2 rounded-lg z-20">
                      {buildOptions.map(
                        ({ key, label, icon: OptIcon, buttonClass }) => (
                          <button
                            key={key}
                            onClick={() => onBuildOptionClick(key)}
                            title={label}
                            className={`flex items-center justify-center w-10 h-10 bg-gray-800 bg-opacity-80 ${buttonClass} rounded-lg transition`}
                          >
                            <OptIcon className="w-5 h-5 text-white" />
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

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
