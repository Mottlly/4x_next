export const settlementPanelStyles = {
  container: `
    absolute bottom-4 right-4 z-20
    w-96 p-4
    bg-gray-900 bg-opacity-90
    border border-yellow-500
    rounded-lg shadow-lg
    text-white
  `,
  header: "flex justify-between items-center mb-3",
  title: "text-lg font-bold",
  closeButton: "text-2xl leading-none",
  grid: "grid grid-cols-2 gap-4",
  sectionTitle: "font-semibold mb-2 text-sm",
  unitButton: (canAfford) =>
    `w-full py-1 px-2 rounded text-xs flex flex-row items-center ${
      canAfford
        ? "bg-green-600 hover:bg-green-700"
        : "bg-gray-700 cursor-not-allowed opacity-60"
    }`,
  unitLabel: "font-medium text-center w-full",
  unitCosts: "flex flex-row items-center gap-2 mt-0.5 opacity-80",
  costItem: "inline-flex items-center gap-0.5",
  upgradeButton: (canAfford) =>
    `w-full py-1 px-2 rounded text-sm flex flex-col items-center mb-1 ${
      canAfford
        ? "bg-blue-700 hover:bg-blue-800"
        : "bg-gray-700 cursor-not-allowed opacity-60"
    }`,
  upgradeLabel: "font-medium text-center w-full",
  upgradeCosts: "flex flex-row items-center gap-2 mt-0.5 opacity-80",
  upgradeInProgress: "text-yellow-300",
  allUpgradesBuilt: "text-gray-400 text-xs",
};