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
import ResourcePanel from "../gameUI/resourcePanel";

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
    initialBoard.pieces.map((p) => ({ ...defaultFriendlyPiece, ...p }))
  );
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [hoveredTile, setHoveredTile] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [openSettlement, setOpenSettlement] = useState(null);
  const isDraggingRef = useRef(false);

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

  const onTileClick = (tile) =>
    handleTileClick(tile, baseMove, setOpenSettlement);

  const nextTurn = useEndTurn(
    boardId,
    board,
    setBoard,
    currentTurn,
    setCurrentTurn,
    pieces,
    setPieces
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

  return (
    <div className="relative w-full h-full">
      <ResourcePanel resources={resources} />

      <BoardCanvas
        board={board}
        pieces={pieces}
        selectedPieceId={selectedPieceId}
        onTileClick={onTileClick}
        setHoveredTile={setHoveredTile}
        isDraggingRef={isDraggingRef}
      />

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
                      onClick={() => onActionClick(action)}
                      title={tooltip}
                      className={`flex items-center justify-center w-12 h-12 bg-gray-800 bg-opacity-80 ${buttonClass} ${
                        isActive ? "ring-2 ring-offset-2 ring-white" : ""
                      } rounded-lg transition`}
                    >
                      <Icon className="w-6 h-6 text-cyan-200" />
                    </button>

                    {action === "build" && isActive && (
                      <div className="absolute top-full left-0 mt-2 flex flex-col space-y-2 bg-gray-900 bg-opacity-90 p-2 rounded-lg">
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
      </div>

      <NextTurnButton currentTurn={currentTurn} onNext={nextTurn} />

      {openSettlement && (
        <SettlementPanel
          tile={openSettlement}
          onClose={() => setOpenSettlement(null)}
        />
      )}
    </div>
  );
}
