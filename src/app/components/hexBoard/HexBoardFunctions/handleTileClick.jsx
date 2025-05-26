import { settlementTypes } from "../../../../library/utililies/game/settlements/settlementTypes";

export function handleTileClick(tile, baseMove, setOpenSettlement) {
  if (tile.building && settlementTypes.some(type => type.key === tile.building)) {
    setOpenSettlement(tile);
  } else {
    baseMove(tile);
  }
}
