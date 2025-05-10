export default function useEndTurn(
  boardId,
  board,
  setBoard,
  currentTurn,
  setCurrentTurn,
  pieces,
  setPieces
) {
  return () => {
    const newTurn = (currentTurn ?? 0) + 1;
    setCurrentTurn(newTurn);
    setPieces((prev) => prev.map((p) => ({ ...p, movesLeft: p.move })));
    setBoard((b) => ({ ...b, turn: newTurn }));

    fetch("/api/boardTable", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        board_id: boardId,
        board: { ...board, turn: newTurn },
      }),
    }).catch(console.error);
  };
}
