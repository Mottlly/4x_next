import { computeResourceChange } from "../../../../library/utililies/game/resources/resourceUtils";
import { processUpgrades } from "../../../../library/utililies/game/settlements/upgradeUtilities";

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
    setBoard((prev) => ({
      ...prev,
      turn: newTurn,
      resources: newResources,
      tiles: processUpgrades(prev.tiles, currentTurn + 1),
    }));

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
