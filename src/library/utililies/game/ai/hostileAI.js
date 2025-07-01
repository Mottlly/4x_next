import getNeighborsAxial from "../tileUtilities/Positioning/getNeighbors";
import { hexDistance } from "../tileUtilities/Positioning/distanceFinder";

/**
 * Hostile piece attacks a friendly piece.
 * Returns true if attack was successful, false otherwise.
 */
function hostileAttackFriendly(hostilePiece, friendlyPiece, deadFriendlyIds) {
  if (!hostilePiece.stats || !friendlyPiece.stats) return false;
  
  const attackValue = hostilePiece.stats.attack || 1;
  const defenseValue = friendlyPiece.stats.defense || 0;
  const damage = Math.max(1, attackValue - defenseValue);
  
  // Apply damage to friendly piece
  const previousHealth = friendlyPiece.stats.currentHealth || friendlyPiece.stats.health;
  friendlyPiece.stats.currentHealth = Math.max(0, previousHealth - damage);
  
  console.log(`${hostilePiece.type} (${hostilePiece.id}) attacked ${friendlyPiece.type} (${friendlyPiece.id}) for ${damage} damage! Health: ${previousHealth} -> ${friendlyPiece.stats.currentHealth}`);
  
  // Check if friendly piece died
  if (friendlyPiece.stats.currentHealth <= 0) {
    console.log(`${friendlyPiece.type} (${friendlyPiece.id}) was killed by ${hostilePiece.type}!`);
    deadFriendlyIds.push(friendlyPiece.id);
  }
  
  return true;
}

/**
 * Returns a mapping from fortressId to all raiders spawned from it.
 */
export function groupRaidersByFortress(hostilePieces) {
  const mapping = {};
  hostilePieces.forEach((piece) => {
    if (piece.type === "Raider" && piece.homeFortressId) {
      if (!mapping[piece.homeFortressId]) mapping[piece.homeFortressId] = [];
      mapping[piece.homeFortressId].push(piece);
    }
  });
  return mapping;
}

/**
 * For each hostile piece, decide its action for the turn.
 * Mutates the hostilePieces array with new positions and attacks friendlyPieces.
 * Returns an array of dead friendly piece IDs that should be removed.
 */
export function processHostileActions({
  hostilePieces,
  friendlyPieces,
  tiles,
}) {
  const raidersByFortress = groupRaidersByFortress(hostilePieces);
  const fortresses = hostilePieces.filter((p) => p.type === "hostileFortress");
  const deadFriendlyIds = [];

  hostilePieces.forEach((piece) => {
    if (piece.type !== "Raider") return;

    const ai = piece.aiBehavior;
    const detectionRange = ai.detectionRange;
    const patrolRadiusBase = ai.patrolRadius;
    // High aggro chance for raiders
    const aggressionLevel = ai.aggressionLevel;

    const fortress = fortresses.find((f) => f.id === piece.homeFortressId);
    if (!fortress) return;

    const raiders = raidersByFortress[fortress.id];
    const patrolRadius = patrolRadiusBase + (raiders.length - 1);

    // Maintain aggro if already aggroed and target is still in range
    let aggroTarget = null;
    let minDist = Infinity;

    // If already aggroed, try to keep the same target if still in range
    if (piece.aggro && piece.aggroTarget) {
      const target = friendlyPieces.find((f) => f.id === piece.aggroTarget);
      if (target && hexDistance(piece, target) <= detectionRange) {
        aggroTarget = target;
        minDist = hexDistance(piece, target);
      } else {
        // Target is gone or out of range, reset aggro
        piece.aggro = false;
        piece.aggroTarget = null;
      }
    }

    // Otherwise, find the closest friendly in range
    if (!aggroTarget) {
      for (const friendly of friendlyPieces) {
        const dist = hexDistance(piece, friendly);
        if (dist <= detectionRange && dist < minDist) {
          aggroTarget = friendly;
          minDist = dist;
        }
      }
    }

    // Debug: log aggro target
    if (aggroTarget) {
      console.log(
        `Raider ${piece.id} aggroing on friendly ${aggroTarget.id} at (${aggroTarget.q},${aggroTarget.r})`
      );
    }

    // If aggro, move towards target and try to maintain adjacency
    if (aggroTarget && Math.random() < aggressionLevel) {
      const distToTarget = hexDistance(piece, aggroTarget);

      // If already adjacent, attack the target and exhaust movement
      if (distToTarget === 1) {
        // Attack the friendly piece
        hostileAttackFriendly(piece, aggroTarget, deadFriendlyIds);
        
        piece.aggro = true;
        piece.aggroTarget = aggroTarget.id;
        // Mark as having moved/acted this turn by not allowing further movement
        return;
      }

      // Try to move to a tile adjacent to the target (but not onto the target)
      // Find all unoccupied tiles adjacent to the target
      const adjacentTiles = getNeighborsAxial(aggroTarget.q, aggroTarget.r)
        .map(({ q, r }) => tiles.find((t) => t.q === q && t.r === r))
        .filter(
          (tile) =>
            tile &&
            !tile.building &&
            !hostilePieces.some((p) => p.q === tile.q && p.r === tile.r) &&
            !friendlyPieces.some((p) => p.q === tile.q && p.r === tile.r)
        );

      // Of those, pick the one closest to the raider
      let best = null;
      let bestDist = Infinity;
      for (const tile of adjacentTiles) {
        const d = hexDistance(piece, tile);
        if (d < bestDist) {
          best = tile;
          bestDist = d;
        }
      }

      // Move to that tile if possible, then attack if adjacent
      if (best) {
        piece.q = best.q;
        piece.r = best.r;
        
        // After moving, check if now adjacent and attack
        const newDistToTarget = hexDistance(piece, aggroTarget);
        if (newDistToTarget === 1) {
          // Attack the friendly piece immediately after moving
          hostileAttackFriendly(piece, aggroTarget, deadFriendlyIds);
        }
      }
      piece.aggro = true;
      piece.aggroTarget = aggroTarget.id;
      return;
    }

    // Otherwise, patrol randomly within patrolRadius
    piece.aggro = false;
    piece.aggroTarget = null;
    const possibleTiles = getNeighborsAxial(piece.q, piece.r)
      .map(({ q, r }) => tiles.find((t) => t.q === q && t.r === r))
      .filter(
        (tile) =>
          tile &&
          !tile.building &&
          hexDistance(tile, fortress) <= patrolRadius &&
          !hostilePieces.some((p) => p.q === tile.q && p.r === tile.r) &&
          !friendlyPieces.some((p) => p.q === tile.q && p.r === tile.r)
      );
    if (possibleTiles.length > 0) {
      const idx = Math.floor(Math.random() * possibleTiles.length);
      piece.q = possibleTiles[idx].q;
      piece.r = possibleTiles[idx].r;
    }
  });

  return deadFriendlyIds;
}

/**
 * Returns the next tile (q, r) towards the target, avoiding occupied tiles.
 */
function getNextStepTowards(
  piece,
  target,
  tiles,
  hostilePieces,
  friendlyPieces
) {
  // If already adjacent, don't move
  if (hexDistance(piece, target) === 1) {
    return null;
  }
  // Only consider neighbors NOT occupied by any piece
  const neighbors = getNeighborsAxial(piece.q, piece.r)
    .map(({ q, r }) => tiles.find((t) => t.q === q && t.r === r))
    .filter(
      (tile) =>
        tile &&
        !tile.building &&
        !hostilePieces.some((p) => p.q === tile.q && p.r === tile.r) &&
        !friendlyPieces.some((p) => p.q === tile.q && p.r === tile.r)
    );
  let best = null;
  let bestDist = hexDistance(piece, target);
  for (const tile of neighbors) {
    const dist = hexDistance(tile, target);
    if (dist < bestDist) {
      best = tile;
      bestDist = dist;
    }
  }
  return best;
}
