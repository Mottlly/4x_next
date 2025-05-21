import React from "react";
import { actionDetails } from "../../../library/utililies/game/gamePieces/actionsDictator";

export default function ActionsMenu({
  selectedPiece,
  availableActions,
  activeAction,
  onActionClick,
  buildOptions,
  onBuildOptionClick,
}) {
  if (!selectedPiece) return null;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-row items-start space-x-4 pointer-events-none">
      <div className="pointer-events-auto flex flex-row space-x-2 mt-0 ml-0">
        {availableActions.map((action) => {
          const { icon: Icon, tooltip, buttonClass } = actionDetails[action];
          const isActive = activeAction === action;
          return (
            <div key={action} className="relative">
              <button
                onClick={() => onActionClick(action)}
                title={tooltip}
                className={`flex items-center justify-center w-12 h-12 bg-gray-800 bg-opacity-80 ${buttonClass} ${
                  isActive ? "ring-2 ring-offset-2 ring-white" : ""
                } rounded-lg transition`}
              >
                <Icon className="w-6 h-6 text-cyan-200" />
              </button>
              {action === "build" && isActive && (
                <div className="absolute top-full left-0 mt-2 flex flex-row space-x-2 bg-gray-900 bg-opacity-90 p-2 rounded-lg z-20">
                  {buildOptions.map(
                    ({ key, label, icon: OptIcon, buttonClass }) => (
                      <button
                        key={key}
                        onClick={() => onBuildOptionClick(key)}
                        title={label}
                        className={`flex items-center justify-center w-10 h-10 bg-gray-800 bg-opacity-80 ${buttonClass} rounded-lg transition`}
                      >
                        <OptIcon className="w-5 h-5 text-white" />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
