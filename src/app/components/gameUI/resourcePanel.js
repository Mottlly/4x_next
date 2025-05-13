import React from "react";
import { Package, Printer, Sword } from "lucide-react";

export default function ResourcePanel({ resources }) {
  return (
    <div className="absolute top-4 right-4 z-10 pointer-events-none">
      <div
        className="
          w-48 p-4
          bg-gray-900 bg-opacity-80 backdrop-blur-sm
          border border-cyan-500 rounded-lg
          shadow-lg ring-2 ring-cyan-400 ring-opacity-50
          font-mono text-cyan-300
          pointer-events-none
        "
      >
        <ul className="grid grid-cols-3 gap-4 text-center">
          <li className="flex flex-col items-center space-y-1">
            <Package className="w-6 h-6 text-cyan-200" />
            <span className="font-semibold">{resources.rations}</span>
          </li>
          <li className="flex flex-col items-center space-y-1">
            <Printer className="w-6 h-6 text-cyan-200" />
            <span className="font-semibold">{resources.printingMaterial}</span>
          </li>
          <li className="flex flex-col items-center space-y-1">
            <Sword className="w-6 h-6 text-cyan-200" />
            <span className="font-semibold">{resources.weapons}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
