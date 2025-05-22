import getNeighborsAxial from "../tileUtilities/Positioning/getNeighbors";
import { noSpawnTypes } from "../tileUtilities/typeChecks/noSpawnTypes";

export function handleBuildUnit({
  unitKey,
  cost,
  settlementTile,
  board,
  pieces,
  setSpawnMode,
  setSpawnTiles,
  setOpenSettlement,
  setResources, // <-- add this
  setBoard,     // <-- add this
}) {
  const adjTiles = getNeighborsAxial(settlementTile.q, settlementTile.r)
    .map(({ q, r }) => board.tiles.find((t) => t.q === q && t.r === r))
    .filter(
      (tile) =>
        tile &&
        !noSpawnTypes.has(tile.type) &&
        !tile.building &&
        !pieces.some((p) => p.q === tile.q && p.r === tile.r)
    );
  if (adjTiles.length === 0) {
    alert("No adjacent space to deploy unit!");
    return;
  }

  // Subtract resources from both UI and board state
  if (setResources) {
    setResources((prev) => ({
      ...prev,
      rations: prev.rations - (cost.rations || 0),
      printingMaterial: prev.printingMaterial - (cost.printingMaterial || 0),
      weapons: prev.weapons - (cost.weapons || 0),
    }));
  }
  if (setBoard) {
    setBoard((prev) => ({
      ...prev,
      resources: [
        (prev.resources?.[0] ?? 0) - (cost.rations || 0),
        (prev.resources?.[1] ?? 0) - (cost.printingMaterial || 0),
        (prev.resources?.[2] ?? 0) - (cost.weapons || 0),
      ],
    }));
  }

  setSpawnMode({ unitKey, cost, settlementTile });
  setSpawnTiles(adjTiles);
  setOpenSettlement(null);
}
