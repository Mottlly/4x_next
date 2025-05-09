"use client";

import React, { useState, useRef, useEffect } from "react";
import { defaultFriendlyPiece } from "../../../library/utililies/game/gamePieces/friendlyPieces";
import {
  ACTIONS_BY_TYPE,
  ACTION_DETAILS,
} from "../../../library/utililies/game/gamePieces/actionsDictator";
import { getBuildOptionsForType } from "../../../library/utililies/game/gamePieces/buildBank";
import BoardCanvas from "./boardCanvas/boardCanvas";
import TileInfoPanel from "../gameUI/infoTile";
import NextTurnButton from "../gameUI/endTurn";
import SettlementPanel from "../gameUI/settlementTile";
import useMoveHandler from "./useMoveHandler";
import useEndTurn from "./useEndTurn";
import useRevealTiles from "./useRevealTiles";

// Which building‐keys count as “settlements” (open hub UI)
const SETTLEMENT_BUILDINGS = ["reconstructed_shelter"];

export default function HexBoard({ board: initialBoard }) {
  const { id: boardId, turn: initialTurn } = initialBoard;

  const [board, setBoard] = useState(initialBoard);
  const [currentTurn, setCurrentTurn] = useState(initialTurn ?? 1);
  const [pieces, setPieces] = useState(() =>
    initialBoard.pieces.map((p) => ({ ...defaultFriendlyPiece, ...p }))
  );
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [hoveredTile, setHoveredTile] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [openSettlement, setOpenSettlement] = useState(null);
  const isDraggingRef = useRef(false);

  // Default to "move" when you pick up a piece
  useEffect(() => {
    setActiveAction(selectedPieceId ? "move" : null);
  }, [selectedPieceId]);

  // Reveal fog-of-war where seen
  useRevealTiles(board, pieces, setBoard);

  // Base move/selection handler
  const baseHandleTileClick = useMoveHandler(
    pieces,
    selectedPieceId,
    setPieces,
    setSelectedPieceId
  );

  // Wrap it to intercept settlement-clicks
  const handleTileClick = (tile) => {
    if (tile.building && SETTLEMENT_BUILDINGS.includes(tile.building)) {
      setOpenSettlement(tile);
    } else {
      baseHandleTileClick(tile);
    }
  };

  // End-turn logic
  const nextTurn = useEndTurn(
    boardId,
    board,
    setBoard,
    currentTurn,
    setCurrentTurn,
    pieces,
    setPieces
  );

  const selectedPiece = pieces.find((p) => p.id === selectedPieceId);
  const availableActions = selectedPiece
    ? ACTIONS_BY_TYPE[selectedPiece.type] || []
    : [];

  const buildOptions =
    activeAction === "build" && selectedPiece
      ? getBuildOptionsForType(selectedPiece.type)
      : [];

  const handleAction = (action) => {
    if (action === "build") {
      setActiveAction((prev) => (prev === "build" ? null : "build"));
    } else {
      setActiveAction(action);
    }
  };

  const handleBuildOption = (buildingKey) => {
    if (!selectedPiece) return;

    const { q, r, id: pieceId } = selectedPiece;

    // Only remove the piece if it's a reconstructed shelter
    if (buildingKey === "reconstructed_shelter") {
      setPieces((prev) => prev.filter((p) => p.id !== pieceId));
      setSelectedPieceId(null);
    }

    // Stamp the tile with the building
    setBoard((prev) => {
      const newTiles = prev.tiles.map((tile) =>
        tile.q === q && tile.r === r ? { ...tile, building: buildingKey } : tile
      );
      return { ...prev, tiles: newTiles };
    });

    // Close the build menu
    setActiveAction(null);
  };

  return (
    <div className="relative w-full h-full">
      <BoardCanvas
        board={board}
        pieces={pieces}
        selectedPieceId={selectedPieceId}
        onTileClick={handleTileClick}
        setHoveredTile={setHoveredTile}
        isDraggingRef={isDraggingRef}
      />

      {/* Top-left: tile info + action buttons */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="flex items-start space-x-4">
          <TileInfoPanel tile={hoveredTile} />

          {selectedPiece && (
            <div className="pointer-events-auto flex space-x-2">
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
                      onClick={() => handleAction(action)}
                      title={tooltip}
                      className={`
                        flex items-center justify-center
                        w-12 h-12
                        bg-gray-800 bg-opacity-80
                        ${buttonClass}
                        ${isActive ? "ring-2 ring-offset-2 ring-white" : ""}
                        rounded-lg transition
                      `}
                    >
                      <Icon className="w-6 h-6 text-cyan-200" />
                    </button>

                    {action === "build" && isActive && (
                      <div className="absolute top-full left-0 mt-2 flex flex-col space-y-2 bg-gray-900 bg-opacity-90 p-2 rounded-lg">
                        {buildOptions.map(
                          ({ key, label, icon: OptIcon, buttonClass }) => (
                            <button
                              key={key}
                              onClick={() => handleBuildOption(key)}
                              title={label}
                              className={`
                                flex items-center justify-center
                                w-10 h-10
                                bg-gray-800 bg-opacity-80
                                ${buttonClass}
                                rounded-lg transition
                              `}
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
      </div>

      {/* Next Turn */}
      <NextTurnButton currentTurn={currentTurn} onNext={nextTurn} />

      {/* Settlement panel if a hub-building was clicked */}
      {openSettlement && (
        <SettlementPanel
          tile={openSettlement}
          onClose={() => setOpenSettlement(null)}
        />
      )}
    </div>
  );
}
