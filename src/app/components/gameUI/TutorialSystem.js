import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TextOverlay from "./TextOverlay";
import TutorialHighlight from "./TutorialHighlight";

/**
 * TutorialSystem Component - Manages a sequence of tutorial steps
 *
 * @param {Object} props
 * @param {Array} props.steps - Array of tutorial step objects with optional highlight properties
 * @param {boolean} props.isActive - Whether the tutorial is currently active
 * @param {Function} props.onComplete - Callback when tutorial is completed
 * @param {Function} props.onSkip - Callback when tutorial is skipped
 * @param {boolean} props.allowSkip - Whether the tutorial can be skipped
 * @param {string} props.theme - Theme for overlays ('dark', 'light', 'game')
 * @param {Object} props.defaultOverlayProps - Default props to pass to all overlays
 * @param {Object} props.defaultHighlightProps - Default props to pass to all highlights
 * 
 * Step object structure:
 * {
 *   title: string,
 *   content: string,
 *   position?: string,
 *   size?: string,
 *   overlayProps?: object,
 *   highlightTarget?: string, // CSS selector for element to highlight
 *   highlightId?: string, // Element ID to highlight (alternative to selector)
 *   highlightProps?: object, // Custom highlight properties
 *   showHighlight?: boolean // Whether to show highlight for this step (default: true if target specified)
 * }
 */
export default function TutorialSystem({
  steps = [],
  isActive = false,
  onComplete = null,
  onSkip = null,
  allowSkip = true,
  theme = "game",
  defaultOverlayProps = {},
  defaultHighlightProps = {},
}) {
  const { t } = useTranslation("common");
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Show tutorial when activated
  useEffect(() => {
    if (isActive && steps.length > 0) {
      setCurrentStep(0);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isActive, steps.length]);

  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tutorial completed
      setIsVisible(false);
      if (onComplete) onComplete();
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle close/skip
  const handleClose = () => {
    if (allowSkip) {
      setIsVisible(false);
      if (onSkip) onSkip();
    }
  };

  // Don't render if no steps or not active
  if (!isActive || steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // Determine if we should show highlight for current step
  const shouldShowHighlight = currentStepData && (
    currentStepData.showHighlight !== false && 
    (currentStepData.highlightTarget || currentStepData.highlightId)
  );

  // Get step progress text
  const getProgressText = () => {
    return t(
      "tutorial.progress",
      `Step ${currentStep + 1} of ${steps.length}`,
      {
        current: currentStep + 1,
        total: steps.length,
      }
    );
  };

  return (
    <>
      {/* Tutorial Highlight */}
      {shouldShowHighlight && (
        <TutorialHighlight
          targetSelector={currentStepData.highlightTarget}
          targetId={currentStepData.highlightId}
          isActive={isVisible}
          {...defaultHighlightProps}
          {...(currentStepData.highlightProps || {})}
        />
      )}

      {/* Tutorial Overlay */}
      <TextOverlay
        isVisible={isVisible}
        title={currentStepData.title}
        content={
          <div>
            <div
              style={{ marginBottom: "12px", fontSize: "0.875rem", opacity: 0.7 }}
            >
              {getProgressText()}
            </div>
            <div>{currentStepData.content}</div>
          </div>
        }
        position={currentStepData.position || "center"}
        size={currentStepData.size || "medium"}
        theme={theme}
        hasCloseButton={allowSkip}
        hasNextButton={true}
        hasPreviousButton={!isFirstStep}
        nextButtonText={
          isLastStep ? t("tutorial.finish", "Finish") : t("tutorial.next", "Next")
        }
        previousButtonText={t("tutorial.previous", "Previous")}
        closeButtonText={
          allowSkip ? t("tutorial.skip", "Skip Tutorial") : undefined
        }
        onNext={handleNext}
        onPrevious={!isFirstStep ? handlePrevious : null}
        onClose={allowSkip ? handleClose : null}
        clickOutsideToClose={false}
        transparentBackdrop={true}
        animation="slide"
        customStyles={{
          container: {
            userSelect: "none",
          },
        }}
        {...defaultOverlayProps}
        {...currentStepData.overlayProps}
      />
    </>
  );
}

/**
 * Hook for managing tutorial state
 *
 * @param {string} tutorialId - Unique identifier for the tutorial
 * @param {Array} steps - Tutorial steps
 * @param {boolean} autoStart - Whether to automatically start tutorial if not completed
 * @returns {Object} Tutorial state and controls
 */
export function useTutorial(tutorialId, steps = [], autoStart = false) {
  const [isActive, setIsActive] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Check if tutorial was already completed and auto-start if needed
  useEffect(() => {
    const completed = localStorage.getItem(`tutorial_${tutorialId}_completed`);
    const isCompleted = completed === "true";
    setHasCompleted(isCompleted);

    // Auto-start tutorial if not completed and autoStart is true
    if (!isCompleted && autoStart && steps.length > 0) {
      // Small delay to ensure the game is fully loaded
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [tutorialId, autoStart, steps.length]);

  const startTutorial = () => {
    if (!hasCompleted) {
      setIsActive(true);
    }
  };

  const completeTutorial = () => {
    setIsActive(false);
    setHasCompleted(true);
    localStorage.setItem(`tutorial_${tutorialId}_completed`, "true");
  };

  const skipTutorial = () => {
    setIsActive(false);
    setHasCompleted(true);
    localStorage.setItem(`tutorial_${tutorialId}_completed`, "true");
  };

  const resetTutorial = () => {
    setHasCompleted(false);
    localStorage.removeItem(`tutorial_${tutorialId}_completed`);
  };

  return {
    isActive,
    hasCompleted,
    startTutorial,
    completeTutorial,
    skipTutorial,
    resetTutorial,
    steps,
  };
}
