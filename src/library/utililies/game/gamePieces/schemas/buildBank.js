import { Home, Database, Satellite, Flag } from "lucide-react";

// Add default stats to each building option
export const buildingOptions = {
  reconstructed_shelter: {
    label: "Reconstructed Shelter",
    icon: Home,
    buttonClass: "hover:bg-purple-700 border-purple-500",
    vision: 1,
    stats: { health: 10, attack: 0, defense: 2 },
  },
  resource_extractor: {
    label: "Resource Extractor",
    icon: Database,
    buttonClass: "hover:bg-green-700 border-green-500",
    vision: 1,
    stats: { health: 8, attack: 0, defense: 1 },
  },
  sensor_suite: {
    label: "Sensor Suite",
    icon: Satellite,
    buttonClass: "hover:bg-indigo-700 border-indigo-500",
    vision: 3,
    stats: { health: 6, attack: 0, defense: 1 },
  },
  colony_settlement: {
    label: "Settle Colony",
    icon: Flag,
    buttonClass: "hover:bg-orange-700 border-orange-500",
    vision: 2,
    stats: { health: 15, attack: 0, defense: 3 },
  },
};

export const buildingEffects = {
  reconstructed_shelter: {
    rations: 1,
    printingMaterial: 1,
    weapons: 0,
  },
  colony_settlement: {
    rations: 2,
    printingMaterial: 1,
    weapons: 0,
  },
  sensor_suite: {
    rations: 0,
    printingMaterial: -1,
    weapons: 0,
  },
};

export const buildOptions_byUnitType = {
  Pod: ["reconstructed_shelter"],
  Engineer: ["resource_extractor", "sensor_suite"],
  Armed_Settler: ["colony_settlement"],
};

export function getResourceExtractorEffect(tile) {
  switch (tile.type) {
    case "grassland":
      return { rations: 2, printingMaterial: 0, weapons: 0 };
    case "plains":
      return { rations: 1, printingMaterial: 0, weapons: 0 };
    case "forest":
      return { rations: 0, printingMaterial: 2, weapons: 0 };
    case "mountain":
      return { rations: 0, printingMaterial: 3, weapons: 1 };
    default:
      return { rations: 0, printingMaterial: 1, weapons: 0 };
  }
}

export function getBuildOptionsForType(type) {
  const keys = buildOptions_byUnitType[type] || [];
  return keys.map((key) => {
    const cfg = buildingOptions[key];
    if (!cfg) {
      throw new Error(`Unknown building key: ${key}`);
    }
    return { key, ...cfg };
  });
}
