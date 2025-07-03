export const compendiumStyles = {
  overlay: "fixed inset-0 bg-black bg-opacity-90 flex z-50",
  leftPanel: "w-1/3 bg-slate-800 border-r border-slate-600 flex flex-col",
  rightPanel: "flex-1 bg-slate-900 flex flex-col",

  // Header styles
  header: "p-4 border-b border-slate-600 bg-slate-900",
  title: "text-2xl font-bold text-cyan-300",
  closeButton: "text-slate-400 hover:text-white transition-colors",

  // Search and filter styles
  searchContainer: "relative mb-4",
  searchIcon:
    "absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400",
  searchInput:
    "w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500",
  filterToggle:
    "flex items-center gap-2 text-slate-300 hover:text-white transition-colors",
  filterContainer: "mt-3 space-y-3",
  filterLabel: "block text-xs font-medium text-slate-400 mb-1",
  filterSelect:
    "w-full px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-cyan-500",
  resetButton: "text-xs text-cyan-400 hover:text-cyan-300 transition-colors",
  resultsCount: "mt-3 text-sm text-slate-400",

  // Entry list styles
  entryList: "flex-1 overflow-y-auto",
  entryItem:
    "p-4 border-b border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors",
  entryItemSelected:
    "p-4 border-b border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors bg-slate-700 border-l-4 border-l-cyan-500",
  entryHeader: "flex items-center justify-between mb-2",
  entryName: "font-semibold text-white",
  entryBadge: "text-xs text-slate-400 bg-slate-600 px-2 py-1 rounded",
  entryDescription: "text-sm text-slate-300 line-clamp-2",

  // Empty state
  emptyState: "p-8 text-center text-slate-400",
  emptyIcon: "mx-auto mb-4 opacity-50",

  // Detail panel styles
  detailHeader: "p-6 border-b border-slate-600",
  detailTitle: "text-3xl font-bold text-white mb-2",
  detailBadges: "flex gap-2",
  primaryBadge:
    "px-3 py-1 bg-cyan-600 text-cyan-100 rounded-full text-sm font-medium",
  secondaryBadge: "px-3 py-1 bg-slate-600 text-slate-100 rounded-full text-sm",
  detailDescription: "text-slate-300 text-lg leading-relaxed",

  // Content grid
  contentGrid: "flex-1 grid grid-cols-2 gap-0",
  previewPanel: "bg-slate-800 border-r border-slate-600",
  statsPanel: "bg-slate-900 overflow-y-auto",

  // Section styles
  sectionHeader: "p-4 border-b border-slate-600",
  sectionTitle: "text-lg font-semibold text-white",
  sectionContent: "p-4",

  // Stats styles
  statsContainer: "space-y-2",
  statItem: "flex justify-between py-2 border-b border-slate-700",
  statLabel: "text-slate-400",
  statValue: "text-white font-medium",

  // Info sections
  infoSection: "mb-6",
  infoTitle: "text-lg font-semibold text-white mb-3",
  infoText: "text-slate-300 leading-relaxed",

  // No selection state
  noSelection: "flex-1 flex items-center justify-center text-slate-400",
  noSelectionContent: "text-center",
  noSelectionTitle: "text-xl font-semibold mb-2",
  noSelectionText: "",
};

export const compendiumButtonStyles = {
  container: "absolute top-4 right-100 z-50 compendium-button",
  button:
    "group relative bg-slate-800 hover:bg-slate-700 border-2 border-cyan-500 hover:border-cyan-400 rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25",
  icon: "text-cyan-300 group-hover:text-cyan-200 transition-colors",
  glow: "absolute inset-0 rounded-full bg-cyan-500 opacity-20 group-hover:opacity-30 transition-opacity blur-sm",
  tooltip:
    "absolute right-full mr-3 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap",
  tooltipArrow:
    "absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 border-r border-t border-slate-600 rotate-45",
};
