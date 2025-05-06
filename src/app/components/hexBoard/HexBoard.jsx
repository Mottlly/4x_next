"use client";

import React, { useState, useRef } from "react";
import { ArrowRight, Sword } from "lucide-react";
import { defaultFriendlyPiece } from "../../../library/utililies/game/gamePieces/friendlyPieces";

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

  const handleAction = (action) => {
    switch (action) {
      case "move":
        // TODO: enter move mode
        break;
      case "attack":
        // TODO: enter attack mode
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

        {selectedPieceId && (
          <div className="pointer-events-auto flex space-x-2">
            <button
              onClick={() => handleAction("move")}
              className="
                flex items-center justify-center
                w-12 h-12
                bg-gray-800 bg-opacity-80
                hover:bg-blue-700
                border border-blue-500
                rounded-lg
                transition
              "
            >
              <ArrowRight className="w-6 h-6 text-cyan-200" />
            </button>

            <button
              onClick={() => handleAction("attack")}
              className="
                flex items-center justify-center
                w-12 h-12
                bg-gray-800 bg-opacity-80
                hover:bg-red-700
                border border-red-500
                rounded-lg
                transition
              "
            >
              <Sword className="w-6 h-6 text-cyan-200" />
            </button>
          </div>
        )}
      </div>

      {/* Next Turn */}
      <NextTurnButton currentTurn={currentTurn} onNext={nextTurn} />
    </div>
  );
}
