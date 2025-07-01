import React, { useEffect, useState, useRef } from "react";

/**
 * TutorialHighlight Component - Creates a red highlight border around target elements
 * 
 * @param {Object} props
 * @param {string} props.targetSelector - CSS selector for the element to highlight
 * @param {string} props.targetId - ID of the element to highlight (alternative to selector)
 * @param {boolean} props.isActive - Whether the highlight should be visible
 * @param {string} props.highlightColor - Color of the highlight border (default: "#ef4444")
 * @param {number} props.borderWidth - Width of the highlight border (default: 3)
 * @param {number} props.offset - Offset from the target element (default: 4)
 * @param {string} props.borderStyle - Style of the border (default: "solid")
 * @param {number} props.borderRadius - Border radius (default: 8)
 * @param {number} props.zIndex - Z-index of the highlight (default: 9999)
 * @param {boolean} props.animated - Whether to animate the highlight (default: true)
 */
export default function TutorialHighlight({
  targetSelector = null,
  targetId = null,
  isActive = false,
  highlightColor = "#ef4444",
  borderWidth = 3,
  offset = 4,
  borderStyle = "solid",
  borderRadius = 8,
  zIndex = 9999,
  animated = true,
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

      const style = {
        position: "absolute",
        top: rect.top + scrollY - offset,
        left: rect.left + scrollX - offset,
        width: rect.width + (offset * 2),
        height: rect.height + (offset * 2),
        border: `${borderWidth}px ${borderStyle} ${highlightColor}`,
        borderRadius: `${borderRadius}px`,
        pointerEvents: "none",
        zIndex: zIndex,
        boxSizing: "border-box",
        transition: animated ? "all 0.3s ease" : "none",
      };

      // Add pulsing animation if enabled
      if (animated) {
        style.animation = "tutorialHighlightPulse 2s ease-in-out infinite";
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
  }, [targetElement, isActive, offset, borderWidth, borderStyle, highlightColor, borderRadius, zIndex, animated]);

  // Don't render if not active or no target
  if (!isActive || !targetElement || Object.keys(highlightStyle).length === 0) {
    return null;
  }

  return (
    <>
      {/* Inject CSS for animation if not already present */}
      <style jsx global>{`
        @keyframes tutorialHighlightPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 ${highlightColor}40;
          }
          50% {
            box-shadow: 0 0 0 8px ${highlightColor}20;
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
