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
  // attacker: the friendly piece, defender: hostile piece
  const attack = useCallback(
    (attacker, defender) => {
      const range = attacker.range ?? 1;
      const vision = attacker.vision ?? 2;
      const dist = hexDistance(attacker, defender);
      const tile = board.tiles.find(
        (t) => t.q === defender.q && t.r === defender.r
      );

      // Only allow attack if within range, vision, and visible
      if (dist > range || dist > vision || !tile || !tile.discovered) {
        toast.error("Target out of range or not visible!");
        return;
      }

      // Simple combat: subtract attack from defense/health
      const attackValue = attacker.stats?.attack ?? attacker.attack ?? 1;
      const defenseValue = defender.stats?.defense ?? defender.defense ?? 0;
      const damage = Math.max(1, attackValue - defenseValue);

      // Toast notification
      toast.success(
        `${attacker.type} attacked ${defender.type} for ${damage} damage!`
      );

      // Remove hostile if health drops to 0 or below
      setHostilePieces((prev) =>
        prev
          .map((h) =>
            h.id === defender.id
              ? { ...h, stats: { ...h.stats, health: h.stats.health - damage } }
              : h
          )
          .filter((h) => h.stats.health > 0)
      );

      // Optionally: trigger attack animation here (see below)
    },
    [setHostilePieces, board.tiles]
  );

  return attack;
}