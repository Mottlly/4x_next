import { useEffect } from "react";
import { hexDistance } from "../../../../library/utililies/game/tileUtilities/distanceFinder";

export default function useRevealTiles(board, pieces, setBoard) {
  useEffect(() => {
    let changed = false;
    const newTiles = board.tiles.map((tile) => {
      if (tile.discovered) return tile;
      if (pieces.some((p) => hexDistance(tile, p) <= p.vision)) {
        changed = true;
        return { ...tile, discovered: true };
      }
      return tile;
    });
    if (changed) {
      setBoard((b) => ({ ...b, tiles: newTiles }));
    }
  }, [board.tiles, pieces, setBoard]);
}
