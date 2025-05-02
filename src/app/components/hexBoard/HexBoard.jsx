"use client";

import React, { useState, useRef, useEffect } from "react";
import { defaultFriendlyPiece } from "../../../library/utililies/game/gamePieces/friendlyPieces";

import BoardCanvas from "./boardCanvas/boardCanvas";
import TileInfoPanel from "../gameUI/infoTile";
import NextTurnButton from "../gameUI/endTurn";
import useMoveHandler from "./useMoveHandler";
import useEndTurn from "./useEndTurn";
import useRevealTiles from "./useRevealTiles";
import { hexDistance } from "../../../library/utililies/game/tileUtilities/distanceFinder";

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

  // reveal hook (from earlier)
  useRevealTiles(board, pieces, setBoard);

  // tile click handler
  const handleTileClick = useMoveHandler(
    pieces,
    selectedPieceId,
    setPieces,
    setSelectedPieceId
  );

  // next-turn handler
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
