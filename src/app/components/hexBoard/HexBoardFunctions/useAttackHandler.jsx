import { useCallback } from "react";
import { hexDistance } from "../../../../library/utililies/game/tileUtilities/Positioning/distanceFinder";
import { toast } from "react-hot-toast";

export default function useAttackHandler(
  pieces,
  setPieces,
  hostilePieces,
  setHostilePieces,
  board,
  setBoard
) {
  // attacker: the friendly piece, defender: hostile piece or tile
  const attack = useCallback(
    (attacker, defender) => {
      if (attacker.attacked) {
        toast.error("This unit has already attacked this turn!");
        return;
      }

      const range = attacker.range ?? 1;
      const vision = attacker.vision ?? 2;
      const dist = hexDistance(attacker, defender);

      // Find the tile for settlements/fortresses
      const tile =
        board.tiles.find((t) => t.q === defender.q && t.r === defender.r) ||
        defender;

      // Only allow attack if within range, vision, and visible
      if (dist > range || dist > vision || !tile || !tile.discovered) {
        toast.error("Target out of range or not visible!");
        return;
      }

      // Determine if target is a hostile piece or a settlement/fortress tile
      const isHostilePiece = defender.type && defender.stats && defender.id;
      const isSettlementTile = tile.building && tile.stats;
      const isFortressTile =
        defender.type === "hostileFortress" && defender.stats;

      const attackValue = attacker.stats?.attack ?? attacker.attack ?? 1;
      const defenseValue =
        (defender.stats?.defense ?? defender.defense) ||
        (tile.stats?.defense ?? 0);
      const damage = Math.max(1, attackValue - defenseValue);

      // Mark the attacker as having attacked
      setPieces((prev) =>
        prev.map((p) => (p.id === attacker.id ? { ...p, attacked: true } : p))
      );

      if (isHostilePiece && !isFortressTile) {
        // Normal hostile piece (not fortress)
        setBoard((prev) => {
          const newHostilePieces = prev.hostilePieces
            .map((h) =>
              h.id === defender.id
                ? {
                    ...h,
                    stats: { ...h.stats, health: h.stats.health - damage },
                  }
                : h
            )
            .filter(
              (h) =>
                h.type === "hostileFortress" ||
                (h.stats &&
                  typeof h.stats.health === "number" &&
                  h.stats.health > 0)
            );
          return { ...prev, hostilePieces: newHostilePieces };
        });
        toast.success(
          `${attacker.type} attacked ${defender.type} for ${damage} damage!`
        );
      } else if (isSettlementTile || isFortressTile) {
        // Attacking a settlement or fortress tile
        setBoard((prev) => {
          const newTiles = prev.tiles.map((t) =>
            t.q === tile.q && t.r === tile.r && t.stats
              ? {
                  ...t,
                  stats: {
                    ...t.stats,
                    health: t.stats.health - damage,
                  },
                }
              : t
          );
          // Remove building if destroyed
          const updatedTiles = newTiles.map((t) =>
            t.stats && t.stats.health <= 0
              ? { ...t, building: null, stats: null }
              : t
          );
          return { ...prev, tiles: updatedTiles };
        });
        toast.success(
          `${attacker.type} attacked ${
            tile.building || "Fortress"
          } for ${damage} damage!`
        );
      }
    },
    [setBoard, board.tiles, setPieces]
  );

  return attack;
}
