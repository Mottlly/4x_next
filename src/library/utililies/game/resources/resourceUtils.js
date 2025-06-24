import {
  buildingEffects,
  getResourceExtractorEffect,
} from "../gamePieces/schemas/buildBank";
import { PIECE_BANK } from "../gamePieces/schemas/pieceBank";

// Compute the net resource changes that will occur next turn
export function computeResourceDelta(board) {
  const effect = { rations: 0, printingMaterial: 0, weapons: 0 };

  // Building effects (positive)
  for (const tile of board.tiles) {
    if (tile.building === "resource_extractor") {
      const b = getResourceExtractorEffect(tile);
      effect.rations += b.rations;
      effect.printingMaterial += b.printingMaterial;
      effect.weapons += b.weapons;
    } else if (tile.building && buildingEffects[tile.building]) {
      const b = buildingEffects[tile.building];
      effect.rations += b.rations;
      effect.printingMaterial += b.printingMaterial;
      effect.weapons += b.weapons;
    }
  }

  // Subtract unit upkeep (negative)
  for (const piece of board.pieces || []) {
    const upkeep = PIECE_BANK[piece.type]?.upkeep;
    if (upkeep) {
      effect.rations -= upkeep.rations;
      effect.printingMaterial -= upkeep.printingMaterial;
      effect.weapons -= upkeep.weapons;
    }
  }

  return effect;
}

// resources: [rations, printingMaterial, weapons]
export function computeResourceChange(board) {
  const effect = computeResourceDelta(board);

  const before = {
    rations: board.resources?.[0] ?? 0,
    printingMaterial: board.resources?.[1] ?? 0,
    weapons: board.resources?.[2] ?? 0,
  };
  const after = {
    rations: before.rations + effect.rations,
    printingMaterial: before.printingMaterial + effect.printingMaterial,
    weapons: before.weapons + effect.weapons,
  };

  console.log("[Resource] Before:", before);
  console.log("[Resource] Net effect:", effect);
  console.log("[Resource] After:", after);

  return [after.rations, after.printingMaterial, after.weapons];
}

export function subtractResources(resources, cost) {
  return {
    rations: resources.rations - (cost.rations || 0),
    printingMaterial: resources.printingMaterial - (cost.printingMaterial || 0),
    weapons: resources.weapons - (cost.weapons || 0),
  };
}
