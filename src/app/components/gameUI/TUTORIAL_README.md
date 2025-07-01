# Tutorial System with Highlighting

An enhanced tutorial system for React applications that provides guided tutorials with optional element highlighting capabilities.

## Features

- **Step-by-step tutorials** with navigation controls
- **Element highlighting** with customizable yellow borders around UI components
- **Responsive design** that works across different screen sizes
- **Automatic positioning** that follows elements even when scrolling or resizing
- **Keyboard navigation** support (Arrow keys, Enter, Escape)
- **Persistent state** using localStorage
- **Multiple positioning options** for overlays
- **Customizable themes** and styling
- **Animation support** with pulsing highlights

## Components

### TutorialSystem

Main component for managing tutorial sequences with automatic highlighting.

### TutorialHighlight

Standalone component for highlighting specific UI elements.

### TextOverlay

Flexible overlay component for displaying tutorial content.

## Basic Usage

### 1. Simple Tutorial with Highlighting

```jsx
import TutorialSystem, { useTutorial } from "./TutorialSystem";

const steps = [
  {
    title: "Welcome!",
    content: "This is your first tutorial step.",
    position: "center",
    size: "medium",
  },
  {
    title: "Resource Panel",
    content: "This panel shows your vital resources.",
    position: "bottom-center",
    size: "medium",
    highlightId: "resource-panel", // Highlights element with this ID
    highlightProps: {
      highlightColor: "#ef4444",
      animated: true,
    },
  },
];

function MyComponent() {
  const tutorial = useTutorial("my_tutorial", steps, true); // auto-start

  return (
    <div>
      <div id="resource-panel">Resource Panel Content</div>

      <TutorialSystem
        steps={tutorial.steps}
        isActive={tutorial.isActive}
        onComplete={tutorial.completeTutorial}
        onSkip={tutorial.skipTutorial}
      />
    </div>
  );
}
```

### 2. Tutorial with Different Highlight Targets

```jsx
const advancedSteps = [
  {
    title: "Game Board",
    content: "This is where the action happens.",
    highlightTarget: ".game-board", // CSS selector
    highlightProps: {
      highlightColor: "#3b82f6", // Blue highlight
      borderWidth: 4,
    },
  },
  {
    title: "Actions Menu",
    content: "Use this menu for game actions.",
    highlightTarget: "[data-component='actions-menu']", // Data attribute
    highlightProps: {
      highlightColor: "#059669", // Green highlight
      animated: true,
      offset: 8,
    },
  },
];
```

## Step Configuration

Each tutorial step supports the following properties:

```jsx
{
  // Required
  title: "Step Title",
  content: "Step description text",

  // Optional Overlay Properties
  position: "center", // center, top, bottom, top-left, top-right, bottom-left, bottom-right
  size: "medium", // small, medium, large, fullscreen
  overlayProps: {}, // Additional props for TextOverlay

  // Optional Highlight Properties
  highlightTarget: ".css-selector", // CSS selector for target element
  highlightId: "element-id", // Element ID (alternative to selector)
  showHighlight: true, // Whether to show highlight (default: true if target specified)
  highlightProps: {
    highlightColor: "#fbbf24", // Border color (default: yellow)
    borderWidth: 5, // Border thickness (default: 5)
    offset: 12, // Distance from element (default: 12)
    animated: true, // Enable pulsing animation (default: true)
    borderRadius: 12, // Border radius (default: 12)
    zIndex: 9999 // Z-index (default: 9999)
  }
}
```

## Targeting Elements

### Method 1: Element ID

```jsx
// Add ID to your component
<div id="resource-panel">...</div>

// Reference in tutorial step
{
  title: "Resources",
  content: "Manage your resources here.",
  highlightId: "resource-panel"
}
```

### Method 2: CSS Class

```jsx
// Add class to your component
<div className="game-board">...</div>

// Reference in tutorial step
{
  title: "Game Board",
  content: "This is the game board.",
  highlightTarget: ".game-board"
}
```

### Method 3: Data Attributes

```jsx
// Add data attribute to your component
<div data-component="actions-menu">...</div>

// Reference in tutorial step
{
  title: "Actions",
  content: "Access game actions here.",
  highlightTarget: "[data-component='actions-menu']"
}
```

## Tutorial Content with React Components

You can use React components and JSX directly in tutorial steps for rich content with icons, formatting, and interactive elements:

```jsx
import { Flag, Package, Printer, Sword } from "lucide-react";

const tutorialSteps = [
  {
    title: "Resource Management",
    content: (
      <div>
        <p style={{ marginBottom: "16px" }}>
          This panel shows your vital resources. You&apos;ll need to manage
          these carefully:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Flag size={20} style={{ color: "#60a5fa" }} />
            <span>
              <strong>Outpost Capacity:</strong> Current outposts vs. maximum
              limit
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Package size={20} style={{ color: "#34d399" }} />
            <span>
              <strong>Rations:</strong> Food for your population
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Printer size={20} style={{ color: "#fbbf24" }} />
            <span>
              <strong>Printing Material:</strong> Construction resources
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sword size={20} style={{ color: "#f87171" }} />
            <span>
              <strong>Weapons:</strong> Defense resources
            </span>
          </div>
        </div>
      </div>
    ),
    position: "bottom-center",
    size: "large",
    highlightId: "resource-panel",
  },
];
```

### Benefits of Rich Content

- **Icons**: Visual representation helps users identify resources quickly
- **Formatting**: Bold text, colors, and spacing improve readability
- **Consistency**: Use the same icons as your actual UI components
- **Accessibility**: Proper contrast and sizing for better user experience

#### Tutorial Step Object

```javascript
{
  title: "Step Title",
  content: "Step content text",
  position: "center", // Optional, defaults to center
  size: "medium",     // Optional, defaults to medium
  overlayProps: {}    // Optional, additional props for TextOverlay
}
```

#### useTutorial Hook

The `useTutorial` hook provides state management for tutorials:

```javascript
const tutorial = useTutorial("tutorial_id", steps);

// Available properties and methods:
tutorial.isActive; // boolean - is tutorial currently running
tutorial.hasCompleted; // boolean - has user completed this tutorial
tutorial.startTutorial(); // function - start the tutorial
tutorial.completeTutorial(); // function - mark as completed
tutorial.skipTutorial(); // function - skip and mark as completed
tutorial.resetTutorial(); // function - reset completion status
tutorial.steps; // array - the tutorial steps
```

## Styling and Themes

### Built-in Themes

- **`game`**: Dark theme with game-appropriate styling
- **`dark`**: Clean dark theme
- **`light`**: Clean light theme

### Custom Styling

You can override styles using the `customStyles` prop:

```javascript
<TextOverlay
  customStyles={{
    backdrop: { backgroundColor: "rgba(255, 0, 0, 0.5)" },
    container: { borderRadius: "20px" },
    title: { color: "#ff0000" },
    button: { backgroundColor: "#00ff00" },
  }}
/>
```

### Available Style Overrides

- `backdrop` - The background overlay
- `container` - Main content container
- `title` - Title text
- `content` - Content text
- `buttonContainer` - Button container
- `button` - All buttons
- `closeButton` - Close button specifically
- `nextButton` - Next button specifically
- `previousButton` - Previous button specifically

## Keyboard Controls

When an overlay is visible:

- `Escape` - Close overlay
- `Arrow Right` or `Enter` - Next step (if available)
- `Arrow Left` - Previous step (if available)

## Accessibility

The components include:

- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support

## Internationalization

The components support i18next translations. Default keys used:

- `tutorial.close` - Close button text
- `tutorial.next` - Next button text
- `tutorial.previous` - Previous button text
- `tutorial.finish` - Finish button text
- `tutorial.skip` - Skip button text
- `tutorial.progress` - Progress indicator text

## Examples

See `ExampleTutorialUsage.js` for complete working examples of:

- Basic tutorial sequences
- Standalone notifications
- Custom styling
- Different positions and animations

## Best Practices

1. **Keep tutorial steps concise** - Users want to start playing, not read novels
2. **Use appropriate positioning** - Position overlays near relevant UI elements
3. **Allow skipping** - Not everyone needs tutorials
4. **Persist completion state** - Don't show the same tutorial repeatedly
5. **Test on different screen sizes** - Ensure overlays work on mobile/tablet
6. **Use appropriate themes** - Match your game's visual style

## Preventing Scrollbars

The highlight system includes automatic viewport boundary detection to prevent unwanted scrollbars:

- **Automatic boundary detection**: Highlights stay within the current viewport
- **Smart positioning**: If an offset would push the highlight off-screen, it's automatically adjusted
- **Responsive constraints**: Works across different screen sizes and orientations
- **Smooth transitions**: Positioning adjustments use smooth animations

### How It Works

```javascript
// The system automatically:
// 1. Detects viewport boundaries
// 2. Calculates if highlight would overflow
// 3. Adjusts position and size to fit within bounds
// 4. Maintains visual impact while preventing scroll issues

// No configuration needed - it works automatically!
```

### Best Practices for Scroll Prevention

1. **Use reasonable offsets**: Keep offset values between 4-12px for most cases
2. **Test on mobile**: Smaller screens are more prone to overflow
3. **Consider element positioning**: Elements near screen edges need smaller offsets
4. **Monitor performance**: Viewport calculations are optimized but still have minimal overhead
