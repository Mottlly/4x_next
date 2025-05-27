import React from "react";
import { endTurnStyles } from "@/library/styles";

// A sci-fi–styled circular "Next Turn" button with neon glow
export default function NextTurnButton({ currentTurn, onNext }) {
  return (
    <div className={endTurnStyles.container}>
      <button
        onClick={onNext}
        className={endTurnStyles.button}
      >
        <span className={endTurnStyles.turnText}>
          Turn: {currentTurn}{" "}
        </span>
      </button>
      <style jsx>{`
        .neon-circle {
          border: 2px solid rgba(0, 255, 255, 0.6);
          box-shadow: 0 0 8px rgba(0, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
}
