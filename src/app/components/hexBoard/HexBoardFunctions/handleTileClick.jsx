import { SETTLEMENT_BUILDINGS } from "../../../../library/utililies/game/gamePieces/buildBank";

export function handleTileClick(tile, baseMove, setOpenSettlement) {
  if (tile.building && SETTLEMENT_BUILDINGS.includes(tile.building)) {
    setOpenSettlement(tile);
  } else {
    baseMove(tile);
  }
}
