import React, { useEffect, useState, useRef } from "react";

/**
 * TutorialHighlight Component - Creates a prominent yellow highlight border around target elements
 *
 * @param {Object} props
 * @param {string} props.targetSelector - CSS selector for the element to highlight
 * @param {string} props.targetId - ID of the element to highlight (alternative to selector)
 * @param {boolean} props.isActive - Whether the highlight should be visible
 * @param {string} props.highlightColor - Color of the highlight border (default: "#fbbf24" - yellow)
 * @param {number} props.borderWidth - Width of the highlight border (default: 5)
 * @param {number} props.offset - Offset from the target element (default: 8)
 * @param {boolean} props.useScreenCenterForBoard - Special mode for hex board: creates a centered highlight covering 70% of screen
 * @param {string} props.borderStyle - Style of the border (default: "solid")
 * @param {number} props.borderRadius - Border radius (default: 12)
 * @param {number} props.zIndex - Z-index of the highlight (default: 9999)
 * @param {boolean} props.animated - Whether to animate the highlight (default: true)
 */
export default function TutorialHighlight({
  targetSelector = null,
  targetId = null,
  isActive = false,
  highlightColor = "#fbbf24",
  borderWidth = 5,
  offset = 8,
  borderStyle = "solid",
  borderRadius = 12,
  zIndex = 9999,
  animated = true,
  useScreenCenterForBoard = false,
}) {
  const [targetElement, setTargetElement] = useState(null);
  const [highlightStyle, setHighlightStyle] = useState({});
  const highlightRef = useRef(null);
  const observerRef = useRef(null);
  const animationRef = useRef(null);

  // Find the target element
  useEffect(() => {
    if (!isActive) {
      setTargetElement(null);
      return;
    }

    const findElement = () => {
      let element = null;

      if (targetId) {
        element = document.getElementById(targetId);
      } else if (targetSelector) {
        element = document.querySelector(targetSelector);
      }

      if (element && element !== targetElement) {
        setTargetElement(element);
      } else if (!element && targetElement) {
        setTargetElement(null);
      }
    };

    // Initial search
    findElement();

    // Set up a mutation observer to watch for DOM changes
    observerRef.current = new MutationObserver(() => {
      findElement();
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isActive, targetSelector, targetId, targetElement]);

  // Update highlight position and size
  useEffect(() => {
    if (!targetElement || !isActive) {
      setHighlightStyle({});
      return;
    }

    const updateHighlight = () => {
      const rect = targetElement.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      // Special handling for hex board - create a centered screen highlight
      if (
        useScreenCenterForBoard &&
        (targetSelector === "#hex-board" ||
          targetId === "hex-board" ||
          targetSelector === ".hex-board" ||
          targetId === "game-board")
      ) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Create a centered highlight covering 70% of screen with 15% margins on each side
        const highlightWidth = viewportWidth * 0.7;
        const highlightHeight = viewportHeight * 0.7;
        const highlightLeft = scrollX + viewportWidth * 0.15;
        const highlightTop = scrollY + viewportHeight * 0.15;

        const style = {
          position: "absolute",
          top: highlightTop,
          left: highlightLeft,
          width: highlightWidth,
          height: highlightHeight,
          border: `${borderWidth}px ${borderStyle} ${highlightColor}`,
          borderRadius: `${borderRadius}px`,
          pointerEvents: "none",
          zIndex: zIndex,
          boxSizing: "border-box",
          transition: animated ? "all 0.3s ease" : "none",
          // Add contained glow effect (all effects stay within highlight bounds)
          boxShadow: `inset 0 0 0 3px ${highlightColor}, inset 0 0 15px ${highlightColor}80, inset 0 0 25px ${highlightColor}60`,
        };

        // Add pulsing animation if enabled
        if (animated) {
          style.animation = "tutorialHighlightPulse 1.5s ease-in-out infinite";
        }

        setHighlightStyle(style);
        return;
      }

      // Normal highlighting logic for other elements
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate desired highlight bounds
      let highlightLeft = rect.left + scrollX - offset;
      let highlightTop = rect.top + scrollY - offset;
      let highlightWidth = rect.width + offset * 2;
      let highlightHeight = rect.height + offset * 2;

      // Basic constraints to prevent scrollbars (less aggressive than before)
      const minLeft = scrollX;
      const minTop = scrollY;
      const maxRight = scrollX + viewportWidth;
      const maxBottom = scrollY + viewportHeight;

      // Only adjust if highlight would go significantly off-screen
      if (highlightLeft < minLeft - 20) {
        highlightLeft = minLeft - 20;
      }
      if (highlightTop < minTop - 20) {
        highlightTop = minTop - 20;
      }
      if (highlightLeft + highlightWidth > maxRight + 20) {
        highlightWidth = Math.max(maxRight + 20 - highlightLeft, rect.width);
      }
      if (highlightTop + highlightHeight > maxBottom + 20) {
        highlightHeight = Math.max(maxBottom + 20 - highlightTop, rect.height);
      }

      const style = {
        position: "absolute",
        top: highlightTop,
        left: highlightLeft,
        width: highlightWidth,
        height: highlightHeight,
        border: `${borderWidth}px ${borderStyle} ${highlightColor}`,
        borderRadius: `${borderRadius}px`,
        pointerEvents: "none",
        zIndex: zIndex,
        boxSizing: "border-box",
        transition: animated ? "all 0.3s ease" : "none",
        // Add glow effect
        boxShadow: `inset 0 0 0 2px ${highlightColor}80, 0 0 15px ${highlightColor}60, 0 0 25px ${highlightColor}40`,
      };

      // Add pulsing animation if enabled
      if (animated) {
        style.animation = "tutorialHighlightPulse 1.5s ease-in-out infinite";
      }

      setHighlightStyle(style);
    };

    // Initial update
    updateHighlight();

    // Update on scroll and resize
    const handleUpdate = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(updateHighlight);
    };

    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    targetElement,
    isActive,
    offset,
    borderWidth,
    borderStyle,
    highlightColor,
    borderRadius,
    zIndex,
    animated,
    useScreenCenterForBoard,
    targetSelector,
    targetId,
  ]);

  // Don't render if not active or no target
  if (!isActive || !targetElement || Object.keys(highlightStyle).length === 0) {
    return null;
  }

  return (
    <>
      {/* Inject CSS for animation if not already present */}
      <style jsx global>{`
        @keyframes tutorialHighlightPulse {
          0% {
            box-shadow: inset 0 0 0 2px ${highlightColor}90,
              0 0 15px ${highlightColor}60, 0 0 25px ${highlightColor}40;
            transform: scale(1);
          }
          50% {
            box-shadow: inset 0 0 0 4px ${highlightColor}60,
              0 0 20px ${highlightColor}80, 0 0 35px ${highlightColor}60;
            transform: scale(1.01);
          }
          100% {
            box-shadow: inset 0 0 0 2px ${highlightColor}90,
              0 0 15px ${highlightColor}60, 0 0 25px ${highlightColor}40;
            transform: scale(1);
          }
        }
      `}</style>

      <div
        ref={highlightRef}
        style={highlightStyle}
        className="tutorial-highlight"
        data-tutorial-highlight="true"
      />
    </>
  );
}

/**
 * Hook for managing tutorial highlights
 *
 * @param {string} targetSelector - CSS selector for target element
 * @param {string} targetId - ID of target element (alternative to selector)
 * @returns {Object} Highlight controls
 */
export function useTutorialHighlight(targetSelector = null, targetId = null) {
  const [isActive, setIsActive] = useState(false);

  const showHighlight = () => setIsActive(true);
  const hideHighlight = () => setIsActive(false);
  const toggleHighlight = () => setIsActive(!isActive);

  return {
    isActive,
    showHighlight,
    hideHighlight,
    toggleHighlight,
    TutorialHighlight: (props) => (
      <TutorialHighlight
        targetSelector={targetSelector}
        targetId={targetId}
        isActive={isActive}
        {...props}
      />
    ),
  };
}
