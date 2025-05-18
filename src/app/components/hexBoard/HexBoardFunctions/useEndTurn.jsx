import { computeResourceChange } from "../../../../library/utililies/game/resources/resourceUtils";

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

    // Compute new resources
    const newResources = computeResourceChange(board);

    setCurrentTurn(newTurn);
    setPieces((prev) => prev.map((p) => ({ ...p, movesLeft: p.move })));
    setBoard((b) => ({
      ...b,
      turn: newTurn,
      resources: newResources,
    }));
    setResources({
      rations: newResources[0],
      printingMaterial: newResources[1],
      weapons: newResources[2],
    });

    fetch("/api/boardTable", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        board_id: boardId,
        board: { ...board, turn: newTurn, resources: newResources },
      }),
    }).catch(console.error);
  };
}
