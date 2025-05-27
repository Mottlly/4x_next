import React from "react";
import { actionDetails } from "../../../library/utililies/game/gamePieces/actionsDictator";
import { actionsMenuStyles } from "@/library/styles";

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
    <div className={actionsMenuStyles.container}>
      <div className={actionsMenuStyles.actionsRow}>
        {availableActions.map((action) => {
          const { icon: Icon, tooltip, buttonClass } = actionDetails[action];
          const isActive = activeAction === action;
          return (
            <div key={action} className="relative">
              <button
                onClick={() => onActionClick(action)}
                title={tooltip}
                className={`
                  ${actionsMenuStyles.button}
                  ${buttonClass}
                  ${isActive ? actionsMenuStyles.active : ""}
                `}
              >
                <Icon className={actionsMenuStyles.icon} />
              </button>
              {action === "build" && isActive && (
                <div className={actionsMenuStyles.buildMenu}>
                  {buildOptions.map(
                    ({ key, label, icon: OptIcon, buttonClass }) => (
                      <button
                        key={key}
                        onClick={() => onBuildOptionClick(key)}
                        title={label}
                        className={`
                          ${actionsMenuStyles.buildButton}
                          ${buttonClass}
                        `}
                      >
                        <OptIcon className={actionsMenuStyles.buildIcon} />
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
