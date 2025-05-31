import { v4 as uuidv4 } from "uuid";

export function generateGoodyHuts(spawnableTiles, min = 3, max = 6) {
  const goodyHutCount = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...spawnableTiles].sort(() => 0.5 - Math.random());
  return Array.from({ length: goodyHutCount }).map((_, i) => ({
    id: uuidv4(),
    type: "goodyHut",
    q: shuffled[i].q,
    r: shuffled[i].r,
  }));
}
