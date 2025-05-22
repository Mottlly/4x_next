export const settlementUpgradeOptions = {
  reconstructed_shelter: [
    {
      key: "solar_array",
      label: "Solar Array",
      description: "Produces extra printing material.",
      cost: { rations: 0, printingMaterial: 5, weapons: 0 },
      duration: 3, // turns
      upkeep: { rations: -1 }, // extra upkeep while building
      effect: { printingMaterial: 2 }, // permanent effect after completion
    },
    {
      key: "defense_turret",
      label: "Defense Turret",
      description: "Improves defense of the settlement.",
      cost: { rations: 1, printingMaterial: 3, weapons: 3 },
      duration: 4,
      upkeep: { rations: -2 },
      effect: { defense: 2 },
    },
  ],
  // Add more for other settlement types
};
