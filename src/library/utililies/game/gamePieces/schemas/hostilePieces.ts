// src/library/utililies/game/gamePieces/hostilePieces.ts
import PropTypes from "prop-types"
import {
  Abilities,
  Stats,
  MovementCosts,
  abilitiesPropType,
  statsPropType,
  movementCostsPropType,
} from "./friendlyPieces"

/** AI behavior parameters controlling detection, aggression, and movement. */
export type AIBehavior = {
  detectionRange: number    // how many tiles away it can spot targets
  aggressionLevel: number   // 0–1 likelihood to attack on sight
  curiosity: number         // 0–1 chance to investigate non-targets
  packTactics: boolean      // hunts or defends in groups
  ambush: boolean           // uses stealthy surprise attacks
  patrolRadius: number      // tile radius around spawn to patrol
  fleeThreshold: number     // health % below which it flees
}
export const aiBehaviorPropType = PropTypes.shape({
  detectionRange: PropTypes.number.isRequired,
  aggressionLevel: PropTypes.number.isRequired,
  curiosity: PropTypes.number.isRequired,
  packTactics: PropTypes.bool.isRequired,
  ambush: PropTypes.bool.isRequired,
  patrolRadius: PropTypes.number.isRequired,
  fleeThreshold: PropTypes.number.isRequired,
}) as PropTypes.Requireable<AIBehavior>

/** Single loot‐drop entry for when a hostile is defeated. */
export type LootTableEntry = {
  itemType: string    // e.g. "meat", "hide", "alienTech"
  dropChance: number  // 0–1 probability
}
export const lootTablePropType = PropTypes.arrayOf(
  PropTypes.shape({
    itemType: PropTypes.string.isRequired,
    dropChance: PropTypes.number.isRequired,
  }).isRequired
) as PropTypes.Requireable<LootTableEntry[]>

/** Spawn configuration for this hostile type. */
export type SpawnConfig = {
  minCount: number      // smallest pack size
  maxCount: number      // largest pack size
  respawnTime: number | null // in turns; `null` = never respawns
}
export const spawnConfigPropType = PropTypes.shape({
  minCount: PropTypes.number.isRequired,
  maxCount: PropTypes.number.isRequired,
  respawnTime: PropTypes.number,
}) as PropTypes.Requireable<SpawnConfig>

/** Allowed categories of hostility. */
export type HostileCategory = "animal" | "alien" | "plant" | "human"

/** Full hostile‐piece schema. */
export type HostilePiece = {
  id: string
  q: number
  r: number
  type: string
  category: HostileCategory
  stats: Stats
  abilities: Abilities
  movementCosts: MovementCosts
  aiBehavior: AIBehavior
  lootTable?: LootTableEntry[]
  spawnConfig: SpawnConfig
  range?: number
}
export const hostilePiecePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  q: PropTypes.number.isRequired,
  r: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  category: PropTypes.oneOf<HostileCategory>([
    "animal",
    "alien",
    "plant",
    "human",
  ]).isRequired,
  stats: statsPropType.isRequired,
  abilities: abilitiesPropType.isRequired,
  movementCosts: movementCostsPropType.isRequired,
  aiBehavior: aiBehaviorPropType.isRequired,
  lootTable: lootTablePropType,
  spawnConfig: spawnConfigPropType.isRequired,
}) as PropTypes.Requireable<HostilePiece>

/** 🎁 Default hostile piece template for initialization & tests. */
export const defaultHostilePiece: HostilePiece = {
  id: "",
  q: 0,
  r: 0,
  type: "",
  category: "animal",
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
  range: 1,
}

export const HOSTILE_PIECE_BANK = {
  Raider: {
    type: "Raider",
    category: "human",
    stats: { health: 2, attack: 2, defense: 1 },
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
      aggressionLevel: 0.7,
      curiosity: 0.1,
      packTactics: true,
      ambush: false,
      patrolRadius: 3,
      fleeThreshold: 0.2,
    },
    lootTable: [],
    spawnConfig: {
      minCount: 1,
      maxCount: 1,
      respawnTime: null,
    },
    range: 1,
  },
};

// Factory function
import { v4 as uuidv4 } from "uuid";
export function createHostilePiece(type: string, overrides: any = {}) {
  const base = HOSTILE_PIECE_BANK[type];
  if (!base) throw new Error(`Unknown hostile type: ${type}`);
  
  // Create deep copies of nested objects to avoid shared references
  const stats = {
    ...base.stats,
    currentHealth: base.stats.health,
    ...(overrides.stats || {})
  };
  
  const abilities = {
    ...base.abilities,
    ...(overrides.abilities || {})
  };
  
  const movementCosts = {
    ...base.movementCosts,
    ...(overrides.movementCosts || {})
  };
  
  const aiBehavior = {
    ...base.aiBehavior,
    ...(overrides.aiBehavior || {})
  };
  
  const spawnConfig = {
    ...base.spawnConfig,
    ...(overrides.spawnConfig || {})
  };
  
  return { 
    ...base, 
    ...overrides, 
    stats,
    abilities,
    movementCosts,
    aiBehavior,
    spawnConfig,
    id: overrides.id || uuidv4() 
  };
}
