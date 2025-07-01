import React from "react";
import TextOverlay from "./TextOverlay";
import TutorialSystem, { useTutorial } from "./TutorialSystem";
import TutorialHighlight, { useTutorialHighlight } from "./TutorialHighlight";

/**
 * Example component showing how to use TextOverlay and TutorialSystem
 */
export default function ExampleTutorialUsage() {
  // Example tutorial steps
  const gameTutorialSteps = [
    {
      title: "Welcome to the Game!",
      content: "This tutorial will guide you through the basics of playing the game. You can navigate using the Previous/Next buttons or use your arrow keys.",
      position: "center",
      size: "medium"
    },
    {
      title: "The Game Board",
      content: "This is the hex-based game board where all the action happens. Each tile represents different terrain types with various resources and strategic value.",
      position: "top-left",
      size: "medium",
      highlightTarget: ".hex-board", // CSS selector for game board
      highlightProps: {
        highlightColor: "#3b82f6", // Blue highlight for board
        borderWidth: 4
      }
    },
    {
      title: "Resource Management",
      content: "Keep an eye on your resources here. You'll need to manage food, production, and other resources to expand your civilization.",
      position: "bottom-center",
      size: "medium",
      highlightId: "resource-panel", // ID of resource panel
      highlightProps: {
        highlightColor: "#ef4444", // Red highlight
        animated: true,
        offset: 6
      }
    },
    {
      title: "Actions Menu", 
      content: "Use this menu to perform various actions like building settlements, moving units, or managing your civilization.",
      position: "bottom-left",
      size: "medium",
      highlightTarget: "[data-component='actions-menu']", // Data attribute selector
      highlightProps: {
        highlightColor: "#059669", // Green highlight
        borderWidth: 3
      }
    },
    {
      title: "Tutorial Complete!",
      content: "You're ready to start playing! Remember, you can access help and settings from the main menu at any time.",
      position: "center",
      size: "medium"
    }
  ];

  // Use the tutorial hook
  const tutorial = useTutorial("game_basics", gameTutorialSteps);

  // Example of using individual TextOverlay
  const [showNotification, setShowNotification] = React.useState(false);
  const [showWelcome, setShowWelcome] = React.useState(false);

  // Example of using individual highlight
  const resourceHighlight = useTutorialHighlight("#resource-panel");

  return (
    <div style={{ padding: "20px", minHeight: "100vh" }}>
      <h1>Tutorial System Demo</h1>
      
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button 
          onClick={tutorial.startTutorial}
          disabled={tutorial.isActive}
          style={{
            padding: "10px 20px",
            backgroundColor: "#059669",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: tutorial.isActive ? "not-allowed" : "pointer"
          }}
        >
          Start Game Tutorial
        </button>

        <button 
          onClick={() => setShowWelcome(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white", 
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Show Welcome Message
        </button>

        <button 
          onClick={() => setShowNotification(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f59e0b",
            color: "white",
            border: "none", 
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Show Notification
        </button>

        <button 
          onClick={tutorial.resetTutorial}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px", 
            cursor: "pointer"
          }}
        >
          Reset Tutorial
        </button>

        <button 
          onClick={resourceHighlight.toggleHighlight}
          style={{
            padding: "10px 20px",
            backgroundColor: "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "6px", 
            cursor: "pointer"
          }}
        >
          Toggle Resource Highlight
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p>Tutorial Status: {tutorial.hasCompleted ? "Completed" : "Not Started"}</p>
        <p>Tutorial Active: {tutorial.isActive ? "Yes" : "No"}</p>
        <p>Resource Highlight: {resourceHighlight.isActive ? "Active" : "Inactive"}</p>
      </div>

      {/* Mock Game UI Elements for demonstration */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {/* Mock Resource Panel */}
        <div 
          id="resource-panel"
          style={{
            background: "#1f2937",
            color: "white",
            padding: "16px",
            borderRadius: "8px",
            minWidth: "200px"
          }}
        >
          <h3>Resources</h3>
          <div>Food: 100</div>
          <div>Material: 50</div>
          <div>Weapons: 25</div>
        </div>

        {/* Mock Game Board */}
        <div 
          className="hex-board"
          style={{
            background: "#374151",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "300px",
            minHeight: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div>🗺️ Game Board</div>
        </div>

        {/* Mock Actions Menu */}
        <div 
          data-component="actions-menu"
          style={{
            background: "#065f46",
            color: "white",
            padding: "16px",
            borderRadius: "8px",
            minWidth: "150px"
          }}
        >
          <h3>Actions</h3>
          <button style={{ display: "block", margin: "8px 0", padding: "4px 8px" }}>Build</button>
          <button style={{ display: "block", margin: "8px 0", padding: "4px 8px" }}>Move</button>
          <button style={{ display: "block", margin: "8px 0", padding: "4px 8px" }}>Trade</button>
        </div>
      </div>

      {/* Tutorial System */}
      <TutorialSystem
        steps={tutorial.steps}
        isActive={tutorial.isActive}
        onComplete={tutorial.completeTutorial}
        onSkip={tutorial.skipTutorial}
        allowSkip={true}
        theme="game"
        defaultHighlightProps={{
          animated: true,
          borderWidth: 3,
          offset: 6
        }}
      />

      {/* Individual highlight example */}
      <resourceHighlight.TutorialHighlight />

      {/* Example standalone welcome overlay */}
      <TextOverlay
        isVisible={showWelcome}
        title="Welcome Back!"
        content="Great to see you again. Ready for another adventure?"
        position="center"
        size="medium"
        theme="light"
        hasCloseButton={true}
        onClose={() => setShowWelcome(false)}
        animation="scale"
      />

      {/* Example notification overlay */}
      <TextOverlay
        isVisible={showNotification}
        title="Achievement Unlocked!"
        content="You have successfully demonstrated the text overlay system!"
        position="top-right"
        size="small"
        theme="dark"
        hasCloseButton={true}
        onClose={() => setShowNotification(false)}
        autoHide={true}
        autoHideDelay={3000}
        animation="slide"
      />
    </div>
  );
}
