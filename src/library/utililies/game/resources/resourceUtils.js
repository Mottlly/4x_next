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
      
      // Add special resource bonuses for resource extractors
      if (tile.specialResource) {
        const bonus = getSpecialResourceBonus(tile.specialResource);
        effect.rations += bonus.rations;
        effect.printingMaterial += bonus.printingMaterial;
        effect.weapons += bonus.weapons;
      }
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

// Get special resource bonus for resource extractors
function getSpecialResourceBonus(specialResource) {
  const bonuses = {
    "fertile valley": { rations: 2, printingMaterial: 0, weapons: 0 },
    "ore fields": { rations: 0, printingMaterial: 2, weapons: 0 },
    "plentiful herbivores": { rations: 1, printingMaterial: 0, weapons: 0 },
    "hidden cache": { rations: 0, printingMaterial: 0, weapons: 1 },
  };
  
  return bonuses[specialResource] || { rations: 0, printingMaterial: 0, weapons: 0 };
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
