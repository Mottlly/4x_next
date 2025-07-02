import { PIECE_BANK } from "../gamePieces/schemas/pieceBank";
import { HOSTILE_PIECE_BANK } from "../gamePieces/schemas/hostilePieces";
import { buildingOptions } from "../gamePieces/schemas/buildBank";
import { tileTypeStyles } from "../../../styles/gameUI/tileStyles";

/**
 * Comprehensive compendium data containing all game entities
 * Organized by category for easy browsing
 */

// Helper function to format movement costs for display
const formatMovementCosts = (movementCosts) => {
  if (!movementCosts || typeof movementCosts !== 'object') {
    return "Standard movement";
  }
  return Object.entries(movementCosts)
    .filter(([_, cost]) => cost !== Infinity)
    .map(([terrain, cost]) => `${terrain}: ${cost}`)
    .join(", ") || "Standard movement";
};

// Helper function to format abilities for display
const formatAbilities = (abilities) => {
  if (!abilities || typeof abilities !== 'object') {
    return "None";
  }
  return Object.entries(abilities)
    .filter(([_, hasAbility]) => hasAbility)
    .map(([ability, _]) => ability.replace(/([A-Z])/g, ' $1').toLowerCase())
    .join(", ") || "None";
};

// FRIENDLY PIECES COMPENDIUM DATA
export const friendlyPiecesData = Object.entries(PIECE_BANK).map(([key, piece]) => ({
  id: `friendly_${key}`,
  name: piece.type,
  category: "Friendly Units",
  subcategory: "Player Units",
  description: getFriendlyPieceDescription(piece.type),
  gameEffects: getFriendlyPieceGameEffects(piece),
  stats: {
    "Health": piece.stats?.health || "N/A",
    "Attack": piece.attack || 0,
    "Vision Range": piece.vision,
    "Movement": piece.move,
    "Range": piece.range || 1,
    "Build Capability": piece.build ? "Yes" : "No",
    "Scout Capability": piece.scout ? "Yes" : "No",
    "Fortify Capability": piece.fortify ? "Yes" : "No"
  },
  abilities: formatAbilities(piece.abilities),
  movementCosts: formatMovementCosts(piece.movementCosts),
  upkeep: piece.upkeep ? `Rations: ${piece.upkeep.rations}, Materials: ${piece.upkeep.printingMaterial}, Weapons: ${piece.upkeep.weapons}` : "None",
  modelType: "piece",
  modelData: { type: piece.type, color: getPieceColor(piece.type) }
}));

// HOSTILE PIECES COMPENDIUM DATA
export const hostilePiecesData = Object.entries(HOSTILE_PIECE_BANK).map(([key, piece]) => ({
  id: `hostile_${key}`,
  name: piece.type,
  category: "Hostile Units",
  subcategory: piece.category || "Unknown",
  description: getHostilePieceDescription(piece.type),
  gameEffects: getHostilePieceGameEffects(piece),
  stats: {
    "Health": piece.stats?.health || "N/A",
    "Attack": piece.stats?.attack || "N/A",
    "Defense": piece.stats?.defense || "N/A",
    "Detection Range": piece.aiBehavior?.detectionRange || "N/A",
    "Aggression Level": piece.aiBehavior?.aggressionLevel ? `${Math.round(piece.aiBehavior.aggressionLevel * 100)}%` : "N/A",
    "Patrol Radius": piece.aiBehavior?.patrolRadius || "N/A",
    "Pack Tactics": piece.aiBehavior?.packTactics ? "Yes" : "No",
    "Ambush": piece.aiBehavior?.ambush ? "Yes" : "No"
  },
  abilities: formatAbilities(piece.abilities),
  movementCosts: formatMovementCosts(piece.movementCosts),
  modelType: "hostile",
  modelData: { type: piece.type, color: getHostileColor(piece.type) }
}));

// BUILDINGS COMPENDIUM DATA
export const buildingsData = Object.entries(buildingOptions).map(([key, building]) => ({
  id: `building_${key}`,
  name: building.label,
  category: "Structures",
  subcategory: "Player Buildings",
  description: getBuildingDescription(key),
  gameEffects: getBuildingGameEffects(key, building),
  stats: {
    "Health": building.stats?.health || "N/A",
    "Defense": building.stats?.defense || 0,
    "Vision Range": building.vision || 1,
    "Resource Generation": getBuildingResourceGeneration(key)
  },
  abilities: "Immobile structure",
  modelType: "building",
  modelData: { type: key, color: getBuildingColor(key) }
}));

// TERRAIN TILES COMPENDIUM DATA
export const terrainData = Object.entries(tileTypeStyles).map(([key, tileStyle]) => ({
  id: `terrain_${key}`,
  name: key.charAt(0).toUpperCase() + key.slice(1),
  category: "Terrain",
  subcategory: getTerrainSubcategory(key),
  description: getTerrainDescription(key),
  gameEffects: getTerrainGameEffects(key),
  stats: {
    "Movement Cost": getTerrainMovementCost(key),
    "Resource Type": getTerrainResourceType(key),
    "Buildable": getTerrainBuildable(key) ? "Yes" : "No",
    "Passable": key !== "impassable mountain" ? "Yes" : "Special abilities required"
  },
  modelType: "terrain",
  modelData: { type: key, color: tileStyle.color }
}));

// Combine all data into complete compendium
export const compendiumData = [
  ...friendlyPiecesData,
  ...hostilePiecesData,
  ...buildingsData,
  ...terrainData
];

// Helper functions for descriptions and game effects

function getFriendlyPieceDescription(type) {
  const descriptions = {
    "Pod": "Your initial colony ship that crash-landed on this hostile planet. Contains colonists and basic equipment to establish your first foothold.",
    "Scout": "Fast reconnaissance unit with enhanced vision. Excellent for exploring unknown territories and spotting threats from a distance.",
    "Engineer": "Versatile construction unit capable of building structures and extracting resources. Essential for colony expansion.",
    "Security": "Heavily armed combat unit designed to protect your colony from hostile threats. High attack power but slower movement.",
    "Armed_Settler": "Well-equipped colonist with basic combat training. Can establish settlements while defending themselves.",
  };
  return descriptions[type] || "A unit of your expanding colony.";
}

function getFriendlyPieceGameEffects(piece) {
  const effects = [];
  if (piece.build) effects.push("Can construct buildings on adjacent tiles");
  if (piece.scout) effects.push("Reveals large areas when moving");
  if (piece.fortify) effects.push("Can fortify position for defensive bonus");
  if (piece.vision > 2) effects.push("Extended vision range for reconnaissance");
  if (piece.abilities?.mountaineering) effects.push("Can traverse impassable mountains");
  if (piece.abilities?.seafaring) effects.push("Can cross water bodies");
  if (piece.abilities?.stealthy) effects.push("Moves undetected by some enemies");
  return effects.length > 0 ? effects.join("; ") : "Standard unit capabilities";
}

function getHostilePieceDescription(type) {
  const descriptions = {
    "Raider": "Aggressive human scavengers who attack settlements for resources. They move in groups and become more dangerous near their fortress bases.",
    "hostileFortress": "Heavily fortified enemy stronghold that spawns raiders. These structures must be destroyed to achieve victory on this planet."
  };
  return descriptions[type] || "A dangerous hostile entity threatening your colony.";
}

function getHostilePieceGameEffects(piece) {
  const effects = [];
  if (piece.aiBehavior?.packTactics) effects.push("Attacks in coordinated groups");
  if (piece.aiBehavior?.ambush) effects.push("Uses stealth and surprise attacks");
  if (piece.aiBehavior?.aggressionLevel > 0.7) effects.push("Highly aggressive, attacks on sight");
  if (piece.aiBehavior?.patrolRadius > 3) effects.push("Patrols large areas around spawn point");
  if (piece.type === "hostileFortress") effects.push("Spawns raiders periodically; Must be destroyed for victory");
  return effects.length > 0 ? effects.join("; ") : "Standard hostile behavior";
}

function getBuildingDescription(key) {
  const descriptions = {
    "reconstructed_shelter": "Basic shelter constructed from salvaged pod materials. Provides protection and allows recruitment of new colonists.",
    "resource_extractor": "Advanced machinery that harvests resources from the surrounding terrain. Essential for sustained colony growth.",
    "sensor_suite": "High-tech surveillance equipment providing extended vision. Crucial for early detection of threats and exploration."
  };
  return descriptions[key] || "A structure that supports your colony's growth.";
}

function getBuildingGameEffects(key, building) {
  const effects = [];
  if (key === "reconstructed_shelter") {
    effects.push("Allows recruitment of Scout, Engineer, and Security units");
    effects.push("Provides population capacity for colony growth");
  }
  if (key === "resource_extractor") {
    effects.push("Generates resources each turn based on terrain type");
    effects.push("Most effective on mountains and forests");
  }
  if (key === "sensor_suite") {
    effects.push("Provides extended vision range of 3 tiles");
    effects.push("Reveals fog of war in surrounding area");
  }
  if (building.vision > 1) effects.push(`Provides vision range of ${building.vision} tiles`);
  return effects.length > 0 ? effects.join("; ") : "Supports colony operations";
}

function getBuildingResourceGeneration(key) {
  if (key === "resource_extractor") return "Varies by terrain type";
  if (key === "reconstructed_shelter") return "Population capacity";
  return "None";
}

function getTerrainDescription(type) {
  const descriptions = {
    "water": "Open water bodies that block movement for most units. Can be crossed by units with seafaring abilities.",
    "lake": "Smaller water bodies with similar properties to open water but may offer strategic advantages.",
    "plains": "Open grassland ideal for movement and basic resource extraction. Easy to traverse and build upon.",
    "grassland": "Fertile land rich in food resources. Excellent for establishing resource extractors.",
    "forest": "Dense woodland providing materials and cover. Slows movement but offers valuable printing materials.",
    "mountain": "Rocky highlands rich in minerals and weapons materials. Difficult terrain but valuable for resource extraction.",
    "impassable mountain": "Extremely treacherous peaks that only specialized units can cross. Blocks most movement."
  };
  return descriptions[type] || "A terrain feature affecting movement and resources.";
}

function getTerrainGameEffects(type) {
  const effects = [];
  
  switch(type) {
    case "grassland":
      effects.push("High ration production when resource extractor is built");
      break;
    case "forest":
      effects.push("Good printing material production", "Increased movement cost");
      break;
    case "mountain":
      effects.push("Excellent printing material and weapons production", "Higher movement cost");
      break;
    case "water":
    case "lake":
      effects.push("Blocks movement unless unit has seafaring ability");
      break;
    case "impassable mountain":
      effects.push("Blocks movement unless unit has mountaineering ability");
      break;
    case "plains":
      effects.push("Standard movement cost", "Moderate resource potential");
      break;
  }
  
  return effects.length > 0 ? effects.join("; ") : "Standard terrain effects";
}

// Helper functions for getting colors and properties
function getPieceColor(type) {
  const colors = {
    "Pod": "#4ade80",
    "Scout": "#38bdf8", 
    "Engineer": "#facc15",
    "Security": "#f87171",
    "Armed_Settler": "#a78bfa"
  };
  return colors[type] || "#6b7280";
}

function getHostileColor(type) {
  const colors = {
    "Raider": "#b22222",
    "hostileFortress": "#7f1d1d"
  };
  return colors[type] || "#991b1b";
}

function getBuildingColor(type) {
  const colors = {
    "reconstructed_shelter": "#8b5cf6",
    "resource_extractor": "#10b981", 
    "sensor_suite": "#6366f1"
  };
  return colors[type] || "#6b7280";
}

function getTerrainSubcategory(type) {
  if (["water", "lake"].includes(type)) return "Water";
  if (["mountain", "impassable mountain"].includes(type)) return "Mountains";
  if (["forest"].includes(type)) return "Vegetation";
  return "Land";
}

function getTerrainMovementCost(type) {
  const costs = {
    "water": "∞ (unless seafaring)",
    "lake": "∞ (unless seafaring)",
    "plains": "1",
    "grassland": "1", 
    "forest": "2",
    "mountain": "2",
    "impassable mountain": "∞ (unless mountaineering)"
  };
  return costs[type] || "1";
}

function getTerrainResourceType(type) {
  const resources = {
    "grassland": "High rations",
    "plains": "Low rations",
    "forest": "Printing materials",
    "mountain": "Printing materials + weapons",
    "water": "None",
    "lake": "None",
    "impassable mountain": "None"
  };
  return resources[type] || "None";
}

function getTerrainBuildable(type) {
  return !["water", "lake", "impassable mountain"].includes(type);
}
