import { Home, Database, Satellite } from "lucide-react";

export const BUILDING_CONFIG = {
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

export const BUILD_OPTIONS_BY_TYPE = {
  Pod: ["reconstructed_shelter"],
  Engineer: ["resource_extractor", "sensor_suite"],
};

export const SETTLEMENT_BUILDINGS = ["reconstructed_shelter"];

export function getBuildOptionsForType(type) {
  const keys = BUILD_OPTIONS_BY_TYPE[type] || [];
  return keys.map((key) => {
    const cfg = BUILDING_CONFIG[key];
    if (!cfg) {
      throw new Error(`Unknown building key: ${key}`);
    }
    return { key, ...cfg };
  });
}
