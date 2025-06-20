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
    range: 2,
    abilities: {
      seafaring: false,
      coastfaring: false,
      amphibious: false,
      mountaineering: true,
      flying: false,
      stealthy: true,
    },
    upkeep: { rations: 1, printingMaterial: 0, weapons: 0 },
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
  return { ...base, attacked: false, ...overrides }; // <-- Ensure attacked: false
}
