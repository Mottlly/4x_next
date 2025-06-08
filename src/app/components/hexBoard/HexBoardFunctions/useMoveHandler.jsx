import { useCallback } from "react";
import { hexDistance } from "../../../../library/utililies/game/tileUtilities/Positioning/distanceFinder";
import { handleGoodyHutCollect } from "../../../../library/utililies/game/goodyHuts/handleGoodyCollect";

export default function useMoveHandler(
  pieces,
  selectedPieceId,
  setPieces,
  setSelectedPieceId,
  board,
  setBoard,
  setResources
) {
  function isTilePassableForPiece(tile, piece) {
    if (!piece) return false;
    const { abilities } = piece;
    const { seafaring, coastfaring, amphibious, mountaineering, flying } = abilities || {};
    const isWaterOrLake = tile.type === "water" || tile.type === "lake";
    const waterPass = !isWaterOrLake || amphibious || seafaring;
    const coastPass = !isWaterOrLake || coastfaring;
    const mountainPass = tile.type !== "impassable mountain" || mountaineering;
    // Prevent friendly pieces from moving onto hostile pieces
    const hostileOnTile = (board.hostilePieces || []).some(
      (h) => h.q === tile.q && h.r === tile.r
    );
    return (
      (flying || (waterPass && coastPass && mountainPass)) &&
      !hostileOnTile
    );
  }

  return useCallback(
    (tile) => {
      const clicked = pieces.find((p) => p.q === tile.q && p.r === tile.r);
      if (clicked) {
        setSelectedPieceId((id) => (id === clicked.id ? null : clicked.id));
        return;
      }
      if (selectedPieceId != null) {
        const sel = pieces.find((p) => p.id === selectedPieceId);
        if (!sel) return;
        const dist = hexDistance(tile, sel);
        if (dist <= sel.movesLeft && isTilePassableForPiece(tile, sel)) {
          setPieces((prev) =>
            prev.map((p) =>
              p.id === sel.id
                ? { ...p, q: tile.q, r: tile.r, movesLeft: p.movesLeft - dist }
                : p
            )
          );
          setSelectedPieceId(null);

          // check for goody hut after move
          handleGoodyHutCollect({
            tile,
            pieces,
            neutralPieces: board.neutralPieces,
            setBoard,
            setResources,
          });
        }
      }
    },
    [
      pieces,
      selectedPieceId,
      setPieces,
      setSelectedPieceId,
      board,
      setBoard,
      setResources,
    ]
  );
}
