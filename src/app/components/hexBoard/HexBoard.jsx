"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
import TutorialSystem, { useTutorial } from "../gameUI/TutorialSystem";
import { getTilesWithSemiFog } from "../../../library/utililies/game/tileUtilities/lineOfSight/getTilesWithSemiFog";
import { startUpgrade } from "../../../library/utililies/game/settlements/upgradeUtilities";
import { computeOutpostInfo } from "../../../library/utililies/game/resources/computeOutpostCap";
import { hexDistance } from "../../../library/utililies/game/tileUtilities/Positioning/distanceFinder";
import useFloatingHostileInfo from "../gameUI/tileDataNode/useFloatingHostileNode";

// custom hooks
import useMoveHandler from "./HexBoardFunctions/useMoveHandler";
import useEndTurn from "./HexBoardFunctions/useEndTurn";
import useRevealTiles from "./HexBoardFunctions/useRevealTiles";
import useUnlockAudio from "./HexBoardFunctions/useUnlockAudio";
import useAttackHandler from "./HexBoardFunctions/useAttackHandler";

// extracted functions
import { handleTileClick } from "./HexBoardFunctions/handleTileClick";
import { handleAction } from "./HexBoardFunctions/handleAction";
import { handleBuildOption } from "./HexBoardFunctions/handleBuildOption";
import {
  subtractResources,
  computeResourceDelta,
} from "../../../library/utililies/game/resources/resourceUtils";
import { handleBuildUnit } from "../../../library/utililies/game/gamePieces/handleBuildUnit";

export default function HexBoard({ board: initialBoard }) {
  const {
    id: boardId,
    turn: initialTurn,
    resources: initialResources = [0, 0, 0],
  } = initialBoard;

  // Tutorial steps definition
  const tutorialSteps = [
    {
      title: "Welcome to Your New World!",
      content:
        "You've crash-landed on an alien planet. This tutorial will teach you the basics of survival and expansion. Use the Next/Previous buttons or arrow keys to navigate.",
      position: "center",
      size: "medium",
    },
    {
      title: "The Hex Board",
      content:
        "This is your game board made of hexagonal tiles. Each tile has different terrain types - grasslands, forests, mountains, and water. You can click and drag to move around and zoom in/out with your mouse wheel.",
      position: "top-left",
      size: "medium",
    },
    {
      title: "Resource Management",
      content:
        "This panel shows your vital resources: Rations (food), Printing Material (construction), and Weapons (defense). You'll need to manage these carefully to survive and expand.",
      position: "top-right",
      size: "small",
    },
    {
      title: "Your Units",
      content:
        "Look for your starting units on the board - they're your colonists and scouts. Click on a unit to select it and see what actions you can take. Selected units will be highlighted.",
      position: "center",
      size: "medium",
    },
    {
      title: "Actions Menu",
      content:
        "When you select a unit, this menu appears showing available actions. You can move units, build structures, attack enemies, or perform other actions depending on the unit type.",
      position: "bottom-right",
      size: "medium",
    },
    {
      title: "End Turn",
      content:
        "When you've finished your actions, click this button to end your turn. Resources are generated, units regain movement, and the world evolves. Time passes on this hostile planet!",
      position: "bottom",
      size: "small",
    },
    {
      title: "Ready to Survive!",
      content:
        "You now know the basics! Explore the world, gather resources, build settlements, and expand your colony. Remember: this planet is dangerous, so stay alert and good luck!",
      position: "center",
      size: "medium",
    },
  ];

  // Initialize tutorial
  const tutorial = useTutorial("game_basics", tutorialSteps, true);

  const [board, setBoard] = useState(initialBoard);
  const [currentTurn, setCurrentTurn] = useState(initialTurn ?? 1);
  const [pieces, setPieces] = useState(() =>
    initialBoard.pieces.map((p) => createPiece(p.type, p))
  );
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [openSettlement, setOpenSettlement] = useState(null);
  const isDraggingRef = useRef(false);
  const { infoPanelRef, showTileInfo } = useFloatingTileInfo(pieces);
  const { hostileInfoPanelRef, showHostileInfo } = useFloatingHostileInfo();
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

  // --- Add this effect to update semi-fogged tiles ---
  useEffect(() => {
    const tilesWithSemiFog = getTilesWithSemiFog(board.tiles, pieces);
    // Only update if something changed (avoid infinite loop)
    const changed = tilesWithSemiFog.some(
      (t, i) => t.semiFogged !== board.tiles[i]?.semiFogged
    );
    if (changed) {
      setBoard((prev) => ({
        ...prev,
        tiles: tilesWithSemiFog,
      }));
    }
  }, [board.tiles, pieces]);
  // --- End addition ---

  const baseMove = useMoveHandler(
    pieces,
    selectedPieceId,
    setPieces,
    setSelectedPieceId,
    board,
    setBoard,
    setResources
  );

  const attack = useAttackHandler(
    pieces,
    setPieces,
    board.hostilePieces,
    null, // setHostilePieces is not needed
    board,
    setBoard
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

    // --- Add this block ---
    if (activeAction === "attack" && selectedPieceId) {
      // Is this tile attackable?
      const selectedPiece = pieces.find((p) => p.id === selectedPieceId);
      const hostile = (board.hostilePieces || []).find(
        (h) => h.q === tile.q && h.r === tile.r
      );
      if (selectedPiece && hostile) {
        attack(selectedPiece, hostile);
        return;
      }
    }
    // --- End block ---

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
      setActiveAction,
      board // <-- add this!
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

  const sciFiAudioRef = useRef();
  const natureAudioRef = useRef();
  useUnlockAudio(sciFiAudioRef, natureAudioRef);

  const outpostInfo = computeOutpostInfo(board);

  // Compute expected resource changes for next turn
  const resourceDelta = useMemo(() => {
    // Create a board state that includes current pieces for accurate calculation
    const boardWithCurrentPieces = {
      ...board,
      pieces: pieces,
    };
    return computeResourceDelta(boardWithCurrentPieces);
  }, [board, pieces]);

  const attackableHostileTiles = useMemo(() => {
    if (activeAction !== "attack" || selectedPieceId == null) return [];
    const sel = pieces.find((p) => p.id === selectedPieceId);
    if (!sel) return [];
    const range = sel.stats?.range ?? sel.range ?? 1;
    return (board.hostilePieces || [])
      .map((h) => {
        const dist = hexDistance(h, sel);
        const tile = board.tiles.find((t) => t.q === h.q && t.r === h.r);
        if (dist <= range && tile && tile.discovered) {
          return tile;
        }
        return null;
      })
      .filter(Boolean);
  }, [activeAction, selectedPieceId, pieces, board.hostilePieces, board.tiles]);
  return (
    <div className="relative w-full h-full">
      <ResourcePanel
        resources={resources}
        outpostInfo={outpostInfo}
        resourceDelta={resourceDelta}
      />

      <BoardCanvas
        board={board}
        pieces={pieces}
        selectedPieceId={selectedPieceId}
        onTileClick={onTileClick}
        setHoveredTile={showTileInfo}
        isDraggingRef={isDraggingRef}
        spawnTiles={spawnTiles}
        sciFiAudioRef={sciFiAudioRef}
        natureAudioRef={natureAudioRef}
        activeAction={activeAction} // <-- ADD THIS LINE
        hostilePieceHover={showHostileInfo}
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

      <audio
        ref={sciFiAudioRef}
        src="/music/sci-fi_loop.wav"
        loop
        preload="auto"
      />
      <audio
        ref={natureAudioRef}
        src="/music/nature_loop.wav"
        loop
        preload="auto"
      />

      {/* Floating hostile info panel */}
      <div
        ref={hostileInfoPanelRef}
        style={{
          position: "fixed",
          left: 12,
          top: 12,
          pointerEvents: "none",
          zIndex: 2001,
          opacity: 0,
          transition: "opacity 0.15s",
        }}
      />

      {/* Tutorial System */}
      <TutorialSystem
        steps={tutorial.steps}
        isActive={tutorial.isActive}
        onComplete={tutorial.completeTutorial}
        onSkip={tutorial.skipTutorial}
        allowSkip={true}
        theme="game"
      />
    </div>
  );
}
