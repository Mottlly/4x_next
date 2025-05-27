export const actionsMenuStyles = {
  container:
    "absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-row items-start space-x-4 pointer-events-none",
  actionsRow: "pointer-events-auto flex flex-row space-x-2 mt-0 ml-0",
  button: `
    flex items-center justify-center w-12 h-12 bg-gray-800 bg-opacity-80
    rounded-lg transition
  `,
  active: "ring-2 ring-offset-2 ring-white",
  buildMenu:
    "absolute top-full left-0 mt-2 flex flex-row space-x-2 bg-gray-900 bg-opacity-90 p-2 rounded-lg z-20",
  buildButton: `
    flex items-center justify-center w-10 h-10 bg-gray-800 bg-opacity-80
    rounded-lg transition
  `,
  icon: "w-6 h-6 text-cyan-200",
  buildIcon: "w-5 h-5 text-white",
};
