import React from "react";
import TextOverlay from "./TextOverlay";
import TutorialSystem, { useTutorial } from "./TutorialSystem";

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
      size: "medium"
    },
    {
      title: "Resource Panel",
      content: "Keep an eye on your resources here. You'll need to manage food, production, and other resources to expand your civilization.",
      position: "top-right",
      size: "small"
    },
    {
      title: "Actions Menu", 
      content: "Use this menu to perform various actions like building settlements, moving units, or managing your civilization.",
      position: "bottom-right",
      size: "medium"
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

  return (
    <div style={{ padding: "20px" }}>
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
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p>Tutorial Status: {tutorial.hasCompleted ? "Completed" : "Not Started"}</p>
        <p>Tutorial Active: {tutorial.isActive ? "Yes" : "No"}</p>
      </div>

      {/* Tutorial System */}
      <TutorialSystem
        steps={tutorial.steps}
        isActive={tutorial.isActive}
        onComplete={tutorial.completeTutorial}
        onSkip={tutorial.skipTutorial}
        allowSkip={true}
        theme="game"
      />

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
