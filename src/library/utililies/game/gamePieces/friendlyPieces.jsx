import PropTypes from "prop-types";

/*
 * Abilities that affect terrain traversal and special actions.
 */
export const abilitiesPropType = PropTypes.shape({
  seafaring: PropTypes.bool, // can traverse open water
  coastfaring: PropTypes.bool, // can move along coastline tiles
  amphibious: PropTypes.bool, // can move seamlessly between land and water
  mountaineering: PropTypes.bool, // can climb impassable peaks
  flying: PropTypes.bool, // ignores terrain costs
  stealthy: PropTypes.bool, // can move or act unseen
});

/*
 * Core combat / survival stats.
 */
export const statsPropType = PropTypes.shape({
  health: PropTypes.number, // hit points
  attack: PropTypes.number, // damage dealt
  defense: PropTypes.number, // damage mitigated
});

/*
 * Movement cost per terrain type.
 */
export const movementCostsPropType = PropTypes.shape({
  water: PropTypes.number, // cost on water tiles
  plains: PropTypes.number, // cost on plains
  forest: PropTypes.number, // cost in forests
  grassland: PropTypes.number, // cost on grasslands
  mountain: PropTypes.number, // cost on mountains
  "impassable mountain": PropTypes.number, // impassable terrain
});

/*
 * Full piece schema for React PropTypes validation.
 */
export const piecePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  q: PropTypes.number.isRequired, // axial coordinate
  r: PropTypes.number.isRequired, // axial coordinate
  type: PropTypes.string.isRequired, // e.g. "pod", "scout", etc.
  vision: PropTypes.number.isRequired, // how far it can see
  move: PropTypes.number.isRequired, // how many tiles it can move each turn
  movesLeft: PropTypes.number.isRequired, // moves remaining this turn
  abilities: abilitiesPropType.isRequired,
  stats: statsPropType.isRequired,
  movementCosts: movementCostsPropType.isRequired,
});

/*
 * A default piece with all current properties, including movesLeft.
 */
export const defaultFriendlyPiece = {
  id: "",
  q: 0,
  r: 0,
  type: "",
  vision: 1,
  move: 2,
  movesLeft: 2, // default to full movement
  abilities: {
    seafaring: false,
    coastfaring: false,
    amphibious: false,
    mountaineering: false,
    flying: false,
    stealthy: false,
  },
  stats: {
    health: 1,
    attack: 0,
    defense: 0,
  },
  movementCosts: {
    water: Infinity,
    plains: 1,
    forest: 2,
    grassland: 1,
    mountain: 2,
    "impassable mountain": Infinity,
  },
};
