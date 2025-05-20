export default function getColourForType(type) {
  switch (type) {
    case "water":
      return "#4169E1";
    case "lake":
      return "#007BA7";
    case "forest":
      return "#228B22";
    case "plains":
      return "#F5F5DC"; // soft beige for open plains
    case "mountain":
      return "#A9A9A9";
    case "grassland":
      return "#90EE90";
    default:
      return "#CCCCCC";
  }
}
