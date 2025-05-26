import { Home, Database, Satellite } from "lucide-react";

export const buildingOptions = {
  reconstructed_shelter: {
    label: "Reconstructed Shelter",
    icon: Home,
    buttonClass: "hover:bg-purple-700 border-purple-500",
    vision: 2,
  },
  resource_extractor: {
    label: "Resource Extractor",
    icon: Database,
    buttonClass: "hover:bg-green-700 border-green-500",
    vision: 1,
  },
  sensor_suite: {
    label: "Sensor Suite",
    icon: Satellite,
    buttonClass: "hover:bg-indigo-700 border-indigo-500",
    vision: 3,
  },
};

export const buildingEffects = {
  reconstructed_shelter: {
    rations: -1, // upkeep: consumes 1 ration
    printingMaterial: 1, // produces 1 printing material
    weapons: 0,
  },
  resource_extractor: {
    rations: 0,
    printingMaterial: 2,
    weapons: 0,
  },
  sensor_suite: {
    rations: 0,
    printingMaterial: 0,
    weapons: 0,
  },
};

export const buildOptions_byUnitType = {
  Pod: ["reconstructed_shelter"],
  Engineer: ["resource_extractor", "sensor_suite"],
};

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
