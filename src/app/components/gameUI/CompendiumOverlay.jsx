import React, { useState, useMemo } from "react";
import { Search, X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { compendiumData } from "@/library/utililies/game/compendium/compendiumData";
import CompendiumPreview from "@/library/utililies/game/compendium/CompendiumPreview";
import { compendiumStyles } from "@/library/styles/gameUI/compendiumStyles";

/**
 * Compendium Overlay - A searchable database of all game pieces, structures, and terrain
 * Features:
 * - Search by name or description
 * - Filter by category and subcategory
 * - Detailed stats and game effects
 * - 3D preview of each entry
 * - Sortable entries
 */
export default function CompendiumOverlay({ isVisible, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories and subcategories for filters
  const categories = useMemo(() => {
    const cats = [
      "All",
      ...new Set(compendiumData.map((item) => item.category)),
    ];
    return cats.sort();
  }, []);

  const subcategories = useMemo(() => {
    if (selectedCategory === "All") {
      return [
        "All",
        ...new Set(compendiumData.map((item) => item.subcategory)),
      ];
    }
    const filtered = compendiumData.filter(
      (item) => item.category === selectedCategory
    );
    return ["All", ...new Set(filtered.map((item) => item.subcategory))];
  }, [selectedCategory]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = compendiumData;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.gameEffects.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by subcategory
    if (selectedSubcategory !== "All") {
      filtered = filtered.filter(
        (item) => item.subcategory === selectedSubcategory
      );
    }

    // Sort data
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedSubcategory, sortBy, sortOrder]);

  // Handle sort change
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedSubcategory("All");
    setSortBy("name");
    setSortOrder("asc");
  };

  if (!isVisible) return null;

  return (
    <div className={compendiumStyles.overlay}>
      {/* Left Panel - Entry List */}
      <div className={compendiumStyles.leftPanel}>
        {/* Header */}
        <div className={compendiumStyles.header}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={compendiumStyles.title}>Game Compendium</h2>
            <button
              onClick={onClose}
              className={compendiumStyles.closeButton}
              title="Close Compendium"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search Bar */}
          <div className={compendiumStyles.searchContainer}>
            <Search className={compendiumStyles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={compendiumStyles.searchInput}
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={compendiumStyles.filterToggle}
          >
            <Filter size={16} />
            Filters
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className={compendiumStyles.filterContainer}>
              <div>
                <label className={compendiumStyles.filterLabel}>Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory("All");
                  }}
                  className={compendiumStyles.filterSelect}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={compendiumStyles.filterLabel}>
                  Subcategory
                </label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className={compendiumStyles.filterSelect}
                >
                  {subcategories.map((subcat) => (
                    <option key={subcat} value={subcat}>
                      {subcat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className={compendiumStyles.filterLabel}>
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={compendiumStyles.filterSelect}
                  >
                    <option value="name">Name</option>
                    <option value="category">Category</option>
                    <option value="subcategory">Subcategory</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className={compendiumStyles.filterLabel}>Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className={compendiumStyles.filterSelect}
                  >
                    <option value="asc">A-Z</option>
                    <option value="desc">Z-A</option>
                  </select>
                </div>
              </div>

              <button
                onClick={resetFilters}
                className={compendiumStyles.resetButton}
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className={compendiumStyles.resultsCount}>
            {filteredData.length}{" "}
            {filteredData.length === 1 ? "entry" : "entries"}
          </div>
        </div>

        {/* Entry List */}
        <div className={compendiumStyles.entryList}>
          {filteredData.map((entry) => (
            <div
              key={entry.id}
              onClick={() => setSelectedEntry(entry)}
              className={
                selectedEntry?.id === entry.id
                  ? compendiumStyles.entryItemSelected
                  : compendiumStyles.entryItem
              }
            >
              <div className={compendiumStyles.entryHeader}>
                <h3 className={compendiumStyles.entryName}>{entry.name}</h3>
                <span className={compendiumStyles.entryBadge}>
                  {entry.subcategory}
                </span>
              </div>
              <p className={compendiumStyles.entryDescription}>
                {entry.description}
              </p>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className={compendiumStyles.emptyState}>
              <Search size={48} className={compendiumStyles.emptyIcon} />
              <p>No entries found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Entry Details */}
      <div className={compendiumStyles.rightPanel}>
        {selectedEntry ? (
          <>
            {/* Entry Header */}
            <div className={compendiumStyles.detailHeader}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className={compendiumStyles.detailTitle}>
                    {selectedEntry.name}
                  </h1>
                  <div className={compendiumStyles.detailBadges}>
                    <span className={compendiumStyles.primaryBadge}>
                      {selectedEntry.category}
                    </span>
                    <span className={compendiumStyles.secondaryBadge}>
                      {selectedEntry.subcategory}
                    </span>
                  </div>
                </div>
              </div>
              <p className={compendiumStyles.detailDescription}>
                {selectedEntry.description}
              </p>
            </div>

            {/* Content Grid */}
            <div className={compendiumStyles.contentGrid}>
              {/* 3D Preview */}
              <div className={compendiumStyles.previewPanel}>
                <div className={compendiumStyles.sectionHeader}>
                  <h3 className={compendiumStyles.sectionTitle}>3D Preview</h3>
                </div>
                <div className="h-80">
                  <CompendiumPreview
                    modelType={selectedEntry.modelType}
                    modelData={selectedEntry.modelData}
                  />
                </div>
              </div>

              {/* Stats and Info */}
              <div className={compendiumStyles.statsPanel}>
                <div className={compendiumStyles.sectionContent}>
                  {/* Game Effects */}
                  <div className={compendiumStyles.infoSection}>
                    <h3 className={compendiumStyles.infoTitle}>Game Effects</h3>
                    <p className={compendiumStyles.infoText}>
                      {selectedEntry.gameEffects}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className={compendiumStyles.infoSection}>
                    <h3 className={compendiumStyles.infoTitle}>Statistics</h3>
                    <div className={compendiumStyles.statsContainer}>
                      {Object.entries(selectedEntry.stats).map(
                        ([key, value]) => (
                          <div key={key} className={compendiumStyles.statItem}>
                            <span className={compendiumStyles.statLabel}>
                              {key}
                            </span>
                            <span className={compendiumStyles.statValue}>
                              {value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Abilities */}
                  {selectedEntry.abilities && (
                    <div className={compendiumStyles.infoSection}>
                      <h3 className={compendiumStyles.infoTitle}>Abilities</h3>
                      <p className={compendiumStyles.infoText}>
                        {selectedEntry.abilities}
                      </p>
                    </div>
                  )}

                  {/* Movement Costs */}
                  {selectedEntry.movementCosts && (
                    <div className={compendiumStyles.infoSection}>
                      <h3 className={compendiumStyles.infoTitle}>
                        Movement Costs
                      </h3>
                      <p className={compendiumStyles.infoText}>
                        {selectedEntry.movementCosts}
                      </p>
                    </div>
                  )}

                  {/* Upkeep */}
                  {selectedEntry.upkeep && (
                    <div className={compendiumStyles.infoSection}>
                      <h3 className={compendiumStyles.infoTitle}>
                        Upkeep Costs
                      </h3>
                      <p className={compendiumStyles.infoText}>
                        {selectedEntry.upkeep}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* No Selection State */
          <div className={compendiumStyles.noSelection}>
            <div className={compendiumStyles.noSelectionContent}>
              <Search size={64} className="mx-auto mb-4 opacity-50" />
              <h3 className={compendiumStyles.noSelectionTitle}>
                Select an entry to view details
              </h3>
              <p className={compendiumStyles.noSelectionText}>
                Choose an item from the list on the left to see its stats,
                description, and 3D preview.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
