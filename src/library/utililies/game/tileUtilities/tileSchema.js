import PropTypes from "prop-types";

/*Valid tile types*/
export const tileTypes = [
  "water",
  "lake",
  "plains",
  "grassland",
  "forest",
  "mountain",
  "impassable mountain",
];

/*Schema for a single tile in the map.*/
export const tilePropType = PropTypes.shape({
  q: PropTypes.number.isRequired, // axial q-coordinate
  r: PropTypes.number.isRequired, // axial r-coordinate
  type: PropTypes.oneOf(tileTypes).isRequired,
  height: PropTypes.number.isRequired, // discrete height/elevation for rendering
  elevationLevel: PropTypes.number.isRequired, // raw elevation bucket (1–5)
  discovered: PropTypes.bool.isRequired, // visibility state
  riverPresent: PropTypes.bool.isRequired, // whether the tile has a river
});

/*A default tile template you can spread into your generated maps or use for tests*/
export const defaultTile = {
  q: 0,
  r: 0,
  type: "water",
  height: 1,
  elevationLevel: 1,
  discovered: false,
  riverPresent: false,
};
