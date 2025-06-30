# Text Overlay and Tutorial System

This documentation covers the text overlay and tutorial system components that can be used to create in-game tutorials, notifications, and help overlays.

## Components

### 1. TextOverlay

A flexible overlay component for displaying text content over the game interface.

#### Basic Usage

```javascript
import TextOverlay from "@/app/components/gameUI/TextOverlay";

<TextOverlay
  isVisible={true}
  title="Welcome!"
  content="This is a basic text overlay."
  onClose={() => setVisible(false)}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isVisible` | boolean | `false` | Controls overlay visibility |
| `title` | string | `""` | Main title text |
| `content` | string | `""` | Main content text |
| `position` | string | `"center"` | Position: `center`, `top`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `size` | string | `"medium"` | Size: `small`, `medium`, `large`, `fullscreen` |
| `theme` | string | `"game"` | Theme: `dark`, `light`, `game` |
| `hasCloseButton` | boolean | `true` | Show close button |
| `hasNextButton` | boolean | `false` | Show next button |
| `hasPreviousButton` | boolean | `false` | Show previous button |
| `onClose` | function | `null` | Close callback |
| `onNext` | function | `null` | Next callback |
| `onPrevious` | function | `null` | Previous callback |
| `autoHide` | boolean | `false` | Auto hide after timeout |
| `autoHideDelay` | number | `5000` | Auto hide delay in milliseconds |
| `clickOutsideToClose` | boolean | `true` | Close when clicking outside |
| `animation` | string | `"fade"` | Animation: `fade`, `slide`, `scale` |
| `customStyles` | object | `{}` | Custom style overrides |
| `children` | ReactNode | `null` | Custom content instead of title/content |

#### Examples

**Simple Notification:**
```javascript
<TextOverlay
  isVisible={showNotification}
  title="Achievement Unlocked!"
  content="You completed your first tutorial!"
  position="top-right"
  size="small"
  autoHide={true}
  autoHideDelay={3000}
  onClose={() => setShowNotification(false)}
/>
```

**Custom Content:**
```javascript
<TextOverlay
  isVisible={showCustom}
  position="center"
  onClose={() => setShowCustom(false)}
>
  <div>
    <h2>Custom Content</h2>
    <p>You can put any React content here!</p>
    <button onClick={doSomething}>Action Button</button>
  </div>
</TextOverlay>
```

### 2. TutorialSystem

A component that manages a sequence of tutorial steps using TextOverlay.

#### Basic Usage

```javascript
import TutorialSystem, { useTutorial } from "@/app/components/gameUI/TutorialSystem";

const tutorialSteps = [
  {
    title: "Step 1",
    content: "This is the first step",
    position: "center"
  },
  {
    title: "Step 2", 
    content: "This is the second step",
    position: "top-right"
  }
];

function MyComponent() {
  const tutorial = useTutorial("my_tutorial", tutorialSteps);
  
  return (
    <div>
      <button onClick={tutorial.startTutorial}>
        Start Tutorial
      </button>
      
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
tutorial.isActive        // boolean - is tutorial currently running
tutorial.hasCompleted   // boolean - has user completed this tutorial
tutorial.startTutorial() // function - start the tutorial
tutorial.completeTutorial() // function - mark as completed
tutorial.skipTutorial()  // function - skip and mark as completed
tutorial.resetTutorial() // function - reset completion status
tutorial.steps          // array - the tutorial steps
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
    button: { backgroundColor: "#00ff00" }
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
