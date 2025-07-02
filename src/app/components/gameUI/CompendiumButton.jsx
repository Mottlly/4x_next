import React from "react";
import { HelpCircle } from "lucide-react";
import { compendiumButtonStyles } from "@/library/styles/gameUI/compendiumStyles";

/**
 * Compendium Button - A question mark button that opens the game compendium
 * Positioned in the game UI for easy access
 */
export default function CompendiumButton({ onClick, className = "" }) {
  return (
    <div className={`${compendiumButtonStyles.container} ${className}`}>
      <button
        onClick={onClick}
        className={compendiumButtonStyles.button}
        title="Open Game Compendium"
        aria-label="Open Game Compendium"
      >
        <HelpCircle 
          size={24} 
          className={compendiumButtonStyles.icon}
        />
        
        {/* Glow effect */}
        <div className={compendiumButtonStyles.glow}></div>
        
        {/* Tooltip */}
        <div className={compendiumButtonStyles.tooltip}>
          Game Compendium
          <div className={compendiumButtonStyles.tooltipArrow}></div>
        </div>
      </button>
    </div>
  );
}
