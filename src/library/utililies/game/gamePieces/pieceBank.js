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
  return { ...base, ...overrides };
}
