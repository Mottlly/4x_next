/**
 * @param {number} tileHeight - The height of the current tile
 * @param {number[]} neighborHeights - Array of 6 neighbor heights [n1, n2, n3, n4, n5, n6]
 * @param {number} threshold - Minimum difference to consider "lower"
 * @returns {boolean[]} - Array of 6 booleans: true if vertex [a-f] should slope down
 */
export default function whichVerticesShouldSlope(
  tileHeight,
  neighborHeights,
  threshold = 0.1
) {
  // Vertices: a b c d e f
  // Each vertex is between two neighbors:
  // a: between n1 and n6
  // b: between n1 and n2
  // c: between n2 and n3
  // d: between n3 and n4
  // e: between n4 and n5
  // f: between n5 and n6

  return [
    neighborHeights[0] !== null &&
      tileHeight - neighborHeights[0] > threshold &&
      neighborHeights[5] !== null &&
      tileHeight - neighborHeights[5] > threshold, // a
    neighborHeights[0] !== null &&
      tileHeight - neighborHeights[0] > threshold &&
      neighborHeights[1] !== null &&
      tileHeight - neighborHeights[1] > threshold, // b
    neighborHeights[1] !== null &&
      tileHeight - neighborHeights[1] > threshold &&
      neighborHeights[2] !== null &&
      tileHeight - neighborHeights[2] > threshold, // c
    neighborHeights[2] !== null &&
      tileHeight - neighborHeights[2] > threshold &&
      neighborHeights[3] !== null &&
      tileHeight - neighborHeights[3] > threshold, // d
    neighborHeights[3] !== null &&
      tileHeight - neighborHeights[3] > threshold &&
      neighborHeights[4] !== null &&
      tileHeight - neighborHeights[4] > threshold, // e
    neighborHeights[4] !== null &&
      tileHeight - neighborHeights[4] > threshold &&
      neighborHeights[5] !== null &&
      tileHeight - neighborHeights[5] > threshold, // f
  ];
}
