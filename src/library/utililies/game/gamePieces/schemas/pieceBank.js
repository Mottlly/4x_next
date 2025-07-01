export const PIECE_BANK = {
  Pod: {
    type: "Pod",
    vision: 2,
    move: 1,
    movesLeft: 1,
    attack: 0,
    build: 1,
    fortify: 0,
    scout: 0,
    range: 1,
    abilities: {
      seafaring: false,
      coastfaring: false,
      amphibious: false,
      mountaineering: false,
      flying: false,
      stealthy: false,
    },
    upkeep: { rations: 1, printingMaterial: 0, weapons: 0 },
    stats: { health: 80, currentHealth: 80 },
  },
  Scout: {
    type: "Scout",
    vision: 3,
    move: 2,
    movesLeft: 2,
    attack: 1,
    build: 0,
    fortify: 1,
    scout: 1,
    range: 1,
    abilities: {
      seafaring: false,
      coastfaring: false,
      amphibious: false,
      mountaineering: true,
      flying: false,
      stealthy: true,
    },
    upkeep: { rations: 1, printingMaterial: 0, weapons: 0 },
    stats: { health: 60, currentHealth: 60 },
  },
  Engineer: {
    type: "Engineer",
    vision: 2,
    move: 1,
    movesLeft: 1,
    attack: 0,
    build: 1,
    fortify: 1,
    scout: 0,
    range: 1,
    abilities: {
      seafaring: false,
      coastfaring: false,
      amphibious: false,
      mountaineering: false,
      flying: false,
      stealthy: false,
    },
    upkeep: { rations: 1, printingMaterial: 1, weapons: 0 },
    stats: { health: 70, currentHealth: 70 },
  },
  Armed_Settler: {
    type: "Armed_Settler",
    vision: 2,
    move: 1,
    movesLeft: 1,
    attack: 1,
    build: 0,
    fortify: 1,
    scout: 0,
    range: 1,
    abilities: {
      seafaring: false,
      coastfaring: false,
      amphibious: false,
      mountaineering: false,
      flying: false,
      stealthy: false,
    },
    upkeep: { rations: 2, printingMaterial: 0, weapons: 1 },
    stats: { health: 90, currentHealth: 90 },
  },
  Security: {
    type: "Security",
    vision: 1,
    move: 1,
    movesLeft: 1,
    attack: 2,
    build: 0,
    fortify: 1,
    scout: 0,
    range: 2,
    abilities: {
      seafaring: false,
      coastfaring: false,
      amphibious: false,
      mountaineering: false,
      flying: false,
      stealthy: false,
    },
    upkeep: { rations: 2, printingMaterial: 0, weapons: 2 },
    stats: { health: 100, currentHealth: 100 },
  },
};

/**
 * Factory to create a new piece instance by type,
 * merging in any overrides (e.g. id, q/r).
 */
export function createPiece(type, overrides = {}) {
  const base = PIECE_BANK[type];
  if (!base) {
    throw new Error(`Unknown piece type: ${type}`);
  }
  
  // Create deep copies of nested objects to avoid shared references
  const piece = { 
    ...base, 
    attacked: false,
    stats: { ...base.stats }, // Deep copy stats
    abilities: { ...base.abilities }, // Deep copy abilities
    movementCosts: { ...base.movementCosts }, // Deep copy movementCosts
    ...overrides 
  };
  
  // If overrides contains nested objects, ensure they are also deep copied
  if (overrides.stats) {
    piece.stats = { ...base.stats, ...overrides.stats };
  }
  if (overrides.abilities) {
    piece.abilities = { ...base.abilities, ...overrides.abilities };
  }
  if (overrides.movementCosts) {
    piece.movementCosts = { ...base.movementCosts, ...overrides.movementCosts };
  }
  
  return piece;
}
