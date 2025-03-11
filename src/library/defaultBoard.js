const boardData = {
  rows: 25,
  cols: 25,
  spacing: 1.05, // Controls overall hex size & placement
  tiles: [
    // Large green landmass (forest)
    { q: 5, r: 5, type: "forest" },
    { q: 5, r: 6, type: "forest" },
    { q: 6, r: 5, type: "forest" },
    { q: 6, r: 6, type: "forest" },
    { q: 7, r: 5, type: "forest" },
    { q: 7, r: 6, type: "forest" },
    { q: 8, r: 5, type: "forest" },
    { q: 8, r: 6, type: "forest" },
    { q: 9, r: 5, type: "forest" },
    { q: 9, r: 6, type: "forest" },
    { q: 10, r: 5, type: "forest" },
    { q: 10, r: 6, type: "forest" },

    // Large yellow landmass (desert)
    { q: 15, r: 15, type: "desert" },
    { q: 15, r: 16, type: "desert" },
    { q: 16, r: 15, type: "desert" },
    { q: 16, r: 16, type: "desert" },
    { q: 17, r: 15, type: "desert" },
    { q: 17, r: 16, type: "desert" },
    { q: 18, r: 15, type: "desert" },
    { q: 18, r: 16, type: "desert" },
    { q: 19, r: 15, type: "desert" },
    { q: 19, r: 16, type: "desert" },
    { q: 20, r: 15, type: "desert" },
    { q: 20, r: 16, type: "desert" },
  ],
};

export default boardData;
