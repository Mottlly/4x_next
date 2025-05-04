import PropTypes from "prop-types"

/** The six valid terrain keys */
export type TerrainType =
  | "water"
  | "plains"
  | "forest"
  | "grassland"
  | "mountain"
  | "impassable mountain"

/** Abilities that affect traversal & special actions */
export type Abilities = {
  seafaring: boolean        // can traverse open water
  coastfaring: boolean      // can move along coastline tiles
  amphibious: boolean       // seamless land↔water
  mountaineering: boolean   // can climb impassable peaks
  flying: boolean           // ignores terrain costs
  stealthy: boolean         // move/act unseen
}
export const abilitiesPropType = PropTypes.shape({
  seafaring: PropTypes.bool.isRequired,
  coastfaring: PropTypes.bool.isRequired,
  amphibious: PropTypes.bool.isRequired,
  mountaineering: PropTypes.bool.isRequired,
  flying: PropTypes.bool.isRequired,
  stealthy: PropTypes.bool.isRequired,
}) as PropTypes.Requireable<Abilities>

/** Combat / survival stats */
export type Stats = {
  health: number   // hit points
  attack: number   // damage dealt
  defense: number  // damage mitigated
}
export const statsPropType = PropTypes.shape({
  health: PropTypes.number.isRequired,
  attack: PropTypes.number.isRequired,
  defense: PropTypes.number.isRequired,
}) as PropTypes.Requireable<Stats>

/** Movement cost per terrain */
export type MovementCosts = Record<TerrainType, number>
export const movementCostsPropType = PropTypes.shape({
  water: PropTypes.number.isRequired,
  plains: PropTypes.number.isRequired,
  forest: PropTypes.number.isRequired,
  grassland: PropTypes.number.isRequired,
  mountain: PropTypes.number.isRequired,
  "impassable mountain": PropTypes.number.isRequired,
}) as PropTypes.Requireable<MovementCosts>

/** Full piece schema */
export type Piece = {
  id: string
  q: number
  r: number
  type: string
  vision: number
  move: number
  movesLeft: number
  abilities: Abilities
  stats?: Stats
  movementCosts: MovementCosts
}
export const piecePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  q: PropTypes.number.isRequired,
  r: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  vision: PropTypes.number.isRequired,
  move: PropTypes.number.isRequired,
  movesLeft: PropTypes.number.isRequired,
  abilities: abilitiesPropType.isRequired,
  stats: statsPropType,
  movementCosts: movementCostsPropType.isRequired,
}) as PropTypes.Requireable<Piece>

/** Default piece with all current properties */
export const defaultFriendlyPiece: Piece = {
  id: "",
  q: 0,
  r: 0,
  type: "",
  vision: 1,
  move: 2,
  movesLeft: 2,
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
}
