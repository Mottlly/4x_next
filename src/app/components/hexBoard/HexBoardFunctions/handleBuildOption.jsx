import { buildingOptions } from "../../../../library/utililies/game/gamePieces/schemas/buildBank";
import { computeOutpostInfo } from "../../../../library/utililies/game/resources/computeOutpostCap";
import { toast } from "react-hot-toast";

export function handleBuildOption(
  buildingKey,
  selectedPiece,
  setPieces,
  setSelectedPieceId,
  setBoard,
  setActiveAction,
  board // <-- pass current board state as an argument
) {
  if (!selectedPiece) return;
  const { q, r, id: pieceId } = selectedPiece;

  // Outpost cap enforcement
  if (buildingKey === "resource_extractor" || buildingKey === "sensor_suite") {
    const { used, max } = computeOutpostInfo(board);
    if (used >= max) {
      toast.error(
        "Outpost limit reached! Build more settlements to increase capacity."
      );
      return;
    }
  }

  if (buildingKey === "reconstructed_shelter" || buildingKey === "colony_settlement") {
    setPieces((prev) => prev.filter((p) => p.id !== pieceId));
    setSelectedPieceId(null);
    setBoard((prev) => ({
      ...prev,
      pieces: prev.pieces.filter((p) => p.id !== pieceId),
    }));
  }

  setBoard((prev) => {
    const buildingStats = buildingOptions[buildingKey]?.stats || {
      health: 10,
      attack: 0,
      defense: 2,
    };
    // Add currentHealth to building stats
    const statsWithCurrentHealth = {
      ...buildingStats,
      currentHealth: buildingStats.health,
    };
    const newTiles = prev.tiles.map((tile) =>
      tile.q === q && tile.r === r
        ? { ...tile, building: buildingKey, stats: statsWithCurrentHealth }
        : tile
    );
    return { ...prev, tiles: newTiles };
  });

  setActiveAction(null);
}
