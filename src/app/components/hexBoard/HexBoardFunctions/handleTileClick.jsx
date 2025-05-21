import { settlementBuildings } from "../../../../library/utililies/game/gamePieces/schemas/buildBank";

export function handleTileClick(tile, baseMove, setOpenSettlement) {
  if (tile.building && settlementBuildings.includes(tile.building)) {
    setOpenSettlement(tile);
  } else {
    baseMove(tile);
  }
}
