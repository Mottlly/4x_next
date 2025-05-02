import React from "react";

// A sci-fi–styled circular "Next Turn" button with neon glow
export default function NextTurnButton({ currentTurn, onNext }) {
  return (
    <div className="absolute bottom-4 right-4 z-20">
      <button
        onClick={onNext}
        className="neon-circle w-24 h-24 flex flex-col items-center justify-center rounded-full bg-[rgba(10,10,30,0.85)] text-cyan-200 font-mono uppercase hover:text-white transition"
      >
        <span className="text-[0.6rem] font-bold leading-none">
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
