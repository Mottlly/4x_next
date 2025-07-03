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
  colony_settlement: [
    {
      key: "advanced_agriculture",
      label: "Advanced Agriculture",
      description: "Increases food production significantly.",
      cost: { rations: 2, printingMaterial: 4, weapons: 0 },
      duration: 3,
      upkeep: { rations: -1 },
      effect: { rations: 3 },
    },
    {
      key: "manufacturing_hub",
      label: "Manufacturing Hub",
      description: "Boosts printing material production.",
      cost: { rations: 1, printingMaterial: 6, weapons: 1 },
      duration: 4,
      upkeep: { printingMaterial: -2 },
      effect: { printingMaterial: 4 },
    },
    {
      key: "fortified_walls",
      label: "Fortified Walls",
      description: "Provides strong defensive capabilities.",
      cost: { rations: 3, printingMaterial: 5, weapons: 4 },
      duration: 5,
      upkeep: { rations: -2 },
      effect: { defense: 4 },
    },
  ],
  // Add more for other settlement types
};
