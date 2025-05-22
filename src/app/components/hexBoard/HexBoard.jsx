"use client";

import React, { useState, useRef, useEffect } from "react";
import { allowedActionsByType } from "../../../library/utililies/game/gamePieces/actionsDictator";
import { getBuildOptionsForType } from "../../../library/utililies/game/gamePieces/schemas/buildBank";
import BoardCanvas from "./boardCanvas/boardCanvas";
import NextTurnButton from "../gameUI/endTurn";
import SettlementPanel from "../gameUI/settlementTile";
import ResourcePanel from "../gameUI/resourcePanel";
import FloatingTileInfoPanel from "../gameUI/tileDataNode/FloatingTileInfoPanel";
import { createPiece } from "../../../library/utililies/game/gamePieces/schemas/pieceBank";
import useFloatingTileInfo from "../gameUI/tileDataNode/useFloatingTileNode";
import ActionsMenu from "../gameUI/actionsMenu";
import { getTilesWithSemiFog } from "../../../library/utililies/game/tileUtilities/lineOfSight/getTilesWithSemiFog";
import { startUpgrade } from "../../../library/utililies/game/settlements/upgradeUtilities";

// custom hooks
import useMoveHandler from "./HexBoardFunctions/useMoveHandler";
import useEndTurn from "./HexBoardFunctions/useEndTurn";
import useRevealTiles from "./HexBoardFunctions/useRevealTiles";

// extracted functions
import { handleTileClick } from "./HexBoardFunctions/handleTileClick";
import { handleAction } from "./HexBoardFunctions/handleAction";
import { handleBuildOption } from "./HexBoardFunctions/handleBuildOption";
import { subtractResources } from "../../../library/utililies/game/resources/resourceUtils";
import { handleBuildUnit } from "../../../library/utililies/game/gamePieces/handleBuildUnit";

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
    ? allowedActionsByType[selectedPiece.type] || []
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

  const tilesWithSemiFog = getTilesWithSemiFog(board.tiles, pieces);

  // Use the imported handleBuildUnit for settlements
  const onBuildUnit = (unitKey, cost, settlementTile) =>
    handleBuildUnit({
      unitKey,
      cost,
      settlementTile,
      board,
      pieces,
      setSpawnMode,
      setSpawnTiles,
      setOpenSettlement,
      setResources,
      setBoard,
    });

  const onStartUpgrade = (upgradeKey) => {
    if (!openSettlement) return;
    if (openSettlement.upgradeInProgress) return;
    // Find the upgrade config
    const settlementType = openSettlement.building;
    const upgrade = (
      require("../../../library/utililies/game/settlements/settlementUpgrades")
        .settlementUpgradeOptions[settlementType] || []
    ).find((u) => u.key === upgradeKey);
    if (!upgrade) return;

    // Subtract resources from both UI and board state!
    setResources((prev) => ({
      ...prev,
      rations: prev.rations - (upgrade.cost.rations || 0),
      printingMaterial:
        prev.printingMaterial - (upgrade.cost.printingMaterial || 0),
      weapons: prev.weapons - (upgrade.cost.weapons || 0),
    }));

    setBoard((prev) => ({
      ...prev,
      resources: [
        (prev.resources?.[0] ?? 0) - (upgrade.cost.rations || 0),
        (prev.resources?.[1] ?? 0) - (upgrade.cost.printingMaterial || 0),
        (prev.resources?.[2] ?? 0) - (upgrade.cost.weapons || 0),
      ],
      tiles: prev.tiles.map((tile) =>
        tile.q === openSettlement.q && tile.r === openSettlement.r
          ? startUpgrade(tile, upgradeKey, currentTurn)
          : tile
      ),
    }));

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
          onBuildUnit={onBuildUnit}
          resources={resources}
          onStartUpgrade={onStartUpgrade}
          currentTurn={currentTurn}
        />
      )}
    </div>
  );
}
