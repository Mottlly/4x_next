export const resourcePanelStyles = {
  container: "absolute top-4 right-4 z-10 pointer-events-none",
  panel: `
    w-60 p-4
    bg-gray-900 bg-opacity-80 backdrop-blur-sm
    border border-cyan-500 rounded-lg
    shadow-lg ring-2 ring-cyan-400 ring-opacity-50
    font-mono text-cyan-300
    pointer-events-none
  `,
  list: "grid grid-cols-3 gap-4 text-center",
  item: "flex flex-col items-center space-y-1",
  icon: "w-6 h-6 text-cyan-200",
  value: "font-semibold",
};
