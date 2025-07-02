import { useState, useEffect, useMemo } from "react";

/**
 * Custom hook to detect victory conditions and track game statistics
 * @param {Object} board - Current board state
 * @param {Array} pieces - Current friendly pieces
 * @param {number} currentTurn - Current turn number
 * @returns {Object} - Victory state and game statistics
 */
export default function useVictoryDetection(board, pieces, currentTurn) {
  const [gameStats, setGameStats] = useState({
    turnsPlayed: 0,
    totalPiecesBuilt: 0,
    settlementsBuilt: 0,
    resourcesGathered: 0,
    hostilesPieces: 0,
    hostileFortressesDestroyed: 0,
    gameStartTime: Date.now(),
  });

  const [isVictorious, setIsVictorious] = useState(false);
  const [victoryDetected, setVictoryDetected] = useState(false);

  // Check victory condition: no hostile fortresses remaining
  const hostileFortresses = useMemo(() => {
    return (board.hostilePieces || []).filter(
      (piece) => piece.type === "hostileFortress"
    );
  }, [board.hostilePieces]);

  const hasWon = hostileFortresses.length === 0;

  // Detect victory state change
  useEffect(() => {
    if (hasWon && !victoryDetected) {
      setIsVictorious(true);
      setVictoryDetected(true);
      console.log("🎉 VICTORY ACHIEVED! All hostile fortresses destroyed!");
    }
  }, [hasWon, victoryDetected]);

  // Update game statistics
  useEffect(() => {
    const settlementsBuilt = (board.tiles || []).filter(
      (tile) =>
        tile.building &&
        [
          "reconstructed_shelter",
          "resource_extractor",
          "sensor_suite",
        ].includes(tile.building)
    ).length;

    const totalResources = (board.resources || [0, 0, 0]).reduce(
      (sum, resource) => sum + resource,
      0
    );

    const hostileRaiders = (board.hostilePieces || []).filter(
      (piece) => piece.type === "Raider"
    ).length;

    setGameStats((prev) => ({
      ...prev,
      turnsPlayed: currentTurn,
      totalPiecesBuilt: pieces.length,
      settlementsBuilt,
      resourcesGathered: totalResources,
      hostilesPieces: hostileRaiders,
      hostileFortressesDestroyed: Math.max(0, 1 - hostileFortresses.length), // Assuming started with 1 fortress
    }));
  }, [board, pieces, currentTurn, hostileFortresses.length]);

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    const efficiency =
      currentTurn > 0
        ? Math.max(1, Math.min(5, 6 - Math.floor(currentTurn / 10)))
        : 5;
    const expansion = Math.min(5, gameStats.settlementsBuilt);
    const survival = pieces.length > 0 ? 5 : 1;

    return {
      efficiency,
      expansion,
      survival,
      overall: Math.round((efficiency + expansion + survival) / 3),
    };
  }, [currentTurn, gameStats.settlementsBuilt, pieces.length]);

  return {
    isVictorious,
    hasWon,
    gameStats: {
      ...gameStats,
      ...performanceMetrics,
    },
    hostileFortressCount: hostileFortresses.length,
    resetVictory: () => {
      setIsVictorious(false);
      setVictoryDetected(false);
    },
  };
}
