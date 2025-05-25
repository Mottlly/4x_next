import { toast } from "react-hot-toast";

export function handleGoodyHutCollect({
  tile,
  pieces,
  neutralPieces,
  setBoard,
  setResources,
}) {
  // Find if a goody hut is present on this tile
  const hut = neutralPieces.find(
    (p) => p.type === "goodyHut" && p.q === tile.q && p.r === tile.r
  );
  if (!hut) return;

  // Determine reward (weighted random)
  const roll = Math.random();
  let rewardType, rewardAmount;
  if (roll < 0.6) {
    rewardType = "rations";
    rewardAmount = Math.floor(Math.random() * 6) + 5; // 5-10
  } else if (roll < 0.9) {
    rewardType = "printingMaterial";
    rewardAmount = Math.floor(Math.random() * 3) + 2; // 2-4
  } else {
    rewardType = "weapons";
    rewardAmount = Math.floor(Math.random() * 2) + 1; // 1-2
  }

  // Remove the hut from the board and update resources
  setBoard((prev) => ({
    ...prev,
    neutralPieces: prev.neutralPieces.filter((p) => p.id !== hut.id),
  }));
  setResources((prev) => ({
    ...prev,
    [rewardType]: prev[rewardType] + rewardAmount,
  }));

  // Show a toast notification
  toast.success(`You found ${rewardAmount} ${rewardType}!`);
}
