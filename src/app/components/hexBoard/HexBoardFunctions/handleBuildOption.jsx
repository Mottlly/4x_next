export function handleBuildOption(
  buildingKey,
  selectedPiece,
  setPieces,
  setSelectedPieceId,
  setBoard,
  setActiveAction
) {
  if (!selectedPiece) return;
  const { q, r, id: pieceId } = selectedPiece;

  if (buildingKey === "reconstructed_shelter") {
    setPieces((prev) => prev.filter((p) => p.id !== pieceId));
    setSelectedPieceId(null);
  }

  setBoard((prev) => {
    const newTiles = prev.tiles.map((tile) =>
      tile.q === q && tile.r === r ? { ...tile, building: buildingKey } : tile
    );
    return { ...prev, tiles: newTiles };
  });

  setActiveAction(null);
}
