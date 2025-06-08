import { computeResourceChange } from "../../../../library/utililies/game/resources/resourceUtils";
import { processUpgrades } from "../../../../library/utililies/game/settlements/upgradeUtilities";
import { createHostilePiece } from "@/library/utililies/game/gamePieces/schemas/hostilePieces";
import getNeighborsAxial from "@/library/utililies/game/tileUtilities/Positioning/getNeighbors";
import { processHostileActions } from "@/library/utililies/game/ai/hostileAI";

export default function useEndTurn(
  boardId,
  board,
  setBoard,
  currentTurn,
  setCurrentTurn,
  pieces,
  setPieces,
  setResources
) {
  return () => {
    const newTurn = (currentTurn ?? 0) + 1;

    // 1. Compute new resources based on the current board state
    const newResources = computeResourceChange(board);

    // 2. Advance the turn counter
    setCurrentTurn(newTurn);

    // 3. Reset each piece's movesLeft to its max move value for the new turn
    setPieces((prev) => prev.map((p) => ({ ...p, movesLeft: p.move })));

    // 4. Update the board state:
    //    - Set the new turn number
    //    - Update resources to the new values
    //    - Process any upgrades in progress on tiles
    setBoard((prev) => {
      let newHostilePieces = [...(prev.hostilePieces || [])];
      prev.hostilePieces?.forEach((fortress) => {
        if (fortress.type === "hostileFortress" && Math.random() < 0.1) {
          // Find an adjacent empty tile
          const neighbors = getNeighborsAxial(fortress.q, fortress.r)
            .map(({ q, r }) => prev.tiles.find((t) => t.q === q && t.r === r))
            .filter(
              (tile) =>
                tile &&
                !tile.building &&
                !prev.pieces.some((p) => p.q === tile.q && p.r === tile.r) &&
                !newHostilePieces.some((p) => p.q === tile.q && p.r === tile.r)
            );
          if (neighbors.length > 0) {
            const spawnTile =
              neighbors[Math.floor(Math.random() * neighbors.length)];
            const newHostile = createHostilePiece("Raider", {
              q: spawnTile.q,
              r: spawnTile.r,
              homeFortressId: fortress.id, // <-- ADD THIS LINE
            });
            newHostilePieces.push(newHostile);
          }
        }
      });

      // Move and aggro logic
      processHostileActions({
        hostilePieces: newHostilePieces,
        friendlyPieces: pieces, // <-- use the up-to-date pieces prop
        tiles: prev.tiles,
        fortressAggroRadius: 4, // or whatever you want
        basePatrolRadius: 2,
        patrolRadiusPerRaider: 1,
      });

      return {
        ...prev,
        turn: newTurn,
        resources: newResources,
        tiles: processUpgrades(prev.tiles, currentTurn + 1),
        hostilePieces: newHostilePieces,
      };
    });

    // 5. Update the UI resource state object for display
    setResources({
      rations: newResources[0],
      printingMaterial: newResources[1],
      weapons: newResources[2],
    });

    // 6. Persist the new board state to the backend via PATCH request
    fetch("/api/boardTable", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        board_id: boardId,
        board: {
          ...board,
          turn: newTurn,
          resources: newResources,
          pieces: pieces, // <-- uses the current pieces state!
        },
      }),
    }).catch(console.error);
  };
}
