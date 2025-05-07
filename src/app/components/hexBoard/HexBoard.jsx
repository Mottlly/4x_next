"use client";

import React, { useState, useRef } from "react";
import { ArrowRight, Sword, Hammer } from "lucide-react";
import { defaultFriendlyPiece } from "../../../library/utililies/game/gamePieces/friendlyPieces";
import {
  ACTIONS_BY_TYPE,
  ACTION_DETAILS,
} from "../../../library/utililies/game/gamePieces/actionsDictator";
import BoardCanvas from "./boardCanvas/boardCanvas";
import TileInfoPanel from "../gameUI/infoTile";
import NextTurnButton from "../gameUI/endTurn";
import useMoveHandler from "./useMoveHandler";
import useEndTurn from "./useEndTurn";
import useRevealTiles from "./useRevealTiles";

export default function HexBoard({ board: initialBoard }) {
  const { id: boardId, turn: initialTurn } = initialBoard;

  const [board, setBoard] = useState(initialBoard);
  const [currentTurn, setCurrentTurn] = useState(initialTurn ?? 1);
  const [pieces, setPieces] = useState(() =>
    initialBoard.pieces.map((p) => ({ ...defaultFriendlyPiece, ...p }))
  );
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [hoveredTile, setHoveredTile] = useState(null);
  const isDraggingRef = useRef(false);

  useRevealTiles(board, pieces, setBoard);

  const handleTileClick = useMoveHandler(
    pieces,
    selectedPieceId,
    setPieces,
    setSelectedPieceId
  );

  const nextTurn = useEndTurn(
    boardId,
    board,
    setBoard,
    currentTurn,
    setCurrentTurn,
    pieces,
    setPieces
  );

  // Determine the selected piece and its available actions
  const selectedPiece = pieces.find((p) => p.id === selectedPieceId);
  const availableActions = selectedPiece
    ? ACTIONS_BY_TYPE[selectedPiece.type] || []
    : [];

  const handleAction = (action) => {
    switch (action) {
      case "move":
        // TODO: enter move mode
        break;
      case "attack":
        // TODO: enter attack mode
        break;
      case "build":
        // TODO: enter build mode
        break;
      default:
        break;
    }
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

      {/* Top-left: info + actions */}
      <div className="absolute top-4 left-4 z-10 flex items-start space-x-4 pointer-events-none">
        <TileInfoPanel tile={hoveredTile} />

        {selectedPiece && (
          <div className="pointer-events-auto flex space-x-2">
            {availableActions.map((action) => {
              const {
                icon: Icon,
                tooltip,
                buttonClass,
              } = ACTION_DETAILS[action];
              return (
                <button
                  key={action}
                  onClick={() => handleAction(action)}
                  title={tooltip}
                  className={`
                flex items-center justify-center
                w-12 h-12
                bg-gray-800 bg-opacity-80
                ${buttonClass}
                rounded-lg
                transition
              `}
                >
                  <Icon className="w-6 h-6 text-cyan-200" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Next Turn */}
      <NextTurnButton currentTurn={currentTurn} onNext={nextTurn} />
    </div>
  );
}
