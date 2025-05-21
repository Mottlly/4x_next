import { BUILDING_EFFECTS } from "../gamePieces/schemas/buildBank";

// resources: [rations, printingMaterial, weapons]
export function computeResourceChange(board) {
  const effect = { rations: 0, printingMaterial: 0, weapons: 0 };

  // Loop through all tiles with buildings
  for (const tile of board.tiles) {
    if (tile.building && BUILDING_EFFECTS[tile.building]) {
      const b = BUILDING_EFFECTS[tile.building];
      effect.rations += b.rations;
      effect.printingMaterial += b.printingMaterial;
      effect.weapons += b.weapons;
    }
  }

  return [
    (board.resources?.[0] ?? 0) + effect.rations,
    (board.resources?.[1] ?? 0) + effect.printingMaterial,
    (board.resources?.[2] ?? 0) + effect.weapons,
  ];
}

export function subtractResources(resources, cost) {
  return {
    rations: resources.rations - (cost.rations || 0),
    printingMaterial: resources.printingMaterial - (cost.printingMaterial || 0),
    weapons: resources.weapons - (cost.weapons || 0),
  };
}
