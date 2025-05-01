import PropTypes from "prop-types";
import {
  abilitiesPropType,
  statsPropType,
  movementCostsPropType,
} from "./friendlyPieces"; // adjust import path as needed

/*AI behavior parameters controlling detection, aggression, and movement patterns.*/
export const aiBehaviorPropType = PropTypes.shape({
  detectionRange: PropTypes.number, // how many tiles away it can spot targets
  aggressionLevel: PropTypes.number, // 0–1 scale of likelihood to attack on sight
  curiosity: PropTypes.number, // 0–1 chance to investigate non-targets
  packTactics: PropTypes.bool, // hunts or defends in groups
  ambush: PropTypes.bool, // uses stealthy surprise attacks
  patrolRadius: PropTypes.number, // tiles radius around spawn to patrol
  fleeThreshold: PropTypes.number, // health % below which it flees
});

/*Loot drops for when this hostile piece is defeated.*/
export const lootTablePropType = PropTypes.arrayOf(
  PropTypes.shape({
    itemType: PropTypes.string.isRequired, // e.g. "meat", "hide", "alienTech"
    dropChance: PropTypes.number.isRequired, // 0–1 probability
  })
);

/*Configuration for how and when this hostile type spawns.*/
export const spawnConfigPropType = PropTypes.shape({
  minCount: PropTypes.number.isRequired, // smallest pack size
  maxCount: PropTypes.number.isRequired, // largest pack size
  respawnTime: PropTypes.number, // in turns, null if no respawn
});

/*Full hostile‐piece schema for PropTypes validation in React.*/
export const hostilePiecePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  q: PropTypes.number.isRequired,
  r: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired, // e.g. "wolf", "alienScout"
  category: PropTypes.oneOf(["animal", "alien", "plant", "human"]).isRequired,
  stats: statsPropType.isRequired,
  abilities: abilitiesPropType.isRequired,
  movementCosts: movementCostsPropType.isRequired,
  aiBehavior: aiBehaviorPropType.isRequired,
  lootTable: lootTablePropType,
  spawnConfig: spawnConfigPropType,
});

/*A default hostile piece template for initialization and tests.*/
export const defaultHostilePiece = {
  id: "",
  q: 0,
  r: 0,
  type: "",
  category: "",
  stats: {
    health: 2,
    attack: 2,
    defense: 1,
  },
  abilities: {
    seafaring: false,
    coastfaring: false,
    amphibious: false,
    mountaineering: false,
    flying: false,
    stealthy: false,
  },
  movementCosts: {
    water: Infinity,
    plains: 1,
    forest: 2,
    grassland: 1,
    mountain: 2,
    "impassable mountain": Infinity,
  },
  aiBehavior: {
    detectionRange: 3,
    aggressionLevel: 0.5,
    curiosity: 0.2,
    packTactics: false,
    ambush: false,
    patrolRadius: 5,
    fleeThreshold: 0.3,
  },
  lootTable: [],
  spawnConfig: {
    minCount: 1,
    maxCount: 3,
    respawnTime: null,
  },
};
