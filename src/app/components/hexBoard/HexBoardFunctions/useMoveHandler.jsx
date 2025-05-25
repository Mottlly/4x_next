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
        if (dist <= sel.movesLeft) {
          setPieces((prev) =>
            prev.map((p) =>
              p.id === sel.id
                ? { ...p, q: tile.q, r: tile.r, movesLeft: p.movesLeft - dist }
                : p
            )
          );
          setSelectedPieceId(null);

          // --- Add this: check for goody hut after move ---
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
    [pieces, selectedPieceId, setPieces, setSelectedPieceId, board, setBoard, setResources]
  );
}
