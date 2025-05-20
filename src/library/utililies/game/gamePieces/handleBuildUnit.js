import getNeighborsAxial from "../tileUtilities/Positioning/getNeighbors";
import { NO_SPAWN_TILE_TYPES } from "../tileUtilities/typeChecks/noSpawnTypes";

export function handleBuildUnit({
  unitKey,
  cost,
  settlementTile,
  board,
  pieces,
  setSpawnMode,
  setSpawnTiles,
  setOpenSettlement,
}) {
  const adjTiles = getNeighborsAxial(settlementTile.q, settlementTile.r)
    .map(({ q, r }) => board.tiles.find((t) => t.q === q && t.r === r))
    .filter(
      (tile) =>
        tile &&
        !NO_SPAWN_TILE_TYPES.has(tile.type) &&
        !tile.building &&
        !pieces.some((p) => p.q === tile.q && p.r === tile.r)
    );
  if (adjTiles.length === 0) {
    alert("No adjacent space to deploy unit!");
    return;
  }
  setSpawnMode({ unitKey, cost, settlementTile });
  setSpawnTiles(adjTiles);
  setOpenSettlement(null);
}
