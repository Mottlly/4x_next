import { ArrowRight, Sword, Hammer, Shield, Eye } from "lucide-react";

export const allowedActionsByType = {
  Pod: ["move", "build"],
  Scout: ["move", "attack", "fortify", "scout"],
  Engineer: ["move", "build", "fortify"],
  Armed_Settler: ["move", "fortify", "build"],
  Security: ["move", "attack", "fortify"],
};

export const actionDetails = {
  move: {
    icon: ArrowRight,
    tooltip: "Move",
    buttonClass: "hover:bg-blue-700 border-blue-500",
  },
  attack: {
    icon: Sword,
    tooltip: "Attack",
    buttonClass: "hover:bg-red-700 border-red-500",
  },
  build: {
    icon: Hammer,
    tooltip: "Build",
    buttonClass: "hover:bg-yellow-700 border-yellow-500",
  },
  fortify: {
    icon: Shield,
    tooltip: "Fortify",
    buttonClass: "hover:bg-green-700 border-green-500",
  },
  scout: {
    icon: Eye,
    tooltip: "Scout",
    buttonClass: "hover:bg-indigo-700 border-indigo-500",
  },
};
